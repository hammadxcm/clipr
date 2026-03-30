import type {
  CreateOptions,
  LinkStats,
  ListOptions,
  ResolveResult,
  ShortUrl,
  UrlBackend,
  UrlDatabase,
} from '@clipr/core';
import {
  appendUtm,
  DB_VERSION,
  generateRandomSlug,
  hasUtm,
  normalizeSlug,
  SlugConflictError,
  SlugNotFoundError,
} from '@clipr/core';

interface GitHubConfig {
  owner: string;
  repo: string;
  branch: string;
  path: string;
  token: string;
}

interface GitHubContentsResponse {
  sha: string;
  content: string;
  encoding: string;
}

/**
 * UrlBackend implementation using the GitHub Contents API.
 * Stores all URL data in a urls.json file in a GitHub repo.
 */
export class GitHubBackend implements UrlBackend {
  private readonly apiBase: string;
  private readonly headers: Record<string, string>;

  constructor(
    private readonly config: GitHubConfig,
    private readonly shortBaseUrl: string,
  ) {
    this.apiBase = `https://api.github.com/repos/${config.owner}/${config.repo}/contents/${config.path}`;
    this.headers = {
      Authorization: `token ${config.token}`,
      Accept: 'application/vnd.github.v3+json',
      'Content-Type': 'application/json',
    };
  }

  /** Fetch the current urls.json from GitHub, returning content + SHA. */
  private async fetchDatabase(): Promise<{ db: UrlDatabase; sha: string }> {
    const url = `${this.apiBase}?ref=${this.config.branch}`;
    const res = await fetch(url, { headers: this.headers });

    if (res.status === 404) {
      // File doesn't exist yet, return empty database
      const db: UrlDatabase = {
        version: DB_VERSION,
        counter: 0,
        baseUrl: this.shortBaseUrl,
        urls: {},
      };
      return { db, sha: '' };
    }

    if (!res.ok) {
      throw new Error(`GitHub API error: ${res.status} ${res.statusText}`);
    }

    const data = (await res.json()) as GitHubContentsResponse;
    const decoded = Buffer.from(data.content, 'base64').toString('utf-8');
    const db = JSON.parse(decoded) as UrlDatabase;

    return { db, sha: data.sha };
  }

  /** Commit updated urls.json back to GitHub. */
  private async commitDatabase(db: UrlDatabase, sha: string, message: string): Promise<void> {
    const content = Buffer.from(`${JSON.stringify(db, null, 2)}\n`).toString('base64');

    const body: Record<string, string> = {
      message,
      content,
      branch: this.config.branch,
    };

    // Include SHA for updates (not for creation)
    if (sha) {
      body.sha = sha;
    }

    const res = await fetch(this.apiBase, {
      method: 'PUT',
      headers: this.headers,
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const errBody = await res.text();
      throw new Error(`GitHub API commit failed: ${res.status} ${res.statusText} — ${errBody}`);
    }
  }

  async create(slug: string, targetUrl: string, options?: CreateOptions): Promise<ShortUrl> {
    const { db, sha } = await this.fetchDatabase();
    const finalSlug = normalizeSlug(slug || generateRandomSlug());

    if (db.urls[finalSlug]) {
      throw new SlugConflictError(finalSlug);
    }

    const now = new Date().toISOString();
    const entry: ShortUrl = {
      slug: finalSlug,
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

    db.urls[finalSlug] = entry;
    db.counter = Object.keys(db.urls).length;

    await this.commitDatabase(db, sha, `clipr: add ${finalSlug} → ${targetUrl}`);
    return entry;
  }

  async resolve(slug: string): Promise<ResolveResult | null> {
    const { db } = await this.fetchDatabase();
    const entry = db.urls[slug];
    if (!entry) return null;

    const expired = entry.expiresAt ? new Date(entry.expiresAt) < new Date() : false;
    const url = hasUtm(entry.utm) ? appendUtm(entry.url, entry.utm!) : entry.url;

    return { url, passwordProtected: false, expired };
  }

  async list(options?: ListOptions): Promise<ShortUrl[]> {
    const { db } = await this.fetchDatabase();
    let entries = Object.values(db.urls) as ShortUrl[];

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
    const { db, sha } = await this.fetchDatabase();

    if (!db.urls[slug]) {
      throw new SlugNotFoundError(slug);
    }

    delete db.urls[slug];
    db.counter = Object.keys(db.urls).length;

    await this.commitDatabase(db, sha, `clipr: delete ${slug}`);
  }

  async update(slug: string, updates: Partial<ShortUrl>): Promise<ShortUrl> {
    const { db, sha } = await this.fetchDatabase();
    const existing = db.urls[slug];

    if (!existing) {
      throw new SlugNotFoundError(slug);
    }

    const newSlug = updates.slug ?? slug;

    // If renaming, check for conflict and remove old entry
    if (newSlug !== slug) {
      if (db.urls[newSlug]) {
        throw new SlugConflictError(newSlug);
      }
      delete db.urls[slug];
    }

    const updated: ShortUrl = { ...existing, ...updates, slug: newSlug };
    db.urls[newSlug] = updated;
    db.counter = Object.keys(db.urls).length;

    await this.commitDatabase(
      db,
      sha,
      `clipr: update ${slug}${newSlug !== slug ? ` → ${newSlug}` : ''}`,
    );
    return updated;
  }

  async getStats(_slug: string): Promise<LinkStats | null> {
    // GitHub mode has no click tracking
    return null;
  }
}
