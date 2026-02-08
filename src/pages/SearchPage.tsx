import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { SearchPanel } from "@/components/search/SearchPanel";
import { FacilitiesList } from "@/components/facilities/FacilitiesList";
import { FacilityDetail } from "@/components/facilities/FacilityDetail";
import { ResponseDisplay } from "@/components/ResponseDisplay";
import { useFacilities } from "@/hooks/useFacilities";
import { useSearch } from "@/hooks/useSearch";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import type { Facility } from "@/types/healthcare";

const SearchPage = () => {
  const { facilities, loading, stats } = useFacilities();
  const {
    filters,
    filteredFacilities,
    filterOptions,
    suggestions,
    updateFilters,
    clearFilters,
  } = useSearch(facilities);
  
  const [selectedFacility, setSelectedFacility] = useState<Facility | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const { toast } = useToast();

  const handleAISearch = async (query: string) => {
    if (!query) return;
    
    setIsAiLoading(true);
    setAiResponse(null);
    
    try {
      const res = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/healthcare-chat`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({ question: query }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to get response");
      }

      setAiResponse(data.answer);
    } catch (error) {
      toast({
        title: "AI Search Error",
        description: error instanceof Error ? error.message : "Failed to search",
        variant: "destructive",
      });
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleSelectFacility = (facility: Facility) => {
    setSelectedFacility(facility);
    setIsDetailOpen(true);
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
            Search & Query
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Natural language search and advanced filtering
          </p>
        </div>

        <SearchPanel
          filters={filters}
          suggestions={suggestions}
          filterOptions={filterOptions}
          resultCount={filteredFacilities.length}
          onUpdateFilters={updateFilters}
          onClearFilters={clearFilters}
          onAISearch={handleAISearch}
        />

        {/* AI Response */}
        {isAiLoading && (
          <Card className="p-8">
            <div className="flex flex-col items-center justify-center gap-4">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">
                AI is analyzing your query...
              </p>
            </div>
          </Card>
        )}

        {aiResponse && !isAiLoading && (
          <ResponseDisplay
            response={aiResponse}
            audioBase64={null}
            facilitiesAnalyzed={filteredFacilities.length}
            isVoiceResponse={false}
          />
        )}

        {/* Facilities list */}
        <div className="grid gap-6 lg:grid-cols-2">
          <div>
            <h2 className="font-display font-semibold text-foreground mb-4">
              Matching Facilities ({filteredFacilities.length})
            </h2>
            <FacilitiesList
              facilities={filteredFacilities}
              onSelectFacility={handleSelectFacility}
              selectedId={selectedFacility?.id}
            />
          </div>

          {/* Quick stats on filtered results */}
          <Card className="p-6 h-fit">
            <h3 className="font-display font-semibold text-foreground mb-4">
              Search Summary
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Total matching</span>
                <span className="font-medium">{filteredFacilities.length}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">With complete data</span>
                <span className="font-medium">
                  {filteredFacilities.filter((f) => f.equipment && f.equipment !== "None").length}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Unique regions</span>
                <span className="font-medium">
                  {new Set(filteredFacilities.map((f) => f.region)).size}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Needs review</span>
                <span className="font-medium text-amber-600">
                  {filteredFacilities.filter(
                    (f) =>
                      (f.specialties?.toLowerCase().includes("surg") ||
                        f.procedures?.toLowerCase().includes("surg")) &&
                      (!f.equipment || f.equipment === "None")
                  ).length}
                </span>
              </div>
            </div>
          </Card>
        </div>

        <FacilityDetail
          facility={selectedFacility}
          isOpen={isDetailOpen}
          onClose={() => setIsDetailOpen(false)}
        />
      </div>
    </DashboardLayout>
  );
};

export default SearchPage;
