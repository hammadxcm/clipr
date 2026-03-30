import type { LinkStats, ShortUrl } from '@clipr/core';

// KV key prefixes
const URL_PREFIX = 'url:';
const META_COUNTER = 'meta:counter';
const STATS_PREFIX = 'stats:';
const GEO_PREFIX = 'geo:';
const DEVICE_PREFIX = 'device:';
const REFERRER_PREFIX = 'referrer:';
const INDEX_KEY = '_url_index';

/** Get a ShortUrl by code. */
export async function getUrl(kv: KVNamespace, code: string): Promise<ShortUrl | null> {
  const raw = await kv.get(`${URL_PREFIX}${code}`, 'text');
  if (!raw) return null;
  return JSON.parse(raw) as ShortUrl;
}

/** Store a ShortUrl by code and add to index. */
export async function putUrl(kv: KVNamespace, code: string, data: ShortUrl): Promise<void> {
  await kv.put(`${URL_PREFIX}${code}`, JSON.stringify(data));
  await addToIndex(kv, code);
}

/** Delete a ShortUrl by code and remove from index. */
export async function deleteUrl(kv: KVNamespace, code: string): Promise<boolean> {
  const existing = await kv.get(`${URL_PREFIX}${code}`, 'text');
  if (!existing) return false;
  await kv.delete(`${URL_PREFIX}${code}`);
  await removeFromIndex(kv, code);
  return true;
}

/** List all stored ShortUrl entries. */
export async function listUrls(kv: KVNamespace): Promise<ShortUrl[]> {
  const codes = await getIndex(kv);
  const entries: ShortUrl[] = [];
  for (const code of codes) {
    const entry = await getUrl(kv, code);
    if (entry) entries.push(entry);
  }
  return entries;
}

/** Get the current counter value. */
export async function getCounter(kv: KVNamespace): Promise<number> {
  const raw = await kv.get(META_COUNTER, 'text');
  if (!raw) return 0;
  return parseInt(raw, 10);
}

/** Increment the counter and return the new value. */
export async function incrementCounter(kv: KVNamespace): Promise<number> {
  const current = await getCounter(kv);
  const next = current + 1;
  await kv.put(META_COUNTER, String(next));
  return next;
}

/**
 * Increment a statistics counter for a link.
 * @param type - 'total' | 'daily' | 'geo' | 'device' | 'referrer'
 * @param key - The sub-key (e.g., date string, country code, device type, referrer domain).
 *              Ignored for 'total' type.
 */
export async function incrementStat(
  kv: KVNamespace,
  code: string,
  type: 'total' | 'daily' | 'geo' | 'device' | 'referrer',
  key?: string,
): Promise<void> {
  let kvKey: string;
  switch (type) {
    case 'total':
      kvKey = `${STATS_PREFIX}${code}:total`;
      break;
    case 'daily':
      kvKey = `${STATS_PREFIX}${code}:daily:${key}`;
      break;
    case 'geo':
      kvKey = `${GEO_PREFIX}${code}:${key}`;
      break;
    case 'device':
      kvKey = `${DEVICE_PREFIX}${code}:${key}`;
      break;
    case 'referrer':
      kvKey = `${REFERRER_PREFIX}${code}:${key}`;
      break;
  }
  const raw = await kv.get(kvKey, 'text');
  const current = raw ? parseInt(raw, 10) : 0;
  await kv.put(kvKey, String(current + 1));
}

/** Assemble LinkStats for a given code from multiple KV keys. */
export async function getStats(kv: KVNamespace, code: string): Promise<LinkStats> {
  const stats: LinkStats = {
    total: 0,
    daily: {},
    geo: {},
    device: {},
    referrer: {},
  };

  // Total clicks
  const totalRaw = await kv.get(`${STATS_PREFIX}${code}:total`, 'text');
  if (totalRaw) stats.total = parseInt(totalRaw, 10);

  // Daily stats — list keys with prefix
  const dailyKeys = await kv.list({ prefix: `${STATS_PREFIX}${code}:daily:` });
  for (const key of dailyKeys.keys) {
    const dateStr = key.name.replace(`${STATS_PREFIX}${code}:daily:`, '');
    const val = await kv.get(key.name, 'text');
    if (val) stats.daily[dateStr] = parseInt(val, 10);
  }

  // Geo stats
  const geoKeys = await kv.list({ prefix: `${GEO_PREFIX}${code}:` });
  for (const key of geoKeys.keys) {
    const country = key.name.replace(`${GEO_PREFIX}${code}:`, '');
    const val = await kv.get(key.name, 'text');
    if (val) stats.geo[country] = parseInt(val, 10);
  }

  // Device stats
  const deviceKeys = await kv.list({ prefix: `${DEVICE_PREFIX}${code}:` });
  for (const key of deviceKeys.keys) {
    const device = key.name.replace(`${DEVICE_PREFIX}${code}:`, '');
    const val = await kv.get(key.name, 'text');
    if (val) stats.device[device] = parseInt(val, 10);
  }

  // Referrer stats
  const referrerKeys = await kv.list({ prefix: `${REFERRER_PREFIX}${code}:` });
  for (const key of referrerKeys.keys) {
    const referrer = key.name.replace(`${REFERRER_PREFIX}${code}:`, '');
    const val = await kv.get(key.name, 'text');
    if (val) stats.referrer[referrer] = parseInt(val, 10);
  }

  return stats;
}

// --- Index helpers ---

async function getIndex(kv: KVNamespace): Promise<string[]> {
  const raw = await kv.get(INDEX_KEY, 'text');
  if (!raw) return [];
  return JSON.parse(raw) as string[];
}

async function addToIndex(kv: KVNamespace, code: string): Promise<void> {
  const index = await getIndex(kv);
  if (!index.includes(code)) {
    index.push(code);
    await kv.put(INDEX_KEY, JSON.stringify(index));
  }
}

async function removeFromIndex(kv: KVNamespace, code: string): Promise<void> {
  const index = await getIndex(kv);
  const filtered = index.filter((c) => c !== code);
  await kv.put(INDEX_KEY, JSON.stringify(filtered));
}
