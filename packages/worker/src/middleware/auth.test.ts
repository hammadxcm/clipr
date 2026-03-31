import { describe, expect, it } from 'vitest';
import app from '../index.js';
import { createMockKV } from '../test-utils.js';

const ENV = (kv: KVNamespace) => ({
  URLS: kv,
  API_TOKEN: 'test-token',
  BASE_URL: 'https://test.sh',
});

describe('auth middleware', () => {
  // --- Public routes pass without token ---
  it('allows GET /health without token', async () => {
    const kv = createMockKV();
    const res = await app.request('/health', {}, ENV(kv));
    expect(res.status).toBe(200);
  });

  it('allows GET /:slug without token (redirect/404)', async () => {
    const kv = createMockKV();
    const res = await app.request('/some-slug', {}, ENV(kv));
    // No entry seeded, so it returns 404 — but NOT 401
    expect(res.status).toBe(404);
  });

  // --- API routes require token ---
  it('returns 401 for API route without Authorization header', async () => {
    const kv = createMockKV();
    const res = await app.request('/api/links', {}, ENV(kv));
    expect(res.status).toBe(401);
    const body = await res.json();
    expect(body.error).toMatch(/Missing Authorization/);
  });

  it('returns 401 for API route with wrong token', async () => {
    const kv = createMockKV();
    const res = await app.request(
      '/api/links',
      { headers: { Authorization: 'Bearer wrong-token' } },
      ENV(kv),
    );
    expect(res.status).toBe(401);
    const body = await res.json();
    expect(body.error).toMatch(/Invalid API token/);
  });

  it('returns 401 for malformed Authorization header', async () => {
    const kv = createMockKV();
    const res = await app.request(
      '/api/links',
      { headers: { Authorization: 'Basic abc123' } },
      ENV(kv),
    );
    expect(res.status).toBe(401);
    const body = await res.json();
    expect(body.error).toMatch(/Invalid Authorization format/);
  });

  it('allows API route with correct Bearer token', async () => {
    const kv = createMockKV();
    const res = await app.request(
      '/api/links',
      { headers: { Authorization: 'Bearer test-token' } },
      ENV(kv),
    );
    expect(res.status).toBe(200);
  });

  it('allows POST /password/:code without token', async () => {
    const kv = createMockKV();
    const res = await app.request(
      '/password/some-code',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: 'password=test',
      },
      ENV(kv),
    );
    // The route may return 404 if link not found, but NOT 401
    expect(res.status).not.toBe(401);
  });
});
