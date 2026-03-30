// Types

// Backend interfaces
export type { Backend, UrlBackend } from './backend.js';
// Config
export {
  isValidBackend,
  loadConfig,
  resolveConfig,
  resolveConfigPath,
  saveConfig,
} from './config.js';

// Constants
export {
  DB_VERSION,
  DEFAULT_DB_PATH,
  DEFAULT_SLUG_LENGTH,
  MAX_SLUG_LENGTH,
  MAX_URL_LENGTH,
  MIN_SLUG_LENGTH,
  RESERVED_SLUGS,
  SLUG_ALPHABET,
} from './constants.js';

// Errors
export {
  BackendError,
  CliprError,
  InvalidSlugError,
  InvalidUrlError,
  SlugConflictError,
  SlugNotFoundError,
} from './errors.js';
// Backends
export { JsonBackend } from './json-backend.js';
// Slug utilities
export {
  decodeSlug,
  generateRandomSlug,
  generateSlug,
  isValidSlug,
  normalizeSlug,
} from './slug.js';
export type {
  BackendType,
  CliprConfig,
  CreateOptions,
  DeployMode,
  LinkStats,
  ListOptions,
  ResolveResult,
  ShortUrl,
  UrlDatabase,
  UrlEntry,
  UrlsManifest,
  UtmParams,
  ValidationResult,
} from './types.js';
// UTM utilities
export { appendUtm, extractUtm, hasUtm } from './utm.js';
// Validation
export { validateSlug, validateUrl } from './validate.js';
