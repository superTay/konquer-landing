# Plan de implementación — Chatbot consultor Konker AI

> Estado: **propuesta, pendiente de aprobación**. Una vez aprobado → se implementa en
> `/Users/christianmarzaldellarovere/Desktop/FULL STACK/ConquerAI/konquer_landing`.

> **ACTUALIZACIÓN (2026-06-06) — LLM vía OpenRouter.** Donde este plan diga "Anthropic Claude
> Haiku" o "ANTHROPIC_API_KEY", la decisión final es **OpenRouter** (1 key `OPENROUTER_API_KEY`,
> modelo por string; arranque con `anthropic/claude-3.5-haiku`). El resto del stack no cambia.

---

## 0. Visión en una frase

Una burbuja de chat en la landing de Konker que actúa como **consultor de verdad**:
hace 9 preguntas en conversación natural (texto o voz), y al terminar genera **un informe
de consultoría en pantalla** con el ahorro de tiempo/dinero del autónomo, una calculadora
con sus números, proyección a 3 años y un antes/después — cerrando con **agendar una llamada**.
Todo con la voz de marca de Konker y **sin inventar cifras**.

Doble objetivo: (1) captar y cualificar leads para Konker; (2) servir de **plantilla**
para vender este mismo chatbot a terapeutas, estética, farmacias, etc.

---

## 1. La persona del chatbot (el "cerebro")

**Nombre tentativo**: "Capataz" / "tu consultor de Konker" (a decidir — algo de obra, cercano).

**Rol dual**:
- **Consultor** (80% de la conversación): escucha, entiende el negocio del autónomo, no juzga,
  habla su idioma. Hace UNA pregunta cada vez. Nunca suelta el discurso comercial de golpe.
- **Vendedor** (cierre): tras el informe, conecta los dolores detectados con lo que Konker
  resuelve y empuja —sin presionar— a agendar la llamada.

**Voz** (heredada de `marketing_konquer/02_brand_voice.md`):
- Directa, frases cortas. Empática con rabia contenida ("tú levantas obras, no PDFs").
- Honesta (nunca infla cifras). Profesional pero de obra. Esperanzadora (termina en "se puede").
- Español de obra: "por cobrar", no "cuentas por cobrar". Sin emojis. Sin tecnicismos.
- Test antes de cada mensaje: *¿lo entendería un pintor de 55 en 5 segundos?*

**Reglas duras** (van en el system prompt):
- NO nombrar marcas de software. Genérico: "el programa de facturar", "la hoja de cálculo",
  "el programa de la gestoría". Únicas marcas permitidas: WhatsApp, Instagram, Facebook (y Konker).
- NO inventar datos. Toda cifra del informe sale de la **fórmula transparente** (§4) con rangos
  del sector. Si falta un dato, usa el rango medio y lo dice ("de media, en tu oficio...").
- NO prometer ROI exacto. Hablar de "hasta", "de media", "según tus números".
- Una sola pregunta por turno. Si la respuesta es vaga, repregunta una vez, luego sigue.

---

## 2. El guion de las 9 preguntas (sectorizado a reformas)

Orden y propósito (el LLM las conduce, no las suelta como formulario):

| # | Pregunta (en lenguaje de obra) | Para qué la usamos |
|---|---|---|
| 1 | ¿Cómo te llamas? | Personalizar todo el resto |
| 2 | ¿Qué eres — pintor, albañil, fontanero, electricista...? ¿O llevas reformas completas? | Oficio → plantillas y ejemplos concretos |
| 3 | ¿Trabajas solo o tienes gente contigo? ¿Cuántos? | Tamaño (0–7) → escala del dolor admin |
| 4 | ¿Con qué te apañas ahora para presupuestos y facturas? (la hoja de cálculo, papel, un programa...) | Detectar stack actual → ángulo de ataque |
| 5 | ¿Por dónde te entran los clientes? (boca-oreja, WhatsApp, redes...) | Contexto comercial |
| 6 | De toda la semana, ¿en qué se te va el tiempo que no es estar en obra? | **Cuantificar horas admin** → input calculadora |
| 7 | ¿Cuántas horas a la semana dirías que te comen los papeles? Y si tuvieras que ponerte precio por hora, ¿cuánto? | **Inputs duros** de la fórmula (h/sem, €/h) |
| 8 | Si pudieras quitarte UN marrón mañana, ¿cuál? (presupuestos, perseguir cobros, el IVA, no saber si ganas en cada obra...) | Dolor #1 → qué pilar de Konker enfatizar |
| 9 | Para mandarte el informe y que lo tengas, ¿a qué email te lo dejo? | **Lead capture** (al final, cuando ya hay valor) |

**Contador de ahorro en vivo**: se activa tras la **pregunta 7** (cuando ya tenemos h/sem + €/h).
A partir de ahí, una cifra de ahorro estimado va subiendo en pantalla mientras responde
(enganche). Cifra siempre coherente con la fórmula, nunca inflada.

> El guion vive en un archivo de config (`chat-flow.json`) para poder clonarlo y cambiarlo
> por sector sin tocar código.

---

## 3. El informe final (versión completa)

Se renderiza **en pantalla** al acabar la conversación, branded (teal/naranja, Outfit + Jakarta),
estética de consultoría seria. Secciones:

1. **Cabecera personalizada**: "Informe para [Nombre] — [oficio]". Una frase-resumen.
2. **Tu situación hoy**: 2-3 bullets con lo que nos ha contado, en su idioma. Espejo (genera confianza).
3. **Cuánto tiempo y dinero recuperas**: cifra principal de horas/mes y €/mes (de la fórmula §4).
4. **Quick wins — lo que puedes quitarte ya**: tabla **problema → solución** (en cristiano),
   priorizada por el dolor #1 que marcó en P8. Mapea a los 3 pilares de Konker.
5. **Calculadora interactiva**: campos editables (coste/hora, horas/semana) → ahorro al instante.
   El usuario juega con sus números y ve el resultado moverse.
6. **Proyección a 3 años**: lo que pierde si no hace nada (horas y € acumulados), con disclaimer honesto.
7. **Antes / Después**: dos columnas. Antes (el caos actual) / Después (con el sistema). En su lenguaje.
8. **CTA — agendar llamada**: **Cal.com embebido**. "Te lo configuramos nosotros en una llamada."
9. **Descargar en PDF**: botón. El mismo informe, branded, descargable.

Microcopys y disclaimers de honestidad ("no son promesas, son estimaciones con tus números y
medias del sector") integrados.

---

## 4. La fórmula honesta de ahorro (núcleo de "no inventes datos")

Inputs (del usuario, P6/P7; si faltan, rango medio del sector):
- `h_admin_semana` = horas/semana en papeleo (rango sector: 6–10; medio 8)
- `coste_hora` = lo que vale su hora (rango por oficio: 25–40€; medio 30€)
- `pct_recuperable` = % del papeleo que el sistema se come (conservador: **60–70%**, no 100%)

Cálculos (transparentes, se muestran):
```
horas_mes_admin      = h_admin_semana * 4.33
horas_recuperadas    = horas_mes_admin * pct_recuperable      # tope visual "hasta 30h/mes"
ahorro_tiempo_eur    = horas_recuperadas * coste_hora          # €/mes
coste_konker_mes     = 97                                       # €/mes
ahorro_neto_mes      = ahorro_tiempo_eur - coste_konker_mes
payback_dias         = 490 / (ahorro_neto_mes / 30)            # setup / ahorro diario
proyeccion_3y        = (horas_recuperadas * 12 * 3) * coste_hora  # coste de no hacer nada
```
Reglas:
- Nunca mostrar > 30 h/mes recuperadas (cap honesto, alineado con el marketing).
- Siempre rangos/"hasta"/"de media". Mostrar la fórmula en un desplegable ("cómo lo calculamos").
- Rangos del sector **parametrizados** en `savings-config.json` (clonable por sector).

---

## 5. Arquitectura técnica

```
Visitante (landing Astro)
   │
   ├─ Widget de chat (Astro island / web component)  ← UI, estado, contador en vivo, informe, PDF
   │
   ├─ POST /api/chat        (Vercel edge fn) ─► OpenRouter (modelo por string)  [OPENROUTER_API_KEY]
   │                                            (system prompt + historial + guion)
   │
   ├─ POST /api/transcribe  (Vercel edge fn) ─► Groq Whisper Large V3    [GROQ_API_KEY]
   │                                            (audio → texto)
   │
   └─ POST /api/lead        (Vercel edge fn) ─┬─► Supabase (CRM, proyecto nuevo) [SUPABASE_*]
                                              └─► Web3Forms (aviso email, ya existe)
   Cierre: Cal.com embebido (agendar llamada)
```

**Por qué edge functions**: las API keys (OpenRouter, Groq, Supabase service) **nunca** llegan al
navegador. El widget solo habla con `/api/*` del propio dominio. Vercel ya es el deploy actual.

**Supabase (proyecto nuevo)** — esquema mínimo:
- `leads`: id, created_at, nombre, oficio, equipo, herramientas, canal_clientes, tarea_tiempo,
  dolor_principal, email, h_admin_semana, coste_hora, ahorro_calculado, fuente='landing-chat'.
- `conversations`: id, lead_id, mensajes (jsonb), informe (jsonb), user_agent, started_at, ended_at.
- RLS: insert vía service key desde la edge fn; lectura solo para ti (dashboard simple o Supabase UI).

**Reusabilidad (plantilla)**: todo lo específico de Konker se externaliza en config:
`chat-flow.json` (preguntas), `savings-config.json` (fórmula + rangos), `brand.json`
(colores, nombre, voz), `report-copy.json` (textos del informe). Clonar para otro cliente =
cambiar 4 JSON, no el código.

---

## 6. Fases de implementación (en `konquer_landing`)

**Fase 0 — Prerrequisitos** (tú + yo)
- API key OpenRouter, API key Groq, crear proyecto Supabase nuevo, cuenta/evento Cal.com.
- Variables en `.env` local y en Vercel.

**Fase 1 — Andamiaje y config**
- Estructura de carpetas, los 4 JSON de config con el contenido de Konker (de este plan).
- System prompt de Claude (de §1/§2) en archivo versionado.

**Fase 2 — Edge functions**
- `/api/chat` (OpenRouter, modelo por string, streaming si da tiempo), `/api/transcribe` (Groq), `/api/lead` (Supabase + Web3Forms).
- Manejo de errores y rate-limit básico (anti-abuso).

**Fase 3 — Widget de chat (UI)**
- Burbuja abajo-derecha, conversación UNA pregunta a la vez, input texto + botón micro.
- Estado de conversación, contador de ahorro en vivo (post-P7).
- Estética Konker, mobile-first, respeta `prefers-reduced-motion`.

**Fase 4 — Informe + calculadora + PDF**
- Render del informe (las 9 secciones de §3), calculadora interactiva, antes/después, proyección.
- Generación de PDF (cliente, p. ej. html-to-pdf ligero) branded.
- Cal.com embebido en el cierre.

**Fase 5 — Persistencia y pruebas**
- Guardado del lead + conversación en Supabase, disparo Web3Forms en paralelo.
- Pruebas en móvil real, casos sin micro, sin JS, datos incompletos (rango medio).

**Fase 6 — Legal y cierre**
- Actualizar política de privacidad/GDPR (Supabase + Groq + OpenRouter como encargados).
- Consentimiento antes de capturar email. QA final. Deploy.

**Fase 7 — Plantillización (opcional, post-validación)**
- Documentar cómo clonar para otro sector (los 4 JSON + system prompt) → base del producto a vender.

---

## 7. Riesgos / cosas a vigilar
- **Coste LLM**: el modelo de arranque (claude-3.5-haiku vía OpenRouter) es barato, pero
  conversación + informe consume tokens. Cap de turnos y longitud. Rate-limit por IP para evitar
  abuso de la edge fn (la key es tuya). Cambiar de modelo = cambiar el string en OpenRouter.
- **iOS + micro**: grabación de audio en Safari/iOS es quisquillosa. Probar en iPhone real.
- **Honestidad**: el informe NO puede prometer cifras infladas — es tu reputación y la de la marca.
- **GDPR**: no capturar email sin consentimiento; informar de a dónde van los datos.
- **No romper la landing**: el widget se añade, no reescribe nada existente. `CtaFinal.astro` se respeta.

---

## 8. Lo que necesito de ti para arrancar la implementación
1. ¿API key de OpenRouter con saldo? (sí/no → la sacamos)
2. Crear proyecto Supabase nuevo (te guío) + API key Groq.
3. Usuario/URL del evento de Cal.com para la llamada.
4. Visto bueno al **nombre y tono** del chatbot (¿"Capataz"? ¿otro?).
5. Aprobación de este plan para empezar por la Fase 0/1.
