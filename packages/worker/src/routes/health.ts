import type { Context } from 'hono';

export function handleHealth(c: Context): Response {
  return c.json({ status: 'ok', timestamp: new Date().toISOString() });
}
