# Informe de auditoría GEO: KonquerAI

**Fecha de la auditoría:** 2026-10-27
**URL:** https://www.konquerai.com
**Tipo de negocio:** Servicios / implantación (híbrido con SaaS: existe producto y app, pero se vende como servicio) + publisher (52 guías de blog)
**Páginas analizadas:** 55 en el sitemap (home, `/sobre-nosotros/`, `/blog/` y 52 guías). Análisis en profundidad de 5 (home, sobre-nosotros, índice del blog y 2 guías), más `robots.txt`, `llms.txt`, sitemap, cabeceras y el código del repo (HEAD = `origin/main` = producción, desplegado el 19-oct-2026).
**Motivo:** primera auditoría tras el reposicionamiento del 12-oct-2026 («servicio / oficina administrativa digital», ya no «app de gestión»). La anterior es de 2026-06-16 (`GEO-SEO-AUDIT.md`), sobre una web de una sola página con otro mensaje.

---

## Resumen ejecutivo

**GEO Score global: 55/100 (Poor, a las puertas de Fair)**

La base técnica sigue siendo muy buena y el reposicionamiento está bien ejecutado en la web visible. El problema es que **el reposicionamiento no ha llegado a las capas que leen las IA**: `llms.txt` sigue describiendo un «software de gestión» con un precio que la web ya no muestra, el schema apunta a una entrada de Wikidata **que fue borrada** y el blog (52 guías, el mayor activo de autoridad temática) no tiene autor humano ni fechas de actualización. Fuera de la web, la marca sigue casi invisible: las búsquedas de «KonquerAI» no devuelven nada propio.

Fortalezas: HTML estático completo, robots.txt abierto a todos los crawlers de IA con IndexNow, schema `@graph` en todas las páginas, 52 guías con TL;DR, tablas y fuentes oficiales (AEAT/BOE), página de fundador real.
Huecos críticos: coherencia de entidad (llms.txt + sameAs roto), autoría y frescura del blog, y autoridad externa.

### Desglose de puntuación

| Categoría | Puntuación | Peso | Ponderado |
|---|---|---|---|
| Citabilidad por IA | 66/100 | 25% | 16.5 |
| Autoridad de marca | 12/100 | 20% | 2.4 |
| Contenido E-E-A-T | 60/100 | 20% | 12.0 |
| GEO técnico | 84/100 | 15% | 12.6 |
| Schema y datos estructurados | 70/100 | 10% | 7.0 |
| Optimización por plataforma | 45/100 | 10% | 4.5 |
| **GEO Score global** | | | **55.0/100** |

> **Cómo leer estas notas:** son valoraciones de auditor sobre evidencia observada, no mediciones de una herramienta. Sirven para comparar mes a mes **si se mantiene el mismo criterio** (por eso las dejo desglosadas). Core Web Vitals **no medidos**: la API de PageSpeed devolvió 429 (cuota agotada). El peso de la home es bajo (~530 KB de imágenes y CSS), así que el riesgo es bajo, pero hay que medirlo con CrUX/PageSpeed antes de dar cifras.

### Cambio frente a la auditoría de junio (50/100)

| Hallazgo de junio | Estado hoy |
|---|---|
| Host www/apex inconsistente | Resuelto (canonical, OG, sitemap, robots en www; apex → 307 a www) |
| Sin schema Organization/Person/WebSite | Resuelto (`@graph` en todas las páginas), **pero con un `sameAs` roto** (ver C2) |
| Sin llms.txt | Existe, **pero desactualizado y contradictorio** (ver C1) |
| Robots.txt sin crawlers de IA declarados | Resuelto (+ Content-Signal) |
| `/sobre-nosotros` y blog como stubs noindex | Resuelto: página real + 52 guías indexables |
| Sin Bing WMT / Search Console | Resuelto (metas `msvalidate.01` y `google-site-verification` presentes) |
| IndexNow | Resuelto (clave y `.well-known` responden 200) |
| CSP | Resuelto y **activa** (ya no es report-only) |
| Comparativa en `<div>` | Reemplazada por tabla semántica en la nueva home («Con el gestor / Con tu equipo») |
| Cifras sin fuente (30 h, 90 %…) | **Sigue pendiente** («Hasta 30 horas al mes», caso anónimo) |
| Autoridad de entidad ≈ 0 | **Sigue pendiente**, es la palanca nº1 |

---

## Estado tras aplicar los quick wins (2026-10-27, sin desplegar)

Aplicado en el repo, sin tocar el copy visible de la home. Compilado (61 páginas) y verificado en local.

| Hallazgo | Estado |
|---|---|
| C1 `llms.txt` desfasado | **Hecho.** Servicio, sin precios publicados, enlaces correctos, guías clave y hub |
| C2 Wikidata roto en `sameAs` | **Hecho.** Quitado. Añadidos LinkedIn de empresa, App Store, Google Play. Crunchbase se mantiene **sin verificar** (bloqueado por anti-bots) |
| A1 Autor del blog | **Hecho (schema).** `author` = fundador en las 52 guías. Byline visible: no se añadió (cambio de contenido) |
| A2 Fecha de revisión | **Hecho (mecanismo).** Campo opcional `updated` en el frontmatter alimenta `dateModified`. Sin `updated`, coincide con la publicación; no se inventan revisiones |
| A5 H2 «Loquenos…» | **Hecho.** Medido: posición de cada palabra idéntica a producción; el texto ahora se lee con espacios |
| A3 / M9 Puente Verifactu e IVA ↔ blog | **Hecho.** Nueva página `/guias/verifactu-e-iva-reformas/` (21 guías, 3 respuestas rápidas, schema), enlace en el pie y en cada guía afectada |
| M1 `lastmod` | **Hecho.** Fecha real por URL (56 URLs, 0 sin fecha) |
| M2 Duplicados / breadcrumbs | **Hecho.** `Article` duplicado descartado; `BreadcrumbList` en guías y hub |
| M3 `Person` | **Hecho.** `image`, `description`, `knowsAbout`, `url` |
| `speakable` en FAQ de la home | **Hecho** |
| B2 `alt` del hero | **Falso positivo mío:** el `<img>` ya lleva `alt=""` |

Pendiente por decisión o por no tocar contenido: A4 (párrafo de definición visible), A6 (nombrar el caso de éxito; hay permiso, falta decidir cómo), M4 (logo del schema: ver nota), M6 (título/description de la home), B1 (redirección de `/precios`; se deja como está porque es temporal), B5 (limpieza de componentes antiguos).

Nota nueva: `public/og-image.png` (vista previa al compartir y logo del schema) conserva el mensaje anterior («Tu cuadrilla administrativa, ahora digital… hasta 30 horas al mes»). Es una imagen, no se ha tocado. El `logo.svg` es blanco y no sirve sobre fondo claro, y `apple-touch-icon.png` es un escudo azul y dorado distinto del teal de marca: hace falta saber cuál es el logo oficial para completar M4.

---

## Problemas críticos (arreglar ya)

### C1. `llms.txt` contradice el posicionamiento y los precios de la web
`https://www.konquerai.com/llms.txt` (fuente: `public/llms.txt`, sin tocar desde junio) dice:
- «KonquerAI es un **software** español de gestión administrativa…» y «Categoría: software de gestión y facturación». Es justo lo que decidisteis no ser el 12-oct.
- «Precio: **490 € + 97 €/mes**» y «tarifa Beta Fundadores», cuando la web no publica precios.
- Enlaza a `/#pricing` y `/#faq`, anclas que **ya no existen** (ahora `#preguntas`; no hay sección de precios).
- Describe «los tres pilares (Hacienda, rentabilidad por obra, gestión por voz)», del mensaje anterior.

Impacto: es el único documento que escribes *para* las IA. Cualquier sistema que lo lea describirá KonquerAI como software de pago cerrado, con un precio que quizá ya no aplica. Propuesta de texto en el Anexo A.

### C2. El `sameAs` de la Organization apunta a un ítem de Wikidata **borrado**
`src/layouts/Base.astro:122-125` enlaza `https://www.wikidata.org/wiki/Q140277090`. Verificado por API: el ítem **no existe**; el registro muestra borrado el **2026-06-22** por «no cumple la política de notabilidad». Un `sameAs` a una entidad inexistente es una señal de identidad rota en todas las páginas del sitio (incluidas las 52 guías).
- Fix: quitar la línea. No volver a crear el ítem hasta que haya fuentes independientes (no cumple notabilidad hoy).
- Crunchbase (`/organization/konquerai`) devuelve 403 a los bots; **no he podido verificar** que exista. Comprobadlo a mano antes de dejarlo en el schema.

### C3. Autoridad de entidad y colisión de nombre (sin cambios)
La búsqueda «KonquerAI» (comillas) no devuelve ningún resultado propio: solo Konqueror (navegador KDE), Konquest y similares. Wikidata: 0 resultados. Sin menciones de terceros. Existe una página de empresa en LinkedIn (`/company/konquerai/`, «El orden es dinero. Consultoría e IA para autónomos y empresas de reformas») que **no está enlazada** desde el schema ni desde la web. Plan en «Brand Authority».

---

## Prioridad alta (esta semana)

**A1. Blog sin autor humano.** `BlogPosting.author` apunta a la Organization (`src/pages/blog/[slug].astro:90`) y no hay byline visible. Tenéis un fundador con página propia, foto y LinkedIn: es la mejor señal de experiencia que tiene el sitio y ninguna de las 52 guías la usa. Fix: `author` → `{"@id": ".../#founder"}`, byline visible («Por Christian Marzal · revisado el …») enlazado a `/sobre-nosotros/`.

**A2. `dateModified` = `datePublished` en todas las guías** y sin fecha de revisión visible en el texto del artículo (solo la fecha de publicación en `<time>`). El contenido es fiscal y de plazos (Verifactu 1-ene-2027 sociedades / 1-jul-2027 autónomos; cuota 2026; guía 2027 publicada el 10-jul). Para IA y Google, «actualizado hace poco» en temas normativos pesa mucho. Fix: campo `updated` en el frontmatter, usado en el schema y mostrado («Actualizado el …»). La fecha del 10-jul de la guía principal debería revisarse tras el RDL 15/2025.

**A3. Desaparecieron de la home los pasajes más citables.** La home anterior tenía las FAQ de Verifactu / IVA (21-10-0 %, IRPF 15/7 %), que puntuaban 80-88/100 en citabilidad. La nueva home no menciona Verifactu fuera de una frase («listas para Verifactu») ni responde a las consultas del sector («cómo hacer presupuestos por voz», «qué programa uso para Verifactu»). El conocimiento sigue en el blog, pero la home no lo enlaza ni lo resume. Ver «decisión de posicionamiento» más abajo.

**A4. Falta un párrafo de definición de entidad visible y autocontenido.** El H1 («Un equipo administrativo trabajando para ti. Sin contratar a nadie.») es bueno para convertir y flojo para extraer. La definición factual (qué es, para quién, dónde, cómo) solo aparece en el pie y en `/sobre-nosotros`. Añadir 2-3 líneas visibles bajo el hero o en la primera FAQ.

**A5. H2 «Loquenospreguntanantesdeempezar».** `Preguntas.astro:32,45-47` parte el título en `<span>` por palabra para la animación y **no deja espacios entre ellos**. Visualmente funciona (CSS), pero el texto que leen crawlers, lectores de pantalla y extractores de IA es una sola palabra ininteligible. Fix: poner un espacio (o `&#32;`) entre spans, o un `aria-label` y `aria-hidden` en los spans.

**A6. Caso de éxito anónimo y cifras sin fuente.** «Una empresa de pintura con la que trabajamos…», «500 presupuestos al año», «5 de cada 100 → 10 de cada 100», «hasta 30 horas al mes». Las IA descartan afirmaciones numéricas sin entidad ni fuente. Opciones (decide Christian): nombrar al cliente con permiso, atribuir («datos de un cliente de la beta, 2026») o suavizar a «hasta» + condición. Sin testimonios con nombre, la señal de «Experience» sigue débil.

---

## Prioridad media (este mes)

- **M1. Sitemap con `lastmod` idéntico (2026-10-19T15:50Z) en las 55 URLs** (`astro.config.mjs`: `lastmod: new Date()`). Google aprende a ignorar un lastmod que cambia en todas las URLs a la vez. Usar la fecha real de cada guía y de las páginas.
- **M2. JSON-LD duplicado en guías:** algunas llevan `BlogPosting` (de la plantilla) **y** `Article` (frontmatter `schema: "Article"`), p. ej. `montar-cuadrilla-reformas`. Dejar solo uno. Además no hay `BreadcrumbList` (Inicio › Blog › Guía), ahora que ya hay subpáginas.
- **M3. `Person` fundador incompleto:** sin `image`, `knowsAbout`, `alumniOf`/formación ni `description`. Añadirlos refuerza E-E-A-T de forma directa (la bio ya existe en `/sobre-nosotros/`).
- **M4. `Organization.logo` apunta a `og-image.png` (1200×630).** Google pide logo cuadrado/rectangular legible; usar `logo.svg`/PNG de marca.
- **M5. `Organization.sameAs` incompleto:** añadir la página de empresa de LinkedIn, App Store y Google Play (existen y responden 200), y el YouTube/Google Business Profile cuando existan.
- **M6. Título de la home de 92 caracteres:** «KonquerAI · Tu oficina administrativa, montada | La construcción y los oficios de reformas» se trunca en resultados. Dejarlo en ~60 con el significado completo (p. ej. «KonquerAI · Tu oficina administrativa digital para autónomos de reformas»). El `description` (205 caracteres) también se corta; ~155.
- **M7. Las guías siguen una lógica «Verifactu/IVA» y la web ya no.** Revisar el pie de cada guía: el CTA lleva a `app.konquerai.com` y a las tiendas, y mezcla «App», «oficina digital» y «Hablemos». Unificar con el léxico (servicio = «tu oficina digital»; app = solo la móvil).
- **M8. Mensaje inconsistente entre superficies:** web («servicio», «oficina administrativa digital»), LinkedIn empresa («Consultoría e IA»), `llms.txt` («software») y ficha de las tiendas (no revisada). Las IA cruzan estas fuentes: una sola definición en todas.
- **M9. Sin FAQ de Verifactu en la home ni en un hub.** Con 15+ guías de Verifactu por oficio, falta una página-hub (`/blog/verifactu/` o `/verifactu-reformas/`) que actúe de índice temático y reciba los enlaces internos. Hoy el blog es plano (52 guías en un solo listado de 87 KB).

## Prioridad baja

- **B1.** `/precios` es una página de 318 bytes con meta-refresh (HTTP 200), no un 301/308. Redirigir desde `vercel.json`.
- **B2.** `<img>` del hero sin atributo `alt` (decorativa): poner `alt=""` explícito.
- **B3.** `/newsletter/` está noindex pero enlazada desde el pie con «Próximamente». Quitar el enlace o activarlo.
- **B4.** «Captura real de la app» (home, bloque LucIA): el léxico reserva «app» a la aplicación móvil. Si es la captura web, «de tu oficina digital».
- **B5. Deuda de código con el mensaje antiguo:** hay 17 componentes huérfanos (`Faq`, `Pricing`, `Oferta`, `Pilares`, `Cifras`, `Comparativa`, `Promesa`, `Garantia`…) con «97 €/mes», «app», etc., y `GEO-SEO-AUDIT.md`, `GEO-SEO-PLAN-ACCION.md`, `marketing_konquer/` describen el mensaje anterior. No afectan a los crawlers, pero basta un `import` para reintroducir el discurso antiguo. Archivar o borrar.

---

## Decisión de posicionamiento que condiciona el GEO (para Christian)

El nuevo mensaje dice «no somos un software». Es una decisión de marca válida, pero tiene una consecuencia medible: **las personas (y las IA) buscan «programa de facturación Verifactu para autónomos», no «oficina administrativa digital»**. Una búsqueda real de «programa presupuestos facturas Verifactu autónomos reformas» devolvió solo contenido de Billin y plantillas; KonquerAI no aparece.

Lo que recomiendo, sin tocar la voz de la home:
1. **Entidad = servicio.** Schema, `llms.txt`, LinkedIn, Wikidata y fichas deben decir lo mismo: servicio de implantación de oficina administrativa digital.
2. **Captación de búsquedas = blog.** Las 52 guías ya usan el vocabulario del oficio («programa», «Verifactu», «IVA 10 %») y es correcto que lo hagan: es donde se captan consultas. La home no tiene por qué competir en esas palabras.
3. **Puente entre ambos:** un hub de Verifactu + enlaces desde la home («Guías para llevar tu negocio de reformas al día») para que la autoridad de las guías suba hacia la entidad.

Precios ocultos: lo trato como decisión consciente, no como fallo. Coste GEO: la marca no puede aparecer en respuestas tipo «cuánto cuesta…». Alternativa por si queréis revisarlo más adelante: una frase con rango orientativo en la FAQ «¿Cuánto cuesta?».

---

## Análisis por categoría

### Citabilidad por IA (66/100)
- **Pasajes fuertes:** la FAQ «¿Esto es una app o un programa de gestión? No. Es un servicio: te montamos la oficina…» (definición clara de categoría); la tabla «Con el gestor / Con tu equipo» (comparación en `<table>`, muy extraíble); la tabla antes/ahora del caso de pintura; las guías con **TL;DR + tablas con fuente + bloque «Fuentes citadas»** (p. ej. la guía de Verifactu: 3 tablas, 11 enlaces externos a AEAT/BOE).
- **Pasajes débiles:** hero (metáfora, 0 datos), bloque «Orden / Control / Tiempo / Tranquilidad / Libertad» (eslóganes sin hecho), «Hoy, o transformas tu negocio o te quedas atrás» (sin evidencia).
- Las guías cortas (~700 palabras, p. ej. `montar-cuadrilla-reformas`) son más opinión que dato y sin tablas; las de Verifactu (~1.200 palabras) son el estándar a replicar.

### Autoridad de marca (12/100)
Presente: LinkedIn de empresa, fundador en LinkedIn, fichas de App Store y Google Play. Ausente: Wikipedia/Wikidata (ítem borrado), menciones de terceros, reseñas, YouTube, Reddit, directorios. Búsqueda de marca: 0 resultados propios. Hasta que haya fuentes independientes, **la palanca no es Wikidata sino prensa/directorios de sector, reseñas de clientes reales y LinkedIn activo**.

### Contenido E-E-A-T (60/100)
- **Experience:** historia real del fundador (padre pintor, ayudar de crío) → buena; caso anónimo y sin testimonios → floja.
- **Expertise:** 52 guías con normativa citada (RD 1007/2023, RDL 15/2025, art. 201 bis LGT) y fechas correctas en la guía principal; falta autor y revisión visible.
- **Authoritativeness:** fundador con página y LinkedIn, pero formación en «gestión de empresas» sin credencial concreta; sin menciones externas.
- **Trust:** HTTPS, HSTS, legales con responsable nombrado, RGPD, honestidad en el copy («si ya tienes un programa que te funciona, seguramente no nos necesitas»). Atención: `legalName` del schema es el nombre del fundador; confirmar que coincide con la entidad que factura (la skill de cobros menciona «KonquerAI LLC»).

### GEO técnico (84/100)
HTML estático completo (la home es 61 KB, el contenido completo está en el HTML servido). Robots.txt permite GPTBot, OAI-SearchBot, ChatGPT-User, ClaudeBot, Claude-Web, PerplexityBot, Google-Extended, Applebot-Extended, Amazonbot, CCBot + Content-Signal. HSTS, CSP, nosniff, X-Frame-Options, Referrer-Policy activos. IndexNow operativo (clave y `.well-known` en 200). Sitemap en www, 55 URLs. Restan: `llms.txt` desfasado, lastmod uniforme, `/precios` por meta-refresh, CWV sin medir. `llms.txt` no enlaza ninguna de las 52 guías ni `/sobre-nosotros/`.

### Schema y datos estructurados (70/100)
Hay: `Organization` + `Person` + `WebSite` + `Service` enlazados por `@id` en todas las páginas; `FAQPage` en home (6 preguntas, mismas que las visibles); `BlogPosting` en las guías; `Blog` en el índice; `inLanguage`. Falta/roto: `speakable` en el FAQPage de la home (existía en el `Faq.astro` antiguo, ya huérfano, y se perdió en el rediseño); `sameAs` con Wikidata borrado (C2), `author` = organización (A1), `dateModified` (A2), `BreadcrumbList`, `Person` sin `image`/`knowsAbout`, tipos duplicados en guías (M2), logo inadecuado (M4). No añadir `AggregateRating` hasta que haya reseñas reales.

### Optimización por plataforma (45/100)
- **Google AI Overviews:** mejor posicionado que en junio gracias al blog (52 guías con TL;DR y tablas). Falta frescura y autor.
- **ChatGPT / Bing Copilot:** metas de Bing y IndexNow listos; aún sin señales de marca externas que lo hagan recomendable.
- **Perplexity:** depende de fuentes de comunidad (Reddit, foros del sector); sin presencia.
- **Gemini:** ayudaría el perfil de Google Business y YouTube; sin ellos.
- No verifiqué si las guías están indexadas en Bing/Google (requiere Search Console / Bing WMT): el informe mensual debería incorporarlo.

---

## Quick wins (esta semana)

1. **Reescribir `public/llms.txt`** con el posicionamiento actual, sin precio, anclas correctas y enlaces a las guías clave (texto en el Anexo A). *Impacto alto, 15 minutos.*
2. **Quitar el Wikidata roto del `sameAs`** y añadir LinkedIn de empresa, App Store y Google Play. *10 minutos.*
3. **Arreglar el H2 «Loquenos…»** (espacios entre spans). *5 minutos.*
4. **Autor del blog = Person del fundador** en el schema, byline visible y `updated` en el frontmatter. *Medio día, afecta a 52 URLs.*
5. **`lastmod` real por URL en el sitemap** y título de la home recortado. *1 hora.*

## Plan a 30 días

### Semana 1: coherencia de entidad (código)
- [ ] Reescribir `llms.txt` (C1)
- [ ] Limpiar `sameAs` y completarlo (C2, M5)
- [ ] Arreglar H2 de FAQ (A5), `alt` del hero (B2)
- [ ] Título/description de la home (M6)
- [ ] Verificar a mano que existe la ficha de Crunchbase

### Semana 2: autoría y frescura del blog
- [ ] `author` → fundador, byline visible, `updated` en frontmatter y schema (A1, A2)
- [ ] Revisar fechas/plazos de las guías de Verifactu tras el RDL 15/2025 y actualizar `dateModified`
- [ ] `lastmod` real en el sitemap (M1); quitar `Article` duplicado (M2); `BreadcrumbList`
- [ ] Ampliar `Person` (M3) y logo (M4)

### Semana 3: puente entre el servicio y las búsquedas
- [ ] Párrafo visible de definición de entidad (A4)
- [ ] FAQ «¿Cumple Verifactu?» en la home (A3) y bloque «Guías» enlazando a las 4-5 mejores
- [ ] Hub temático de Verifactu y enlaces internos entre guías del mismo oficio (M9)
- [ ] Decidir caso de éxito: nombre con permiso o atribución clara (A6)

### Semana 4: autoridad externa
- [ ] Alinear la descripción de LinkedIn de empresa, App Store y Google Play con la definición única (M8)
- [ ] 2-3 testimonios reales con nombre, oficio y localidad
- [ ] Alta en directorios del sector y 1 mención externa (prensa local / asociación de reformistas)
- [ ] Búsqueda de marca y pruebas manuales en ChatGPT, Perplexity y Gemini (anotar si aparece y cómo se describe)

---

## Qué no he podido comprobar

- **Core Web Vitals:** PageSpeed API sin cuota (429). Pendiente de medir.
- **Crunchbase:** bloquea bots (403).
- **Indexación real** en Google/Bing y consultas con impresiones: requiere Search Console / Bing WMT.
- **Respuestas reales de ChatGPT, Perplexity, Gemini** sobre la marca: no las he ejecutado; hay que anotarlas manualmente cada mes.
- Fichas de App Store y Google Play: confirmadas con HTTP 200, no se ha revisado su texto.

---

## Anexo A: propuesta de `public/llms.txt` (pendiente de tu visto bueno)

```
# KonquerAI

> KonquerAI es un servicio español que monta y acompaña la oficina administrativa digital de autónomos y pequeñas empresas de la construcción y los oficios de reformas (desde quien trabaja solo hasta equipos de unas 8 personas). Un equipo de asistentes digitales hace los presupuestos, ordena facturas y albaranes, controla cobros y pagos y mantiene los números del negocio al día; durante el primer mes, una persona acompaña la puesta en marcha. Complementa a la gestoría, no la sustituye. No es una app ni un programa de gestión: es un servicio.

## Datos clave
- Categoría: servicio de implantación de oficina administrativa digital para la construcción y los oficios de reformas (España).
- Público: autónomos y pequeñas empresas de reformas, pintura, electricidad, fontanería, albañilería, climatización y carpintería.
- Qué hace el equipo: presupuestos por voz desde la obra, facturas de proveedor contabilizadas y cuadradas con albaranes, facturas emitidas listas para Verifactu, control de cobros, pagos y previsión de caja.
- Precio: se explica en una llamada de 15 minutos; no hay tarifas publicadas.
- Datos: servidores europeos, cumplimiento RGPD.
- Contacto: WhatsApp, info@konquerai.com y LinkedIn. Fundador: Christian Marzal Della-Rovere.

## Páginas principales
- [Inicio](https://www.konquerai.com/): qué es el servicio, el equipo, un caso real y preguntas frecuentes.
- [Sobre nosotros](https://www.konquerai.com/sobre-nosotros/): quién está detrás y por qué.
- [Guías para autónomos de reformas](https://www.konquerai.com/blog/): Verifactu, IVA, facturas, presupuestos y cobros, oficio por oficio.

## Guías clave
- [Verifactu para autónomos de reformas: guía 2027](https://www.konquerai.com/blog/verifactu-autonomos-reformas-guia-2027/)
- [IVA del 10 % o del 21 % en una reforma](https://www.konquerai.com/blog/iva-10-21-reformas/)
- [Guía de facturación para autónomos de reformas 2026](https://www.konquerai.com/blog/guia-facturacion-reformas-2026/)
- [Cómo cobrar tus reformas a tiempo](https://www.konquerai.com/blog/cobrar-reformas-a-tiempo/)

## Opcional
- [Privacidad y términos](https://www.konquerai.com/legal/privacidad)
```

> Los cuatro slugs de «Guías clave» están verificados contra el sitemap en producción. Antes de publicarlo, confirmar que la frase «No es una app ni un programa de gestión» es la que queréis que repitan las IA.

## Anexo B: páginas analizadas

| URL | Título | Incidencias GEO |
|---|---|---|
| `/` | KonquerAI · Tu oficina administrativa, montada \| La construcción… | 6 (A3, A4, A5, A6, M6, B2) |
| `/sobre-nosotros/` | Sobre nosotros · KonquerAI | 2 (M3, M8) |
| `/blog/` | Blog · KonquerAI — Guías para autónomos de reformas | 2 (M9, índice plano de 52 guías) |
| `/blog/verifactu-autonomos-reformas-guia-2027/` | Verifactu para autónomos de reformas: la guía 2027… | 3 (A1, A2, M2) |
| `/blog/montar-cuadrilla-reformas/` | De trabajar para otros a montar tu propia cuadrilla… | 4 (A1, A2, M2, contenido corto sin tabla) |
| `/newsletter/` | Boletín · KonquerAI | 1 (B3, noindex) |
| `/robots.txt`, `/llms.txt`, `/sitemap-index.xml`, `/sitemap-0.xml` | | llms.txt: C1; sitemap: M1 |
| Resto de las 50 guías | | Heredan A1, A2 (plantilla); no revisadas una a una |
