// Fechas locales en formato ISO (YYYY-MM-DD) sin desfase por zona horaria.
export function isoLocal(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function todayISO(now = new Date()) {
  return isoLocal(now);
}

export function tomorrowISO(now = new Date()) {
  const d = new Date(now.getTime());
  d.setDate(d.getDate() + 1);
  return isoLocal(d);
}

export function dayLabel(iso) {
  return iso === todayISO() ? 'hoy' : iso === tomorrowISO() ? 'mañana' : iso;
}
