#!/usr/bin/env node
/**
 * Publicación por goteo del blog (drip).
 *
 * Modo normal (--from=pending, por defecto): publica los posts en
 * `status: pending` (los que pasaron por el email de revisión de la víspera
 * y no fueron suspendidos). Ningún post sale sin haber pasado por revisión.
 *
 * Modo manual (--from=draft --count=N): publica los próximos N drafts por
 * plan_row saltándose la revisión. Solo para emergencias o carga inicial.
 *
 * Idempotente: sin candidatos sale limpio (código 0) y sin tocar nada,
 * así el workflow no commitea de vacío.
 *
 * Uso:
 *   node scripts/publish-next-posts.mjs                    # publica lo pendiente de revisión
 *   node scripts/publish-next-posts.mjs --from=draft --count=2
 *   node scripts/publish-next-posts.mjs --dry-run
 */

import { writeFileSync } from 'node:fs';
import path from 'node:path';
import {
  POSTS_DIR,
  loadPosts,
  patchFrontmatter,
  todayMadrid,
  ghOutput,
} from './lib/posts.mjs';

const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run');
const from = args.find((a) => a.startsWith('--from='))?.split('=')[1] ?? 'pending';
const countArg = args.find((a) => a.startsWith('--count='));
const count = Math.max(1, parseInt(countArg?.split('=')[1] ?? '1', 10) || 1);

if (from !== 'pending' && from !== 'draft') {
  console.error(`--from debe ser "pending" o "draft" (recibido: "${from}")`);
  process.exit(1);
}

const queue = loadPosts().filter((p) => p.status === from);

if (queue.length === 0) {
  console.log(
    from === 'pending'
      ? 'Nada pendiente de revisión: hoy no se publica (o fue suspendido).'
      : 'Cola vacía: no quedan posts en draft.',
  );
  process.exit(0);
}

// pending: se publica todo lo aprobado (normalmente 1). draft: respeta --count.
const toPublish = from === 'pending' ? queue : queue.slice(0, count);
const today = todayMadrid();

for (const post of toPublish) {
  const updated = patchFrontmatter(post.text, (fm) =>
    fm
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

const drafts = loadPosts().filter((p) => p.status === 'draft').length;
console.log(`${dryRun ? '[dry-run] ' : ''}Quedan ${drafts} posts en draft.`);

if (!dryRun) {
  ghOutput({ slugs: toPublish.map((p) => p.slug).join(', ') });
}
