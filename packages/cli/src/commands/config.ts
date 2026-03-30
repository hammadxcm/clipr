import type { JsonBackend } from '@clipr/core';
import { dim, error, success } from '../utils/output.js';

export async function config(
  key: string,
  value: string | undefined,
  backend: JsonBackend,
): Promise<void> {
  if (key === 'baseUrl') {
    if (value === undefined) {
      const current = await backend.getBaseUrl();
      console.log(current || dim('(not set)'));
    } else {
      await backend.setBaseUrl(value);
      success(`baseUrl set to "${value}"`);
    }
    return;
  }

  error(`Unknown config key "${key}". Available keys: baseUrl`);
  process.exit(1);
}
