import { useMemo } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { format, parseISO } from "date-fns";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { IncidentStatusBadge } from "@/components/incidents/IncidentStatusBadge";
import { api } from "@/lib/api-client";
import type { Incident, IncidentStatus, IncidentCategory } from "@shared/types";
import { ALL_STATUSES } from "@shared/types";
import { MoreHorizontal, Loader2, Eye } from "lucide-react";
interface IncidentDataTableProps {
  data: Incident[];
}
export function IncidentDataTable({ data }: IncidentDataTableProps) {
  const queryClient = useQueryClient();
  const categoriesById = useMemo(() => {
    const categories = queryClient.getQueryData<IncidentCategory[]>(['categories']) || [];
    return new Map(categories.map(c => [c.id, c.name]));
  }, [queryClient]);
  const mutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: IncidentStatus }) =>
      api(`/api/incidents/${id}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status }),
      }),
    onSuccess: () => {
      toast.success("Incident status updated.");
      queryClient.invalidateQueries({ queryKey: ['incidents'] });
      queryClient.invalidateQueries({ queryKey: ['incident'] });
    },
    onError: (error) => {
      toast.error("Failed to update status: " + error.message);
    },
  });
  const handleStatusChange = (id: string, status: IncidentStatus) => {
    mutation.mutate({ id, status });
  };
  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Reported At</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((incident) => (
            <TableRow key={incident.id}>
              <TableCell className="font-medium">{incident.title}</TableCell>
              <TableCell>{categoriesById.get(incident.categoryId) || 'Unknown'}</TableCell>
              <TableCell>
                <IncidentStatusBadge status={incident.status} />
              </TableCell>
              <TableCell>{format(parseISO(incident.createdAt), "PP")}</TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" disabled={mutation.isPending && mutation.variables?.id === incident.id}>
                      {mutation.isPending && mutation.variables?.id === incident.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <MoreHorizontal className="h-4 w-4" />
                      )}
                      <span className="sr-only">Actions</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <Link to={`/incidents/${incident.id}`}>
                        <Eye className="mr-2 h-4 w-4" />
                        View Details
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    {ALL_STATUSES.map((status) => (
                      <DropdownMenuItem
                        key={status}
                        disabled={incident.status === status}
                        onSelect={() => handleStatusChange(incident.id, status)}
                      >
                        Set as {status}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}