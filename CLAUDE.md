# KonquerAI Landing (konquerai.com)

## Qué es este repo

Landing pública de **KonquerAI**: el sitio web pre-login en konquerai.com. Es donde llegan los visitantes de tráfico orgánico, ads y boca a boca. Su trabajo es convertirlos en leads (demo, signup o llamada).

NO es la app del producto. La app autenticada vive en otro repo (`konquer-dashboard/`) y se despliega en `app.konquerai.com`.

## Tech stack

- Astro 4+ (HTML estático con islas de interactividad)
- Tailwind CSS v4
- TypeScript estricto
- Deploy en Vercel o Netlify

## Memoria de marca — **léela antes de escribir copy**

Toda la estrategia comercial, voz de marca, oferta, pricing, persona y copy maestro vive en la carpeta `marketing_konquer/` del root de este repo. **Es la fuente única de verdad.**

### Orden de lectura obligatorio antes de generar contenido

1. **Siempre primero**: `marketing_konquer/README.md` (índice maestro + 5 principios no negociables).
2. **Para cualquier copy de cliente**: `marketing_konquer/01_buyer_persona.md` + `marketing_konquer/02_brand_voice.md`.
3. **Para la home y secciones comerciales**: añadir `marketing_konquer/06_homepage_copy.md` (copy ya redactado, listo para implementar) + `marketing_konquer/03_storytelling.md` + `marketing_konquer/04_value_proposition.md` + `marketing_konquer/05_offer.md`.
4. **Para descripciones de feature**: `marketing_konquer/09_features_y_beneficios.md`.
5. **Para SEO técnico, meta tags, schema, sitemap**: `marketing_konquer/08_seo_strategy.md`.
6. **Para FAQ, objeciones, copy del CTA final**: `marketing_konquer/07_pitch_y_script_ventas.md`.

## Reglas no negociables (resumen)

Estas reglas vienen de `marketing_konquer/02_brand_voice.md` y son **bloqueantes** para cualquier cambio de copy:

1. **Lenguaje 100% español de obra**: "Por cobrar", "Por pagar", "Mi empresa". Cero anglicismos en UI cliente ("dashboard", "workflow", "pipeline" → fuera).
2. **Tuteo siempre**, nunca "usted".
3. **Sin emojis** en UI ni en copy de cliente.
4. **Mensajes de error en humano**, nunca técnicos.
5. **No mencionar "IA" en hero ni en CTAs**: el cliente compra resultado, no tecnología. "IA" se reserva para storytelling secundario.
6. **La promesa principal de marca es**: "Lleva tu negocio en serio sin volverte loco con tecnología."
7. **Los tres pilares de valor son**: (1) Lo de Hacienda lo lleva la app, (2) Sabe si ganas o pierdes en cada obra, (3) Hablas, no escribes.

## Colores y tipografía (vienen de la app, mantener consistencia)

- Primario: `#00D1B2` (teal)
- Acento: `#FF8A00` (naranja)
- Fuente titulares: Outfit
- Fuente cuerpo: Plus Jakarta Sans

## Cómo trabajar en este repo

Cuando el usuario pida cambiar copy, añadir secciones o crear páginas:

1. **Antes de escribir nada**, lee los archivos relevantes de `marketing_konquer/` listados arriba.
2. Si el copy ya está redactado en `06_homepage_copy.md`, **úsalo tal cual**. No reinventes.
3. Si hay que crear copy nuevo, sigue las reglas de `02_brand_voice.md` y verifica el dolor o beneficio contra `01_buyer_persona.md`.
4. Cualquier propuesta de copy debe poder pasar el test: "¿lo entendería un pintor de 55 años en 5 segundos?".

## Mantenimiento de la memoria de marca

La carpeta `marketing_konquer/` se duplica desde el repo de la app (`konquer-dashboard`). Si actualizas algo aquí, replícalo allí (y al revés). Cuando crezca el equipo, convertir en git submodule.

## Estructura del repo (objetivo)

```
/
├── src/
│   ├── pages/
│   │   ├── index.astro          # Home
│   │   ├── precios.astro
│   │   ├── para/
│   │   │   ├── pintores.astro
│   │   │   ├── electricistas.astro
│   │   │   └── ...
│   │   └── blog/
│   ├── components/
│   ├── layouts/
│   └── styles/
├── public/                       # Assets estáticos (logo, imágenes)
├── marketing_konquer/            # Memoria de marca (fuente de verdad)
├── astro.config.mjs
└── CLAUDE.md
```
