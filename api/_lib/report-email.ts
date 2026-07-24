// Construye el email del informe que se manda al usuario (Fallo 1).
// Solo genera strings (subject/html/text); el envío vía Resend vive en api/lead.ts.
// Voz de marca: español de obra, tuteo, sin emojis, sin tecnicismos, sin mencionar "IA".
import { eur, type Savings, type Oportunidad } from '../../src/components/Chatbot/savings';

export type ReportEmailInput = {
  nombre?: string | null;
  oficio?: string | null;
  equipo?: string | null;
  herramientas?: string | null;
  tarea_tiempo?: string | null;
  dolor_principal?: string | null;
  savings: Savings;
  oportunidad: Oportunidad;
  calLink?: string | null; // "usuario/evento" de Cal.com (opcional)
};

const TEAL = '#00D1B2';
const TEAL_DARK = '#009B89';
const ORANGE = '#FF8A00';
const INK = '#0B1F24';
const SLATE = '#4B5563';
const MIST = '#F6F8F9';
const BORDER = '#E5EAEC';

function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, (c) => (
    { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c] as string
  ));
}

function low(s: string): string {
  return s.charAt(0).toLowerCase() + s.slice(1);
}

// Espejo corto de lo que nos ha contado (máximo 3 líneas), como en el informe en pantalla.
function situacionBullets(i: ReportEmailInput): string[] {
  const b: string[] = [];
  if (i.equipo) b.push(`Trabajas ${low(i.equipo)}.`);
  if (i.herramientas) b.push(`Ahora te apañas con ${low(i.herramientas)}.`);
  if (i.tarea_tiempo) b.push(`El tiempo fuera de obra se te va en ${low(i.tarea_tiempo)}.`);
  if (i.dolor_principal) b.push(`Lo que más te quema: ${low(i.dolor_principal)}.`);
  return b.slice(0, 3);
}

export function buildReportEmail(input: ReportEmailInput): { subject: string; html: string; text: string } {
  const s = input.savings;
  const opp = input.oportunidad;
  const nombre = (input.nombre || '').trim();
  const oficio = (input.oficio || '').trim();
  const saludo = nombre ? `Hola, ${escapeHtml(nombre)}` : 'Hola';

  const subject = nombre
    ? `${nombre}, aquí tienes tu informe: lo que te cuesta el papeleo`
    : 'Tu informe: lo que te cuesta el papeleo';

  const bullets = situacionBullets(input);
  const calUrl = input.calLink ? `https://cal.com/${input.calLink}` : '';

  const notaEstimado = s.usados.estimado
    ? `<p style="margin:8px 0 0;font-size:13px;color:${ORANGE};">Algún dato lo hemos puesto de media de tu sector. En la web puedes ajustarlo y ver tu número exacto.</p>`
    : '';

  // Card de una cifra grande
  const numCard = (val: string, label: string, color: string, bg: string) => `
    <td style="padding:6px;" width="50%" valign="top">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${bg};border-radius:12px;">
        <tr><td style="padding:16px;text-align:center;">
          <div style="font-size:26px;font-weight:800;color:${color};line-height:1.1;">${val}</div>
          <div style="font-size:13px;color:${SLATE};margin-top:4px;">${label}</div>
        </td></tr>
      </table>
    </td>`;

  const pilar = (t: string) => `
    <tr><td style="padding:6px 0;font-size:15px;color:${INK};line-height:1.5;">• ${t}</td></tr>`;

  const html = `<!doctype html>
<html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${escapeHtml(subject)}</title></head>
<body style="margin:0;padding:0;background:${MIST};font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;color:${INK};">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${MIST};padding:20px 0;">
    <tr><td align="center">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#fff;border-radius:16px;overflow:hidden;border:1px solid ${BORDER};">

        <tr><td style="background:linear-gradient(135deg,${TEAL},${TEAL_DARK});padding:22px 24px;">
          <div style="color:#fff;font-size:18px;font-weight:800;">Tu informe — KonquerAI</div>
          <div style="color:#eafffb;font-size:13px;margin-top:2px;">De LucIA, tu consultora de obra</div>
        </td></tr>

        <tr><td style="padding:24px 24px 8px;">
          <p style="margin:0 0 12px;font-size:16px;line-height:1.5;">${saludo}. Aquí tienes, con tus números, lo que te cuesta el papeleo y lo que podrías ganar${oficio ? ` en ${escapeHtml(oficio)}` : ''}.</p>
          ${bullets.length ? `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${MIST};border-radius:12px;margin:8px 0 4px;"><tr><td style="padding:12px 16px;font-size:14px;color:${SLATE};line-height:1.6;">${bullets.map(escapeHtml).join('<br>')}</td></tr></table>` : ''}
        </td></tr>

        <tr><td style="padding:8px 18px 0;">
          <div style="font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:.04em;color:${SLATE};padding:0 6px 6px;">Lo que te devuelve</div>
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>
            ${numCard(`${s.horasRecuperadas} h`, 'al mes que recuperas', TEAL_DARK, '#E6FAF6')}
            ${numCard(eur(s.ahorroTiempoMes), 'al mes en tu tiempo', ORANGE, '#FFF3E0')}
          </tr></table>
          ${notaEstimado}
        </td></tr>

        <tr><td style="padding:14px 18px 0;">
          <div style="font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:.04em;color:${SLATE};padding:0 6px 6px;">Lo que podrías facturar de más</div>
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>
            ${numCard(eur(opp.extraMes), 'al mes', TEAL_DARK, '#E6FAF6')}
            ${numCard(eur(opp.extraAnio), 'al año', ORANGE, '#FFF3E0')}
          </tr></table>
        </td></tr>

        <tr><td style="padding:14px 18px 0;">
          <div style="font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:.04em;color:${SLATE};padding:0 6px 6px;">En 3 años</div>
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>
            ${numCard(`${s.proyeccion3yHoras} h`, 'de tu tiempo', TEAL_DARK, '#E6FAF6')}
            ${numCard(eur(s.proyeccion3yEur), 'en dinero', ORANGE, '#FFF3E0')}
          </tr></table>
        </td></tr>

        <tr><td style="padding:20px 24px 4px;">
          <div style="font-size:16px;font-weight:800;color:${INK};margin-bottom:6px;">Qué hace KonquerAI por ti</div>
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
            ${pilar('Le hablas al móvil y te monta el presupuesto y la factura, listos para Verifactu. Antes, media hora un domingo.')}
            ${pilar('Sabes obra a obra si ganas o pierdes. Ni la hoja de cálculo ni la gestoría te dicen eso.')}
            ${pilar('Las facturas que te llegan se ordenan solas y el IVA queda cuadrado para tu gestoría.')}
          </table>
        </td></tr>

        ${calUrl ? `<tr><td style="padding:18px 24px 8px;" align="center">
          <a href="${escapeHtml(calUrl)}" style="display:inline-block;background:${TEAL_DARK};color:#fff;text-decoration:none;font-weight:700;font-size:16px;padding:14px 26px;border-radius:9999px;">Agendar una llamada de 15 minutos</a>
        </td></tr>` : ''}

        <tr><td style="padding:16px 24px 24px;">
          <p style="margin:0 0 6px;font-size:14px;color:${INK};font-weight:700;">Lleva tu negocio en serio sin volverte loco con tecnología.</p>
          <p style="margin:0;font-size:12px;color:${SLATE};line-height:1.5;">Las cifras son estimaciones honestas con rangos de tu sector, no promesas exactas. Si quieres, lo vemos juntos en la llamada.</p>
          <p style="margin:10px 0 0;font-size:12px;color:${SLATE};">KonquerAI · <a href="https://konquerai.com" style="color:${TEAL_DARK};">konquerai.com</a> · Hecho en España, para autónomos de reformas.</p>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body></html>`;

  const text = [
    `${saludo}. Aquí tienes tu informe con tus números.`,
    ``,
    `LO QUE TE DEVUELVE:`,
    `- ${s.horasRecuperadas} h al mes que recuperas`,
    `- ${eur(s.ahorroTiempoMes)} al mes en tu tiempo`,
    ``,
    `LO QUE PODRÍAS FACTURAR DE MÁS:`,
    `- ${eur(opp.extraMes)} al mes · ${eur(opp.extraAnio)} al año`,
    ``,
    `EN 3 AÑOS: ${s.proyeccion3yHoras} h · ${eur(s.proyeccion3yEur)}`,
    ``,
    `Qué hace KonquerAI por ti:`,
    `- Presupuestos y facturas hablando, listos para Verifactu.`,
    `- Sabes obra a obra si ganas o pierdes.`,
    `- Las facturas se ordenan solas y el IVA cuadrado.`,
    calUrl ? `\nAgendar una llamada: ${calUrl}` : '',
    ``,
    `Las cifras son estimaciones honestas con rangos de tu sector.`,
    `KonquerAI · konquerai.com`,
  ].join('\n');

  return { subject, html, text };
}
