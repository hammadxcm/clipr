import { resolve } from 'node:path';
import { DEFAULT_DB_PATH, JsonBackend } from '@clipr/core';

/** Resolve the database path and create a backend instance. */
export function createBackend(dbPath?: string): JsonBackend {
  const resolved = resolve(dbPath ?? DEFAULT_DB_PATH);
  return new JsonBackend(resolved);
}
