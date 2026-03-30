import { writeFile } from 'node:fs/promises';
import type { UrlBackend } from '@clipr/core';
import { error, info, success } from '../utils/output.js';
import { generateQR, type QrFormat } from '../utils/qr.js';

interface QrOptions {
  output?: string;
  format?: QrFormat;
  size?: string;
}

export async function qr(slug: string, backend: UrlBackend, opts: QrOptions): Promise<void> {
  // Resolve slug to get the full short URL
  const result = await backend.resolve(slug);
  if (!result) {
    error(`Slug "${slug}" not found`);
    process.exit(1);
  }

  // Determine the short URL (the URL to encode is the short link, not the target)
  // We use the target URL since we don't always have the baseUrl in the backend interface
  // However, the backend.list approach can give us what we need
  const entries = await backend.list({ search: slug, limit: 1 });
  const entry = entries.find((e) => e.slug === slug);

  // Build the short URL to encode
  // If we can't determine baseUrl, encode the target URL
  const urlToEncode = result.url;

  const format: QrFormat = opts.format ?? 'svg';
  const size = opts.size ? parseInt(opts.size, 10) : 256;

  if (Number.isNaN(size) || size < 64 || size > 4096) {
    error('Size must be between 64 and 4096 pixels');
    process.exit(1);
  }

  try {
    const qrData = await generateQR(urlToEncode, format, size);

    if (opts.output) {
      await writeFile(opts.output, qrData);
      success(`QR code saved to ${opts.output}`);
    } else {
      // Write to stdout
      if (typeof qrData === 'string') {
        console.log(qrData);
      } else {
        process.stdout.write(qrData);
      }
    }

    if (entry) {
      info(`QR code for slug "${slug}" → ${entry.url}`);
    }
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    error(`Failed to generate QR code: ${msg}`);
    process.exit(1);
  }
}
