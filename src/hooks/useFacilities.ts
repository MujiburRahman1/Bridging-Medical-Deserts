import { useState, useEffect, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Facility, DashboardStats, RegionStats, Alert, MapMarker } from "@/types/healthcare";

// Sample coordinates for regions (in production, these would come from geocoding)
const REGION_COORDINATES: Record<string, { lat: number; lng: number }> = {
  "Northern Region": { lat: 9.4, lng: -0.85 },
  "Southern Region": { lat: 5.6, lng: -0.18 },
  "Eastern Region": { lat: 6.7, lng: -0.45 },
  "Western Region": { lat: 5.1, lng: -1.98 },
  "Central Region": { lat: 5.5, lng: -1.05 },
  "Greater Accra": { lat: 5.55, lng: -0.2 },
  "Ashanti Region": { lat: 6.75, lng: -1.52 },
  "Volta Region": { lat: 6.6, lng: 0.47 },
  "Upper East": { lat: 10.75, lng: -0.85 },
  "Upper West": { lat: 10.35, lng: -2.28 },
};

export function useFacilities() {
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFacilities = async () => {
    setLoading(true);
    try {
      const { data, error: fetchError } = await supabase
        .from("healthcare_facilities")
        .select("*")
        .order("created_at", { ascending: false });

      if (fetchError) throw fetchError;
      setFacilities(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch facilities");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFacilities();
  }, []);

  // Compute dashboard statistics
  const stats: DashboardStats = useMemo(() => {
    const alerts: Alert[] = [];
    let incompleteRecords = 0;
    let suspiciousClaims = 0;

    facilities.forEach((facility) => {
      // Check for incomplete data
      if (!facility.equipment || facility.equipment === "None" || !facility.specialties) {
        incompleteRecords++;
      }

      // Check for suspicious claims (e.g., surgical specialty but no equipment)
      const hasSurgicalClaim = 
        facility.specialties?.toLowerCase().includes("surg") ||
        facility.procedures?.toLowerCase().includes("surg");
      const hasNoEquipment = 
        !facility.equipment || 
        facility.equipment.toLowerCase() === "none" ||
        facility.equipment.trim() === "";

      if (hasSurgicalClaim && hasNoEquipment) {
        suspiciousClaims++;
        alerts.push({
          id: `alert-${facility.id}`,
          type: "warning",
          title: "Equipment Mismatch",
          description: `${facility.name} claims surgical capabilities but reports no equipment`,
          region: facility.region || undefined,
          facilityId: facility.id,
          timestamp: new Date(),
        });
      }
    });

    // Count unique regions and find medical deserts
    const regionCounts = new Map<string, number>();
    facilities.forEach((f) => {
      if (f.region) {
        regionCounts.set(f.region, (regionCounts.get(f.region) || 0) + 1);
      }
    });

    // Regions with very few facilities are "medical deserts"
    const medicalDeserts = Array.from(regionCounts.entries())
      .filter(([_, count]) => count < 2)
      .length;

    // Add alerts for regions with critical gaps
    regionCounts.forEach((count, region) => {
      if (count < 2) {
        alerts.push({
          id: `desert-${region}`,
          type: "critical",
          title: "Medical Desert Detected",
          description: `${region} has severely limited healthcare access (${count} facility)`,
          region,
          timestamp: new Date(),
        });
      }
    });

    return {
      totalFacilities: facilities.length,
      medicalDeserts,
      incompleteRecords,
      suspiciousClaims,
      regionsWithGaps: medicalDeserts,
      criticalAlerts: alerts.slice(0, 10), // Limit to 10 most recent
    };
  }, [facilities]);

  // Compute region statistics
  const regionStats: RegionStats[] = useMemo(() => {
    const regionMap = new Map<string, RegionStats>();

    facilities.forEach((facility) => {
      const region = facility.region || "Unknown";
      const existing = regionMap.get(region) || {
        region,
        totalFacilities: 0,
        withCardiac: 0,
        withEmergency: 0,
        withSurgical: 0,
        incompleteData: 0,
        suspiciousClaims: 0,
        coverageScore: 0,
      };

      existing.totalFacilities++;
      
      if (facility.specialties?.toLowerCase().includes("cardiac") ||
          facility.specialties?.toLowerCase().includes("cardio")) {
        existing.withCardiac++;
      }
      
      if (facility.specialties?.toLowerCase().includes("emergency") ||
          facility.procedures?.toLowerCase().includes("emergency")) {
        existing.withEmergency++;
      }
      
      if (facility.specialties?.toLowerCase().includes("surg") ||
          facility.procedures?.toLowerCase().includes("surg")) {
        existing.withSurgical++;
      }

      if (!facility.equipment || facility.equipment === "None") {
        existing.incompleteData++;
      }

      regionMap.set(region, existing);
    });

    // Calculate coverage scores
    return Array.from(regionMap.values()).map((stats) => ({
      ...stats,
      coverageScore: Math.round(
        ((stats.withCardiac > 0 ? 25 : 0) +
          (stats.withEmergency > 0 ? 35 : 0) +
          (stats.withSurgical > 0 ? 25 : 0) +
          (stats.incompleteData < stats.totalFacilities * 0.3 ? 15 : 0))
      ),
    }));
  }, [facilities]);

  // Generate map markers
  const mapMarkers: MapMarker[] = useMemo(() => {
    return facilities.map((facility, index) => {
      const regionCoords = REGION_COORDINATES[facility.region || "Central Region"] || 
        { lat: 7.9, lng: -1.05 };
      
      // Add slight offset for multiple facilities in same region
      const offset = (index % 10) * 0.1;
      
      let status: MapMarker["status"] = "operational";
      if (!facility.equipment || facility.equipment === "None") {
        status = "incomplete";
      } else if (
        (facility.specialties?.toLowerCase().includes("surg") ||
          facility.procedures?.toLowerCase().includes("surg")) &&
        (!facility.equipment || facility.equipment.toLowerCase() === "none")
      ) {
        status = "suspicious";
      }

      return {
        id: facility.id,
        name: facility.name,
        lat: regionCoords.lat + offset - 0.25,
        lng: regionCoords.lng + offset - 0.25,
        type: facility.name.toLowerCase().includes("clinic") ? "clinic" : "hospital",
        status,
        specialties: facility.specialties?.split(",").map((s) => s.trim()) || [],
        equipment: facility.equipment?.split(",").map((e) => e.trim()) || [],
        region: facility.region || "Unknown",
      };
    });
  }, [facilities]);

  return {
    facilities,
    loading,
    error,
    stats,
    regionStats,
    mapMarkers,
    refetch: fetchFacilities,
  };
}
