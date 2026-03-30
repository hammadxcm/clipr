import type { JsonBackend } from '@clipr/core';
import pc from 'picocolors';
import { dim, info } from '../utils/output.js';

export async function list(backend: JsonBackend): Promise<void> {
  const entries = await backend.list();

  if (entries.length === 0) {
    info('No shortened URLs yet. Run `clipr shorten <url>` to create one.');
    return;
  }

  const baseUrl = await backend.getBaseUrl();

  console.log(dim(`\n  ${entries.length} shortened URL${entries.length === 1 ? '' : 's'}:\n`));

  for (const entry of entries) {
    const short = baseUrl ? `${baseUrl}/${entry.slug}` : entry.slug;
    console.log(`  ${pc.bold(pc.cyan(short))}`);
    console.log(`    → ${entry.url}`);
    if (entry.description) {
      console.log(`    ${dim(entry.description)}`);
    }
    if (entry.expiresAt) {
      console.log(`    ${dim(`expires: ${entry.expiresAt}`)}`);
    }
    console.log();
  }
}
