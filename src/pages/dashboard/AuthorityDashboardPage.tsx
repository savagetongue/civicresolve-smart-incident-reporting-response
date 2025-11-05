import { IncidentDataTable } from "@/components/dashboard/IncidentDataTable";
import { useIncidents } from "@/hooks/useIncidents";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
export function AuthorityDashboardPage() {
  const { data: incidentsPage, isLoading, error } = useIncidents();
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Incident Management</h1>
        <p className="text-muted-foreground">
          View, manage, and resolve all reported incidents.
        </p>
      </div>
      {isLoading && (
        <div className="space-y-4">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      )}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error Loading Incidents</AlertTitle>
          <AlertDescription>{error.message}</AlertDescription>
        </Alert>
      )}
      {incidentsPage && <IncidentDataTable data={incidentsPage.items} />}
    </div>
  );
}