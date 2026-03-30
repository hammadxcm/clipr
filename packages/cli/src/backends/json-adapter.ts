import {
  appendUtm,
  type CreateOptions,
  generateRandomSlug,
  hasUtm,
  JsonBackend,
  type LinkStats,
  type ListOptions,
  normalizeSlug,
  type ResolveResult,
  type ShortUrl,
  SlugNotFoundError,
  type UrlBackend,
} from '@clipr/core';

/**
 * Wraps the simple JsonBackend to satisfy the full UrlBackend interface.
 * Used as the default/fallback when no remote backend is configured.
 */
export class JsonBackendAdapter implements UrlBackend {
  private readonly backend: JsonBackend;

  constructor(
    dbPath: string,
    readonly _baseUrl: string,
  ) {
    this.backend = new JsonBackend(dbPath);
  }

  async create(slug: string, targetUrl: string, options?: CreateOptions): Promise<ShortUrl> {
    const finalSlug = slug || generateRandomSlug(options?.utm ? 8 : 6);
    const now = new Date().toISOString();

    const entry: ShortUrl = {
      slug: normalizeSlug(finalSlug),
      url: targetUrl,
      createdAt: now,
      ...(options?.description && { description: options.description }),
      ...(options?.expiresAt && { expiresAt: options.expiresAt }),
      ...(options?.utm && hasUtm(options.utm) && { utm: options.utm }),
      ...(options?.tags && { tags: options.tags }),
      ...(options?.ogTitle && { ogTitle: options.ogTitle }),
      ...(options?.ogDescription && { ogDescription: options.ogDescription }),
      ...(options?.ogImage && { ogImage: options.ogImage }),
    };

    await this.backend.set(entry);
    return entry;
  }

  async resolve(slug: string): Promise<ResolveResult | null> {
    const entry = await this.backend.get(slug);
    if (!entry) return null;

    const expired = entry.expiresAt ? new Date(entry.expiresAt) < new Date() : false;
    const url = hasUtm(entry.utm) ? appendUtm(entry.url, entry.utm!) : entry.url;

    return {
      url,
      passwordProtected: false,
      expired,
    };
  }

  async list(options?: ListOptions): Promise<ShortUrl[]> {
    let entries = (await this.backend.list()) as ShortUrl[];

    if (options?.search) {
      const q = options.search.toLowerCase();
      entries = entries.filter(
        (e) =>
          e.slug.includes(q) ||
          e.url.toLowerCase().includes(q) ||
          e.description?.toLowerCase().includes(q),
      );
    }

    if (options?.tag) {
      entries = entries.filter((e) => e.tags?.includes(options.tag!));
    }

    if (options?.limit) {
      entries = entries.slice(0, options.limit);
    }

    return entries;
  }

  async delete(slug: string): Promise<void> {
    const deleted = await this.backend.delete(slug);
    if (!deleted) {
      throw new SlugNotFoundError(slug);
    }
  }

  async update(slug: string, updates: Partial<ShortUrl>): Promise<ShortUrl> {
    const existing = await this.backend.get(slug);
    if (!existing) {
      throw new SlugNotFoundError(slug);
    }

    // If slug is changing, delete old and create new
    const newSlug = updates.slug ?? slug;
    if (newSlug !== slug) {
      await this.backend.delete(slug);
    } else {
      // Delete old to allow re-set
      await this.backend.delete(slug);
    }

    const updated: ShortUrl = { ...existing, ...updates, slug: newSlug };
    await this.backend.set(updated);
    return updated;
  }

  async getStats(_slug: string): Promise<LinkStats | null> {
    // JsonBackend has no click tracking
    return null;
  }
}
