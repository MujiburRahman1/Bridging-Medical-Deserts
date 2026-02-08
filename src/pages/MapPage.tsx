import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { HealthcareMap } from "@/components/map/HealthcareMap";
import { FacilityDetail } from "@/components/facilities/FacilityDetail";
import { useFacilities } from "@/hooks/useFacilities";
import { Loader2 } from "lucide-react";
import type { Facility, MapMarker } from "@/types/healthcare";

const MapPage = () => {
  const { facilities, loading, mapMarkers, stats } = useFacilities();
  const [selectedFacility, setSelectedFacility] = useState<Facility | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const handleMarkerClick = (marker: MapMarker) => {
    const facility = facilities.find((f) => f.id === marker.id);
    if (facility) {
      setSelectedFacility(facility);
      setIsDetailOpen(true);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-96">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout alertCount={stats.criticalAlerts.length}>
      <div className="space-y-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">
            Interactive Map
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Visualize healthcare facilities, gaps, and medical deserts
          </p>
        </div>

        <HealthcareMap
          markers={mapMarkers}
          onMarkerClick={handleMarkerClick}
          className="rounded-xl overflow-hidden"
        />

        <FacilityDetail
          facility={selectedFacility}
          isOpen={isDetailOpen}
          onClose={() => setIsDetailOpen(false)}
        />
      </div>
    </DashboardLayout>
  );
};

export default MapPage;
