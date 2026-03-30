import type { JsonBackend } from '@clipr/core';
import { error, success } from '../utils/output.js';

export async function del(slug: string, backend: JsonBackend): Promise<void> {
  const deleted = await backend.delete(slug);
  if (deleted) {
    success(`Deleted slug "${slug}"`);
  } else {
    error(`Slug "${slug}" not found`);
    process.exit(1);
  }
}
