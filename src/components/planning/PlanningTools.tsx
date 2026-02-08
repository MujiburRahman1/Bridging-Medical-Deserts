import { useState } from "react";
import {
  Truck,
  Users,
  Package,
  Route,
  Plus,
  Play,
  Download,
  Save,
  CheckCircle,
  Clock,
  FileText,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import type { ResourcePlan, RegionStats } from "@/types/healthcare";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface PlanningToolsProps {
  regions: RegionStats[];
}

const PLAN_TYPES = [
  { value: "mobile-clinic", label: "Deploy Mobile Clinic", icon: Truck },
  { value: "equipment-transfer", label: "Equipment Transfer", icon: Package },
  { value: "staff-allocation", label: "Staff Allocation", icon: Users },
  { value: "patient-routing", label: "Patient Routing", icon: Route },
];

const statusColors = {
  draft: "bg-muted text-muted-foreground",
  pending: "bg-amber-100 text-amber-700",
  approved: "bg-primary/10 text-primary",
  active: "bg-success/10 text-success",
};

export function PlanningTools({ regions }: PlanningToolsProps) {
  const [plans, setPlans] = useState<ResourcePlan[]>([
    {
      id: "1",
      name: "Mobile Clinic - Upper East",
      type: "mobile-clinic",
      targetRegion: "Upper East",
      description: "Deploy mobile clinic with basic diagnostic and emergency capabilities",
      estimatedImpact: "Serve ~5,000 underserved population",
      status: "active",
      createdAt: new Date("2024-01-15"),
    },
    {
      id: "2",
      name: "Emergency Equipment - Northern",
      type: "equipment-transfer",
      targetRegion: "Northern Region",
      description: "Transfer emergency response equipment from Central to Northern facility",
      estimatedImpact: "Enable 24/7 emergency response",
      status: "pending",
      createdAt: new Date("2024-02-01"),
    },
  ]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newPlan, setNewPlan] = useState({
    name: "",
    type: "mobile-clinic",
    targetRegion: "",
    description: "",
  });
  const { toast } = useToast();

  const handleCreatePlan = () => {
    if (!newPlan.name || !newPlan.targetRegion) {
      toast({
        title: "Missing fields",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const plan: ResourcePlan = {
      id: Date.now().toString(),
      ...newPlan,
      type: newPlan.type as ResourcePlan["type"],
      estimatedImpact: "Impact analysis pending",
      status: "draft",
      createdAt: new Date(),
    };

    setPlans([plan, ...plans]);
    setNewPlan({ name: "", type: "mobile-clinic", targetRegion: "", description: "" });
    setIsDialogOpen(false);

    toast({
      title: "Plan created",
      description: "Your resource allocation plan has been saved as draft",
    });
  };

  const simulatePlan = (planId: string) => {
    toast({
      title: "Simulation started",
      description: "Running impact analysis...",
    });

    // Simulate a brief delay
    setTimeout(() => {
      setPlans(
        plans.map((p) =>
          p.id === planId
            ? {
                ...p,
                estimatedImpact: `Projected to improve coverage by 15-20% in ${p.targetRegion}`,
                status: "pending" as const,
              }
            : p
        )
      );
      toast({
        title: "Simulation complete",
        description: "Impact analysis is ready for review",
      });
    }, 1500);
  };

  const exportPlans = () => {
    const data = plans.map((p) => ({
      Name: p.name,
      Type: p.type,
      Region: p.targetRegion,
      Description: p.description,
      Impact: p.estimatedImpact,
      Status: p.status,
      Created: p.createdAt.toISOString(),
    }));

    const csv = [
      Object.keys(data[0]).join(","),
      ...data.map((row) => Object.values(row).join(",")),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "resource-plans.csv";
    a.click();

    toast({
      title: "Export complete",
      description: "Plans exported to CSV",
    });
  };

  // Find critical regions
  const criticalRegions = regions.filter((r) => r.coverageScore < 50);

  return (
    <div className="space-y-6">
      {/* Action bar */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-lg font-semibold text-foreground">
            Resource Planning
          </h2>
          <p className="text-sm text-muted-foreground">
            Plan and simulate interventions to bridge healthcare gaps
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={exportPlans}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-hero">
                <Plus className="h-4 w-4 mr-2" />
                New Plan
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create Resource Plan</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label>Plan Name</Label>
                  <Input
                    value={newPlan.name}
                    onChange={(e) => setNewPlan({ ...newPlan, name: e.target.value })}
                    placeholder="e.g., Mobile Clinic Deployment"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Intervention Type</Label>
                  <Select
                    value={newPlan.type}
                    onValueChange={(v) => setNewPlan({ ...newPlan, type: v })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {PLAN_TYPES.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Target Region</Label>
                  <Select
                    value={newPlan.targetRegion}
                    onValueChange={(v) => setNewPlan({ ...newPlan, targetRegion: v })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select region" />
                    </SelectTrigger>
                    <SelectContent>
                      {regions.map((region) => (
                        <SelectItem key={region.region} value={region.region}>
                          {region.region} ({region.coverageScore}% coverage)
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea
                    value={newPlan.description}
                    onChange={(e) => setNewPlan({ ...newPlan, description: e.target.value })}
                    placeholder="Describe the intervention..."
                    rows={3}
                  />
                </div>
                <Button className="w-full" onClick={handleCreatePlan}>
                  <Save className="h-4 w-4 mr-2" />
                  Create Plan
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Critical regions alert */}
      {criticalRegions.length > 0 && (
        <Card className="border-destructive/50 bg-destructive/5">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <div className="h-8 w-8 rounded-lg bg-destructive/10 flex items-center justify-center shrink-0">
                <Route className="h-4 w-4 text-destructive" />
              </div>
              <div>
                <p className="font-medium text-sm text-destructive">
                  {criticalRegions.length} regions need urgent attention
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {criticalRegions.map((r) => r.region).join(", ")} have coverage scores below 50%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Plans grid */}
      <div className="grid gap-4 md:grid-cols-2">
        {plans.map((plan) => {
          const TypeIcon = PLAN_TYPES.find((t) => t.value === plan.type)?.icon || FileText;

          return (
            <Card key={plan.id} className="overflow-hidden">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <TypeIcon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-sm">{plan.name}</CardTitle>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {plan.targetRegion}
                      </p>
                    </div>
                  </div>
                  <Badge className={cn("text-xs", statusColors[plan.status])}>
                    {plan.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-sm text-muted-foreground mb-3">
                  {plan.description}
                </p>
                <div className="p-2 rounded-lg bg-muted/50 mb-3">
                  <p className="text-xs text-muted-foreground">Estimated Impact</p>
                  <p className="text-sm font-medium text-foreground mt-0.5">
                    {plan.estimatedImpact}
                  </p>
                </div>
                <div className="flex gap-2">
                  {plan.status === "draft" && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => simulatePlan(plan.id)}
                    >
                      <Play className="h-3 w-3 mr-1" />
                      Simulate
                    </Button>
                  )}
                  {plan.status === "pending" && (
                    <Button variant="outline" size="sm" className="flex-1">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Approve
                    </Button>
                  )}
                  {plan.status === "active" && (
                    <Button variant="outline" size="sm" className="flex-1" disabled>
                      <Clock className="h-3 w-3 mr-1" />
                      In Progress
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
