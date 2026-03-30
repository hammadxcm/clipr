import type { UrlBackend } from '@clipr/core';
import pc from 'picocolors';
import { dim, error, info } from '../utils/output.js';

interface StatsOptions {
  json?: boolean;
  period?: string;
}

export async function stats(slug: string, backend: UrlBackend, opts: StatsOptions): Promise<void> {
  try {
    const data = await backend.getStats(slug);

    if (data === null) {
      error('Stats are not available in the current backend mode.');
      info(
        'Click analytics require the Workers API backend. Deploy with `clipr deploy` and set mode to "api".',
      );
      process.exit(1);
    }

    if (opts.json) {
      console.log(JSON.stringify(data, null, 2));
      return;
    }

    console.log();
    console.log(`  ${pc.bold('Stats for')} ${pc.cyan(slug)}`);
    console.log(`  ${pc.bold('Total clicks:')} ${data.total}`);

    if (Object.keys(data.daily).length > 0) {
      console.log();
      console.log(`  ${pc.bold('Daily clicks:')}`);
      const sorted = Object.entries(data.daily).sort(([a], [b]) => a.localeCompare(b));
      for (const [date, count] of sorted) {
        const bar = '█'.repeat(Math.min(count, 40));
        console.log(`    ${dim(date)} ${bar} ${count}`);
      }
    }

    if (Object.keys(data.geo).length > 0) {
      console.log();
      console.log(`  ${pc.bold('Top countries:')}`);
      const sorted = Object.entries(data.geo)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 10);
      for (const [country, count] of sorted) {
        console.log(`    ${country}: ${count}`);
      }
    }

    if (Object.keys(data.referrer).length > 0) {
      console.log();
      console.log(`  ${pc.bold('Top referrers:')}`);
      const sorted = Object.entries(data.referrer)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 10);
      for (const [ref, count] of sorted) {
        console.log(`    ${ref || dim('(direct)')}: ${count}`);
      }
    }

    if (Object.keys(data.device).length > 0) {
      console.log();
      console.log(`  ${pc.bold('Devices:')}`);
      for (const [device, count] of Object.entries(data.device)) {
        console.log(`    ${device}: ${count}`);
      }
    }

    console.log();
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    error(msg);
    process.exit(1);
  }
}
