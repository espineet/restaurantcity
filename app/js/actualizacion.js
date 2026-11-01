/* actualizacion.js — Registra el service worker (juego sin conexión) y aplica las versiones nuevas.
 *
 * Cómo llega una actualización a los móviles:
 *  1. Al abrir el juego, el navegador comprueba si sw.js ha cambiado.
 *  2. Si hay versión nueva, se descarga entera en segundo plano (el jugador sigue jugando).
 *  3. Cuando está lista, se avisa al jugador y se aplica al tocar el aviso
 *     o la próxima vez que vuelva al juego. La partida se guarda antes de recargar. */
(function () {
  if (!("serviceWorker" in navigator) || !location.protocol.startsWith("http")) return;
  const habiaControlador = !!navigator.serviceWorker.controller;
  let lista = false,
    recargando = false;

  function aplicar() {
    if (recargando) return;
    recargando = true;
    try {
      flush();
    } catch (e) {}
    location.reload();
  }
  function avisar() {
    lista = true;
    const d = document.createElement("div");
    d.className = "toast";
    d.textContent = "✨ Hay una versión nueva del juego. Toca aquí para actualizar.";
    d.onclick = aplicar;
    (document.getElementById("toasts") || document.body).appendChild(d);
  }

  // El service worker nuevo ha tomado el control: hay versión nueva lista
  // (si el juego que se ve ya es esa versión, no hace falta avisar)
  navigator.serviceWorker.addEventListener("controllerchange", () => {
    if (!habiaControlador || lista) return;
    const c = navigator.serviceWorker.controller,
      canal = new MessageChannel();
    canal.port1.onmessage = (e) => {
      if (e.data && e.data.version !== VERSION) avisar();
    };
    if (c) c.postMessage("version", [canal.port2]);
  });
  // Si el jugador sale del juego y vuelve, se aplica la versión nueva sin preguntar
  document.addEventListener("visibilitychange", () => {
    if (!document.hidden && lista) aplicar();
  });

  addEventListener("load", () => {
    navigator.serviceWorker
      .register("sw.js")
      .then((reg) => {
        // Buscar actualizaciones al volver al juego (como mucho una vez cada 30 min)
        let ultima = Date.now();
        document.addEventListener("visibilitychange", () => {
          if (!document.hidden && Date.now() - ultima > 30 * 60 * 1000) {
            ultima = Date.now();
            reg.update().catch(() => {});
          }
        });
      })
      .catch(() => {});
  });

  // Precarga de imágenes en ratos libres: así aparecen al instante en la tienda, el menú y la plantilla
  addEventListener("load", () => {
    const urls = [...Object.values(IMG), ...Object.values(DIMG), ...CIMG, ...CIMG2].filter(
      (u) => typeof u === "string",
    );
    let i = 0;
    const idle = window.requestIdleCallback || ((f) => setTimeout(() => f({ timeRemaining: () => 8 }), 200));
    const paso = (dl) => {
      while (i < urls.length && dl.timeRemaining() > 2) {
        const im = new Image();
        im.decoding = "async";
        im.src = urls[i++];
      }
      if (i < urls.length) idle(paso);
    };
    idle(paso);
  });
})();
