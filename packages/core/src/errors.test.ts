import { describe, expect, it } from 'vitest';
import {
  BackendError,
  CliprError,
  InvalidSlugError,
  InvalidUrlError,
  SlugConflictError,
  SlugNotFoundError,
} from './errors.js';

describe('CliprError', () => {
  it('has the correct name and code', () => {
    const err = new CliprError('test', 'TEST_CODE');
    expect(err.name).toBe('CliprError');
    expect(err.code).toBe('TEST_CODE');
    expect(err.message).toBe('test');
    expect(err).toBeInstanceOf(Error);
  });
});

describe('InvalidSlugError', () => {
  it('includes slug in message', () => {
    const err = new InvalidSlugError('bad!', 'has special chars');
    expect(err.message).toContain('bad!');
    expect(err.message).toContain('has special chars');
    expect(err.code).toBe('INVALID_SLUG');
    expect(err).toBeInstanceOf(CliprError);
  });
});

describe('InvalidUrlError', () => {
  it('includes url in message', () => {
    const err = new InvalidUrlError('ftp://x', 'wrong protocol');
    expect(err.message).toContain('ftp://x');
    expect(err.code).toBe('INVALID_URL');
  });
});

describe('SlugConflictError', () => {
  it('reports conflict', () => {
    const err = new SlugConflictError('taken');
    expect(err.message).toContain('taken');
    expect(err.code).toBe('SLUG_CONFLICT');
  });
});

describe('SlugNotFoundError', () => {
  it('reports not found', () => {
    const err = new SlugNotFoundError('missing');
    expect(err.message).toContain('missing');
    expect(err.code).toBe('SLUG_NOT_FOUND');
  });
});

describe('BackendError', () => {
  it('has backend error code', () => {
    const err = new BackendError('connection failed');
    expect(err.code).toBe('BACKEND_ERROR');
    expect(err.message).toBe('connection failed');
  });
});
