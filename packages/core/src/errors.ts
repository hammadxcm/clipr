/** Base error class for all clipr errors. */
export class CliprError extends Error {
  constructor(
    message: string,
    public readonly code: string,
  ) {
    super(message);
    this.name = 'CliprError';
  }
}

/** Thrown when a slug is invalid (bad chars, reserved, wrong length). */
export class InvalidSlugError extends CliprError {
  constructor(slug: string, reason: string) {
    super(`Invalid slug "${slug}": ${reason}`, 'INVALID_SLUG');
    this.name = 'InvalidSlugError';
  }
}

/** Thrown when a URL fails validation. */
export class InvalidUrlError extends CliprError {
  constructor(url: string, reason: string) {
    super(`Invalid URL "${url}": ${reason}`, 'INVALID_URL');
    this.name = 'InvalidUrlError';
  }
}

/** Thrown when a slug already exists in the database. */
export class SlugConflictError extends CliprError {
  constructor(slug: string) {
    super(`Slug "${slug}" already exists`, 'SLUG_CONFLICT');
    this.name = 'SlugConflictError';
  }
}

/** Thrown when a slug is not found in the database. */
export class SlugNotFoundError extends CliprError {
  constructor(slug: string) {
    super(`Slug "${slug}" not found`, 'SLUG_NOT_FOUND');
    this.name = 'SlugNotFoundError';
  }
}

/** Thrown when the backend configuration is invalid or missing. */
export class BackendError extends CliprError {
  constructor(message: string) {
    super(message, 'BACKEND_ERROR');
    this.name = 'BackendError';
  }
}
