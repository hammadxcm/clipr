import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { JsonBackend } from '@clipr/core';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { del } from './delete.js';

describe('delete command', () => {
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

  it('deletes an existing slug', async () => {
    await backend.set({
      slug: 'del-me',
      url: 'https://x.com',
      createdAt: new Date().toISOString(),
    });
    await del('del-me', backend);
    expect(await backend.has('del-me')).toBe(false);
  });

  it('exits with 1 for non-existent slug', async () => {
    await del('ghost', backend);
    expect(process.exit).toHaveBeenCalledWith(1);
  });
});
