import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { api } from "@/lib/api-client";
import { useAuthStore } from "@/stores/authStore";
import { Button } from "@/components/ui/button";
import { ThumbsUp, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Incident } from "@shared/types";
interface UpvoteButtonProps {
  incidentId: string;
  initialUpvotes: number;
}
const getUpvotedIncidents = (): string[] => {
  try {
    const item = localStorage.getItem("upvoted_incidents");
    return item ? JSON.parse(item) : [];
  } catch (error) {
    console.error("Error reading from localStorage", error);
    return [];
  }
};
const addUpvotedIncident = (id: string) => {
  try {
    const upvoted = getUpvotedIncidents();
    localStorage.setItem("upvoted_incidents", JSON.stringify([...upvoted, id]));
  } catch (error) {
    console.error("Error writing to localStorage", error);
  }
};
export function UpvoteButton({ incidentId, initialUpvotes }: UpvoteButtonProps) {
  const queryClient = useQueryClient();
  const isAuthenticated = useAuthStore(s => s.isAuthenticated);
  const [hasUpvoted, setHasUpvoted] = useState(false);
  useEffect(() => {
    setHasUpvoted(getUpvotedIncidents().includes(incidentId));
  }, [incidentId]);
  const mutation = useMutation({
    mutationFn: () => api<Incident>(`/api/incidents/${incidentId}/upvote`, { method: 'POST' }),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ['incidents'] });
      await queryClient.cancelQueries({ queryKey: ['incident', incidentId] });
      const previousIncidents = queryClient.getQueryData<any>(['incidents']);
      const previousIncident = queryClient.getQueryData<Incident>(['incident', incidentId]);
      const optimisticUpdate = (incident: Incident) => ({
        ...incident,
        upvotes: (incident.upvotes || 0) + 1,
      });
      if (previousIncidents) {
        queryClient.setQueryData(['incidents'], (old: any) => ({
          ...old,
          items: old.items.map((i: Incident) => i.id === incidentId ? optimisticUpdate(i) : i),
        }));
      }
      if (previousIncident) {
        queryClient.setQueryData(['incident', incidentId], (old: Incident | undefined) => old ? optimisticUpdate(old) : undefined);
      }
      setHasUpvoted(true);
      addUpvotedIncident(incidentId);
      return { previousIncidents, previousIncident };
    },
    onError: (err, newTodo, context) => {
      toast.error("Upvote failed. Please try again.");
      if (context?.previousIncidents) {
        queryClient.setQueryData(['incidents'], context.previousIncidents);
      }
      if (context?.previousIncident) {
        queryClient.setQueryData(['incident', incidentId], context.previousIncident);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['incidents'] });
      queryClient.invalidateQueries({ queryKey: ['incident', incidentId] });
    },
  });
  const handleUpvote = () => {
    if (!isAuthenticated) {
      toast.error("You must be logged in to upvote.");
      return;
    }
    if (hasUpvoted) {
      toast.info("You have already upvoted this incident.");
      return;
    }
    mutation.mutate();
  };
  return (
    <Button
      variant={hasUpvoted ? "default" : "outline"}
      size="sm"
      onClick={handleUpvote}
      disabled={mutation.isPending || hasUpvoted}
      className="flex items-center gap-2 transition-all"
    >
      {mutation.isPending ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <ThumbsUp className={cn("h-4 w-4", hasUpvoted && "text-white")} />
      )}
      <span>{initialUpvotes}</span>
    </Button>
  );
}