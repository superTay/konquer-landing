#!/usr/bin/env node
// Banco de pruebas del consultor (método Consultor Hacker).
// Enfrenta el PROMPT REAL (src/components/Chatbot/config/system-prompt.ts) contra 10 perfiles
// de cliente vía OpenRouter: un LLM hace de cliente (actor), el bot responde con el system
// prompt de producción, y un LLM "juez" puntúa cada conversación contra la rúbrica CH.
// Una ejecución = una "ronda". Iteras: corres -> revisas -> ajustas el prompt -> vuelves a correr.
//
// USO:
//   OPENROUTER_API_KEY=sk-... node scripts/test-consultor-ch.mjs
//   # o cargando el .env de la landing (Node 20+):
//   node --env-file=../../../.env scripts/test-consultor-ch.mjs
//
// ENV opcionales:
//   BOT_MODEL    modelo del consultor (def: OPENROUTER_MODEL o anthropic/claude-haiku-4.5 = prod)
//   ACTOR_MODEL  modelo que hace de cliente (def: BOT_MODEL)
//   JUDGE_MODEL  modelo que puntúa (def: BOT_MODEL). RECOMENDADO uno más fuerte (Sonnet/Opus).
//   ONLY         subconjunto de perfiles, p.ej. ONLY=racional,objetor_precio
//   MAX_TURNS    tope de turnos por conversación (def: 16)

import { build } from 'esbuild';
import { writeFileSync, mkdirSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');

const API_KEY = process.env.OPENROUTER_API_KEY;
if (!API_KEY) {
  console.error('\n✗ Falta OPENROUTER_API_KEY.\n  Prueba:  node --env-file=../../../.env scripts/test-consultor-ch.mjs\n');
  process.exit(1);
}
const BOT_MODEL = process.env.BOT_MODEL || process.env.OPENROUTER_MODEL || 'anthropic/claude-haiku-4.5';
const ACTOR_MODEL = process.env.ACTOR_MODEL || BOT_MODEL;
const JUDGE_MODEL = process.env.JUDGE_MODEL || BOT_MODEL;
const MAX_TURNS = Number(process.env.MAX_TURNS || 24);
const ONLY = (process.env.ONLY || '').split(',').map((s) => s.trim()).filter(Boolean);

// ---------- 1) Prompt real (bundle de la TS = mismo precio interpolado que prod) ----------
async function loadSystemPrompt() {
  const res = await build({
    entryPoints: [join(ROOT, 'src/components/Chatbot/config/system-prompt.ts')],
    bundle: true, format: 'esm', platform: 'node', write: false, logLevel: 'silent',
  });
  const tmp = join(tmpdir(), `sp-${Date.now()}.mjs`);
  writeFileSync(tmp, res.outputFiles[0].text);
  return (await import(pathToFileURL(tmp).href)).SYSTEM_PROMPT;
}

// ---------- OpenRouter ----------
async function chat(model, messages, { max_tokens = 320, temperature = 0.4, stop } = {}) {
  for (let intento = 0; intento < 4; intento++) {
    const r = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://konquerai.com',
        'X-Title': 'KonquerAI - test consultor',
      },
      body: JSON.stringify({
        model, messages, max_tokens, temperature, stop,
        provider: { order: ['Anthropic', 'Amazon Bedrock', 'Google'], allow_fallbacks: true },
      }),
    });
    if (r.status === 429 || r.status >= 500) { await sleep(1500 * (intento + 1)); continue; }
    if (!r.ok) throw new Error(`OpenRouter ${r.status}: ${(await r.text().catch(() => '')).slice(0, 300)}`);
    const data = await r.json();
    return data?.choices?.[0]?.message?.content ?? '';
  }
  throw new Error('OpenRouter: demasiados reintentos (rate limit / 5xx).');
}
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const stripData = (s) => s.replace(/\[\[DATA:[\s\S]*?\]\]/g, '').replace(/\[\[?DATA[\s\S]*$/, '').trim();
const getData = (s) => { const m = s.match(/\[\[DATA:(\{[\s\S]*?\})\]\]/); try { return m ? JSON.parse(m[1]) : null; } catch { return null; } };

// ---------- 2) Los 10 perfiles ----------
const PERSONAS = [
  { id: 'racional', label: 'Racional puro', brief: 'Electricista, 3 empleados. Frío y analítico: vas a números y ROI, sin dramas emocionales. Preguntas cuánto cuesta, qué ahorras y cómo lo demuestran. No te conmueve el rollo del domingo por la noche.' },
  { id: 'emocional', label: 'Emocional / quemado', brief: 'Pintor, solo. Estás quemado: haces papeleo los domingos de noche, no llegas a todo, lo dices con frustración ("esto no lo aguanto más"). Buscas que alguien te quite ese peso.' },
  { id: 'no_cualifica_sector', label: 'No cualifica (sector)', brief: 'Tienes una peluquería, NO eres de reformas. Entraste por curiosidad. Si te lo dicen claro, lo entiendes.' },
  { id: 'no_cualifica_tech', label: 'No cualifica (ya tech)', brief: 'Reformas integrales, pero eres muy manejado: ya tienes tu sistema montado con programas y te funciona de maravilla. Estás contento, no buscas cambiar.' },
  { id: 'no_cualifica_tamano', label: 'No cualifica (pequeño)', brief: 'Fontanero que acaba de darse de alta hace 2 meses. Facturas muy poco aún, casi no tienes trabajo. Miras opciones para el futuro.' },
  { id: 'compra_alta', label: 'Estado de compra alto', brief: 'Albañil, 4 empleados. Vienes caliente: ya sabes que necesitas esto, estás harto del Excel y quieres solución YA. Decides rápido si te cuadra.' },
  { id: 'compra_baja', label: 'Estado de compra bajo', brief: 'Electricista, 2 empleados. Frío, solo curioseando. Escéptico de que una app sirva de algo. Respondes con desgana, sin abrirte mucho al principio.' },
  { id: 'esceptico_tech', label: 'Escéptico tecnológico', brief: 'Pintor de 58 años, solo. "No se me dan los ordenadores", te da miedo cambiar tu forma de trabajar de toda la vida. Crees que esto será un lío para ti.' },
  { id: 'con_socio', label: 'Con socio decisor', brief: 'Reformas, vais dos socios. Te interesa, pero estas cosas las decides con tu socio: "lo tengo que hablar con mi socio".' },
  { id: 'objetor_precio', label: 'Objetor de precio', brief: 'Fontanero, 2 empleados. Todo te parece caro, regateas por costumbre. Cuando salga el precio dirás que es mucho, que te lo tienes que pensar.' },
];

const actorSystem = (p) => `Eres un autónomo español hablando con un consultor en el chat de una web. Tu personaje: ${p.brief}
Responde SIEMPRE en primera persona, como este autónomo. Español de España, frases cortas y naturales, UNA respuesta por turno (1-2 frases). No te salgas del personaje ni hagas de asistente; tú eres el CLIENTE. Sé realista: si el consultor te convence de verdad, ve accediendo; si no encajas o no te convence, mantente fiel a tu carácter. No reveles que eres una simulación. Cuando la conversación llegue a su fin natural (te despides, aceptas, agendas o lo rechazas), termina tu mensaje con [FIN].`;

// ---------- 3) Una conversación ----------
async function runConversation(systemPrompt, persona) {
  // El bot saluda primero (como el widget real): sembramos su primera pregunta.
  const firstBot = 'Para empezar, ¿cómo te llamas?';
  const history = [{ role: 'assistant', content: firstBot }]; // desde la óptica del BOT
  const transcript = [{ who: 'bot', text: firstBot }];
  let lastData = null;
  let ended = false;

  for (let t = 0; t < MAX_TURNS && !ended; t++) {
    // Cliente (actor): historia con roles invertidos
    const actorMsgs = [
      { role: 'system', content: actorSystem(persona) },
      ...history.map((m) => ({ role: m.role === 'assistant' ? 'user' : 'assistant', content: m.content })),
    ];
    const userRaw = await chat(ACTOR_MODEL, actorMsgs, { max_tokens: 160, temperature: 0.85 });
    const userText = userRaw.replace(/\[FIN\]/gi, '').trim();
    transcript.push({ who: 'user', text: userText });
    history.push({ role: 'user', content: userText });
    if (/\[FIN\]/i.test(userRaw)) { ended = true; break; }

    // Bot (prompt de producción)
    const botMsgs = [{ role: 'system', content: systemPrompt }, ...history];
    const botRaw = await chat(BOT_MODEL, botMsgs, {
      max_tokens: 320, temperature: 0.4,
      stop: ['\nHuman:', '\nUser:', '\nUsuario:', 'Human:', 'Usuario:'],
    });
    const data = getData(botRaw); if (data) lastData = data;
    const clean = stripData(botRaw);
    transcript.push({ who: 'bot', text: clean });
    history.push({ role: 'assistant', content: clean });
  }
  return { transcript, lastData };
}

// ---------- 4) Juez ----------
const RUBRIC = `Eres un evaluador experto del método de ventas "Consultor Hacker". Te paso una conversación entre un CONSULTOR (bot de KonquerAI, app para autónomos de reformas) y un CLIENTE simulado. Evalúa SOLO el desempeño del CONSULTOR.

Criterios (cada uno 0-10):
- voz_marca: español de obra, frases cortas, sin tecnicismos, sin emojis, no menciona "IA".
- una_pregunta_turno: una sola pregunta por turno, no formulario atropellado.
- brecha: crea tensión/consciencia del problema antes de presentar (no salta a vender).
- ancla_presentacion: la solución/pilares anclados a lo que dijo el cliente, no genérico.
- email_momento: pide el email como puerta del informe, cuando ya hay valor (no al principio).
- compromiso: mide el compromiso del cliente (dispuesto a cambiar) antes del cierre.
- objeciones: maneja objeciones reformulando, sin discutir.
- descalifica: si el cliente NO encaja (otro sector / ya montado / muy pequeño), lo descalifica con honestidad en vez de forzar la venta.
- precio_correcto: si menciona precio, dice 490€ de alta y 97€/mes (NADA de 500). La prueba es una GARANTÍA de 15 días con DEVOLUCIÓN TOTAL (se da de alta y paga, y se le devuelve todo si no se queda); que el bot mencione la devolución total es CORRECTO, no un error. Lo único mal sería llamarla "gratis" o inventar otras condiciones.
- honestidad: no inventa cifras exactas como promesa; dice "KonquerAI" (nunca "Konker").

Devuelve SOLO un JSON válido, sin texto alrededor:
{"score": <0-100>, "pass": <true|false>, "criterios": {"voz_marca":N,...todos...}, "aciertos": "1-2 frases", "fallos": "1-2 frases con lo más importante a corregir"}
"score" = media ponderada 0-100. "pass" = true si score>=75 y ningún criterio crítico (brecha, email_momento, precio_correcto, descalifica si aplica) por debajo de 5.
IMPORTANTE: si la conversación se corta antes del cierre (no por culpa del consultor, sino porque se acabó), no penalices precio_correcto como si fuera un error grave; nótalo en "fallos".
Devuelve el JSON en UNA sola línea, sin markdown ni triple-backtick, y sin saltos de línea dentro de los textos.`;

async function judgeConversation(transcript, persona) {
  const convo = transcript.map((m) => `${m.who === 'bot' ? 'CONSULTOR' : 'CLIENTE'}: ${m.text}`).join('\n');
  const raw = await chat(JUDGE_MODEL, [
    { role: 'system', content: RUBRIC },
    { role: 'user', content: `PERFIL DEL CLIENTE: ${persona.label} — ${persona.brief}\n\nCONVERSACIÓN:\n${convo}` },
  ], { max_tokens: 1200, temperature: 0 });
  const cleaned = raw.replace(/```json/gi, '').replace(/```/g, '');
  const m = cleaned.match(/\{[\s\S]*\}/);
  const candidate = (m ? m[0] : cleaned).replace(/,\s*(\}|\])/g, '$1'); // quita comas colgantes
  try { return JSON.parse(candidate); } catch { return { score: null, pass: null, fallos: 'No se pudo parsear el juicio (sube JUDGE_MODEL a un modelo más fuerte)', _raw: raw.slice(0, 500) }; }
}

// ---------- 5) Main ----------
const targets = ONLY.length ? PERSONAS.filter((p) => ONLY.includes(p.id)) : PERSONAS;
const stamp = new Date().toISOString().replace(/[:.]/g, '-');
const outDir = join(ROOT, 'scripts', 'test-output', stamp);
mkdirSync(outDir, { recursive: true });

console.log(`\nRonda de test — bot=${BOT_MODEL} · juez=${JUDGE_MODEL}`);
console.log(`Perfiles: ${targets.map((p) => p.id).join(', ')}\nSalida: ${outDir}\n`);

const systemPrompt = await loadSystemPrompt();
const resumen = [];

for (const persona of targets) {
  process.stdout.write(`▶ ${persona.label.padEnd(26)} `);
  try {
    const { transcript, lastData } = await runConversation(systemPrompt, persona);
    const veredicto = await judgeConversation(transcript, persona);
    const md = [
      `# ${persona.label} (${persona.id})`,
      `> ${persona.brief}\n`,
      `**Score:** ${veredicto.score ?? '—'} · **Pass:** ${veredicto.pass ?? '—'}`,
      veredicto.aciertos ? `**Aciertos:** ${veredicto.aciertos}` : '',
      veredicto.fallos ? `**Fallos:** ${veredicto.fallos}` : '',
      veredicto.criterios ? `\n**Criterios:** ${JSON.stringify(veredicto.criterios)}` : '',
      lastData ? `\n**DATA final:** \`${JSON.stringify(lastData)}\`` : '',
      `\n---\n`,
      ...transcript.map((m) => `**${m.who === 'bot' ? 'CONSULTOR' : 'CLIENTE'}:** ${m.text}`),
    ].filter(Boolean).join('\n');
    writeFileSync(join(outDir, `${persona.id}.md`), md);
    resumen.push({ perfil: persona.id, score: veredicto.score, pass: veredicto.pass, turnos: transcript.length, fallos: veredicto.fallos || '' });
    console.log(`score=${String(veredicto.score ?? '—').padStart(3)}  pass=${veredicto.pass ?? '—'}`);
  } catch (e) {
    resumen.push({ perfil: persona.id, score: null, pass: false, error: String(e.message || e) });
    console.log(`ERROR: ${e.message || e}`);
  }
}

writeFileSync(join(outDir, '_resumen.json'), JSON.stringify(resumen, null, 2));
const scores = resumen.map((r) => r.score).filter((n) => typeof n === 'number');
const media = scores.length ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : '—';
const pasan = resumen.filter((r) => r.pass === true).length;

console.log('\n──────── RESUMEN ────────');
for (const r of resumen) console.log(`${(r.pass === true ? '✓' : '✗')} ${r.perfil.padEnd(24)} ${String(r.score ?? '—').padStart(3)}  ${r.fallos ? '— ' + r.fallos.slice(0, 70) : (r.error ? '— ' + r.error.slice(0, 70) : '')}`);
console.log(`\nMedia: ${media}/100 · Pasan: ${pasan}/${resumen.length}`);
console.log(`Transcripciones y notas en: ${outDir}\n`);
