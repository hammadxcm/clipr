import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { authMiddleware } from './middleware/auth.js';
import { handleHealth } from './routes/health.js';
import { handleExport, handleImport } from './routes/import-export.js';
import {
  handleDeleteLink,
  handleGetLink,
  handleListLinks,
  handleUpdateLink,
} from './routes/links.js';
import { handlePasswordPage, handlePasswordVerify } from './routes/password.js';
import { handleQr } from './routes/qr.js';
import { handleRedirect } from './routes/redirect.js';
import { handleShorten } from './routes/shorten.js';
import { handleStats } from './routes/stats.js';
import type { Env } from './types.js';

const app = new Hono<{ Bindings: Env }>();

// CORS — restrict API access
app.use('/api/*', cors({
  origin: (origin) => origin || '*',
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Authorization', 'Content-Type'],
  maxAge: 86400,
}));

// Auth middleware — applied to all routes, skips public ones internally
app.use('*', authMiddleware);

// --- Public routes ---
app.get('/health', handleHealth);
app.get('/password/:code', handlePasswordPage);
app.post('/password/:code', handlePasswordVerify);

// --- API routes (protected by auth middleware) ---
app.post('/api/shorten', handleShorten);

app.get('/api/links', handleListLinks);
app.get('/api/links/:code', handleGetLink);
app.put('/api/links/:code', handleUpdateLink);
app.delete('/api/links/:code', handleDeleteLink);

app.get('/api/stats/:code', handleStats);
app.get('/api/qr/:code', handleQr);

app.post('/api/import', handleImport);
app.get('/api/export', handleExport);

// --- Catch-all redirect (public) ---
app.get('/:slug', handleRedirect);

app.notFound((c) => c.text('Not Found', 404));

export default app;
