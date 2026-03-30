import { resolve } from 'node:path';
import type { UrlBackend } from '@clipr/core';
import { DEFAULT_DB_PATH, loadConfig } from '@clipr/core';
import { Command } from 'commander';
import { build } from './commands/build.js';
import { config } from './commands/config.js';
import { del } from './commands/delete.js';
import { deploy } from './commands/deploy.js';
import { edit } from './commands/edit.js';
import { exportUrls } from './commands/export.js';
import { importUrls } from './commands/import.js';
import { info } from './commands/info.js';
import { init } from './commands/init.js';
import { list } from './commands/list.js';
import { qr } from './commands/qr.js';
import { shorten } from './commands/shorten.js';
import { stats } from './commands/stats.js';
import { createBackend as createFactoryBackend } from './factory.js';
import { createBackend as createJsonBackend } from './utils/context.js';
import { error } from './utils/output.js';

const program = new Command();

/**
 * Resolve the backend for the current command.
 * If --db is passed, use the legacy JsonBackend directly.
 * Otherwise, load config and use the factory pattern.
 */
async function resolveBackend(globalOpts: { db?: string }): Promise<UrlBackend> {
  if (globalOpts.db) {
    // Legacy mode: direct JsonBackend with explicit path
    // Wrap in the adapter to satisfy UrlBackend interface
    const { JsonBackendAdapter } = await import('./backends/json-adapter.js');
    const dbPath = resolve(globalOpts.db);
    return new JsonBackendAdapter(dbPath, '');
  }

  const config = loadConfig();
  return createFactoryBackend(config);
}

program
  .name('clipr')
  .description('Shorten, manage, and track URLs')
  .version('0.0.1')
  .option('--db <path>', 'path to urls.json database file');

program
  .command('shorten')
  .description('Shorten a URL')
  .argument('<url>', 'URL to shorten')
  .option('-s, --slug <slug>', 'custom slug (random if omitted)')
  .option('-d, --description <text>', 'description for the link')
  .option('--utm-source <value>', 'UTM source')
  .option('--utm-medium <value>', 'UTM medium')
  .option('--utm-campaign <value>', 'UTM campaign')
  .option('--utm-term <value>', 'UTM term')
  .option('--utm-content <value>', 'UTM content')
  .option('--expires <date>', 'expiration date (ISO 8601)')
  .action(async (url: string, opts) => {
    const backend = createJsonBackend(program.opts().db);
    await shorten(url, backend, {
      slug: opts.slug,
      description: opts.description,
      utm_source: opts.utmSource,
      utm_medium: opts.utmMedium,
      utm_campaign: opts.utmCampaign,
      utm_term: opts.utmTerm,
      utm_content: opts.utmContent,
      expires: opts.expires,
    });
  });

program
  .command('list')
  .alias('ls')
  .description('List all shortened URLs')
  .action(async () => {
    const backend = createJsonBackend(program.opts().db);
    await list(backend);
  });

program
  .command('delete')
  .alias('rm')
  .description('Delete a shortened URL')
  .argument('<slug>', 'slug to delete')
  .action(async (slug: string) => {
    const backend = createJsonBackend(program.opts().db);
    await del(slug, backend);
  });

program
  .command('info')
  .description('Show details for a slug')
  .argument('<slug>', 'slug to inspect')
  .action(async (slug: string) => {
    const backend = createJsonBackend(program.opts().db);
    await info(slug, backend);
  });

program
  .command('config')
  .description('Get or set configuration')
  .argument('<key>', 'config key (e.g. baseUrl)')
  .argument('[value]', 'value to set (omit to read)')
  .action(async (key: string, value: string | undefined) => {
    const backend = createJsonBackend(program.opts().db);
    await config(key, value, backend);
  });

program
  .command('init')
  .description('Initialize a new urls.json database')
  .option('-b, --base-url <url>', 'base URL for short links')
  .option('-f, --force', 'overwrite existing database')
  .action(async (opts) => {
    const dbPath = resolve(program.opts().db ?? DEFAULT_DB_PATH);
    await init(dbPath, { baseUrl: opts.baseUrl, force: opts.force });
  });

program
  .command('deploy')
  .description('Deploy URLs to Cloudflare KV')
  .requiredOption('--namespace-id <id>', 'Cloudflare KV namespace ID')
  .option('--preview', 'deploy to preview KV namespace')
  .action(async (opts) => {
    const backend = createJsonBackend(program.opts().db);
    await deploy(backend, {
      namespaceId: opts.namespaceId,
      preview: opts.preview,
    });
  });

program
  .command('edit')
  .description('Edit an existing shortened URL')
  .argument('<slug>', 'slug to edit')
  .option('--url <url>', 'new target URL')
  .option('--slug <slug>', 'new slug')
  .option('--tags <tags>', 'comma-separated tags')
  .option('--expires <date>', 'expiration date (ISO 8601)')
  .option('--description <text>', 'description')
  .action(async (slug: string, opts) => {
    const backend = await resolveBackend(program.opts());
    await edit(slug, backend, opts);
  });

program
  .command('stats')
  .description('Show click analytics for a slug')
  .argument('<slug>', 'slug to inspect')
  .option('--json', 'output raw JSON')
  .option('--period <period>', 'time period (e.g. 7d, 30d)')
  .action(async (slug: string, opts) => {
    const backend = await resolveBackend(program.opts());
    await stats(slug, backend, opts);
  });

program
  .command('qr')
  .description('Generate a QR code for a slug')
  .argument('<slug>', 'slug to generate QR for')
  .option('-o, --output <file>', 'output file path')
  .option('-f, --format <format>', 'output format (svg|png)', 'svg')
  .option('-s, --size <px>', 'image size in pixels', '256')
  .action(async (slug: string, opts) => {
    const backend = await resolveBackend(program.opts());
    await qr(slug, backend, opts);
  });

program
  .command('import')
  .description('Import URLs from a file')
  .argument('<file>', 'input file path (JSON or CSV)')
  .option('-f, --format <format>', 'file format (json|csv)')
  .action(async (file: string, opts) => {
    const backend = await resolveBackend(program.opts());
    await importUrls(file, backend, opts);
  });

program
  .command('export')
  .description('Export all URLs to a file')
  .option('-f, --format <format>', 'output format (json|csv)', 'json')
  .option('-o, --output <file>', 'output file path (stdout if omitted)')
  .action(async (opts) => {
    const backend = await resolveBackend(program.opts());
    await exportUrls(backend, opts);
  });

program
  .command('build')
  .description('Build static HTML redirect pages')
  .option('-i, --input <path>', 'path to urls.json', 'urls.json')
  .option('-o, --output <dir>', 'output directory', 'dist')
  .action(async (opts) => {
    await build({ input: opts.input, output: opts.output });
  });

program.parseAsync().catch((err: Error) => {
  error(err.message);
  process.exit(1);
});
