import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { format, parseISO } from "date-fns";
import { AppLayout } from "@/components/layout/AppLayout";
import { api } from "@/lib/api-client";
import type { Incident, IncidentCategory } from "@shared/types";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { IncidentStatusBadge } from "@/components/incidents/IncidentStatusBadge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, Calendar, MapPin, Tag, History } from "lucide-react";
export function IncidentDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: incident, isLoading, error } = useQuery<Incident>({
    queryKey: ['incident', id],
    queryFn: () => api(`/api/incidents/${id}`),
    enabled: !!id,
  });
  const { data: categories } = useQuery<IncidentCategory[]>({
    queryKey: ['categories'],
    queryFn: () => api('/api/categories'),
  });
  const category = categories?.find(c => c.id === incident?.categoryId);
  const renderLoading = () => (
    <div className="space-y-8">
      <Skeleton className="h-10 w-3/4" />
      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-24 w-full" />
        </div>
        <div className="space-y-4">
          <Skeleton className="h-48 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
      </div>
    </div>
  );
  const renderError = () => (
    <Alert variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Error</AlertTitle>
      <AlertDescription>
        Could not load incident details. {error instanceof Error ? error.message : 'Please try again later.'}
      </AlertDescription>
    </Alert>
  );
  const renderContent = () => {
    if (!incident) return null;
    return (
      <div>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">{incident.title}</h1>
          <IncidentStatusBadge status={incident.status} />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {incident.imageUrl && (
              <Card>
                <CardContent className="p-0">
                  <img src={incident.imageUrl} alt={incident.title} className="w-full h-auto object-cover rounded-lg aspect-video" />
                </CardContent>
              </Card>
            )}
            <Card>
              <CardHeader>
                <CardTitle>Description</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground whitespace-pre-wrap">{incident.description}</p>
              </CardContent>
            </Card>
          </div>
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <span className="font-medium">Reported on:</span>
                    <p className="text-muted-foreground">{format(parseISO(incident.createdAt), "PPPp")}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Tag className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <span className="font-medium">Category:</span>
                    <p className="text-muted-foreground">{category?.name || 'Loading...'}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-medium">Location:</span>
                    <p className="text-muted-foreground">
                      {incident.location.address || `Lat: ${incident.location.lat.toFixed(5)}, Lng: ${incident.location.lng.toFixed(5)}`}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <History className="h-5 w-5" />
                  Incident History
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-4">
                  {incident.auditLog.slice().reverse().map((entry, index) => (
                    <li key={index} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className="w-3 h-3 bg-primary rounded-full mt-1.5" />
                        {index < incident.auditLog.length - 1 && <div className="w-px h-full bg-border" />}
                      </div>
                      <div className="pb-4">
                        <p className="font-semibold">
                          Status changed to <span className="text-primary">{entry.status}</span>
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {format(parseISO(entry.timestamp), "PPP, p")} by {entry.updatedBy}
                        </p>
                        {entry.notes && <p className="text-sm mt-1 italic text-muted-foreground">"{entry.notes}"</p>}
                      </div>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  };
  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-8 md:py-10 lg:py-12">
          {isLoading ? renderLoading() : error ? renderError() : renderContent()}
        </div>
      </div>
    </AppLayout>
  );
}