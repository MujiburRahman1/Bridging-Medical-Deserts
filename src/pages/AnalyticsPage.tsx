import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { AnalyticsCharts } from "@/components/analytics/AnalyticsCharts";
import { StatCard } from "@/components/dashboard/StatCard";
import { useFacilities } from "@/hooks/useFacilities";
import { Loader2, TrendingUp, TrendingDown, Target, Activity } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const AnalyticsPage = () => {
  const { facilities, loading, regionStats, stats } = useFacilities();

  // Calculate some summary metrics
  const avgCoverage =
    regionStats.length > 0
      ? Math.round(regionStats.reduce((sum, r) => sum + r.coverageScore, 0) / regionStats.length)
      : 0;

  const regionsWithCardiac = regionStats.filter((r) => r.withCardiac > 0).length;
  const regionsWithEmergency = regionStats.filter((r) => r.withEmergency > 0).length;

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
            Analytics & Insights
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Visual analysis of healthcare coverage and gaps
          </p>
        </div>

        {/* Summary stats */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Average Coverage"
            value={`${avgCoverage}%`}
            subtitle="Across all regions"
            icon={<Target className="h-6 w-6" />}
            variant={avgCoverage >= 60 ? "success" : avgCoverage >= 40 ? "warning" : "danger"}
            trend={{ value: 8, isPositive: true }}
          />
          <StatCard
            title="Cardiac Coverage"
            value={`${regionsWithCardiac}/${regionStats.length}`}
            subtitle="Regions with cardiac care"
            icon={<Activity className="h-6 w-6" />}
            variant={regionsWithCardiac >= regionStats.length * 0.7 ? "success" : "warning"}
          />
          <StatCard
            title="Emergency Access"
            value={`${regionsWithEmergency}/${regionStats.length}`}
            subtitle="Regions with emergency services"
            icon={<TrendingUp className="h-6 w-6" />}
            variant={regionsWithEmergency >= regionStats.length * 0.8 ? "success" : "warning"}
          />
          <StatCard
            title="Critical Gaps"
            value={stats.medicalDeserts}
            subtitle="Medical desert zones"
            icon={<TrendingDown className="h-6 w-6" />}
            variant="danger"
          />
        </div>

        {/* Charts */}
        <AnalyticsCharts
          regionStats={regionStats}
          totalFacilities={facilities.length}
        />

        {/* Insights panel */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-display">Key Insights</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {/* Auto-generated insights based on data */}
              {regionStats
                .filter((r) => r.coverageScore < 50)
                .slice(0, 2)
                .map((region) => (
                  <div
                    key={region.region}
                    className="p-4 rounded-lg border border-destructive/30 bg-destructive/5"
                  >
                    <p className="font-medium text-sm text-destructive">Critical Gap</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      {region.region} has only {region.coverageScore}% coverage score with{" "}
                      {region.totalFacilities} facilities
                    </p>
                  </div>
                ))}

              {stats.suspiciousClaims > 0 && (
                <div className="p-4 rounded-lg border border-amber-300 bg-amber-50">
                  <p className="font-medium text-sm text-amber-700">Data Quality Alert</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {stats.suspiciousClaims} facilities have suspicious capability claims
                    that need review
                  </p>
                </div>
              )}

              {regionStats.filter((r) => r.withEmergency === 0).length > 0 && (
                <div className="p-4 rounded-lg border border-primary/30 bg-primary/5">
                  <p className="font-medium text-sm text-primary">Emergency Coverage Gap</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {regionStats.filter((r) => r.withEmergency === 0).length} regions lack
                    emergency medical services
                  </p>
                </div>
              )}

              {regionStats
                .filter((r) => r.coverageScore >= 75)
                .slice(0, 1)
                .map((region) => (
                  <div
                    key={region.region}
                    className="p-4 rounded-lg border border-success/30 bg-success/5"
                  >
                    <p className="font-medium text-sm text-success">Strong Coverage</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      {region.region} leads with {region.coverageScore}% coverage and{" "}
                      {region.totalFacilities} facilities
                    </p>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default AnalyticsPage;
