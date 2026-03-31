import type { ShortUrl } from '@clipr/core';
import { beforeEach, describe, expect, it } from 'vitest';
import app from '../index.js';
import { createMockKV } from '../test-utils.js';

const AUTH = { Authorization: 'Bearer test-token' };
const ENV = (kv: KVNamespace) => ({
  URLS: kv,
  API_TOKEN: 'test-token',
  BASE_URL: 'https://test.sh',
});

async function seedKV(kv: KVNamespace, entry: ShortUrl): Promise<void> {
  await kv.put(`url:${entry.slug}`, JSON.stringify(entry));
  const raw = await kv.get('_url_index', 'text');
  const index: string[] = raw ? JSON.parse(raw) : [];
  index.push(entry.slug);
  await kv.put('_url_index', JSON.stringify(index));
}

function makeEntry(slug: string, url = 'https://example.com'): ShortUrl {
  return { slug, url, createdAt: new Date().toISOString() };
}

// --- POST /api/shorten ---
describe('POST /api/shorten', () => {
  let kv: KVNamespace;

  beforeEach(() => {
    kv = createMockKV();
  });

  it('creates a short URL with auto-generated slug', async () => {
    const res = await app.request(
      '/api/shorten',
      {
        method: 'POST',
        headers: { ...AUTH, 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: 'https://example.com' }),
      },
      ENV(kv),
    );
    expect(res.status).toBe(201);
    const body = await res.json();
    expect(body.slug).toBeDefined();
    expect(body.shortUrl).toContain('https://test.sh/');
    expect(body.url).toBe('https://example.com');
  });

  it('creates a short URL with a custom slug', async () => {
    const res = await app.request(
      '/api/shorten',
      {
        method: 'POST',
        headers: { ...AUTH, 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: 'https://example.com', slug: 'my-link' }),
      },
      ENV(kv),
    );
    expect(res.status).toBe(201);
    const body = await res.json();
    expect(body.slug).toBe('my-link');
  });

  it('rejects invalid URL', async () => {
    const res = await app.request(
      '/api/shorten',
      {
        method: 'POST',
        headers: { ...AUTH, 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: 'not-a-url' }),
      },
      ENV(kv),
    );
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toMatch(/Invalid URL/);
  });

  it('rejects missing url field', async () => {
    const res = await app.request(
      '/api/shorten',
      {
        method: 'POST',
        headers: { ...AUTH, 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      },
      ENV(kv),
    );
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toMatch(/Missing required field/);
  });

  it('rejects invalid JSON body', async () => {
    const res = await app.request(
      '/api/shorten',
      {
        method: 'POST',
        headers: { ...AUTH, 'Content-Type': 'application/json' },
        body: 'not json',
      },
      ENV(kv),
    );
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toMatch(/Invalid JSON/);
  });

  it('allows request without auth (public endpoint)', async () => {
    const res = await app.request(
      '/api/shorten',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: 'https://example.com/public-test' }),
      },
      ENV(kv),
    );
    expect(res.status).toBe(201);
  });

  it('rejects duplicate custom slug', async () => {
    await seedKV(kv, makeEntry('taken'));
    const res = await app.request(
      '/api/shorten',
      {
        method: 'POST',
        headers: { ...AUTH, 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: 'https://example.com', slug: 'taken' }),
      },
      ENV(kv),
    );
    expect(res.status).toBe(409);
  });

  it('rejects invalid custom slug format', async () => {
    const res = await app.request(
      '/api/shorten',
      {
        method: 'POST',
        headers: { ...AUTH, 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: 'https://example.com', slug: 'A!' }),
      },
      ENV(kv),
    );
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toMatch(/Invalid slug/);
  });

  it('stores optional fields (description, tags, utm)', async () => {
    const res = await app.request(
      '/api/shorten',
      {
        method: 'POST',
        headers: { ...AUTH, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: 'https://example.com',
          slug: 'full',
          description: 'A test link',
          tags: ['marketing'],
          utm: { utm_source: 'twitter' },
        }),
      },
      ENV(kv),
    );
    expect(res.status).toBe(201);
    // Verify the entry was stored with metadata
    const raw = await kv.get('url:full', 'text');
    const stored = JSON.parse(raw!) as ShortUrl;
    expect(stored.description).toBe('A test link');
    expect(stored.tags).toEqual(['marketing']);
    expect(stored.utm?.utm_source).toBe('twitter');
  });
});

// --- GET /api/links ---
describe('GET /api/links', () => {
  let kv: KVNamespace;

  beforeEach(async () => {
    kv = createMockKV();
    await seedKV(kv, makeEntry('aaa', 'https://a.com'));
    await seedKV(kv, makeEntry('bbb', 'https://b.com'));
  });

  it('lists all links', async () => {
    const res = await app.request('/api/links', { headers: AUTH }, ENV(kv));
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body).toHaveLength(2);
  });

  it('returns empty array when no links exist', async () => {
    const emptyKv = createMockKV();
    const res = await app.request('/api/links', { headers: AUTH }, ENV(emptyKv));
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body).toEqual([]);
  });

  it('filters by search query', async () => {
    const res = await app.request('/api/links?search=aaa', { headers: AUTH }, ENV(kv));
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body).toHaveLength(1);
    expect(body[0].slug).toBe('aaa');
  });

  it('applies limit parameter', async () => {
    const res = await app.request('/api/links?limit=1', { headers: AUTH }, ENV(kv));
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body).toHaveLength(1);
  });

  it('filters by tag', async () => {
    await seedKV(kv, { ...makeEntry('tagged'), tags: ['promo'] });
    const res = await app.request('/api/links?tag=promo', { headers: AUTH }, ENV(kv));
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body).toHaveLength(1);
    expect(body[0].slug).toBe('tagged');
  });
});

// --- GET /api/links/:code ---
describe('GET /api/links/:code', () => {
  let kv: KVNamespace;

  beforeEach(async () => {
    kv = createMockKV();
    await seedKV(kv, makeEntry('mylink', 'https://example.com'));
  });

  it('returns a single link', async () => {
    const res = await app.request('/api/links/mylink', { headers: AUTH }, ENV(kv));
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.slug).toBe('mylink');
    expect(body.url).toBe('https://example.com');
  });

  it('returns 404 for missing link', async () => {
    const res = await app.request('/api/links/nonexistent', { headers: AUTH }, ENV(kv));
    expect(res.status).toBe(404);
    const body = await res.json();
    expect(body.error).toMatch(/not found/);
  });
});

// --- PUT /api/links/:code ---
describe('PUT /api/links/:code', () => {
  let kv: KVNamespace;

  beforeEach(async () => {
    kv = createMockKV();
    await seedKV(kv, makeEntry('editable', 'https://old.com'));
  });

  it('updates an existing link', async () => {
    const res = await app.request(
      '/api/links/editable',
      {
        method: 'PUT',
        headers: { ...AUTH, 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: 'https://new.com', description: 'Updated' }),
      },
      ENV(kv),
    );
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.url).toBe('https://new.com');
    expect(body.description).toBe('Updated');
    // slug and createdAt remain unchanged
    expect(body.slug).toBe('editable');
  });

  it('returns 404 for missing link', async () => {
    const res = await app.request(
      '/api/links/ghost',
      {
        method: 'PUT',
        headers: { ...AUTH, 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: 'https://new.com' }),
      },
      ENV(kv),
    );
    expect(res.status).toBe(404);
  });

  it('returns 400 for invalid JSON body', async () => {
    const res = await app.request(
      '/api/links/editable',
      {
        method: 'PUT',
        headers: { ...AUTH, 'Content-Type': 'application/json' },
        body: 'not json',
      },
      ENV(kv),
    );
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toMatch(/Invalid JSON/);
  });
});

// --- DELETE /api/links/:code ---
describe('DELETE /api/links/:code', () => {
  let kv: KVNamespace;

  beforeEach(async () => {
    kv = createMockKV();
    await seedKV(kv, makeEntry('delme', 'https://example.com'));
  });

  it('deletes an existing link', async () => {
    const res = await app.request('/api/links/delme', { method: 'DELETE', headers: AUTH }, ENV(kv));
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.ok).toBe(true);
    expect(body.deleted).toBe('delme');

    // Verify deleted
    const check = await app.request('/api/links/delme', { headers: AUTH }, ENV(kv));
    expect(check.status).toBe(404);
  });

  it('returns 404 for missing link', async () => {
    const res = await app.request('/api/links/ghost', { method: 'DELETE', headers: AUTH }, ENV(kv));
    expect(res.status).toBe(404);
  });
});

// --- GET /api/stats/:code ---
describe('GET /api/stats/:code', () => {
  let kv: KVNamespace;

  beforeEach(async () => {
    kv = createMockKV();
    await seedKV(kv, makeEntry('tracked', 'https://example.com'));
  });

  it('returns empty stats for a link with no clicks', async () => {
    const res = await app.request('/api/stats/tracked', { headers: AUTH }, ENV(kv));
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.code).toBe('tracked');
    expect(body.total).toBe(0);
    expect(body.daily).toEqual({});
    expect(body.geo).toEqual({});
    expect(body.device).toEqual({});
    expect(body.referrer).toEqual({});
  });

  it('returns 404 for non-existent link', async () => {
    const res = await app.request('/api/stats/missing', { headers: AUTH }, ENV(kv));
    expect(res.status).toBe(404);
  });

  it('returns accumulated stats', async () => {
    // Seed some stats directly in KV
    await kv.put('stats:tracked:total', '5');
    await kv.put('stats:tracked:daily:2025-01-01', '3');
    await kv.put('stats:tracked:daily:2025-01-02', '2');
    await kv.put('geo:tracked:US', '4');
    await kv.put('device:tracked:mobile', '2');
    await kv.put('referrer:tracked:google.com', '3');

    const res = await app.request('/api/stats/tracked', { headers: AUTH }, ENV(kv));
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.total).toBe(5);
    expect(body.daily['2025-01-01']).toBe(3);
    expect(body.daily['2025-01-02']).toBe(2);
    expect(body.geo.US).toBe(4);
    expect(body.device.mobile).toBe(2);
    expect(body.referrer['google.com']).toBe(3);
  });
});

// --- GET /api/export ---
describe('GET /api/export', () => {
  it('exports all links as JSON array', async () => {
    const kv = createMockKV();
    await seedKV(kv, makeEntry('exp1', 'https://a.com'));
    await seedKV(kv, makeEntry('exp2', 'https://b.com'));

    const res = await app.request('/api/export', { headers: AUTH }, ENV(kv));
    expect(res.status).toBe(200);
    expect(res.headers.get('Content-Disposition')).toContain('clipr-export.json');
    const body = await res.json();
    expect(body).toHaveLength(2);
    expect(body.map((e: ShortUrl) => e.slug).sort()).toEqual(['exp1', 'exp2']);
  });

  it('exports empty array when no links', async () => {
    const kv = createMockKV();
    const res = await app.request('/api/export', { headers: AUTH }, ENV(kv));
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body).toEqual([]);
  });
});

// --- POST /api/import ---
describe('POST /api/import', () => {
  let kv: KVNamespace;

  beforeEach(() => {
    kv = createMockKV();
  });

  it('imports links from a JSON array', async () => {
    const entries = [
      { slug: 'imp1', url: 'https://a.com', createdAt: '2025-01-01T00:00:00Z' },
      { slug: 'imp2', url: 'https://b.com', createdAt: '2025-01-02T00:00:00Z' },
    ];
    const res = await app.request(
      '/api/import',
      {
        method: 'POST',
        headers: { ...AUTH, 'Content-Type': 'application/json' },
        body: JSON.stringify(entries),
      },
      ENV(kv),
    );
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.imported).toBe(2);
    expect(body.total).toBe(2);
    expect(body.errors).toEqual([]);
  });

  it('skips entries missing slug or url', async () => {
    const entries = [
      { slug: 'good', url: 'https://a.com', createdAt: '2025-01-01T00:00:00Z' },
      { slug: '', url: 'https://b.com', createdAt: '2025-01-01T00:00:00Z' },
      { slug: 'no-url', url: '', createdAt: '2025-01-01T00:00:00Z' },
    ];
    const res = await app.request(
      '/api/import',
      {
        method: 'POST',
        headers: { ...AUTH, 'Content-Type': 'application/json' },
        body: JSON.stringify(entries),
      },
      ENV(kv),
    );
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.imported).toBe(1);
    expect(body.errors).toHaveLength(2);
  });

  it('rejects invalid JSON', async () => {
    const res = await app.request(
      '/api/import',
      {
        method: 'POST',
        headers: { ...AUTH, 'Content-Type': 'application/json' },
        body: 'not json',
      },
      ENV(kv),
    );
    expect(res.status).toBe(400);
  });
});
