import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import type { UrlBackend } from '@clipr/core';
import { dim, error, info, success } from '../utils/output.js';

interface ImportOptions {
  format?: 'json' | 'csv';
}

interface ImportEntry {
  slug: string;
  url: string;
  description?: string;
  expiresAt?: string;
  tags?: string[];
}

/** Parse a CSV string into import entries. */
function parseCsv(content: string): ImportEntry[] {
  const lines = content.trim().split('\n');
  if (lines.length < 2) return [];

  const header = lines[0]?.split(',').map((h) => h.trim().toLowerCase());
  const slugIdx = header.indexOf('slug');
  const urlIdx = header.indexOf('url');
  const descIdx = header.indexOf('description');
  const expiresIdx = header.indexOf('expiresat');
  const tagsIdx = header.indexOf('tags');

  if (slugIdx === -1 || urlIdx === -1) {
    throw new Error('CSV must have "slug" and "url" columns');
  }

  return lines.slice(1).map((line) => {
    const cols = line.split(',').map((c) => c.trim());
    const entry: ImportEntry = {
      slug: cols[slugIdx]!,
      url: cols[urlIdx]!,
    };
    if (descIdx !== -1 && cols[descIdx]) entry.description = cols[descIdx];
    if (expiresIdx !== -1 && cols[expiresIdx]) entry.expiresAt = cols[expiresIdx];
    if (tagsIdx !== -1 && cols[tagsIdx])
      entry.tags = cols[tagsIdx]?.split(';').map((t) => t.trim());
    return entry;
  });
}

export async function importUrls(
  file: string,
  backend: UrlBackend,
  opts: ImportOptions,
): Promise<void> {
  let content: string;
  try {
    const resolvedPath = resolve(file);
    content = await readFile(resolvedPath, 'utf-8');
  } catch {
    error(`Cannot read file: ${file}`);
    process.exit(1);
  }

  const format = opts.format ?? (file.endsWith('.csv') ? 'csv' : 'json');
  let entries: ImportEntry[];

  try {
    if (format === 'csv') {
      entries = parseCsv(content);
    } else {
      const parsed = JSON.parse(content);
      // Support both array and { urls: [...] } shapes
      entries = Array.isArray(parsed) ? parsed : (parsed.urls ?? Object.values(parsed));
    }
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    error(`Failed to parse ${format.toUpperCase()} file: ${msg}`);
    process.exit(1);
  }

  if (entries.length === 0) {
    info('No entries found in import file.');
    return;
  }

  info(`Importing ${entries.length} URL${entries.length === 1 ? '' : 's'}...`);

  let imported = 0;
  let skipped = 0;

  for (const entry of entries) {
    if (!entry.slug || !entry.url) {
      skipped++;
      continue;
    }

    try {
      await backend.create(entry.slug, entry.url, {
        description: entry.description,
        expiresAt: entry.expiresAt,
        tags: entry.tags,
      });
      imported++;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      console.log(`  ${dim(`skip "${entry.slug}": ${msg}`)}`);
      skipped++;
    }
  }

  success(`Imported ${imported} URL${imported === 1 ? '' : 's'}`);
  if (skipped > 0) {
    info(`${skipped} entr${skipped === 1 ? 'y' : 'ies'} skipped (conflicts or invalid)`);
  }
}
