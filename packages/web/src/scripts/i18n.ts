type Lang = 'en' | 'es' | 'fr' | 'de' | 'pt' | 'ru' | 'zh' | 'hi' | 'ar' | 'ur' | 'bn' | 'ja';

const RTL_LANGS: Lang[] = ['ar', 'ur'];
const STORAGE_KEY = 'clipr-lang';

export function applyLanguage(lang: Lang): void {
  document.documentElement.dir = RTL_LANGS.includes(lang) ? 'rtl' : 'ltr';
  document.documentElement.lang = lang;
  localStorage.setItem(STORAGE_KEY, lang);
}

export function getStoredLang(): Lang {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) return stored as Lang;
  return 'en';
}

export function initI18n(): void {
  const lang = getStoredLang();
  if (lang !== 'en') {
    applyLanguage(lang);
  }
}
