# Contributing to clipr

Thanks for your interest in contributing! This document outlines how to get started.

## Development Setup

1. **Clone the repo**

   ```bash
   git clone https://github.com/hammadxcm/clipr.git
   cd clipr
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   ```

3. **Build all packages**

   ```bash
   pnpm build
   ```

4. **Run tests**

   ```bash
   pnpm test
   ```

## Project Structure

```
packages/
  core/     — Shared types, validation, and utilities (@clipr/core)
  cli/      — CLI tool (clipr)
  web/      — Web dashboard (@clipr/web)
  worker/   — Cloudflare Worker for redirects (@clipr/worker)
tooling/
  biome/    — Shared Biome (linter/formatter) config
  typescript/ — Shared TypeScript config
```

## Workflow

1. Fork the repo and create a feature branch from `main`.
2. Make your changes. Follow the existing code style (enforced by Biome).
3. Add or update tests as needed.
4. Run `pnpm lint` and `pnpm test` before committing.
5. Use [Conventional Commits](https://www.conventionalcommits.org/) for commit messages:
   - `feat(core): add new validation rule`
   - `fix(worker): handle missing slug`
   - Scopes: `core`, `cli`, `web`, `worker`, `tooling`, `ci`, `docs`, `deps`
6. Add a changeset if your change affects a published package:
   ```bash
   pnpm changeset
   ```
7. Open a pull request against `main`.

## Code Style

- Formatting and linting are handled by [Biome](https://biomejs.dev/).
- Run `pnpm lint:fix` to auto-fix issues.
- TypeScript strict mode is enabled — avoid `any` where possible.

## Reporting Issues

Open an issue on GitHub. Include steps to reproduce, expected behavior, and actual behavior.

## License

By contributing, you agree that your contributions will be licensed under the [MIT License](LICENSE).
