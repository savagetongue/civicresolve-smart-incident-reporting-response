import { AppLayout } from "@/components/layout/AppLayout";
import { IncidentCard } from "@/components/incidents/IncidentCard";
import { useIncidents } from "@/hooks/useIncidents";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
export function IncidentsListPage() {
  const { data: incidentsPage, isLoading, error } = useIncidents();
  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-8 md:py-10 lg:py-12">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold tracking-tight">Public Incidents</h1>
            <p className="mt-4 text-lg text-muted-foreground">Browse all incidents reported by the community.</p>
          </div>
          {error && <div className="text-center text-red-500">Failed to load incidents: {error.message}</div>}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {isLoading && Array.from({ length: 6 }).map((_, i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full mt-2" />
                  <Skeleton className="h-10 w-24 mt-4" />
                </CardContent>
              </Card>
            ))}
            {incidentsPage?.items.map(incident => (
              <IncidentCard key={incident.id} incident={incident} />
            ))}
          </div>
          {!isLoading && incidentsPage?.items.length === 0 && (
            <div className="text-center col-span-full py-16">
              <p className="text-muted-foreground">No incidents have been reported yet.</p>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}