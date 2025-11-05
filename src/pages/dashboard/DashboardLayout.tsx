import { Outlet } from "react-router-dom";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { Toaster } from "@/components/ui/sonner";
export function DashboardLayout() {
  return (
    <div className="min-h-screen w-full flex bg-muted/40">
      <DashboardSidebar />
      <div className="flex flex-col flex-1">
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-auto">
          <Outlet />
        </main>
      </div>
      <Toaster richColors closeButton />
    </div>
  );
}