// @ts-check
import { defineConfig } from 'astro/config';

import { readdirSync, readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
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

// lastmod real por URL (no la fecha del build): Google ignora un lastmod que cambia
// en todas las URLs a la vez. Guías → `updated` o `date` del frontmatter. El resto →
// fecha del último commit que toca el fichero de la página, o nada si git no está disponible.
const postDates = new Map();
for (const f of readdirSync('./src/content/blog').filter((f) => f.endsWith('.md'))) {
  const raw = readFileSync(`./src/content/blog/${f}`, 'utf8');
  if (!/^status:\s*["']?published/m.test(raw)) continue;
  const slug = raw.match(/^slug:\s*["']?([^"'\n]+)/m)?.[1]?.trim();
  const date = raw.match(/^updated:\s*["']?(\d{4}-\d{2}-\d{2})/m)?.[1] ?? raw.match(/^date:\s*["']?(\d{4}-\d{2}-\d{2})/m)?.[1];
  if (slug && date) postDates.set(slug, date);
}
const newestPost = [...postDates.values()].sort().at(-1);
const gitDate = (paths) => {
  try {
    return execFileSync('git', ['log', '-1', '--format=%cI', '--', ...paths], { encoding: 'utf8' }).trim() || undefined;
  } catch {
    return undefined;
  }
};
// Páginas sueltas → rutas cuyo último commit marca su fecha (la home vive en sus componentes).
const pageSources = {
  '/': ['src/pages/index.astro', 'src/components/home'],
  '/sobre-nosotros/': ['src/pages/sobre-nosotros.astro'],
};
function lastmodFor(url) {
  const path = new URL(url).pathname;
  const post = path.match(/^\/blog\/([^/]+)\/$/)?.[1];
  if (post) return postDates.get(post);
  // Índices que se rehacen solos cuando entra una guía nueva.
  if (path === '/blog/' || path.startsWith('/guias/')) return newestPost;
  if (path in pageSources) return gitDate(pageSources[path]);
  return undefined;
}

// https://astro.build/config
export default defineConfig({
  site: 'https://www.konquerai.com',
  // Precios ocultos: se dan en la llamada. La página vive en src/pages/_precios.astro.
  redirects: {
    '/precios': '/#contacto',
  },
  integrations: [
    sitemap({
      serialize(item) {
        const lastmod = lastmodFor(item.url);
        if (lastmod) item.lastmod = new Date(lastmod).toISOString();
        return item;
      },
      // Excluir stubs noindex hasta que tengan contenido real
      filter: (page) =>
        !page.includes('/legal/') &&
        !page.includes('/precios') &&
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