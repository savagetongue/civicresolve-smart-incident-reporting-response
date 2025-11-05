import React from "react";
import { AppHeader } from "@/components/AppHeader";
import { Toaster } from "@/components/ui/sonner";
type AppLayoutProps = {
  children: React.ReactNode;
};
export function AppLayout({ children }: AppLayoutProps): JSX.Element {
  return (
    <div className="min-h-screen flex flex-col bg-background font-sans antialiased">
      <AppHeader />
      <main className="flex-1">
        {children}
      </main>
      <Toaster richColors closeButton />
    </div>
  );
}