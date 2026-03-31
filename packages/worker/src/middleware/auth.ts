import type { Context, Next } from 'hono';
import type { Env } from '../types.js';

/** Public route patterns that do not require authentication. */
const PUBLIC_PATTERNS = [
  /^\/health$/,
  /^\/password\/[^/]+$/,
  /^\/api\/shorten$/, // POST /api/shorten is public (rate-limited separately)
  /^\/[^/]+$/, // GET /:slug redirect
];

/**
 * Bearer token authentication middleware.
 * Checks `Authorization: Bearer <token>` header against `env.API_TOKEN`.
 * Skips auth for public routes (health, redirect, password).
 */
export async function authMiddleware(
  c: Context<{ Bindings: Env }>,
  next: Next,
): Promise<undefined | Response> {
  const path = new URL(c.req.url).pathname;
  const method = c.req.method;

  // Skip auth for public routes (GET + specific POST routes)
  for (const pattern of PUBLIC_PATTERNS) {
    if (pattern.test(path)) {
      if (method === 'GET' || method === 'POST') {
        await next();
        return;
      }
    }
  }

  const authHeader = c.req.header('Authorization');
  if (!authHeader) {
    return c.json({ error: 'Missing Authorization header' }, 401);
  }

  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return c.json({ error: 'Invalid Authorization format, expected: Bearer <token>' }, 401);
  }

  const token = parts[1];
  if (token !== c.env.API_TOKEN) {
    return c.json({ error: 'Invalid API token' }, 401);
  }

  await next();
}
