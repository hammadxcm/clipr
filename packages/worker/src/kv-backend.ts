import type { Backend, UrlEntry } from '@clipr/core';
import { SlugConflictError } from '@clipr/core';

/**
 * Backend implementation backed by Cloudflare KV.
 *
 * Each slug is stored as a separate KV key with the UrlEntry as JSON value.
 * A special `_index` key holds the list of all slugs for the `list()` method.
 */
export class KvBackend implements Backend {
  constructor(private readonly kv: KVNamespace) {}

  async get(slug: string): Promise<UrlEntry | undefined> {
    const raw = await this.kv.get(slug, 'text');
    if (!raw) return undefined;
    return JSON.parse(raw) as UrlEntry;
  }

  async set(entry: UrlEntry): Promise<void> {
    const existing = await this.kv.get(entry.slug, 'text');
    if (existing) {
      throw new SlugConflictError(entry.slug);
    }
    await this.kv.put(entry.slug, JSON.stringify(entry));
    await this.addToIndex(entry.slug);
  }

  async delete(slug: string): Promise<boolean> {
    const existing = await this.kv.get(slug, 'text');
    if (!existing) return false;
    await this.kv.delete(slug);
    await this.removeFromIndex(slug);
    return true;
  }

  async has(slug: string): Promise<boolean> {
    const val = await this.kv.get(slug, 'text');
    return val !== null;
  }

  async list(): Promise<UrlEntry[]> {
    const slugs = await this.getIndex();
    const entries: UrlEntry[] = [];
    for (const slug of slugs) {
      const entry = await this.get(slug);
      if (entry) entries.push(entry);
    }
    return entries;
  }

  private async getIndex(): Promise<string[]> {
    const raw = await this.kv.get('_index', 'text');
    if (!raw) return [];
    return JSON.parse(raw) as string[];
  }

  private async addToIndex(slug: string): Promise<void> {
    const index = await this.getIndex();
    if (!index.includes(slug)) {
      index.push(slug);
      await this.kv.put('_index', JSON.stringify(index));
    }
  }

  private async removeFromIndex(slug: string): Promise<void> {
    const index = await this.getIndex();
    const filtered = index.filter((s) => s !== slug);
    await this.kv.put('_index', JSON.stringify(filtered));
  }
}
