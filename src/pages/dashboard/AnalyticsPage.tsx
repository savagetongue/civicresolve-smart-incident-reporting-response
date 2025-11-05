import { useIncidents } from "@/hooks/useIncidents";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, BarChart, CheckCircle, Clock } from "lucide-react";
import { AnalyticsCharts } from "@/components/dashboard/AnalyticsCharts";
import { useMemo } from "react";
import { differenceInHours, parseISO } from "date-fns";
export function AnalyticsPage() {
  const { data: incidentsPage, isLoading, error } = useIncidents();
  const stats = useMemo(() => {
    if (!incidentsPage?.items) {
      return { total: 0, resolved: 0, avgResolutionHours: 0 };
    }
    const incidents = incidentsPage.items;
    const resolvedIncidents = incidents.filter(i => i.status === 'Resolved' || i.status === 'Closed');
    const totalResolutionHours = resolvedIncidents.reduce((acc, i) => {
      const resolvedEntry = i.auditLog.find(entry => entry.status === 'Resolved' || entry.status === 'Closed');
      if (resolvedEntry) {
        return acc + differenceInHours(parseISO(resolvedEntry.timestamp), parseISO(i.createdAt));
      }
      return acc;
    }, 0);
    return {
      total: incidents.length,
      resolved: resolvedIncidents.length,
      avgResolutionHours: resolvedIncidents.length > 0 ? Math.round(totalResolutionHours / resolvedIncidents.length) : 0,
    };
  }, [incidentsPage?.items]);
  const renderKPIs = () => {
    if (isLoading) {
      return Array.from({ length: 3 }).map((_, i) => (
        <Card key={i}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-6 w-6 rounded-full" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-8 w-16" />
            <Skeleton className="h-4 w-32 mt-1" />
          </CardContent>
        </Card>
      ));
    }
    return (
      <>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Incidents</CardTitle>
            <BarChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">Total reports submitted</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Resolved Incidents</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.resolved}</div>
            <p className="text-xs text-muted-foreground">
              {stats.total > 0 ? `${((stats.resolved / stats.total) * 100).toFixed(0)}% resolved` : 'No incidents yet'}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Resolution Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.avgResolutionHours} hours</div>
            <p className="text-xs text-muted-foreground">Average time from report to resolution</p>
          </CardContent>
        </Card>
      </>
    );
  };
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Analytics & Insights</h1>
        <p className="text-muted-foreground">
          Visualize incident trends and operational performance.
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {renderKPIs()}
      </div>
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error Loading Data</AlertTitle>
          <AlertDescription>{error.message}</AlertDescription>
        </Alert>
      )}
      <AnalyticsCharts
        incidents={incidentsPage?.items || []}
        isLoading={isLoading}
      />
    </div>
  );
}