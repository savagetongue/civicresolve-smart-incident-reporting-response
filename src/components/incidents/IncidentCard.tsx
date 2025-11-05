import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { formatDistanceToNow, parseISO } from "date-fns";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { IncidentStatusBadge } from "./IncidentStatusBadge";
import type { Incident, IncidentCategory } from "@shared/types";
import { api } from "@/lib/api-client";
import { ArrowRight } from "lucide-react";
interface IncidentCardProps {
  incident: Incident;
}
export function IncidentCard({ incident }: IncidentCardProps) {
  const { data: categories } = useQuery<IncidentCategory[]>({
    queryKey: ['categories'],
    queryFn: () => api('/api/categories'),
  });
  const category = categories?.find(c => c.id === incident.categoryId);
  return (
    <Card className="flex flex-col h-full transition-all hover:shadow-lg hover:-translate-y-1">
      <CardHeader>
        <div className="flex justify-between items-start gap-4">
          <CardTitle className="text-lg leading-tight">{incident.title}</CardTitle>
          <IncidentStatusBadge status={incident.status} />
        </div>
        <CardDescription>
          {category?.name || '...'} &bull; {formatDistanceToNow(parseISO(incident.createdAt), { addSuffix: true })}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-muted-foreground line-clamp-3">{incident.description}</p>
      </CardContent>
      <CardFooter>
        <Button asChild variant="secondary" size="sm" className="w-full group">
          <Link to={`/incidents/${incident.id}`}>
            View Details <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}