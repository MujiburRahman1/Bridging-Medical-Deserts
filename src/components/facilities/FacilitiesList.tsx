import { Building2, MapPin, AlertTriangle, ChevronRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { Facility } from "@/types/healthcare";
import { cn } from "@/lib/utils";

interface FacilitiesListProps {
  facilities: Facility[];
  onSelectFacility: (facility: Facility) => void;
  selectedId?: string;
  maxHeight?: string;
}

export function FacilitiesList({
  facilities,
  onSelectFacility,
  selectedId,
  maxHeight = "600px",
}: FacilitiesListProps) {
  const getStatusInfo = (facility: Facility) => {
    const hasSurgicalClaim =
      facility.specialties?.toLowerCase().includes("surg") ||
      facility.procedures?.toLowerCase().includes("surg");
    const hasNoEquipment =
      !facility.equipment ||
      facility.equipment.toLowerCase() === "none" ||
      facility.equipment.trim() === "";

    if (hasSurgicalClaim && hasNoEquipment) {
      return { status: "suspicious", label: "Suspicious", variant: "destructive" as const };
    }
    if (hasNoEquipment || !facility.specialties) {
      return { status: "incomplete", label: "Incomplete", variant: "secondary" as const };
    }
    return { status: "complete", label: "Complete", variant: "default" as const };
  };

  return (
    <ScrollArea style={{ maxHeight }} className="pr-2">
      <div className="space-y-2">
        {facilities.map((facility) => {
          const statusInfo = getStatusInfo(facility);
          const isSelected = selectedId === facility.id;

          return (
            <Card
              key={facility.id}
              className={cn(
                "p-4 cursor-pointer transition-all hover:shadow-md",
                isSelected
                  ? "border-primary bg-primary/5"
                  : "hover:border-primary/30"
              )}
              onClick={() => onSelectFacility(facility)}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <div
                    className={cn(
                      "flex items-center justify-center h-10 w-10 rounded-lg shrink-0",
                      statusInfo.status === "suspicious"
                        ? "bg-destructive/10 text-destructive"
                        : statusInfo.status === "incomplete"
                        ? "bg-muted text-muted-foreground"
                        : "bg-primary/10 text-primary"
                    )}
                  >
                    {statusInfo.status === "suspicious" ? (
                      <AlertTriangle className="h-5 w-5" />
                    ) : (
                      <Building2 className="h-5 w-5" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium text-sm text-foreground truncate">
                        {facility.name}
                      </h4>
                      <Badge variant={statusInfo.variant} className="text-xs shrink-0">
                        {statusInfo.label}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <MapPin className="h-3 w-3" />
                      <span>{facility.region || "Unknown"}</span>
                    </div>
                    {facility.specialties && (
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
                        {facility.specialties}
                      </p>
                    )}
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
              </div>
            </Card>
          );
        })}

        {facilities.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Building2 className="h-12 w-12 text-muted-foreground/30 mb-3" />
            <p className="text-sm text-muted-foreground">No facilities found</p>
            <p className="text-xs text-muted-foreground mt-1">
              Try adjusting your search filters
            </p>
          </div>
        )}
      </div>
    </ScrollArea>
  );
}
