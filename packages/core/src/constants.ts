/** Default slug length when generating random slugs. */
export const DEFAULT_SLUG_LENGTH = 6;

/** Minimum allowed slug length. */
export const MIN_SLUG_LENGTH = 3;

/** Maximum allowed slug length. */
export const MAX_SLUG_LENGTH = 32;

/** Characters used in random slug generation (URL-safe, no ambiguous chars). */
export const SLUG_ALPHABET = 'abcdefghijkmnpqrstuvwxyz23456789';

/** Maximum allowed URL length in characters. */
export const MAX_URL_LENGTH = 2048;

/** Reserved slugs that cannot be used (common paths + locale codes). */
export const RESERVED_SLUGS = new Set([
  // Routes
  'api',
  'admin',
  'dashboard',
  'health',
  'login',
  'logout',
  'signup',
  'settings',
  'password',
  'shorten',
  // Static files
  'static',
  'assets',
  'favicon.ico',
  'robots.txt',
  'sitemap.xml',
  'sitemap-index.xml',
  // i18n locale codes (prevent conflicts with Astro SSG routes)
  'en',
  'es',
  'fr',
  'de',
  'pt',
  'ru',
  'zh',
  'hi',
  'ar',
  'ur',
  'bn',
  'ja',
]);

/** Default database file path relative to project root. */
export const DEFAULT_DB_PATH = 'urls.json';

/** Current URL database schema version. */
export const DB_VERSION = 1;
