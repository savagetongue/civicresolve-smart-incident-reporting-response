import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useNavigate } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useAuthStore } from "@/stores/authStore";
import { toast } from "sonner";
const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address."),
});
type LoginFormValues = z.infer<typeof loginSchema>;
export function LoginPage() {
  const navigate = useNavigate();
  const login = useAuthStore(s => s.login);
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "" },
  });
  function onSubmit(values: LoginFormValues) {
    // This is a mock login. In a real app, you'd call an API.
    login(values.email);
    toast.success("Login successful!");
    navigate("/my-reports");
  }
  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-16 md:py-24 flex items-center justify-center">
          <Card className="w-full max-w-sm">
            <CardHeader>
              <CardTitle className="text-2xl">Citizen Login</CardTitle>
              <CardDescription>Enter your email to access your reports.</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email Address</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="you@example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full">
                    Login
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