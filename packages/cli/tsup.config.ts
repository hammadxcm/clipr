import { defineConfig } from 'tsup';

export default defineConfig([
  // CLI entry — gets shebang banner
  {
    entry: { index: 'src/index.ts' },
    format: ['esm'],
    dts: true,
    clean: true,
    sourcemap: true,
    banner: { js: '#!/usr/bin/env node' },
  },
  // Programmatic API entry — no shebang
  {
    entry: { api: 'src/api.ts' },
    format: ['esm'],
    dts: true,
    clean: false,
    sourcemap: true,
  },
]);
