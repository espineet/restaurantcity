# Mi Restaurante — instrucciones para Claude

Juego PWA para móvil (estilo Restaurant City), en **castellano** (los textos del juego deben seguir en castellano).
El propietario habla catalán: las explicaciones para él, en catalán y sencillas.

## Flujo de trabajo acordado con el propietario
- Cuando pida un cambio, hazlo todo tú (código, pruebas, versión) y al final pídele solo permiso para subirlo a GitHub.
- Publicado en **Cloudflare Pages** (igual que su otro juego, espineet/acuari), conectado a este repositorio con
  «Build output directory» = `app`: al subir a `main`, la app se publica sola y los móviles reciben la actualización.
  (Antes estaba en Netlify; se abandonó sin migrar partidas porque nadie había empezado a jugar.)

## Estructura
- `app/` → lo que se publica (Cloudflare Pages publica esta carpeta; `app/_headers` controla la caché). HTML + CSS + JS sin compilar, sin dependencias.
  - `app/js/*.js`: scripts clásicos (no módulos) que comparten variables globales; **el orden de `<script>` en `index.html` importa**.
    Las funciones se llaman desde `onclick="..."` en el HTML generado, así que deben seguir siendo globales.
  - `app/img/`: dibujos del juego (no sustituir por emojis).
  - `app/sw.js`: **generado**; no editar a mano.
- `herramientas/generar-sw.js` → regenera `app/sw.js` (lista de archivos + versión).
- `herramientas/icono.svg` → origen de los iconos (tenedor y cuchillo blancos sobre naranja `#e8590c`).

## Reglas que no se pueden romper
1. **Progreso de los jugadores**: está en `localStorage`, clave `restaurante_v1` (estado `S`) y `restaurante_cfg` (sonido).
   No cambies las claves. Si cambias el formato de `S`, añade la migración en `load()` (`app/js/guardado.js`), que
   siempre debe aceptar partidas de cualquier versión anterior y rellenar lo que falte sin quitar nada.
   Copias automáticas: `restaurante_v1_copia_antes_v13`, `_copia_ultima_buena`, `_copia_antes_de_cambio`, `_rescate`.
2. No eliminar funciones del juego ni cambiar precios/valores salvo que el propietario lo pida.
3. Debe seguir funcionando sin conexión e instalable.

## Al terminar cualquier cambio (obligatorio)
1. Sube la versión en `app/js/comun.js` (`const VERSION = "14"`, luego 15…). Si no cambia, los móviles no se actualizan.
2. `node herramientas/generar-sw.js`
3. Prueba en Chromium (Playwright está instalado: `require("playwright")`) sirviendo `app/` con un servidor local:
   sin errores en consola, cargar una partida antigua y comprobar que monedas/nivel/plantilla siguen iguales.
4. Commit en castellano y pide permiso para hacer `git push origin main`.
