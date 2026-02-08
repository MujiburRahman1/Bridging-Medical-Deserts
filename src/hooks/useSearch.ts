import { useState, useMemo } from "react";
import type { Facility, SearchFilters } from "@/types/healthcare";

const SEARCH_SUGGESTIONS = [
  "Find hospitals with ICU in Northern Region",
  "Show facilities with cardiac surgery capabilities",
  "List clinics without proper equipment",
  "Which regions lack emergency services?",
  "Find suspicious equipment claims",
  "Facilities with maternal care in rural areas",
  "Show all diagnostic centers",
  "Regions with limited surgical access",
];

export function useSearch(facilities: Facility[]) {
  const [filters, setFilters] = useState<SearchFilters>({ query: "" });
  const [isSearching, setIsSearching] = useState(false);

  // Extract unique values for filter dropdowns
  const filterOptions = useMemo(() => {
    const regions = new Set<string>();
    const specialties = new Set<string>();
    const equipment = new Set<string>();
    const procedures = new Set<string>();

    facilities.forEach((f) => {
      if (f.region) regions.add(f.region);
      f.specialties?.split(",").forEach((s) => specialties.add(s.trim()));
      f.equipment?.split(",").forEach((e) => equipment.add(e.trim()));
      f.procedures?.split(",").forEach((p) => procedures.add(p.trim()));
    });

    return {
      regions: Array.from(regions).filter(Boolean).sort(),
      specialties: Array.from(specialties).filter(Boolean).sort(),
      equipment: Array.from(equipment).filter(Boolean).sort(),
      procedures: Array.from(procedures).filter(Boolean).sort(),
    };
  }, [facilities]);

  // Filter facilities based on search criteria
  const filteredFacilities = useMemo(() => {
    return facilities.filter((facility) => {
      // Query match (searches across all text fields)
      if (filters.query) {
        const queryLower = filters.query.toLowerCase();
        const searchableText = [
          facility.name,
          facility.region,
          facility.specialties,
          facility.equipment,
          facility.procedures,
          facility.capability,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();

        if (!searchableText.includes(queryLower)) {
          return false;
        }
      }

      // Region filter
      if (filters.region && facility.region !== filters.region) {
        return false;
      }

      // Specialty filter
      if (filters.specialty && !facility.specialties?.includes(filters.specialty)) {
        return false;
      }

      // Equipment filter
      if (filters.equipment && !facility.equipment?.includes(filters.equipment)) {
        return false;
      }

      // Procedure filter
      if (filters.procedure && !facility.procedures?.includes(filters.procedure)) {
        return false;
      }

      // Status filter
      if (filters.status) {
        const hasEquipment = facility.equipment && facility.equipment !== "None";
        if (filters.status === "incomplete" && hasEquipment) return false;
        if (filters.status === "complete" && !hasEquipment) return false;
      }

      return true;
    });
  }, [facilities, filters]);

  // Generate auto-suggestions based on query
  const suggestions = useMemo(() => {
    if (!filters.query) return SEARCH_SUGGESTIONS.slice(0, 5);
    
    const queryLower = filters.query.toLowerCase();
    return SEARCH_SUGGESTIONS.filter((s) =>
      s.toLowerCase().includes(queryLower)
    ).slice(0, 5);
  }, [filters.query]);

  const updateFilters = (newFilters: Partial<SearchFilters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  const clearFilters = () => {
    setFilters({ query: "" });
  };

  return {
    filters,
    filteredFacilities,
    filterOptions,
    suggestions,
    isSearching,
    updateFilters,
    clearFilters,
    setIsSearching,
  };
}
