import { appendUtm, hasUtm } from '@clipr/core';
import type { Context } from 'hono';
import { getUrl, incrementStat } from '../kv.js';
import type { Env } from '../types.js';

/** Check if a URL entry has expired. */
function isExpired(expiresAt: string | undefined): boolean {
  if (!expiresAt) return false;
  return new Date(expiresAt).getTime() < Date.now();
}

/** Extract a simple device type from User-Agent. */
function parseDevice(ua: string | undefined): string {
  if (!ua) return 'unknown';
  const lower = ua.toLowerCase();
  if (lower.includes('mobile') || lower.includes('android') || lower.includes('iphone'))
    return 'mobile';
  if (lower.includes('tablet') || lower.includes('ipad')) return 'tablet';
  return 'desktop';
}

/** Extract referrer domain from Referer header. */
function parseReferrer(referer: string | undefined): string {
  if (!referer) return 'direct';
  try {
    return new URL(referer).hostname;
  } catch {
    return 'unknown';
  }
}

export async function handleRedirect(c: Context<{ Bindings: Env }>): Promise<Response> {
  const slug = c.req.param('slug');
  if (!slug) {
    return c.text('Not Found', 404);
  }

  const entry = await getUrl(c.env.URLS, slug);

  if (!entry) {
    return c.text('Not Found', 404);
  }

  if (isExpired(entry.expiresAt)) {
    return c.text('This link has expired', 410);
  }

  // Password-protected links redirect to the password page
  if (entry.passwordHash) {
    return c.redirect(`/password/${slug}`, 302);
  }

  const target = hasUtm(entry.utm) ? appendUtm(entry.url, entry.utm) : entry.url;

  // Non-blocking analytics via waitUntil
  let ctx: { waitUntil: (p: Promise<unknown>) => void } | undefined;
  try {
    ctx = c.executionCtx;
  } catch {
    // executionCtx not available in test environment
  }
  if (ctx && 'waitUntil' in ctx) {
    const kv = c.env.URLS;
    const date = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
    const country = c.req.header('cf-ipcountry') || 'unknown';
    const device = parseDevice(c.req.header('user-agent'));
    const referrer = parseReferrer(c.req.header('referer'));

    ctx.waitUntil(
      Promise.all([
        incrementStat(kv, slug, 'total'),
        incrementStat(kv, slug, 'daily', date),
        incrementStat(kv, slug, 'geo', country),
        incrementStat(kv, slug, 'device', device),
        incrementStat(kv, slug, 'referrer', referrer),
      ]),
    );
  }

  return new Response(null, {
    status: 301,
    headers: {
      Location: target,
      'Cache-Control': 'public, max-age=300',
    },
  });
}
