import { MAX_SLUG_LENGTH, MAX_URL_LENGTH, MIN_SLUG_LENGTH, RESERVED_SLUGS } from './constants.js';
import type { ValidationResult } from './types.js';

/** Allowed characters in a slug: lowercase alphanumeric plus hyphens. */
const SLUG_PATTERN = /^[a-z0-9][a-z0-9-]*[a-z0-9]$|^[a-z0-9]$/;

/** Validate a slug string. */
export function validateSlug(slug: string): ValidationResult {
  if (slug.length < MIN_SLUG_LENGTH) {
    return { valid: false, reason: `must be at least ${MIN_SLUG_LENGTH} characters` };
  }
  if (slug.length > MAX_SLUG_LENGTH) {
    return { valid: false, reason: `must be at most ${MAX_SLUG_LENGTH} characters` };
  }
  if (!SLUG_PATTERN.test(slug)) {
    return {
      valid: false,
      reason:
        'must contain only lowercase letters, numbers, and hyphens (no leading/trailing hyphens)',
    };
  }
  if (RESERVED_SLUGS.has(slug)) {
    return { valid: false, reason: 'is a reserved slug' };
  }
  return { valid: true };
}

/** Validate a target URL. */
export function validateUrl(url: string): ValidationResult {
  if (url.length === 0) {
    return { valid: false, reason: 'URL cannot be empty' };
  }
  if (url.length > MAX_URL_LENGTH) {
    return { valid: false, reason: `URL exceeds maximum length of ${MAX_URL_LENGTH} characters` };
  }

  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return { valid: false, reason: 'not a valid URL' };
  }

  if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
    return { valid: false, reason: 'only http and https URLs are allowed' };
  }

  return { valid: true };
}
