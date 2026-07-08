#!/usr/bin/env node
/**
 * Víspera de publicación: pone en revisión el siguiente post de la cola.
 *
 * Modo normal (sin flags):
 *   - Si ya hay un post en `pending`, sale limpio (idempotente: evita
 *     dobles emails si el workflow se relanza).
 *   - Si no, toma el siguiente `draft` por plan_row (salta `hold`) y lo
 *     marca `status: pending`. Emite slug/file/title/description/tldr a
 *     GITHUB_OUTPUT para los pasos de preview y email.
 *
 * Flags:
 *   --dry-run              muestra qué haría, sin escribir
 *   --make-preview <file>  reescribe ese post como published (SOLO para la
 *                          rama de preview; nunca se mergea)
 *   --unqueue <file>       revierte pending → draft (limpieza si el envío
 *                          del email falla: nada queda pendiente sin revisar)
 */

import { readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import {
  POSTS_DIR,
  loadPosts,
  patchFrontmatter,
  tldr,
  todayMadrid,
  ghOutput,
} from './lib/posts.mjs';

const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run');

function flagValue(name) {
  const i = args.indexOf(name);
  return i !== -1 ? args[i + 1] : null;
}

const makePreview = flagValue('--make-preview');
if (makePreview) {
  const file = path.join(POSTS_DIR, path.basename(makePreview));
  const text = readFileSync(file, 'utf8');
  writeFileSync(
    file,
    patchFrontmatter(text, (fm) =>
      fm
        .replace(/^status:.*$/m, 'status: published')
        .replace(/^date:.*$/m, `date: "${todayMadrid()}"`),
    ),
  );
  console.log(`Preview: ${path.basename(makePreview)} publicado solo en esta rama.`);
  process.exit(0);
}

const unqueue = flagValue('--unqueue');
if (unqueue) {
  const file = path.join(POSTS_DIR, path.basename(unqueue));
  const text = readFileSync(file, 'utf8');
  writeFileSync(
    file,
    patchFrontmatter(text, (fm) => fm.replace(/^status:.*$/m, 'status: draft')),
  );
  console.log(`Revertido a draft: ${path.basename(unqueue)}`);
  process.exit(0);
}

const posts = loadPosts();

const alreadyPending = posts.find((p) => p.status === 'pending');
if (alreadyPending) {
  console.log(
    `Ya hay un post en revisión (${alreadyPending.slug}); no se prepara otro.`,
  );
  ghOutput({ file: '', slug: '' });
  process.exit(0);
}

const next = posts.find((p) => p.status === 'draft');
if (!next) {
  console.log('Cola vacía: no quedan posts en draft. Nada que preparar.');
  ghOutput({ file: '', slug: '' });
  process.exit(0);
}

if (dryRun) {
  console.log(`[dry-run] pondría en revisión: ${next.slug} (plan_row ${next.planRow})`);
  process.exit(0);
}

writeFileSync(
  path.join(POSTS_DIR, next.file),
  patchFrontmatter(next.text, (fm) => fm.replace(/^status:.*$/m, 'status: pending')),
);

console.log(`En revisión: ${next.slug} (plan_row ${next.planRow})`);
ghOutput({
  file: next.file,
  slug: next.slug,
  title: next.title ?? next.slug,
  description: next.description ?? '',
  tldr: tldr(next.text),
});
