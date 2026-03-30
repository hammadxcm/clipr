import type { UtmParams } from './types.js';

/** All recognized UTM parameter keys. */
const UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'] as const;

/** Append UTM parameters to a URL string. Existing UTM params on the URL are overwritten. */
export function appendUtm(url: string, utm: UtmParams): string {
  const parsed = new URL(url);

  for (const key of UTM_KEYS) {
    const value = utm[key];
    if (value !== undefined && value !== '') {
      parsed.searchParams.set(key, value);
    }
  }

  return parsed.toString();
}

/** Extract UTM parameters from a URL string. */
export function extractUtm(url: string): UtmParams {
  const parsed = new URL(url);
  const result: UtmParams = {};

  for (const key of UTM_KEYS) {
    const value = parsed.searchParams.get(key);
    if (value !== null) {
      result[key] = value;
    }
  }

  return result;
}

/** Check if a UtmParams object has any non-empty values. */
export function hasUtm(utm: UtmParams | undefined): utm is UtmParams {
  if (!utm) return false;
  return UTM_KEYS.some((key) => utm[key] !== undefined && utm[key] !== '');
}
