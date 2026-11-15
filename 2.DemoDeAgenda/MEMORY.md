# Memoria persistente — 2.DemoDeAgenda

Bitácora para que cualquier sesión (humana o IA) retome el trabajo sin releer todo.

## Estado actual

- [x] Lab 01 terminado (`dashboard.html` en `Laboratorios/`).
- [x] Especificación escrita (`SPEC.md`).
- [x] Node.js instalado en el equipo (v26.13.1, portable en `%LOCALAPPDATA%\Programs\nodejs`).
- [x] Pruebas escritas y en verde (6/6 con `npm.cmd test`).
- [x] CLI funcionando (`npm start` / `node src/cli.js`).
- [x] Interfaz web funcionando (`http://localhost:3000`, API 200 verificada).
- [x] Uso real: 3 tareas de hoy + 3 de mañana + 1 hecha (#1 «enviar informe»).
- [x] Verificación de la base SQLite (tabla `tasks` + índice `idx_tasks_due`).
- [x] Reto Nivel 1: vista «solo pendientes» (web y CLI) con prueba automática.
- [x] Reto Nivel 2: fecha límite opcional, insignias de urgencia y orden por urgencia.
- [x] Migración automática de `agenda.db` (columna `deadline` en bases antiguas).

## Decisiones tomadas

| Fecha | Decisión | Motivo |
|---|---|---|
| 2026-11-14 | Usar `node:sqlite` en vez de `better-sqlite3` | Cero dependencias: no compila ni descarga binarios; funciona sin internet. |
| 2026-11-14 | Web con `node:http`, sin Express | Menos piezas, menos que instalar, mismo resultado. |
| 2026-11-14 | Guardar `due_date` como fecha ISO concreta | Para que «mañana» siga siendo correcto al día siguiente. |
| 2026-11-14 | Nombre del dueño: **Frank** | Definido por el participante; reemplaza el provisional «Invitado». |
| 2026-11-14 | Node.js portable (zip) en `%LOCALAPPDATA%\Programs\nodejs` | El instalador MSI quedó esperando permiso de administrador; el zip no requiere UAC. |
| 2026-11-14 | Usar `npm.cmd` en PowerShell | La política de ejecución del equipo bloquea `npm.ps1`. |
| 2026-11-14 | Filtro «solo pendientes» en SQL, no solo en la interfaz | Una sola regla para CLI y web; la consulta ya excluye `done = 1`. |
| 2026-11-14 | Fecha límite como columna `deadline` nullable + migración ALTER TABLE | No se pierde nada de la base existente; las tareas sin límite quedan al final. |
| 2026-11-14 | Orden por urgencia en SQL: `(deadline IS NULL), deadline, id` | Mismo criterio en CLI y web sin duplicar lógica. |

## Cómo retomar

1. `npm test` — confirma que la lógica sigue sana.
2. `npm start` — abre la agenda en terminal.
3. `npm run web` — abre `http://localhost:3000`.
4. Revisar esta bitácora y marcar lo hecho.

## Pendientes / ideas

- Reto Nivel 3: resumen diario de pendientes (ya cubierto por `summary` y los chips).
- Editar la fecha límite desde la interfaz web (hoy solo desde CLI: `deadline`).
