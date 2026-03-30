import {
  type CliprConfig,
  type CreateOptions,
  type LinkStats,
  type ListOptions,
  loadConfig,
  type ResolveResult,
  type ShortUrl,
  saveConfig,
  type UrlBackend,
} from '@clipr/core';
import { createBackend } from './factory.js';

let _backend: UrlBackend | null = null;
let _config: CliprConfig | null = null;

/** Get or create the backend singleton. */
async function getBackend(): Promise<UrlBackend> {
  if (!_backend) {
    _config = _config ?? loadConfig();
    _backend = await createBackend(_config);
  }
  return _backend;
}

/**
 * Create a short URL.
 *
 * @param url - The target URL to shorten.
 * @param options - Optional creation settings (slug, tags, expiry, etc.).
 * @returns The created short URL entry.
 *
 * @example
 * ```ts
 * import { shorten } from 'clipr';
 * const link = await shorten('https://example.com', { slug: 'demo' });
 * ```
 */
export async function shorten(url: string, options?: CreateOptions): Promise<ShortUrl> {
  const backend = await getBackend();
  return backend.create(options?.slug ?? '', url, options);
}

/**
 * List short URLs with optional filtering.
 *
 * @param options - Optional filter/search/limit settings.
 * @returns Array of short URL entries.
 *
 * @example
 * ```ts
 * import { list } from 'clipr';
 * const links = await list({ limit: 10 });
 * ```
 */
export async function list(options?: ListOptions): Promise<ShortUrl[]> {
  const backend = await getBackend();
  return backend.list(options);
}

/**
 * Resolve a slug to its target URL.
 *
 * @param slug - The short slug to resolve.
 * @returns The resolve result with target URL, or null if not found.
 *
 * @example
 * ```ts
 * import { resolve } from 'clipr';
 * const result = await resolve('demo');
 * if (result) console.log(result.url);
 * ```
 */
export async function resolve(slug: string): Promise<ResolveResult | null> {
  const backend = await getBackend();
  return backend.resolve(slug);
}

/**
 * Delete a short URL by slug.
 *
 * @param slug - The slug to delete.
 *
 * @example
 * ```ts
 * import { remove } from 'clipr';
 * await remove('demo');
 * ```
 */
export async function remove(slug: string): Promise<void> {
  const backend = await getBackend();
  return backend.delete(slug);
}

/**
 * Get click analytics for a slug.
 * Returns null if the backend does not support stats (e.g., json/github mode).
 *
 * @param slug - The slug to get stats for.
 * @returns Click analytics or null.
 *
 * @example
 * ```ts
 * import { stats } from 'clipr';
 * const data = await stats('demo');
 * if (data) console.log(`Total clicks: ${data.total}`);
 * ```
 */
export async function stats(slug: string): Promise<LinkStats | null> {
  const backend = await getBackend();
  return backend.getStats(slug);
}

/**
 * Configure the clipr backend.
 * Merges the provided config with the existing config and persists it.
 * Resets the backend singleton so subsequent calls use the new config.
 *
 * @param config - Partial config to merge.
 *
 * @example
 * ```ts
 * import { configure } from 'clipr';
 * configure({ mode: 'api', api: { baseUrl: 'https://clpr.sh', token: 'xxx' } });
 * ```
 */
export function configure(config: Partial<CliprConfig>): void {
  const current = _config ?? loadConfig();
  const merged = { ...current, ...config } as CliprConfig;
  saveConfig(merged);
  _config = merged;
  // Reset backend so next call picks up new config
  _backend = null;
}
