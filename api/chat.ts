// POST /api/chat — Conversación del consultor vía OpenRouter.
// La OPENROUTER_API_KEY vive SOLO aquí (servidor), nunca llega al navegador.
import { SYSTEM_PROMPT } from '../src/components/Chatbot/config/system-prompt';
import { checkOrigin } from './_lib/security';

export const config = { runtime: 'edge' };

const MODEL = process.env.OPENROUTER_MODEL || 'anthropic/claude-haiku-4.5';
const MAX_HISTORY = 24;      // turnos máximos que reenviamos (control de coste)
const MAX_CHARS = 2000;      // tope por mensaje del usuario (anti-abuso)

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

type Msg = { role: 'user' | 'assistant'; content: string };

export default async function handler(req: Request): Promise<Response> {
  if (req.method !== 'POST') return json({ error: 'method_not_allowed' }, 405);

  const originErr = checkOrigin(req);
  if (originErr) return originErr;

  const key = process.env.OPENROUTER_API_KEY;
  if (!key) return json({ error: 'No está configurado el chat ahora mismo.' }, 500);

  let body: { messages?: Msg[] };
  try {
    body = await req.json();
  } catch {
    return json({ error: 'bad_request' }, 400);
  }

  const incoming = Array.isArray(body.messages) ? body.messages : [];
  const messages: Msg[] = incoming
    .filter((m) => m && (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string')
    .slice(-MAX_HISTORY)
    .map((m) => ({ role: m.role, content: m.content.slice(0, MAX_CHARS) }));

  if (messages.length === 0) return json({ error: 'empty' }, 400);

  try {
    const r = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${key}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://konquerai.com',
        'X-Title': 'Konker - Tu consultor de Obra',
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [{ role: 'system', content: SYSTEM_PROMPT }, ...messages],
        max_tokens: 320,
        temperature: 0.4,
        // Frenos: que no se invente turnos del usuario ni divague.
        stop: ['\nHuman:', '\nUser:', '\nUsuario:', 'Human:', 'Usuario:'],
        // Enrutar a proveedores de calidad (evita corrupción de tokens en proveedores baratos).
        provider: { order: ['Anthropic', 'Amazon Bedrock', 'Google'], allow_fallbacks: true },
      }),
    });

    if (!r.ok) {
      const detail = await r.text().catch(() => '');
      console.error('OpenRouter error', r.status, detail);
      return json({ error: 'Se me ha ido el santo al cielo. Prueba otra vez en un momento.' }, 502);
    }

    const data = await r.json();
    const reply: string = data?.choices?.[0]?.message?.content ?? '';
    if (!reply) return json({ error: 'empty_reply' }, 502);

    return json({ reply });
  } catch (e) {
    console.error('chat handler error', e);
    return json({ error: 'No he podido contestar ahora mismo. Inténtalo otra vez.' }, 500);
  }
}
