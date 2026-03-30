import type { ShortUrl, UrlBackend } from '@clipr/core';
import { normalizeSlug, validateSlug } from '@clipr/core';
import { error, success } from '../utils/output.js';

interface EditOptions {
  url?: string;
  slug?: string;
  tags?: string;
  expires?: string;
  description?: string;
}

export async function edit(slug: string, backend: UrlBackend, opts: EditOptions): Promise<void> {
  const updates: Partial<ShortUrl> = {};

  if (opts.url) {
    updates.url = opts.url;
  }

  if (opts.slug) {
    const newSlug = normalizeSlug(opts.slug);
    const result = validateSlug(newSlug);
    if (!result.valid) {
      error(`Invalid slug: ${result.reason}`);
      process.exit(1);
    }
    updates.slug = newSlug;
  }

  if (opts.tags) {
    updates.tags = opts.tags.split(',').map((t) => t.trim());
  }

  if (opts.expires) {
    updates.expiresAt = new Date(opts.expires).toISOString();
  }

  if (opts.description) {
    updates.description = opts.description;
  }

  if (Object.keys(updates).length === 0) {
    error('No updates specified. Use --url, --slug, --tags, --expires, or --description.');
    process.exit(1);
  }

  try {
    const updated = await backend.update(slug, updates);
    success(`Updated "${slug}"${updates.slug ? ` → "${updated.slug}"` : ''}`);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    error(msg);
    process.exit(1);
  }
}
