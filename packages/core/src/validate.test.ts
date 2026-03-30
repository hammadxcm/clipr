import { describe, expect, it } from 'vitest';
import { validateSlug, validateUrl } from './validate.js';

describe('validateSlug', () => {
  it('accepts a valid slug', () => {
    expect(validateSlug('abc123')).toEqual({ valid: true });
  });

  it('accepts a slug with hyphens', () => {
    expect(validateSlug('my-link')).toEqual({ valid: true });
  });

  it('accepts minimum length slug', () => {
    expect(validateSlug('abc')).toEqual({ valid: true });
  });

  it('rejects too-short slugs', () => {
    const result = validateSlug('ab');
    expect(result.valid).toBe(false);
    if (!result.valid) expect(result.reason).toContain('at least');
  });

  it('rejects too-long slugs', () => {
    const result = validateSlug('a'.repeat(33));
    expect(result.valid).toBe(false);
    if (!result.valid) expect(result.reason).toContain('at most');
  });

  it('rejects slugs with uppercase letters', () => {
    const result = validateSlug('Hello');
    expect(result.valid).toBe(false);
  });

  it('rejects slugs with special characters', () => {
    const result = validateSlug('abc!@#');
    expect(result.valid).toBe(false);
  });

  it('rejects slugs starting with a hyphen', () => {
    const result = validateSlug('-abc');
    expect(result.valid).toBe(false);
  });

  it('rejects slugs ending with a hyphen', () => {
    const result = validateSlug('abc-');
    expect(result.valid).toBe(false);
  });

  it('rejects reserved slugs', () => {
    const result = validateSlug('api');
    expect(result.valid).toBe(false);
    if (!result.valid) expect(result.reason).toContain('reserved');
  });

  it('rejects other reserved slugs', () => {
    for (const reserved of ['admin', 'dashboard', 'login', 'settings']) {
      const result = validateSlug(reserved);
      expect(result.valid).toBe(false);
    }
  });
});

describe('validateUrl', () => {
  it('accepts a valid https URL', () => {
    expect(validateUrl('https://example.com')).toEqual({ valid: true });
  });

  it('accepts a valid http URL', () => {
    expect(validateUrl('http://example.com/path?q=1')).toEqual({ valid: true });
  });

  it('rejects empty strings', () => {
    const result = validateUrl('');
    expect(result.valid).toBe(false);
    if (!result.valid) expect(result.reason).toContain('empty');
  });

  it('rejects non-URL strings', () => {
    const result = validateUrl('not a url');
    expect(result.valid).toBe(false);
    if (!result.valid) expect(result.reason).toContain('not a valid');
  });

  it('rejects non-http protocols', () => {
    const result = validateUrl('ftp://example.com');
    expect(result.valid).toBe(false);
    if (!result.valid) expect(result.reason).toContain('http');
  });

  it('rejects javascript: protocol', () => {
    const result = validateUrl('javascript:alert(1)');
    expect(result.valid).toBe(false);
  });

  it('rejects URLs exceeding max length', () => {
    const longUrl = `https://example.com/${'a'.repeat(2048)}`;
    const result = validateUrl(longUrl);
    expect(result.valid).toBe(false);
    if (!result.valid) expect(result.reason).toContain('maximum length');
  });
});
