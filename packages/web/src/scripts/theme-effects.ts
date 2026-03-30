/**
 * Canvas-based ambient effect engine for per-theme visual effects.
 * Ported from Slay's theme-effects.ts. Includes matrixRain unique to this engine.
 */

const isTouchDevice =
  typeof window !== 'undefined' && ('ontouchstart' in window || navigator.maxTouchPoints > 0);
const prefersReducedMotion =
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

let canvas: HTMLCanvasElement | null = null;
let ctx: CanvasRenderingContext2D | null = null;
let w = 0;
let h = 0;
let frameId: number | null = null;
let initialized = false;

function resize(): void {
  if (!canvas) return;
  w = canvas.width = canvas.offsetWidth;
  h = canvas.height = canvas.offsetHeight;
}

interface Mote {
  x: number;
  y: number;
  r: number;
  vx: number;
  vy: number;
  opacity: number;
  drift: number;
  speed: number;
  baseOpacity: number;
  glow: number;
  glowSpeed: number;
}

const MOTE_DEFAULTS: Pick<Mote, 'drift' | 'speed' | 'baseOpacity' | 'glow' | 'glowSpeed'> = {
  drift: 0,
  speed: 0,
  baseOpacity: 0,
  glow: 0,
  glowSpeed: 0,
};

function mote(
  base: Omit<Mote, 'drift' | 'speed' | 'baseOpacity' | 'glow' | 'glowSpeed'> &
    Partial<Pick<Mote, 'drift' | 'speed' | 'baseOpacity' | 'glow' | 'glowSpeed'>>,
): Mote {
  return { ...MOTE_DEFAULTS, ...base };
}

interface MoteEffectConfig {
  count: (w: number, h: number) => number;
  spawn: (w: number, h: number) => Mote;
  update: (m: Mote, w: number, h: number) => void;
  draw: (ctx: CanvasRenderingContext2D, m: Mote, color: string) => void;
}

let motes: Mote[] = [];

function initMotes(config: MoteEffectConfig): void {
  const baseCount = config.count(w, h);
  const count = isTouchDevice ? Math.floor(baseCount * 0.6) : baseCount;
  motes = [];
  for (let i = 0; i < count; i++) motes.push(config.spawn(w, h));
}

function drawMotes(config: MoteEffectConfig, color: string): void {
  if (!ctx) return;
  ctx.clearRect(0, 0, w, h);
  for (const m of motes) {
    config.update(m, w, h);
    config.draw(ctx, m, color);
  }
}

/* ── Effect: Blood Rain ── */
const bloodRain: MoteEffectConfig = {
  count: (w, h) => Math.min(120, Math.floor((w * h) / 8000)),
  spawn: (w, h) => {
    const d = Math.random();
    return mote({
      x: Math.random() * w,
      y: Math.random() * h,
      r: 0.5 + d * 2,
      vx: (Math.random() - 0.5) * 0.3,
      vy: 2 + d * 4,
      opacity: 0.15 + d * 0.45,
      speed: 8 + d * 25,
      drift: Math.random() * Math.PI * 2,
    });
  },
  update: (m, w, h) => {
    m.y += m.vy;
    m.x += m.vx + Math.sin(m.drift) * 0.15;
    m.drift += 0.01;
    if (m.y > h + m.speed) {
      m.y = -(m.speed + Math.random() * 40);
      m.x = Math.random() * w;
    }
    if (m.x > w) m.x = 0;
    if (m.x < 0) m.x = w;
  },
  draw: (ctx, m, color) => {
    const tl = m.speed;
    const g = ctx.createLinearGradient(m.x, m.y - tl, m.x, m.y);
    g.addColorStop(0, `${color}0)`);
    g.addColorStop(0.6, `${color}${m.opacity * 0.5})`);
    g.addColorStop(1, `${color}${m.opacity})`);
    ctx.beginPath();
    ctx.moveTo(m.x, m.y - tl);
    ctx.lineTo(m.x, m.y);
    ctx.strokeStyle = g;
    ctx.lineWidth = m.r;
    ctx.lineCap = 'round';
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(m.x, m.y, m.r * 0.6, 0, Math.PI * 2);
    ctx.fillStyle = `${color}${m.opacity * 0.8})`;
    ctx.fill();
  },
};

/* ── Effect: Matrix Rain ── */
let matrixDrops: number[] = [];
let matrixFrameCount = 0;
const matrixChars =
  '\u30A2\u30A4\u30A6\u30A8\u30AA\u30AB\u30AD\u30AF\u30B1\u30B3\u30B5\u30B7\u30B9\u30BB\u30BD\u30BF\u30C1\u30C4\u30C6\u30C8\u30CA\u30CB\u30CC\u30CD\u30CE\u30CF\u30D2\u30D5\u30D8\u30DB\u30DE\u30DF\u30E0\u30E1\u30E2\u30E4\u30E6\u30E8\u30E9\u30EA\u30EB\u30EC\u30ED\u30EF\u30F2\u30F30123456789ABCDEF';
const matrixFontSize = 14;

function initMatrixRain(): void {
  const columns = Math.floor(w / matrixFontSize);
  matrixDrops = [];
  for (let i = 0; i < columns; i++) matrixDrops[i] = Math.random() * -100;
  matrixFrameCount = 0;
}

function drawMatrixRain(color: string): void {
  if (!ctx) return;
  matrixFrameCount++;
  if (matrixFrameCount % 2 !== 0) return;
  ctx.fillStyle = 'rgba(10, 10, 10, 0.06)';
  ctx.fillRect(0, 0, w, h);
  ctx.fillStyle = color;
  ctx.font = `${matrixFontSize}px monospace`;
  for (let i = 0; i < matrixDrops.length; i++) {
    if (Math.random() > 0.3) {
      const char = matrixChars[Math.floor(Math.random() * matrixChars.length)];
      ctx.fillText(char, i * matrixFontSize, matrixDrops[i] * matrixFontSize);
      if (matrixDrops[i] * matrixFontSize > h && Math.random() > 0.98) matrixDrops[i] = 0;
      matrixDrops[i]++;
    }
  }
}

/* ── Effect: Neon Sparks ── */
const neonSparks: MoteEffectConfig = {
  count: (w, h) => Math.min(70, Math.floor((w * h) / 14000)),
  spawn: (w, h) => {
    const a = Math.random() * Math.PI * 2;
    const s = Math.random() * 3 + 3;
    return mote({
      x: Math.random() * w,
      y: Math.random() * h,
      r: Math.random() * 1.5 + 0.5,
      vx: Math.cos(a) * s,
      vy: Math.sin(a) * s,
      opacity: Math.random() * 0.5 + 0.5,
    });
  },
  update: (m, w, h) => {
    m.x += m.vx;
    m.y += m.vy;
    m.vx *= 0.96;
    m.vy *= 0.96;
    m.opacity -= 0.015;
    if (m.opacity <= 0) {
      const a = Math.random() * Math.PI * 2;
      const s = Math.random() * 3 + 3;
      m.x = Math.random() * w;
      m.y = Math.random() * h;
      m.vx = Math.cos(a) * s;
      m.vy = Math.sin(a) * s;
      m.opacity = Math.random() * 0.5 + 0.5;
    }
  },
  draw: (ctx, m, color) => {
    const tx = m.x - m.vx * 4;
    const ty = m.y - m.vy * 4;
    const g = ctx.createLinearGradient(tx, ty, m.x, m.y);
    g.addColorStop(0, `${color}0)`);
    g.addColorStop(1, `${color}${m.opacity})`);
    ctx.beginPath();
    ctx.moveTo(tx, ty);
    ctx.lineTo(m.x, m.y);
    ctx.strokeStyle = g;
    ctx.lineWidth = m.r;
    ctx.lineCap = 'round';
    ctx.stroke();
  },
};

/* ── Effect: Cosmic Dust ── */
const cosmicDust: MoteEffectConfig = {
  count: (w, h) => Math.min(60, Math.floor((w * h) / 16000)),
  spawn: (w, h) =>
    mote({
      x: Math.random() * w,
      y: Math.random() * h,
      r: Math.random() * 3 + 1,
      vx: 0,
      vy: 0,
      opacity: 0,
      drift: Math.random() * Math.PI * 2,
      speed: Math.random() * 0.003 + 0.001,
      baseOpacity: Math.random() * 0.3 + 0.2,
      glow: Math.random() * Math.PI * 2,
      glowSpeed: Math.random() * 0.02 + 0.01,
    }),
  update: (m, w, h) => {
    m.x += Math.cos(m.drift) * 0.3 + (Math.random() - 0.5) * 0.1;
    m.y += Math.sin(m.drift) * 0.25 + (Math.random() - 0.5) * 0.1;
    m.drift += m.speed;
    m.glow += m.glowSpeed;
    if (m.x < -10) m.x = w + 10;
    if (m.x > w + 10) m.x = -10;
    if (m.y < -10) m.y = h + 10;
    if (m.y > h + 10) m.y = -10;
  },
  draw: (ctx, m, color) => {
    const p = Math.sin(m.glow) * 0.2;
    const o = m.baseOpacity + p;
    ctx.beginPath();
    ctx.arc(m.x, m.y, m.r * 3, 0, Math.PI * 2);
    ctx.fillStyle = `${color}${Math.max(0.02, o * 0.12)})`;
    ctx.fill();
    ctx.beginPath();
    ctx.arc(m.x, m.y, m.r, 0, Math.PI * 2);
    ctx.fillStyle = `${color}${Math.max(0.1, o * 0.5)})`;
    ctx.fill();
  },
};

/* ── Effect: Retro Grid ── */
let gridOffset = 0;
function drawRetroGrid(color: string): void {
  if (!ctx) return;
  ctx.clearRect(0, 0, w, h);
  const horizon = h * 0.45;
  const gridLines = 20;
  const gridCols = 30;
  gridOffset = (gridOffset + 0.5) % (h / gridLines);
  const skyGrad = ctx.createLinearGradient(0, 0, 0, horizon);
  skyGrad.addColorStop(0, 'rgba(26, 16, 40, 0)');
  skyGrad.addColorStop(1, 'rgba(255, 46, 151, 0.05)');
  ctx.fillStyle = skyGrad;
  ctx.fillRect(0, 0, w, horizon);
  ctx.lineWidth = 1;
  for (let i = 0; i <= gridLines; i++) {
    const y = horizon + (i + gridOffset / (h / gridLines)) * ((h - horizon) / gridLines);
    ctx.strokeStyle = `${color}${(i / gridLines) * 0.3})`;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(w, y);
    ctx.stroke();
  }
  const cx = w / 2;
  for (let j = -gridCols / 2; j <= gridCols / 2; j++) {
    const s = j / (gridCols / 2);
    ctx.strokeStyle = `${color}0.15)`;
    ctx.beginPath();
    ctx.moveTo(cx + s * w * 0.8, h);
    ctx.lineTo(cx + s * 20, horizon);
    ctx.stroke();
  }
  const sunGrad = ctx.createRadialGradient(cx, horizon - 30, 10, cx, horizon - 30, 80);
  sunGrad.addColorStop(0, 'rgba(249, 200, 14, 0.3)');
  sunGrad.addColorStop(0.5, 'rgba(255, 46, 151, 0.15)');
  sunGrad.addColorStop(1, 'rgba(255, 46, 151, 0)');
  ctx.fillStyle = sunGrad;
  ctx.beginPath();
  ctx.arc(cx, horizon - 30, 80, 0, Math.PI * 2);
  ctx.fill();
}

/* ── Effect: Snowfall ── */
const snowfall: MoteEffectConfig = {
  count: (w, h) => Math.min(120, Math.floor((w * h) / 8000)),
  spawn: (w, h) =>
    mote({
      x: Math.random() * w,
      y: Math.random() * h,
      r: Math.random() * 3 + 1,
      vy: Math.random() * 1 + 0.3,
      vx: (Math.random() - 0.5) * 0.5,
      opacity: Math.random() * 0.6 + 0.2,
    }),
  update: (m, w, h) => {
    m.y += m.vy;
    m.x += m.vx + Math.sin(m.y * 0.01) * 0.3;
    if (m.y > h) {
      m.y = -5;
      m.x = Math.random() * w;
    }
    if (m.x > w) m.x = 0;
    if (m.x < 0) m.x = w;
  },
  draw: (ctx, m, color) => {
    ctx.beginPath();
    ctx.arc(m.x, m.y, m.r, 0, Math.PI * 2);
    ctx.fillStyle = `${color}${m.opacity})`;
    ctx.fill();
  },
};

/* ── Effect: Fireflies ── */
const fireflies: MoteEffectConfig = {
  count: (w, h) => Math.min(40, Math.floor((w * h) / 25000)),
  spawn: (w, h) =>
    mote({
      x: Math.random() * w,
      y: Math.random() * h,
      r: Math.random() * 3 + 2,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      opacity: 0,
      glow: Math.random() * Math.PI * 2,
      glowSpeed: Math.random() * 0.03 + 0.01,
    }),
  update: (m, w, h) => {
    m.x += m.vx;
    m.y += m.vy;
    m.glow += m.glowSpeed;
    if (m.x < 0 || m.x > w) m.vx *= -1;
    if (m.y < 0 || m.y > h) m.vy *= -1;
  },
  draw: (ctx, m, color) => {
    const i = (Math.sin(m.glow) + 1) / 2;
    const o = i * 0.6 + 0.1;
    const r = m.r * (0.8 + i * 0.4);
    ctx.beginPath();
    ctx.arc(m.x, m.y, r * 3, 0, Math.PI * 2);
    ctx.fillStyle = `${color}${o * 0.15})`;
    ctx.fill();
    ctx.beginPath();
    ctx.arc(m.x, m.y, r, 0, Math.PI * 2);
    ctx.fillStyle = `${color}${o})`;
    ctx.fill();
  },
};

/* ── Theme → Effect Map ── */
type EffectName =
  | 'bloodRain'
  | 'matrixRain'
  | 'neonSparks'
  | 'cosmicDust'
  | 'retroGrid'
  | 'snowfall'
  | 'fireflies';
interface ThemeEffectEntry {
  effect: EffectName | null;
  color: string;
}

const themeEffects: Record<string, ThemeEffectEntry> = {
  dark: { effect: null, color: '' },
  light: { effect: null, color: '' },
  hacker: { effect: null, color: '' },
  blood: { effect: 'bloodRain', color: 'rgba(255, 0, 64, ' },
  bloodmoon: { effect: 'bloodRain', color: 'rgba(255, 0, 64, ' },
  synthwave: { effect: 'retroGrid', color: 'rgba(255, 46, 151, ' },
  matrix: { effect: 'matrixRain', color: 'rgba(0, 255, 65, 0.6)' },
  cyberpunk: { effect: 'neonSparks', color: 'rgba(0, 255, 255, ' },
  gruvbox: { effect: 'fireflies', color: 'rgba(250, 189, 47, ' },
  arctic: { effect: 'snowfall', color: 'rgba(3, 105, 161, ' },
  nebula: { effect: 'cosmicDust', color: 'rgba(224, 64, 251, ' },
};

const effectMap: Record<string, { init: () => void; draw: (color: string) => void }> = {
  retroGrid: { init: () => {}, draw: drawRetroGrid },
  matrixRain: { init: initMatrixRain, draw: drawMatrixRain },
  bloodRain: { init: () => initMotes(bloodRain), draw: (c) => drawMotes(bloodRain, c) },
  neonSparks: { init: () => initMotes(neonSparks), draw: (c) => drawMotes(neonSparks, c) },
  cosmicDust: { init: () => initMotes(cosmicDust), draw: (c) => drawMotes(cosmicDust, c) },
  snowfall: { init: () => initMotes(snowfall), draw: (c) => drawMotes(snowfall, c) },
  fireflies: { init: () => initMotes(fireflies), draw: (c) => drawMotes(fireflies, c) },
};

let currentEffect: EffectName | null = null;
let currentEntry: ThemeEffectEntry = themeEffects.dark;

function switchEffect(theme: string): void {
  currentEntry = themeEffects[theme] || themeEffects.dark;
  const newEffect = currentEntry.effect;
  if (newEffect !== currentEffect) {
    currentEffect = newEffect;
    if (ctx) ctx.clearRect(0, 0, w, h);
    if (currentEffect && effectMap[currentEffect]) effectMap[currentEffect].init();
  }
}

function getCurrentTheme(): string {
  return document.documentElement.getAttribute('data-theme') || 'dark';
}

function startLoop(): void {
  if (frameId !== null) return;
  function draw(): void {
    if (document.hidden) {
      frameId = null;
      return;
    }
    const theme = getCurrentTheme();
    const entry = themeEffects[theme] || themeEffects.dark;
    if (entry.effect !== currentEffect) switchEffect(theme);
    if (currentEffect && effectMap[currentEffect])
      effectMap[currentEffect].draw(currentEntry.color);
    frameId = requestAnimationFrame(draw);
  }
  frameId = requestAnimationFrame(draw);
}

export function initThemeEffects(): void {
  if (initialized) return;
  if (prefersReducedMotion) return;
  canvas = document.getElementById('theme-canvas') as HTMLCanvasElement | null;
  if (!canvas) return;
  ctx = canvas.getContext('2d');
  if (!ctx) return;
  initialized = true;
  resize();
  window.addEventListener('resize', () => {
    resize();
    if (currentEffect && effectMap[currentEffect]) effectMap[currentEffect].init();
  });
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      if (frameId !== null) {
        cancelAnimationFrame(frameId);
        frameId = null;
      }
    } else startLoop();
  });
  window.addEventListener('themechange', () => switchEffect(getCurrentTheme()));
  switchEffect(getCurrentTheme());
  startLoop();
}
