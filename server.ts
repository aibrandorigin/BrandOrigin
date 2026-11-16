import express, { type Request, type Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { requireAuth, type AuthRequest } from './src/middleware/auth.ts';
import { adminAuth, adminDb } from './src/lib/firebase-admin.ts';
import { getOrCreateUser, getUsers } from './src/db/users.ts';
import { db } from './src/db/index.ts';
import { enquiries, projects, services, siteContent } from './src/db/schema.ts';
import fs from 'fs';
import { desc, eq, or } from 'drizzle-orm';
import { INITIAL_CONTENT, INITIAL_ENQUIRIES } from './src/data/initialContent.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '10mb' }));

// Health probe endpoint
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok', service: 'brand-origin-cloudsql' });
});

// Real-time SSE Clients across all browsers
const CONTENT_CACHE_FILE = path.resolve(__dirname, '.site-content-cache.json');

function loadDiskContentCache(): any | null {
  try {
    if (fs.existsSync(CONTENT_CACHE_FILE)) {
      const raw = fs.readFileSync(CONTENT_CACHE_FILE, 'utf-8');
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === 'object' && Object.keys(parsed).length > 2) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn('Could not read local content cache file:', e);
  }
  return null;
}

function saveDiskContentCache(data: any): void {
  try {
    fs.writeFileSync(CONTENT_CACHE_FILE, JSON.stringify(data), 'utf-8');
  } catch (e) {
    console.warn('Could not write local content cache file:', e);
  }
}

let cachedSiteContent: any = loadDiskContentCache();
const sseClients = new Set<Response>();

// Heartbeat interval to prevent proxy timeouts and connection drops
setInterval(() => {
  for (const client of sseClients) {
    try {
      client.write(': heartbeat\n\n');
    } catch {
      sseClients.delete(client);
    }
  }
}, 15000);

function broadcastContentUpdate(payload: any) {
  cachedSiteContent = payload;
  saveDiskContentCache(payload);
  const dataString = `data: ${JSON.stringify({ type: 'content_updated', payload })}\n\n`;
  for (const client of sseClients) {
    try {
      client.write(dataString);
    } catch {
      sseClients.delete(client);
    }
  }
}

function broadcastEnquiriesUpdate(enquiryList: any) {
  const dataString = `data: ${JSON.stringify({ type: 'enquiries_updated', payload: enquiryList })}\n\n`;
  for (const client of sseClients) {
    try {
      client.write(dataString);
    } catch {
      sseClients.delete(client);
    }
  }
}

function formatEnquiry(row: any) {
  return {
    id: row.enquiryRef || String(row.id),
    name: row.name,
    email: row.email,
    company: row.company || '',
    stage: row.stage || '',
    timeline: row.timeline || '',
    budget: row.budget || '',
    concept: row.concept || '',
    status: row.status || 'new',
    createdAt: row.createdAt
      ? typeof row.createdAt === 'string'
        ? row.createdAt.replace('T', ' ').substring(0, 16)
        : new Date(row.createdAt).toISOString().replace('T', ' ').substring(0, 16)
      : new Date().toISOString().replace('T', ' ').substring(0, 16),
  };
}

// SSE real-time stream endpoint for cross-browser synchronization
app.get('/api/content/stream', (req: Request, res: Response) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache, no-transform');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('X-Accel-Buffering', 'no');
  res.flushHeaders?.();

  sseClients.add(res);

  if (cachedSiteContent) {
    res.write(`data: ${JSON.stringify({ type: 'content_updated', payload: cachedSiteContent })}\n\n`);
  } else {
    res.write(`data: ${JSON.stringify({ type: 'connected' })}\n\n`);
  }

  req.on('close', () => {
    sseClients.delete(res);
  });
});

// Live Site Content Endpoints backed by Memory + Disk + Firestore + Cloud SQL
app.get('/api/content', async (_req: Request, res: Response) => {
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  try {
    if (cachedSiteContent && typeof cachedSiteContent === 'object' && Object.keys(cachedSiteContent).length > 2) {
      return res.json(cachedSiteContent);
    }

    const diskCached = loadDiskContentCache();
    if (diskCached) {
      cachedSiteContent = diskCached;
      return res.json(cachedSiteContent);
    }

    // Check Firestore first for fast document retrieval
    try {
      const fsDoc = await adminDb.collection('content').doc('site').get();
      if (fsDoc.exists) {
        const fsData = fsDoc.data();
        if (fsData && typeof fsData === 'object' && Object.keys(fsData).length > 2) {
          cachedSiteContent = {
            ...INITIAL_CONTENT,
            ...fsData,
            careers: Array.isArray(fsData.careers) ? fsData.careers : INITIAL_CONTENT.careers,
            careerApplications: Array.isArray(fsData.careerApplications) ? fsData.careerApplications : [],
            ownerProfile: { ...INITIAL_CONTENT.ownerProfile, ...(fsData.ownerProfile || {}) },
            ownerBlogs: Array.isArray(fsData.ownerBlogs) ? fsData.ownerBlogs : INITIAL_CONTENT.ownerBlogs,
          };
          saveDiskContentCache(cachedSiteContent);
          return res.json(cachedSiteContent);
        }
      }
    } catch (fsErr) {
      console.warn('Firestore content read fallback notice:', fsErr);
    }

    const rows = await db.select().from(siteContent).where(eq(siteContent.key, 'site')).limit(1);
    if (rows.length > 0 && rows[0].data) {
      try {
        const parsed = JSON.parse(rows[0].data);
        if (parsed && typeof parsed === 'object' && Object.keys(parsed).length > 2) {
          cachedSiteContent = {
            ...INITIAL_CONTENT,
            ...parsed,
            careers: Array.isArray(parsed.careers) ? parsed.careers : INITIAL_CONTENT.careers,
            careerApplications: Array.isArray(parsed.careerApplications) ? parsed.careerApplications : [],
            ownerProfile: { ...INITIAL_CONTENT.ownerProfile, ...(parsed.ownerProfile || {}) },
            ownerBlogs: Array.isArray(parsed.ownerBlogs) ? parsed.ownerBlogs : INITIAL_CONTENT.ownerBlogs,
          };
          saveDiskContentCache(cachedSiteContent);
          return res.json(cachedSiteContent);
        }
      } catch {}
    }

    // Default seed to INITIAL_CONTENT if database row is empty
    cachedSiteContent = INITIAL_CONTENT;
    saveDiskContentCache(cachedSiteContent);
    const serialized = JSON.stringify(INITIAL_CONTENT);
    db.insert(siteContent).values({
      key: 'site',
      data: serialized,
      updatedAt: new Date(),
    }).onConflictDoUpdate({
      target: siteContent.key,
      set: {
        data: serialized,
        updatedAt: new Date(),
      },
    }).catch(() => {});

    return res.json(cachedSiteContent);
  } catch (error: any) {
    console.error('Error reading site content:', error);
    return res.json(cachedSiteContent || INITIAL_CONTENT);
  }
});

app.post('/api/content', async (req: Request, res: Response) => {
  try {
    const newContent = req.body;
    if (!newContent || typeof newContent !== 'object') {
      return res.status(400).json({ error: 'Invalid content payload' });
    }

    const stampedContent = {
      ...newContent,
      updatedAt: newContent.updatedAt || new Date().toISOString(),
    };

    // 1. Immediately update in-memory cache, disk cache, and broadcast to SSE clients
    // so concurrent GET /api/content requests never return stale data!
    broadcastContentUpdate(stampedContent);

    // 2. Persist to Firestore with adminDb (Admin SDK)
    try {
      await adminDb.collection('content').doc('site').set(stampedContent, { merge: true });
    } catch (fsErr) {
      console.warn('adminDb Firestore content set notice:', fsErr);
    }

    // 3. Persist to Cloud SQL relational database independently
    try {
      const serialized = JSON.stringify(stampedContent);
      await db.insert(siteContent).values({
        key: 'site',
        data: serialized,
        updatedAt: new Date(),
      }).onConflictDoUpdate({
        target: siteContent.key,
        set: {
          data: serialized,
          updatedAt: new Date(),
        },
      });
    } catch (sqlErr) {
      console.warn('Cloud SQL siteContent save notice:', sqlErr);
    }

    return res.json({ success: true, updatedAt: stampedContent.updatedAt });
  } catch (error: any) {
    console.error('Error saving content:', error);
    return res.status(500).json({ error: 'Failed to save content' });
  }
});

// Admin authentication endpoint
app.post('/api/auth/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const normalized = email?.trim().toLowerCase();
    if ((normalized === 'brandorigin@gmail.com' || normalized === 'aibrandorigin@gmail.com') && password === '111111') {
      const adminUid = `admin-${normalized.split('@')[0]}`;
      try {
        await getOrCreateUser(adminUid, normalized);
      } catch {
        // Non-blocking user sync
      }
      return res.json({
        success: true,
        user: { uid: adminUid, email: normalized, role: 'admin' },
      });
    }
    return res.status(401).json({ error: 'Invalid credentials' });
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Login error' });
  }
});

// Sync Firebase User with Cloud SQL database
app.post('/api/auth/sync', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user || !req.user.uid) {
      return res.status(400).json({ error: 'Missing user identification' });
    }
    const userRecord = await getOrCreateUser(req.user.uid, req.user.email || '');
    return res.json({ success: true, user: userRecord });
  } catch (error: any) {
    console.error('Error syncing user with Cloud SQL:', error);
    return res.status(500).json({ error: error.message || 'User synchronization failed' });
  }
});

// Get users list (Admin authenticated)
app.get('/api/users', requireAuth, async (_req: AuthRequest, res: Response) => {
  try {
    const allUsers = await getUsers();
    return res.json(allUsers);
  } catch (error: any) {
    console.error('Error fetching users:', error);
    return res.status(500).json({ error: error.message || 'Failed to fetch users' });
  }
});

// Enquiries Endpoints with Cross-Browser Real-Time Sync & Seeding
app.get('/api/enquiries', async (_req: Request, res: Response) => {
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  try {
    let list = await db.select().from(enquiries).orderBy(desc(enquiries.createdAt));

    // If database has no enquiries, seed initial founder enquiries
    if (list.length === 0 && INITIAL_ENQUIRIES.length > 0) {
      for (const item of INITIAL_ENQUIRIES) {
        try {
          await db.insert(enquiries).values({
            enquiryRef: item.id,
            name: item.name,
            email: item.email,
            company: item.company,
            stage: item.stage,
            timeline: item.timeline,
            budget: item.budget,
            concept: item.concept,
            status: item.status,
          });
          await adminDb.collection('enquiries').doc(item.id).set(item, { merge: true }).catch(() => {});
        } catch {}
      }
      list = await db.select().from(enquiries).orderBy(desc(enquiries.createdAt));
    }

    const formatted = list.map(formatEnquiry);
    return res.json(formatted);
  } catch (error: any) {
    console.error('Error fetching enquiries from Cloud SQL:', error);
    try {
      const snap = await adminDb.collection('enquiries').orderBy('createdAt', 'desc').get();
      if (!snap.empty) {
        const list = snap.docs.map((d) => d.data());
        return res.json(list);
      }
    } catch (fsErr) {
      console.warn('Firestore enquiries fallback error:', fsErr);
    }
    return res.json(INITIAL_ENQUIRIES);
  }
});

app.post('/api/enquiries', async (req: Request, res: Response) => {
  try {
    const { id, name, email, company, stage, timeline, budget, concept, status } = req.body;
    if (!name || !email) {
      return res.status(400).json({ error: 'Name and email are required' });
    }
    const enquiryRef = id || `enq-${Date.now()}`;
    const result = await db.insert(enquiries).values({
      enquiryRef,
      name,
      email,
      company: company || '',
      stage: stage || '',
      timeline: timeline || '',
      budget: budget || '',
      concept: concept || '',
      status: status || 'new',
    }).returning();

    const formattedEnq = formatEnquiry(result[0] || req.body);

    // Dual persist to Firestore adminDb for real-time enquiry sync
    try {
      await adminDb.collection('enquiries').doc(enquiryRef).set({
        ...formattedEnq,
        createdAt: formattedEnq.createdAt || new Date().toISOString().replace('T', ' ').substring(0, 16),
      }, { merge: true });
    } catch (fsErr) {
      console.warn('adminDb enquiry sync notice:', fsErr);
    }

    // Broadcast updated enquiries list to all connected browsers in real-time
    try {
      const allRows = await db.select().from(enquiries).orderBy(desc(enquiries.createdAt));
      broadcastEnquiriesUpdate(allRows.map(formatEnquiry));
    } catch {}

    return res.status(201).json({ success: true, enquiry: formattedEnq });
  } catch (error: any) {
    console.error('Error inserting enquiry into Cloud SQL:', error);
    // Even if Cloud SQL fails, write to adminDb and broadcast
    const fallbackRef = req.body.id || `enq-${Date.now()}`;
    const fallbackEnq = {
      id: fallbackRef,
      name: req.body.name,
      email: req.body.email,
      company: req.body.company || '',
      stage: req.body.stage || '',
      timeline: req.body.timeline || '',
      budget: req.body.budget || '',
      concept: req.body.concept || '',
      status: req.body.status || 'new',
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
    };
    adminDb.collection('enquiries').doc(fallbackRef).set(fallbackEnq, { merge: true }).catch(() => {});
    broadcastEnquiriesUpdate([fallbackEnq]);
    return res.status(201).json({ success: true, enquiry: fallbackEnq });
  }
});

// Update enquiry status across all browsers
app.patch('/api/enquiries/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    if (!status) {
      return res.status(400).json({ error: 'Status is required' });
    }

    // Update in Cloud SQL
    try {
      const numId = Number(id);
      if (!isNaN(numId) && numId > 0) {
        await db.update(enquiries).set({ status }).where(or(eq(enquiries.enquiryRef, id), eq(enquiries.id, numId)));
      } else {
        await db.update(enquiries).set({ status }).where(eq(enquiries.enquiryRef, id));
      }
    } catch (dbErr) {
      console.warn('Could not update status in Cloud SQL:', dbErr);
    }

    // Update in Firestore adminDb
    try {
      await adminDb.collection('enquiries').doc(id).set({ status }, { merge: true });
    } catch (fsErr) {
      console.warn('Could not update status in Firestore:', fsErr);
    }

    // Broadcast updated list to all browsers
    try {
      const allRows = await db.select().from(enquiries).orderBy(desc(enquiries.createdAt));
      broadcastEnquiriesUpdate(allRows.map(formatEnquiry));
    } catch {}

    return res.json({ success: true, id, status });
  } catch (error: any) {
    console.error('Error updating enquiry status:', error);
    return res.status(500).json({ error: 'Failed to update enquiry' });
  }
});

// Delete enquiry across all browsers
app.delete('/api/enquiries/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Delete in Cloud SQL
    try {
      const numId = Number(id);
      if (!isNaN(numId) && numId > 0) {
        await db.delete(enquiries).where(or(eq(enquiries.enquiryRef, id), eq(enquiries.id, numId)));
      } else {
        await db.delete(enquiries).where(eq(enquiries.enquiryRef, id));
      }
    } catch (dbErr) {
      console.warn('Could not delete from Cloud SQL:', dbErr);
    }

    // Delete in Firestore adminDb
    try {
      await adminDb.collection('enquiries').doc(id).delete();
    } catch (fsErr) {
      console.warn('Could not delete from Firestore:', fsErr);
    }

    // Broadcast updated list to all browsers
    try {
      const allRows = await db.select().from(enquiries).orderBy(desc(enquiries.createdAt));
      broadcastEnquiriesUpdate(allRows.map(formatEnquiry));
    } catch {}

    return res.json({ success: true, deletedId: id });
  } catch (error: any) {
    console.error('Error deleting enquiry:', error);
    return res.status(500).json({ error: 'Failed to delete enquiry' });
  }
});

// Projects Endpoints
app.get('/api/projects', async (_req: Request, res: Response) => {
  try {
    const list = await db.select().from(projects).orderBy(desc(projects.createdAt));
    return res.json(list);
  } catch (error: any) {
    console.error('Error querying projects from Cloud SQL:', error);
    return res.status(500).json({ error: 'Failed to retrieve projects' });
  }
});

app.post('/api/projects', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const { slug, client, industry, year, headline, image, stages, metrics } = req.body;
    if (!client || !headline) {
      return res.status(400).json({ error: 'Client and headline are required' });
    }
    const projectSlug = slug || `project-${Date.now()}`;
    const result = await db.insert(projects).values({
      slug: projectSlug,
      client,
      industry: industry || '',
      year: year || '2026',
      headline,
      image: image || '',
      stages: typeof stages === 'object' ? JSON.stringify(stages) : stages,
      metrics: typeof metrics === 'object' ? JSON.stringify(metrics) : metrics,
    }).onConflictDoUpdate({
      target: projects.slug,
      set: {
        client,
        industry: industry || '',
        year: year || '2026',
        headline,
        image: image || '',
        stages: typeof stages === 'object' ? JSON.stringify(stages) : stages,
        metrics: typeof metrics === 'object' ? JSON.stringify(metrics) : metrics,
      }
    }).returning();

    return res.json({ success: true, project: result[0] });
  } catch (error: any) {
    console.error('Error saving project to Cloud SQL:', error);
    return res.status(500).json({ error: 'Failed to save project' });
  }
});

// Services Endpoints
app.get('/api/services', async (_req: Request, res: Response) => {
  try {
    const list = await db.select().from(services);
    return res.json(list);
  } catch (error: any) {
    console.error('Error querying services from Cloud SQL:', error);
    return res.status(500).json({ error: 'Failed to retrieve services' });
  }
});

app.post('/api/services', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const { number, title, category, description, deliverables, impactMetric } = req.body;
    if (!title) {
      return res.status(400).json({ error: 'Title is required' });
    }
    const result = await db.insert(services).values({
      number: number || '',
      title,
      category: category || '',
      description: description || '',
      deliverables: Array.isArray(deliverables) ? JSON.stringify(deliverables) : deliverables,
      impactMetric: impactMetric || '',
    }).returning();

    return res.status(201).json({ success: true, service: result[0] });
  } catch (error: any) {
    console.error('Error saving service to Cloud SQL:', error);
    return res.status(500).json({ error: 'Failed to save service' });
  }
});

// Start server with Vite middleware in development or static serve in production
async function startServer() {
  const distIndex = path.resolve(__dirname, 'dist', 'index.html');
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true, host: '0.0.0.0', port: PORT },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(distIndex);
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Brand Origin server listening on port ${PORT} (mode: ${isProduction ? 'production' : 'development'})`);
  });
}

startServer();
