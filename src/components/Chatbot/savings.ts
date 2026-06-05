// Cálculo HONESTO del ahorro. Única fuente: config/savings-config.json.
// Lo usan el contador en vivo (Fase 3) y la calculadora del informe (Fase 4).
import cfg from './config/savings-config.json';

export type SavingsInput = {
  h_admin_semana?: number | null;
  coste_hora?: number | null;
  oficio?: string | null;
};

export type Savings = {
  horasMes: number;
  horasRecuperadas: number;
  ahorroTiempoMes: number;
  ahorroNetoMes: number;
  proyeccion3yEur: number;
  proyeccion3yHoras: number;
  usados: { h_admin_semana: number; coste_hora: number; estimado: boolean };
};

const C = cfg.constantes;

function normalizaOficio(oficio?: string | null): string {
  if (!oficio) return 'default';
  const o = oficio
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '');
  if (o.includes('pint')) return 'pintor';
  if (o.includes('alban') || o.includes('albañ')) return 'albañil';
  if (o.includes('fontan')) return 'fontanero';
  if (o.includes('electr')) return 'electricista';
  if (o.includes('clima') || o.includes('aire')) return 'climatizacion';
  if (o.includes('reforma') || o.includes('integral')) return 'reformas_integrales';
  return 'default';
}

export function costeHoraSugerido(oficio?: string | null): number {
  const key = normalizaOficio(oficio);
  const rangos = cfg.rangos_sector.coste_hora_por_oficio as Record<string, { medio: number }>;
  return (rangos[key] ?? rangos.default).medio;
}

export function computeSavings(input: SavingsInput): Savings {
  let estimado = false;

  let h = input.h_admin_semana;
  if (h == null || !Number.isFinite(h) || h <= 0) {
    h = cfg.rangos_sector.h_admin_semana.medio;
    estimado = true;
  }

  let coste = input.coste_hora;
  if (coste == null || !Number.isFinite(coste) || coste <= 0) {
    coste = costeHoraSugerido(input.oficio);
    estimado = true;
  }

  const horasMes = h * C.semanas_por_mes;
  // Redondeamos las horas/mes primero y derivamos TODO de ahí: así el informe cuadra
  // (horas/mes × 36 = horas/3 años, €/mes × 36 = €/3 años). Nada de descuadres por redondeo.
  const horasRecuperadas = round1(Math.min(horasMes * C.pct_recuperable.default, C.cap_horas_mes));
  const costeR = Math.round(coste);
  const ahorroTiempoMes = Math.round(horasRecuperadas * costeR);
  const ahorroNetoMes = ahorroTiempoMes - C.coste_servicio_mes;
  const proyeccion3yHoras = round1(horasRecuperadas * 36);
  const proyeccion3yEur = ahorroTiempoMes * 36;

  return {
    horasMes: round1(horasMes),
    horasRecuperadas,
    ahorroTiempoMes,
    ahorroNetoMes,
    proyeccion3yEur,
    proyeccion3yHoras,
    usados: { h_admin_semana: round1(h), coste_hora: costeR, estimado },
  };
}

// Valor "perdido este año" para el contador en vivo (meses transcurridos del año).
export function perdidoEsteAnio(s: Savings, now: Date = new Date()): number {
  const mesesTranscurridos = now.getMonth() + now.getDate() / 30; // aprox honesto
  return Math.round(s.horasRecuperadas * mesesTranscurridos * s.usados.coste_hora);
}

export function eur(n: number): string {
  return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(n);
}

function round1(n: number): number {
  return Math.round(n * 10) / 10;
}
