import { describe, expect, it } from 'vitest';
import { appendUtm, extractUtm, hasUtm } from './utm.js';

describe('appendUtm', () => {
  it('appends UTM params to a URL', () => {
    const result = appendUtm('https://example.com', {
      utm_source: 'twitter',
      utm_medium: 'social',
    });
    const url = new URL(result);
    expect(url.searchParams.get('utm_source')).toBe('twitter');
    expect(url.searchParams.get('utm_medium')).toBe('social');
  });

  it('overwrites existing UTM params', () => {
    const result = appendUtm('https://example.com?utm_source=old', {
      utm_source: 'new',
    });
    const url = new URL(result);
    expect(url.searchParams.get('utm_source')).toBe('new');
  });

  it('preserves non-UTM query params', () => {
    const result = appendUtm('https://example.com?page=1', {
      utm_campaign: 'launch',
    });
    const url = new URL(result);
    expect(url.searchParams.get('page')).toBe('1');
    expect(url.searchParams.get('utm_campaign')).toBe('launch');
  });

  it('skips undefined and empty UTM values', () => {
    const result = appendUtm('https://example.com', {
      utm_source: 'twitter',
      utm_medium: '',
      utm_campaign: undefined,
    });
    const url = new URL(result);
    expect(url.searchParams.get('utm_source')).toBe('twitter');
    expect(url.searchParams.has('utm_medium')).toBe(false);
    expect(url.searchParams.has('utm_campaign')).toBe(false);
  });
});

describe('extractUtm', () => {
  it('extracts UTM params from a URL', () => {
    const result = extractUtm('https://example.com?utm_source=twitter&utm_medium=social');
    expect(result).toEqual({
      utm_source: 'twitter',
      utm_medium: 'social',
    });
  });

  it('returns empty object when no UTM params exist', () => {
    const result = extractUtm('https://example.com?page=1');
    expect(result).toEqual({});
  });

  it('ignores non-UTM params', () => {
    const result = extractUtm('https://example.com?utm_source=x&page=1&ref=y');
    expect(result).toEqual({ utm_source: 'x' });
  });
});

describe('hasUtm', () => {
  it('returns true when UTM params have values', () => {
    expect(hasUtm({ utm_source: 'twitter' })).toBe(true);
  });

  it('returns false for undefined', () => {
    expect(hasUtm(undefined)).toBe(false);
  });

  it('returns false for empty object', () => {
    expect(hasUtm({})).toBe(false);
  });

  it('returns false when all values are empty strings', () => {
    expect(hasUtm({ utm_source: '', utm_medium: '' })).toBe(false);
  });
});
