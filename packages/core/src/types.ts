/** A shortened URL entry stored in the URL database. */
export interface UrlEntry {
  /** The short slug (e.g. "abc123"). */
  slug: string;
  /** The original long URL to redirect to. */
  url: string;
  /** ISO 8601 timestamp when the entry was created. */
  createdAt: string;
  /** Optional expiration as ISO 8601 timestamp. */
  expiresAt?: string;
  /** Optional human-readable description. */
  description?: string;
  /** UTM parameters to append on redirect. */
  utm?: UtmParams;
}

/** UTM campaign tracking parameters. */
export interface UtmParams {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
}

/** The shape of the urls.json database file. */
export interface UrlDatabase {
  /** Schema version for future migrations. */
  version: number;
  /** Auto-incrementing counter (unused if slugs are random/custom). */
  counter: number;
  /** Base URL for short links (e.g. "https://clpr.sh"). */
  baseUrl: string;
  /** Map of slug -> URL entry. */
  urls: Record<string, UrlEntry>;
}

/** Result of a validation check. */
export type ValidationResult = { valid: true } | { valid: false; reason: string };

/** Supported backend storage types. */
export type BackendType = 'json' | 'cloudflare-kv' | 'redis';

/** Deployment mode for the CLI. */
export type DeployMode = 'github' | 'api';

/** Configuration for a clipr project. */
export interface CliprConfig {
  /** Deployment mode. */
  mode: DeployMode;
  /** Where to store URL data. */
  backend: BackendType;
  /** Base URL for short links. */
  baseUrl: string;
  /** Default slug length for random slugs. */
  slugLength: number;
  /** Path to the urls.json file (for json backend). */
  dbPath: string;
  /** GitHub backend config. */
  github?: { owner: string; repo: string; branch: string; path: string; token: string };
  /** API backend config (Workers). */
  api?: { baseUrl: string; token: string };
}

/** Options for creating a short URL. */
export interface CreateOptions {
  /** Custom slug (auto-generated if omitted). */
  slug?: string;
  /** Tags for organization. */
  tags?: string[];
  /** Expiration date (ISO 8601). */
  expiresAt?: string;
  /** Password for protected links. */
  password?: string;
  /** Description. */
  description?: string;
  /** UTM parameters. */
  utm?: UtmParams;
  /** Custom OG title. */
  ogTitle?: string;
  /** Custom OG description. */
  ogDescription?: string;
  /** Custom OG image URL. */
  ogImage?: string;
}

/** Options for listing URLs. */
export interface ListOptions {
  /** Filter by tag. */
  tag?: string;
  /** Search query (slug, URL, description). */
  search?: string;
  /** Max results. */
  limit?: number;
  /** Output format. */
  format?: 'table' | 'json';
}

/** A fully resolved short URL with all metadata. */
export interface ShortUrl extends UrlEntry {
  /** Tags for organization. */
  tags?: string[];
  /** Whether the slug was custom or auto-generated. */
  custom?: boolean;
  /** Password hash (for protected links). */
  passwordHash?: string;
  /** Custom OG title. */
  ogTitle?: string;
  /** Custom OG description. */
  ogDescription?: string;
  /** Custom OG image URL. */
  ogImage?: string;
}

/** Result of resolving a slug. */
export interface ResolveResult {
  /** The target URL to redirect to (with UTM appended if applicable). */
  url: string;
  /** Whether the link is password-protected. */
  passwordProtected: boolean;
  /** Whether the link has expired. */
  expired: boolean;
}

/** Click analytics for a link (Workers API mode only). */
export interface LinkStats {
  /** Total clicks. */
  total: number;
  /** Clicks per day. */
  daily: Record<string, number>;
  /** Clicks by country. */
  geo: Record<string, number>;
  /** Clicks by device type. */
  device: Record<string, number>;
  /** Clicks by referrer domain. */
  referrer: Record<string, number>;
}

/** The full urls.json manifest shape (alias for UrlDatabase). */
export type UrlsManifest = UrlDatabase;
