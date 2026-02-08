import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend,
  AreaChart,
  Area,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { RegionStats, ChartDataPoint } from "@/types/healthcare";

interface AnalyticsChartsProps {
  regionStats: RegionStats[];
  totalFacilities: number;
}

const COLORS = [
  "hsl(210, 80%, 45%)",
  "hsl(175, 55%, 45%)",
  "hsl(155, 60%, 45%)",
  "hsl(35, 80%, 50%)",
  "hsl(0, 75%, 55%)",
  "hsl(280, 60%, 55%)",
];

export function AnalyticsCharts({ regionStats, totalFacilities }: AnalyticsChartsProps) {
  // Coverage by region data
  const coverageData = regionStats.map((r) => ({
    name: r.region.length > 15 ? r.region.substring(0, 12) + "..." : r.region,
    fullName: r.region,
    coverage: r.coverageScore,
    facilities: r.totalFacilities,
  }));

  // Specialty distribution
  const specialtyData: ChartDataPoint[] = [
    { name: "Cardiac", value: regionStats.reduce((sum, r) => sum + r.withCardiac, 0) },
    { name: "Emergency", value: regionStats.reduce((sum, r) => sum + r.withEmergency, 0) },
    { name: "Surgical", value: regionStats.reduce((sum, r) => sum + r.withSurgical, 0) },
  ];

  // Data quality distribution
  const qualityData: ChartDataPoint[] = [
    {
      name: "Complete",
      value: totalFacilities - regionStats.reduce((sum, r) => sum + r.incompleteData, 0),
    },
    {
      name: "Incomplete",
      value: regionStats.reduce((sum, r) => sum + r.incompleteData, 0),
    },
  ];

  // Trend data (simulated for demo)
  const trendData = [
    { month: "Jan", coverage: 45, gaps: 12, alerts: 8 },
    { month: "Feb", coverage: 48, gaps: 10, alerts: 6 },
    { month: "Mar", coverage: 52, gaps: 9, alerts: 5 },
    { month: "Apr", coverage: 55, gaps: 8, alerts: 4 },
    { month: "May", coverage: 58, gaps: 7, alerts: 4 },
    { month: "Jun", coverage: 62, gaps: 6, alerts: 3 },
  ];

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* Coverage by Region */}
      <Card className="md:col-span-2">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-display">Coverage Score by Region</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={coverageData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis type="number" domain={[0, 100]} stroke="hsl(var(--muted-foreground))" />
                <YAxis
                  dataKey="name"
                  type="category"
                  width={100}
                  stroke="hsl(var(--muted-foreground))"
                  tick={{ fontSize: 12 }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                  formatter={(value: number, name: string) => [`${value}%`, "Coverage"]}
                  labelFormatter={(label) => {
                    const item = coverageData.find((d) => d.name === label);
                    return item?.fullName || label;
                  }}
                />
                <Bar
                  dataKey="coverage"
                  fill="hsl(210, 80%, 45%)"
                  radius={[0, 4, 4, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Specialty Distribution */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-display">Specialty Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={specialtyData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={2}
                  dataKey="value"
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                  labelLine={{ stroke: "hsl(var(--muted-foreground))" }}
                >
                  {specialtyData.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Data Quality */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-display">Data Quality</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={qualityData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={2}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}`}
                  labelLine={{ stroke: "hsl(var(--muted-foreground))" }}
                >
                  <Cell fill="hsl(155, 60%, 45%)" />
                  <Cell fill="hsl(35, 80%, 50%)" />
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Coverage Trend */}
      <Card className="md:col-span-2">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-display">Coverage Trends Over Time</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="coverage"
                  name="Coverage %"
                  stroke="hsl(210, 80%, 45%)"
                  fill="hsl(210, 80%, 45%)"
                  fillOpacity={0.2}
                />
                <Area
                  type="monotone"
                  dataKey="gaps"
                  name="Gaps"
                  stroke="hsl(35, 80%, 50%)"
                  fill="hsl(35, 80%, 50%)"
                  fillOpacity={0.2}
                />
                <Area
                  type="monotone"
                  dataKey="alerts"
                  name="Alerts"
                  stroke="hsl(0, 75%, 55%)"
                  fill="hsl(0, 75%, 55%)"
                  fillOpacity={0.2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
