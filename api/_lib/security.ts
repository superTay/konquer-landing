// Helpers de seguridad compartidos por todos los endpoints serverless.
// Los archivos en _lib/ no se convierten en rutas (convención Vercel).

const ALLOWED_ORIGINS = new Set([
  'https://www.konquerai.com',
  'https://konquerai.com',
  'http://localhost:4321',
  'http://localhost:3000',
  'http://localhost:3001',
]);

// Previews de Vercel (ramas / PRs): el dominio *.vercel.app cambia por deployment y no
// se puede meter a mano en ALLOWED_ORIGINS. Vercel expone la URL del propio deployment
// (y la del alias de rama) en variables de entorno automáticas; permitimos SOLO esas,
// nunca un *.vercel.app arbitrario.
function allowedPreviewOrigins(): Set<string> {
  const extra = new Set<string>();
  if (process.env.VERCEL_URL) extra.add(`https://${process.env.VERCEL_URL}`);
  if (process.env.VERCEL_BRANCH_URL) extra.add(`https://${process.env.VERCEL_BRANCH_URL}`);
  return extra;
}

function isAllowedOrigin(origin: string): boolean {
  return ALLOWED_ORIGINS.has(origin) || allowedPreviewOrigins().has(origin);
}

function forbidden(): Response {
  return new Response(JSON.stringify({ error: 'forbidden' }), {
    status: 403,
    headers: { 'Content-Type': 'application/json' },
  });
}

/**
 * Comprueba que la petición viene de nuestro propio dominio (o del propio deployment
 * de Vercel, en producción o preview). Los navegadores siempre envían Origin en
 * peticiones POST same-origin; se hace fallback a Referer para cubrir edge cases.
 * Devuelve una Response 403 si el check falla, o null si todo está bien.
 */
export function checkOrigin(req: Request): Response | null {
  const origin = req.headers.get('origin');

  if (origin !== null) {
    return isAllowedOrigin(origin) ? null : forbidden();
  }

  const referer = req.headers.get('referer');
  if (referer) {
    try {
      return isAllowedOrigin(new URL(referer).origin) ? null : forbidden();
    } catch {
      return forbidden();
    }
  }

  // Sin Origin ni Referer → acceso programático (curl, scripts automatizados)
  return forbidden();
}

/**
 * Acepta cualquier valor JSON y lo devuelve tal cual, salvo que supere maxBytes
 * al serializarlo (en cuyo caso devuelve null para descartar el payload gigante).
 */
export function clampJson(v: unknown, maxBytes = 100_000): unknown {
  if (v === null || v === undefined) return null;
  try {
    const s = JSON.stringify(v);
    return s.length > maxBytes ? null : v;
  } catch {
    return null;
  }
}
