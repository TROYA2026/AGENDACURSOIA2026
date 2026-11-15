#!/usr/bin/env node
// Agenda personal — interfaz web local (http://localhost:3000).
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve } from 'node:path';
import { createTaskStore } from './tasks.js';
import { todayISO, tomorrowISO } from './dates.js';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const DB_PATH = process.env.AGENDA_DB || join(ROOT, 'agenda.db');
const PREFERRED_PORT = Number(process.env.PORT) || 3000;

const store = createTaskStore(DB_PATH);

const json = (res, status, data) => {
  const body = JSON.stringify(data);
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
  });
  res.end(body);
};

async function readJson(req) {
  let raw = '';
  for await (const chunk of req) {
    raw += chunk;
    if (raw.length > 1_000_000) throw new Error('Cuerpo demasiado grande.');
  }
  return raw ? JSON.parse(raw) : {};
}

function snapshot() {
  return {
    owner: 'Frank',
    todayDate: todayISO(),
    tomorrowDate: tomorrowISO(),
    today: store.listToday(),
    tomorrow: store.listTomorrow(),
    summary: store.summary(),
  };
}

const server = createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host ?? 'localhost'}`);

  try {
    // API ---------------------------------------------------------------------
    if (url.pathname === '/api/tasks' && req.method === 'GET') {
      return json(res, 200, snapshot());
    }

    if (url.pathname === '/api/tasks' && req.method === 'POST') {
      const { title, day, deadline } = await readJson(req);
      const task =
        day === 'tomorrow'
          ? store.addTomorrow(title, deadline ?? null)
          : store.addToday(title, deadline ?? null);
      return json(res, 201, task);
    }

    const toggleMatch = url.pathname.match(/^\/api\/tasks\/(\d+)\/toggle$/);
    if (toggleMatch && (req.method === 'POST' || req.method === 'PATCH')) {
      return json(res, 200, store.toggle(toggleMatch[1]));
    }

    const deleteMatch = url.pathname.match(/^\/api\/tasks\/(\d+)$/);
    if (deleteMatch && req.method === 'DELETE') {
      const removed = store.remove(deleteMatch[1]);
      return json(res, removed ? 200 : 404, { removed });
    }

    // Interfaz ----------------------------------------------------------------
    if ((req.method === 'GET' || req.method === 'HEAD') &&
        (url.pathname === '/' || url.pathname === '/index.html')) {
      const html = await readFile(join(ROOT, 'public', 'index.html'), 'utf8');
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      return res.end(req.method === 'HEAD' ? undefined : html);
    }

    return json(res, 404, { error: 'Ruta no encontrada.' });
  } catch (err) {
    const status = /vacío|YYYY-MM-DD|válida/.test(err.message) ? 400 : 500;
    return json(res, status, { error: err.message });
  }
});

// Si el puerto está ocupado, prueba los siguientes para no bloquear al usuario.
let port = PREFERRED_PORT;
let attempts = 0;

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE' && attempts < 5) {
    attempts += 1;
    port += 1;
    console.log(`  Puerto ocupado, probando ${port}…`);
    server.listen(port, '127.0.0.1');
  } else {
    console.error(`  No se pudo iniciar el servidor: ${err.message}`);
    process.exit(1);
  }
});

server.listen(port, '127.0.0.1', () => {
  console.log('\n  Agenda web de Frank');
  console.log(`  Base de datos: ${DB_PATH}`);
  console.log(`  Abra en el navegador:  http://localhost:${port}`);
  console.log('  (Ctrl+C para detener)\n');
});

const shutdown = () => {
  server.close(() => {
    store.close();
    console.log('\n  Servidor detenido. Datos guardados.');
    process.exit(0);
  });
};
process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
