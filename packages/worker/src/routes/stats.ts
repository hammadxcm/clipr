import type { Context } from 'hono';
import { getStats, getUrl } from '../kv.js';
import type { Env } from '../types.js';

/** GET /api/stats/:code — Returns LinkStats JSON for a link. */
export async function handleStats(c: Context<{ Bindings: Env }>): Promise<Response> {
  const code = c.req.param('code');
  if (!code) {
    return c.json({ error: 'Missing code parameter' }, 400);
  }

  // Verify the link exists
  const entry = await getUrl(c.env.URLS, code);
  if (!entry) {
    return c.json({ error: `Link "${code}" not found` }, 404);
  }

  const stats = await getStats(c.env.URLS, code);
  return c.json({ code, ...stats });
}
