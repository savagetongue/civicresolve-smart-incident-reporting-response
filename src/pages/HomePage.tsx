import { Link } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, CheckCircle, MapPin, Send } from "lucide-react";
import { useIncidents } from "@/hooks/useIncidents";
import { IncidentCard } from "@/components/incidents/IncidentCard";
import { Skeleton } from "@/components/ui/skeleton";
export function HomePage() {
  const { data: incidentsPage, isLoading } = useIncidents();
  const recentIncidents = incidentsPage?.items.slice(0, 3) ?? [];
  return (
    <AppLayout>
      {/* Hero Section */}
      <div className="relative bg-secondary">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-50 to-white dark:from-blue-950/20 dark:to-background" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-24 md:py-32 lg:py-40 text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter text-foreground">
              Report Public Incidents.
              <br />
              <span className="text-primary">Improve Your Community.</span>
            </h1>
            <p className="mt-6 max-w-2xl mx-auto text-lg text-muted-foreground">
              CivicResolve empowers you to easily report issues like potholes and broken streetlights, connecting you with local authorities to build a better, safer neighborhood.
            </p>
            <div className="mt-8 flex justify-center gap-4">
              <Button asChild size="lg" className="group">
                <Link to="/report">
                  Report an Incident <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link to="/incidents">View Reports</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
      {/* How It Works Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-16 md:py-24">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight">How It Works</h2>
            <p className="mt-4 text-lg text-muted-foreground">A simple, transparent process in three steps.</p>
          </div>
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            <Card>
              <CardHeader className="items-center">
                <div className="p-3 bg-primary/10 rounded-full text-primary"><Send className="h-8 w-8" /></div>
                <CardTitle className="mt-4">1. Submit Report</CardTitle>
              </CardHeader>
              <CardContent className="text-center text-muted-foreground">
                Quickly fill out a form with details, photos, and the location of the incident.
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="items-center">
                <div className="p-3 bg-primary/10 rounded-full text-primary"><MapPin className="h-8 w-8" /></div>
                <CardTitle className="mt-4">2. Authority Review</CardTitle>
              </CardHeader>
              <CardContent className="text-center text-muted-foreground">
                The relevant local authorities are notified to review and acknowledge your report.
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="items-center">
                <div className="p-3 bg-primary/10 rounded-full text-primary"><CheckCircle className="h-8 w-8" /></div>
                <CardTitle className="mt-4">3. Get Resolution</CardTitle>
              </CardHeader>
              <CardContent className="text-center text-muted-foreground">
                Track the status of your report and see when the issue is resolved.
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      {/* Recent Incidents Section */}
      <div className="bg-secondary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-16 md:py-24">
            <div className="text-center">
              <h2 className="text-3xl font-bold tracking-tight">Recently Reported</h2>
              <p className="mt-4 text-lg text-muted-foreground">See what's happening in the community.</p>
            </div>
            <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {isLoading && Array.from({ length: 3 }).map((_, i) => (
                <Card key={i}>
                  <CardHeader>
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full mt-2" />
                    <Skeleton className="h-10 w-24 mt-4" />
                  </CardContent>
                </Card>
              ))}
              {!isLoading && recentIncidents.map(incident => (
                <IncidentCard key={incident.id} incident={incident} />
              ))}
            </div>
            {recentIncidents.length > 0 && (
              <div className="mt-12 text-center">
                <Button asChild variant="outline">
                  <Link to="/incidents">View All Reports</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
      <footer className="py-6 text-center text-sm text-muted-foreground">
        Built with ❤️ at Cloudflare
      </footer>
    </AppLayout>
  );
}