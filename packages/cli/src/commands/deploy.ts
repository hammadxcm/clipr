import { execFile } from 'node:child_process';
import { writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { promisify } from 'node:util';
import type { JsonBackend } from '@clipr/core';
import { dim, error, info, success } from '../utils/output.js';

const exec = promisify(execFile);

interface DeployOptions {
  namespaceId: string;
  preview?: boolean;
}

export async function deploy(backend: JsonBackend, opts: DeployOptions): Promise<void> {
  // Validate namespace ID format to prevent injection
  if (!/^[a-f0-9]{32}$/.test(opts.namespaceId)) {
    error('Invalid namespace ID format. Expected 32-character hex string.');
    process.exit(1);
  }

  const entries = await backend.list();

  if (entries.length === 0) {
    info('No URLs to deploy. Run `clipr shorten <url>` first.');
    return;
  }

  // Build KV bulk data: each entry is a { key, value } pair
  const kvPairs = entries.map((entry) => ({
    key: entry.slug,
    value: JSON.stringify(entry),
  }));

  // Add the _index key for list() support in the worker
  kvPairs.push({
    key: '_index',
    value: JSON.stringify(entries.map((e) => e.slug)),
  });

  // Write to a temp file for wrangler kv bulk put
  const tmpFile = join(tmpdir(), `clipr-deploy-${Date.now()}.json`);
  await writeFile(tmpFile, JSON.stringify(kvPairs, null, 2));

  info(`Deploying ${entries.length} URL${entries.length === 1 ? '' : 's'} to KV...`);

  try {
    const args = ['kv', 'bulk', 'put', tmpFile, '--namespace-id', opts.namespaceId];
    if (opts.preview) {
      args.push('--preview');
    }

    const { stdout, stderr } = await exec('npx', ['wrangler', ...args]);
    if (stdout) console.log(dim(stdout.trim()));
    if (stderr && !stderr.includes('deprecated')) console.error(dim(stderr.trim()));

    success(`Deployed ${entries.length} URL${entries.length === 1 ? '' : 's'} to Cloudflare KV`);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    error(`Deploy failed: ${msg}`);
    info('Make sure wrangler is installed and you are logged in (`npx wrangler login`)');
    process.exit(1);
  }
}
