import type { CreateOptions, LinkStats, ListOptions, ResolveResult, ShortUrl } from './types.js';

/**
 * Simple backend interface for basic CRUD operations.
 * Used by JsonBackend and KvBackend.
 */
export interface Backend {
  /** Get a URL entry by slug. Returns undefined if not found. */
  get(slug: string): Promise<ShortUrl | undefined>;

  /** Store a new URL entry. Throws SlugConflictError if slug exists. */
  set(entry: ShortUrl): Promise<void>;

  /** Delete a URL entry by slug. Returns true if it existed. */
  delete(slug: string): Promise<boolean>;

  /** Check if a slug exists. */
  has(slug: string): Promise<boolean>;

  /** List all URL entries. */
  list(): Promise<ShortUrl[]>;
}

/**
 * Full backend interface (Strategy pattern) as specified in the plan.
 * Includes create/resolve/update/getStats for CLI and Worker use.
 */
export interface UrlBackend {
  /** Create a new short URL. */
  create(slug: string, targetUrl: string, options?: CreateOptions): Promise<ShortUrl>;

  /** Resolve a slug to its target URL. Returns null if not found. */
  resolve(slug: string): Promise<ResolveResult | null>;

  /** List short URLs with optional filtering. */
  list(options?: ListOptions): Promise<ShortUrl[]>;

  /** Delete a short URL by slug. */
  delete(slug: string): Promise<void>;

  /** Update an existing short URL. */
  update(slug: string, updates: Partial<ShortUrl>): Promise<ShortUrl>;

  /** Get click analytics for a slug. Returns null if backend doesn't support stats. */
  getStats(slug: string): Promise<LinkStats | null>;
}
