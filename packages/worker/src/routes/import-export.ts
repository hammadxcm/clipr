import type { ShortUrl } from '@clipr/core';
import type { Context } from 'hono';
import { listUrls, putUrl } from '../kv.js';
import type { Env } from '../types.js';

/** POST /api/import — Bulk import entries from a JSON array. */
export async function handleImport(c: Context<{ Bindings: Env }>): Promise<Response> {
  let entries: ShortUrl[];
  try {
    entries = await c.req.json<ShortUrl[]>();
  } catch {
    return c.json({ error: 'Invalid JSON body, expected an array of ShortUrl entries' }, 400);
  }

  if (!Array.isArray(entries)) {
    return c.json({ error: 'Request body must be a JSON array' }, 400);
  }

  let imported = 0;
  const errors: string[] = [];

  for (const entry of entries) {
    if (!entry.slug || !entry.url) {
      errors.push(`Skipped entry: missing slug or url`);
      continue;
    }
    try {
      await putUrl(c.env.URLS, entry.slug, {
        ...entry,
        createdAt: entry.createdAt || new Date().toISOString(),
      });
      imported++;
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      errors.push(`Failed to import "${entry.slug}": ${msg}`);
    }
  }

  return c.json({ imported, total: entries.length, errors }, 200);
}

/** GET /api/export — Export all entries as a JSON array. */
export async function handleExport(c: Context<{ Bindings: Env }>): Promise<Response> {
  const entries = await listUrls(c.env.URLS);

  return c.json(entries, 200, {
    'Content-Disposition': 'attachment; filename="clipr-export.json"',
  });
}
