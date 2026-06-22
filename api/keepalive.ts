// GET /api/keepalive — Cron job para mantener el proyecto Supabase activo.
// Vercel lo llama según el schedule definido en vercel.json (lunes y jueves 8:00 UTC).
// Si CRON_SECRET está definido en las env vars de Vercel, lo valida como Bearer token.
export const config = { runtime: 'edge' };

export default async function handler(req: Request): Promise<Response> {
  const secret = process.env.CRON_SECRET;
  if (secret) {
    const auth = req.headers.get('authorization');
    if (auth !== `Bearer ${secret}`) {
      return new Response('Unauthorized', { status: 401 });
    }
  }

  const SUPABASE_URL = (process.env.SUPABASE_URL || '').replace(/\/+$/, '').replace(/\/rest\/v1$/, '');
  const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!SUPABASE_URL || !SERVICE_KEY) {
    return new Response(JSON.stringify({ ok: false, reason: 'not_configured' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/leads?select=id&limit=1`, {
      headers: {
        apikey: SERVICE_KEY,
        Authorization: `Bearer ${SERVICE_KEY}`,
      },
    });

    return new Response(
      JSON.stringify({ ok: res.ok, status: res.status, ts: new Date().toISOString() }),
      { status: 200, headers: { 'Content-Type': 'application/json' } },
    );
  } catch (e) {
    return new Response(JSON.stringify({ ok: false, error: String(e) }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
