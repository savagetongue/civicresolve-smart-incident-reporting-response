import '@/lib/errorReporter';
import { enableMapSet } from "immer";
enableMapSet();
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { RouteErrorBoundary } from '@/components/RouteErrorBoundary';
import '@/index.css'
import { HomePage } from '@/pages/HomePage'
import { SubmitReportPage } from '@/pages/SubmitReportPage';
import { IncidentsListPage } from '@/pages/IncidentsListPage';
import { IncidentDetailPage } from '@/pages/IncidentDetailPage';
import { DashboardLayout } from '@/pages/dashboard/DashboardLayout';
import { AuthorityDashboardPage } from '@/pages/dashboard/AuthorityDashboardPage';
import { AnalyticsPage } from '@/pages/dashboard/AnalyticsPage';
import { LoginPage } from '@/pages/LoginPage';
import { MyReportsPage } from '@/pages/MyReportsPage';
import { AdminPage } from '@/pages/dashboard/AdminPage';
const queryClient = new QueryClient();
const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/report",
    element: <SubmitReportPage />,
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/incidents",
    element: <IncidentsListPage />,
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/incidents/:id",
    element: <IncidentDetailPage />,
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/login",
    element: <LoginPage />,
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/my-reports",
    element: <MyReportsPage />,
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/dashboard",
    element: <DashboardLayout />,
    errorElement: <RouteErrorBoundary />,
    children: [
      {
        index: true,
        element: <AuthorityDashboardPage />,
      },
      {
        path: "analytics",
        element: <AnalyticsPage />,
      },
      {
        path: "admin",
        element: <AdminPage />,
      }
    ]
  }
]);
// Do not touch this code
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </ErrorBoundary>
  </StrictMode>,
)