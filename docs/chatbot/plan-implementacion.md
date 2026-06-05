# Plan — Chatbot consultor "Tu consultor de Obra" (Konker AI)

## Context

Konker AI (SaaS vertical de gestión para autónomos de reformas) quiere un chatbot en su
landing (`konquer_landing`, Astro 6 estático + Tailwind 4, deploy Vercel) que actúe como
**consultor + vendedor**: hace 9 preguntas en conversación natural (texto o voz), genera un
**informe de consultoría** con el ahorro de tiempo/dinero del autónomo (calculadora con sus
números, proyección 3 años, antes/después, PDF) y cierra **agendando una llamada**.

Doble objetivo: (1) captar y cualificar leads reales para Konker; (2) servir de **plantilla
reutilizable** — es un producto estrella que el operador quiere revender a otros negocios
(terapeutas, estética, farmacias) en web y, más adelante, WhatsApp.

Arquitectura **híbrida**: el "cerebro" (persona, guion, fórmula, copy del informe) se diseña en
IA Masters OS (`projects/briefs/konker-chatbot/`, ya redactado); el **código** se implementa en
el repo de la landing. Este archivo es el plan de implementación consolidado y el artefacto de
handoff a la sesión de la landing.

### Decisiones cerradas
- **LLM**: vía **OpenRouter** (API compatible OpenAI, 1 sola key `OPENROUTER_API_KEY`). El modelo
  se elige por string (`model`) en OpenRouter; arrancar con uno barato y fuerte (p. ej.
  `anthropic/claude-3.5-haiku`). Cambiar de modelo = cambiar el string.
- **Voz**: **Groq Whisper Large V3** (`GROQ_API_KEY`) solo para transcribir audio → texto.
- **Conversación**: LLM-guiado (Claude/elegido lleva las 9 preguntas, conversa natural).
- **Lead/CRM**: **Supabase nuevo** (proyecto separado, NO el del dashboard de producción) como
  fuente de verdad. **Web3Forms** (ya en `CtaFinal.astro`) se mantiene como aviso email paralelo.
- **Booking**: **Cal.com** (el operador creará la cuenta) embebido al cerrar el informe.
- **Nombre del bot**: **"Tu consultor de Obra"**.
- **Informe**: versión completa (ahorro, quick wins, calculadora, proyección 3 años, antes/después,
  contador en vivo, PDF), con **fórmula honesta** (recupera 60-70%, capa 30h/mes, rangos del sector).

## Hallazgos técnicos (de la lectura del repo)
- `astro.config.mjs`: **sin adapter, output estático** → NO tocar el modo de build. Las funciones
  serverless van como **Vercel Functions nativas** en carpeta `/api` (runtime edge), que conviven
  con el sitio estático. No se añade `@astrojs/vercel` ni se reescribe nada existente.
- ⚠️ `vercel.json` línea 14: `Permissions-Policy: ... microphone=()` **desactiva el micro en toda
  la web**. Hay que cambiarlo a `microphone=(self)` o el botón de voz nunca funcionará.
- Lead actual: **Web3Forms** en `src/components/CtaFinal.astro` (`PUBLIC_WEB3FORMS_ACCESS_KEY`).
  Se respeta intacto; el chatbot escribe en Supabase y opcionalmente replica a Web3Forms.
- Marca: teal `#00D1B2` + naranja `#FF8A00`, fuentes Outfit + Plus Jakarta Sans (self-hosted).

## Arquitectura
```
Widget de chat (Astro island / web component en la landing estática)
  ├─ POST /api/chat        → OpenRouter (modelo elegido)   [OPENROUTER_API_KEY]
  ├─ POST /api/transcribe  → Groq Whisper Large V3         [GROQ_API_KEY]
  └─ POST /api/lead        → Supabase (CRM)  + Web3Forms    [SUPABASE_URL/SERVICE_KEY, WEB3FORMS]
Cierre: Cal.com embebido.  Keys SOLO en /api (edge), nunca en el cliente.
```
**Reusabilidad (plantilla)**: todo lo específico de Konker se externaliza en config —
`chat-flow.json` (9 preguntas), `savings-config.json` (fórmula + rangos), `brand.json`
(colores, nombre, voz), `report-copy.json` (textos del informe), más el `system-prompt`.
Clonar para otro cliente = editar esos archivos, no el código.

## Archivos a crear / tocar (en `konquer_landing`)
- `vercel.json` — **editar** header: `microphone=(self)` (habilitar micro).
- `api/chat.ts`, `api/transcribe.ts`, `api/lead.ts` — **nuevos** (Vercel edge functions).
- `src/components/Chatbot/` — **nuevo**: widget UI (burbuja, conversación, micro, contador en vivo).
- `src/components/Chatbot/Report.*` — **nuevo**: informe + calculadora interactiva + antes/después + PDF.
- `src/components/Chatbot/config/*.json` — **nuevo**: los 4 JSON de config + `system-prompt.md`.
- Inyección del widget en el layout/página principal (sin tocar `CtaFinal.astro`).
- `.env.example` — **editar**: añadir `OPENROUTER_API_KEY`, `GROQ_API_KEY`, `SUPABASE_URL`,
  `SUPABASE_SERVICE_ROLE_KEY`, `PUBLIC_CALCOM_URL`.
- `src/pages/legal/privacidad.astro` — **editar**: añadir Supabase, Groq y OpenRouter como
  encargados de tratamiento (GDPR).

## Supabase (proyecto nuevo) — esquema mínimo
- `leads`: nombre, oficio, equipo, herramientas, canal_clientes, tarea_tiempo, dolor_principal,
  email, h_admin_semana, coste_hora, ahorro_calculado, created_at, fuente.
- `conversations`: lead_id, mensajes (jsonb), informe (jsonb), started_at, ended_at, user_agent.
- RLS: insert vía service key desde edge fn; lectura solo para el operador.

## Fórmula honesta (núcleo "no inventes datos")
```
horas_mes_admin   = h_admin_semana * 4.33
horas_recuperadas = min(horas_mes_admin * 0.6..0.7, 30)   # conservador + cap 30h/mes
ahorro_tiempo_eur = horas_recuperadas * coste_hora
ahorro_neto_mes   = ahorro_tiempo_eur - 97
proyeccion_3y     = horas_recuperadas * 12 * 3 * coste_hora
```
Rangos del sector parametrizados en `savings-config.json`. Mostrar el cálculo en desplegable.
Siempre "hasta"/"de media", nunca cifras infladas.

## Fases de implementación
- **Fase 0 — Prerrequisitos** (operador): key OpenRouter, key Groq, crear proyecto Supabase,
  crear cuenta/evento Cal.com, poner vars en `.env` y en Vercel.
- **Fase 1 — Config + system prompt**: los 4 JSON con contenido Konker + system prompt versionado.
- **Fase 2 — Edge functions**: `/api/chat` (OpenRouter), `/api/transcribe` (Groq), `/api/lead`
  (Supabase + Web3Forms). Rate-limit básico por IP (la key es del operador).
- **Fase 3 — Widget**: burbuja abajo-derecha, UNA pregunta por turno, texto + botón micro,
  contador de ahorro en vivo (tras P7), estética Konker, mobile-first, `prefers-reduced-motion`.
- **Fase 4 — Informe**: 9 secciones, calculadora interactiva, antes/después, proyección 3 años,
  PDF branded (lib cliente ligera), Cal.com embebido en el cierre.
- **Fase 5 — Persistencia + QA**: guardado Supabase, replica Web3Forms, pruebas en iPhone real
  (micro en Safari/iOS), casos sin JS / datos incompletos (rango medio).
- **Fase 6 — Legal + deploy**: política de privacidad/GDPR, consentimiento antes del email, deploy.
- **Fase 7 — Plantillización** (post-validación): documentar el "clona 4 JSON" → base del producto.
- **Fase 8 — Skill del OS** (opcional, ver decisión abajo): meta-skill que scaffolda un chatbot
  nuevo (web/WhatsApp) reusando el cerebro. Se construye DESPUÉS de validar Konker.

## Migración a la sesión de la landing (DECIDIDO)
Las sesiones de Claude Code no transfieren estado; el artefacto de handoff es **este plan + los
docs del cerebro**. **Acordado**: como primer paso de la implementación, copiar `brief.md` +
`plan.md` a `konquer_landing/docs/chatbot/` (quedan versionados con el código). Luego se abre una
**sesión nueva de Claude Code con cwd en `konquer_landing`** y se le pide leer
`docs/chatbot/plan.md` para ejecutar desde la Fase 0.

## Reusabilidad como producto / skill (DECIDIDO: después de validar Konker)
Orden acordado: (1) que el de Konker funcione y convierta; (2) extraer el patrón (los 4 JSON +
system prompt + edge functions) a un **template repo**; (3) crystallizarlo en una **skill del OS**
(`meta-skill-creator`) que scaffolde clientes nuevos. Web y WhatsApp comparten el mismo "cerebro";
cambia el canal/infra (WhatsApp Business API / Twilio). No se construye la skill antes de validar
(evita abstracción prematura). Esto es la **Fase 8**, fuera del alcance de la entrega inicial.

## Verificación (end-to-end)
1. `npm run dev` en la landing; abrir la burbuja, completar las 9 preguntas por texto.
2. Probar el botón de micro en Chrome y en **iPhone real** (Safari) tras el fix de `microphone=(self)`.
3. Verificar que el informe calcula con los números introducidos y que la calculadora reacciona.
4. Descargar el PDF y revisar branding.
5. Confirmar que el lead aparece en Supabase y que llega el aviso de Web3Forms.
6. Reservar un hueco de prueba en el Cal.com embebido.
7. Revisar que las keys no aparecen en el bundle del cliente (solo en `/api`).
```
```
