import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { FacilitiesList } from "@/components/facilities/FacilitiesList";
import { FacilityDetail } from "@/components/facilities/FacilityDetail";
import { useFacilities } from "@/hooks/useFacilities";
import { Loader2, Building2, AlertTriangle, FileWarning, CheckCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import type { Facility } from "@/types/healthcare";

const FacilitiesPage = () => {
  const { facilities, loading, stats } = useFacilities();
  const [selectedFacility, setSelectedFacility] = useState<Facility | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  // Categorize facilities
  const completeFacilities = facilities.filter(
    (f) => f.equipment && f.equipment !== "None" && f.specialties
  );

  const incompleteFacilities = facilities.filter(
    (f) => !f.equipment || f.equipment === "None" || !f.specialties
  );

  const suspiciousFacilities = facilities.filter(
    (f) =>
      (f.specialties?.toLowerCase().includes("surg") ||
        f.procedures?.toLowerCase().includes("surg")) &&
      (!f.equipment || f.equipment === "None")
  );

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
            Facility Directory
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Browse and review all healthcare facilities
          </p>
        </div>

        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full max-w-lg grid-cols-4">
            <TabsTrigger value="all" className="gap-2">
              <Building2 className="h-4 w-4" />
              All
              <Badge variant="secondary" className="ml-1 text-xs">
                {facilities.length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="complete" className="gap-2">
              <CheckCircle className="h-4 w-4" />
              Complete
              <Badge variant="secondary" className="ml-1 text-xs">
                {completeFacilities.length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="incomplete" className="gap-2">
              <FileWarning className="h-4 w-4" />
              Incomplete
              <Badge variant="secondary" className="ml-1 text-xs">
                {incompleteFacilities.length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="suspicious" className="gap-2">
              <AlertTriangle className="h-4 w-4" />
              Suspicious
              <Badge variant="destructive" className="ml-1 text-xs">
                {suspiciousFacilities.length}
              </Badge>
            </TabsTrigger>
          </TabsList>

          <div className="mt-6">
            <TabsContent value="all">
              <div className="grid gap-6 lg:grid-cols-2">
                <FacilitiesList
                  facilities={facilities}
                  onSelectFacility={handleSelectFacility}
                  selectedId={selectedFacility?.id}
                />
                <Card className="p-6 h-fit lg:sticky lg:top-24">
                  <h3 className="font-display font-semibold mb-4">Quick Stats</h3>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-muted-foreground">By Region</p>
                      <div className="mt-2 space-y-1">
                        {Object.entries(
                          facilities.reduce((acc, f) => {
                            const region = f.region || "Unknown";
                            acc[region] = (acc[region] || 0) + 1;
                            return acc;
                          }, {} as Record<string, number>)
                        )
                          .sort((a, b) => b[1] - a[1])
                          .slice(0, 5)
                          .map(([region, count]) => (
                            <div key={region} className="flex justify-between text-sm">
                              <span>{region}</span>
                              <span className="font-medium">{count}</span>
                            </div>
                          ))}
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="complete">
              <FacilitiesList
                facilities={completeFacilities}
                onSelectFacility={handleSelectFacility}
                selectedId={selectedFacility?.id}
              />
            </TabsContent>

            <TabsContent value="incomplete">
              <Card className="p-4 mb-4 border-amber-200 bg-amber-50">
                <div className="flex items-start gap-3">
                  <FileWarning className="h-5 w-5 text-amber-600 shrink-0" />
                  <div>
                    <p className="font-medium text-amber-800 text-sm">
                      Incomplete Data Warning
                    </p>
                    <p className="text-xs text-amber-700 mt-1">
                      These facilities are missing equipment or specialty information.
                      Consider updating their records for better analysis accuracy.
                    </p>
                  </div>
                </div>
              </Card>
              <FacilitiesList
                facilities={incompleteFacilities}
                onSelectFacility={handleSelectFacility}
                selectedId={selectedFacility?.id}
              />
            </TabsContent>

            <TabsContent value="suspicious">
              <Card className="p-4 mb-4 border-destructive/50 bg-destructive/5">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-destructive shrink-0" />
                  <div>
                    <p className="font-medium text-destructive text-sm">
                      Suspicious Claims Detected
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      These facilities claim surgical or advanced capabilities but report
                      no medical equipment. This may indicate data quality issues or
                      inaccurate reporting.
                    </p>
                  </div>
                </div>
              </Card>
              <FacilitiesList
                facilities={suspiciousFacilities}
                onSelectFacility={handleSelectFacility}
                selectedId={selectedFacility?.id}
              />
            </TabsContent>
          </div>
        </Tabs>

        <FacilityDetail
          facility={selectedFacility}
          isOpen={isDetailOpen}
          onClose={() => setIsDetailOpen(false)}
        />
      </div>
    </DashboardLayout>
  );
};

export default FacilitiesPage;
