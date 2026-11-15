# Lab 03 — Proyecto completo con SDD

**Día 2 · Bloque 7 (🛠️)** · Modalidad: individual, guiado · Nivel: integrador

## Objetivo

Construir un proyecto real de principio a fin usando **SDD** (especificar antes
de construir) y **TDD** (definir la prueba antes de construir), con la IA
haciendo el trabajo técnico. El proyecto se especifica, se construye, se
verifica y finalmente se sube a GitHub.

> Es la culminación del curso: usted pone el criterio y la IA ejecuta.

## Prerrequisitos

- OpenCode Desktop con modelo configurado.
- Gentle AI instalado y Engram inicializado en el proyecto.
- Una cuenta de GitHub y un repositorio creado (por ejemplo `mi-curso-ia`).
- Los desarrollos del Día 1 guardados en su carpeta de trabajo (perfil,
  dashboard y agenda).
- Haber visto la diferencia entre SDD y TDD.

## Tiempo estimado

60 minutos de construcción + 35 minutos de presentación.
Distribuya así: 15 de especificación, 10 de pruebas, 20 de construcción,
10 de verificación y 10 de publicación en GitHub.

## Paso a paso

### Fase 1 — Especificación (15 min)

**1. Defina el problema (3 min).**
Responda estas tres preguntas. La respuesta a cualquiera de ellas es su proyecto:

- ¿Qué tarea de su trabajo le resulta pesada y repetitiva?
- ¿Qué tarea repite todas las semanas?
- ¿Qué le gustaría delegar a un asistente?

Si no tiene una idea propia, use la agenda o el dashboard del Día 1 como base.

**2. Escriba la especificación con la IA (12 min).**

```
Quiero construir un [proyecto: agenda / dashboard / asistente / otro] que
[qué hace]. Ayúdeme a escribir una especificación clara que diga:
1. Qué problema resuelve.
2. Qué funciones debe tener (concretas).
3. Cómo se verifica que funciona.
Hágame todas las preguntas que necesite antes de escribir la especificación.
```

Lea la especificación y ajústela antes de continuar: «agregue X», «quite Y»,
«precise Z». **No pase a la siguiente fase hasta estar conforme.**

### Fase 2 — Pruebas (10 min)

```
Defina pruebas para cada función de la especificación: cómo sabemos que
cada una funcionó. Escríbalas en formato «se considera correcto si…».
```

Revise que cada prueba tenga sentido para usted y que sean verificables.

### Fase 3 — Construcción (20 min)

```
Construya el proyecto según la especificación. Trabaje paso a paso y
muéstreme cada avance. No cambie la especificación sin avisarme.
```

Observe cómo la IA crea archivos y va dejando registro en memoria. No necesita
tocar la terminal: la IA ejecuta los comandos por usted.

### Fase 4 — Verificación (10 min)

```
Verifique que el proyecto cumple la especificación y que las pruebas pasan.
Muéstreme el resultado de cada prueba en una tabla, con una columna que diga
«pasa» o «no pasa».
```

Si algo no pasa, no lo arregle a mano. Pida: «Explique por qué falló y
corríjalo hasta que pase». Este ciclo es el corazón de SDD + TDD.

### Fase 5 — Publicación en GitHub (10 min)

```
Suba este proyecto a mi repositorio de GitHub con un mensaje de commit que
explique lo que construimos. Si necesita que yo inicie sesión o ingrese algo,
explíqueme paso a paso qué debo hacer.
```

Verifique en el navegador que los archivos aparecen en
`https://github.com/[su-usuario]/mi-curso-ia`.

### Cierre — Presentación (35 min)

Exponga en 1 o 2 minutos: qué especificó, qué construyó y qué le sorprendió de
ver a la IA orquestar el proceso.

> **Ampliación sugerida:** el mismo ciclo sirve para cualquier necesidad. Qué
> quiere lograr, cómo sabrá que funcionó y recién después construir. Guárdelo
> como su método de trabajo.

## Resultado esperado

- Una especificación escrita y aprobada por usted.
- Un conjunto de pruebas redactadas antes de construir.
- El proyecto funcionando y con las pruebas en estado «pasa».
- Un informe de verificación que muestra el resultado de cada prueba.
- El proyecto publicado en su repositorio de GitHub.

## Criterio de «está listo»

- [ ] Existe una especificación con problema, funciones y forma de verificación.
- [ ] Las pruebas se definieron antes de construir.
- [ ] El proyecto construido respeta la especificación.
- [ ] El informe de verificación muestra que las pruebas pasan.
- [ ] La IA registró la decisión importante en memoria (Engram).
- [ ] El proyecto está subido a GitHub y se ve en el navegador.

## Errores comunes

| Síntoma | Causa probable | Cómo resolverlo |
|---|---|---|
| La IA empieza a construir sin especificar | No se pidió la especificación primero | Detenga y diga: «Primero escriba la especificación y espéreme» |
| La especificación es vaga | Faltan respuestas a las preguntas | Pida: «Hágame más preguntas antes de escribir» |
| Las pruebas no sirven para validar nada | No son verificables | Pida: «Reformule cada prueba para que se pueda comprobar con un sí o un no» |
| El proyecto se desvía de lo pedido | Se cambió el alcance a mitad | Vuelva a la especificación y pida: «Ajuste el proyecto a este documento» |
| La verificación dice «todo pasa», pero no funciona | Pruebas demasiado débiles | Pida: «Agregue pruebas que fallen si la función no hace lo prometido» |
| Falla el push a GitHub | Falta autenticación o el remoto no está conectado | Pida: «Explique paso a paso cómo autenticarme o conectar el repositorio» |
| La memoria no recuerda el proyecto | Engram no se inicializó en esa carpeta | Pida: «Inicialice la memoria en esta carpeta y confirme» |

## Reto extra

- **Nivel 1:** agregue una segunda mejora y verifique que no rompe lo anterior.
- **Nivel 2:** escriba UNA prueba nueva antes de construir la mejora (TDD puro).
- **Nivel 3:** pida a la IA un resumen de una página, para usted, que explique
  qué construyó, cómo se usa y qué aprendió. Súbalo al repositorio como
  `README.md`.

> Cuando termine, tiene un proyecto versionado, verificado y con memoria. Ese es
> el mismo flujo que usan los equipos profesionales.
