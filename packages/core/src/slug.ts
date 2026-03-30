import Sqids from 'sqids';
import { DEFAULT_SLUG_LENGTH, SLUG_ALPHABET } from './constants.js';

const sqids = new Sqids({ alphabet: SLUG_ALPHABET, minLength: 4 });

/**
 * Generate a slug from a counter value using Sqids.
 * Deterministic: same counter always produces same slug.
 */
export function generateSlug(counter: number): string {
  return sqids.encode([counter]);
}

/**
 * Decode a Sqids-generated slug back to its counter value.
 * Returns the counter number, or null if invalid.
 */
export function decodeSlug(slug: string): number | null {
  const decoded = sqids.decode(slug);
  return decoded.length > 0 ? (decoded[0] ?? null) : null;
}

/**
 * Generate a random slug using crypto.getRandomValues.
 * Used when no counter is available.
 */
export function generateRandomSlug(length: number = DEFAULT_SLUG_LENGTH): string {
  const bytes = new Uint8Array(length);
  crypto.getRandomValues(bytes);
  let slug = '';
  for (let i = 0; i < length; i++) {
    slug += SLUG_ALPHABET[bytes[i]! % SLUG_ALPHABET.length];
  }
  return slug;
}

/** Check if a string is a valid slug format. */
export function isValidSlug(slug: string): boolean {
  if (slug.length < 1 || slug.length > 32) return false;
  return /^[a-z0-9][a-z0-9-]*[a-z0-9]$|^[a-z0-9]$/.test(slug);
}

/** Normalize a slug to lowercase and trimmed. */
export function normalizeSlug(slug: string): string {
  return slug.trim().toLowerCase();
}
