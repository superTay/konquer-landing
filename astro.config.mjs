// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://konquerai.com',
  integrations: [
    sitemap({
      // Excluir stubs noindex hasta que tengan contenido real
      filter: (page) =>
        !page.includes('/legal/') &&
        !page.endsWith('/blog/') &&
        !page.endsWith('/newsletter/') &&
        !page.endsWith('/sobre-nosotros/'),
    }),
  ],
  vite: {
    plugins: [tailwindcss()]
  }
});