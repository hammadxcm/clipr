const isTouchDevice =
  typeof window !== 'undefined' && ('ontouchstart' in window || navigator.maxTouchPoints > 0);
const prefersReducedMotion =
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

let initialized = false;
const primaryTargets: HTMLElement[] = [];
let optionTargets: HTMLElement[] = [];
let mouseMoveHandler: ((e: MouseEvent) => void) | null = null;

const PRIMARY_RADIUS = 60;
const OPTION_RADIUS = 30;
const STRENGTH = 0.3;

function isVisible(el: HTMLElement): boolean {
  const dropdown = el.closest('#theme-dropdown, #lang-dropdown');
  return dropdown ? dropdown.classList.contains('open') : true;
}

function handleMouseMove(e: MouseEvent): void {
  const mx = e.clientX;
  const my = e.clientY;

  for (const el of primaryTargets) {
    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = mx - cx;
    const dy = my - cy;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist < PRIMARY_RADIUS) {
      el.style.transform = `translate(${dx * STRENGTH}px, ${dy * STRENGTH}px)`;
    } else {
      el.style.transform = '';
    }
  }

  for (const el of optionTargets) {
    if (!isVisible(el)) {
      el.style.transform = '';
      continue;
    }
    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = mx - cx;
    const dy = my - cy;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist < OPTION_RADIUS) {
      el.style.transform = `translate(${dx * STRENGTH}px, ${dy * STRENGTH}px)`;
    } else {
      el.style.transform = '';
    }
  }
}

export function initMagneticHover(): void {
  if (initialized) return;
  if (isTouchDevice || prefersReducedMotion) return;

  // Primary targets: logo, theme toggle, lang toggle, github button
  const primarySelectors = ['.nav-brand', '#theme-toggle-btn', '#lang-toggle-btn', '.github-btn'];
  for (const sel of primarySelectors) {
    const el = document.querySelector<HTMLElement>(sel);
    if (el) {
      el.style.transition = 'transform 0.2s ease-out';
      primaryTargets.push(el);
    }
  }

  // Option targets: dropdown items
  optionTargets = Array.from(
    document.querySelectorAll<HTMLElement>('.theme-option, .lang-option, #theme-random-btn'),
  );

  if (primaryTargets.length === 0 && optionTargets.length === 0) return;

  initialized = true;

  for (const el of optionTargets) {
    el.style.transition = 'transform 0.15s ease-out, background 0.2s';
  }

  mouseMoveHandler = handleMouseMove;
  document.addEventListener('mousemove', mouseMoveHandler);
}
