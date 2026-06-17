# Auditoría GEO + SEO — KonquerAI

**Fecha:** 2026-06-16
**Sitio:** https://www.konquerai.com (apex `konquerai.com` → 307 → www)
**Tipo de negocio:** SaaS B2B (software de gestión para autónomos de reformas, España)
**Alcance:** código local del repo (Astro 4 estático) + URL en producción
**Páginas indexables analizadas:** 1 (home one-pager). Resto de rutas (`/sobre-nosotros`, `/blog`, `/newsletter`, `/legal/*`) son stubs `noindex`.

---

## Resumen ejecutivo

### GEO Score global: **50 / 100 — Poor** (al borde de Fair)

La landing está **excepcionalmente bien construida a nivel técnico y de copy** (HTML 100% estático server-rendered, fuentes self-hosted, `astro:assets` con WebP/lazy, FAQ con schema, voz de marca impecable). Pero es **casi invisible como entidad para la IA**: cero autoridad externa, sin `Organization`/`sameAs`, sin `llms.txt`, y una inconsistencia de host www/non-www que fragmenta todas las señales. La fortaleza es la base; la debilidad es que ningún motor generativo sabe todavía que la marca existe.

**Las tres palancas que más mueven la aguja:**
1. **Unificar el dominio en `www`** (canonical, OG, schema, sitemap apuntan a non-www que redirige).
2. **Añadir schema `Organization` + `sameAs`** (hoy solo hay `SoftwareApplication`) — la acción de mayor ROI: afecta a ChatGPT, Gemini, Copilot y Perplexity a la vez.
3. **Construir autoridad de entidad externa** (LinkedIn de empresa, Wikidata, Crunchbase, Reddit, directorios de nicho) — el 80% de la mejora del score no es código.

### Desglose del score

| Categoría | Score | Peso | Ponderado |
|---|---|---|---|
| AI Citability | 68/100 | 25% | 17.0 |
| Brand Authority | 8/100 | 20% | 1.6 |
| Content E-E-A-T | 55/100 | 20% | 11.0 |
| Technical GEO | 82/100 | 15% | 12.3 |
| Schema & Structured Data | 41/100 | 10% | 4.1 |
| Platform Optimization | 41/100 | 10% | 4.1 |
| **GEO Score global** | | | **≈ 50/100** |

### Preparación por plataforma de IA

| Plataforma | Score | Estado |
|---|---|---|
| Google AI Overviews (SGE) | 58/100 | Moderado (la más fuerte: FAQ + estructura) |
| Google Gemini | 42/100 | Moderado |
| Bing Copilot | 39/100 | Débil |
| ChatGPT (search) | 34/100 | Débil |
| Perplexity AI | 30/100 | Débil (la más floja: depende de comunidad/Reddit) |

---

## Hallazgo transversal nº1 — Inconsistencia de host www / non-www [CRÍTICO]

Aparece en **4 de las 5 auditorías** como causa raíz. Producción sirve `https://www.konquerai.com` (200), pero `konquerai.com` (apex) hace **307 → www**. Sin embargo, todo el código referencia el **apex**:

- `astro.config.mjs:9` → `site: 'https://konquerai.com'`
- `src/layouts/Base.astro:26` → canonical con fallback al apex
- `src/layouts/Base.astro:46,50` → `og:image` y `og:url` al apex
- `public/robots.txt:4` → `Sitemap: https://konquerai.com/sitemap-index.xml` (apunta a una URL que redirige, no al XML 200)

**Impacto:** señales de canonicalización y de entidad fragmentadas entre dos hostnames. Los motores tienen que reconciliar "el canónico dice apex" contra "el apex redirige a www". Diluye ranking y citación.

**Fix (elige UN host; recomendado `www` porque es el que sirve 200 hoy):**
- `astro.config.mjs` → `site: 'https://www.konquerai.com'` (corrige canonical, sitemap y la línea `Sitemap:` de robots de un golpe al rebuildar).
- `Base.astro` → `og:url` y `og:image` a `https://www.konquerai.com`.
- `public/robots.txt` → `Sitemap: https://www.konquerai.com/sitemap-index.xml`.
- *Alternativa* (solo si prefieres dominio desnudo): en Vercel pon el apex como primario y deja que www redirija a él; entonces no toques `site`.

---

## Issues por severidad

### 🔴 Críticos (arreglar ya)

| # | Hallazgo | Archivo | Fix |
|---|---|---|---|
| C1 | **Host www/non-www inconsistente** (canonical, OG, sitemap, schema en apex; producción en www). | `astro.config.mjs:9`, `Base.astro:26,46,50`, `robots.txt:4` | Unificar todo a `www`. Ver sección de arriba. |
| C2 | **Falta schema `Organization` + `sameAs`.** Sin identidad de entidad: es el mayor gap de descubribilidad por IA. Solo existe `SoftwareApplication`. | `Base.astro:71-85` | Añadir nodo `Organization` con `sameAs` a redes/directorios. JSON-LD listo en Anexo A. |
| C3 | **Autoridad de entidad ≈ 0** + colisión de nombre con "Konqueror" (navegador KDE) y otras marcas "Konquer". Wikipedia EN/ES: 0 resultados (verificado por API). | externo | Plan de autoridad (Fase 1-3, abajo). Usar siempre el disambiguator: *"KonquerAI · software de gestión para autónomos de reformas · España"*. |

### 🟠 Altos (esta semana)

| # | Hallazgo | Archivo | Fix |
|---|---|---|---|
| A1 | **Sin `llms.txt`** (404 verificado). Señal propia 100% bajo tu control, desaprovechada. | crear `public/llms.txt` | Contenido completo en Anexo B. |
| A2 | **Offer del `SoftwareApplication` sin periodo ni URL.** `price: "97"` plano: ni Google ni la IA saben si es 97€/mes o pago único. | `Base.astro:78-84` | Añadir `priceSpecification` (mensual) + `offers.url`. Anexo A. |
| A3 | **Cifras sin fuente** (30 h/mes, 90%, 5 s). Las IA descartan claims numéricos huérfanos. | `Cifras.astro:7-11`, `Pilares.astro:44` | Atribuir ("según datos de nuestros clientes beta…") o reformular como afirmación honesta. |
| A4 | **`/sobre-nosotros` y `/blog` son stubs `noindex`.** Las páginas que cargarían E-E-A-T están vacías. El fundador (Christian Marzal) solo aparece en páginas legales noindex. | `src/pages/sobre-nosotros.astro`, `blog.astro` | Construir la página real + quitar exclusión del sitemap. Mover el manifiesto de `SobreNosotros.astro` a la página standalone con nombre/foto/credencial. |
| A5 | **`public/_headers` es config muerta en Vercel** y contradice `vercel.json` (`microphone=()` vs `microphone=(self)`). Vercel ignora `_headers`. | `public/_headers`, `vercel.json:13` | Borrar `public/_headers`; endurecer `vercel.json` a `microphone=()`. |
| A6 | **Comparativa no es `<table>` real** (son `<div>` en grid). Las AI Overviews extraen tablas semánticas mucho mejor. | `Comparativa.astro` | Convertir a `<table>` con `<thead>`/`<th scope="col">`, manteniendo el grid vía CSS. |

### 🟡 Medios (este mes)

| # | Hallazgo | Archivo | Fix |
|---|---|---|---|
| M1 | **Crawlers de IA no declarados** explícitamente (cubiertos por `*`, pero sin intención legible). | `public/robots.txt` | robots.txt recomendado en Anexo C (allows explícitos + Content-Signal + sitemap www). |
| M2 | **Sin `Content-Security-Policy`.** Resto de headers de seguridad correctos (HSTS, X-Frame-Options, nosniff, Referrer-Policy). | `vercel.json` | Añadir CSP (empezar en report-only por los scripts inline). Snippet en Anexo D. |
| M3 | **Falta `speakable` y `inLanguage`** en los schemas. | `Faq.astro:30`, `Base.astro` | Añadir `speakable` (cssSelector a `.faq-question/.faq-answer` y hero) + `inLanguage: es-ES`. |
| M4 | **Sin IndexNow** (`/.well-known/indexnow-key.txt`). Palanca nº1 de Bing Copilot para indexación casi instantánea. | crear `public/.well-known/` | Generar clave + ping a la API en deploy. |
| M5 | **Sin verificación en Bing WMT / Google Search Console.** ChatGPT y Copilot leen de Bing. | `Base.astro` | Añadir `msvalidate.01` + verificar en GSC; enviar sitemap. |
| M6 | **Sin fecha visible** de publicación/actualización. Tema time-sensitive (Verifactu, IVA). | home + futuros artículos | Añadir "Actualizado: junio 2026" cerca del bloque Verifactu. |
| M7 | **Falta bloque "Qué es" factual y autocontenido** para definición de entidad citable (el H1 es metáfora, no extraíble). | `Promesa.astro` o nueva sección | Añadir párrafo definitorio (qué/quién/dónde/cuánto). Texto propuesto en Anexo E. |
| M8 | **Falta `Person` (fundador)** para E-E-A-T. | `Base.astro` | Nodo `Person` enlazado vía `Organization.founder`. Anexo A. |

### 🟢 Bajos (cuando se pueda)

| # | Hallazgo | Archivo | Fix |
|---|---|---|---|
| B1 | Sitemap sin `<lastmod>`. | `astro.config.mjs` | Habilitar `lastmod` antes de lanzar el blog. |
| B2 | Sin nodo `WebSite` en schema. | `Base.astro` | Añadir `WebSite` mínimo (sin `SearchAction`, no hay buscador). |
| B3 | Sin `BreadcrumbList`. | — | Diferir hasta que existan subpáginas (`/para/*`, `/blog/*`). |
| B4 | Sin enlaces sociales en el Footer. | `Footer.astro` | Añadir LinkedIn/YouTube cuando existan (alimentan `sameAs`). |
| B5 | Testimonios placeholder ("Estamos empezando"). | `Testimonios.astro` | Sustituir por reseñas reales (nombre + oficio + pueblo) en cuanto haya clientes beta. |

---

## Deep dives por categoría

### AI Citability — 68/100 (la métrica más alta)
El copy "español de obra" juega a favor: frases cortas, autocontenidas, con cifras. Es justo lo que ChatGPT/Perplexity extraen bien.
- **Pasajes oro:** FAQ de Verifactu (IVA 21/10/0%, IRPF 15/7%) → 88/100; FAQ de facturas de proveedor (proceso con dato "5 segundos") → 82/100; comparativa de coste en `Pricing.astro` (1.200€ vs 250-500€ vs 97€) → 80/100.
- **Pasajes flojos:** Hero H1 "Tu cuadrilla administrativa, ahora digital" (metáfora, 0 sustancia extraíble — **no la cambies**, pero necesita un párrafo factual cerca); cifras sin fuente (90%, 30h).
- **Techo:** casi todo es promesa de marketing sin atribución. Añadir un bloque "Qué es" + atribuir las cifras sube el score.

### Brand Authority — 8/100 (lo que hunde el global)
Esperable en marca nueva, pero es la palanca nº1. Verificado: Wikipedia EN/ES → 0 resultados; búsqueda web "KonquerAI" → 0 menciones del producto; **colisión de nombre** con Konqueror y otras "Konquer". Sin Wikidata, sin LinkedIn enlazado, sin reseñas en directorios. Ver plan de autoridad abajo.

### Content E-E-A-T — 55/100
- **Experience (14/25):** escenarios de oficio muy creíbles, pero cifras autodeclaradas sin fuente y testimonios placeholder.
- **Expertise (15/25):** literacy fiscal real y correcta (IVA, IRPF, Verifactu, inversión sujeto pasivo) — pero sin autor humano y sin contenido educativo (blog stub).
- **Authoritativeness (9/25):** dimensión más débil. `sobre-nosotros` y `blog` vacíos y noindex. Sin equipo/fundador en páginas indexables.
- **Trustworthiness (18/25):** la más fuerte. HTTPS, legales completas con NIF real y responsable nombrado, garantía 30 días clara, honestidad GDPR. *Fuga:* todo vive en páginas noindex → la home queda anónima para una IA que la resuma.
- Readability ~70-78 (Fairly Easy) — perfecto para el persona. Jerarquía H1/H2/H3 limpia. Contenido claramente humano (no AI-spam).

### Technical GEO — 82/100 (la base, sólida)
- **Lo perfecto:** SSG 100% — todo el contenido (H1/H2, FAQ, precios) está en el HTML servido sin ejecutar JS. GPTBot/ClaudeBot/PerplexityBot ven el 100%. `astro:assets` con WebP + `srcset` + lazy + `width/height` (protege CLS). Brotli + caché immutable. robots no bloquea a nadie.
- **Lo que resta puntos:** mismatch de host (C1), sin `llms.txt`/AI-surface, `_headers` muerto vs `vercel.json`, sin CSP.
- **Core Web Vitals:** estimación por código (riesgo LCP bajo-medio, INP bajo, CLS bajo). **NO medido** — sacar datos reales de PageSpeed Insights / CrUX antes de reportar cifras.

### Schema & Structured Data — 41/100
- **Lo que ya hay (2 bloques, ambos JSON-LD server-rendered):** `SoftwareApplication` (válido pero fino) + `FAQPage` (técnicamente perfecto, 11 Q&A que coinciden con el contenido visible — **mantenlo**).
- **Lo que falta (crítico para GEO):** `Organization` + `sameAs` (mayor gap), `Person` (fundador), `WebSite`, `speakable`, `BreadcrumbList`. El `SoftwareApplication` no tiene `url`, `image`, `publisher/author` ni periodo de precio.
- **No falsear:** `AggregateRating` debe omitirse hasta que haya reseñas reales (regla de marca: "nunca inflamos cifras").

### Platform Optimization — 41/100
Causa raíz transversal: es un **one-pager**. No existe ninguna URL indexable que coincida con queries reales en español ("software presupuestos pintores", "app verifactu autónomos"). Puede ser citado como "qué es KonquerAI" pero no compite por la query de intención. Detalle por plataforma en la tabla del resumen. Sinergias: `Organization`+`sameAs`, host www, páginas por oficio, YouTube y Wikidata cubren varias plataformas a la vez.

---

## Quick wins (esta semana — bajo esfuerzo, alto impacto)

1. **Unificar dominio en `www`** en `astro.config.mjs`, `Base.astro` y `robots.txt`. *(Corrige canonical + sitemap + OG de un golpe.)*
2. **Crear `public/llms.txt`** (Anexo B — listo para pegar).
3. **Actualizar `public/robots.txt`** con allows explícitos de crawlers IA + sitemap www (Anexo C).
4. **Añadir schema `Organization` + `Person` + `WebSite`** al `Base.astro` y arreglar el `Offer` (Anexo A).
5. **Convertir `Comparativa.astro` a `<table>` semántica.**
6. **Borrar `public/_headers`** y endurecer `vercel.json` (`microphone=()`).
7. **Implementar IndexNow** + verificar Bing WMT y Google Search Console.

## Plan a 30 días

**Semana 1 — Cimientos técnicos (código):** quick wins 1-7. Todo en el repo, desplegable hoy.

**Semana 2 — Entidad y contenido base:** crear LinkedIn de empresa completo, ítem en Wikidata, alta en Crunchbase y en directorios de nicho (Capterra/SoftwareDoit). Rellenar `sameAs` con esas URLs reales.

**Semana 3 — E-E-A-T indexable:** construir `/sobre-nosotros` real (fundador + historia + credencial) y quitar `noindex`. Añadir bloque "Qué es" factual + fechas visibles. Atribuir o reformular las cifras.

**Semana 4 — Autoridad temática:** publicar 2-3 artículos cornerstone (reemplazar el stub de blog): "Verifactu para autónomos de reformas (2026)", "IVA en reformas: 21%, 10% y 0%", "Cómo saber si una obra te da dinero". Con `Article` schema, autor, fechas y citas a AEAT/BOE. Empezar presencia auténtica en Reddit (r/Autonomos).

---

## Plan de autoridad de entidad (la palanca nº1, no es código)

- **Fase 1 (controlas tú):** schema `Organization`+`sameAs`, LinkedIn de empresa, Google Business Profile, Crunchbase, `llms.txt`.
- **Fase 2 (terceros):** presencia genuina en Reddit (r/Autonomos, r/spain) respondiendo dudas reales de IVA/Verifactu; alta en Capterra/SoftwareDoit/G2; 3-5 vídeos cortos en YouTube (presupuesto por voz, Verifactu) con transcripción.
- **Fase 3 (autoridad temática):** blog factual fiscal, nota de prensa de nicho, ítem en Wikidata (aún no Wikipedia — no cumple notabilidad).

---

## Anexos (código listo para implementar)

> Los anexos A-E contienen el JSON-LD completo, el `llms.txt`, el `robots.txt` recomendado, la CSP y el copy del bloque "Qué es". Están disponibles en la salida de los subagentes de esta sesión; pídeme que los aplique y los escribo directamente en los archivos. Todas las URLs usan **`www`** (host de producción 200). Todo el texto visible respeta la voz de marca: español de obra, tuteo, sin emojis, sin anglicismos, y sin mencionar "IA" en hero/CTA.

### Resumen de archivos a tocar

| Archivo | Acción |
|---|---|
| `astro.config.mjs` | `site` → www; habilitar `lastmod`; quitar exclusión de `/sobre-nosotros` cuando se construya |
| `src/layouts/Base.astro` | Unificar a www; reemplazar schema por `@graph` (Organization + Person + WebSite + SoftwareApplication); `og:url`/`og:image` a www; `msvalidate.01` |
| `src/components/Faq.astro` | Añadir `speakable` + `inLanguage` |
| `src/components/Comparativa.astro` | `<div>` grid → `<table>` semántica |
| `src/components/Cifras.astro`, `Pilares.astro` | Atribuir/reformular cifras |
| `src/pages/sobre-nosotros.astro`, `blog.astro` | Construir contenido real + quitar noindex |
| `public/robots.txt` | Allows explícitos IA + Content-Signal + sitemap www |
| `public/llms.txt` | **Crear** |
| `public/.well-known/indexnow-key.txt` | **Crear** (IndexNow) |
| `public/_headers` | **Borrar** (muerto en Vercel) |
| `vercel.json` | `microphone=()` + añadir CSP |

---

*Auditoría generada por orquestación de 5 subagentes especializados (technical, schema, ai-visibility, content/E-E-A-T, platform) sobre código local + producción. Las métricas de Core Web Vitals son estimaciones por código, no mediciones — validar con PageSpeed Insights / CrUX. La autoridad de marca en plataformas externas (Reddit, LinkedIn, G2) requiere verificación manual continua.*
