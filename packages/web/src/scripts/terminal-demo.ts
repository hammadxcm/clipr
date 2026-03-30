/**
 * Terminal animation engine for Hero section.
 * Cycles through clipr command scenarios with typing + result animations.
 */

const SCENARIOS = [
  {
    command: 'clipr shorten https://example.com/very/long/path',
    lines: [
      { text: '$ clipr shorten https://example.com/very/long/path', class: 'terminal-command' },
      { text: '\u2713 Shortened https://example.com/very/long/path', class: 'terminal-success' },
      { text: '  https://clpr.sh/x7k9m2', class: 'terminal-output' },
    ],
  },
  {
    command: 'clipr list --json',
    lines: [
      { text: '$ clipr list --json', class: 'terminal-command' },
      { text: '[', class: 'terminal-output' },
      {
        text: '  { "slug": "x7k9m2", "url": "https://example.com/..." },',
        class: 'terminal-output',
      },
      { text: '  { "slug": "docs", "url": "https://docs.clipr.sh" }', class: 'terminal-output' },
      { text: ']', class: 'terminal-output' },
    ],
  },
  {
    command: 'clipr deploy --namespace-id abc123',
    lines: [
      { text: '$ clipr deploy --namespace-id abc123', class: 'terminal-command' },
      { text: '\u2139 Deploying 12 URLs to KV...', class: 'terminal-output' },
      { text: '\u2713 Deployed 12 URLs to Cloudflare KV', class: 'terminal-success' },
    ],
  },
];

let currentScenario = 0;
let animationTimer: ReturnType<typeof setTimeout> | null = null;

function renderScenario(container: HTMLElement, index: number): void {
  const scenario = SCENARIOS[index % SCENARIOS.length];
  container.innerHTML = '';

  scenario.lines.forEach((line, i) => {
    const el = document.createElement('div');
    el.className = `terminal-line ${line.class}`;
    el.style.opacity = '0';
    el.style.transform = 'translateY(8px)';
    el.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
    el.textContent = line.text;
    container.appendChild(el);

    setTimeout(
      () => {
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
      },
      i * 400 + 200,
    );
  });
}

export function initTerminalDemo(): void {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const container = document.getElementById('hero-terminal-body');
  if (!container) return;

  function cycle(): void {
    renderScenario(container, currentScenario);
    currentScenario++;
    animationTimer = setTimeout(cycle, 6000);
  }

  cycle();

  // Pause when not visible
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      if (animationTimer) clearTimeout(animationTimer);
    } else {
      cycle();
    }
  });
}
