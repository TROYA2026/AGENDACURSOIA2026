# 2.DemoDeAgenda — Agenda personal local

Aplicación de agenda que funciona **sin internet**, con dos formas de uso:

- **Terminal (CLI)** — rápida, para registrar y marcar tareas.
- **Navegador** — `http://localhost:3000`, con vista de hoy y mañana.

Todo se guarda en **SQLite** (`agenda.db`) dentro de esta carpeta.

## Requisitos

- Node.js LTS (versión 22.5 o superior; usa el módulo nativo `node:sqlite`).
- No hace falta `npm install`: el proyecto tiene **cero dependencias**.

> **En este equipo** Node se instaló de forma portable en
> `%LOCALAPPDATA%\Programs\nodejs` (sin permisos de administrador) y ya está en el
> PATH del usuario. Si PowerShell bloquea `npm` por la política de ejecución,
> usa `npm.cmd` (`npm.cmd start`, `npm.cmd run web`, `npm.cmd test`).

## Comandos

| Para qué | Comando |
|---|---|
| Abrir por terminal | `npm start` |
| Abrir en el navegador | `npm run web` → `http://localhost:3000` |
| Correr las pruebas | `npm test` |

Para ver **solo lo pendiente**:

- En la web: botón **«Ver solo pendientes»** (recuerda la elección en el navegador).
- En terminal: opción **6** del menú o `node src/cli.js pending`.

También hay comandos directos, útiles para verificar rápido:

```bash
node src/cli.js list
node src/cli.js add hoy "enviar informe" 2026-11-18
node src/cli.js deadline 3 2026-11-20
node src/cli.js done 3
node src/cli.js pending
node src/cli.js summary
```

## Estructura

```
2.DemoDeAgenda/
├── SPEC.md            Especificación (SDD): alcance y casos de aceptación
├── MEMORY.md          Memoria persistente: estado y decisiones
├── package.json       Scripts y metadatos
├── agenda.db          Base SQLite (se crea al primer uso)
├── public/
│   └── index.html     Interfaz web (HTML/CSS/JS, sin frameworks)
├── src/
│   ├── dates.js       Fechas locales ISO (hoy / mañana)
│   ├── db.js          Conexión y esquema SQLite
│   ├── tasks.js       Lógica de negocio (única para CLI, web y pruebas)
│   ├── cli.js         Interfaz de terminal
│   └── server.js      Servidor HTTP local + API JSON
└── test/
    └── tasks.test.js  Pruebas con node:test
```

## Cómo está construido

1. **SDD:** primero `SPEC.md`, con alcance, modelo de datos y casos de aceptación.
2. **TDD:** `test/tasks.test.js` cubre CA-1 a CA-6; la lógica se implementó hasta
   ponerlas en verde.
3. **Una sola fuente de verdad:** `src/tasks.js` concentra las reglas; CLI y web
   solo la llaman. Así lo que funciona en terminal funciona igual en el navegador.
4. **Memoria persistente:** `MEMORY.md` registra estado, decisiones y pendientes
   para retomar el trabajo en otra sesión.

## Notas de diseño

- El día se guarda como **fecha concreta** (`YYYY-MM-DD`), no como la palabra
  «hoy». Si registras algo para mañana, al día siguiente aparece en su fecha real.
- Se usa `node:sqlite` en lugar de `better-sqlite3` para evitar compilaciones y
  descargas: la app queda realmente utilizable sin conexión.
- El servidor escucha solo en `127.0.0.1` (no expone la agenda a la red local).

## Si algo falla

| Síntoma | Qué hacer |
|---|---|
| «No se reconoce npm» | Falta Node.js; instálalo desde nodejs.org o con `winget install OpenJS.NodeJS.LTS` |
| El navegador no abre | Confirma que `npm run web` sigue corriendo y usa el puerto que indica la consola |
| `npm test` falla | Lee el mensaje: indica el caso de aceptación exacto que se rompió |
| La agenda aparece vacía | Revisa que estés en esta carpeta y que exista `agenda.db` |

## Retos extra (opcionales)

- **Nivel 1:** vista «solo pendientes» — ✅ **implementada** (web y CLI).
- **Nivel 2:** fecha límite libre y orden por urgencia — ✅ **implementada**
  (campo opcional en CLI y web, insignias de vencida/vence hoy, orden SQL).
- **Nivel 3:** resumen diario de pendientes — ya incluido en el CLI (`summary`) y
  en la web (chips superiores).
