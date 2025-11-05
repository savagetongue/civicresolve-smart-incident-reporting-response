import { Hono } from "hono";
import type { Env } from './core-utils';
import { IncidentCategoryEntity, IncidentEntity } from "./entities";
import { ok, bad, notFound } from './core-utils';
import type { Incident, IncidentStatus, AuditEntry } from "@shared/types";
import { z } from 'zod';
const incidentCreateSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  categoryId: z.string(),
  location: z.object({
    lat: z.number(),
    lng: z.number(),
    address: z.string().optional(),
  }),
  imageUrl: z.string().url().optional(),
});
const statusUpdateSchema = z.object({
  status: z.enum(['Submitted', 'Acknowledged', 'In Progress', 'Resolved', 'Closed']),
});
export function userRoutes(app: Hono<{ Bindings: Env }>) {
  // CATEGORIES
  app.get('/api/categories', async (c) => {
    await IncidentCategoryEntity.ensureSeed(c.env);
    const { items } = await IncidentCategoryEntity.list(c.env);
    return ok(c, items);
  });
  // INCIDENTS
  app.get('/api/incidents', async (c) => {
    const cq = c.req.query('cursor');
    const lq = c.req.query('limit');
    const page = await IncidentEntity.list(c.env, cq ?? null, lq ? Math.max(1, (Number(lq) | 0)) : 20);
    // Sort by creation date descending
    page.items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return ok(c, page);
  });
  app.get('/api/incidents/:id', async (c) => {
    const id = c.req.param('id');
    const incident = new IncidentEntity(c.env, id);
    if (!await incident.exists()) return notFound(c, 'Incident not found');
    return ok(c, await incident.getState());
  });
  app.post('/api/incidents', async (c) => {
    const body = await c.req.json();
    const validation = incidentCreateSchema.safeParse(body);
    if (!validation.success) {
      return bad(c, validation.error.issues.map((e: { message: string; }) => e.message).join(', '));
    }
    const { title, description, categoryId, location, imageUrl } = validation.data;
    const now = new Date().toISOString();
    const initialAuditEntry: AuditEntry = {
      status: 'Submitted',
      timestamp: now,
      updatedBy: 'Citizen Reporter',
      notes: 'Initial report submitted.',
    };
    const newIncident: Incident = {
      id: crypto.randomUUID(),
      title,
      description,
      categoryId,
      location,
      imageUrl,
      status: 'Submitted',
      createdAt: now,
      updatedAt: now,
      auditLog: [initialAuditEntry],
    };
    const created = await IncidentEntity.create(c.env, newIncident);
    return ok(c, created);
  });
  app.put('/api/incidents/:id/status', async (c) => {
    const id = c.req.param('id');
    const body = await c.req.json();
    const validation = statusUpdateSchema.safeParse(body);
    if (!validation.success) {
      return bad(c, validation.error.issues.map((e: { message: string; }) => e.message).join(', '));
    }
    const incident = new IncidentEntity(c.env, id);
    if (!await incident.exists()) {
      return notFound(c, 'Incident not found');
    }
    const updatedIncident = await incident.updateStatus(validation.data.status, 'Authority');
    return ok(c, updatedIncident);
  });
}