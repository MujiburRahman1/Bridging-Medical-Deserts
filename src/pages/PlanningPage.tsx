import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { PlanningTools } from "@/components/planning/PlanningTools";
import { useFacilities } from "@/hooks/useFacilities";
import { Loader2 } from "lucide-react";

const PlanningPage = () => {
  const { loading, regionStats, stats } = useFacilities();

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
      <PlanningTools regions={regionStats} />
    </DashboardLayout>
  );
};

export default PlanningPage;
