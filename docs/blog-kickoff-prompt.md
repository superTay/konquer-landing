# Prompt de arranque — sesión del BLOG (tráfico orgánico)

> Pega este prompt en una sesión nueva dentro de este repo para empezar el blog.
> El blog es el siguiente paso tras la optimización SEO/GEO (ya en producción).
> Contexto completo en `GEO-SEO-AUDIT.md` y `GEO-SEO-PLAN-ACCION.md`.

---

```
Vamos a crear el BLOG de la landing de KonquerAI para atraer tráfico orgánico y
construir autoridad temática (GEO/SEO). Eres un especialista en contenidos SEO/GEO en
español + Astro.

== CONTEXTO: qué es esto y qué ya está hecho ==
Este repo es la landing pública de KonquerAI (https://www.konquerai.com), un software
español de gestión para autónomos de reformas (pintores, electricistas, fontaneros,
albañiles). Stack: Astro 4 estático + Tailwind v4 + TypeScript, desplegado en Vercel
(producción = rama main).

En una sesión anterior ya hicimos toda la optimización técnica SEO/GEO y está EN
PRODUCCIÓN:
- Dominio unificado a www; schema @graph (Organization + Person + WebSite +
  SoftwareApplication) con sameAs a Wikidata (Q140277090), Crunchbase y LinkedIn.
- robots.txt con crawlers de IA + Content-Signal; llms.txt; sitemap (sitemap-index.xml).
- Comparativa en <table> semántica; FAQ con FAQPage + speakable.
- Página /sobre-nosotros real e indexable con la historia del fundador (Christian Marzal)
  y su foto. El fundador está en el schema como Person con @id "#founder".
- Verificación en Bing Webmaster Tools y Google Search Console (meta tags) + IndexNow.

El blog es el SIGUIENTE PASO NATURAL: hoy es el mayor hueco de "Authoritativeness"
(E-E-A-T) y de profundidad temática. Es lo que convierte la experiencia fiscal/de oficio
de la marca en contenido citable por IA (ChatGPT, Perplexity, Gemini) y rankeable para
queries reales en español.

== LEE ESTO ANTES DE ESCRIBIR NADA (obligatorio) ==
1. CLAUDE.md (reglas del repo y de marca, no negociables).
2. marketing_konquer/README.md, 01_buyer_persona.md, 02_brand_voice.md,
   03_storytelling.md y 08_seo_strategy.md (voz, persona y estrategia SEO ya definidas).
3. GEO-SEO-PLAN-ACCION.md → sección "APARCADO para una sesión aparte — BLOG": ahí está el
   alcance ya pensado (arquitectura, artículos cornerstone y páginas por oficio).
4. GEO-SEO-AUDIT.md para el porqué.

== ALCANCE TÉCNICO DEL BLOG ==
- Usa Astro Content Collections (src/content/blog/) en Markdown/MDX.
- Crea src/pages/blog/[...slug].astro (artículo) y un índice en /blog.
- Cada artículo: schema Article con author enlazado al Person del fundador
  (@id "https://www.konquerai.com/#founder"), datePublished y dateModified, imagen y
  breadcrumb. Reutiliza el layout Base.astro (hereda el grafo de entidad).
- Cuando haya 3+ artículos, quita /blog del noindex (componente EnPreparacion) y de la
  exclusión del sitemap en astro.config.mjs.
- Enlaces salientes a fuentes oficiales (AEAT, BOE) para subir confianza/citabilidad.

== ARTÍCULOS CORNERSTONE PROPUESTOS (queries reales en español) ==
1. "Verifactu para autónomos de reformas (2026): qué es y cómo te afecta".
2. "IVA en reformas: 21 %, 10 % y 0 % de inversión del sujeto pasivo, explicado".
3. "Cómo saber si una obra te dio dinero (margen real, sin Excel)".
4. "IRPF del 7 % para nuevos autónomos: cuándo aplica".
Y, en paralelo o después, páginas por oficio (/para/pintores, /para/electricistas…) con
H1 = la query y su propio FAQ.

== REGLAS DE VOZ (bloqueantes) ==
Español de España "de obra", tuteo siempre, sin emojis, sin anglicismos en UI, frases
cortas. "IA" solo en contenido secundario, nunca en titulares/CTA. Test: ¿lo entendería un
pintor de 55 años en 5 segundos? Cada pieza debe ser factual, con datos concretos y
citable como fuente por una IA.

== CÓMO EMPEZAR ==
Primero léete los archivos de arriba. Luego propón un plan: estructura de la colección,
plantilla del artículo y por cuál de los 4 cornerstone empezamos. No generes los 4 de
golpe: montamos la arquitectura + 1 artículo completo bien hecho, lo revisamos, y
escalamos. Antes de escribir copy, verifica los datos fiscales que cites (son sensibles).
```
