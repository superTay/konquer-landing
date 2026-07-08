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
| `status: draft` | En cola, oculto. Entrará en revisión cuando le toque. |
| `status: pending` | Enviado a revisión la víspera. Se publica al día siguiente salvo que se suspenda. |
| `status: published` | Publicado y visible. |
| `status: hold` | Suspendido (por el botón del email o a mano). No se publica hasta devolverlo a `draft`. |
| `review:` | Auditoría: `approved <fecha>` o `suspended <fecha>` según el botón pulsado. |
| `plan_row` | Orden de la cola (ascendente). |

```
draft ──(víspera 18:00, email de revisión)──► pending ──(mañana 9:00)──► published
                                                 │
                                                 └──(botón Suspender)──► hold
```

**Ningún post se publica sin haber pasado por el email de revisión.** La
política es opt-out: si nadie toca los botones, el post sale igualmente a la
mañana siguiente.

## Automatización (GitHub Actions)

### 1. Víspera — [`prepare-review.yml`](../.github/workflows/prepare-review.yml)

Corre **domingo, lunes, miércoles y jueves a las 16:00 UTC** (18:00 Madrid en
verano) — la tarde antes de cada día de publicación. En cada ejecución:

1. `scripts/prepare-review.mjs` marca el siguiente `draft` como `pending`
   (si ya hay un `pending`, no hace nada: idempotente).
2. Crea la rama `preview/<slug>` con el post activado solo ahí → Vercel
   construye una **preview privada idéntica a producción**.
3. Espera la URL del deployment (API de GitHub) y envía el **email de
   revisión** por SMTP desde info@konquerai.com: título, descripción, TL;DR,
   enlace a la preview y botones **Aprobar / Suspender** (enlaces firmados
   con HMAC y caducidad, gestionados por `api/blog-review.ts`).
4. Si algo falla tras marcar `pending` (preview, email…), el propio workflow
   lo revierte a `draft`: nada queda camino de publicarse sin email enviado.

### 2. Publicación — [`publish-blog-posts.yml`](../.github/workflows/publish-blog-posts.yml)

Corre **lunes, martes, jueves y viernes a las 07:00 UTC** (09:00 Madrid en
verano) → 4 posts/semana, ~13 semanas de cola:

1. `scripts/publish-next-posts.mjs` publica el post en `pending` (`status:
   published` + fecha de hoy). Si el revisor lo suspendió (`hold`), ese día
   no se publica nada y la cola sigue con el siguiente en la próxima víspera.
2. Commit + push a `main` → deploy de Vercel: página, índice y sitemap se
   actualizan solos (SEO, Open Graph y JSON-LD salen del frontmatter).
3. Borra las ramas `preview/*` ya consumidas.

**Importante**: los crons de GitHub solo corren desde la rama por defecto
(`main`).

### Secretos y variables

| Dónde | Nombre | Qué es |
|---|---|---|
| Actions (secret) | `SMTP_HOST` / `SMTP_PORT` / `SMTP_USER` / `SMTP_PASSWORD` | SMTP de info@konquerai.com (contraseña de aplicación) |
| Actions (secret) | `BLOG_REVIEW_SECRET` | Clave HMAC de los botones del email |
| Actions (variable) | `REVIEW_EMAIL` | Destinatario de la revisión |
| Vercel (env) | `BLOG_REVIEW_SECRET` | La misma clave HMAC (verificación) |
| Vercel (env) | `BLOG_REVIEW_GITHUB_TOKEN` | PAT fine-grained (solo este repo, contents read/write) |

Además, en Vercel debe estar **desactivada la protección de previews**
(Settings → Deployment Protection → Vercel Authentication off para Preview),
o el enlace del email pedirá login de Vercel.

### Probarlo a mano

En GitHub → **Actions**:

- "Preparar revisión del blog (víspera)" → Run workflow con `dry_run = true`
  (muestra qué post entraría en revisión) o sin dry run (envía el email real).
- "Publicar posts del blog (drip)" → Run workflow. `mode = draft` +
  `count = N` publica saltándose la revisión (solo emergencias).

En local: `node scripts/prepare-review.mjs --dry-run` y
`node scripts/publish-next-posts.mjs --dry-run`.

## Operaciones frecuentes

- **Pausar la publicación**: Actions → *Disable workflow* en **los dos**
  workflows (víspera y publicación); *Enable* para reanudar. Sin tocar código.
- **Cambiar días u hora**: editar los `cron:` de ambos workflows (recuerda:
  UTC, y la víspera va un día por delante de la publicación).
- **Reordenar la cola**: cambiar los `plan_row` de los posts en draft.
- **Congelar un post**: `status: draft` → `status: hold`. Para liberarlo,
  devolverlo a `draft`.
- **Reenviar el email de revisión** (se borró, no llegó…): Actions →
  "Preparar revisión" → Run workflow. Si el post ya está `pending`, ponlo
  antes en `draft` para que lo vuelva a preparar.
- **Reactivar un suspendido**: botón Aprobar del mismo email (mientras el
  enlace no caduque), o a mano `status: hold` → `draft` para que vuelva a
  entrar en cola con revisión nueva.
- **Publicar uno fuera de turno**: Run workflow de publicación con
  `mode = draft`, o editar a mano su frontmatter (`status: published` +
  fecha) y hacer push.
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

