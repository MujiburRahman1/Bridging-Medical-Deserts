import { useState } from "react";
import {
  Building2,
  MapPin,
  Phone,
  Globe,
  Stethoscope,
  Wrench,
  Scissors,
  AlertTriangle,
  FileText,
  ExternalLink,
  X,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import type { Facility } from "@/types/healthcare";
import { cn } from "@/lib/utils";

interface FacilityDetailProps {
  facility: Facility | null;
  isOpen: boolean;
  onClose: () => void;
}

export function FacilityDetail({ facility, isOpen, onClose }: FacilityDetailProps) {
  if (!facility) return null;

  // Detect suspicious claims
  const hasSurgicalClaim =
    facility.specialties?.toLowerCase().includes("surg") ||
    facility.procedures?.toLowerCase().includes("surg");
  const hasNoEquipment =
    !facility.equipment ||
    facility.equipment.toLowerCase() === "none" ||
    facility.equipment.trim() === "";
  const isSuspicious = hasSurgicalClaim && hasNoEquipment;
  const isIncomplete = hasNoEquipment || !facility.specialties;

  const specialtiesList = facility.specialties?.split(",").map((s) => s.trim()).filter(Boolean) || [];
  const proceduresList = facility.procedures?.split(",").map((p) => p.trim()).filter(Boolean) || [];
  const equipmentList = facility.equipment?.split(",").map((e) => e.trim()).filter(Boolean) || [];

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="w-full sm:max-w-lg">
        <SheetHeader className="pb-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-primary/10">
                <Building2 className="h-6 w-6 text-primary" />
              </div>
              <div>
                <SheetTitle className="text-left">{facility.name}</SheetTitle>
                <p className="text-sm text-muted-foreground mt-0.5">
                  {facility.region || "Unknown Region"}
                </p>
              </div>
            </div>
          </div>
          
          {/* Status badges */}
          <div className="flex flex-wrap gap-2 mt-3">
            {isSuspicious && (
              <Badge variant="destructive" className="gap-1">
                <AlertTriangle className="h-3 w-3" />
                Suspicious Claims
              </Badge>
            )}
            {isIncomplete && !isSuspicious && (
              <Badge variant="secondary" className="gap-1">
                <FileText className="h-3 w-3" />
                Incomplete Data
              </Badge>
            )}
            {!isSuspicious && !isIncomplete && (
              <Badge className="gap-1 bg-success text-success-foreground">
                Verified
              </Badge>
            )}
          </div>
        </SheetHeader>

        <ScrollArea className="h-[calc(100vh-200px)] pr-4">
          <div className="space-y-6">
            {/* Suspicious alert */}
            {isSuspicious && (
              <Card className="border-destructive/50 bg-destructive/5">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-destructive text-sm">
                        Equipment Mismatch Detected
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        This facility claims surgical capabilities but reports no medical equipment.
                        This may indicate incomplete data or inaccurate reporting.
                      </p>
                      <p className="text-xs text-muted-foreground mt-2 italic">
                        Citation: specialties field contains "surgical" while equipment field is empty or "None"
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Contact info */}
            <div className="space-y-3">
              <h4 className="font-medium text-sm text-foreground">Contact Information</h4>
              <div className="space-y-2">
                <div className="flex items-center gap-3 text-sm">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">
                    {facility.region || "Location not specified"}
                  </span>
                </div>
                {facility.phone && (
                  <div className="flex items-center gap-3 text-sm">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">{facility.phone}</span>
                  </div>
                )}
                {facility.website && (
                  <div className="flex items-center gap-3 text-sm">
                    <Globe className="h-4 w-4 text-muted-foreground" />
                    <a
                      href={facility.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline flex items-center gap-1"
                    >
                      {facility.website}
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                )}
              </div>
            </div>

            <Separator />

            {/* Specialties */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Stethoscope className="h-4 w-4 text-muted-foreground" />
                <h4 className="font-medium text-sm text-foreground">Specialties</h4>
              </div>
              {specialtiesList.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {specialtiesList.map((specialty, idx) => (
                    <Badge key={idx} variant="secondary" className="text-xs">
                      {specialty}
                    </Badge>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground italic">
                  No specialties listed
                </p>
              )}
            </div>

            <Separator />

            {/* Procedures */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Scissors className="h-4 w-4 text-muted-foreground" />
                <h4 className="font-medium text-sm text-foreground">Procedures</h4>
              </div>
              {proceduresList.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {proceduresList.map((procedure, idx) => (
                    <Badge key={idx} variant="outline" className="text-xs">
                      {procedure}
                    </Badge>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground italic">
                  No procedures listed
                </p>
              )}
            </div>

            <Separator />

            {/* Equipment */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Wrench className="h-4 w-4 text-muted-foreground" />
                <h4 className="font-medium text-sm text-foreground">Equipment</h4>
                {hasNoEquipment && (
                  <Badge variant="destructive" className="text-xs">Missing</Badge>
                )}
              </div>
              {equipmentList.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {equipmentList.map((eq, idx) => (
                    <Badge key={idx} variant="outline" className="text-xs">
                      {eq}
                    </Badge>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground italic">
                  No equipment reported
                </p>
              )}
            </div>

            <Separator />

            {/* Data source */}
            {facility.source_url && (
              <div className="space-y-3">
                <h4 className="font-medium text-sm text-foreground">Data Source</h4>
                <Card className="bg-muted/50">
                  <CardContent className="p-3">
                    <a
                      href={facility.source_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-primary hover:underline flex items-center gap-1"
                    >
                      <FileText className="h-3 w-3" />
                      View original document
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Metadata */}
            <div className="text-xs text-muted-foreground">
              <p>Last updated: {new Date(facility.updated_at).toLocaleDateString()}</p>
              <p className="mt-0.5">ID: {facility.id}</p>
            </div>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
