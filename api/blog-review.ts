// GET /api/blog-review — Botones Aprobar/Suspender del email de revisión del blog.
//
// Se abre desde el correo del revisor, por eso NO usa checkOrigin: la
// seguridad es un token HMAC firmado con BLOG_REVIEW_SECRET y con caducidad.
// Escribe en el repo vía GitHub Contents API con BLOG_REVIEW_GITHUB_TOKEN
// (PAT fine-grained, solo este repo, contents read/write).
export const config = { runtime: 'edge' };

const REPO = process.env.BLOG_REVIEW_REPO || 'superTay/konquer-landing';
const BLOG_DIR = 'src/content/blog';

// ── Páginas de respuesta (en marca: tuteo, sin emojis) ──

function page(title: string, body: string, accent = '#00D1B2'): Response {
  return new Response(
    `<!doctype html>
<html lang="es">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="robots" content="noindex" />
  <title>${title} · KonquerAI</title>
</head>
<body style="margin:0;min-height:100vh;display:flex;align-items:center;justify-content:center;background:#F6F8F9;font-family:-apple-system,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#0B1F24;">
  <div style="max-width:420px;margin:24px;background:#fff;border:1px solid #E5EAEC;border-radius:16px;padding:36px 32px;text-align:center;">
    <p style="margin:0 0 4px;font-size:17px;font-weight:700;">Konquer<span style="color:#00D1B2;">AI</span></p>
    <div style="width:44px;height:4px;border-radius:2px;background:${accent};margin:14px auto 20px;"></div>
    <h1 style="margin:0 0 12px;font-size:22px;line-height:1.3;">${title}</h1>
    <div style="font-size:15px;line-height:1.65;color:#4B5563;">${body}</div>
  </div>
</body>
</html>`,
    { status: 200, headers: { 'Content-Type': 'text/html; charset=utf-8' } },
  );
}

const ORANGE = '#FF8A00';

// ── Token HMAC ──

async function validSignature(
  secret: string,
  payload: string,
  sigHex: string,
): Promise<boolean> {
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );
  const mac = new Uint8Array(
    await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(payload)),
  );
  const expected = Array.from(mac, (b) => b.toString(16).padStart(2, '0')).join('');
  if (expected.length !== sigHex.length) return false;
  let diff = 0;
  for (let i = 0; i < expected.length; i++) {
    diff |= expected.charCodeAt(i) ^ sigHex.charCodeAt(i);
  }
  return diff === 0;
}

// ── GitHub Contents API ──

type GhFile = { content: string; sha: string };

async function ghGet(token: string, path: string): Promise<GhFile | null> {
  const res = await fetch(`https://api.github.com/repos/${REPO}/contents/${path}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github+json',
      'User-Agent': 'konquerai-blog-review',
    },
  });
  if (!res.ok) return null;
  return (await res.json()) as GhFile;
}

async function ghPut(
  token: string,
  path: string,
  sha: string,
  content: string,
  message: string,
): Promise<boolean> {
  const res = await fetch(`https://api.github.com/repos/${REPO}/contents/${path}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github+json',
      'User-Agent': 'konquerai-blog-review',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ message, sha, content }),
  });
  return res.ok;
}

function decodeBase64Utf8(b64: string): string {
  const bin = atob(b64.replace(/\s/g, ''));
  const bytes = Uint8Array.from(bin, (c) => c.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

function encodeUtf8Base64(text: string): string {
  const bytes = new TextEncoder().encode(text);
  let bin = '';
  const CHUNK = 8192;
  for (let i = 0; i < bytes.length; i += CHUNK) {
    bin += String.fromCharCode(...bytes.subarray(i, i + CHUNK));
  }
  return btoa(bin);
}

// ── Frontmatter (mismos patrones que scripts/lib/posts.mjs) ──

function patchFrontmatter(text: string, patch: (fm: string) => string): string {
  return text.replace(/^---\n[\s\S]*?\n---/, (fm) => patch(fm));
}

function statusOf(text: string): string | null {
  const fm = text.match(/^---\n([\s\S]*?)\n---/)?.[1] ?? '';
  return fm.match(/^status:\s*(\w+)/m)?.[1] ?? null;
}

function setReviewLine(fm: string, value: string): string {
  const line = `review: ${value}`;
  return /^review:.*$/m.test(fm)
    ? fm.replace(/^review:.*$/m, line)
    : fm.replace(/^status:.*$/m, (s) => `${s}\n${line}`);
}

// ── Handler ──

export default async function handler(req: Request): Promise<Response> {
  if (req.method !== 'GET') {
    return new Response('method_not_allowed', { status: 405 });
  }

  const secret = process.env.BLOG_REVIEW_SECRET;
  const token = process.env.BLOG_REVIEW_GITHUB_TOKEN;
  if (!secret || !token) {
    return page(
      'Falta configuración',
      'La revisión del blog no está configurada todavía. Avisa al administrador.',
      ORANGE,
    );
  }

  const url = new URL(req.url);
  const slug = url.searchParams.get('slug') ?? '';
  const file = url.searchParams.get('file') ?? '';
  const action = url.searchParams.get('action') ?? '';
  const exp = url.searchParams.get('exp') ?? '';
  const sig = url.searchParams.get('sig') ?? '';

  if (
    !/^[a-z0-9-]+$/.test(slug) ||
    !/^[a-zA-Z0-9._-]+\.md$/.test(file) ||
    file.includes('..') ||
    !['approve', 'hold'].includes(action)
  ) {
    return page('Enlace no válido', 'Este enlace no es correcto.', ORANGE);
  }

  if (!(await validSignature(secret, `${slug}|${file}|${action}|${exp}`, sig))) {
    return page('Enlace no válido', 'Este enlace no es correcto o ha sido alterado.', ORANGE);
  }

  if (Math.floor(Date.now() / 1000) > parseInt(exp, 10)) {
    return page(
      'Enlace caducado',
      'Este enlace de revisión ya no está activo. Si necesitas cambiar algo del artículo, responde al correo de revisión.',
      ORANGE,
    );
  }

  const path = `${BLOG_DIR}/${file}`;
  const gh = await ghGet(token, path);
  if (!gh) {
    return page('No encontrado', 'No hemos encontrado este artículo.', ORANGE);
  }

  const text = decodeBase64Utf8(gh.content);
  const status = statusOf(text);
  const stamp = new Date().toISOString();

  if (status === 'published') {
    return page(
      'Ya está publicado',
      `Este artículo ya salió en el blog. <p style="margin-top:16px;"><a href="https://www.konquerai.com/blog/${slug}" style="color:#009B89;font-weight:600;">Verlo publicado</a></p>`,
    );
  }

  if (action === 'approve') {
    // pending ya aprobado antes → no generar otro commit
    if (status === 'pending' && /^review:\s*approved/m.test(text)) {
      return page('Aprobado', 'Ya lo habías aprobado. Se publica mañana a las 9:00.');
    }
    if (status === 'pending' || status === 'hold') {
      const updated = patchFrontmatter(text, (fm) =>
        setReviewLine(fm.replace(/^status:.*$/m, 'status: pending'), `approved ${stamp}`),
      );
      const ok = await ghPut(
        token,
        path,
        gh.sha,
        encodeUtf8Base64(updated),
        `chore(blog): review approved ${slug}`,
      );
      if (!ok) {
        return page('Algo ha fallado', 'No hemos podido guardar tu aprobación. Prueba otra vez en un minuto.', ORANGE);
      }
      return page(
        'Aprobado',
        'Perfecto. El artículo se publicará mañana a las 9:00 tal y como lo has visto.',
      );
    }
  }

  if (action === 'hold') {
    if (status === 'hold') {
      return page('Suspendido', 'Este artículo ya estaba suspendido y no se publicará.', ORANGE);
    }
    if (status === 'pending') {
      const updated = patchFrontmatter(text, (fm) =>
        setReviewLine(fm.replace(/^status:.*$/m, 'status: hold'), `suspended ${stamp}`),
      );
      const ok = await ghPut(
        token,
        path,
        gh.sha,
        encodeUtf8Base64(updated),
        `chore(blog): review suspended ${slug}`,
      );
      if (!ok) {
        return page('Algo ha fallado', 'No hemos podido suspenderlo. Prueba otra vez en un minuto.', ORANGE);
      }
      return page(
        'Suspendido',
        'Hecho: este artículo no se publicará. Si quieres cambiar algo y volver a programarlo, responde al correo de revisión. Y si cambias de idea, pulsa Aprobar en el mismo correo.',
        ORANGE,
      );
    }
  }

  return page(
    'Ya no está en revisión',
    'Este artículo ya no está pendiente de revisión.',
    ORANGE,
  );
}
