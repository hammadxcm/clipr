import { existsSync } from 'node:fs';
import { writeFile } from 'node:fs/promises';
import type { UrlDatabase } from '@clipr/core';
import { DB_VERSION } from '@clipr/core';
import { dim, error, info, success } from '../utils/output.js';

interface InitOptions {
  baseUrl?: string;
  force?: boolean;
}

export async function init(dbPath: string, opts: InitOptions): Promise<void> {
  if (existsSync(dbPath) && !opts.force) {
    error(`${dbPath} already exists. Use --force to overwrite.`);
    process.exit(1);
  }

  const db: UrlDatabase = {
    version: DB_VERSION,
    counter: 0,
    baseUrl: opts.baseUrl ?? '',
    urls: {},
  };

  await writeFile(dbPath, `${JSON.stringify(db, null, 2)}\n`);

  success(`Created ${dbPath}`);
  if (opts.baseUrl) {
    info(`Base URL set to ${dim(opts.baseUrl)}`);
  } else {
    info(`Set a base URL with: clipr config baseUrl https://your-domain.com`);
  }
}
