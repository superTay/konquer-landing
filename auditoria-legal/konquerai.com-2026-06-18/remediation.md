# Plan de remediación — konquerai.com (18 jun 2026)

Estado: **la mayoría de acciones ya están APLICADAS en el código en esta sesión.** Lo que queda es trabajo del titular (verificaciones y documentos) y la validación en preview de la CSP.

## Resumen del veredicto

La web parte de una base sólida (páginas legales reales, aviso legal LSSI completo, sin analytics/trackers, buenos headers, consentimiento de formulario correcto). El riesgo real venía de que **el chatbot introdujo flujos de datos que las políticas no reflejaban**. Eso ya se ha corregido.

## Acciones por prioridad

### Crítica / Alta — APLICADO en código
1. **Política de privacidad ampliada** (`src/pages/legal/privacidad.astro`): añadido el tratamiento del asistente (texto y voz), el almacenamiento de la conversación, y los encargados OpenRouter, Anthropic, Groq, Supabase y Cal.com, con base legal y transferencias internacionales.
2. **Política de cookies corregida** (`src/pages/legal/cookies.astro`): se retira el "cero cookies" absoluto; se declara que Cal.com instala cookies de terceros y solo se carga con consentimiento.
3. **Gate de consentimiento del chat** (`src/components/Chatbot/chatbot.client.ts` + `Chatbot.astro`): antes de mandar nada a los proveedores externos o guardar la conversación, el usuario debe aceptar un aviso. Recordado en `localStorage` (`konker_consent_chat`).
4. **Gate de consentimiento de Cal.com** (`src/components/Chatbot/report.client.ts` + `Report.astro`): Cal.com NO se carga (ni instala cookies) hasta que el usuario pulsa "ver la agenda aquí". Recordado en `localStorage` (`konker_consent_cal`).

### Media
5. **CSP enforcing** (`vercel.json`): cambiada de `Content-Security-Policy-Report-Only` a `Content-Security-Policy`. **Pendiente de validar en un preview de Vercel** (Astro dev no aplica `vercel.json`): recorrer home + chat + reservar una cita de prueba en Cal y confirmar que no hay errores de CSP en consola.
6. **Región de Supabase + DPAs** (titular): confirmar la región del proyecto Supabase (UE vs EE. UU.) y ajustar el texto de transferencias; recopilar/firmar DPA y SCC con OpenRouter, Anthropic, Groq, Supabase, Cal.com, Web3Forms y Google. Hay un comentario TODO en `privacidad.astro` marcándolo.

### Baja — APLICADO en código
7. **DNI retirado del aviso legal** (`src/pages/legal/terminos.astro`).
8. **Nota informativa en el formulario** (`src/components/CtaFinal.astro`).
9. **Resumen GDPR sincronizado** (`src/pages/legal/gdpr.astro`).

## Verificación realizada
- `npm run build` correcto (8 páginas).
- Páginas legales renderizan: cookies con la sección Cal.com y tabla; privacidad con los 6 encargados; términos sin DNI; gdpr con los encargados del chat.
- Gate del chat verificado en navegador: aviso visible, input/micro/enviar bloqueados hasta aceptar; al aceptar aparece el saludo y se habilita; consentimiento persistido. Sin errores de consola.

## Pendiente (no verificable por caja negra)
- Región de Supabase y contratos de encargado (DPA/SCC) — **requiere verificación humana**.
- Validación de la CSP enforcing en preview de Vercel antes de promover a producción.
- Si algún testimonio o cifra publicitaria de la web no fuera real, marcarlo (no se ha detectado problema, pero la veracidad de claims requiere verificación humana).
