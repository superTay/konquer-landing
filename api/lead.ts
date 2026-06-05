// POST /api/lead — Guarda el lead + la conversación en Supabase (CRM) y, en paralelo,
// dispara el aviso por email con Web3Forms (best-effort, no bloquea).
// Las claves de Supabase (service role) viven SOLO aquí.
export const config = { runtime: 'edge' };

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

const str = (v: unknown, max = 500): string | null =>
  typeof v === 'string' && v.trim() ? v.trim().slice(0, max) : null;
const num = (v: unknown): number | null => {
  const n = typeof v === 'string' ? parseFloat(v.replace(',', '.')) : (v as number);
  return Number.isFinite(n) ? n : null;
};

type LeadBody = {
  nombre?: string; oficio?: string; equipo?: string; herramientas?: string;
  canal_clientes?: string; tarea_tiempo?: string; dolor_principal?: string;
  email?: string; h_admin_semana?: number | string; coste_hora?: number | string;
  ahorro_calculado?: number | string;
  mensajes?: unknown; informe?: unknown;
  started_at?: string; ended_at?: string;
};

export default async function handler(req: Request): Promise<Response> {
  if (req.method !== 'POST') return json({ error: 'method_not_allowed' }, 405);

  // Tolerante: acepta la URL base con o sin "/rest/v1" o barra final.
  const SUPABASE_URL = (process.env.SUPABASE_URL || '').replace(/\/+$/, '').replace(/\/rest\/v1$/, '');
  const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!SUPABASE_URL || !SERVICE_KEY) {
    return json({ error: 'El guardado no está configurado ahora mismo.' }, 500);
  }

  let body: LeadBody;
  try {
    body = await req.json();
  } catch {
    return json({ error: 'bad_request' }, 400);
  }

  const email = str(body.email, 254);
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return json({ error: 'Necesito un correo válido para mandarte el informe.' }, 400);
  }

  const lead = {
    nombre: str(body.nombre, 120),
    oficio: str(body.oficio, 120),
    equipo: str(body.equipo, 120),
    herramientas: str(body.herramientas),
    canal_clientes: str(body.canal_clientes),
    tarea_tiempo: str(body.tarea_tiempo),
    dolor_principal: str(body.dolor_principal),
    email,
    h_admin_semana: num(body.h_admin_semana),
    coste_hora: num(body.coste_hora),
    ahorro_calculado: num(body.ahorro_calculado),
    fuente: 'landing-chat',
  };

  const sbHeaders = {
    apikey: SERVICE_KEY,
    Authorization: `Bearer ${SERVICE_KEY}`,
    'Content-Type': 'application/json',
    Prefer: 'return=representation',
  };

  try {
    // 1) Insertar el lead
    const leadRes = await fetch(`${SUPABASE_URL}/rest/v1/leads`, {
      method: 'POST',
      headers: sbHeaders,
      body: JSON.stringify(lead),
    });
    if (!leadRes.ok) {
      const detail = await leadRes.text().catch(() => '');
      console.error('Supabase lead insert error', leadRes.status, detail);
      return json({ error: 'No he podido guardar tus datos. Inténtalo otra vez.' }, 502);
    }
    const [savedLead] = await leadRes.json();
    const leadId = savedLead?.id ?? null;

    // 2) Insertar la conversación (no bloqueante para la respuesta al usuario)
    if (leadId) {
      const conv = {
        lead_id: leadId,
        mensajes: body.mensajes ?? null,
        informe: body.informe ?? null,
        user_agent: req.headers.get('user-agent')?.slice(0, 500) ?? null,
        started_at: str(body.started_at, 40),
        ended_at: str(body.ended_at, 40),
      };
      fetch(`${SUPABASE_URL}/rest/v1/conversations`, {
        method: 'POST',
        headers: { ...sbHeaders, Prefer: 'return=minimal' },
        body: JSON.stringify(conv),
      }).catch((e) => console.error('Supabase conversation insert error', e));
    }

    // 3) Aviso por email con Web3Forms (best-effort, ya existía en la landing)
    const w3fKey = process.env.PUBLIC_WEB3FORMS_ACCESS_KEY;
    if (w3fKey) {
      fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          access_key: w3fKey,
          subject: `Nuevo lead del chat: ${lead.nombre || 'sin nombre'} (${lead.oficio || '—'})`,
          from_name: 'Tu consultor de Obra',
          nombre: lead.nombre,
          oficio: lead.oficio,
          email: lead.email,
          equipo: lead.equipo,
          dolor_principal: lead.dolor_principal,
          horas_papeleo_semana: lead.h_admin_semana,
          coste_hora: lead.coste_hora,
          ahorro_estimado_mes: lead.ahorro_calculado,
        }),
      }).catch((e) => console.error('Web3Forms error', e));
    }

    return json({ ok: true, lead_id: leadId });
  } catch (e) {
    console.error('lead handler error', e);
    return json({ error: 'No he podido guardar tus datos. Inténtalo otra vez.' }, 500);
  }
}
