// Helpers compartidos por los scripts del drip del blog.
// La cola vive en el frontmatter: status (draft|pending|published|hold) + plan_row.

import { appendFileSync, readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';

export const POSTS_DIR = path.resolve('src/content/blog');

export function frontmatter(text) {
  const match = text.match(/^---\n([\s\S]*?)\n---/);
  return match ? match[1] : '';
}

export function field(fm, name) {
  const match = fm.match(new RegExp(`^${name}:\\s*"?([^"\\n#]+)"?`, 'm'));
  return match ? match[1].trim() : null;
}

/** Reemplaza campos SOLO dentro del bloque de frontmatter. */
export function patchFrontmatter(text, patch) {
  return text.replace(/^---\n[\s\S]*?\n---/, (fmBlock) => patch(fmBlock));
}

/** Primer blockquote del cuerpo (el TL;DR), como texto plano para el email. */
export function tldr(text) {
  const body = text.replace(/^---\n[\s\S]*?\n---/, '');
  const match = body.match(/^>\s*(.+)$/m);
  if (!match) return '';
  return match[1]
    .replace(/\*\*(.+?)\*\*/g, '$1')
    .replace(/\[(.+?)\]\([^)]*\)/g, '$1')
    .trim();
}

/** Lee todos los posts con sus campos de cola, ordenados por plan_row. */
export function loadPosts() {
  return readdirSync(POSTS_DIR)
    .filter((f) => f.endsWith('.md'))
    .map((file) => {
      const text = readFileSync(path.join(POSTS_DIR, file), 'utf8');
      const fm = frontmatter(text);
      return {
        file,
        text,
        status: field(fm, 'status'),
        slug: field(fm, 'slug'),
        title: field(fm, 'title'),
        description: field(fm, 'meta_description'),
        planRow: parseInt(field(fm, 'plan_row') ?? '9999', 10),
      };
    })
    .sort((a, b) => a.planRow - b.planRow);
}

/** Fecha de hoy (YYYY-MM-DD) en Europa/Madrid; los runners van en UTC. */
export function todayMadrid() {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Madrid' }).format(new Date());
}

/** Añade una línea `key=value` al output del step de GitHub Actions. */
export function ghOutput(lines) {
  if (!process.env.GITHUB_OUTPUT) return;
  appendFileSync(
    process.env.GITHUB_OUTPUT,
    Object.entries(lines)
      .map(([k, v]) => `${k}=${String(v).replaceAll('\n', ' ')}`)
      .join('\n') + '\n',
  );
}
