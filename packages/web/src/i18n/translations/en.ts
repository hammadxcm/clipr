export const en: Record<string, string> = {
  // Nav
  'nav.features': 'Features',
  'nav.install': 'Install',
  'nav.demos': 'Demos',
  'nav.api': 'API',
  'nav.dashboard': 'Dashboard',
  'nav.github': 'GitHub',

  // Hero
  'hero.badge': 'Open source \u00b7 Git-friendly \u00b7 Self-hosted',
  'hero.title': 'Short links,',
  'hero.titleAccent': 'full control.',
  'hero.description':
    'A fast URL shortener you own. Manage links from your terminal, track them in git, and serve redirects from the edge.',
  'hero.cta': 'Get started',
  'hero.github': 'View on GitHub',

  // Features
  'features.label': 'Features',
  'features.title': 'Everything you need',
  'features.subtitle':
    'A complete URL shortening stack \u2014 from terminal to edge \u2014 with zero vendor lock-in.',
  'features.edge.title': 'Edge-Fast Redirects',
  'features.edge.desc':
    'Cloudflare Worker serves 302 redirects from 300+ locations. Sub-millisecond KV lookups.',
  'features.cli.title': 'CLI-First Workflow',
  'features.cli.desc':
    'Shorten, list, delete, and deploy from your terminal. Pipe-friendly output for scripting.',
  'features.git.title': 'Git-Tracked Database',
  'features.git.desc':
    'URLs live in a JSON file you commit alongside your code. Full history, diffs, and code review.',
  'features.utm.title': 'UTM Tracking Built-In',
  'features.utm.desc':
    'Attach utm_source, utm_medium, and utm_campaign to any link. Appended automatically on redirect.',
  'features.selfhosted.title': 'Self-Hosted & Open Source',
  'features.selfhosted.desc':
    'No third-party services. Deploy to your own Cloudflare account. MIT licensed.',
  'features.expiry.title': 'Link Expiration',
  'features.expiry.desc':
    'Set expiry dates on links. The worker returns 410 Gone for expired slugs automatically.',
  'features.slugs.title': 'Custom Slugs',
  'features.slugs.desc':
    'Use meaningful slugs like /docs or /launch. Random slugs generated if you prefer.',
  'features.bulk.title': 'Bulk Import',
  'features.bulk.desc': 'Import URLs from JSON or CSV. Export your database anytime for backup.',
  'features.qr.title': 'QR Codes',
  'features.qr.desc': 'Generate QR codes for any short link. Download as SVG or PNG.',
  'features.json.title': 'JSON Output',
  'features.json.desc':
    'Every command supports --json for machine-readable output. Pipe to jq, scripts, or CI.',
  'features.deploy.title': 'Deploy to KV',
  'features.deploy.desc':
    'One command pushes your local urls.json to Cloudflare KV for the worker to serve.',
  'features.tags.title': 'Tag System',
  'features.tags.desc': 'Organize links with tags. Filter by tag in the CLI or dashboard.',
  'features.search.title': 'Search & Filter',
  'features.search.desc':
    'Find links by slug, URL, or description. Client-side search in the dashboard.',
  'features.zero.title': 'Zero Dependencies',
  'features.zero.desc': 'Core package has a single 4KB dependency. No bloat, no supply chain risk.',
  'features.typescript.title': 'TypeScript API',
  'features.typescript.desc':
    'Import and use programmatically. Full type safety with exported types.',
  'features.monorepo.title': 'Monorepo Ready',
  'features.monorepo.desc':
    'Built as a pnpm monorepo. Core, CLI, web, and worker packages work together.',

  // Install
  'install.label': 'Installation',
  'install.title': 'Get started in seconds',
  'install.subtitle': 'Install with your favorite package manager.',

  // Comparison
  'comparison.label': 'Why clipr?',
  'comparison.title': 'Before & After',
  'comparison.before': 'The Old Way',
  'comparison.after': 'The clipr Way',

  // Demo
  'demo.label': 'CLI Demos',
  'demo.title': 'See it in action',
  'demo.subtitle': 'Real commands, real output.',

  // API
  'api.label': 'Programmatic API',
  'api.title': 'Use as a library',
  'api.subtitle': 'Import @clipr/core in your own tools.',

  // Footer
  'footer.tagline': 'A fast, git-friendly URL shortener you own.',
  'footer.quicklinks': 'Quick Links',
  'footer.resources': 'Resources',
  'footer.connect': 'Connect',
  'footer.rights': 'MIT License. All rights reserved.',
};
