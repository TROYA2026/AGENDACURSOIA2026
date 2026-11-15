import { DatabaseSync } from 'node:sqlite';
import { mkdirSync } from 'node:fs';
import { dirname } from 'node:path';

// Abre (o crea) la base SQLite y garantiza el esquema.
export function openDb(file) {
  if (file !== ':memory:') mkdirSync(dirname(file), { recursive: true });

  const db = new DatabaseSync(file);
  db.exec(`
    CREATE TABLE IF NOT EXISTS tasks (
      id         INTEGER PRIMARY KEY AUTOINCREMENT,
      title      TEXT    NOT NULL,
      due_date   TEXT    NOT NULL,
      deadline   TEXT,
      done       INTEGER NOT NULL DEFAULT 0,
      created_at TEXT    NOT NULL
    );
    CREATE INDEX IF NOT EXISTS idx_tasks_due ON tasks(due_date);
  `);

  // Migración: bases creadas antes del Reto Nivel 2 no tienen la columna deadline.
  const columns = db.prepare('PRAGMA table_info(tasks)').all();
  if (!columns.some((c) => c.name === 'deadline')) {
    db.exec('ALTER TABLE tasks ADD COLUMN deadline TEXT');
  }
  db.exec('CREATE INDEX IF NOT EXISTS idx_tasks_deadline ON tasks(deadline)');

  return db;
}
