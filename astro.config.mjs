// @ts-check
import { defineConfig } from 'astro/config';

import { readdirSync, readFileSync } from 'node:fs';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';
import { remarkBlogClean } from './src/lib/remark-blog-clean.mjs';

// El índice /blog/ solo entra en el sitemap cuando hay algún post publicado
// (la automatización de publicación cambia status: draft → published).
const hasPublishedPosts = readdirSync('./src/content/blog')
  .filter((f) => f.endsWith('.md'))
  .some((f) =>
    /^status:\s*["']?published/m.test(readFileSync(`./src/content/blog/${f}`, 'utf8')),
  );

// https://astro.build/config
export default defineConfig({
  site: 'https://www.konquerai.com',
  integrations: [
    sitemap({
      lastmod: new Date(),
      // Excluir stubs noindex hasta que tengan contenido real
      filter: (page) =>
        !page.includes('/legal/') &&
        !page.endsWith('/newsletter/') &&
        (hasPublishedPosts || !page.endsWith('/blog/')),
    }),
  ],
  markdown: {
    remarkPlugins: [remarkBlogClean],
  },
  vite: {
    plugins: [tailwindcss()]
  }
});