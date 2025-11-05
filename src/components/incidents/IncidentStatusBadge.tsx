import { Badge } from "@/components/ui/badge";
import type { IncidentStatus } from "@shared/types";
import { cn } from "@/lib/utils";
interface IncidentStatusBadgeProps {
  status: IncidentStatus;
  className?: string;
}
const statusColors: Record<IncidentStatus, string> = {
  Submitted: "bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300",
  Acknowledged: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300",
  "In Progress": "bg-orange-100 text-orange-800 dark:bg-orange-900/50 dark:text-orange-300",
  Resolved: "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300",
  Closed: "bg-gray-100 text-gray-800 dark:bg-gray-800/50 dark:text-gray-300",
};
export function IncidentStatusBadge({ status, className }: IncidentStatusBadgeProps) {
  return (
    <Badge className={cn("border-transparent", statusColors[status], className)}>
      {status}
    </Badge>
  );
}