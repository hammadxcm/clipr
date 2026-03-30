import type { UrlEntry } from '@clipr/core';
import { describe, expect, it } from 'vitest';
import app from '../index.js';
import { createMockKV } from '../test-utils.js';

async function seedKV(kv: KVNamespace, entry: UrlEntry): Promise<void> {
  // Use url: prefix to match kv.ts getUrl()
  await kv.put(`url:${entry.slug}`, JSON.stringify(entry));
  // Update the url index
  const raw = await kv.get('_url_index', 'text');
  const index: string[] = raw ? JSON.parse(raw) : [];
  index.push(entry.slug);
  await kv.put('_url_index', JSON.stringify(index));
}

function makeRequest(path: string, kv: KVNamespace): Promise<Response> {
  return app.request(path, {}, { URLS: kv, API_TOKEN: 'test-token', BASE_URL: 'https://clpr.sh' });
}

describe('redirect route', () => {
  it('redirects to the target URL (301)', async () => {
    const kv = createMockKV();
    await seedKV(kv, {
      slug: 'test',
      url: 'https://example.com',
      createdAt: new Date().toISOString(),
    });

    const res = await makeRequest('/test', kv);
    expect(res.status).toBe(301);
    expect(res.headers.get('Location')).toBe('https://example.com');
    expect(res.headers.get('Cache-Control')).toBe('public, max-age=300');
  });

  it('appends UTM params on redirect', async () => {
    const kv = createMockKV();
    await seedKV(kv, {
      slug: 'utm',
      url: 'https://example.com',
      createdAt: new Date().toISOString(),
      utm: { utm_source: 'twitter', utm_medium: 'social' },
    });

    const res = await makeRequest('/utm', kv);
    expect(res.status).toBe(301);
    const location = res.headers.get('Location')!;
    const url = new URL(location);
    expect(url.searchParams.get('utm_source')).toBe('twitter');
    expect(url.searchParams.get('utm_medium')).toBe('social');
  });

  it('returns 404 for missing slugs', async () => {
    const kv = createMockKV();
    const res = await makeRequest('/missing', kv);
    expect(res.status).toBe(404);
  });

  it('returns 410 for expired links', async () => {
    const kv = createMockKV();
    await seedKV(kv, {
      slug: 'old',
      url: 'https://example.com',
      createdAt: new Date().toISOString(),
      expiresAt: '2020-01-01T00:00:00Z',
    });

    const res = await makeRequest('/old', kv);
    expect(res.status).toBe(410);
  });

  it('redirects non-expired links with expiresAt', async () => {
    const kv = createMockKV();
    const future = new Date(Date.now() + 86400000).toISOString();
    await seedKV(kv, {
      slug: 'future',
      url: 'https://example.com',
      createdAt: new Date().toISOString(),
      expiresAt: future,
    });

    const res = await makeRequest('/future', kv);
    expect(res.status).toBe(301);
  });
});

describe('health route', () => {
  it('returns 200 with status ok', async () => {
    const kv = createMockKV();
    const res = await makeRequest('/health', kv);
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.status).toBe('ok');
  });
});

describe('404 handler', () => {
  it('returns 401 for deep paths without auth', async () => {
    const kv = createMockKV();
    const res = await makeRequest('/some/deep/path', kv);
    // Deep paths are not public routes, so auth middleware blocks them
    expect(res.status).toBe(401);
  });

  it('returns 404 for non-existent single-segment slugs', async () => {
    const kv = createMockKV();
    const res = await makeRequest('/nonexistent', kv);
    expect(res.status).toBe(404);
  });
});

describe('API auth', () => {
  it('returns 401 for API routes without token', async () => {
    const kv = createMockKV();
    const res = app.request('/api/links', {}, { URLS: kv, API_TOKEN: 'secret', BASE_URL: '' });
    expect((await res).status).toBe(401);
  });

  it('allows API routes with valid token', async () => {
    const kv = createMockKV();
    const res = await app.request(
      '/api/links',
      { headers: { Authorization: 'Bearer secret' } },
      { URLS: kv, API_TOKEN: 'secret', BASE_URL: '' },
    );
    expect(res.status).toBe(200);
  });
});
