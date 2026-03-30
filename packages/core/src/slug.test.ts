import { describe, expect, it } from 'vitest';
import { DEFAULT_SLUG_LENGTH, SLUG_ALPHABET } from './constants.js';
import {
  decodeSlug,
  generateRandomSlug,
  generateSlug,
  isValidSlug,
  normalizeSlug,
} from './slug.js';

describe('generateSlug (sqids)', () => {
  it('generates a slug from a counter', () => {
    const slug = generateSlug(0);
    expect(slug.length).toBeGreaterThanOrEqual(4);
  });

  it('generates deterministic slugs', () => {
    expect(generateSlug(42)).toBe(generateSlug(42));
  });

  it('generates different slugs for different counters', () => {
    const slugs = new Set(Array.from({ length: 100 }, (_, i) => generateSlug(i)));
    expect(slugs.size).toBe(100);
  });

  it('only contains characters from the slug alphabet', () => {
    for (let i = 0; i < 100; i++) {
      const slug = generateSlug(i);
      for (const char of slug) {
        expect(SLUG_ALPHABET).toContain(char);
      }
    }
  });
});

describe('decodeSlug', () => {
  it('round-trips with generateSlug', () => {
    for (let i = 0; i < 50; i++) {
      const slug = generateSlug(i);
      expect(decodeSlug(slug)).toBe(i);
    }
  });

  it('returns null for invalid slugs', () => {
    expect(decodeSlug('')).toBeNull();
  });
});

describe('generateRandomSlug', () => {
  it('returns a slug of the default length', () => {
    const slug = generateRandomSlug();
    expect(slug).toHaveLength(DEFAULT_SLUG_LENGTH);
  });

  it('returns a slug of a custom length', () => {
    const slug = generateRandomSlug(10);
    expect(slug).toHaveLength(10);
  });

  it('only contains characters from the slug alphabet', () => {
    for (let i = 0; i < 100; i++) {
      const slug = generateRandomSlug();
      for (const char of slug) {
        expect(SLUG_ALPHABET).toContain(char);
      }
    }
  });

  it('generates unique slugs', () => {
    const slugs = new Set(Array.from({ length: 100 }, () => generateRandomSlug()));
    expect(slugs.size).toBe(100);
  });
});

describe('isValidSlug', () => {
  it('accepts valid slugs', () => {
    expect(isValidSlug('abc')).toBe(true);
    expect(isValidSlug('my-link')).toBe(true);
    expect(isValidSlug('a')).toBe(true);
  });

  it('rejects invalid slugs', () => {
    expect(isValidSlug('')).toBe(false);
    expect(isValidSlug('-abc')).toBe(false);
    expect(isValidSlug('ABC')).toBe(false);
  });
});

describe('normalizeSlug', () => {
  it('lowercases the slug', () => {
    expect(normalizeSlug('AbCdEf')).toBe('abcdef');
  });

  it('trims whitespace', () => {
    expect(normalizeSlug('  abc  ')).toBe('abc');
  });

  it('handles both trim and lowercase', () => {
    expect(normalizeSlug('  Hello  ')).toBe('hello');
  });
});
