import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { JsonBackend } from '@clipr/core';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { shorten } from './shorten.js';

describe('shorten command', () => {
  let dir: string;
  let backend: JsonBackend;

  beforeEach(async () => {
    dir = await mkdtemp(join(tmpdir(), 'clipr-cli-'));
    backend = new JsonBackend(join(dir, 'urls.json'));
    vi.spyOn(console, 'log').mockImplementation(() => {});
    vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.spyOn(process, 'exit').mockImplementation(() => undefined as never);
  });

  afterEach(async () => {
    vi.restoreAllMocks();
    await rm(dir, { recursive: true, force: true });
  });

  it('creates a short link with random slug', async () => {
    await shorten('https://example.com', backend, {});
    const entries = await backend.list();
    expect(entries).toHaveLength(1);
    expect(entries[0]?.url).toBe('https://example.com');
  });

  it('creates a short link with custom slug', async () => {
    await shorten('https://example.com', backend, { slug: 'my-link' });
    const entry = await backend.get('my-link');
    expect(entry?.url).toBe('https://example.com');
  });

  it('attaches UTM params', async () => {
    await shorten('https://example.com', backend, {
      slug: 'utm-test',
      utm_source: 'twitter',
      utm_medium: 'social',
    });
    const entry = await backend.get('utm-test');
    expect(entry?.utm?.utm_source).toBe('twitter');
    expect(entry?.utm?.utm_medium).toBe('social');
  });

  it('attaches description', async () => {
    await shorten('https://example.com', backend, {
      slug: 'desc-test',
      description: 'Test link',
    });
    const entry = await backend.get('desc-test');
    expect(entry?.description).toBe('Test link');
  });

  it('rejects invalid URL', async () => {
    await shorten('not-a-url', backend, {});
    expect(process.exit).toHaveBeenCalledWith(1);
  });

  it('rejects invalid custom slug', async () => {
    await shorten('https://example.com', backend, { slug: 'A!' });
    expect(process.exit).toHaveBeenCalledWith(1);
  });
});
