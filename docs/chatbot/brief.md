---
proyecto: konker-chatbot
status: active
nivel: planned-project
creado: 2026-06-05
owner: Christian
---

# Konker AI — Chatbot consultor/vendedor para la landing

> **ACTUALIZACIÓN (2026-06-06) — LLM vía OpenRouter.** La decisión cerrada es usar el LLM a
> través de **OpenRouter** (1 sola key `OPENROUTER_API_KEY`, modelo por string; se arranca con
> uno barato tipo `anthropic/claude-3.5-haiku`). Donde más abajo se lea "Claude Haiku vía API de
> Anthropic" o "ANTHROPIC_API_KEY", entiéndase **OpenRouter** (`OPENROUTER_API_KEY`). El resto del
> stack (Groq Whisper para voz, Supabase para CRM, Web3Forms, Cal.com) no cambia.

## Objetivo
Crear un chatbot embebido en la landing de Konker AI que actúe como **consultor + vendedor**:
ayuda al visitante (rol consultor) y empuja la conversión (rol vendedor). Sirve además como
**modelo/demo reutilizable** para vender chatbots a futuros clientes del operador.

## Decisión estructural (2026-06-05)
Arquitectura **híbrida**:
- **El "cerebro" (activo reutilizable)** vive aquí, en IA Masters OS → persona, system prompt,
  sales playbook, ICP, voice, flujos de conversación. Reutilizable clonando para otros clientes.
- **El código (widget + backend)** vive en el repo de la landing:
  `/Users/christianmarzaldellarovere/Desktop/FULL STACK/ConquerAI/konquer_landing`

## Stack de la landing (verificado)
- **Framework**: Astro 6 (`astro` ^6.3.7), `type: module`
- **Estilos**: Tailwind CSS 4 (`@tailwindcss/vite`)
- **Fonts**: Outfit + Plus Jakarta Sans
- **Deploy**: Vercel (`vercel.json`, `.vercel/`)
- **Node**: >=22.12.0
- **Sin framework de UI** (no React/Vue) → el widget irá como **Astro island** o **web component vanilla**
- Posible contexto de marca aprovechable en `marketing_konquer/`
- `.env` ya existe en el repo

## Decisiones cerradas (2026-06-05)
- [x] **Motor de conversación**: LLM-guiado. Claude lleva las 9 preguntas en orden pero conversa natural, repregunta y entiende lenguaje de obra. Base reutilizable para otros sectores.
- [x] **LLM**: vía **OpenRouter** (`OPENROUTER_API_KEY`, modelo por string; se arranca con `anthropic/claude-3.5-haiku`, el más barato). Key en variable de entorno de Vercel, lógica en **edge function** (la key nunca toca el cliente).
- [x] **Voz**: SÍ en v1. Botón de micro → transcripción con **Groq (Whisper Large V3)** (rápido y baratísimo, buen español). Solo transcripción; el chat sigue con Claude.
- [x] **Destino del lead**: **Supabase = CRM principal** (fuente de verdad). El formulario actual (**Web3Forms**, en `CtaFinal.astro`) se mantiene como aviso por email en paralelo.
- [x] **Supabase**: **proyecto NUEVO y separado** (no el del dashboard de producción). Más limpio, aislado y replicable para futuros clientes.
- [x] **Booking**: **Cal.com** (sustituye al sistema actual). Embebido al final del informe.
- [x] **Informe**: versión **completa** — ahorro tiempo+dinero, quick wins problema→solución, calculadora interactiva (coste/hora × horas/semana), proyección 3 años, antes/después, contador de ahorro en vivo, descarga PDF. Fórmula honesta con rangos del sector reformas.

## Pendiente de confirmar
- [ ] API key de **OpenRouter** (`OPENROUTER_API_KEY`) con saldo cargado
- [ ] Cuenta de Cal.com (usuario/URL del evento de la llamada)
- [ ] Cuenta Groq (API key) y proyecto Supabase nuevo (crear)
- [ ] Actualizar política de privacidad/GDPR: Supabase como nuevo encargado de tratamiento

## Stack del "cerebro" (resumen)
- Chat: **OpenRouter** (modelo por string, p. ej. `anthropic/claude-3.5-haiku`) en **Vercel edge function** (`/api/chat`)
- Voz: **Groq Whisper** en edge function (`/api/transcribe`)
- Persistencia/CRM: **Supabase** (proyecto nuevo) — tabla `leads` + `conversations`
- Booking: **Cal.com** embebido
- Aviso email: **Web3Forms** (ya existe) en paralelo
- UI: **Astro island** o **web component vanilla** (la landing no usa React)

## Naturaleza del proyecto
Test real + **plantilla reutilizable** para vender chatbots-consultor a otros negocios
(terapeutas, centros estéticos, farmacias, webs). El diseño debe ser configurable:
guion de preguntas, copy del informe, fórmula de ahorro y colores externalizados.

## Paso a paso del operador (prompt fuente, a sectorizar)
El operador aportó un prompt de un servicio parecido (agencia IA). Adaptado a Konker
(SaaS vertical reformas) en `plan.md`. Reglas heredadas que SÍ aplican:
- UNA pregunta cada vez, conversación de tú a tú, sin agobiar.
- Responder por texto o por voz (botón de micro).
- 9 preguntas → informe personalizado en pantalla.
- Calculadora con números del propio usuario (coste/hora, horas/semana) → ahorro al instante.
- Contador de ahorro en vivo en la pregunta más crítica (enganche).
- **No nombrar marcas de programas** (hablar en genérico: "el programa de facturación",
  "la hoja de cálculo"). Únicas marcas permitidas: WhatsApp, Instagram, Facebook (+ la propia Konker).
- Sin tecnicismos. **No inventar datos**: fórmula transparente + rangos reales del sector.
- Estética de informe de consultoría seria, colores Konker (teal #00D1B2 / naranja #FF8A00).

## Handoff al repo
Ver `plan.md` (fase final). El "cerebro" (persona, system prompt, guion, copy del informe,
fórmula) vive aquí; el código se implementa en `konquer_landing`.
