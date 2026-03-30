import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { JsonBackend } from '@clipr/core';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { list } from './list.js';

describe('list command', () => {
  let dir: string;
  let backend: JsonBackend;
  let logs: string[];

  beforeEach(async () => {
    dir = await mkdtemp(join(tmpdir(), 'clipr-cli-'));
    backend = new JsonBackend(join(dir, 'urls.json'));
    logs = [];
    vi.spyOn(console, 'log').mockImplementation((...args: unknown[]) => {
      logs.push(args.join(' '));
    });
  });

  afterEach(async () => {
    vi.restoreAllMocks();
    await rm(dir, { recursive: true, force: true });
  });

  it('shows empty message when no URLs', async () => {
    await list(backend);
    expect(logs.some((l) => l.includes('No shortened URLs'))).toBe(true);
  });

  it('lists all entries', async () => {
    await backend.set({ slug: 'aaa', url: 'https://a.com', createdAt: new Date().toISOString() });
    await backend.set({ slug: 'bbb', url: 'https://b.com', createdAt: new Date().toISOString() });
    await list(backend);
    expect(logs.some((l) => l.includes('2 shortened URL'))).toBe(true);
    expect(logs.some((l) => l.includes('https://a.com'))).toBe(true);
    expect(logs.some((l) => l.includes('https://b.com'))).toBe(true);
  });
});
