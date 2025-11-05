import { IndexedEntity } from "./core-utils";
import type { Incident, IncidentCategory, IncidentStatus, AuditEntry } from "@shared/types";
// INCIDENT CATEGORY ENTITY
const SEED_CATEGORIES: IncidentCategory[] = [
  { id: 'pothole', name: 'Pothole', icon: 'Car' },
  { id: 'streetlight', name: 'Streetlight Out', icon: 'LightbulbOff' },
  { id: 'graffiti', name: 'Graffiti', icon: 'Paintbrush' },
  { id: 'trash', name: 'Illegal Dumping', icon: 'Trash2' },
  { id: 'noise', name: 'Noise Complaint', icon: 'Volume2' },
  { id: 'other', name: 'Other', icon: 'AlertCircle' },
];
export class IncidentCategoryEntity extends IndexedEntity<IncidentCategory> {
  static readonly entityName = "incident-category";
  static readonly indexName = "incident-categories";
  static readonly initialState: IncidentCategory = { id: "", name: "", icon: "" };
  static seedData = SEED_CATEGORIES;
}
// INCIDENT ENTITY
export class IncidentEntity extends IndexedEntity<Incident> {
  static readonly entityName = "incident";
  static readonly indexName = "incidents";
  static readonly initialState: Incident = {
    id: "",
    title: "",
    description: "",
    status: "Submitted",
    categoryId: "",
    location: { lat: 0, lng: 0 },
    createdAt: "",
    updatedAt: "",
    auditLog: [],
    reporterEmail: "",
  };
  async updateStatus(status: IncidentStatus, updatedBy: string, notes?: string): Promise<Incident> {
    return this.mutate(s => {
      const now = new Date().toISOString();
      const newAuditEntry: AuditEntry = {
        status,
        timestamp: now,
        updatedBy,
        notes,
      };
      return {
        ...s,
        status,
        updatedAt: now,
        auditLog: [...s.auditLog, newAuditEntry],
      };
    });
  }
}