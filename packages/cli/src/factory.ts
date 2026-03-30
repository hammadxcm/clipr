import type { CliprConfig, UrlBackend } from '@clipr/core';

import { JsonBackendAdapter } from './backends/json-adapter.js';

/**
 * Factory function (composition root).
 * Creates the appropriate UrlBackend based on the config mode.
 * Uses dynamic imports so backend modules are only loaded when needed.
 */
export async function createBackend(config: CliprConfig): Promise<UrlBackend> {
  switch (config.mode) {
    case 'github': {
      if (!config.github) {
        throw new Error(
          'GitHub backend requires github config. Run `clipr config` to set owner, repo, branch, path, and token.',
        );
      }
      const { GitHubBackend } = await import('./backends/github.js');
      return new GitHubBackend(config.github, config.baseUrl);
    }

    case 'api': {
      if (!config.api) {
        throw new Error(
          'API backend requires api config. Run `clipr config` to set baseUrl and token.',
        );
      }
      const { ApiBackend } = await import('./backends/api.js');
      return new ApiBackend(config.api, config.baseUrl);
    }

    default: {
      // Fall back to local JsonBackend wrapped as UrlBackend
      return new JsonBackendAdapter(config.dbPath, config.baseUrl);
    }
  }
}
