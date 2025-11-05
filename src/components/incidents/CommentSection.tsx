import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { formatDistanceToNow, parseISO } from "date-fns";
import { toast } from "sonner";
import { api } from "@/lib/api-client";
import { useAuthStore } from "@/stores/authStore";
import type { Comment } from "@shared/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { Loader2, MessageSquare, Send } from "lucide-react";
interface CommentSectionProps {
  incidentId: string;
}
const commentSchema = z.object({
  content: z.string().min(1, "Comment cannot be empty.").max(500, "Comment is too long."),
});
type CommentFormValues = z.infer<typeof commentSchema>;
export function CommentSection({ incidentId }: CommentSectionProps) {
  const queryClient = useQueryClient();
  const isAuthenticated = useAuthStore(s => s.isAuthenticated);
  const userEmail = useAuthStore(s => s.user?.email);
  const { data: comments, isLoading } = useQuery<Comment[]>({
    queryKey: ['comments', incidentId],
    queryFn: () => api(`/api/incidents/${incidentId}/comments`),
    enabled: !!incidentId,
  });
  const form = useForm<CommentFormValues>({
    resolver: zodResolver(commentSchema),
    defaultValues: { content: "" },
  });
  const mutation = useMutation({
    mutationFn: (newComment: { content: string; authorEmail: string }) =>
      api<Comment>(`/api/incidents/${incidentId}/comments`, {
        method: 'POST',
        body: JSON.stringify(newComment),
      }),
    onSuccess: () => {
      toast.success("Comment posted!");
      queryClient.invalidateQueries({ queryKey: ['comments', incidentId] });
      form.reset();
    },
    onError: (error) => {
      toast.error("Failed to post comment: " + error.message);
    },
  });
  function onSubmit(values: CommentFormValues) {
    if (!userEmail) {
      toast.error("You must be logged in to comment.");
      return;
    }
    mutation.mutate({ content: values.content, authorEmail: userEmail });
  }
  const getInitials = (email: string) => email.substring(0, 2).toUpperCase();
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          Community Discussion
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          {isLoading && Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="flex items-start gap-4">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-4/5" />
              </div>
            </div>
          ))}
          {!isLoading && comments?.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-4">
              No comments yet. Be the first to start the conversation!
            </p>
          )}
          {comments?.map(comment => (
            <div key={comment.id} className="flex items-start gap-4">
              <Avatar>
                <AvatarFallback>{getInitials(comment.authorEmail)}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-sm">{comment.authorEmail}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatDistanceToNow(parseISO(comment.createdAt), { addSuffix: true })}
                  </p>
                </div>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">{comment.content}</p>
              </div>
            </div>
          ))}
        </div>
        {isAuthenticated && (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex items-start gap-4">
              <Avatar>
                <AvatarFallback>{userEmail ? getInitials(userEmail) : 'U'}</AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-2">
                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Textarea placeholder="Add your comment..." className="resize-none" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex justify-end">
                  <Button type="submit" size="sm" disabled={mutation.isPending}>
                    {mutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
                    Post Comment
                  </Button>
                </div>
              </div>
            </form>
          </Form>
        )}
      </CardContent>
    </Card>
  );
}