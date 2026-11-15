# Kit de Laboratorios — Módulo 1

**Curso:** «De Usuario a Orquestador — IA Aplicada para Profesionales No Técnicos»
**Organiza:** Zoom Creative · **Facilitador:** Mauricio Campaña · **Sede:** Quito, Ecuador

Este kit reúne los datos de ejemplo, los laboratorios guiados y las plantillas de
prompts que se usan durante los dos días del Módulo 1. Está pensado para que el
participante lo abra en su carpeta de trabajo y siga cada laboratorio con la IA
haciendo el trabajo técnico.

## Ruta rápida

1. Copie la carpeta `Laboratorios/` completa a su equipo (incluida la subcarpeta `datos/`).
2. Abra OpenCode Desktop y verifique que tiene un modelo configurado.
3. Ejecute los laboratorios en orden: `01` → `02` (Día 1) y `03` (Día 2).
4. Guarde todo lo que genere dentro de su carpeta de trabajo: será la base de su
   repositorio en GitHub.

## Contenido del kit

| Archivo | Qué contiene | Cuándo se usa |
|---|---|---|
| `Laboratorios/datos/clientes.csv` | 25 clientes de la empresa de ejemplo | Lab 01 (Día 1) |
| `Laboratorios/datos/productos.csv` | 23 productos con precio, costo y stock | Lab 01 (Día 1) |
| `Laboratorios/datos/ventas.csv` | 110 ventas del primer semestre de 2026 | Lab 01 (Día 1) |
| `Laboratorios/01-Lab-Dashboard-CSV.md` | Laboratorio de dashboard visual desde CSV | Día 1 · bloque 12 (40 min) |
| `Laboratorios/02-Lab-Agenda-Personal.md` | Laboratorio de agenda personal local (SQLite) | Día 1 · bloque 13 (25 min) |
| `Laboratorios/03-Lab-Proyecto-SDD.md` | Laboratorio de proyecto completo con SDD + TDD | Día 2 · bloque 7 (60 + 35 min) |
| `Apoyo/Plantillas-Prompts.md` | Plantillas de prompts reutilizables | Todo el curso |

Los laboratorios 1 (prompt estructurado) y 2 (personalidad en Markdown) se
resuelven con las plantillas de `Apoyo/Plantillas-Prompts.md`. El laboratorio 5
(repositorio en GitHub) se integra en el laboratorio 03.

## Los datos de ejemplo

Los tres CSV describen a **Distribuidora Andina Cía. Ltda.**, una PyME
distribuidora ficticia de productos de consumo masivo con operación en varias
ciudades del Ecuador. Todos los nombres, correos y teléfonos son inventados y
no corresponden a personas ni empresas reales.

Los archivos se pueden unir entre sí por sus claves:

| Archivo | Filas | Clave | Campos principales |
|---|---|---|---|
| `clientes.csv` | 25 | `id_cliente` | nombre, tipo_cliente, ciudad, fecha_alta, correo, telefono, estado |
| `productos.csv` | 23 | `id_producto` | nombre, categoria, unidad_medida, precio_unitario, costo_unitario, stock_actual, proveedor, estado |
| `ventas.csv` | 110 | `id_venta` | fecha, id_cliente, id_producto, cantidad, precio_unitario, descuento, total, canal, vendedor |

Relaciones:

- `ventas.id_cliente` → `clientes.id_cliente`
- `ventas.id_producto` → `productos.id_producto`

Reglas de integridad que cumplen los datos (útiles para verificar el dashboard):

- Todo `id_cliente` e `id_producto` de `ventas.csv` existe en su archivo maestro.
- `total = (cantidad × precio_unitario) − descuento`, redondeado a dos decimales.
- Las fechas de venta van del 5 de enero al 29 de junio de 2026.
- `precio_unitario` de cada venta coincide con el precio del producto en el
  momento de la venta.

> Los datos son consistentes entre sí a propósito: si el dashboard muestra
> totales raros, casi siempre es un problema de lectura del CSV, no del dataset.

## Cómo usar los datos

- **No modifique los CSV de origen.** Si necesita cambios, cópielos a otra
  carpeta y trabaje sobre la copia.
- Al pedirle a la IA que lea un archivo, nombre la ruta exacta y la subcarpeta:
  por ejemplo, `Laboratorios/datos/ventas.csv`.
- Codificación: UTF-8. Separador: coma. Primera fila: encabezados.
- Los números usan punto decimal y **no** llevan separador de miles.

## Orden recomendado

| Paso | Laboratorio | Producto que obtiene |
|---|---|---|
| 1 | `01-Lab-Dashboard-CSV.md` | Un dashboard HTML que abre sin internet |
| 2 | `02-Lab-Agenda-Personal.md` | Una app de agenda local con base SQLite |
| 3 | `03-Lab-Proyecto-SDD.md` | Un proyecto especificado, construido, verificado y subido a GitHub |

## Antes de empezar

- [ ] OpenCode Desktop instalado y con un modelo configurado (`/model`).
- [ ] Carpeta de trabajo creada, por ejemplo `mi-proyecto-curso/`.
- [ ] La subcarpeta `datos/` con los tres CSV junto a los laboratorios.
- [ ] Un navegador actualizado (Chrome, Edge o Firefox).

## Siguiente paso

Abra `01-Lab-Dashboard-CSV.md` y comience por el Día 1. Si todavía no escribió
su perfil personal, hágalo primero con la plantilla de personalidad de
`../Apoyo/Plantillas-Prompts.md`.
