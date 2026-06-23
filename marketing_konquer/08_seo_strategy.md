# 08 — Estrategia SEO y posicionamiento orgánico

> Plan completo para posicionar konquerai.com en Google. Keyword research por intención, arquitectura de contenidos, briefs de los 10 primeros artículos, meta tags base, schema markup, estrategia local. Listo para que un copywriter o un freelance SEO ejecute.

---

## 1. Filosofía SEO de KonquerAI

Tres principios no negociables.

### 1. SEO de gremio, no SEO genérico

No competimos por "software facturación autónomos" (saturado, dominado por Holded, Quipu, etc.). Competimos por:

- "software para pintores"
- "presupuesto reformas en el móvil"
- "como calcular rentabilidad obra reforma"
- "facturación electricistas autonomos"

Long-tail con oficio. Volumen menor, intención mucho más clara, competencia mucho más baja.

### 2. SEO informativo + transaccional + local

Tres capas:
- **Informativo** (blog): respondemos las dudas reales del autónomo ("¿qué es Verifactu?", "¿cómo calcular el margen de una obra?").
- **Transaccional** (pricing, comparativas): cuando ya busca solución, lo encontramos.
- **Local** (landings por ciudad/oficio): "software facturación pintores Valencia".

### 3. Cero "SEO basura"

No publicamos contenido reciclado, ni respuestas vacías, ni keyword stuffing. Cada artículo:
- Resuelve UNA duda real del autónomo.
- Tiene mínimo 1.500 palabras.
- Está escrito en `02_brand_voice.md` (no en jerga SEO).
- Lleva ejemplo concreto, no abstracción.
- Cierra con CTA suave a KonquerAI.

---

## 2. Keyword research por intención

### Intención INFORMATIVA (top funnel — atrae sin vender)

El autónomo busca aprender o resolver una duda. Aquí captamos atención.

| Keyword principal | Volumen est. (ES/mes) | Dificultad | Prioridad |
|-------------------|----------------------|------------|-----------|
| qué es verifactu | 2.400 | media | 🔴 alta |
| cómo facturar reformas vivienda iva 10 | 800 | baja | 🔴 alta |
| modelo 303 autónomos | 8.100 | media | 🟡 media |
| cómo calcular margen de una obra | 320 | baja | 🔴 alta |
| obligaciones fiscales autónomo construcción | 480 | baja | 🟡 media |
| inversión sujeto pasivo construcción | 1.300 | media | 🟡 media |
| irpf 7 nuevos autónomos | 1.900 | baja | 🟡 media |
| albarán vs factura diferencia | 720 | baja | 🟢 baja |
| cómo hacer un presupuesto de obra | 2.900 | media | 🔴 alta |
| facturación electrónica autónomos 2026 | 1.100 | media | 🔴 alta |
| qué retención poner en factura pintor | 90 | muy baja | 🟢 baja |
| cuánto cobra un pintor por metro | 5.400 | alta | 🟡 media (más bien para captar lead) |

### Intención COMERCIAL (medio funnel — comparativas, alternativas)

El autónomo está evaluando. Aquí nos colocamos como opción.

| Keyword principal | Volumen est. (ES/mes) | Dificultad | Prioridad |
|-------------------|----------------------|------------|-----------|
| software de facturación para autónomos | 4.400 | alta | 🟡 media |
| programa facturación reformas | 320 | baja | 🔴 alta |
| app facturación obras | 210 | baja | 🔴 alta |
| holded vs quipu | 720 | alta | 🟡 media |
| alternativas a holded | 590 | media | 🟡 media |
| mejor app para pintores | 90 | muy baja | 🔴 alta |
| programa para presupuestos de reforma | 480 | baja | 🔴 alta |
| software gestión obras construcción | 590 | media | 🟡 media |
| cómo controlar rentabilidad obras | 110 | muy baja | 🔴 alta |
| programa para electricistas autónomos | 170 | baja | 🔴 alta |
| programa para fontaneros | 260 | baja | 🔴 alta |
| programa para albañiles | 140 | muy baja | 🔴 alta |

### Intención TRANSACCIONAL (bottom funnel — listo para pagar)

El autónomo busca explícitamente comprar. Aquí cerramos.

| Keyword principal | Volumen est. (ES/mes) | Dificultad | Prioridad |
|-------------------|----------------------|------------|-----------|
| konquerai | (creciente) | propia | 🔴 alta (proteger marca) |
| konquerai precio | (creciente) | propia | 🔴 alta |
| software gestión reformas precio | 70 | baja | 🟡 media |
| app facturación reformas precio | 40 | muy baja | 🔴 alta |

### Intención LOCAL (cola larga geográfica)

Una landing por ciudad x oficio. Lento de construir, pero converte muy bien.

Plantilla: **"[oficio] [ciudad] software facturación"** y **"programa para [oficio] [ciudad]"**.

Top 10 ciudades target (por densidad de autónomos del sector):
1. Madrid
2. Barcelona
3. Valencia
4. Sevilla
5. Bilbao
6. Málaga
7. Zaragoza
8. Granada
9. Alicante
10. Murcia

Combinado con 4 oficios principales (pintor, electricista, fontanero, albañil) = **40 landings locales** para construir gradualmente.

Ejemplo de URL: `/programa-facturacion-pintores-valencia/`

---

## 3. Arquitectura de contenidos (pillar pages + clusters)

Estructura recomendada: **3 pillar pages** que organizan **30+ artículos** en clusters temáticos.

```
konquerai.com/
├── /                                  → homepage
├── /producto/                         → cómo funciona
├── /precios/                          → pricing
├── /sobre-nosotros/                   → manifiesto
├── /para/                             → hub de landings por oficio
│   ├── /pintores/
│   ├── /electricistas/
│   ├── /fontaneros/
│   ├── /albañiles/
│   ├── /climatizacion/
│   └── /reformas-integrales/
├── /donde/                            → hub geográfico
│   ├── /madrid/
│   ├── /barcelona/
│   └── ...
├── /blog/                             → blog principal
│   ├── /fiscalidad/                   → CLUSTER 1
│   ├── /rentabilidad-y-control/       → CLUSTER 2
│   └── /gestion-administrativa/       → CLUSTER 3
└── /recursos/                         → guías, plantillas, calculadoras
    ├── /calculadora-margen-obra/
    ├── /plantilla-presupuesto-pintura/
    └── ...
```

### Pillar 1 — Fiscalidad para autónomos de reformas

**Pillar URL:** `/blog/fiscalidad/guia-fiscal-autonomo-reformas-espana/`

**Cluster (artículos hijos):**
- Qué es Verifactu y qué tienes que hacer (2026)
- IVA en reformas: 21% vs 10% (cuándo aplicar cada uno)
- Inversión del sujeto pasivo en construcción explicada en cristiano
- Modelo 303 paso a paso para autónomos de construcción
- IRPF 7% para nuevos autónomos: requisitos
- Modelo 130 vs 131: cuál te toca
- Cómo se factura una subcontrata sin equivocarse
- Qué retención poner según tu actividad (con tabla)
- Sanciones más típicas que pone Hacienda al autónomo de obra
- ZIP fiscal trimestral: qué entregar a tu gestoría

### Pillar 2 — Rentabilidad y control de obras

**Pillar URL:** `/blog/rentabilidad-y-control/como-controlar-rentabilidad-obras-reforma/`

**Cluster:**
- Cómo calcular el margen real de una obra (con ejemplo)
- Costes directos vs indirectos en construcción
- Cuánto cobrar por hora en pintura/electricidad/fontanería (rangos por zona)
- Por qué nunca debes aceptar una obra sin calcular margen antes
- Albarán vs factura: la diferencia que te puede salvar miles de euros
- Cómo detectar facturas duplicadas de proveedores antes de pagarlas
- Plantilla Excel: margen por obra (versión gratis que lleva al producto)
- Las 5 obras que más matan márgenes en reformas integrales
- Cómo organizar los gastos por obra sin volverte loco
- KPIs básicos que todo autónomo de obra debería mirar cada semana

### Pillar 3 — Gestión administrativa sin morir en el intento

**Pillar URL:** `/blog/gestion-administrativa/gestion-administrativa-autonomo-reformas/`

**Cluster:**
- Cómo hacer un presupuesto de obra profesional (con plantilla)
- Cómo persuadir clientes para que paguen a tiempo
- Recordatorios de cobro: cómo hacerlos sin perder cliente
- Cómo organizar la furgoneta para que no se pierdan facturas
- Apps móviles que de verdad sirven a un autónomo de obra
- Cómo digitalizar tu negocio sin saber de tecnología
- Por qué Excel ya no te vale (y qué hacer en su lugar)
- Cómo trabajar con tu gestoría para que te llame menos
- Plantilla de email para reclamar cobros (con tono profesional)
- 10 cosas que dejas de hacer cuando tienes la administración automatizada

---

## 4. Briefs de los 10 primeros artículos (prioridad alta)

Estos son los primeros 10 artículos que hay que publicar, en orden recomendado. Cada brief incluye: keyword target, intención, ángulo, estructura, longitud, CTA, link interno.

### Artículo #1

**Título SEO:** Qué es Verifactu y qué tienes que hacer en 2026 si eres autónomo

**URL:** `/blog/fiscalidad/que-es-verifactu/`

**Keyword principal:** "qué es verifactu"
**Secundarias:** verifactu autónomos, verifactu 2026, facturación electrónica obligatoria

**Intención:** informativa

**Ángulo:** explicación cristalina, sin tecnicismos legales. Tono: "amigo del gremio que estudió la normativa por ti".

**Estructura:**
1. Hook: "Si emites facturas, esto te afecta. Punto."
2. Qué es Verifactu en 3 frases.
3. ¿A quién afecta? ¿Desde cuándo?
4. Qué pasa si no lo cumples (sanciones).
5. ¿Qué tienes que hacer hoy?
6. Cómo te lo facilita un software como KonquerAI (CTA natural).
7. FAQ con las 5 preguntas más comunes.

**Longitud:** 1.800-2.200 palabras.

**CTA:** "Verifactu llega. Te lo dejamos preparado sin que tengas que entender la normativa. [Conoce KonquerAI]"

**Links internos:** /producto/, /precios/, próximo artículo del cluster.

---

### Artículo #2

**Título SEO:** Cómo calcular el margen real de una obra (sin Excel y con ejemplo)

**URL:** `/blog/rentabilidad-y-control/calcular-margen-obra/`

**Keyword principal:** "cómo calcular el margen de una obra"
**Secundarias:** margen obra reforma, rentabilidad obra construcción, calcular beneficio reforma

**Intención:** informativa + (segundo plano) comercial

**Ángulo:** explicación práctica con ejemplo numérico real. Un pintor que hace una obra de 4.500€ y descubre al final que solo ganó 380€.

**Estructura:**
1. Hook: pregunta directa al lector — "¿Cuánto ganaste exactamente en la última obra grande?"
2. La fórmula básica: ingresos − costes directos − costes indirectos.
3. Costes directos: materiales, mano de obra, desplazamientos.
4. Costes indirectos: seguros, cuota autónomo, herramientas amortizadas.
5. Ejemplo paso a paso de una obra real (pintura piso 90m²).
6. Por qué Excel no te sirve a largo plazo.
7. Cómo lo hace KonquerAI automáticamente.

**Longitud:** 1.500-1.800 palabras.

**CTA:** "Hacer este cálculo manual obra a obra es inviable. KonquerAI lo hace por ti. [Ver cómo funciona]"

**Links internos:** /producto/, plantilla descargable, artículo de Verifactu.

---

### Artículo #3

**Título SEO:** IVA en reformas: cuándo aplicar 21% y cuándo 10% (con tabla)

**URL:** `/blog/fiscalidad/iva-reformas-21-o-10/`

**Keyword principal:** "iva reformas vivienda 10"
**Secundarias:** iva reducido reformas, iva 10 obra particular, cuándo iva 21 reformas

**Intención:** informativa

**Ángulo:** tabla clara con casos concretos. Cero ambigüedad.

**Estructura:**
1. La regla general: 21%.
2. Excepción 10%: requisitos (vivienda particular, antigüedad, % material vs mano de obra).
3. Excepción 0%: inversión del sujeto pasivo en subcontratación.
4. Tabla con 10 casos típicos y qué IVA aplicar.
5. Qué pasa si te equivocas (rectificativa, sanciones).
6. Cómo lo automatiza KonquerAI.

**Longitud:** 1.500 palabras.

**CTA:** "KonquerAI aplica el IVA correcto automáticamente. Sin pensar."

---

### Artículo #4

**Título SEO:** Programa de facturación para pintores autónomos: comparativa 2026

**URL:** `/blog/programa-facturacion-pintores/`

**Keyword principal:** "programa facturación pintores"
**Secundarias:** software para pintores, app facturación pintor, programa para pintores autónomos

**Intención:** comercial

**Ángulo:** comparativa honesta entre 4-5 opciones (Holded, Quipu, Anfix, Billin, KonquerAI). Tabla con pros y contras. Recomendación según perfil.

**Estructura:**
1. ¿Qué necesita realmente un pintor autónomo de un programa de facturación?
2. Comparativa: Holded vs Quipu vs Anfix vs Billin vs KonquerAI.
3. Tabla resumen con precio, facilidad, especialización, móvil, soporte.
4. Recomendación según volumen y nivel técnico.
5. KonquerAI en detalle: por qué para pintores específicamente.

**Longitud:** 2.000-2.500 palabras.

**CTA:** "¿Eres pintor? Aquí tienes lo que hace KonquerAI por ti. [Ver demo]"

---

### Artículo #5

**Título SEO:** Cómo hacer un presupuesto de obra profesional (con plantilla gratis)

**URL:** `/blog/gestion-administrativa/como-hacer-presupuesto-obra/`

**Keyword principal:** "cómo hacer un presupuesto de obra"
**Secundarias:** plantilla presupuesto reforma, presupuesto profesional reforma, ejemplo presupuesto obra

**Intención:** informativa + lead magnet (plantilla)

**Ángulo:** guía paso a paso + plantilla descargable. Lead magnet potente.

**Estructura:**
1. Por qué un buen presupuesto cierra el doble de obras.
2. Datos obligatorios en un presupuesto profesional.
3. Cómo desglosar partidas (mano de obra vs materiales).
4. IVA y retención: cómo presentarlo.
5. Condiciones, plazos, garantía.
6. Plantilla descargable (PDF + Word).
7. Cómo lo hace KonquerAI: presupuesto en 5 minutos desde el móvil.

**Longitud:** 1.800 palabras.

**CTA:** "Descarga la plantilla gratis" (lead magnet con email) + "Si quieres hacerlo todo automáticamente, mira KonquerAI."

---

### Artículo #6

**Título SEO:** Albarán y factura: la diferencia que puede salvarte miles de euros

**URL:** `/blog/rentabilidad-y-control/albaran-vs-factura/`

**Keyword principal:** "albarán vs factura diferencia"
**Secundarias:** qué es un albarán, qué diferencia hay entre albarán y factura, conciliación albarán factura

**Intención:** informativa

**Ángulo:** explicación + caso real de cliente que pagó dos veces por no controlar albaranes.

**Estructura:**
1. Qué es un albarán y qué es una factura.
2. Por qué te pueden cobrar dos veces si no los controlas.
3. Caso real: pintor que pagó 850€ duplicados a Saltoki en 3 meses.
4. Cómo organizar tus albaranes (método antiguo: papel; método nuevo: app).
5. Conciliación automática con KonquerAI.

**Longitud:** 1.200-1.500 palabras.

**CTA:** "KonquerAI empareja tus albaranes con las facturas. Te avisa antes de que pagues dos veces. [Ver demo]"

---

### Artículo #7

**Título SEO:** Modelo 303 para autónomos de construcción: guía paso a paso

**URL:** `/blog/fiscalidad/modelo-303-autonomos-construccion/`

**Keyword principal:** "modelo 303 autónomos construcción"
**Secundarias:** modelo 303 paso a paso, presentar modelo 303 autónomo, modelo 303 construcción

**Intención:** informativa

**Estructura:**
1. Qué es el modelo 303 y cuándo se presenta.
2. Casillas más importantes para autónomos de construcción.
3. IVA repercutido vs IVA soportado: ejemplos.
4. Inversión sujeto pasivo en el 303 (casilla 12).
5. Plazos y sanciones por presentar tarde.
6. Cómo te ayuda KonquerAI (export trimestral).

**Longitud:** 2.000 palabras.

---

### Artículo #8

**Título SEO:** Cómo controlar la rentabilidad de tus obras: guía completa

**URL:** `/blog/rentabilidad-y-control/`

**Pillar page del cluster 2.**

**Keyword principal:** "cómo controlar rentabilidad obras"

**Estructura:** guía macro con índice a todos los artículos del cluster.

**Longitud:** 3.000+ palabras.

---

### Artículo #9

**Título SEO:** Las 10 obligaciones fiscales del autónomo de construcción que no puedes ignorar

**URL:** `/blog/fiscalidad/obligaciones-fiscales-autonomo-construccion/`

**Keyword principal:** "obligaciones fiscales autónomo construcción"

**Estructura:** listado claro con plazos, modelos, consecuencias de incumplir.

**Longitud:** 1.800-2.200 palabras.

---

### Artículo #10

**Título SEO:** Por qué hacer presupuestos los domingos te está matando el negocio

**URL:** `/blog/gestion-administrativa/presupuestos-los-domingos/`

**Keyword principal:** long-tail emocional ("hacer presupuestos los domingos")

**Intención:** informativa + emocional + ventas

**Ángulo:** artículo opinión, casi manifiesto corto, con CTA directo. **Este es el artículo "puente" entre SEO y conversión emocional.** Conecta con la narrativa del padre.

**Estructura:**
1. Hook: escena del domingo a las 22:30 con facturas.
2. Por qué llegaste a este punto (no es culpa tuya).
3. El coste real: salud, familia, motivación.
4. La otra forma: presupuestos en 5 minutos desde la obra.
5. KonquerAI: cuadrilla digital.

**Longitud:** 1.200 palabras. Más corto, más emocional.

**CTA:** "Recupera el domingo. [Empieza con KonquerAI]"

---

## 5. Meta tags base (homepage y plantillas)

### Homepage

```html
<title>KonquerAI · Software de gestión para autónomos de reformas con IA</title>
<meta name="description" content="Recupera hasta 30 horas al mes y sabe qué obra te dio dinero. Presupuestos, facturas, IVA y Verifactu sin aprender tecnología. Para pintores, albañiles, electricistas y fontaneros. Garantía 30 días.">

<meta property="og:title" content="KonquerAI · Tu cuadrilla administrativa, ahora digital">
<meta property="og:description" content="Recupera 30 horas al mes. Controla cada obra al céntimo. Sin Excel, sin gestoría sufriendo. Hecho para autónomos de reformas.">
<meta property="og:image" content="https://konquerai.com/og-image.png">
<meta property="og:url" content="https://konquerai.com">
<meta property="og:type" content="website">

<meta name="twitter:card" content="summary_large_image">
```

### Plantilla para artículos de blog

```html
<title>{Título del artículo} | KonquerAI Blog</title>
<meta name="description" content="{primera frase del artículo, 150-160 chars, con keyword principal}">

<meta property="og:title" content="{Título del artículo}">
<meta property="og:description" content="{descripción del artículo}">
<meta property="og:image" content="{imagen destacada}">
<meta property="og:url" content="{URL canónica}">
<meta property="og:type" content="article">
<meta property="article:published_time" content="{fecha ISO}">
<meta property="article:author" content="KonquerAI">
```

### Plantilla para landings de producto/oficio

```html
<title>Programa de facturación para {oficio} autónomos · KonquerAI</title>
<meta name="description" content="Software pensado para {oficio}: presupuestos desde el móvil, facturación con IVA correcto, control de rentabilidad por obra. Configurado a mano. {pricing}.">
```

---

## 6. Schema markup recomendado

### Para homepage

```json
{
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "KonquerAI",
  "applicationCategory": "BusinessApplication",
  "operatingSystem": "Web, iOS, Android",
  "description": "Software de gestión administrativa para autónomos de reformas. Combina IA y acompañamiento humano para reducir hasta 30 horas mensuales de papeleo.",
  "offers": {
    "@type": "Offer",
    "price": "97",
    "priceCurrency": "EUR",
    "priceValidUntil": "2026-12-31",
    "availability": "https://schema.org/InStock"
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "—",
    "reviewCount": "—"
  }
}
```

(Solo incluir `aggregateRating` cuando se tengan reviews reales.)

### Para artículos de blog

```json
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "{Título}",
  "datePublished": "{fecha ISO}",
  "author": {
    "@type": "Organization",
    "name": "KonquerAI"
  },
  "publisher": {
    "@type": "Organization",
    "name": "KonquerAI",
    "logo": "https://konquerai.com/logo.png"
  }
}
```

### Para FAQ en homepage

```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "¿Necesito saber de informática?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "No. Te guiamos paso a paso: una guía y unos asistentes que te acompañan en pantalla mientras configuras la app. En unos 15 minutos estás funcionando..."
      }
    }
    /* ... */
  ]
}
```

### Para landings locales

```json
{
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "KonquerAI Software para {oficio} en {ciudad}",
  "areaServed": {
    "@type": "City",
    "name": "{ciudad}"
  }
}
```

---

## 7. Estrategia SEO local

### Landings por ciudad x oficio

40 landings (10 ciudades x 4 oficios). Empezar por 5 más relevantes:

1. `/programa-facturacion-pintores-madrid/`
2. `/programa-facturacion-electricistas-barcelona/`
3. `/programa-facturacion-fontaneros-valencia/`
4. `/programa-facturacion-pintores-sevilla/`
5. `/programa-facturacion-albañiles-bilbao/`

### Plantilla para landings locales

```
H1: Software de facturación para {oficio} en {ciudad}

Subhead: Recupera hasta 30 horas al mes. Sin Excel, sin gestoría sufriendo. Para los {oficio} de {ciudad} que ya están hartos del papeleo.

[Contenido idéntico a homepage adaptado]

Sección extra: "Por qué los {oficio} de {ciudad} eligen KonquerAI"

Sección extra: "Trabajamos con {oficio} de [zonas/barrios de la ciudad]"
```

### Google Business Profile

- Crear ficha "KonquerAI" como empresa.
- Categoría: "Empresa de software".
- Foto de equipo (cuando haya).
- Reviews honestas de clientes (cuando los haya).
- Posts mensuales actualizando noticias.

---

## 8. Estrategia de link building

**Prioridad de adquisición:**

1. **Asociaciones del sector reformas/construcción** (FENIE, Confemetal, ATPYC...): guest posts o menciones.
2. **Blogs de gestorías especializadas en autónomos**: artículos técnicos cruzados.
3. **Medios de oficio**: revistas digitales de pintura, fontanería, electricidad.
4. **Newsletters del sector**: patrocinios.
5. **Marketplaces de software para autónomos** (capterra, getapp, software advice): perfiles completos.
6. **YouTube de oficios**: colaboraciones con creadores que hagan contenido para autónomos.

**Lo que NO hacemos:**
- ❌ Comprar enlaces.
- ❌ PBN (private blog networks).
- ❌ Guest posts en blogs sin relación con el sector.
- ❌ Intercambios masivos.

---

## 9. Estrategia de contenido en redes (eco SEO)

Cada artículo de blog se desdobla en:

- **1 post LinkedIn** (perfil del fundador o empresa).
- **1 carousel Instagram** (con visuales).
- **1 vídeo corto TikTok/Reels** (con la conclusión).
- **1 hilo de Twitter/X** (cuando aplique).
- **1 mención en newsletter mensual**.

Esto multiplica el alcance y genera enlaces secundarios.

---

## 10. KPIs SEO a trackear

Mensuales:

- **Tráfico orgánico**: usuarios desde Google.
- **Top 10 keywords**: cuántas en TOP 10, cuántas en TOP 3.
- **Conversión orgánica → lead**: visitantes que rellenan formulario o piden demo.
- **CTR medio en SERP**.
- **Tiempo medio en página** por artículo.
- **Backlinks nuevos / mes**.

Trimestrales:

- **Dominio (DR/DA)** según Ahrefs/Moz.
- **Páginas indexadas vs publicadas**.
- **Auditoría técnica** (Core Web Vitals, errores 404, redirecciones).

---

## 11. Reglas técnicas mínimas

- **Velocidad**: <2.5s LCP en móvil. Las imágenes en WebP.
- **HTTPS** obligatorio.
- **Sitemap.xml** generado automáticamente.
- **Robots.txt** permitiendo crawling, bloqueando admin.
- **Canonicals** en todas las páginas (especialmente blog).
- **Hreflang** si en el futuro hay versión catalán/inglés.
- **Estructura de URLs limpia** (sin parámetros raros, sin underscores).
- **Internal linking obligatorio**: cada artículo enlaza a mínimo 3 otros del blog + 1 página de producto.
- **Imágenes con `alt` descriptivo**, no genérico.
- **H1 único por página**, jerarquía de H2-H3 correcta.

---

## 12. Calendario editorial sugerido (primer trimestre)

**Mes 1 — Setup**
- Publicar artículos #1, #2, #3.
- Setup técnico (sitemap, schema, analytics).
- Crear Google Search Console + Google Business Profile.

**Mes 2 — Volumen**
- Publicar artículos #4, #5, #6, #7.
- 2 landings locales (Madrid pintores, Barcelona electricistas).
- Empezar link building con asociaciones.

**Mes 3 — Consolidación**
- Publicar artículos #8 (pillar), #9, #10.
- 3 landings locales más.
- Primera medición seria de resultados.

A partir del mes 4: cadencia de 2-3 artículos/mes + 1-2 landings/mes.

---

## 13. Tabla de prioridades (qué hacer YA)

| Acción | Impacto | Esfuerzo | Cuándo |
|--------|---------|----------|--------|
| Publicar artículo Verifactu | 🔴 alto | medio | mes 1 |
| Publicar artículo margen obra | 🔴 alto | medio | mes 1 |
| Publicar comparativa pintores | 🔴 alto | medio | mes 2 |
| Schema FAQ en homepage | 🟡 medio | bajo | semana 1 |
| Google Business Profile | 🟡 medio | bajo | semana 1 |
| Sitemap.xml automático | 🟡 medio | bajo | semana 1 |
| 5 primeras landings locales | 🟡 medio | alto | mes 2-3 |
| Backlinks asociaciones sector | 🟡 medio | alto | mes 2-6 |
| Optimización Core Web Vitals | 🟢 bajo | medio | mes 2 |
| Calendario newsletter mensual | 🟡 medio | medio | mes 1 |

---

> **Archivos relacionados**: `02_brand_voice.md` (cómo se escribe cada artículo), `04_value_proposition.md` (mensajes que cada CTA refuerza), `06_homepage_copy.md` (FAQ y meta tags vivos en la home).
