# Publicación progresiva del blog

Los 52 posts del plan de contenidos viven en `src/content/blog/` con
`status: draft` en el frontmatter. **Un post en draft no existe para la web**:
no se genera su página, no aparece en el índice `/blog` ni en el sitemap.
Mientras no haya ningún post publicado, `/blog` muestra un estado vacío con
`noindex` y queda fuera del sitemap.

## Cómo publicar un post (contrato para la automatización)

1. Editar el frontmatter del `.md` correspondiente:
   - `status: draft` → `status: published`
   - `date:` → la fecha real de publicación (formato `"YYYY-MM-DD"`). Todos
     los posts traen de origen `"2026-06-23"`; si no se actualiza, el orden
     del índice cae en `plan_row` y el `datePublished` del schema será falso.
2. Commit + push a `main`.
3. Vercel reconstruye el sitio: la página `/blog/<slug>` se genera, el post
   aparece el primero en el índice y entra en el sitemap automáticamente.

No hay que tocar nada más: SEO (title, meta description, Open Graph), el
JSON-LD del post y los enlaces internos se resuelven solos en el build.

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

## Cadencia prevista

Tres posts por semana (aprox.), automatizado (n8n o similar): elegir el
siguiente `.md` con `status: draft` según `plan_row`, aplicar los dos cambios
de frontmatter, commit y push.
