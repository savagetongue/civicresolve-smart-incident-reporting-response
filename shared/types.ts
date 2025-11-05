export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}
export interface IncidentCategory {
  id: string;
  name: string;
  icon: string; // lucide-react icon name
}
export type IncidentStatus = 'Submitted' | 'Acknowledged' | 'In Progress' | 'Resolved' | 'Closed';
export const ALL_STATUSES: IncidentStatus[] = ['Submitted', 'Acknowledged', 'In Progress', 'Resolved', 'Closed'];
export interface AuditEntry {
  status: IncidentStatus;
  timestamp: string; // ISO 8601
  updatedBy: string; // e.g., 'Citizen Reporter', 'System', 'Authority User'
  notes?: string;
}
export interface Incident {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  status: IncidentStatus;
  categoryId: string;
  location: {
    lat: number;
    lng: number;
    address?: string;
  };
  createdAt: string; // ISO 8601
  updatedAt: string; // ISO 8601
  reporterId?: string;
  reporterEmail?: string;
  auditLog: AuditEntry[];
}
export interface Comment {
  id: string;
  incidentId: string;
  authorEmail: string;
  content: string;
  createdAt: string; // ISO 8601
}