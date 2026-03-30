export const siteConfig = {
  name: 'clipr',
  tagline: 'Short links, full control.',
  description:
    'A fast, git-friendly URL shortener. Manage short links from your terminal, store them in version-controlled JSON, and serve redirects from a Cloudflare Worker.',
  url: 'https://clipr.sh',
  github: 'https://github.com/hammadxcm/clipr',
  npm: 'https://www.npmjs.com/package/clipr',
};

export const githubConfig = {
  owner: 'hammadxcm',
  repo: 'clipr',
  branch: 'main',
  urlsJsonPath: 'urls.json',
};

export const navLinks = [
  { href: '#features', label: 'nav.features' },
  { href: '#install', label: 'nav.install' },
  { href: '#demos', label: 'nav.demos' },
  { href: '#api', label: 'nav.api' },
  { href: '/dashboard', label: 'nav.dashboard' },
];

export const heroRotatingWords = [
  'full control.',
  'edge-fast.',
  'git-tracked.',
  'lightning quick.',
  'self-hosted.',
  'open source.',
];

export const features = [
  { key: 'edge', icon: '\u26a1', command: 'GET /:slug \u2192 302', color: 'brand' },
  { key: 'cli', icon: '\u2328\ufe0f', command: 'clipr shorten <url>', color: 'brand' },
  { key: 'git', icon: '\ud83d\udcc1', command: 'git commit urls.json', color: 'brand' },
  { key: 'utm', icon: '\ud83c\udfaf', command: '--utm-source twitter', color: 'brand' },
  { key: 'selfhosted', icon: '\ud83d\udd12', command: 'wrangler deploy', color: 'brand' },
  { key: 'expiry', icon: '\u23f0', command: '--expires 2026-12-31', color: 'brand' },
  { key: 'slugs', icon: '\ud83c\udff7\ufe0f', command: '--slug my-link', color: 'brand' },
  { key: 'bulk', icon: '\ud83d\udce6', command: 'clipr import urls.csv', color: 'brand' },
  { key: 'qr', icon: '\ud83d\udcf1', command: 'clipr qr my-link', color: 'brand' },
  { key: 'json', icon: '\ud83d\udcc4', command: 'clipr list --json', color: 'brand' },
  { key: 'deploy', icon: '\ud83d\ude80', command: 'clipr deploy', color: 'brand' },
  { key: 'tags', icon: '\ud83c\udff7\ufe0f', command: '--tags marketing,q1', color: 'brand' },
  { key: 'search', icon: '\ud83d\udd0d', command: 'clipr list --search docs', color: 'brand' },
  { key: 'zero', icon: '\ud83e\uddf9', command: '1 dep (4KB)', color: 'brand' },
  {
    key: 'typescript',
    icon: '\ud83d\udcdd',
    command: "import { shorten } from 'clipr'",
    color: 'brand',
  },
  { key: 'monorepo', icon: '\ud83c\udfe0', command: 'pnpm --filter @clipr/*', color: 'brand' },
];

export const installCommands = {
  npm: { quick: 'npx clipr shorten https://example.com', global: 'npm install -g clipr' },
  pnpm: { quick: 'pnpm dlx clipr shorten https://example.com', global: 'pnpm add -g clipr' },
  yarn: { quick: 'yarn dlx clipr shorten https://example.com', global: 'yarn global add clipr' },
  bun: { quick: 'bunx clipr shorten https://example.com', global: 'bun add -g clipr' },
  brew: { quick: 'brew install clipr', global: 'brew install clipr' },
};

export const demoTabs = [
  {
    id: 'basic',
    label: 'Basic',
    examples: [
      {
        title: 'Shorten a URL',
        lines: [
          '$ clipr shorten https://example.com/long/path',
          '\u2713 Shortened \u2192 https://clpr.sh/x7k9m2',
        ],
      },
      {
        title: 'Custom slug',
        lines: [
          '$ clipr shorten https://docs.example.com --slug docs',
          '\u2713 Shortened \u2192 https://clpr.sh/docs',
        ],
      },
      {
        title: 'List all links',
        lines: [
          '$ clipr list',
          '  3 shortened URLs:',
          '  https://clpr.sh/x7k9m2 \u2192 https://example.com/...',
          '  https://clpr.sh/docs   \u2192 https://docs.example.com',
        ],
      },
    ],
  },
  {
    id: 'advanced',
    label: 'Advanced',
    examples: [
      {
        title: 'UTM tracking',
        lines: [
          '$ clipr shorten https://example.com \\',
          '    --utm-source twitter --utm-medium social',
          '\u2713 UTM params will be appended on redirect',
        ],
      },
      {
        title: 'Link expiration',
        lines: [
          '$ clipr shorten https://promo.com --expires 2026-12-31',
          '\u2713 Link expires on 2026-12-31',
        ],
      },
      { title: 'Delete a link', lines: ['$ clipr delete x7k9m2', '\u2713 Deleted slug "x7k9m2"'] },
    ],
  },
  {
    id: 'output',
    label: 'Output',
    examples: [
      {
        title: 'JSON output',
        lines: ['$ clipr list --json', '[{"slug":"docs","url":"https://docs.example.com",...}]'],
      },
      {
        title: 'Link info',
        lines: [
          '$ clipr info docs',
          '  Slug:    docs',
          '  Target:  https://docs.example.com',
          '  Created: 2026-03-15',
        ],
      },
    ],
  },
  {
    id: 'deploy',
    label: 'Deploy',
    examples: [
      {
        title: 'Initialize',
        lines: ['$ clipr init --base-url https://clpr.sh', '\u2713 Created urls.json'],
      },
      {
        title: 'Deploy to KV',
        lines: [
          '$ clipr deploy --namespace-id abc123',
          '\u2139 Deploying 12 URLs to KV...',
          '\u2713 Deployed 12 URLs to Cloudflare KV',
        ],
      },
      {
        title: 'Set config',
        lines: [
          '$ clipr config baseUrl https://clpr.sh',
          '\u2713 baseUrl set to "https://clpr.sh"',
        ],
      },
    ],
  },
];

export const apiExports = [
  { name: 'JsonBackend', desc: 'Read/write urls.json storage backend' },
  { name: 'generateSlug()', desc: 'Generate a random URL-safe slug' },
  { name: 'validateUrl()', desc: 'Validate http/https URLs' },
  { name: 'validateSlug()', desc: 'Validate slug format and reserved words' },
  { name: 'appendUtm()', desc: 'Append UTM parameters to a URL' },
  { name: 'resolveConfig()', desc: 'Merge partial config with defaults' },
];

export const footerLinks = {
  quickLinks: [
    { href: '#features', label: 'Features' },
    { href: '#install', label: 'Install' },
    { href: '#demos', label: 'Demos' },
    { href: '/dashboard', label: 'Dashboard' },
  ],
  resources: [
    { href: 'https://github.com/hammadxcm/clipr', label: 'GitHub' },
    { href: 'https://www.npmjs.com/package/clipr', label: 'npm' },
    { href: 'https://github.com/hammadxcm/clipr/blob/main/CONTRIBUTING.md', label: 'Contributing' },
    { href: 'https://github.com/hammadxcm/clipr/blob/main/LICENSE', label: 'License' },
  ],
  connect: [
    { href: 'https://github.com/hammadxcm/clipr/issues', label: 'Issues' },
    { href: 'https://github.com/hammadxcm/clipr/discussions', label: 'Discussions' },
  ],
};
