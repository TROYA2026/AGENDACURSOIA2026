# Lab 01 — Dashboard interactivo desde CSV

**Día 1 · Bloque 12 (🛠️)** · Modalidad: parejas · Nivel: inicial

## Objetivo

Convertir uno o varios archivos CSV en un tablero visual (dashboard) que abra en
el navegador sin internet. El tablero debe mostrar totales, promedios y
comparaciones de los datos de la empresa de ejemplo, y debe ser la IA quien
escriba el HTML.

## Prerrequisitos

- OpenCode Desktop instalado y con un modelo configurado (`/model`).
- La subcarpeta `datos/` con `clientes.csv`, `productos.csv` y `ventas.csv`
  junto a este laboratorio.
- Un navegador (Chrome, Edge o Firefox) para abrir el resultado.
- Haber visto la estructura de prompts ROL + CONTEXTO + RESULTADO.

## Tiempo estimado

40 minutos: 5 de consigna, 20 de trabajo en parejas, 10 de iteración y 5 de
exposición.

## Paso a paso

**1. Elija el CSV de arranque (2 min).**
Trabaje con `datos/ventas.csv`. Es el archivo con más filas y el que permite ver
más tipos de gráficos. Después puede sumar los otros dos.

**2. Pida el dashboard a la IA (8 min).**
Copie y pegue este prompt en OpenCode, sin cambiar las rutas:

```
Lea el archivo datos/ventas.csv que está en mi carpeta de trabajo.
Cree un dashboard visual en un solo archivo HTML que procese TODOS los
registros del CSV y los muestre con gráficos: totales, promedios y
comparaciones.
Requisitos:
- Debe abrirse en el navegador con doble clic, sin internet.
- Los gráficos deben mostrar los datos reales, no valores de ejemplo.
- Al final, explíqueme qué columnas encontró y cómo las representó.
No modifique el archivo CSV.
```

**3. Abra el resultado (3 min).**
Cuando la IA termine, haga doble clic en el HTML generado. Si no aparece solo,
pida a la IA: «Muéstreme la ruta exacta del archivo HTML que creó».

**4. Verifique los números (5 min).**
Pida a la IA que calcule, con las mismas filas, tres totales de control:

```
Con los datos de ventas.csv, indíqueme:
1. La suma de la columna total.
2. El número de ventas registradas.
3. El promedio de la columna total.
Después, dígame si esos tres números coinciden con lo que muestra el
dashboard. Si no coinciden, corríjalos.
```

**5. Enriquezca el tablero con una segunda fuente (10 min).**
Ahora pida que cruce ventas con productos:

```
Agregue al dashboard una sección que una ventas.csv con productos.csv por
id_producto. Quiero ver las ventas agrupadas por categoria y los 5
productos más vendidos por cantidad. Use el nombre del producto, no solo
el código.
```

**6. Itere (7 min).**
Elija al menos dos mejoras y pídalas de a una:

```
Agregue un gráfico de torta con las ventas por canal.
Cambie los colores a tonos profesionales y agregue los títulos de cada gráfico.
Muestre el promedio y el valor máximo de la columna total.
Agregue un filtro por ciudad usando clientes.csv.
```

**7. Prepare la exposición (5 min).**
Anote tres cosas para compartir con la sala: el prompt que mejor funcionó, el
gráfico que más le sirvió y la dificultad más grande que encontró.

## Resultado esperado

- Un archivo HTML (por ejemplo `dashboard.html`) en su carpeta de trabajo.
- El archivo abre con doble clic, sin conexión a internet.
- Se ven, como mínimo: el total de ventas, el promedio por venta y una
  comparación por categoría o por canal.
- Los números coinciden con los totales de control que calculó la IA.

## Criterio de «está listo»

- [ ] La IA leyó al menos `ventas.csv` y confirmó cuántas filas procesó.
- [ ] El dashboard abre en el navegador con doble clic.
- [ ] Los gráficos muestran datos reales del CSV (no valores de ejemplo).
- [ ] Al menos un gráfico cruza dos archivos (ventas + productos o ventas + clientes).
- [ ] Se iteró el prompt al menos una vez.
- [ ] El equipo tiene anotado su prompt final y su dificultad principal.

## Errores comunes

| Síntoma | Causa probable | Cómo resolverlo |
|---|---|---|
| La IA dice que no encuentra el archivo | La ruta está mal o falta la subcarpeta `datos/` | Indique la ruta exacta y pida: «Liste los archivos de mi carpeta para confirmar» |
| El dashboard se ve, pero vacío | No se cargaron los datos o el HTML se abrió sin el CSV | Pida que incruste los datos dentro del HTML para que no dependa del CSV |
| Los totales no coinciden | Datos leídos con coma decimal o columnas mal identificadas | Pida que use punto decimal y que muestre el total de control |
| Los gráficos no aparecen sin internet | El HTML usa una librería en línea | Pida: «Use gráficos nativos (CSS, SVG o canvas), sin internet» |
| Letras deformadas (tildes raras) | Problema de codificación | Pida: «Lea los CSV en UTF-8 y muestre los textos correctamente» |
| La respuesta es muy larga y no termina | Se pidieron demasiadas cosas juntas | Divida: primero el tablero base, después cada mejora |

> Si algo falla, no reescriba todo: agregue contexto o precise el formato. Casi
> siempre el problema está en el prompt, no en la IA.

## Reto extra

- **Nivel 1:** agregue un indicador de alerta que se encienda cuando el stock de
  un producto esté por debajo de 300 unidades (`productos.csv`).
- **Nivel 2:** agregue un filtro por rango de fechas que no recargue la página.
- **Nivel 3:** genere un resumen automático en texto («este mes se vendió más X
  que Y») que se actualice según el filtro seleccionado.

> Cuando lo logre, guarde el dashboard en su carpeta de trabajo: se subirá a
> GitHub en el Día 2.
