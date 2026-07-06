#!/usr/bin/env node
/**
 * Publicación por goteo del blog (drip).
 *
 * Toma los próximos N posts pendientes (status: draft) en orden de cola
 * (plan_row ascendente), les pone `status: published` y `date:` de hoy
 * (hora de Madrid). Los posts en `status: hold` se saltan (congelados).
 *
 * Idempotente: cada ejecución avanza la cola; con la cola vacía sale
 * limpio (código 0) sin tocar nada, así el workflow no commitea de vacío.
 *
 * Uso:
 *   node scripts/publish-next-posts.mjs             # publica 1 post
 *   node scripts/publish-next-posts.mjs --count=2   # publica 2 posts
 *   node scripts/publish-next-posts.mjs --dry-run   # muestra qué haría, sin escribir
 */

import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';

const POSTS_DIR = path.resolve('src/content/blog');

const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run');
const countArg = args.find((a) => a.startsWith('--count='));
const count = Math.max(1, parseInt(countArg?.split('=')[1] ?? '1', 10) || 1);

// Fecha de hoy en Europa/Madrid (el runner de Actions va en UTC)
const today = new Intl.DateTimeFormat('en-CA', {
  timeZone: 'Europe/Madrid',
}).format(new Date()); // → YYYY-MM-DD

function frontmatter(text) {
  const match = text.match(/^---\n([\s\S]*?)\n---/);
  return match ? match[1] : '';
}

function field(fm, name) {
  const match = fm.match(new RegExp(`^${name}:\\s*"?([^"\\n#]+)"?`, 'm'));
  return match ? match[1].trim() : null;
}

const queue = readdirSync(POSTS_DIR)
  .filter((f) => f.endsWith('.md'))
  .map((file) => {
    const text = readFileSync(path.join(POSTS_DIR, file), 'utf8');
    const fm = frontmatter(text);
    return {
      file,
      text,
      status: field(fm, 'status'),
      slug: field(fm, 'slug'),
      planRow: parseInt(field(fm, 'plan_row') ?? '9999', 10),
    };
  })
  .filter((p) => p.status === 'draft')
  .sort((a, b) => a.planRow - b.planRow);

if (queue.length === 0) {
  console.log('Cola vacía: no quedan posts en draft. Nada que publicar.');
  process.exit(0);
}

const toPublish = queue.slice(0, count);

for (const post of toPublish) {
  const updated = post.text.replace(/^---\n[\s\S]*?\n---/, (fmBlock) =>
    fmBlock
      .replace(/^status:.*$/m, 'status: published')
      .replace(/^date:.*$/m, `date: "${today}"`),
  );

  if (dryRun) {
    console.log(`[dry-run] publicaría: ${post.slug} (plan_row ${post.planRow})`);
  } else {
    writeFileSync(path.join(POSTS_DIR, post.file), updated);
    console.log(`Publicado: ${post.slug} (plan_row ${post.planRow}, date ${today})`);
  }
}

console.log(
  `${dryRun ? '[dry-run] ' : ''}Quedan ${queue.length - toPublish.length} posts en cola.`,
);

// Los slugs publicados quedan disponibles para el mensaje de commit del workflow
if (process.env.GITHUB_OUTPUT && !dryRun) {
  writeFileSync(
    process.env.GITHUB_OUTPUT,
    `slugs=${toPublish.map((p) => p.slug).join(', ')}\n`,
    { flag: 'a' },
  );
}
