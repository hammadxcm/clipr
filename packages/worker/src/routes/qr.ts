import type { Context } from 'hono';
import { getUrl } from '../kv.js';
import type { Env } from '../types.js';
import { generateQr, type QrFormat } from '../utils/qr.js';

/** GET /api/qr/:code — Generate a QR code for the short URL. */
export async function handleQr(c: Context<{ Bindings: Env }>): Promise<Response> {
  const code = c.req.param('code');
  if (!code) {
    return c.json({ error: 'Missing code parameter' }, 400);
  }

  // Verify the link exists
  const entry = await getUrl(c.env.URLS, code);
  if (!entry) {
    return c.json({ error: `Link "${code}" not found` }, 404);
  }

  const format = (c.req.query('format') || 'svg') as QrFormat;
  if (format !== 'svg' && format !== 'png') {
    return c.json({ error: 'Invalid format, must be "svg" or "png"' }, 400);
  }

  const sizeStr = c.req.query('size');
  const size = sizeStr ? parseInt(sizeStr, 10) : 256;
  if (Number.isNaN(size) || size < 32 || size > 2048) {
    return c.json({ error: 'Invalid size, must be between 32 and 2048' }, 400);
  }

  const shortUrl = `${c.env.BASE_URL}/${code}`;
  const { data, contentType } = await generateQr(shortUrl, format, size);

  return new Response(data as BodyInit, {
    headers: {
      'Content-Type': contentType,
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
