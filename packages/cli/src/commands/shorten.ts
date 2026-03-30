import type { JsonBackend } from '@clipr/core';
import {
  generateRandomSlug,
  hasUtm,
  normalizeSlug,
  type UrlEntry,
  type UtmParams,
  validateSlug,
  validateUrl,
} from '@clipr/core';
import { dim, error, success } from '../utils/output.js';

interface ShortenOptions {
  slug?: string;
  description?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
  expires?: string;
}

export async function shorten(
  url: string,
  backend: JsonBackend,
  opts: ShortenOptions,
): Promise<void> {
  const urlResult = validateUrl(url);
  if (!urlResult.valid) {
    error(`Invalid URL: ${urlResult.reason}`);
    process.exit(1);
  }

  let slug: string;
  if (opts.slug) {
    slug = normalizeSlug(opts.slug);
    const slugResult = validateSlug(slug);
    if (!slugResult.valid) {
      error(`Invalid slug: ${slugResult.reason}`);
      process.exit(1);
    }
  } else {
    slug = generateRandomSlug();
    while (await backend.has(slug)) {
      slug = generateRandomSlug();
    }
  }

  const utm: UtmParams = {};
  if (opts.utm_source) utm.utm_source = opts.utm_source;
  if (opts.utm_medium) utm.utm_medium = opts.utm_medium;
  if (opts.utm_campaign) utm.utm_campaign = opts.utm_campaign;
  if (opts.utm_term) utm.utm_term = opts.utm_term;
  if (opts.utm_content) utm.utm_content = opts.utm_content;

  const entry: UrlEntry = {
    slug,
    url,
    createdAt: new Date().toISOString(),
    ...(opts.description && { description: opts.description }),
    ...(opts.expires && { expiresAt: new Date(opts.expires).toISOString() }),
    ...(hasUtm(utm) && { utm }),
  };

  await backend.set(entry);

  const baseUrl = await backend.getBaseUrl();
  const shortUrl = baseUrl ? `${baseUrl}/${slug}` : slug;

  success(`Shortened ${dim(url)}`);
  console.log(`  ${shortUrl}`);
}
