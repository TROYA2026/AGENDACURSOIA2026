import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { DatabaseSync } from 'node:sqlite';
import { createTaskStore } from '../src/tasks.js';
import { todayISO, tomorrowISO } from '../src/dates.js';

// CA-1 y CA-2: cada tarea cae en el grupo correcto.
test('agrega y lista tareas de hoy y de mañana por separado', () => {
  const store = createTaskStore(':memory:');
  store.addToday('enviar informe');
  store.addTomorrow('revisar cotización');

  const today = store.listToday();
  const tomorrow = store.listTomorrow();

  assert.equal(today.length, 1);
  assert.equal(today[0].title, 'enviar informe');
  assert.equal(today[0].done, false);
  assert.equal(today[0].due_date, todayISO());

  assert.equal(tomorrow.length, 1);
  assert.equal(tomorrow[0].title, 'revisar cotización');
  assert.equal(tomorrow[0].due_date, tomorrowISO());

  store.close();
});

// CA-5: validaciones.
test('rechaza títulos vacíos o en blanco', () => {
  const store = createTaskStore(':memory:');
  assert.throws(() => store.addToday(''), /vacío/);
  assert.throws(() => store.addToday('   '), /vacío/);
  assert.throws(() => store.add('x', '14/11/2026'), /YYYY-MM-DD/);
  assert.equal(store.listToday().length, 0);
  store.close();
});

// CA-3: marcar/desmarcar.
test('marca una tarea como hecha y la puede desmarcar', () => {
  const store = createTaskStore(':memory:');
  const task = store.addToday('llamar al cliente');

  const done = store.toggle(task.id);
  assert.equal(done.done, true);
  assert.equal(store.listToday()[0].done, true);

  const undone = store.toggle(task.id);
  assert.equal(undone.done, false);
  store.close();
});

test('toggle de un id inexistente falla con mensaje claro', () => {
  const store = createTaskStore(':memory:');
  assert.throws(() => store.toggle(9999), /No existe/);
  store.close();
});

// CA-4 y CA-6: persistencia real en disco.
test('el estado sobrevive al cerrar y reabrir la base', () => {
  const dir = mkdtempSync(join(tmpdir(), 'agenda-'));
  const file = join(dir, 'agenda.db');

  const first = createTaskStore(file);
  const task = first.addToday('revisar cotización', '2026-12-01');
  first.toggle(task.id);
  first.close();

  const second = createTaskStore(file);
  const [reloaded] = second.listToday();
  assert.equal(reloaded.title, 'revisar cotización');
  assert.equal(reloaded.done, true);
  assert.equal(reloaded.deadline, '2026-12-01');
  second.close();

  rmSync(dir, { recursive: true, force: true });
});

// Reto Nivel 1: la vista de pendientes excluye las tareas hechas.
test('la vista de solo pendientes oculta las tareas hechas', () => {
  const store = createTaskStore(':memory:');
  const a = store.addToday('hecha');
  store.addToday('pendiente');
  store.addTomorrow('meta pendiente');
  store.toggle(a.id);

  const pendingToday = store.listPendingToday();
  assert.equal(pendingToday.length, 1);
  assert.equal(pendingToday[0].title, 'pendiente');

  const pendingTomorrow = store.listPendingTomorrow();
  assert.equal(pendingTomorrow.length, 1);
  assert.equal(pendingTomorrow[0].title, 'meta pendiente');

  // La vista completa sigue mostrando todo.
  assert.equal(store.listToday().length, 2);
  store.close();
});

// Reto Nivel 2: fecha límite y orden por urgencia.
test('ordena por fecha límite y deja al final las tareas sin fecha', () => {
  const store = createTaskStore(':memory:');
  store.addToday('sin fecha');
  store.addToday('esta semana', '2026-11-20');
  store.addToday('urgente', '2026-11-16');
  store.addToday('lo antes posible', '2026-11-14');

  const titles = store.listToday().map((t) => t.title);
  assert.deepEqual(titles, ['lo antes posible', 'urgente', 'esta semana', 'sin fecha']);
  assert.equal(store.listToday()[3].deadline, null);
  store.close();
});

test('señala tareas vencidas o que vencen hoy', () => {
  const store = createTaskStore(':memory:');
  const vencida = store.addToday('atrasada', '2020-01-01');
  const hoy = store.addToday('para hoy', todayISO());
  const futura = store.addToday('futura', '2099-01-01');

  assert.equal(vencida.overdue, true);
  assert.equal(hoy.dueToday, true);
  assert.equal(hoy.overdue, false);
  assert.equal(futura.overdue, false);
  assert.equal(futura.dueToday, false);
  store.close();
});

test('valida la fecha límite y permite cambiarla o quitarla', () => {
  const store = createTaskStore(':memory:');
  assert.throws(() => store.addToday('x', '16/11/2026'), /YYYY-MM-DD/);
  assert.throws(() => store.addToday('x', '2026-02-30'), /válida/);

  const task = store.addToday('con límite', '2026-12-01');
  assert.equal(task.deadline, '2026-12-01');

  const moved = store.setDeadline(task.id, '2026-11-30');
  assert.equal(moved.deadline, '2026-11-30');

  const cleared = store.setDeadline(task.id, null);
  assert.equal(cleared.deadline, null);
  assert.equal(store.listToday()[0].deadline, null);
  store.close();
});

test('actualiza bases creadas antes de existir la columna deadline', () => {
  const dir = mkdtempSync(join(tmpdir(), 'agenda-legacy-'));
  const file = join(dir, 'agenda.db');

  const legacy = new DatabaseSync(file);
  legacy.exec(`
    CREATE TABLE tasks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      due_date TEXT NOT NULL,
      done INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL
    );
  `);
  legacy
    .prepare('INSERT INTO tasks (title, due_date, done, created_at) VALUES (?,?,?,?)')
    .run('tarea antigua', todayISO(), 0, new Date().toISOString());
  legacy.close();

  const store = createTaskStore(file);
  const [old] = store.listToday();
  assert.equal(old.title, 'tarea antigua');
  assert.equal(old.deadline, null);

  const fresh = store.addToday('nueva con límite', '2026-12-24');
  assert.equal(fresh.deadline, '2026-12-24');
  store.close();

  rmSync(dir, { recursive: true, force: true });
});

// Reto Nivel 3: resumen de pendientes.
test('el resumen cuenta pendientes de hoy y mañana', () => {
  const store = createTaskStore(':memory:');
  const a = store.addToday('uno');
  store.addToday('dos');
  store.addTomorrow('tres');
  store.toggle(a.id);

  const s = store.summary();
  assert.deepEqual(s.today, { pending: 1, total: 2 });
  assert.deepEqual(s.tomorrow, { pending: 1, total: 1 });
  store.close();
});
