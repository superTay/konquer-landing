# Plan de acción GEO + SEO — Estado de ejecución

> Documento vivo. Acompaña a `GEO-SEO-AUDIT.md`. Aquí está lo que ya se hizo en código,
> lo que queda en tus manos (con textos listos para pegar), y lo aparcado para otra sesión.
> Fecha de esta tanda: 2026-06-16.

---

## ✅ HECHO en esta sesión (código, ya commiteable y desplegable)

### Crítico
- **Dominio unificado a `www`**: `astro.config.mjs` (`site`), canonical y `og:url`/`og:image`
  en `src/layouts/Base.astro`, y `Sitemap:` en `public/robots.txt`. Verificado: el sitemap
  generado ya sale en `https://www.konquerai.com/`.
- **Schema `@graph`** en `Base.astro`: Organization + Person (fundador) + WebSite +
  SoftwareApplication enlazados por `@id`. Offer con `priceSpecification` mensual (resuelve
  el "¿97 € es al mes o pago único?"). `inLanguage: es-ES`.

### Alto
- **`public/llms.txt`** creado (resumen citable de la marca para IA).
- **`public/robots.txt`** reescrito: allows explícitos para GPTBot, ClaudeBot, PerplexityBot,
  Google-Extended, CCBot, etc. + `Content-Signal: search=yes, ai-train=yes, ai-retrieval=yes`.
- **`Comparativa.astro`** convertida a `<table>` semántica con `<th scope="col">` (mejor
  extracción en AI Overviews). Diseño y responsive intactos (verificado: 2 columnas iguales).
- **Página `/sobre-nosotros` real e indexable** (`src/pages/sobre-nosotros.astro`):
  - Historia del fundador en primera persona, estilo Isra Bravo + voz de marca.
  - **Tu foto** (`src/assets/christian-fundador.jpg`, convertida del PSD, servida en WebP).
  - Bio con autoridad (familia de pintores + empresariales + desarrollo/IA).
  - Quitada del `noindex` y de la exclusión del sitemap. Enlace del footer apuntando a ella.

### Medio
- **CSP en modo Report-Only** en `vercel.json` (riesgo cero; incluye api.web3forms.com y
  cal.com). Pendiente de promover a CSP normal tras revisar consola (ver abajo).
- **`speakable` + `inLanguage`** añadidos al FAQPage (`src/components/Faq.astro`).
- **IndexNow**: clave generada en `public/5eff3b6e6e2b2dbd879330749c7aab3e.txt` +
  `public/.well-known/indexnow.json`. Falta el ping en deploy (ver abajo).
- **`public/_headers` borrado** (era config muerta en Vercel; `vercel.json` manda).
- Hueco de verificación de buscadores (comentado) listo en `Base.astro`.

> **Corrección al audit**: el chatbot usa micrófono (`/api/transcribe`), así que
> `microphone=(self)` en `vercel.json` es correcto e intencional. NO se tocó.

---

## 🧑 PENDIENTE — solo lo puedes hacer tú (te dejo todo redactado)

### 1. Perfiles externos para `sameAs` (la palanca nº1 de autoridad de entidad)
Crea estos perfiles y **mándame las URLs**; yo las meto en el `sameAs` del schema y en el footer.

- **LinkedIn (página de empresa)** — descripción lista para pegar:
  > KonquerAI es un software español de gestión para autónomos y pequeñas empresas de
  > reformas (pintores, electricistas, fontaneros, albañiles). Presupuestos y facturas por
  > voz, facturas de proveedor ordenadas solas, IVA e IRPF al día, adaptado a Verifactu, y
  > el margen real de cada obra. Sin aprender tecnología. Hecho en España.

  Sector: "Desarrollo de software". Ubicación: España. Logo: el de la web.
- **Crunchbase** (gratis, las IA lo leen mucho): misma descripción.
- **Google Business Profile** (si hay dirección): categoría "Empresa de software".
- **Wikidata** (alcanzable ya, sin requisito de notabilidad de Wikipedia): crea un ítem
  "KonquerAI", instance of: *software* / *business*; official website: www.konquerai.com;
  country: España. Disambiguador clave para no confundirte con "Konqueror".

### 2. Verificación en buscadores (necesito el código)
- **Bing Webmaster Tools** (ChatGPT y Copilot leen de Bing): verifica la propiedad
  `www.konquerai.com`, dame el código `msvalidate.01` y yo descomento la meta en `Base.astro`.
- **Google Search Console**: igual, o por DNS. Envía el sitemap `sitemap-index.xml`.

### 3. Decisión de copy: la cifra del "90 %"
En `src/components/Cifras.astro` el dato "90 % de autónomos no sabe qué obra le da dinero"
no tiene fuente. Tu regla de marca es "nunca inflamos cifras". **Opciones** (elige una y lo aplico):
- (a) Atribuirla: "según nuestra experiencia con clientes" (solo si es verdad).
- (b) Reformular sin número: "La mayoría de autónomos no sabe…" (pierde el contador animado).
- (c) Sustituirla por un dato propio real cuando lo tengas medido.
Recomendación: (b) ahora, (c) cuando tengas datos de beta.

### 4. Prueba social
- Recoge 2-3 testimonios reales (nombre + oficio + pueblo, foto si puede) para sustituir el
  placeholder de `src/components/Testimonios.astro`. Es la señal de "Experience" más potente.
- Activa reseñas en Google / Trustpilot / Capterra cuando haya clientes.

### 5. Limpieza
- Borra `public/sobre_nosotros.psd` del **repo principal** (1,8 MB, no debe desplegarse;
  ya hay una copia optimizada en el worktree).

---

## ⚙️ Pasos de despliegue (al hacer deploy de esta rama)

1. **IndexNow ping** (cada vez que cambie contenido). Comando manual:
   ```
   curl "https://www.bing.com/indexnow?url=https://www.konquerai.com/&key=5eff3b6e6e2b2dbd879330749c7aab3e"
   ```
   (Ideal: automatizarlo en un hook de post-deploy de Vercel.)
2. **Promover la CSP**: tras desplegar, abre la consola del navegador en producción, navega
   por la home (abre el chatbot, prueba el formulario y el calendario). Si no hay violaciones
   CSP, cambia en `vercel.json` la clave `Content-Security-Policy-Report-Only` por
   `Content-Security-Policy`. Si hay violaciones, añade el origen que falte a `connect-src`.
3. Verifica el dominio en Bing WMT y GSC; envía el sitemap.

---

## 📌 APARCADO para una sesión aparte — BLOG (no tocado hoy, por decisión tuya)

`src/pages/blog.astro` sigue como stub `noindex` (correcto mientras esté vacío). Cuando lo
abordemos, el alcance es:

- **Objetivo GEO**: convertir tu expertise fiscal en contenido citable por IA y rankeable.
  Hoy el blog es el mayor hueco de "Authoritativeness" (E-E-A-T) y de profundidad temática.
- **Arquitectura**: `src/pages/blog/[slug].astro` con colección de contenido (Astro Content
  Collections), `Article` schema con `author` (enlazado al Person del fundador),
  `datePublished`/`dateModified`, y enlaces salientes a AEAT/BOE.
- **Quitar** `/blog` de la exclusión del sitemap y del `noindex` cuando haya ≥3 artículos.
- **Artículos cornerstone propuestos** (queries reales en español, alto recorrido en IA):
  1. "Verifactu para autónomos de reformas (2026): qué es y cómo te afecta".
  2. "IVA en reformas: 21 %, 10 % y 0 % de inversión del sujeto pasivo, explicado".
  3. "Cómo saber si una obra te dio dinero (margen real, sin Excel)".
  4. "IRPF del 7 % para nuevos autónomos: cuándo aplica".
- **Páginas por oficio** (`/para/pintores`, `/para/electricistas`…) con H1 = la query y su
  propio FAQ: ataca "software presupuestos pintores" y similares que la home no cubre.
  (Esto también está pendiente; puede ir en la misma sesión del blog o aparte.)

---

## Resumen de impacto esperado

Con lo hecho hoy, las categorías que suben de inmediato: **Technical GEO** (host unificado,
robots, llms.txt), **Schema** (de 41 a ~80 con el `@graph`), y **Content E-E-A-T** (página
"Sobre nosotros" real con fundador y foto). **Brand Authority** (lo que más pesa) depende de
los pasos 1-2 de arriba, que son tuyos. El blog (aparcado) es lo que después dispara la
autoridad temática y la citación en IA.
