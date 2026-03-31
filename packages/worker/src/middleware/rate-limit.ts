import type { Context, Next } from 'hono';
import type { Env } from '../types.js';

const RATE_LIMIT = 100; // requests per window
const WINDOW_SECONDS = 3600; // 1 hour

/**
 * Rate limiting middleware for public endpoints.
 * Uses Cloudflare KV with TTL expiration.
 * Limits by IP address: 100 requests per hour.
 */
export async function rateLimitMiddleware(
  c: Context<{ Bindings: Env }>,
  next: Next,
): Promise<undefined | Response> {
  const ip = c.req.header('cf-connecting-ip') || c.req.header('x-forwarded-for') || 'unknown';
  const key = `ratelimit:${ip}`;

  const current = await c.env.URLS.get(key, 'text');
  const count = current ? Number.parseInt(current, 10) : 0;

  if (count >= RATE_LIMIT) {
    return c.json(
      { error: 'Rate limit exceeded. Maximum 100 URLs per hour.' },
      429,
    );
  }

  await c.env.URLS.put(key, String(count + 1), { expirationTtl: WINDOW_SECONDS });

  // Set rate limit headers
  c.header('X-RateLimit-Limit', String(RATE_LIMIT));
  c.header('X-RateLimit-Remaining', String(RATE_LIMIT - count - 1));

  await next();
}
