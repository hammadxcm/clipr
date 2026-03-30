import { SlugConflictError } from '@clipr/core';
import { describe, expect, it } from 'vitest';
import { KvBackend } from './kv-backend.js';
import { createMockKV } from './test-utils.js';

function makeEntry(slug: string, url = 'https://example.com') {
  return { slug, url, createdAt: new Date().toISOString() };
}

describe('KvBackend', () => {
  it('stores and retrieves entries', async () => {
    const backend = new KvBackend(createMockKV());
    await backend.set(makeEntry('abc', 'https://test.com'));
    const entry = await backend.get('abc');
    expect(entry?.url).toBe('https://test.com');
  });

  it('returns undefined for missing slugs', async () => {
    const backend = new KvBackend(createMockKV());
    expect(await backend.get('nope')).toBeUndefined();
  });

  it('throws SlugConflictError on duplicate', async () => {
    const backend = new KvBackend(createMockKV());
    await backend.set(makeEntry('dupe'));
    await expect(backend.set(makeEntry('dupe'))).rejects.toThrow(SlugConflictError);
  });

  it('deletes entries', async () => {
    const backend = new KvBackend(createMockKV());
    await backend.set(makeEntry('del'));
    expect(await backend.delete('del')).toBe(true);
    expect(await backend.get('del')).toBeUndefined();
  });

  it('returns false when deleting non-existent slug', async () => {
    const backend = new KvBackend(createMockKV());
    expect(await backend.delete('ghost')).toBe(false);
  });

  it('checks existence', async () => {
    const backend = new KvBackend(createMockKV());
    await backend.set(makeEntry('exists'));
    expect(await backend.has('exists')).toBe(true);
    expect(await backend.has('nope')).toBe(false);
  });

  it('lists all entries', async () => {
    const backend = new KvBackend(createMockKV());
    await backend.set(makeEntry('aaa'));
    await backend.set(makeEntry('bbb'));
    const entries = await backend.list();
    expect(entries).toHaveLength(2);
    expect(entries.map((e) => e.slug).sort()).toEqual(['aaa', 'bbb']);
  });
});
