import { openDb } from './db.js';
import { todayISO, tomorrowISO } from './dates.js';

// Fecha ISO válida (YYYY-MM-DD) o null si viene vacía.
function parseIsoDate(value, label) {
  if (value === null || value === undefined || value === '') return null;
  const text = String(value).trim();

  if (!/^\d{4}-\d{2}-\d{2}$/.test(text)) {
    throw new Error(`La ${label} debe tener el formato YYYY-MM-DD.`);
  }

  const [y, m, d] = text.split('-').map(Number);
  const probe = new Date(Date.UTC(y, m - 1, d));
  if (
    probe.getUTCFullYear() !== y ||
    probe.getUTCMonth() !== m - 1 ||
    probe.getUTCDate() !== d
  ) {
    throw new Error(`La ${label} no es una fecha válida.`);
  }

  return text;
}

// Convierte una fila de SQLite en una tarea con campos derivados de urgencia.
function toTask(row) {
  if (!row) return null;
  const today = todayISO();
  const deadline = row.deadline ?? null;

  return {
    ...row,
    done: row.done === 1,
    deadline,
    // Reto Nivel 2: señales de urgencia listas para CLI y web.
    overdue: deadline ? deadline < today : false,
    dueToday: deadline === today,
  };
}

// Repositorio de tareas: toda la lógica de negocio vive aquí,
// de modo que CLI, web y pruebas comparten exactamente las mismas reglas.
export function createTaskStore(dbPath) {
  const db = openDb(dbPath);

  // Orden por urgencia: primero lo que tiene fecha límite más próxima;
  // las tareas sin fecha límite van al final.
  const ORDER_URGENCY = 'ORDER BY (deadline IS NULL) ASC, deadline ASC, id ASC';

  const stmt = {
    insert: db.prepare(
      `INSERT INTO tasks (title, due_date, deadline, created_at)
       VALUES (?, ?, ?, ?)`
    ),
    byId: db.prepare('SELECT * FROM tasks WHERE id = ?'),
    byDate: db.prepare(
      `SELECT * FROM tasks WHERE due_date = ?
       ORDER BY done ASC, (deadline IS NULL) ASC, deadline ASC, id ASC`
    ),
    byDatePending: db.prepare(
      `SELECT * FROM tasks WHERE due_date = ? AND done = 0 ${ORDER_URGENCY}`
    ),
    setDone: db.prepare('UPDATE tasks SET done = ? WHERE id = ?'),
    setDeadline: db.prepare('UPDATE tasks SET deadline = ? WHERE id = ?'),
    remove: db.prepare('DELETE FROM tasks WHERE id = ?'),
    counts: db.prepare(
      `SELECT due_date, SUM(done = 0) AS pending, COUNT(*) AS total
         FROM tasks WHERE due_date IN (?, ?) GROUP BY due_date`
    ),
  };

  function add(title, dueDate, deadline = null) {
    const clean = String(title ?? '').trim();
    if (!clean) throw new Error('El título de la tarea no puede estar vacío.');

    const day = parseIsoDate(dueDate, 'fecha');
    if (!day) throw new Error('La fecha de la tarea es obligatoria.');
    const limit = parseIsoDate(deadline, 'fecha límite');

    const info = stmt.insert.run(
      clean,
      day,
      limit,
      new Date().toISOString()
    );
    return toTask(stmt.byId.get(Number(info.lastInsertRowid)));
  }

  return {
    add,
    addToday(title, deadline = null) {
      return add(title, todayISO(), deadline);
    },
    addTomorrow(title, deadline = null) {
      return add(title, tomorrowISO(), deadline);
    },
    list(date) {
      return stmt.byDate.all(date).map(toTask);
    },
    listToday() {
      return this.list(todayISO());
    },
    listTomorrow() {
      return this.list(tomorrowISO());
    },
    // Reto Nivel 1: vista que muestra solo lo pendiente.
    listPending(date) {
      return stmt.byDatePending.all(date).map(toTask);
    },
    listPendingToday() {
      return this.listPending(todayISO());
    },
    listPendingTomorrow() {
      return this.listPending(tomorrowISO());
    },
    get(id) {
      const n = Number(id);
      if (!Number.isInteger(n) || n <= 0) return null;
      return toTask(stmt.byId.get(n));
    },
    toggle(id) {
      const task = this.get(id);
      if (!task) throw new Error(`No existe la tarea con id ${id}.`);
      stmt.setDone.run(task.done ? 0 : 1, task.id);
      return this.get(task.id);
    },
    // Permite añadir o quitar (null) la fecha límite de una tarea existente.
    setDeadline(id, deadline) {
      const task = this.get(id);
      if (!task) throw new Error(`No existe la tarea con id ${id}.`);
      stmt.setDeadline.run(parseIsoDate(deadline, 'fecha límite'), task.id);
      return this.get(task.id);
    },
    remove(id) {
      const n = Number(id);
      if (!Number.isInteger(n) || n <= 0) return false;
      return stmt.remove.run(n).changes > 0;
    },
    summary() {
      const rows = stmt.counts.all(todayISO(), tomorrowISO());
      const pick = (date) =>
        rows.find((r) => r.due_date === date) ?? { pending: 0, total: 0 };
      const today = pick(todayISO());
      const tomorrow = pick(tomorrowISO());
      return {
        today: { pending: Number(today.pending), total: Number(today.total) },
        tomorrow: {
          pending: Number(tomorrow.pending),
          total: Number(tomorrow.total),
        },
      };
    },
    close() {
      db.close();
    },
  };
}
