import { AlertTriangle, AlertCircle, Info, ChevronRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { Alert } from "@/types/healthcare";
import { cn } from "@/lib/utils";

interface AlertsListProps {
  alerts: Alert[];
  onViewAlert?: (alert: Alert) => void;
  maxHeight?: string;
}

const alertStyles = {
  critical: {
    icon: AlertTriangle,
    bg: "bg-destructive/10",
    text: "text-destructive",
    badge: "destructive" as const,
  },
  warning: {
    icon: AlertCircle,
    bg: "bg-amber-500/10",
    text: "text-amber-600",
    badge: "outline" as const,
  },
  info: {
    icon: Info,
    bg: "bg-primary/10",
    text: "text-primary",
    badge: "secondary" as const,
  },
};

export function AlertsList({ alerts, onViewAlert, maxHeight = "320px" }: AlertsListProps) {
  if (alerts.length === 0) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-display flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-muted-foreground" />
            System Alerts
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="h-12 w-12 rounded-full bg-success/10 flex items-center justify-center mb-3">
              <Info className="h-6 w-6 text-success" />
            </div>
            <p className="text-sm text-muted-foreground">No alerts at this time</p>
            <p className="text-xs text-muted-foreground mt-1">
              All systems operating normally
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-display flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-muted-foreground" />
            System Alerts
          </CardTitle>
          <Badge variant="secondary">{alerts.length}</Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <ScrollArea style={{ maxHeight }} className="pr-4">
          <div className="space-y-3">
            {alerts.map((alert) => {
              const style = alertStyles[alert.type];
              const Icon = style.icon;
              
              return (
                <div
                  key={alert.id}
                  className={cn(
                    "flex items-start gap-3 p-3 rounded-lg transition-colors",
                    style.bg,
                    onViewAlert && "cursor-pointer hover:opacity-80"
                  )}
                  onClick={() => onViewAlert?.(alert)}
                >
                  <div className={cn("mt-0.5", style.text)}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className={cn("font-medium text-sm", style.text)}>
                        {alert.title}
                      </p>
                      <Badge variant={style.badge} className="text-xs">
                        {alert.type}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                      {alert.description}
                    </p>
                    {alert.region && (
                      <p className="text-xs text-muted-foreground mt-1">
                        📍 {alert.region}
                      </p>
                    )}
                  </div>
                  {onViewAlert && (
                    <Button variant="ghost" size="icon" className="h-6 w-6 shrink-0">
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              );
            })}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
