import { Link, NavLink } from "react-router-dom";
import { Shield, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ThemeToggle } from "./ThemeToggle";
const NavLinks = ({ className }: { className?: string }) => (
  <nav className={className}>
    <NavLink to="/incidents" className={({ isActive }) => `transition-colors hover:text-primary ${isActive ? 'text-primary' : 'text-muted-foreground'}`}>
      View Reports
    </NavLink>
    <NavLink to="/report" className={({ isActive }) => `transition-colors hover:text-primary ${isActive ? 'text-primary' : 'text-muted-foreground'}`}>
      Submit Report
    </NavLink>
  </nav>
);
export function AppHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-2 font-bold text-lg">
            <Shield className="h-6 w-6 text-primary" />
            <span>CivicResolve</span>
          </Link>
          <div className="hidden md:flex items-center gap-6 text-sm font-medium">
            <NavLinks className="flex items-center gap-6" />
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="hidden md:inline-flex">Login</Button>
            <ThemeToggle className="relative top-0 right-0" />
            <div className="md:hidden">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Menu className="h-6 w-6" />
                    <span className="sr-only">Toggle Menu</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="right">
                  <div className="flex flex-col gap-6 p-6">
                    <Link to="/" className="flex items-center gap-2 font-bold text-lg">
                      <Shield className="h-6 w-6 text-primary" />
                      <span>CivicResolve</span>
                    </Link>
                    <NavLinks className="flex flex-col items-start gap-4 text-lg" />
                    <Button variant="outline">Login</Button>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}