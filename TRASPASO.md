# Traspaso de sesión — Landing KonquerAI (konquerai.com)

> Documento de handoff. Trabajamos **paso a paso: una sesión = un paso concreto**.
> Aquí están el estado, el roadmap por sesiones (con los archivos a consultar en cada una) y, al final, el **prompt inicial de la Sesión 1 (Captura de leads)**.

---

## Estado actual

- **Repo:** github.com/superTay/konquer-landing · rama `main` (todo pusheado).
- **Stack:** Astro 6 + Tailwind v4 + TypeScript. Imágenes con `astro:assets` (sharp).
- **Comandos:** `npm run dev` → http://localhost:4321 · `npm run build` (la verdad de producción).
- **Hecho:** home completa con todas sus imágenes reales/emocionales, botón "Acceder" → app.konquerai.com, precio 490 €, anglicismos limpiados, email `info@konquerai.com`.
- **NO desplegada todavía.**

### Reglas de marca (bloqueantes) — leer SIEMPRE antes de tocar copy
- `CLAUDE.md` (raíz) + carpeta `marketing_konquer/` (fuente única de verdad).
- Tuteo; español de obra; **sin emojis**; **sin anglicismos** en copy de cliente; **no nombrar "IA"** en hero/CTAs (sí en meta/schema).
- Promesa: *"Lleva tu negocio en serio sin volverte loco con tecnología."*
- Test: ¿lo entendería un pintor de 55 años en 5 segundos?

### Gotchas técnicos
- `global.css` se importa en el frontmatter de `Base.astro` (nunca con `<style>@import`).
- Si reescribes el `<style>` de un componente y no se aplica en localhost → **reinicia el dev server** (`pkill -f "astro dev"` y `npm run dev`). El build de producción es la verdad.
- Las animaciones/efectos solo se ven en navegador, no en capturas estáticas.

---

## Roadmap por sesiones

> Orden recomendado. La **Sesión 1 (leads) está fijada**; el resto es flexible. El **chatbot (S8)** y la **demo explicativa (S9)** son pasos aparte, más adelante.

### Sesión 1 — Captura de leads ⟵ PRÓXIMA
Hoy todos los CTAs ("Pide tu demo", "Empieza ahora") hacen scroll a `#contacto` y abren `mailto:info@konquerai.com`. Sustituir por reserva/formulario real. Mayor palanca de conversión.
- **Decisión:** Cal.com / Calendly / formulario propio (¿a dónde van los datos?).
- **Archivos:** `src/components/CtaFinal.astro` (CTAs + mailto), `Hero.astro` (CTAs → `#contacto`), `Header.astro` ("Pide tu demo"), `Footer.astro`, `EnPreparacion.astro`.
- **Marca/copy:** `marketing_konquer/05_offer.md`, `07_pitch_y_script_ventas.md`, `06_homepage_copy.md` (#cta-final).
- **Nota:** si es formulario, incluir checkbox de consentimiento que enlace a `/legal/privacidad` (ver Sesión 2).

### Sesión 2 — Legal real (necesario para captar datos)
Hoy `/legal/*` son stubs (`EnPreparacion`). GDPR exige privacidad + consentimiento al recoger datos. No inventar texto legal: pedir al usuario o plantilla revisada por él.
- **Archivos:** `src/pages/legal/{privacidad,cookies,terminos,gdpr}.astro`, `src/components/EnPreparacion.astro`.

### Sesión 3 — og-image.png (1200×630)
Referenciada en `Base.astro` pero **no existe** → preview rota al compartir. Diseñar y subir a `public/og-image.png`.
- **Archivos:** `src/layouts/Base.astro` (meta OG/Twitter), `public/`, `src/styles/global.css` (tokens), `marketing_konquer/08_seo_strategy.md`.

### Sesión 4 — Favicon de marca
Sigue el de Astro por defecto. Generar uno con la marca.
- **Archivos:** `public/favicon.svg`, `public/favicon.ico`, `src/layouts/Base.astro` (link tags), `public/logo.svg`.

### Sesión 5 — Limpieza / deuda técnica
- **Anclas de nav**: `Header.astro` y `Footer.astro` usan `href="#seccion"` (16 enlaces) → no funcionan desde `/legal/*` y subpáginas → cambiar a `/#seccion`.
- **Borrar `public/logo copia.svg`** (duplicado): `git rm "public/logo copia.svg"`.
- **Logo definitivo**: `public/logo.svg` es placeholder (263 KB). `src/components/Logo.astro` acepta prop `height`.
- **Archivos:** `Header.astro`, `Footer.astro`, `Logo.astro`, `public/`.

### Sesión 6 — Deploy
Vercel/Netlify + conectar **konquerai.com** con HTTPS. Cabeceras ya listas.
- **Archivos:** `vercel.json`, `public/_headers`, `astro.config.mjs` (`site`).

### Sesión 7 — SEO operativo (ya online)
Google Search Console + enviar **sitemap** (se genera en build). Analítica (GA4/Plausible) + banner de cookies. Google Business Profile.
- **Archivos:** `astro.config.mjs` (`@astrojs/sitemap`), `public/robots.txt`, `src/layouts/Base.astro` (scripts analítica), banner de cookies (nuevo), `marketing_konquer/08_seo_strategy.md`.

### Sesión 8 — Chatbot / asistente con reserva
Asistente que resuelve dudas y ayuda a **reservar una llamada** (reserva directa o a través del propio chatbot). Voz de marca (tuteo, español de obra, sin emojis, simple; "IA" en segundo plano).
- **Decisión:** widget de terceros (Crisp/Tidio/Chatbase/Voiceflow) vs isla React propia con LLM. Cómo conecta con la reserva (deep-link/embed de la Sesión 1).
- **Archivos:** nuevo componente/isla (ver Sesión 10 para `@astrojs/react`), `src/layouts/Base.astro` (carga, cuidar LCP), `Header.astro` y `CtaFinal.astro` (entradas).
- **Conocimiento del bot:** `marketing_konquer/01_buyer_persona.md`, `02_brand_voice.md`, `05_offer.md`, `07_pitch_y_script_ventas.md`, `09_features_y_beneficios.md` y el contenido de `src/components/Faq.astro`.

### Sesión 9 — Demo explicativa de cómo funciona
Demo del producto en acción (recomendado: vídeo corto 60–90s del flujo *"hablas → presupuesto → PDF"*, o tour interactivo). Hoy la sección Demo solo muestra 3 capturas.
- **Archivos:** `src/components/Demo.astro`, `Pilares.astro` (#como-funciona), `Hero.astro`.
- **Marca/copy:** `06_homepage_copy.md` (#demo, #como-funciona), `09_features_y_beneficios.md`, `03_storytelling.md`.
- **Assets:** en reserva `src/assets/screenshots/mobile-generando.png`; pedir grabación real si se hace vídeo.

### Sesión 10 — "Wow" con islas React (decisión ya tomada)
Añadir `@astrojs/react` (NO instalado). Islas con `client:visible`/`client:idle`, confinadas a hero y 1-2 CTAs/tarjetas. (También sostiene el chatbot de la Sesión 8.)
- Ideas: revelado del titular (SplitText), aurora/shader más rico, parallax en mockups, **contador animado** de "30 horas" y del precio.
- Guardrails: `prefers-reduced-motion`, LCP móvil < 2,5s, premium pero sobrio (NO gamer).
- **Archivos:** `astro.config.mjs`, `package.json`, `Hero.astro`, `CtaFinal.astro`, `Pilares.astro`, `src/styles/global.css`, `Base.astro`.

### Sesión 11 — Blog (tráfico orgánico)
Plan editorial de 10 artículos ya escrito. Página `/blog` es stub.
- **Archivos:** `src/pages/blog/`, `marketing_konquer/08_seo_strategy.md` (plan), `02_brand_voice.md`.

### Sesión 12 — Sobre nosotros + Boletín (páginas completas)
Stubs hoy.
- **Archivos:** `src/pages/sobre-nosotros.astro`, `src/pages/newsletter.astro`, `EnPreparacion.astro`, `marketing_konquer/03_storytelling.md`.

### Sesión 13 — Testimonios reales (cuando haya clientes)
- **Archivos:** `src/components/Testimonios.astro`, `06_homepage_copy.md` (#testimonios).

### Sesión 14 — A/B tests (fase 2)
Variantes de hero/CTA.
- **Archivos:** `06_homepage_copy.md` (variantes A/B), `src/pages/index.astro`.

### Sesión 15 — Landings programáticas por oficio/ciudad (fase 2)
Gran palanca de orgánico.
- **Archivos:** `marketing_konquer/08_seo_strategy.md`, nuevo `src/pages/para/` o `[oficio].astro`.

---

## Prompt inicial — Sesión 1 (Captura de leads)

```
Eres un desarrollador senior continuando la landing pública de KonquerAI
(konquerai.com): Astro 6 + Tailwind v4 + TypeScript. La home ya está completa
y pusheada a origin/main. Trabajamos paso a paso: esta sesión es SOLO la
captura de leads (Sesión 1 del roadmap). El chatbot y la demo explicativa son
sesiones aparte; no las toques aquí.

ANTES DE NADA, lee:
1. CLAUDE.md (raíz) — propósito, stack y reglas de marca NO negociables.
2. TRASPASO.md (raíz) — estado y roadmap por sesiones; mira la "Sesión 1".
3. marketing_konquer/: README + 01_buyer_persona + 02_brand_voice + 05_offer +
   06_homepage_copy + 07_pitch_y_script_ventas.

REGLAS DE MARCA (bloqueantes): tuteo; español de obra; sin emojis; sin
anglicismos en UI cliente; no nombrar "IA" en hero/CTAs. Promesa: "Lleva tu
negocio en serio sin volverte loco con tecnología." Test: ¿lo entendería un
pintor de 55 años en 5 segundos?

TAREA (Sesión 1 — Captura de leads): hoy todos los CTAs ("Pide tu demo",
"Empieza ahora") hacen scroll a #contacto y abren mailto:info@konquerai.com.
Sustituir por un mecanismo real de reserva/contacto.
Archivos: src/components/CtaFinal.astro, Hero.astro, Header.astro, Footer.astro,
EnPreparacion.astro.

Primero pregúntame y NO implementes hasta tenerlo claro:
 - Mecanismo: Cal.com, Calendly o formulario propio (¿a dónde van los datos?).
 - Si es formulario: campos mínimos (nombre, teléfono/email, oficio) y checkbox
   de consentimiento que enlace a /legal/privacidad.

Flujo: npm run dev (localhost:4321); npm run build para verificar; commits
pequeños y push a origin/main; verifica en navegador (escritorio y móvil).
Repo: github.com/superTay/konquer-landing.
```
