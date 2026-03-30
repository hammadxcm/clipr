import type { JsonBackend } from '@clipr/core';
import { appendUtm, hasUtm } from '@clipr/core';
import pc from 'picocolors';
import { dim, error } from '../utils/output.js';

export async function info(slug: string, backend: JsonBackend): Promise<void> {
  const entry = await backend.get(slug);
  if (!entry) {
    error(`Slug "${slug}" not found`);
    process.exit(1);
  }

  const baseUrl = await backend.getBaseUrl();
  const shortUrl = baseUrl ? `${baseUrl}/${entry.slug}` : entry.slug;
  const redirectUrl = hasUtm(entry.utm) ? appendUtm(entry.url, entry.utm) : entry.url;

  console.log();
  console.log(`  ${pc.bold('Slug:')}       ${pc.cyan(entry.slug)}`);
  console.log(`  ${pc.bold('Short URL:')}  ${shortUrl}`);
  console.log(`  ${pc.bold('Target:')}     ${entry.url}`);
  if (redirectUrl !== entry.url) {
    console.log(`  ${pc.bold('Redirect:')}   ${dim(redirectUrl)}`);
  }
  if (entry.description) {
    console.log(`  ${pc.bold('Note:')}       ${entry.description}`);
  }
  console.log(`  ${pc.bold('Created:')}    ${entry.createdAt}`);
  if (entry.expiresAt) {
    console.log(`  ${pc.bold('Expires:')}    ${entry.expiresAt}`);
  }
  if (hasUtm(entry.utm)) {
    console.log(`  ${pc.bold('UTM:')}`);
    for (const [key, value] of Object.entries(entry.utm)) {
      if (value) console.log(`    ${dim(key)}: ${value}`);
    }
  }
  console.log();
}
