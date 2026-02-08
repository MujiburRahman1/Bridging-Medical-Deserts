import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { DatasetUpload } from "@/components/DatasetUpload";
import { useFacilities } from "@/hooks/useFacilities";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2, Upload, Database, FileText, CheckCircle, RefreshCw } from "lucide-react";

const UploadPage = () => {
  const { facilities, loading, stats, refetch } = useFacilities();
  const [uploadedCount, setUploadedCount] = useState(0);

  const handleUploadComplete = (count: number) => {
    setUploadedCount(count);
    refetch();
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
            Data Upload
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Import healthcare facility datasets for analysis
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Upload section */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Upload className="h-5 w-5" />
                  Upload Dataset
                </CardTitle>
              </CardHeader>
              <CardContent>
                <DatasetUpload onUploadComplete={handleUploadComplete} />
                
                <div className="mt-4 p-4 rounded-lg bg-muted/50">
                  <h4 className="font-medium text-sm mb-2">Expected Format</h4>
                  <p className="text-xs text-muted-foreground mb-2">
                    Upload a CSV file with the following columns:
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {["name", "region", "specialties", "procedures", "equipment", "phone", "website"].map(
                      (col) => (
                        <Badge key={col} variant="outline" className="text-xs">
                          {col}
                        </Badge>
                      )
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Parsing progress info */}
            <Card className="bg-primary/5 border-primary/20">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <FileText className="h-5 w-5 text-primary shrink-0" />
                  <div>
                    <p className="font-medium text-sm text-primary">
                      AI-Powered Parsing
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Uploaded datasets are automatically parsed and analyzed. The system
                      extracts specialties, equipment, and procedures while detecting
                      potential data quality issues.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Current data stats */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Database className="h-5 w-5" />
                    Current Database
                  </CardTitle>
                  <Button variant="ghost" size="sm" onClick={() => refetch()}>
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <span className="text-sm text-muted-foreground">Total facilities</span>
                    <span className="font-semibold text-lg">{facilities.length}</span>
                  </div>
                  
                  {uploadedCount > 0 && (
                    <div className="flex items-center gap-2 p-3 rounded-lg bg-success/10 text-success">
                      <CheckCircle className="h-4 w-4" />
                      <span className="text-sm font-medium">
                        {uploadedCount} records imported successfully
                      </span>
                    </div>
                  )}

                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">Data Quality</h4>
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Complete records</span>
                        <span className="font-medium text-success">
                          {facilities.length - stats.incompleteRecords}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Incomplete records</span>
                        <span className="font-medium text-amber-600">
                          {stats.incompleteRecords}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Suspicious claims</span>
                        <span className="font-medium text-destructive">
                          {stats.suspiciousClaims}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">Coverage by Region</h4>
                    <div className="space-y-1">
                      {Object.entries(
                        facilities.reduce((acc, f) => {
                          const region = f.region || "Unknown";
                          acc[region] = (acc[region] || 0) + 1;
                          return acc;
                        }, {} as Record<string, number>)
                      )
                        .sort((a, b) => b[1] - a[1])
                        .slice(0, 6)
                        .map(([region, count]) => (
                          <div key={region} className="flex justify-between text-sm">
                            <span className="text-muted-foreground truncate">{region}</span>
                            <span className="font-medium ml-2">{count}</span>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default UploadPage;
