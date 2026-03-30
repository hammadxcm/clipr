import type {
  CreateOptions,
  LinkStats,
  ListOptions,
  ResolveResult,
  ShortUrl,
  UrlBackend,
} from '@clipr/core';

interface ApiConfig {
  baseUrl: string;
  token: string;
}

/**
 * UrlBackend implementation using the clipr Workers API.
 * Each method maps to a REST endpoint on the deployed worker.
 */
export class ApiBackend implements UrlBackend {
  private readonly apiBase: string;
  private readonly headers: Record<string, string>;

  constructor(
    config: ApiConfig,
    readonly _shortBaseUrl: string,
  ) {
    // Strip trailing slash from API base URL
    this.apiBase = config.baseUrl.replace(/\/$/, '');
    this.headers = {
      Authorization: `Bearer ${config.token}`,
      'Content-Type': 'application/json',
    };
  }

  /** Make a request and handle errors consistently. */
  private async request<T>(
    method: string,
    path: string,
    body?: Record<string, unknown>,
  ): Promise<T> {
    const url = `${this.apiBase}${path}`;
    const init: RequestInit = {
      method,
      headers: this.headers,
    };

    if (body) {
      init.body = JSON.stringify(body);
    }

    const res = await fetch(url, init);

    if (!res.ok) {
      const text = await res.text().catch(() => '');
      let message = `API error: ${res.status} ${res.statusText}`;
      try {
        const parsed = JSON.parse(text) as { error?: string };
        if (parsed.error) message = parsed.error;
      } catch {
        if (text) message += ` — ${text}`;
      }
      throw new Error(message);
    }

    // 204 No Content
    if (res.status === 204) {
      return undefined as T;
    }

    return (await res.json()) as T;
  }

  async create(slug: string, targetUrl: string, options?: CreateOptions): Promise<ShortUrl> {
    return this.request<ShortUrl>('POST', '/api/shorten', {
      slug: slug || undefined,
      url: targetUrl,
      ...options,
    });
  }

  async resolve(slug: string): Promise<ResolveResult | null> {
    try {
      return await this.request<ResolveResult>('GET', `/api/links/${encodeURIComponent(slug)}`);
    } catch (err) {
      if (err instanceof Error && err.message.includes('404')) {
        return null;
      }
      throw err;
    }
  }

  async list(options?: ListOptions): Promise<ShortUrl[]> {
    const params = new URLSearchParams();
    if (options?.search) params.set('search', options.search);
    if (options?.tag) params.set('tag', options.tag);
    if (options?.limit) params.set('limit', String(options.limit));

    const query = params.toString();
    const path = query ? `/api/links?${query}` : '/api/links';
    return this.request<ShortUrl[]>('GET', path);
  }

  async delete(slug: string): Promise<void> {
    await this.request<void>('DELETE', `/api/links/${encodeURIComponent(slug)}`);
  }

  async update(slug: string, updates: Partial<ShortUrl>): Promise<ShortUrl> {
    return this.request<ShortUrl>('PUT', `/api/links/${encodeURIComponent(slug)}`, {
      ...(updates as Record<string, unknown>),
    });
  }

  async getStats(slug: string): Promise<LinkStats | null> {
    try {
      return await this.request<LinkStats>('GET', `/api/stats/${encodeURIComponent(slug)}`);
    } catch (err) {
      if (err instanceof Error && err.message.includes('404')) {
        return null;
      }
      throw err;
    }
  }
}
