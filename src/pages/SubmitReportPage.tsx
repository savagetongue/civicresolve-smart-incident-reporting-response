import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/lib/api-client";
import type { Incident, IncidentCategory } from "@shared/types";
import { Loader2, MapPin } from "lucide-react";
import { useState } from "react";
const reportSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters long."),
  description: z.string().min(20, "Description must be at least 20 characters long."),
  categoryId: z.string({ required_error: "Please select a category." }),
  imageUrl: z.string().url("Please enter a valid image URL.").optional().or(z.literal('')),
});
type ReportFormValues = z.infer<typeof reportSchema>;
export function SubmitReportPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const form = useForm<ReportFormValues>({
    resolver: zodResolver(reportSchema),
    defaultValues: { title: "", description: "", categoryId: "", imageUrl: "" },
  });
  const { data: categories, isLoading: isLoadingCategories } = useQuery<IncidentCategory[]>({
    queryKey: ['categories'],
    queryFn: () => api('/api/categories'),
  });
  const mutation = useMutation({
    mutationFn: (newIncident: Omit<Incident, 'id' | 'status' | 'createdAt' | 'updatedAt'>) =>
      api<Incident>('/api/incidents', {
        method: 'POST',
        body: JSON.stringify(newIncident),
      }),
    onSuccess: (data) => {
      toast.success("Incident reported successfully!");
      queryClient.invalidateQueries({ queryKey: ['incidents'] });
      navigate(`/incidents/${data.id}`);
    },
    onError: (error) => {
      toast.error("Failed to submit report: " + error.message);
    },
  });
  function onSubmit(values: ReportFormValues) {
    if (!location) {
      toast.error("Please provide your location.");
      return;
    }
    mutation.mutate({ ...values, location });
  }
  function handleGetLocation() {
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setIsLocating(false);
        toast.success("Location captured!");
      },
      (error) => {
        toast.error("Could not get location: " + error.message);
        setIsLocating(false);
      }
    );
  }
  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-8 md:py-10 lg:py-12">
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="text-2xl">Report a New Incident</CardTitle>
              <CardDescription>Fill out the form below to help improve your community.</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Incident Title</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Large pothole on Main Street" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="categoryId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isLoadingCategories}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a category..." />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {categories?.map(cat => (
                              <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Provide as much detail as possible..." className="resize-y min-h-[100px]" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="imageUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Photo URL (Optional)</FormLabel>
                        <FormControl>
                          <Input placeholder="https://example.com/image.jpg" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormItem>
                    <FormLabel>Location</FormLabel>
                    <div className="flex items-center gap-4">
                      <Button type="button" variant="outline" onClick={handleGetLocation} disabled={isLocating}>
                        {isLocating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <MapPin className="mr-2 h-4 w-4" />}
                        {location ? "Update Location" : "Get Current Location"}
                      </Button>
                      {location && <span className="text-sm text-green-600">Location captured!</span>}
                    </div>
                    {!location && <p className="text-sm text-muted-foreground">Your precise location is required to submit a report.</p>}
                  </FormItem>
                  <Button type="submit" className="w-full" disabled={mutation.isPending}>
                    {mutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Submit Report
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}