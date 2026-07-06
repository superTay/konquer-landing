# Publicación progresiva del blog

Los 52 posts del plan de contenidos viven en `src/content/blog/` con
`status: draft` en el frontmatter. **Un post en draft no existe para la web**:
no se genera su página, no aparece en el índice `/blog` ni en el sitemap.
Mientras no haya ningún post publicado, `/blog` muestra un estado vacío con
`noindex` y queda fuera del sitemap.

## La cola de publicación

El frontmatter es la única fuente de verdad (no hay fichero de cola aparte):

| Campo | Papel |
|---|---|
| `status: draft` | En cola, oculto. Se publicará cuando le toque. |
| `status: published` | Publicado y visible. |
| `status: hold` | Congelado: la automatización lo salta hasta que lo devuelvas a `draft`. |
| `plan_row` | Orden de la cola (ascendente). |

## Automatización (GitHub Actions)

El workflow [`publish-blog-posts.yml`](../.github/workflows/publish-blog-posts.yml)
corre **lunes, martes, jueves y viernes a las 07:00 UTC** (09:00 Madrid en
verano, 08:00 en invierno) y publica **1 post por ejecución** → 4/semana,
~13 semanas de cola. En cada ejecución:

1. `scripts/publish-next-posts.mjs` toma el siguiente `draft` por `plan_row`,
   le pone `status: published` y `date:` de hoy (hora de Madrid).
2. Si hay cambios, commitea y hace push a `main`.
3. El push dispara el deploy de Vercel: la página `/blog/<slug>` se genera,
   el post entra en el índice y en el sitemap. Nada más que hacer: SEO,
   Open Graph y JSON-LD salen del frontmatter en el build.
4. Con la cola vacía, el script sale limpio y no se commitea nada.

No necesita secretos: usa el `GITHUB_TOKEN` automático con
`permissions: contents: write` declarado en el propio workflow.

**Importante**: los crons de GitHub solo corren desde la rama por defecto
(`main`). El workflow queda inactivo hasta mergear la rama del blog.

### Probarlo a mano antes de dejarlo en automático

En GitHub → pestaña **Actions** → "Publicar posts del blog (drip)" →
**Run workflow**:

- Con `dry_run = true`: muestra en el log qué post publicaría, sin tocar nada.
- Sin dry run: publica de verdad (commit + push + deploy). Sirve también
  para adelantar publicaciones o ponerse al día (`count = 2, 3…`).

También en local: `node scripts/publish-next-posts.mjs --dry-run`.

## Operaciones frecuentes

- **Pausar la publicación**: Actions → workflow → menú "···" →
  *Disable workflow* (y *Enable* para reanudar). Sin tocar código.
- **Cambiar días u hora**: editar el `cron:` del workflow (recuerda: UTC).
- **Reordenar la cola**: cambiar los `plan_row` de los posts en draft.
- **Congelar un post** (p. ej. un fiscal pendiente de revisar):
  `status: draft` → `status: hold`. Para liberarlo, devolverlo a `draft`.
- **Publicar uno fuera de turno**: Run workflow manual, o editar a mano su
  frontmatter (`status: published` + fecha) y hacer push.
- **Añadir posts nuevos**: dejar el `.md` en `src/content/blog/` con el
  mismo frontmatter (con `status: draft` y el siguiente `plan_row` libre)
  y su imagen en `images/` (webp ≤ 1600 px). Entra al final de la cola.

## Detalles que la automatización debe respetar

- **El slug canónico es el del frontmatter** (`slug:`), no el nombre del
  archivo. No renombrar ni cambiar slugs: los enlaces internos entre posts
  (`/blog/<slug>`) dependen de ellos.
- **Enlaces internos a posts aún no publicados**: el enlace se renderiza
  igual pero devolverá 404 hasta que el post hermano se publique. No rompe
  el build. Por eso conviene publicar respetando el orden del plan
  (`plan_row`) dentro de cada silo, o al menos los pilares antes que sus
  satélites.
- **Posts YMYL** (`ymyl: true`, los fiscales): el plan original exige
  revisión humana de datos antes de publicar. Cada post lleva sus notas de
  revisión pendientes en un comentario HTML al final del archivo
  (`NOTAS PARA EL REVISOR`). Los comentarios no se muestran en la web, pero
  la revisión sigue pendiente.
- **Imágenes**: cada post referencia `images/<slug>.webp` (ya comprimidas,
  ~50 KB de media). Si algún día se añade un post nuevo, dejar su imagen en
  `src/content/blog/images/` en webp ≤ 1600 px de ancho; `astro:assets`
  genera las variantes responsive en el build.

