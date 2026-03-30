import type { ShortUrl } from '@clipr/core';
import type { Context } from 'hono';
import { deleteUrl, getUrl, listUrls, putUrl } from '../kv.js';
import type { Env } from '../types.js';

/** GET /api/links — List all links with optional filtering. */
export async function handleListLinks(c: Context<{ Bindings: Env }>): Promise<Response> {
  const tag = c.req.query('tag');
  const search = c.req.query('search');
  const limitStr = c.req.query('limit');
  const limit = limitStr ? parseInt(limitStr, 10) : undefined;

  let entries = await listUrls(c.env.URLS);

  // Filter by tag
  if (tag) {
    entries = entries.filter((e) => e.tags?.includes(tag));
  }

  // Search across slug, url, description
  if (search) {
    const q = search.toLowerCase();
    entries = entries.filter(
      (e) =>
        e.slug.toLowerCase().includes(q) ||
        e.url.toLowerCase().includes(q) ||
        e.description?.toLowerCase().includes(q),
    );
  }

  // Apply limit
  if (limit && limit > 0) {
    entries = entries.slice(0, limit);
  }

  return c.json(entries);
}

/** GET /api/links/:code — Get a single link entry. */
export async function handleGetLink(c: Context<{ Bindings: Env }>): Promise<Response> {
  const code = c.req.param('code');
  if (!code) {
    return c.json({ error: 'Missing code parameter' }, 400);
  }

  const entry = await getUrl(c.env.URLS, code);
  if (!entry) {
    return c.json({ error: `Link "${code}" not found` }, 404);
  }

  return c.json(entry);
}

/** PUT /api/links/:code — Update an existing link (partial updates). */
export async function handleUpdateLink(c: Context<{ Bindings: Env }>): Promise<Response> {
  const code = c.req.param('code');
  if (!code) {
    return c.json({ error: 'Missing code parameter' }, 400);
  }

  const existing = await getUrl(c.env.URLS, code);
  if (!existing) {
    return c.json({ error: `Link "${code}" not found` }, 404);
  }

  let updates: Partial<ShortUrl>;
  try {
    updates = await c.req.json<Partial<ShortUrl>>();
  } catch {
    return c.json({ error: 'Invalid JSON body' }, 400);
  }

  // Merge updates into existing entry (slug and createdAt are immutable)
  const updated: ShortUrl = {
    ...existing,
    ...updates,
    slug: existing.slug, // never change slug
    createdAt: existing.createdAt, // never change creation time
  };

  await putUrl(c.env.URLS, code, updated);
  return c.json(updated);
}

/** DELETE /api/links/:code — Delete a link. */
export async function handleDeleteLink(c: Context<{ Bindings: Env }>): Promise<Response> {
  const code = c.req.param('code');
  if (!code) {
    return c.json({ error: 'Missing code parameter' }, 400);
  }

  const deleted = await deleteUrl(c.env.URLS, code);
  if (!deleted) {
    return c.json({ error: `Link "${code}" not found` }, 404);
  }

  return c.json({ ok: true, deleted: code });
}
