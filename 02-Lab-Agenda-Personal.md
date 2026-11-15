# Lab 02 — Agenda personal (app local)

**Día 1 · Bloque 13 (🛠️)** · Modalidad: individual · Nivel: inicial

## Objetivo

Construir una agenda personal que funcione como aplicación local, sin internet,
con dos formas de uso (terminal e interfaz web en `localhost`). Debe guardar las
tareas de hoy y de mañana, permitir marcarlas como hechas y almacenarlas en una
base SQLite en el propio equipo.

## Prerrequisitos

- OpenCode Desktop abierto en su carpeta de trabajo.
- Un modelo configurado (`/model`). Para esta tarea se recomienda un modelo
  económico.
- Node.js instalado. Si no está seguro, pida a la IA que lo verifique (ver
  paso 1).
- Haber terminado el Lab 01, para tener la carpeta de trabajo ya creada.

## Tiempo estimado

25 minutos: 15 de construcción, 5 de uso real y 5 de cierre.

## Paso a paso

**1. Pida a la IA que revise el entorno (3 min).**
No abra la terminal usted mismo. Copie este prompt en OpenCode:

```
Verifique si mi computadora tiene Node.js y npm instalados.
Ejecute los comandos por mí y explíqueme en lenguaje simple qué encontró.
Si falta algo, instálelo y dígame exactamente qué hizo.
```

**2. Construya la agenda (8 min).**

```
Quiero construir una agenda personal que funcione SIN internet:
- Guarde mis tareas de HOY y las de MAÑANA.
- Me permita marcar tareas como hechas.
- Funcione por terminal (CLI) y también con interfaz web en localhost.
- Almacene todo en una base SQLite local (better-sqlite3 o node:sqlite).
- Use el flujo profesional: especificación (SDD), pruebas (TDD) y memoria
  persistente.
Cree el proyecto en la carpeta 2.DemoDeAgenda/ y complételo con mi nombre:
[escriba aquí su nombre].
Ejecute los comandos por mí y muéstreme cada avance.
```

**3. Aprenda a abrirla (3 min).**
Pida a la IA que le indique los comandos exactos y anótelos:

```
Indíqueme el comando para abrir la agenda por terminal, el comando para
abrirla en el navegador (localhost) y el comando para correr las pruebas.
Explique cada uno en una frase.
```

Comandos habituales en este proyecto (confirme con la IA los de su versión):

| Para qué | Comando típico |
|---|---|
| Abrir por terminal | `npm start` |
| Abrir en el navegador | `npm run web` → `http://localhost:3000` |
| Verificar que funciona | `npm test` |

> Si no sabe ejecutar un comando, pídale a la IA: «Ejecute este comando por mí
> y muéstreme el resultado».

**4. Use la agenda de verdad (5 min).**
Abra la agenda y registre:

- Tres tareas de hoy, por ejemplo: «enviar informe», «llamar al cliente»,
  «revisar cotización».
- Tres metas para mañana.
- Marque una tarea como hecha y verifique que el cambio se guarda al cerrar y
  volver a abrir.

**5. Compruebe el almacenamiento (3 min).**
Pregunte a la IA:

```
Confírmeme en qué archivo se guardan mis tareas y qué formato tiene.
Muéstreme las tareas que acabo de registrar leyéndolas desde la base.
```

**6. Guarde el proyecto (3 min).**
Conserve la carpeta `2.DemoDeAgenda/` completa (incluida la base `agenda.db`)
dentro de su carpeta de trabajo. Este proyecto será lo primero que suba a
GitHub en el Día 2.

## Resultado esperado

- Una carpeta de proyecto `2.DemoDeAgenda/` con la aplicación funcionando.
- Una base SQLite local (por ejemplo `agenda.db`) con sus tareas guardadas.
- La agenda se abre por terminal y también en `http://localhost:3000`.
- Las tareas aparecen separadas en «hoy» y «mañana».
- Una tarea marcada como hecha conserva ese estado al reiniciar.

## Criterio de «está listo»

- [ ] La aplicación abre sin conexión a internet.
- [ ] Registré al menos 3 tareas de hoy y 3 de mañana.
- [ ] Puedo marcar una tarea como hecha.
- [ ] El estado se mantiene después de cerrar y volver a abrir.
- [ ] La base SQLite existe y contiene mis tareas.
- [ ] Sé ejecutar los tres comandos (abrir, abrir en web, probar).

## Errores comunes

| Síntoma | Causa probable | Cómo resolverlo |
|---|---|---|
| «No se reconoce el comando npm» | Node.js no está instalado | Pida a la IA que verifique e instale Node.js |
| La agenda abre, pero borra lo que escribo | Los datos viven en memoria y no en SQLite | Pida: «Guarde cada tarea en SQLite y recárguelas al abrir» |
| El navegador no abre `localhost` | La interfaz web no se inició | Pida: «Inicie la interfaz web y confirme el puerto correcto» |
| La instalación pide permisos o contraseña | El sistema pide autorización | La IA le dirá qué confirmar; siga sus indicaciones |
| `npm test` falla | Falta alguna dependencia o una prueba | Pida: «Explique por qué falló la prueba y corríjalo» |
| No encuentro dónde quedó el proyecto | Se creó en otra carpeta | Pida: «Muéstreme la ruta exacta de la carpeta 2.DemoDeAgenda» |

## Reto extra

- **Nivel 1:** agregue una vista que muestre solo las tareas pendientes.
- **Nivel 2:** agregue una fecha límite a cada tarea y ordene por urgencia.
- **Nivel 3:** agregue un resumen diario que diga cuántas tareas quedan
  pendientes para hoy y mañana.

> Guarde también el prompt final que funcionó. Le servirá como plantilla para
> futuras aplicaciones locales.
