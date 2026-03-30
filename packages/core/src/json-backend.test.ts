import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { SlugConflictError } from './errors.js';
import { JsonBackend } from './json-backend.js';
import type { UrlEntry } from './types.js';

function makeEntry(slug: string, url = 'https://example.com'): UrlEntry {
  return { slug, url, createdAt: new Date().toISOString() };
}

describe('JsonBackend', () => {
  let dir: string;
  let dbPath: string;
  let backend: JsonBackend;

  beforeEach(async () => {
    dir = await mkdtemp(join(tmpdir(), 'clipr-test-'));
    dbPath = join(dir, 'urls.json');
    backend = new JsonBackend(dbPath);
  });

  afterEach(async () => {
    await rm(dir, { recursive: true, force: true });
  });

  it('creates the db file on first write', async () => {
    await backend.set(makeEntry('abc'));
    const entry = await backend.get('abc');
    expect(entry?.slug).toBe('abc');
  });

  it('returns undefined for missing slugs', async () => {
    expect(await backend.get('nope')).toBeUndefined();
  });

  it('stores and retrieves entries', async () => {
    const entry = makeEntry('test', 'https://test.com');
    await backend.set(entry);
    const result = await backend.get('test');
    expect(result?.url).toBe('https://test.com');
  });

  it('throws SlugConflictError on duplicate', async () => {
    await backend.set(makeEntry('dupe'));
    await expect(backend.set(makeEntry('dupe'))).rejects.toThrow(SlugConflictError);
  });

  it('lists all entries', async () => {
    await backend.set(makeEntry('aaa'));
    await backend.set(makeEntry('bbb'));
    await backend.set(makeEntry('ccc'));
    const list = await backend.list();
    expect(list).toHaveLength(3);
    expect(list.map((e) => e.slug).sort()).toEqual(['aaa', 'bbb', 'ccc']);
  });

  it('deletes entries', async () => {
    await backend.set(makeEntry('del'));
    expect(await backend.delete('del')).toBe(true);
    expect(await backend.get('del')).toBeUndefined();
  });

  it('returns false when deleting non-existent slug', async () => {
    expect(await backend.delete('ghost')).toBe(false);
  });

  it('checks if slug exists', async () => {
    await backend.set(makeEntry('exists'));
    expect(await backend.has('exists')).toBe(true);
    expect(await backend.has('nope')).toBe(false);
  });

  it('manages baseUrl', async () => {
    expect(await backend.getBaseUrl()).toBe('');
    await backend.setBaseUrl('https://clpr.sh');
    expect(await backend.getBaseUrl()).toBe('https://clpr.sh');
  });

  it('updates counter on set and delete', async () => {
    await backend.set(makeEntry('one'));
    await backend.set(makeEntry('two'));
    let list = await backend.list();
    expect(list).toHaveLength(2);

    await backend.delete('one');
    list = await backend.list();
    expect(list).toHaveLength(1);
  });
});
