import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { MapPin, Heart, Stethoscope, Scissors } from "lucide-react";
import type { RegionStats } from "@/types/healthcare";
import { cn } from "@/lib/utils";

interface RegionOverviewProps {
  regions: RegionStats[];
  onSelectRegion?: (region: string) => void;
}

function getCoverageColor(score: number): string {
  if (score >= 75) return "text-success";
  if (score >= 50) return "text-amber-500";
  return "text-destructive";
}

function getCoverageLabel(score: number): string {
  if (score >= 75) return "Good";
  if (score >= 50) return "Limited";
  return "Critical";
}

export function RegionOverview({ regions, onSelectRegion }: RegionOverviewProps) {
  const sortedRegions = [...regions].sort((a, b) => a.coverageScore - b.coverageScore);

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-display flex items-center gap-2">
          <MapPin className="h-5 w-5 text-muted-foreground" />
          Regional Coverage
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-4">
          {sortedRegions.map((region) => (
            <div
              key={region.region}
              className={cn(
                "p-3 rounded-lg border border-border transition-colors",
                onSelectRegion && "cursor-pointer hover:border-primary/30 hover:bg-muted/50"
              )}
              onClick={() => onSelectRegion?.(region.region)}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-sm text-foreground">
                    {region.region}
                  </span>
                  <Badge variant="outline" className="text-xs">
                    {region.totalFacilities} facilities
                  </Badge>
                </div>
                <span
                  className={cn(
                    "text-xs font-semibold",
                    getCoverageColor(region.coverageScore)
                  )}
                >
                  {getCoverageLabel(region.coverageScore)}
                </span>
              </div>
              
              <Progress 
                value={region.coverageScore} 
                className="h-2 mb-3"
              />
              
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Heart className="h-3 w-3" />
                  <span>{region.withCardiac} cardiac</span>
                </div>
                <div className="flex items-center gap-1">
                  <Stethoscope className="h-3 w-3" />
                  <span>{region.withEmergency} emergency</span>
                </div>
                <div className="flex items-center gap-1">
                  <Scissors className="h-3 w-3" />
                  <span>{region.withSurgical} surgical</span>
                </div>
              </div>
              
              {region.incompleteData > 0 && (
                <p className="text-xs text-amber-600 mt-2">
                  ⚠️ {region.incompleteData} with incomplete data
                </p>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
