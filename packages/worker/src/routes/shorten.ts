import type { ShortUrl, UtmParams } from '@clipr/core';
import { generateSlug, validateSlug, validateUrl } from '@clipr/core';
import type { Context } from 'hono';
import { hashPassword } from '../crypto.js';
import { getUrl, incrementCounter, putUrl } from '../kv.js';
import type { Env } from '../types.js';

interface ShortenBody {
  url: string;
  slug?: string;
  tags?: string[];
  expiresAt?: string;
  password?: string;
  description?: string;
  utm?: UtmParams;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
}

/** POST /api/shorten — Create a new short URL. */
export async function handleShorten(c: Context<{ Bindings: Env }>): Promise<Response> {
  let body: ShortenBody;
  try {
    body = await c.req.json<ShortenBody>();
  } catch {
    return c.json({ error: 'Invalid JSON body' }, 400);
  }

  if (!body.url) {
    return c.json({ error: 'Missing required field: url' }, 400);
  }

  // Validate URL
  const urlResult = validateUrl(body.url);
  if (!urlResult.valid) {
    return c.json({ error: `Invalid URL: ${urlResult.reason}` }, 400);
  }

  // Determine slug
  let slug: string;
  if (body.slug) {
    const slugResult = validateSlug(body.slug);
    if (!slugResult.valid) {
      return c.json({ error: `Invalid slug: ${slugResult.reason}` }, 400);
    }
    slug = body.slug;

    // Check for conflicts
    const existing = await getUrl(c.env.URLS, slug);
    if (existing) {
      return c.json({ error: `Slug "${slug}" already exists` }, 409);
    }
  } else {
    // Auto-generate slug from counter
    const counter = await incrementCounter(c.env.URLS);
    slug = generateSlug(counter);
  }

  // Hash password if provided
  let passwordHash: string | undefined;
  if (body.password) {
    passwordHash = await hashPassword(body.password);
  }

  const now = new Date().toISOString();
  const entry: ShortUrl = {
    slug,
    url: body.url,
    createdAt: now,
    ...(body.expiresAt && { expiresAt: body.expiresAt }),
    ...(body.description && { description: body.description }),
    ...(body.tags && { tags: body.tags }),
    ...(body.utm && { utm: body.utm }),
    ...(passwordHash && { passwordHash }),
    ...(body.ogTitle && { ogTitle: body.ogTitle }),
    ...(body.ogDescription && { ogDescription: body.ogDescription }),
    ...(body.ogImage && { ogImage: body.ogImage }),
  };

  await putUrl(c.env.URLS, slug, entry);

  const shortUrl = `${c.env.BASE_URL}/${slug}`;
  return c.json({ slug, shortUrl, url: body.url }, 201);
}
