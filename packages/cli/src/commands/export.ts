import { writeFile } from 'node:fs/promises';
import type { ShortUrl, UrlBackend } from '@clipr/core';
import { dim, info, success } from '../utils/output.js';

interface ExportOptions {
  format?: 'json' | 'csv';
  output?: string;
}

/** Convert entries to CSV format. */
function toCsv(entries: ShortUrl[]): string {
  const header = 'slug,url,description,createdAt,expiresAt,tags';
  const rows = entries.map((e) => {
    const desc = (e.description ?? '').replace(/,/g, ';');
    const tags = (e.tags ?? []).join(';');
    return `${e.slug},${e.url},${desc},${e.createdAt},${e.expiresAt ?? ''},${tags}`;
  });
  return `${[header, ...rows].join('\n')}\n`;
}

export async function exportUrls(backend: UrlBackend, opts: ExportOptions): Promise<void> {
  const entries = await backend.list();

  if (entries.length === 0) {
    info('No URLs to export.');
    return;
  }

  const format = opts.format ?? 'json';
  let output: string;

  if (format === 'csv') {
    output = toCsv(entries);
  } else {
    output = `${JSON.stringify(entries, null, 2)}\n`;
  }

  if (opts.output) {
    await writeFile(opts.output, output);
    success(`Exported ${entries.length} URL${entries.length === 1 ? '' : 's'} to ${opts.output}`);
  } else {
    process.stdout.write(output);
    if (process.stderr.isTTY) {
      info(`${dim(`${entries.length} URL${entries.length === 1 ? '' : 's'} exported`)}`);
    }
  }
}
