/* generar-sw.js — Regenera app/sw.js con la lista de archivos del juego y la versión de app/js/comun.js.
 * Ejecutar después de cada cambio:  node herramientas/generar-sw.js
 * (Si no cambia la versión, los móviles no reciben la actualización.) */
const fs = require("fs");
const path = require("path");
const APP = path.join(__dirname, "..", "app");
const version = fs
  .readFileSync(path.join(APP, "js", "comun.js"), "utf8")
  .match(/const VERSION = "([^"]+)"/)[1];

const archivos = [];
(function recorrer(dir) {
  for (const f of fs.readdirSync(dir).sort()) {
    const full = path.join(dir, f);
    if (fs.statSync(full).isDirectory()) recorrer(full);
    else {
      const rel = path.relative(APP, full).split(path.sep).join("/");
      if (rel === "sw.js" || rel === "_headers" || f.startsWith(".")) continue;
      archivos.push(rel);
    }
  }
})(APP);

const sw = `/* sw.js — Service worker de Mi Restaurante (GENERADO por herramientas/generar-sw.js: no editar a mano).
 * Guarda todo el juego en el móvil para poder jugar sin conexión.
 * Cada versión usa su propia caché; al activarse borra las antiguas.
 * La partida NO está aquí (está en localStorage) y nunca se toca. */
const VERSION = ${JSON.stringify(version)};
const CACHE = "mi-restaurante-v" + VERSION;
const ARCHIVOS = ${JSON.stringify(["./", ...archivos], null, 1).replace(/\n\s*/g, "\n  ")};

// Instalación: descarga todos los archivos de esta versión (sin usar la caché HTTP)
self.addEventListener("install", (e) => {
  e.waitUntil(
    caches
      .open(CACHE)
      .then((c) => c.addAll(ARCHIVOS.map((u) => new Request(u, { cache: "reload" }))))
      .then(() => self.skipWaiting()),
  );
});

// Activación: borra las cachés de versiones anteriores y toma el control
self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches
      .keys()
      .then((ks) => Promise.all(ks.filter((k) => k !== CACHE && k.startsWith("mi-restaurante")).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

// La página pregunta qué versión hay instalada
self.addEventListener("message", (e) => {
  if (e.data === "version" && e.ports[0]) e.ports[0].postMessage({ version: VERSION });
});

// Peticiones: primero la copia guardada (rápido y sin conexión); si falta, se descarga y se guarda
self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET" || new URL(req.url).origin !== location.origin) return;
  if (req.mode === "navigate") {
    // la página siempre sale de la copia guardada de esta versión ("./" = index.html)
    e.respondWith(
      caches
        .match("./", { cacheName: CACHE })
        .then((r) => r || caches.match("index.html", { cacheName: CACHE }))
        .then((r) => (r && r.redirected ? new Response(r.body, { status: 200, headers: r.headers }) : r))
        .then((r) => r || fetch(req)),
    );
    return;
  }
  e.respondWith(
    caches.match(req, { cacheName: CACHE, ignoreSearch: true }).then(
      (r) =>
        r ||
        fetch(req).then((res) => {
          if (res.ok) {
            const copia = res.clone();
            caches.open(CACHE).then((c) => c.put(req, copia));
          }
          return res;
        }),
    ),
  );
});
`;
fs.writeFileSync(path.join(APP, "sw.js"), sw);
console.log("sw.js generado: versión", version, "·", archivos.length + 1, "archivos");
