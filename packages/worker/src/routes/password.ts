import { appendUtm, hasUtm } from '@clipr/core';
import type { Context } from 'hono';
import { verifyPassword } from '../crypto.js';
import { getUrl } from '../kv.js';
import type { Env } from '../types.js';

/** Escape HTML special characters to prevent XSS. */
function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/** Render a simple HTML password form. */
function renderPasswordPage(code: string, error?: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Password Required - clipr</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      display: flex; justify-content: center; align-items: center;
      min-height: 100vh; background: #f5f5f5; color: #333;
    }
    .card {
      background: #fff; border-radius: 8px; padding: 2rem;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1); max-width: 400px; width: 100%;
    }
    h1 { font-size: 1.25rem; margin-bottom: 1rem; }
    .error { color: #dc3545; font-size: 0.875rem; margin-bottom: 1rem; }
    label { display: block; font-size: 0.875rem; margin-bottom: 0.5rem; font-weight: 500; }
    input[type="password"] {
      width: 100%; padding: 0.5rem 0.75rem; border: 1px solid #ddd;
      border-radius: 4px; font-size: 1rem; margin-bottom: 1rem;
    }
    button {
      width: 100%; padding: 0.625rem; background: #111; color: #fff;
      border: none; border-radius: 4px; font-size: 1rem; cursor: pointer;
    }
    button:hover { background: #333; }
  </style>
</head>
<body>
  <div class="card">
    <h1>This link is password-protected</h1>
    ${error ? `<p class="error">${escapeHtml(error)}</p>` : ''}
    <form method="POST" action="/password/${escapeHtml(code)}">
      <label for="password">Password</label>
      <input type="password" id="password" name="password" required autofocus />
      <button type="submit">Continue</button>
    </form>
  </div>
</body>
</html>`;
}

/** GET /password/:code — Render password form. */
export async function handlePasswordPage(c: Context<{ Bindings: Env }>): Promise<Response> {
  const code = c.req.param('code');
  if (!code) {
    return c.text('Not Found', 404);
  }

  const entry = await getUrl(c.env.URLS, code);
  if (!entry) {
    return c.text('Not Found', 404);
  }

  if (!entry.passwordHash) {
    // Not password-protected, redirect directly
    const target = hasUtm(entry.utm) ? appendUtm(entry.url, entry.utm) : entry.url;
    return c.redirect(target, 301);
  }

  return c.html(renderPasswordPage(code));
}

/** POST /password/:code — Verify password and redirect or show error. */
export async function handlePasswordVerify(c: Context<{ Bindings: Env }>): Promise<Response> {
  const code = c.req.param('code');
  if (!code) {
    return c.text('Not Found', 404);
  }

  const entry = await getUrl(c.env.URLS, code);
  if (!entry) {
    return c.text('Not Found', 404);
  }

  if (!entry.passwordHash) {
    const target = hasUtm(entry.utm) ? appendUtm(entry.url, entry.utm) : entry.url;
    return c.redirect(target, 301);
  }

  // Parse form body
  const body = await c.req.parseBody();
  const password = body.password;
  if (typeof password !== 'string' || !password) {
    return c.html(renderPasswordPage(code, 'Password is required.'), 400);
  }

  const valid = await verifyPassword(password, entry.passwordHash);
  if (!valid) {
    return c.html(renderPasswordPage(code, 'Incorrect password. Please try again.'), 403);
  }

  // Password correct — redirect to the target
  const target = hasUtm(entry.utm) ? appendUtm(entry.url, entry.utm) : entry.url;
  return c.redirect(target, 301);
}
