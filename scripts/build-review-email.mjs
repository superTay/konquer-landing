#!/usr/bin/env node
/**
 * Genera el HTML del email de revisión de la víspera (no lo envía:
 * el envío lo hace el workflow por SMTP con action-send-mail).
 *
 * Entradas por variables de entorno:
 *   SLUG, FILE, TITLE, DESCRIPTION, TLDR  — datos del post (de prepare-review)
 *   PREVIEW_URL                           — deployment de preview de Vercel
 *   BLOG_REVIEW_SECRET                    — clave HMAC de los botones
 *   REVIEW_BASE_URL (opcional)            — endpoint de acciones
 *
 * Salida: review-email.html en el directorio actual + subject en GITHUB_OUTPUT.
 */

import { createHmac } from 'node:crypto';
import { writeFileSync } from 'node:fs';
import { ghOutput } from './lib/posts.mjs';

const {
  SLUG: slug,
  FILE: file,
  TITLE: title,
  DESCRIPTION: description = '',
  TLDR: tldrText = '',
  PREVIEW_URL: previewUrl,
  BLOG_REVIEW_SECRET: secret,
  REVIEW_BASE_URL: baseUrl = 'https://www.konquerai.com/api/blog-review',
} = process.env;

for (const [name, value] of Object.entries({ SLUG: slug, FILE: file, TITLE: title, PREVIEW_URL: previewUrl, BLOG_REVIEW_SECRET: secret })) {
  if (!value) {
    console.error(`Falta la variable ${name}`);
    process.exit(1);
  }
}

// Los enlaces valen hasta bastante después de la publicación de mañana
const exp = Math.floor(Date.now() / 1000) + 24 * 3600;

function actionLink(action) {
  const sig = createHmac('sha256', secret)
    .update(`${slug}|${file}|${action}|${exp}`)
    .digest('hex');
  const params = new URLSearchParams({ slug, file, action, exp: String(exp), sig });
  return `${baseUrl}?${params}`;
}

const postUrl = `${previewUrl.replace(/\/$/, '')}/blog/${slug}`;
const esc = (s) => s.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');

const html = `<!doctype html>
<html lang="es">
<body style="margin:0;padding:0;background:#F6F8F9;font-family:-apple-system,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#0B1F24;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#F6F8F9;padding:24px 12px;">
    <tr><td align="center">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#FFFFFF;border-radius:16px;overflow:hidden;border:1px solid #E5EAEC;">
        <tr>
          <td style="background:#0B1F24;padding:18px 28px;">
            <span style="color:#FFFFFF;font-size:18px;font-weight:700;">Konquer<span style="color:#00D1B2;">AI</span></span>
            <span style="color:#9DB2B8;font-size:13px;float:right;line-height:24px;">Revisión del blog</span>
          </td>
        </tr>
        <tr>
          <td style="padding:32px 28px 8px;">
            <p style="margin:0 0 6px;font-size:13px;font-weight:600;letter-spacing:0.06em;text-transform:uppercase;color:#009B89;">Se publica mañana a las 9:00</p>
            <h1 style="margin:0 0 12px;font-size:24px;line-height:1.25;color:#0B1F24;">${esc(title)}</h1>
            <p style="margin:0 0 18px;font-size:15px;line-height:1.6;color:#4B5563;">${esc(description)}</p>
            ${tldrText ? `<table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td style="background:#E6FAF6;border-left:4px solid #00D1B2;border-radius:0 8px 8px 0;padding:14px 18px;font-size:14px;line-height:1.6;color:#0B1F24;">${esc(tldrText)}</td></tr></table>` : ''}
          </td>
        </tr>
        <tr>
          <td style="padding:24px 28px 8px;" align="center">
            <a href="${postUrl}" style="display:inline-block;background:#00D1B2;color:#FFFFFF;font-size:16px;font-weight:600;text-decoration:none;padding:14px 36px;border-radius:8px;">Ver el artículo como quedará</a>
            <p style="margin:10px 0 0;font-size:12px;color:#9DB2B8;">Se abre una versión privada, idéntica a como se verá en konquerai.com</p>
          </td>
        </tr>
        <tr>
          <td style="padding:20px 28px 28px;" align="center">
            <table role="presentation" cellpadding="0" cellspacing="0"><tr>
              <td style="padding-right:10px;">
                <a href="${actionLink('approve')}" style="display:inline-block;background:#FFFFFF;color:#009B89;border:2px solid #00D1B2;font-size:15px;font-weight:600;text-decoration:none;padding:11px 26px;border-radius:8px;">Aprobar</a>
              </td>
              <td style="padding-left:10px;">
                <a href="${actionLink('hold')}" style="display:inline-block;background:#FFFFFF;color:#B45309;border:2px solid #FF8A00;font-size:15px;font-weight:600;text-decoration:none;padding:11px 26px;border-radius:8px;">Suspender</a>
              </td>
            </tr></table>
          </td>
        </tr>
        <tr>
          <td style="background:#F6F8F9;padding:16px 28px;border-top:1px solid #E5EAEC;">
            <p style="margin:0;font-size:12px;line-height:1.6;color:#4B5563;">Si no haces nada, el artículo se publicará igualmente mañana a las 9:00. Para pedir un cambio antes de que salga, pulsa Suspender y responde a este correo contando qué quieres cambiar.</p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;

writeFileSync('review-email.html', html);
console.log(`Email generado: review-email.html (${slug})`);
ghOutput({ subject: `Para revisar: "${title}" — se publica mañana a las 9:00` });
