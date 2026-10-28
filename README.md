# MonteRojo · Experimento de decisión de compra

Sitio web estático (HTML + CSS + JS, sin dependencias ni paso de compilación) para un experimento de investigación de mercados que mezcla **card sorting** y **A/B testing** sobre la marca de snacks MonteRojo.

## Cómo funciona

1. **Bienvenida**: introducción y campos opcionales (alias y rango de edad).
2. **Pregunta inicial**: tres respuestas posibles. La elegida determina el camino (sin mostrar su nombre): *Path to purchase*, *Espacio físico* o *Construcción de marca*.
3. **Seis preguntas A/B** del camino elegido (3 subcategorías x 2 preguntas), de a una por pantalla.
4. **Resultado** estilo test de personalidad: perfil según cuántas A y B eligió (4-6 A, 4-6 B o 3-3), barra A vs B y desglose por subcategoría.
5. **Guardado** opcional de las respuestas en Google Sheets.

## Estructura

| Archivo | Contenido |
| --- | --- |
| `index.html` | Estructura de las pantallas |
| `styles.css` | Estilos (tema oscuro, responsive) |
| `data.js` | Preguntas, caminos y perfiles |
| `app.js` | Lógica, resultados y envío a Sheets |
| `apps-script.gs` | Código para Google Apps Script |
| `fondo.jpeg` | Imagen de fondo |

## Ejecutar en local

Abre `index.html` con doble clic en el navegador. No hace falta servidor.

## Conectar con Google Sheets

1. Crea una hoja de cálculo nueva en [Google Sheets](https://sheets.google.com).
2. Ve a **Extensiones → Apps Script**.
3. Borra el contenido del editor y pega todo el código de `apps-script.gs`. Guarda.
4. Pulsa **Implementar → Nueva implementación**, elige el tipo **Aplicación web**.
5. Configura **Ejecutar como: Yo** y **Quién tiene acceso: Cualquier persona**. Pulsa **Implementar** y autoriza los permisos.
6. Copia la **URL de la aplicación web** (termina en `/exec`).
7. Abre `app.js` y pega la URL en la constante del inicio:
   ```js
   const SHEETS_ENDPOINT = "https://script.google.com/macros/s/XXXXXXXX/exec";
   ```
8. Haz una prueba completa y verifica que aparece una fila nueva en la hoja. La primera vez se crean los encabezados automáticamente.

Si cambias `apps-script.gs` más adelante, debes crear una **nueva versión** de la implementación (Implementar → Administrar implementaciones → Editar → Nueva versión).

Si `SHEETS_ENDPOINT` está vacío, no se envía nada (solo se muestra el contenido en la consola del navegador).

### Columnas guardadas

`timestamp`, `participantId`, `alias`, `ageRange`, `initialAnswer`, `path`, las 18 columnas de preguntas (`SH01-1`, `SH01-2`, `SH03-1`, `SH03-2`, `PMV02-1`, `PMV02-2`, `EF01-1`, ..., `CM03-2`, con valor `A` o `B`; en blanco si la pregunta no pertenece al camino del participante), `totalA`, `totalB`, `profile` y `userAgent`.

## Editar preguntas y perfiles

Todo el contenido está en `data.js`:

- `INTRO_QUESTION`: pregunta inicial y las tres respuestas (cada una con su `path`).
- `PATHS.<camino>.subcategories`: subcategorías con su `code` y sus dos preguntas (`text`, `a`, `b`).
- `PATHS.<camino>.profiles`: perfiles `A`, `B` y `balanced` (nombre y descripción).
- `AGE_RANGES`: opciones del rango de edad.

Si cambias los códigos de subcategoría, actualiza también `QUESTION_CODES` en `apps-script.gs`.

## Publicar en GitHub Pages

1. Sube la carpeta a un repositorio de GitHub.
2. En **Settings → Pages**, elige la rama `main` y la carpeta raíz.
3. El sitio quedará en: `https://TU-USUARIO.github.io/TU-REPOSITORIO/` (pendiente de completar).

## Accesibilidad

Todos los controles son `<button>` reales con foco visible. En las preguntas se puede responder con el teclado: `A`/`B` o `1`/`2`, y `←` para volver.
