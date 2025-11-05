import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Bar, BarChart, CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/lib/api-client";
import type { Incident, IncidentCategory } from "@shared/types";
import { format, parseISO, startOfWeek } from "date-fns";
interface AnalyticsChartsProps {
  incidents: Incident[];
  isLoading: boolean;
}
export function AnalyticsCharts({ incidents, isLoading }: AnalyticsChartsProps) {
  const { data: categories } = useQuery<IncidentCategory[]>({
    queryKey: ['categories'],
    queryFn: () => api('/api/categories'),
  });
  const incidentsByCategory = useMemo(() => {
    if (!categories || !incidents) return [];
    const categoryMap = new Map<string, number>();
    incidents.forEach(incident => {
      categoryMap.set(incident.categoryId, (categoryMap.get(incident.categoryId) || 0) + 1);
    });
    return categories.map(cat => ({
      name: cat.name,
      count: categoryMap.get(cat.id) || 0,
    })).sort((a, b) => b.count - a.count);
  }, [categories, incidents]);
  const incidentsOverTime = useMemo(() => {
    if (!incidents) return [];
    const weekMap = new Map<string, number>();
    incidents.forEach(incident => {
      const weekStart = startOfWeek(parseISO(incident.createdAt), { weekStartsOn: 1 });
      const weekKey = format(weekStart, 'yyyy-MM-dd');
      weekMap.set(weekKey, (weekMap.get(weekKey) || 0) + 1);
    });
    return Array.from(weekMap.entries())
      .map(([date, count]) => ({
        date: format(parseISO(date), 'MMM d'),
        count,
      }))
      .sort((a, b) => parseISO(a.date).getTime() - parseISO(b.date).getTime());
  }, [incidents]);
  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader><Skeleton className="h-6 w-48" /></CardHeader>
          <CardContent><Skeleton className="h-72 w-full" /></CardContent>
        </Card>
        <Card>
          <CardHeader><Skeleton className="h-6 w-48" /></CardHeader>
          <CardContent><Skeleton className="h-72 w-full" /></CardContent>
        </Card>
      </div>
    );
  }
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Incidents by Category</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            {incidentsByCategory.length > 0 ? (
              <BarChart data={incidentsByCategory} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="hsl(var(--primary))" name="Incidents" />
              </BarChart>
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground">No data to display</div>
            )}
          </ResponsiveContainer>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Incidents Over Time</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            {incidentsOverTime.length > 0 ? (
              <LineChart data={incidentsOverTime} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="count" stroke="hsl(var(--primary))" name="Incidents" />
              </LineChart>
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground">No data to display</div>
            )}
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}