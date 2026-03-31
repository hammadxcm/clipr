import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://clipr.fyniti.co.uk',
  compressHTML: true,
  integrations: [sitemap()],
  vite: {
    plugins: [tailwindcss()],
  },
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'es', 'fr', 'de', 'pt', 'ru', 'zh', 'hi', 'ar', 'ur', 'bn', 'ja'],
    routing: {
      prefixDefaultLocale: false,
    },
  },
});
