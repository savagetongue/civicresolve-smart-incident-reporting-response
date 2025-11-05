import { CategoryManager } from "@/components/dashboard/CategoryManager";
export function AdminPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Admin Panel</h1>
        <p className="text-muted-foreground">
          Manage application settings and data.
        </p>
      </div>
      <CategoryManager />
    </div>
  );
}