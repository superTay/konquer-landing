// POST /api/transcribe — Audio del micro -> texto, vía Groq Whisper Large V3.
// La GROQ_API_KEY vive SOLO aquí. Recibe multipart/form-data con campo "audio".
import { checkOrigin } from './_lib/security';

export const config = { runtime: 'edge' };

const MAX_BYTES = 20 * 1024 * 1024; // 20 MB de audio máximo

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

export default async function handler(req: Request): Promise<Response> {
  if (req.method !== 'POST') return json({ error: 'method_not_allowed' }, 405);

  const originErr = checkOrigin(req);
  if (originErr) return originErr;

  const key = process.env.GROQ_API_KEY;
  if (!key) return json({ error: 'La voz no está disponible ahora mismo.' }, 500);

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return json({ error: 'bad_request' }, 400);
  }

  const file = (form.get('audio') || form.get('file')) as File | null;
  if (!file || typeof (file as File).arrayBuffer !== 'function') {
    return json({ error: 'no_audio' }, 400);
  }
  if ((file as File).size > MAX_BYTES) {
    return json({ error: 'El audio es demasiado largo. Prueba con un mensaje más corto.' }, 413);
  }

  try {
    const out = new FormData();
    out.append('file', file, (file as File).name || 'audio.webm');
    out.append('model', 'whisper-large-v3');
    out.append('language', 'es');
    out.append('response_format', 'json');

    const r = await fetch('https://api.groq.com/openai/v1/audio/transcriptions', {
      method: 'POST',
      headers: { Authorization: `Bearer ${key}` },
      body: out,
    });

    if (!r.ok) {
      const detail = await r.text().catch(() => '');
      console.error('Groq error', r.status, detail);
      return json({ error: 'No te he pillado bien. Prueba a escribirlo.' }, 502);
    }

    const data = await r.json();
    const text: string = (data?.text ?? '').trim();
    return json({ text });
  } catch (e) {
    console.error('transcribe handler error', e);
    return json({ error: 'No he podido transcribir el audio. Prueba a escribirlo.' }, 500);
  }
}
