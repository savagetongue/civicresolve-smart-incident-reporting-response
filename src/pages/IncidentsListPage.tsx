import { useMemo, useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { IncidentCard } from "@/components/incidents/IncidentCard";
import { useIncidents } from "@/hooks/useIncidents";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ALL_STATUSES, IncidentStatus } from "@shared/types";
import { Search } from "lucide-react";
export function IncidentsListPage() {
  const { data: incidentsPage, isLoading, error } = useIncidents();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<IncidentStatus | "all">("all");
  const filteredIncidents = useMemo(() => {
    if (!incidentsPage?.items) return [];
    return incidentsPage.items.filter(incident => {
      const searchMatch = searchQuery.toLowerCase() === '' ||
        incident.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        incident.description.toLowerCase().includes(searchQuery.toLowerCase());
      const statusMatch = statusFilter === 'all' || incident.status === statusFilter;
      return searchMatch && statusMatch;
    });
  }, [incidentsPage, searchQuery, statusFilter]);
  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-8 md:py-10 lg:py-12">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold tracking-tight">Public Incidents</h1>
            <p className="mt-4 text-lg text-muted-foreground">Browse all incidents reported by the community.</p>
          </div>
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Search by title or description..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as IncidentStatus | "all")}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                {ALL_STATUSES.map(status => (
                  <SelectItem key={status} value={status}>{status}</SelectItem>
                ))}
              </SelectContent>
            </Select>
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
            {filteredIncidents.map(incident => (
              <IncidentCard key={incident.id} incident={incident} />
            ))}
          </div>
          {!isLoading && filteredIncidents.length === 0 && (
            <div className="text-center col-span-full py-16 border-2 border-dashed rounded-lg">
              <h3 className="text-xl font-semibold">No Incidents Found</h3>
              <p className="text-muted-foreground mt-2">
                {searchQuery || statusFilter !== 'all' ? "Try adjusting your search or filters." : "No incidents have been reported yet."}
              </p>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}