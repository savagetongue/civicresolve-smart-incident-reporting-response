import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { api } from "@/lib/api-client";
import type { IncidentCategory } from "@shared/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { PlusCircle, Loader2 } from "lucide-react";
import { Skeleton } from "../ui/skeleton";
const categorySchema = z.object({
  id: z.string().min(3, "ID must be at least 3 characters.").regex(/^[a-z0-9-]+$/, "ID must be lowercase alphanumeric with dashes."),
  name: z.string().min(3, "Name must be at least 3 characters."),
  icon: z.string().min(1, "Icon name is required."),
});
type CategoryFormValues = z.infer<typeof categorySchema>;
export function CategoryManager() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const queryClient = useQueryClient();
  const { data: categories, isLoading } = useQuery<IncidentCategory[]>({
    queryKey: ['categories'],
    queryFn: () => api('/api/categories'),
  });
  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: { id: "", name: "", icon: "" },
  });
  const mutation = useMutation({
    mutationFn: (newCategory: IncidentCategory) =>
      api<IncidentCategory>('/api/categories', {
        method: 'POST',
        body: JSON.stringify(newCategory),
      }),
    onSuccess: () => {
      toast.success("Category created successfully!");
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      setIsDialogOpen(false);
      form.reset();
    },
    onError: (error) => {
      toast.error("Failed to create category: " + error.message);
    },
  });
  function onSubmit(values: CategoryFormValues) {
    mutation.mutate(values);
  }
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Incident Categories</CardTitle>
          <CardDescription>Add or manage incident report categories.</CardDescription>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="gap-1">
              <PlusCircle className="h-3.5 w-3.5" />
              <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                Add Category
              </span>
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Category</DialogTitle>
              <DialogDescription>
                Enter the details for the new incident category. The icon should be a valid Lucide icon name.
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField control={form.control} name="id" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category ID</FormLabel>
                    <FormControl><Input placeholder="e.g., road-hazard" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="name" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category Name</FormLabel>
                    <FormControl><Input placeholder="e.g., Road Hazard" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="icon" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Lucide Icon Name</FormLabel>
                    <FormControl><Input placeholder="e.g., CarCrash" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                  <Button type="submit" disabled={mutation.isPending}>
                    {mutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Create Category
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>ID</TableHead>
                <TableHead>Icon Name</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading && Array.from({ length: 3 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-20" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-16" /></TableCell>
                </TableRow>
              ))}
              {categories?.map((category) => (
                <TableRow key={category.id}>
                  <TableCell className="font-medium">{category.name}</TableCell>
                  <TableCell>{category.id}</TableCell>
                  <TableCell className="font-mono text-sm">{category.icon}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}