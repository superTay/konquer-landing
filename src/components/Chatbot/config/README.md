# Config del chatbot — "el cerebro"

Todo lo específico del cliente vive aquí. El código del widget y las edge functions NO se tocan
para clonar el bot a otro negocio: **solo se editan estos archivos.**

## Archivos

| Archivo | Qué contiene | Al clonar a otro cliente |
|---|---|---|
| `brand.json` | Nombre del bot, colores, fuentes, voz, marcas permitidas, booking. | Cambiar colores, nombre y voz. |
| `chat-flow.json` | Las 9 preguntas, su orden y el campo de BD destino. | Reescribir preguntas por sector. |
| `savings-config.json` | Fórmula honesta de ahorro + rangos del sector. | Ajustar rangos y coste del servicio. |
| `report-copy.json` | Textos del informe (títulos, quick wins, antes/después). | Reescribir copy del sector. |
| `system-prompt.ts` | El cerebro del consultor: voz, reglas duras, guion. | Adaptar persona y reglas. |

## Reglas que NO se tocan al clonar (honestidad)

- En `savings-config.json`, `pct_recuperable` nunca pasa de 0.7 y siempre hay tope de horas.
- Las cifras del informe SIEMPRE salen de la fórmula, nunca se escriben a mano.
- "hasta" / "de media" / "según tus números". Nunca promesas exactas.

## Cómo lo consumen las edge functions y el widget

- `/api/chat` inyecta `system-prompt.ts` + el estado del `chat-flow.json` en cada llamada al LLM.
- El widget lee `brand.json` y `report-copy.json` para pintar UI e informe.
- La calculadora y el contador en vivo usan `savings-config.json`.

> Origen del contenido: `marketing_konquer/` (fuente única de verdad de marca). Si cambias la voz
> aquí, revisa que sigue alineada con `02_brand_voice.md`.
