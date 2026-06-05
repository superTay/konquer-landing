// Lógica del widget "Tu consultor de Obra". Vanilla TS, sin frameworks.
// Se inicializa solo al importarse desde Chatbot.astro.
import brand from './config/brand.json';
import flow from './config/chat-flow.json';
import reportCopy from './config/report-copy.json';
import { computeSavings, perdidoEsteAnio, eur, type Savings } from './savings';

type Role = 'user' | 'assistant';
type Msg = { role: Role; content: string };
type Collected = {
  nombre?: string; oficio?: string; equipo?: string; herramientas?: string;
  canal_clientes?: string; tarea_tiempo?: string; dolor_principal?: string;
  email?: string; h_admin_semana?: number | null; coste_hora?: number | null;
  done?: boolean;
};

const reduceMotion = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const isMobile = () => window.matchMedia('(max-width: 640px)').matches;

const GREETING =
  'Hola. Soy tu consultor de obra. En un par de minutos te enseño, con tus números, lo que te está costando el papeleo. ' +
  flow.preguntas[0].pregunta;

function initChatbot() {
  const root = document.getElementById('konker-chat');
  if (!root) return;

  const bubble = root.querySelector<HTMLButtonElement>('#kc-bubble')!;
  const panel = root.querySelector<HTMLDivElement>('#kc-panel')!;
  const closeBtn = root.querySelector<HTMLButtonElement>('#kc-close')!;
  const messagesEl = root.querySelector<HTMLDivElement>('#kc-messages')!;
  const form = root.querySelector<HTMLFormElement>('#kc-form')!;
  const textField = root.querySelector<HTMLInputElement>('#kc-text')!;
  const sendBtn = root.querySelector<HTMLButtonElement>('#kc-send')!;
  const micBtn = root.querySelector<HTMLButtonElement>('#kc-mic')!;
  const counterEl = root.querySelector<HTMLDivElement>('#kc-counter')!;
  const counterValue = root.querySelector<HTMLElement>('#kc-counter-value')!;

  const messages: Msg[] = [];
  const collected: Collected = {};
  let started = false;
  let sending = false;
  let counterShown = false;
  let finalized = false;

  // ---------- UI helpers ----------
  function scrollToBottom() {
    messagesEl.scrollTo({ top: messagesEl.scrollHeight, behavior: reduceMotion() ? 'auto' : 'smooth' });
  }

  function addBubble(role: Role, text: string): HTMLElement {
    const wrap = document.createElement('div');
    wrap.className = `kc-msg kc-msg-${role}`;
    const b = document.createElement('div');
    b.className = 'kc-bubble-text';
    b.textContent = text;
    wrap.appendChild(b);
    messagesEl.appendChild(wrap);
    scrollToBottom();
    return wrap;
  }

  function showTyping(): HTMLElement {
    const wrap = document.createElement('div');
    wrap.className = 'kc-msg kc-msg-assistant kc-typing';
    wrap.setAttribute('aria-label', 'Escribiendo');
    wrap.innerHTML = '<div class="kc-bubble-text"><span class="kc-dot"></span><span class="kc-dot"></span><span class="kc-dot"></span></div>';
    messagesEl.appendChild(wrap);
    scrollToBottom();
    return wrap;
  }

  function setSending(on: boolean) {
    sending = on;
    sendBtn.disabled = on;
    micBtn.disabled = on;
    textField.disabled = on;
  }

  // ---------- Data tag ----------
  function extractData(reply: string): { clean: string; data: Collected | null } {
    const m = reply.match(/\[\[DATA:(\{[\s\S]*?\})\]\]/);
    let data: Collected | null = null;
    if (m) {
      try { data = JSON.parse(m[1]); } catch { data = null; }
    }
    const clean = reply.replace(/\[\[DATA:[\s\S]*?\]\]/g, '').trim();
    return { clean, data };
  }

  function mergeCollected(data: Collected | null) {
    if (!data) return;
    for (const [k, v] of Object.entries(data)) {
      if (v === '' || v === null || v === undefined) continue;
      (collected as Record<string, unknown>)[k] = v;
    }
  }

  // ---------- Live savings counter ----------
  function maybeShowCounter() {
    const h = num(collected.h_admin_semana);
    const c = num(collected.coste_hora);
    if (h == null || c == null) return;
    const s = computeSavings({ h_admin_semana: h, coste_hora: c, oficio: collected.oficio });
    const target = perdidoEsteAnio(s);
    if (!counterShown) {
      counterEl.hidden = false;
      counterShown = true;
    }
    animateCounter(target);
  }

  function animateCounter(target: number) {
    if (reduceMotion()) { counterValue.textContent = eur(target); return; }
    const from = parseFloat(counterValue.dataset.raw || '0') || 0;
    const start = performance.now();
    const dur = 900;
    const step = (now: number) => {
      const p = Math.min((now - start) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      const val = Math.round(from + (target - from) * eased);
      counterValue.textContent = eur(val);
      if (p < 1) requestAnimationFrame(step);
      else counterValue.dataset.raw = String(target);
    };
    counterValue.dataset.raw = String(from);
    requestAnimationFrame(step);
  }

  // ---------- Network ----------
  async function callChat(): Promise<string> {
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'No he podido contestar ahora mismo. Inténtalo otra vez.');
    }
    const data = await res.json();
    return data.reply as string;
  }

  async function finalizeLead() {
    if (finalized) return;
    finalized = true;
    const s = computeSavings({
      h_admin_semana: num(collected.h_admin_semana),
      coste_hora: num(collected.coste_hora),
      oficio: collected.oficio,
    });
    try {
      await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...collected,
          ahorro_calculado: s.ahorroTiempoMes,
          mensajes: messages,
          ended_at: new Date().toISOString(),
        }),
      });
    } catch { /* el guardado no debe romper la experiencia */ }
    // Aviso a la Fase 4 (informe) para que renderice. Hasta entonces, no rompe nada.
    root.dispatchEvent(
      new CustomEvent('konker:report', { bubbles: true, detail: { collected, savings: s, messages } }),
    );
  }

  // ---------- Turn flow ----------
  async function botTurn() {
    if (sending) return;
    setSending(true);
    const typing = showTyping();
    try {
      const raw = await callChat();
      const { clean, data } = extractData(raw);
      typing.remove();
      addBubble('assistant', clean || '¿Seguimos?');
      messages.push({ role: 'assistant', content: clean });
      mergeCollected(data);
      maybeShowCounter();
      if (collected.done || (collected.email && /\S+@\S+\.\S+/.test(collected.email))) {
        await finalizeLead();
      }
    } catch (e) {
      typing.remove();
      addBubble('assistant', (e as Error).message);
    } finally {
      setSending(false);
      if (panelOpen()) textField.focus();
    }
  }

  function userTurn(text: string) {
    const t = text.trim();
    if (!t || sending) return;
    addBubble('user', t);
    messages.push({ role: 'user', content: t });
    textField.value = '';
    botTurn();
  }

  // ---------- Open / close ----------
  function panelOpen() { return root.dataset.state === 'open'; }

  function openPanel() {
    root.dataset.state = 'open';
    panel.hidden = false;
    bubble.setAttribute('aria-expanded', 'true');
    if (isMobile()) document.body.style.overflow = 'hidden';
    if (!started) {
      started = true;
      addBubble('assistant', GREETING);
      messages.push({ role: 'assistant', content: flow.preguntas[0].pregunta });
    }
    requestAnimationFrame(() => textField.focus());
  }

  function closePanel() {
    root.dataset.state = 'closed';
    panel.hidden = true;
    bubble.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
    bubble.focus();
  }

  // ---------- Voice (Groq Whisper via /api/transcribe) ----------
  let mediaRecorder: MediaRecorder | null = null;
  let chunks: BlobPart[] = [];
  let recording = false;

  async function toggleRecording() {
    if (recording) { stopRecording(); return; }
    if (!navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === 'undefined') {
      addBubble('assistant', 'Tu navegador no deja grabar audio aquí. Escríbelo y seguimos.');
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      chunks = [];
      mediaRecorder = new MediaRecorder(stream);
      mediaRecorder.ondataavailable = (e) => { if (e.data.size) chunks.push(e.data); };
      mediaRecorder.onstop = async () => {
        stream.getTracks().forEach((t) => t.stop());
        await transcribe(new Blob(chunks, { type: mediaRecorder?.mimeType || 'audio/webm' }));
      };
      mediaRecorder.start();
      recording = true;
      micBtn.classList.add('kc-mic-on');
      micBtn.setAttribute('aria-label', 'Parar de grabar');
    } catch {
      addBubble('assistant', 'No he podido encender el micro. Revisa el permiso o escríbelo.');
    }
  }

  function stopRecording() {
    recording = false;
    micBtn.classList.remove('kc-mic-on');
    micBtn.setAttribute('aria-label', 'Hablar por voz');
    mediaRecorder?.stop();
  }

  async function transcribe(blob: Blob) {
    const fd = new FormData();
    fd.append('audio', blob, 'audio.webm');
    const prev = textField.placeholder;
    textField.placeholder = 'Transcribiendo...';
    setSending(true);
    try {
      const res = await fetch('/api/transcribe', { method: 'POST', body: fd });
      const data = await res.json();
      if (!res.ok || !data.text) throw new Error(data.error || 'No te he pillado bien. Prueba a escribirlo.');
      textField.value = data.text;
    } catch (e) {
      addBubble('assistant', (e as Error).message);
    } finally {
      setSending(false);
      textField.placeholder = prev;
      textField.focus();
    }
  }

  // ---------- Wiring ----------
  bubble.addEventListener('click', () => (panelOpen() ? closePanel() : openPanel()));
  closeBtn.addEventListener('click', closePanel);
  form.addEventListener('submit', (e) => { e.preventDefault(); userTurn(textField.value); });
  micBtn.addEventListener('click', toggleRecording);
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && panelOpen()) closePanel(); });

  // Etiqueta del contador desde el copy
  const cc = (reportCopy as any).contador_vivo;
  const label = root.querySelector<HTMLElement>('#kc-counter-label');
  if (label && cc) label.textContent = `${cc.prefijo} `;
}

function num(v: unknown): number | null {
  if (typeof v === 'number' && Number.isFinite(v)) return v;
  if (typeof v === 'string') {
    const n = parseFloat(v.replace(',', '.'));
    return Number.isFinite(n) ? n : null;
  }
  return null;
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initChatbot);
} else {
  initChatbot();
}
