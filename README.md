# clipr

A fast, git-friendly URL shortener. Manage short links from your terminal, store them in version-controlled JSON, and serve redirects from a Cloudflare Worker.

## Packages

| Package | Description |
|---------|-------------|
| [`@clipr/core`](packages/core) | Shared types, validation, UTM utilities, and backend interface |
| [`clipr`](packages/cli) | CLI for shortening, managing, and deploying URLs |
| [`@clipr/worker`](packages/worker) | Cloudflare Worker that serves redirects |
| [`@clipr/web`](packages/web) | Web dashboard (coming soon) |

## Quickstart

```bash
# Install dependencies
pnpm install

# Build the core library
pnpm build:core

# Initialize a new URL database
pnpm build:cli
node packages/cli/dist/index.js init --base-url https://your-domain.com

# Or if installed globally:
clipr init --base-url https://your-domain.com
```

## CLI Usage

```bash
# Shorten a URL (random slug)
clipr shorten https://example.com/very/long/path

# Shorten with a custom slug
clipr shorten https://example.com --slug my-link

# Shorten with UTM tracking
clipr shorten https://example.com --slug launch \
  --utm-source twitter --utm-medium social --utm-campaign launch-2026

# Shorten with expiration
clipr shorten https://example.com --slug temp --expires 2026-12-31

# List all shortened URLs
clipr list

# Show details for a slug
clipr info my-link

# Delete a slug
clipr delete my-link

# Set the base URL
clipr config baseUrl https://clpr.sh

# Deploy to Cloudflare KV
clipr deploy --namespace-id YOUR_KV_NAMESPACE_ID
```

## Worker

The Cloudflare Worker handles redirects:

- `GET /:slug` — 302 redirect to target URL (with UTM params appended if configured)
- `GET /health` — Health check endpoint
- Expired links return 410 Gone

### Deploy the Worker

```bash
cd packages/worker

# Configure wrangler.toml with your KV namespace ID
# Then:
npx wrangler deploy
```

## Architecture

```
urls.json (git-tracked)
    ↓ clipr shorten/delete/list
    ↓ clipr deploy
Cloudflare KV
    ↓ GET /:slug
@clipr/worker (302 redirect)
```

The local `urls.json` file is the source of truth. The CLI manages it, and `clipr deploy` syncs entries to Cloudflare KV for the worker to serve.

## Development

```bash
pnpm install          # Install dependencies
pnpm build            # Build all packages
pnpm test             # Run all tests
pnpm lint             # Lint all files
pnpm lint:fix         # Auto-fix lint issues
```

## License

[MIT](LICENSE)
