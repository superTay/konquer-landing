# Traspaso de sesión — Landing KonquerAI (konquerai.com)

> Documento de handoff. Estado, tareas pendientes (P1–P6) con los archivos a consultar en cada una, y al final el **prompt inicial** para retomar en la siguiente sesión.

---

## Estado actual

- **Repo:** github.com/superTay/konquer-landing · rama `main` · HEAD `22325a3` (todo pusheado).
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

## P1 — Conversión (mayor palanca)

### 1.1 Captura de leads ⟵ *decisión del usuario pendiente: Cal.com / Calendly / formulario*
Hoy todos los CTAs ("Pide tu demo", "Empieza ahora") hacen scroll a `#contacto` y abren `mailto:info@konquerai.com`. Sustituir por reserva de demo o formulario real. Es la mayor palanca de conversión.
- **Archivos:** `src/components/CtaFinal.astro` (CTAs + mailto), `src/components/Hero.astro` (CTAs → `#contacto`), `src/components/Header.astro` ("Pide tu demo"), `src/components/Footer.astro`, `src/components/EnPreparacion.astro`.
- **Marca/copy:** `marketing_konquer/05_offer.md`, `marketing_konquer/07_pitch_y_script_ventas.md` (objeciones y copy del CTA), `06_homepage_copy.md` (#cta-final).

### 1.2 Chatbot / asistente en la web con reserva *(nuevo)*
Asistente que resuelve dudas del visitante y le ayuda a **reservar/agendar una llamada** — reserva directa **o** a través del propio chatbot. Debe hablar con la voz de marca (tuteo, español de obra, sin emojis, simple para un autónomo de 55 años; "IA" en segundo plano).
- **Decisiones:** widget de terceros (Crisp/Tidio/Chatbase/Voiceflow) **vs** isla React propia contra un LLM (Claude). Cómo conecta con la reserva (deep-link/embed de Cal.com/Calendly desde el chat). Coherente con 1.1.
- **Archivos a crear/tocar:** nuevo componente/isla (ver P4 para `@astrojs/react`), `src/layouts/Base.astro` (carga del script/isla, cuidar LCP), `src/components/Header.astro` y `CtaFinal.astro` (puntos de entrada "Habla con nosotros").
- **Base de conocimiento del bot:** `marketing_konquer/01_buyer_persona.md`, `02_brand_voice.md`, `05_offer.md`, `07_pitch_y_script_ventas.md` (objeciones), `09_features_y_beneficios.md` y el contenido de `src/components/Faq.astro`.
- **Guardrails:** no romper LCP móvil < 2,5s; accesible; móvil-first.

### 1.3 Demo explicativa de cómo funciona el producto *(nuevo)*
Una demo que enseñe el servicio en acción (recomendado: vídeo corto 60–90s del flujo estrella *"hablas → se genera el presupuesto → PDF"*, o un tour interactivo guiado). Hoy la sección Demo solo muestra 3 capturas estáticas.
- **Archivos:** `src/components/Demo.astro` (sección actual, ampliar/insertar el vídeo o tour), `src/components/Pilares.astro` (#como-funciona, los 3 pilares), `src/components/Hero.astro` (posible "Ver cómo funciona").
- **Marca/copy:** `06_homepage_copy.md` (#demo y #como-funciona), `09_features_y_beneficios.md`, `03_storytelling.md`.
- **Assets:** en reserva `src/assets/screenshots/mobile-generando.png` (pantalla "Generando presupuesto"); pedir al usuario una grabación real de la app si se hace vídeo.

### 1.4 og-image.png (1200×630)
Referenciada en `src/layouts/Base.astro` pero **no existe** → preview rota al compartir. Diseñar y subir a `public/og-image.png`.
- **Archivos:** `src/layouts/Base.astro` (meta OG/Twitter), `public/`, `src/styles/global.css` (tokens de color/fuentes), `08_seo_strategy.md`.

### 1.5 Favicon de marca
Sigue el de Astro por defecto. Generar uno con la marca.
- **Archivos:** `public/favicon.svg`, `public/favicon.ico`, `src/layouts/Base.astro` (link tags), `public/logo.svg`.

---

## P2 — Deploy + SEO operativo *(requiere estar online)*

- **Deploy** en Vercel/Netlify + conectar **konquerai.com** con HTTPS. Cabeceras ya listas.
  - Archivos: `vercel.json`, `public/_headers`, `astro.config.mjs` (`site`).
- **Google Search Console** + enviar **sitemap** (ya se genera en build vía `@astrojs/sitemap`).
  - Archivos: `astro.config.mjs`, `public/robots.txt`, `08_seo_strategy.md`.
- **Analítica** (GA4 o Plausible) + banner de cookies si se añade.
  - Archivos: `src/layouts/Base.astro`, nuevo componente banner, `src/pages/legal/cookies.astro`.
- **Google Business Profile.** Plan completo en `marketing_konquer/08_seo_strategy.md`.

---

## P3 — Contenido (tráfico orgánico)

- **Blog**: plan editorial de 10 artículos ya escrito. Página `/blog` es stub.
  - Archivos: `src/pages/blog/`, `marketing_konquer/08_seo_strategy.md` (plan), `02_brand_voice.md`.
- **Boletín** (`/newsletter`) y **Sobre nosotros** (página completa): stubs.
  - Archivos: `src/pages/newsletter.astro`, `src/pages/sobre-nosotros.astro`, `src/components/EnPreparacion.astro`, `marketing_konquer/03_storytelling.md`.
- **Legal real** (privacidad, cookies, términos, GDPR): hoy stubs. **Necesario ANTES de captar datos.** No inventar texto legal: pedir al usuario o plantilla revisada.
  - Archivos: `src/pages/legal/{privacidad,cookies,terminos,gdpr}.astro`, `src/components/EnPreparacion.astro`.
- **Testimonios reales** cuando haya clientes.
  - Archivos: `src/components/Testimonios.astro`, `06_homepage_copy.md` (#testimonios).

---

## P4 — "Wow" con islas React *(decisión ya tomada por el usuario)*

Añadir `@astrojs/react` (NO instalado). Islas con `client:visible`/`client:idle`, confinadas a hero y 1-2 CTAs/tarjetas. (También sostiene el chatbot de 1.2.)
- Ideas: revelado del titular (SplitText), aurora/shader más rico, parallax en mockups, **contador animado** de "30 horas" y del precio.
- Guardrails: respetar `prefers-reduced-motion`, LCP móvil < 2,5s, premium pero sobrio (NO gamer).
- **Archivos:** `astro.config.mjs` (integración), `package.json`, `src/components/Hero.astro`, `CtaFinal.astro`, `Pilares.astro`, `src/styles/global.css` (animaciones ya existentes), `src/layouts/Base.astro` (scripts).

---

## P5 — Limpieza / deuda técnica

- **Anclas de navegación**: `Header.astro` y `Footer.astro` usan `href="#seccion"` (16 enlaces). Desde `/legal/*` y otras subpáginas **no funcionan** → cambiar a `/#seccion`.
  - Archivos: `src/components/Header.astro`, `src/components/Footer.astro`.
- **Borrar `public/logo copia.svg`** (duplicado): `git rm "public/logo copia.svg"`.
- **Logo definitivo**: `public/logo.svg` es placeholder (263 KB). `src/components/Logo.astro` acepta prop `height`.
- Sin trackear/sin usar: `src/assets/screenshots/mobile-generando.png`, `.claude/launch.json`.

---

## P6 — Fase 2

- **A/B tests** de hero/CTA (variantes en `06_homepage_copy.md`).
  - Archivos: `06_homepage_copy.md` (variantes A/B), `src/pages/index.astro`.
- **Landings programáticas por oficio/ciudad** — gran palanca de orgánico.
  - Archivos: `marketing_konquer/08_seo_strategy.md`, nuevo `src/pages/para/` o `[oficio].astro`.

---

## Orden recomendado
P1 (leads + chatbot + demo + og-image + favicon) → P5 (anclas, 5 min, afectan a todas las subpáginas) → **deploy** → P2 (GSC/analítica) → P3 contenido → P4 islas React → P6 fase 2.

---

## Prompt inicial para la siguiente sesión (retomar en P1)

```
Eres un desarrollador senior continuando la landing pública de KonquerAI
(konquerai.com): Astro 6 + Tailwind v4 + TypeScript. La home ya está completa
(imágenes reales, botón Acceder, precio 490 €, sin anglicismos, email
info@konquerai.com) y pusheada a origin/main.

ANTES DE NADA, lee:
1. CLAUDE.md (raíz) — propósito, stack y reglas de marca NO negociables.
2. TRASPASO.md (raíz) — estado y roadmap completo P1–P6 con los archivos de cada punto.
3. marketing_konquer/: README + 01_buyer_persona + 02_brand_voice + 04_value_proposition
   + 05_offer + 06_homepage_copy + 07_pitch_y_script_ventas + 08_seo_strategy.

REGLAS DE MARCA (bloqueantes): tuteo; español de obra; sin emojis; sin anglicismos
en UI cliente; no nombrar "IA" en hero/CTAs. Promesa: "Lleva tu negocio en serio
sin volverte loco con tecnología." Test: ¿lo entendería un pintor de 55 años en 5s?

Vamos a por P1 (Conversión). Tiene 5 frentes (ver TRASPASO.md):
 1.1 Captura de leads — hoy los CTAs van a mailto:info@konquerai.com.
 1.2 Chatbot/asistente que resuelve dudas y ayuda a reservar una llamada
     (reserva directa o a través del propio chatbot).
 1.3 Demo explicativa de cómo funciona el producto (vídeo corto o tour interactivo).
 1.4 og-image.png (1200×630) — falta y rompe la preview al compartir.
 1.5 Favicon de marca.

Primero hazme estas preguntas de decisión y NO implementes hasta tenerlas claras:
 - Mecanismo de reserva: Cal.com, Calendly o formulario propio.
 - Chatbot: widget de terceros (Crisp/Tidio/Chatbase) o isla React propia con LLM.
 - Demo: vídeo (¿tienes grabación de la app?) o tour interactivo con capturas.
Luego puedes empezar en paralelo con 1.4 (og-image) y 1.5 (favicon), que no
dependen de decisiones.

Flujo de trabajo: npm run dev (localhost:4321) para ver cambios; npm run build
para verificar; commits pequeños y push a origin/main. Verifica en navegador
(escritorio y móvil) los cambios visuales. Repo: github.com/superTay/konquer-landing.
```
