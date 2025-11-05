import { Hono } from "hono";
import type { Env } from './core-utils';
import { CommentEntity, IncidentCategoryEntity, IncidentEntity } from "./entities";
import { ok, bad, notFound } from './core-utils';
import type { Incident, IncidentStatus, AuditEntry, IncidentCategory, Comment } from "@shared/types";
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
  reporterEmail: z.string().email().optional(),
});
const statusUpdateSchema = z.object({
  status: z.enum(['Submitted', 'Acknowledged', 'In Progress', 'Resolved', 'Closed']),
});
const categoryCreateSchema = z.object({
  id: z.string().min(3, "ID must be at least 3 characters.").regex(/^[a-z0-9-]+$/, "ID must be lowercase alphanumeric with dashes."),
  name: z.string().min(3, "Name must be at least 3 characters."),
  icon: z.string().min(1, "Icon name is required."),
});
const commentCreateSchema = z.object({
  content: z.string().min(1, 'Comment cannot be empty.'),
  authorEmail: z.string().email('Invalid email address.'),
});
export function userRoutes(app: Hono<{ Bindings: Env }>) {
  // CATEGORIES
  app.get('/api/categories', async (c) => {
    await IncidentCategoryEntity.ensureSeed(c.env);
    const { items } = await IncidentCategoryEntity.list(c.env);
    return ok(c, items);
  });
  app.post('/api/categories', async (c) => {
    const body = await c.req.json();
    const validation = categoryCreateSchema.safeParse(body);
    if (!validation.success) {
      return bad(c, validation.error.issues.map((e) => e.message).join(', '));
    }
    const newCategory: IncidentCategory = validation.data;
    const category = new IncidentCategoryEntity(c.env, newCategory.id);
    if (await category.exists()) {
      return bad(c, 'Category with this ID already exists.');
    }
    const created = await IncidentCategoryEntity.create(c.env, newCategory);
    return ok(c, created);
  });
  // INCIDENTS
  app.get('/api/incidents', async (c) => {
    const cq = c.req.query('cursor');
    const lq = c.req.query('limit');
    const page = await IncidentEntity.list(c.env, cq ?? null, lq ? Math.max(1, (Number(lq) | 0)) : 100); // Increased limit for client-side filtering
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
    const { title, description, categoryId, location, imageUrl, reporterEmail } = validation.data;
    const now = new Date().toISOString();
    const initialAuditEntry: AuditEntry = {
      status: 'Submitted',
      timestamp: now,
      updatedBy: reporterEmail ? 'Citizen Reporter' : 'Anonymous Reporter',
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
      reporterEmail,
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
  // COMMENTS
  app.get('/api/incidents/:id/comments', async (c) => {
    const incidentId = c.req.param('id');
    const { items } = await CommentEntity.list(c.env);
    const incidentComments = items
      .filter(comment => comment.incidentId === incidentId)
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    return ok(c, incidentComments);
  });
  app.post('/api/incidents/:id/comments', async (c) => {
    const incidentId = c.req.param('id');
    const incident = new IncidentEntity(c.env, incidentId);
    if (!await incident.exists()) {
      return notFound(c, 'Incident not found');
    }
    const body = await c.req.json();
    const validation = commentCreateSchema.safeParse(body);
    if (!validation.success) {
      return bad(c, validation.error.issues.map((e) => e.message).join(', '));
    }
    const { content, authorEmail } = validation.data;
    const newComment: Comment = {
      id: crypto.randomUUID(),
      incidentId,
      authorEmail,
      content,
      createdAt: new Date().toISOString(),
    };
    const created = await CommentEntity.create(c.env, newComment);
    return ok(c, created);
  });
}