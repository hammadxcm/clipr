import { readFileSync, writeFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';
import { DEFAULT_DB_PATH, DEFAULT_SLUG_LENGTH } from './constants.js';
import type { BackendType, CliprConfig } from './types.js';

const DEFAULT_CONFIG: CliprConfig = {
  mode: 'github',
  backend: 'json',
  baseUrl: '',
  slugLength: DEFAULT_SLUG_LENGTH,
  dbPath: DEFAULT_DB_PATH,
};

/** Resolve the path to ~/.clipr.json. */
export function resolveConfigPath(): string {
  return join(homedir(), '.clipr.json');
}

/** Load config from ~/.clipr.json, falling back to defaults. */
export function loadConfig(path?: string): CliprConfig {
  const configPath = path ?? resolveConfigPath();
  try {
    const raw = readFileSync(configPath, 'utf-8');
    const parsed = JSON.parse(raw) as Partial<CliprConfig>;
    return resolveConfig(parsed);
  } catch {
    return { ...DEFAULT_CONFIG };
  }
}

/** Save config to ~/.clipr.json. */
export function saveConfig(config: CliprConfig, path?: string): void {
  const configPath = path ?? resolveConfigPath();
  writeFileSync(configPath, `${JSON.stringify(config, null, 2)}\n`);
}

/** Merge partial user config with defaults. */
export function resolveConfig(partial: Partial<CliprConfig> = {}): CliprConfig {
  return { ...DEFAULT_CONFIG, ...partial };
}

/** Validate that a backend type is recognized. */
export function isValidBackend(value: string): value is BackendType {
  return value === 'json' || value === 'cloudflare-kv' || value === 'redis';
}
