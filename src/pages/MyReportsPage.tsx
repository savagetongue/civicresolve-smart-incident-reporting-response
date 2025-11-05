import { useMemo } from "react";
import { Link, Navigate } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { IncidentCard } from "@/components/incidents/IncidentCard";
import { useIncidents } from "@/hooks/useIncidents";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useAuthStore } from "@/stores/authStore";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
export function MyReportsPage() {
  const { data: incidentsPage, isLoading, error } = useIncidents();
  const isAuthenticated = useAuthStore(s => s.isAuthenticated);
  const user = useAuthStore(s => s.user);
  const myIncidents = useMemo(() => {
    if (!incidentsPage?.items || !user?.email) return [];
    return incidentsPage.items.filter(incident => incident.reporterEmail === user.email);
  }, [incidentsPage, user]);
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-8 md:py-10 lg:py-12">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold tracking-tight">My Reported Incidents</h1>
            <p className="mt-4 text-lg text-muted-foreground">Track the status of all incidents you've submitted.</p>
          </div>
          {error && <div className="text-center text-red-500">Failed to load incidents: {error.message}</div>}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {isLoading && Array.from({ length: 3 }).map((_, i) => (
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
            {myIncidents.map(incident => (
              <IncidentCard key={incident.id} incident={incident} />
            ))}
          </div>
          {!isLoading && myIncidents.length === 0 && (
            <div className="text-center col-span-full py-16 border-2 border-dashed rounded-lg">
              <h3 className="text-xl font-semibold">You haven't reported any incidents yet.</h3>
              <p className="text-muted-foreground mt-2">Help improve your community by submitting your first report.</p>
              <Button asChild className="mt-6">
                <Link to="/report">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Report an Incident
                </Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}