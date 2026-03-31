import { describe, expect, it } from 'vitest';
import { hashPassword, verifyPassword } from './crypto.js';

describe('hashPassword', () => {
  it('returns a string in salt:hash format', async () => {
    const result = await hashPassword('mypassword');
    const parts = result.split(':');
    expect(parts).toHaveLength(2);
    // Salt is 16 bytes = 32 hex chars
    expect(parts[0]).toMatch(/^[0-9a-f]{32}$/);
    // Hash is 256 bits = 32 bytes = 64 hex chars
    expect(parts[1]).toMatch(/^[0-9a-f]{64}$/);
  });

  it('produces different hashes for the same password (random salt)', async () => {
    const a = await hashPassword('same');
    const b = await hashPassword('same');
    expect(a).not.toBe(b);
  });
});

describe('verifyPassword', () => {
  it('returns true for correct password', async () => {
    const stored = await hashPassword('correct');
    expect(await verifyPassword('correct', stored)).toBe(true);
  });

  it('returns false for wrong password', async () => {
    const stored = await hashPassword('correct');
    expect(await verifyPassword('wrong', stored)).toBe(false);
  });

  it('returns false for malformed stored hash (no colon)', async () => {
    expect(await verifyPassword('anything', 'nocolonhere')).toBe(false);
  });

  it('returns false for malformed stored hash (empty parts)', async () => {
    expect(await verifyPassword('anything', ':')).toBe(false);
  });
});
