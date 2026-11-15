#!/usr/bin/env node
// Agenda personal — interfaz de terminal.
// Uso interactivo:  npm start
// Uso directo:      node src/cli.js list | pending | add hoy "texto" [AAAA-MM-DD] | done 3 | deadline 3 AAAA-MM-DD | summary
import { createInterface } from 'node:readline/promises';
import { stdin, stdout, argv, exit } from 'node:process';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve } from 'node:path';
import { createTaskStore } from './tasks.js';
import { todayISO, tomorrowISO } from './dates.js';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const DB_PATH = process.env.AGENDA_DB || join(ROOT, 'agenda.db');
const OWNER = 'Frank';

const store = createTaskStore(DB_PATH);

const mark = (t) => (t.done ? '[x]' : '[ ]');
const pad2 = (n) => String(n).padStart(2, '0');

// Reto Nivel 2: cómo se muestra la urgencia de cada tarea.
function deadlineNote(t) {
  if (!t.deadline) return '';
  if (t.overdue) return `  · VENCIDA (límite ${t.deadline})`;
  if (t.dueToday) return `  · VENCE HOY (límite ${t.deadline})`;
  return `  · límite ${t.deadline}`;
}

function printList(label, date, tasks, { pendingOnly = false } = {}) {
  const hechas = tasks.filter((t) => t.done).length;
  const estado = pendingOnly
    ? `${tasks.length} pendientes`
    : `${hechas}/${tasks.length} hechas`;
  console.log(`\n  ${label.toUpperCase()} (${date}) — ${estado}`);
  if (tasks.length === 0) {
    console.log('    (sin tareas)');
    return;
  }
  for (const t of tasks) {
    console.log(`    ${mark(t)} ${pad2(t.id)}. ${t.title}${deadlineNote(t)}`);
  }
}

function printSummary() {
  const s = store.summary();
  console.log(
    `\n  Resumen: hoy quedan ${s.today.pending}/${s.today.total} pendientes · ` +
      `mañana quedan ${s.tomorrow.pending}/${s.tomorrow.total} pendientes`
  );
}

function printHeader() {
  console.log('\n' + '='.repeat(52));
  console.log(`  Agenda personal de ${OWNER}`);
  console.log(`  Hoy: ${todayISO()}   ·   Mañana: ${tomorrowISO()}`);
  console.log(`  Base de datos: ${DB_PATH}`);
  console.log('='.repeat(52));
}

const DAYS = { hoy: 'today', today: 'today', manana: 'tomorrow', mañana: 'tomorrow', tomorrow: 'tomorrow' };

function addTask(text, day, deadline = null) {
  const horizon = DAYS[day];
  if (!horizon) throw new Error('Indique el día: "hoy" o "mañana".');
  const task =
    horizon === 'today'
      ? store.addToday(text, deadline)
      : store.addTomorrow(text, deadline);
  const extra = task.deadline ? ` (límite ${task.deadline})` : '';
  console.log(
    `  + Agregada (#${task.id}) para ${horizon === 'today' ? 'hoy' : 'mañana'}: ${task.title}${extra}`
  );
  return task;
}

// --- Modo directo (no interactivo) -----------------------------------------
const [cmd, ...rest] = argv.slice(2);
if (cmd) {
  try {
    if (cmd === 'list') {
      printHeader();
      printList('Hoy', todayISO(), store.listToday());
      printList('Mañana', tomorrowISO(), store.listTomorrow());
      printSummary();
    } else if (cmd === 'add') {
      const args = rest.slice(1);
      let deadline = null;
      if (args.length > 0 && /^\d{4}-\d{2}-\d{2}$/.test(args[args.length - 1])) {
        deadline = args.pop();
      }
      addTask(args.join(' '), rest[0], deadline);
    } else if (cmd === 'deadline') {
      const value = rest[1] === '-' ? null : rest[1];
      const t = store.setDeadline(rest[0], value);
      console.log(`  #${t.id} ${t.title} → límite: ${t.deadline ?? 'sin fecha'}`);
    } else if (cmd === 'done') {
      const t = store.toggle(rest[0]);
      console.log(`  ${t.done ? 'Hecha' : 'Pendiente'}: #${t.id} ${t.title}`);
    } else if (cmd === 'summary') {
      printSummary();
    } else if (cmd === 'pending') {
      printHeader();
      printList('Solo pendientes de hoy', todayISO(), store.listPendingToday(), { pendingOnly: true });
      printList('Solo pendientes de mañana', tomorrowISO(), store.listPendingTomorrow(), { pendingOnly: true });
      printSummary();
    } else {
      console.error(`Comando desconocido: ${cmd}`);
      exit(1);
    }
  } catch (err) {
    console.error(`  Error: ${err.message}`);
    exit(1);
  }
  store.close();
  exit(0);
}

// --- Modo interactivo -------------------------------------------------------
const rl = createInterface({ input: stdin, output: stdout });

async function ask(question) {
  const answer = await rl.question(question);
  return answer.trim();
}

async function main() {
  printHeader();
  let running = true;

  while (running) {
    console.log(`
  1) Ver hoy
  2) Ver mañana
  3) Agregar tarea
  4) Marcar / desmarcar una tarea
  5) Resumen de pendientes
  6) Ver SOLO pendientes
  0) Salir`);

    const option = await ask('\n  Elija una opción: ');

    try {
      switch (option) {
        case '1':
          printList('Hoy', todayISO(), store.listToday());
          break;
        case '2':
          printList('Mañana', tomorrowISO(), store.listTomorrow());
          break;
        case '3': {
          const text = await ask('  ¿Qué tarea? ');
          const day = await ask('  ¿Para hoy o mañana? (hoy/mañana): ');
          const limit = await ask('  Fecha límite (AAAA-MM-DD, Enter para ninguna): ');
          addTask(text, day, limit || null);
          break;
        }
        case '4': {
          printList('Hoy', todayISO(), store.listToday());
          printList('Mañana', tomorrowISO(), store.listTomorrow());
          const id = await ask('\n  Número de la tarea a cambiar: ');
          const t = store.toggle(id);
          console.log(`  ${t.done ? 'Marcada como HECHA' : 'Devuelta a PENDIENTE'}: #${t.id} ${t.title}`);
          break;
        }
        case '5':
          printSummary();
          break;
        case '6':
          printList('Solo pendientes de hoy', todayISO(), store.listPendingToday(), { pendingOnly: true });
          printList('Solo pendientes de mañana', tomorrowISO(), store.listPendingTomorrow(), { pendingOnly: true });
          break;
        case '0':
        case '':
          running = false;
          break;
        default:
          console.log('  Opción no válida.');
      }
    } catch (err) {
      console.log(`  Error: ${err.message}`);
    }
  }

  console.log('\n  Hasta luego. Tus tareas quedaron guardadas en agenda.db.\n');
}

process.on('SIGINT', () => {
  console.log('\n  Saliendo… tus tareas están guardadas.');
  process.exit(0);
});

await main();
rl.close();
store.close();
