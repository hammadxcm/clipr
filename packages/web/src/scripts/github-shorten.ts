/**
 * Client-side URL shortener using GitHub Contents API.
 * Commits new URLs directly to the repo, triggering a rebuild.
 */

const STORAGE_KEY = 'clipr-github-token';
const SLUG_ALPHABET = 'abcdefghijkmnpqrstuvwxyz23456789';
const DEFAULT_SLUG_LENGTH = 6;
const MAX_URL_LENGTH = 2048;
const RESERVED_SLUGS = new Set([
  'api', 'admin', 'dashboard', 'health', 'login', 'logout', 'signup',
  'settings', 'shorten', 'password', 'static', 'assets', 'favicon.ico',
  'robots.txt', 'sitemap.xml', 'sitemap-index.xml',
  'en', 'es', 'fr', 'de', 'pt', 'ru', 'zh', 'hi', 'ar', 'ur', 'bn', 'ja',
]);

export type ShortenError =
  | 'INVALID_URL'
  | 'INVALID_SLUG'
  | 'SLUG_CONFLICT'
  | 'AUTH_REQUIRED'
  | 'AUTH_FAILED'
  | 'SHA_CONFLICT'
  | 'NETWORK_ERROR'
  | 'GITHUB_ERROR';

export type ShortenResult =
  | { ok: true; slug: string; shortUrl: string }
  | { ok: false; error: ShortenError; message: string };

interface UrlEntry {
  slug: string;
  url: string;
  createdAt: string;
  description?: string;
}

interface UrlDatabase {
  version: number;
  counter: number;
  baseUrl: string;
  urls: Record<string, UrlEntry>;
}

interface GithubConfig {
  owner: string;
  repo: string;
  branch: string;
  path: string;
}

// Token management
export function getToken(): string | null {
  return localStorage.getItem(STORAGE_KEY);
}

export function setToken(token: string): void {
  localStorage.setItem(STORAGE_KEY, token);
}

export function clearToken(): void {
  localStorage.removeItem(STORAGE_KEY);
}

// Validate token by calling GitHub user API
export async function validateToken(token: string): Promise<boolean> {
  try {
    const res = await fetch('https://api.github.com/user', {
      headers: { Authorization: `Bearer ${token}`, Accept: 'application/vnd.github.v3+json' },
    });
    return res.ok;
  } catch {
    return false;
  }
}

// Slug generation (replicates @clipr/core generateRandomSlug)
function generateRandomSlug(length = DEFAULT_SLUG_LENGTH): string {
  const bytes = new Uint8Array(length);
  crypto.getRandomValues(bytes);
  let slug = '';
  for (let i = 0; i < length; i++) {
    slug += SLUG_ALPHABET[bytes[i]! % SLUG_ALPHABET.length];
  }
  return slug;
}

// Validation (replicates @clipr/core)
function validateUrl(url: string): string | null {
  if (!url || url.length > MAX_URL_LENGTH) return 'URL is empty or too long';
  try {
    const parsed = new URL(url);
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') return 'Only http/https URLs allowed';
    return null;
  } catch {
    return 'Not a valid URL';
  }
}

function validateSlug(slug: string): string | null {
  if (slug.length < 3) return 'Slug must be at least 3 characters';
  if (slug.length > 32) return 'Slug must be at most 32 characters';
  if (!/^[a-z0-9][a-z0-9-]*[a-z0-9]$|^[a-z0-9]$/.test(slug)) return 'Slug must be lowercase letters, numbers, and hyphens';
  if (RESERVED_SLUGS.has(slug)) return 'This slug is reserved';
  return null;
}

// Base64 encoding/decoding (handles UTF-8)
function encodeBase64(str: string): string {
  return btoa(unescape(encodeURIComponent(str)));
}

function decodeBase64(b64: string): string {
  return decodeURIComponent(escape(atob(b64)));
}

// GitHub Contents API
async function fetchUrlsJson(config: GithubConfig, token: string): Promise<{ content: UrlDatabase; sha: string }> {
  const url = `https://api.github.com/repos/${config.owner}/${config.repo}/contents/${config.path}?ref=${config.branch}`;
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${token}`, Accept: 'application/vnd.github.v3+json' },
  });

  if (res.status === 401 || res.status === 403) throw { error: 'AUTH_FAILED' as ShortenError, message: 'Invalid or expired GitHub token' };
  if (!res.ok) throw { error: 'GITHUB_ERROR' as ShortenError, message: `GitHub API error: ${res.status}` };

  const data = await res.json();
  const decoded = decodeBase64(data.content);
  return { content: JSON.parse(decoded) as UrlDatabase, sha: data.sha };
}

async function commitUrlsJson(config: GithubConfig, token: string, content: UrlDatabase, sha: string, message: string): Promise<void> {
  const url = `https://api.github.com/repos/${config.owner}/${config.repo}/contents/${config.path}`;
  const body = JSON.stringify({
    message,
    content: encodeBase64(`${JSON.stringify(content, null, 2)}\n`),
    sha,
    branch: config.branch,
  });

  const res = await fetch(url, {
    method: 'PUT',
    headers: { Authorization: `Bearer ${token}`, Accept: 'application/vnd.github.v3+json', 'Content-Type': 'application/json' },
    body,
  });

  if (res.status === 409) throw { error: 'SHA_CONFLICT' as ShortenError, message: 'File was modified concurrently. Retrying...' };
  if (res.status === 401 || res.status === 403) throw { error: 'AUTH_FAILED' as ShortenError, message: 'Token lacks permission to write' };
  if (!res.ok) throw { error: 'GITHUB_ERROR' as ShortenError, message: `GitHub API error: ${res.status}` };
}

// Main shortener function
export async function shortenUrl(
  targetUrl: string,
  config: GithubConfig,
  options?: { slug?: string; description?: string },
): Promise<ShortenResult> {
  const token = getToken();
  if (!token) return { ok: false, error: 'AUTH_REQUIRED', message: 'GitHub token required' };

  // Validate URL
  const urlError = validateUrl(targetUrl);
  if (urlError) return { ok: false, error: 'INVALID_URL', message: urlError };

  // Validate custom slug if provided
  let slug = options?.slug?.trim().toLowerCase();
  if (slug) {
    const slugError = validateSlug(slug);
    if (slugError) return { ok: false, error: 'INVALID_SLUG', message: slugError };
  }

  // Retry loop for SHA conflicts
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const { content: db, sha } = await fetchUrlsJson(config, token);

      // Generate slug if not provided
      if (!slug) {
        slug = generateRandomSlug();
        while (db.urls[slug] || RESERVED_SLUGS.has(slug)) {
          slug = generateRandomSlug();
        }
      }

      // Check for conflict
      if (db.urls[slug]) {
        return { ok: false, error: 'SLUG_CONFLICT', message: `Slug "${slug}" already exists` };
      }

      // Add entry
      db.urls[slug] = {
        slug,
        url: targetUrl,
        createdAt: new Date().toISOString(),
        ...(options?.description && { description: options.description }),
      };
      db.counter = Object.keys(db.urls).length;

      // Commit
      await commitUrlsJson(config, token, db, sha, `feat(urls): shorten ${targetUrl} via web`);

      const shortUrl = db.baseUrl ? `${db.baseUrl}/${slug}` : slug;
      return { ok: true, slug, shortUrl };
    } catch (err: unknown) {
      const e = err as { error?: ShortenError; message?: string };
      if (e.error === 'SHA_CONFLICT' && attempt < 2) {
        slug = undefined; // Regenerate slug on retry
        continue;
      }
      return { ok: false, error: e.error || 'NETWORK_ERROR', message: e.message || 'Network error' };
    }
  }

  return { ok: false, error: 'SHA_CONFLICT', message: 'Failed after 3 retries' };
}
