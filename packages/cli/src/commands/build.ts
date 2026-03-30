import { existsSync, mkdirSync } from 'node:fs';
import { readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import type { UrlDatabase, UrlEntry } from '@clipr/core';
import { appendUtm, hasUtm } from '@clipr/core';
import { dim, error, info, success } from '../utils/output.js';

interface BuildOptions {
  input?: string;
  output?: string;
}

/**
 * Generate a bare-minimum HTML redirect page (~500 bytes).
 * Uses both meta refresh and JavaScript redirect for maximum compatibility.
 */
function buildRedirectHtml(entry: UrlEntry): string {
  const target = hasUtm(entry.utm) ? appendUtm(entry.url, entry.utm!) : entry.url;
  const escaped = target.replace(/"/g, '&quot;').replace(/</g, '&lt;');

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta http-equiv="refresh" content="0;url=${escaped}">
<title>Redirecting...</title>
<link rel="canonical" href="${escaped}">
</head>
<body>
<script>window.location.replace("${target.replace(/\\/g, '\\\\').replace(/"/g, '\\"')}")</script>
<noscript><a href="${escaped}">Click here</a></noscript>
</body>
</html>
`;
}

export async function build(opts: BuildOptions): Promise<void> {
  const inputPath = opts.input ?? 'urls.json';
  const outputDir = opts.output ?? 'dist';

  if (!existsSync(inputPath)) {
    error(`Input file not found: ${inputPath}`);
    info('Run `clipr init` to create a urls.json database, or specify --input <path>.');
    process.exit(1);
  }

  let db: UrlDatabase;
  try {
    const raw = await readFile(inputPath, 'utf-8');
    db = JSON.parse(raw) as UrlDatabase;
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    error(`Failed to parse ${inputPath}: ${msg}`);
    process.exit(1);
  }

  const entries = Object.values(db.urls);
  if (entries.length === 0) {
    info('No URLs to build. Add some with `clipr shorten <url>`.');
    return;
  }

  // Create output directory
  mkdirSync(outputDir, { recursive: true });

  info(`Building ${entries.length} redirect page${entries.length === 1 ? '' : 's'}...`);

  let built = 0;
  for (const entry of entries) {
    // Skip expired entries
    if (entry.expiresAt && new Date(entry.expiresAt) < new Date()) {
      console.log(`  ${dim(`skip "${entry.slug}" (expired)`)}`);
      continue;
    }

    const slugDir = join(outputDir, entry.slug);
    mkdirSync(slugDir, { recursive: true });

    const html = buildRedirectHtml(entry);
    await writeFile(join(slugDir, 'index.html'), html);
    built++;
  }

  // Generate a simple index page
  const indexHtml = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>clipr</title>
</head>
<body>
<p>${built} redirect${built === 1 ? '' : 's'} active.</p>
</body>
</html>
`;
  await writeFile(join(outputDir, 'index.html'), indexHtml);

  success(`Built ${built} redirect page${built === 1 ? '' : 's'} to ${outputDir}/`);
}
