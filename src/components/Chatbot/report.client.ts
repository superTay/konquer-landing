// Informe de consultoría. Escucha el evento "konker:report" que emite el widget
// al terminar la conversación, y renderiza el informe en un overlay a pantalla completa.
import reportCopy from './config/report-copy.json';
import savingsCfg from './config/savings-config.json';
import { computeSavings, eur, type Savings } from './savings';

const RC = reportCopy as any;
const SC = savingsCfg as any;
const CAL_LINK = (import.meta.env.PUBLIC_CALCOM_URL as string | undefined)?.trim();

type Collected = {
  nombre?: string; oficio?: string; equipo?: string; herramientas?: string;
  canal_clientes?: string; tarea_tiempo?: string; dolor_principal?: string;
  email?: string; h_admin_semana?: number | null; coste_hora?: number | null;
};

function initReport() {
  const overlay = document.getElementById('konker-report');
  if (!overlay) return;

  const $ = <T extends HTMLElement = HTMLElement>(id: string) => overlay.querySelector<T>('#' + id)!;
  const title = $('kr-title');
  const subtitle = $('kr-subtitle');
  const situacion = $<HTMLUListElement>('kr-situacion');
  const horasEl = $('kr-horas');
  const dineroEl = $('kr-dinero');
  const quickwins = $<HTMLTableSectionElement>('kr-quickwins');
  const inCoste = $<HTMLInputElement>('kr-in-coste');
  const inHoras = $<HTMLInputElement>('kr-in-horas');
  const calcResult = $('kr-calc-result');
  const proyHoras = $('kr-proy-horas');
  const proyDinero = $('kr-proy-dinero');
  const estimadoNote = $('kr-estimado');
  const calMount = $('kr-cal');
  const calLinkA = $<HTMLAnchorElement>('kr-cal-link');
  const pdfBtn = $<HTMLButtonElement>('kr-pdf');
  const closeBtns = overlay.querySelectorAll<HTMLButtonElement>('.kr-close');

  let collected: Collected = {};
  let calLoaded = false;

  // ---------- Apertura ----------
  document.addEventListener('konker:report', (e: Event) => {
    const detail = (e as CustomEvent).detail || {};
    collected = detail.collected || {};
    render();
    open();
  });

  function open() {
    overlay.hidden = false;
    document.body.style.overflow = 'hidden';
    const chat = document.getElementById('konker-chat');
    if (chat) chat.style.display = 'none'; // ocultamos la burbuja/panel mientras se ve el informe
    overlay.scrollTop = 0;
    loadCal();
    closeBtns[0]?.focus();
  }

  function close() {
    overlay.hidden = true;
    document.body.style.overflow = '';
    const chat = document.getElementById('konker-chat');
    if (chat) chat.style.display = '';
  }

  // ---------- Render ----------
  function render() {
    const nombre = collected.nombre || 'ti';
    const oficio = (collected.oficio || '').trim();
    title.textContent = (RC.cabecera.titulo as string)
      .replace('{nombre}', nombre)
      .replace('{oficio}', oficio || 'tu negocio')
      .replace(' — tu negocio', oficio ? ` — ${oficio}` : '');
    if (!oficio) title.textContent = `Informe para ${nombre}`;
    subtitle.textContent = RC.cabecera.subtitulo;

    // Situación hoy (espejo)
    situacion.innerHTML = '';
    for (const linea of situacionBullets()) addLi(situacion, linea);

    // Inputs de la calculadora con sus números (o estimaciones del sector)
    const s0 = compute();
    inCoste.value = String(s0.usados.coste_hora);
    inHoras.value = String(s0.usados.h_admin_semana);

    // Quick wins
    quickwins.innerHTML = '';
    for (const qw of pickQuickWins()) {
      const tr = document.createElement('tr');
      tr.innerHTML = `<td>${escapeHtml(qw.problema)}</td><td>${escapeHtml(qw.solucion)}</td>`;
      quickwins.appendChild(tr);
    }

    // Antes/después (estáticos en el HTML, ya renderizados por Astro)
    updateNumbers(s0);
    calLinkA.textContent = 'Agendar la llamada';
    if (CAL_LINK) calLinkA.href = `https://cal.com/${CAL_LINK}`;
    else calLinkA.href = '#';
  }

  function updateNumbers(s: Savings) {
    horasEl.textContent = `${s.horasRecuperadas}`;
    dineroEl.textContent = eur(s.ahorroTiempoMes);
    proyHoras.textContent = `${s.proyeccion3yHoras}`;
    proyDinero.textContent = eur(s.proyeccion3yEur);
    calcResult.textContent = eur(s.ahorroTiempoMes);
    estimadoNote.hidden = !s.usados.estimado;
  }

  function compute(): Savings {
    return computeSavings({
      h_admin_semana: numFromInput(inHoras) ?? collected.h_admin_semana,
      coste_hora: numFromInput(inCoste) ?? collected.coste_hora,
      oficio: collected.oficio,
    });
  }

  // ---------- Calculadora interactiva ----------
  function onCalcInput() {
    updateNumbers(compute());
  }
  inCoste.addEventListener('input', onCalcInput);
  inHoras.addEventListener('input', onCalcInput);

  // ---------- Cal.com embed (carga perezosa) ----------
  function loadCal() {
    if (calLoaded || !CAL_LINK) return;
    calLoaded = true;
    // Snippet oficial de Cal.com (embed inline)
    (function (C: any, A: string, L: string) {
      const p = function (a: any, ar: any) { a.q.push(ar); };
      const d = C.document;
      C.Cal = C.Cal || function () {
        const cal = C.Cal; const ar = arguments;
        if (!cal.loaded) { cal.ns = {}; cal.q = cal.q || []; d.head.appendChild(d.createElement('script')).src = A; cal.loaded = true; }
        if (ar[0] === L) { const api: any = function () { p(api, arguments); }; const namespace = ar[1]; api.q = api.q || []; if (typeof namespace === 'string') { cal.ns[namespace] = cal.ns[namespace] || api; p(cal.ns[namespace], ar); p(cal, ['initNamespace', namespace]); } else p(cal, ar); return; }
        p(cal, ar);
      };
    })(window, 'https://app.cal.com/embed/embed.js', 'init');
    const Cal = (window as any).Cal;
    Cal('init', { origin: 'https://cal.com' });
    Cal('inline', { elementOrSelector: calMount, calLink: CAL_LINK });
    Cal('ui', { hideEventTypeDetails: false, layout: 'month_view' });
  }

  // ---------- PDF (impresión nativa, sin dependencias) ----------
  pdfBtn.addEventListener('click', () => {
    document.body.classList.add('kc-printing');
    const after = () => { document.body.classList.remove('kc-printing'); window.removeEventListener('afterprint', after); };
    window.addEventListener('afterprint', after);
    window.print();
    setTimeout(after, 1500); // por si afterprint no dispara
  });

  // ---------- Cierre ----------
  closeBtns.forEach((b) => b.addEventListener('click', close));
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !overlay.hidden) close(); });

  // ---------- Helpers de contenido ----------
  function situacionBullets(): string[] {
    const b: string[] = [];
    const c = collected;
    if (c.equipo) b.push(`Trabajas ${low(c.equipo)}.`);
    if (c.herramientas) b.push(`Ahora te apañas con ${low(c.herramientas)}.`);
    if (c.tarea_tiempo) b.push(`El tiempo fuera de obra se te va en ${low(c.tarea_tiempo)}.`);
    if (c.dolor_principal) b.push(`Lo que más te quema: ${low(c.dolor_principal)}.`);
    return b.slice(0, 3).length ? b.slice(0, 3) : ['Llevas el negocio a pulso, con más papeleo del que te gustaría.'];
  }

  function pickQuickWins() {
    const cat = RC.quick_wins_catalogo as Record<string, { problema: string; solucion: string; pilar: string }>;
    const order: string[] = [];
    const add = (k: string | null) => { if (k && cat[k] && !order.includes(k)) order.push(k); };
    const detect = (t?: string | null): string | null => {
      const x = (t || '').toLowerCase();
      if (/presupuest/.test(x)) return 'presupuestos';
      if (/cobr|moroso|pagar tarde|deuda/.test(x)) return 'cobros';
      if (/iva|hacienda|impuesto|trimestre|gestor/.test(x)) return 'iva_hacienda';
      if (/gan|pierd|margen|rentab|obra/.test(x)) return 'rentabilidad';
      if (/factura|papel|ticket|archiv/.test(x)) return 'facturas_papeleo';
      return null;
    };
    // 1) El dolor #1 manda: va primero.
    add(detect(collected.dolor_principal));
    // 2) Luego lo que mencionó en otras respuestas.
    add(detect(collected.tarea_tiempo));
    add(detect(collected.herramientas));
    // 3) Rellenar hasta 4 con el resto en orden natural.
    ['presupuestos', 'facturas_papeleo', 'cobros', 'iva_hacienda', 'rentabilidad'].forEach(add);
    return order.slice(0, 4).map((k) => cat[k]);
  }

  function addLi(ul: HTMLUListElement, text: string) {
    const li = document.createElement('li');
    li.textContent = text;
    ul.appendChild(li);
  }
}

function numFromInput(el: HTMLInputElement): number | null {
  const n = parseFloat(el.value.replace(',', '.'));
  return Number.isFinite(n) && n > 0 ? n : null;
}
function low(s: string) { return s.charAt(0).toLowerCase() + s.slice(1); }
function escapeHtml(s: string) {
  return s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]!));
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initReport);
} else {
  initReport();
}
