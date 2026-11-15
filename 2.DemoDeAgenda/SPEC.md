# Especificación — Agenda personal (2.DemoDeAgenda)

**Dueño:** Frank
**Curso:** De Usuario a Orquestador — Módulo 1 · Lab 02
**Modalidad:** aplicación local, sin internet.

## 1. Problema

Necesito registrar lo que tengo que hacer **hoy** y **mañana**, marcarlo como hecho y
que no se pierda al cerrar la aplicación. No quiero depender de la nube ni de una
cuenta en línea.

## 2. Alcance (lo que SÍ hace)

1. Registrar una tarea con un título y un día: `hoy` o `mañana`.
2. Listar las tareas separadas en dos grupos: **hoy** y **mañana**.
3. Marcar/desmarcar una tarea como hecha.
4. Persistir todo en una base SQLite local (`agenda.db`).
5. Ofrecer dos interfaces sobre los mismos datos:
   - **CLI**: `npm start`
   - **Web**: `npm run web` → `http://localhost:3000`
6. Mostrar un resumen de pendientes (hoy / mañana).
7. Vista **«solo pendientes»**: oculta las tareas ya hechas (Reto Nivel 1).
8. **Fecha límite por tarea** (opcional) y **orden por urgencia**: la fecha límite
   más próxima primero; las tareas sin fecha límite van al final (Reto Nivel 2).

## 3. Fuera de alcance

- Usuarios, contraseñas o multiusuario.
- Sincronización en la nube o correo.
- Notificaciones, calendario, recurrencia.
- Reto Nivel 3 formal (el resumen ya está incluido).

## 4. Modelo de datos

Tabla `tasks`:

| Campo | Tipo | Regla |
|---|---|---|
| `id` | INTEGER PK AUTOINCREMENT | generado |
| `title` | TEXT | obligatorio, no vacío, recortado |
| `due_date` | TEXT (ISO `YYYY-MM-DD`) | fecha local del día asignado |
| `deadline` | TEXT (ISO `YYYY-MM-DD`) o NULL | fecha límite opcional; base del orden por urgencia |
| `done` | INTEGER (0/1) | por defecto 0 |
| `created_at` | TEXT (ISO 8601) | al crear |

Índice: `idx_tasks_due (due_date)`.

> El día se guarda como **fecha concreta**, no como la palabra «hoy». Así, al día
> siguiente, una tarea de «mañana» aparece correctamente en su fecha real.

## 5. Comportamiento esperado (casos de aceptación)

- **CA-1:** al agregar «enviar informe» para hoy, aparece en el grupo *hoy*.
- **CA-2:** al agregar una tarea para mañana, aparece en el grupo *mañana*.
- **CA-3:** al marcar una tarea como hecha, `done` pasa a 1 y se ve el cambio.
- **CA-4:** al cerrar y reabrir la app (CLI o web), la tarea sigue hecha.
- **CA-5:** un título vacío o solo espacios se rechaza con un mensaje claro.
- **CA-6:** la base `agenda.db` existe en la carpeta del proyecto y contiene las tareas.
- **CA-7:** la app no hace ninguna petición a internet.
- **CA-8:** una tarea puede llevar fecha límite opcional; se muestra si está vencida,
  vence hoy o su fecha.
- **CA-9:** dentro de cada grupo (hoy / mañana) las tareas se ordenan por fecha
  límite ascendente y las que no tienen fecha límite quedan al final.

## 6. Decisiones técnicas

- **Runtime:** Node.js LTS (probado con la versión instalada en el equipo).
- **SQLite:** módulo nativo `node:sqlite` (`DatabaseSync`). Evita dependencias que
  requieran compilar o descargar binarios: la app queda realmente offline.
- **Web:** `node:http` + HTML/CSS/JS servidos desde `public/`. Sin frameworks.
- **Pruebas:** `node:test` + `node:assert`.
- **Cero dependencias de npm** → `npm install` no requiere red.

## 7. Criterios de «está listo»

- [ ] `npm test` en verde.
- [ ] `npm start` permite agregar, listar y marcar tareas.
- [ ] `npm run web` sirve la interfaz en `http://localhost:3000`.
- [ ] 3 tareas de hoy + 3 de mañana registradas.
- [ ] Una tarea marcada conserva su estado al reiniciar.
- [ ] `agenda.db` contiene las tareas.
