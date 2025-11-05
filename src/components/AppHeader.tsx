import { Link, NavLink, useNavigate } from "react-router-dom";
import { Shield, Menu, User, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ThemeToggle } from "./ThemeToggle";
import { useAuthStore } from "@/stores/authStore";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
const NavLinks = ({ className, onLinkClick }: { className?: string, onLinkClick?: () => void }) => (
  <nav className={className}>
    <NavLink to="/incidents" onClick={onLinkClick} className={({ isActive }) => `transition-colors hover:text-primary ${isActive ? 'text-primary' : 'text-muted-foreground'}`}>
      View Reports
    </NavLink>
    <NavLink to="/report" onClick={onLinkClick} className={({ isActive }) => `transition-colors hover:text-primary ${isActive ? 'text-primary' : 'text-muted-foreground'}`}>
      Submit Report
    </NavLink>
  </nav>
);
export function AppHeader() {
  const isAuthenticated = useAuthStore(s => s.isAuthenticated);
  const user = useAuthStore(s => s.user);
  const logout = useAuthStore(s => s.logout);
  const navigate = useNavigate();
  const handleLogout = () => {
    logout();
    navigate('/');
  };
  const getInitials = (email: string | undefined) => {
    if (!email) return 'U';
    return email.substring(0, 2).toUpperCase();
  };
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-2 font-bold text-lg">
            <Shield className="h-6 w-6 text-primary" />
            <span>CivicResolve</span>
          </Link>
          <div className="hidden md:flex items-center gap-6 text-sm font-medium">
            <NavLinks />
          </div>
          <div className="flex items-center gap-2">
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>{getInitials(user?.email)}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">My Account</p>
                      <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/my-reports"><User className="mr-2 h-4 w-4" />My Reports</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/dashboard"><Shield className="mr-2 h-4 w-4" />Authority Portal</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button asChild variant="outline" size="sm" className="hidden md:inline-flex">
                <Link to="/login">Login</Link>
              </Button>
            )}
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
                    {isAuthenticated ? (
                       <>
                        <Button asChild variant="secondary"><Link to="/my-reports">My Reports</Link></Button>
                        <Button onClick={handleLogout} variant="outline">Logout</Button>
                       </>
                    ) : (
                      <Button asChild variant="outline"><Link to="/login">Login</Link></Button>
                    )}
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