import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import type { Incident } from '@shared/types';
interface PaginatedIncidents {
  items: Incident[];
  next: string | null;
}
export function useIncidents() {
  return useQuery<PaginatedIncidents>({
    queryKey: ['incidents'],
    queryFn: () => api('/api/incidents'),
  });
}