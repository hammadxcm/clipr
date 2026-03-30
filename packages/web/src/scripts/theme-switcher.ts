const STORAGE_KEY = 'clipr-theme';
const THEMES = [
  'hacker',
  'dracula',
  'nord',
  'catppuccin',
  'synthwave',
  'matrix',
  'bloodmoon',
  'midnight',
  'arctic',
  'gruvbox',
  'cyberpunk',
  'nebula',
  'solarized',
  'rosepine',
  'monokai',
] as const;
type ThemeName = (typeof THEMES)[number];

function getStoredTheme(): ThemeName {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored && THEMES.includes(stored as ThemeName)) {
    return stored as ThemeName;
  }
  return 'hacker';
}

function applyTheme(theme: ThemeName): void {
  if (theme === 'hacker') {
    document.documentElement.removeAttribute('data-theme');
  } else {
    document.documentElement.setAttribute('data-theme', theme);
  }
  localStorage.setItem(STORAGE_KEY, theme);

  // Update active state in dropdown
  const options = document.querySelectorAll('.theme-option');
  for (const opt of options) {
    const isActive = opt.getAttribute('data-theme') === theme;
    opt.classList.toggle('active', isActive);
    opt.setAttribute('aria-selected', String(isActive));
  }

  // Dispatch event for canvas and other listeners
  window.dispatchEvent(new CustomEvent('themechange', { detail: { theme } }));
}

export function initThemeSwitcher(): void {
  const toggleBtn = document.getElementById('theme-toggle-btn');
  const dropdown = document.getElementById('theme-dropdown');
  if (!toggleBtn || !dropdown) return;

  // Apply stored theme on load
  const stored = getStoredTheme();
  applyTheme(stored);

  // Toggle dropdown
  toggleBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    const isOpen = dropdown.classList.toggle('open');
    toggleBtn.setAttribute('aria-expanded', String(isOpen));
  });

  // Theme selection
  const options = dropdown.querySelectorAll('.theme-option');
  for (const opt of options) {
    opt.addEventListener('click', () => {
      const theme = opt.getAttribute('data-theme') as ThemeName;
      applyTheme(theme);
      dropdown.classList.remove('open');
      toggleBtn.setAttribute('aria-expanded', 'false');
    });
  }

  // Close on outside click
  document.addEventListener('click', () => {
    dropdown.classList.remove('open');
    toggleBtn.setAttribute('aria-expanded', 'false');
  });

  // Close on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      dropdown.classList.remove('open');
      toggleBtn.setAttribute('aria-expanded', 'false');
    }
  });

  // Prevent dropdown click from closing
  dropdown.addEventListener('click', (e) => {
    e.stopPropagation();
  });

  // Random theme button
  const randomBtn = document.getElementById('theme-random-btn');
  if (randomBtn) {
    randomBtn.addEventListener('click', () => {
      const current = getStoredTheme();
      const others = THEMES.filter((t) => t !== current);
      const random = others[Math.floor(Math.random() * others.length)];
      applyTheme(random);
      dropdown.classList.remove('open');
      toggleBtn.setAttribute('aria-expanded', 'false');
    });
  }
}
