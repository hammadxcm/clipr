import { readFile, writeFile } from 'node:fs/promises';
import type { Backend } from './backend.js';
import { DB_VERSION } from './constants.js';
import { SlugConflictError } from './errors.js';
import type { UrlDatabase, UrlEntry } from './types.js';

function emptyDb(): UrlDatabase {
  return { version: DB_VERSION, counter: 0, baseUrl: '', urls: {} };
}

export class JsonBackend implements Backend {
  constructor(private readonly path: string) {}

  private async read(): Promise<UrlDatabase> {
    try {
      const raw = await readFile(this.path, 'utf-8');
      return JSON.parse(raw) as UrlDatabase;
    } catch (err: unknown) {
      if ((err as NodeJS.ErrnoException).code === 'ENOENT') {
        return emptyDb();
      }
      throw err;
    }
  }

  private async write(db: UrlDatabase): Promise<void> {
    await writeFile(this.path, `${JSON.stringify(db, null, 2)}\n`);
  }

  async get(slug: string): Promise<UrlEntry | undefined> {
    const db = await this.read();
    return db.urls[slug];
  }

  async set(entry: UrlEntry): Promise<void> {
    const db = await this.read();
    if (db.urls[entry.slug]) {
      throw new SlugConflictError(entry.slug);
    }
    db.urls[entry.slug] = entry;
    db.counter = Object.keys(db.urls).length;
    await this.write(db);
  }

  async delete(slug: string): Promise<boolean> {
    const db = await this.read();
    if (!db.urls[slug]) {
      return false;
    }
    delete db.urls[slug];
    db.counter = Object.keys(db.urls).length;
    await this.write(db);
    return true;
  }

  async has(slug: string): Promise<boolean> {
    const db = await this.read();
    return slug in db.urls;
  }

  async list(): Promise<UrlEntry[]> {
    const db = await this.read();
    return Object.values(db.urls);
  }

  /** Update the baseUrl in the database. */
  async setBaseUrl(baseUrl: string): Promise<void> {
    const db = await this.read();
    db.baseUrl = baseUrl;
    await this.write(db);
  }

  /** Get the current baseUrl. */
  async getBaseUrl(): Promise<string> {
    const db = await this.read();
    return db.baseUrl;
  }
}
