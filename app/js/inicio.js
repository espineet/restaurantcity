/* inicio.js — Arranque del juego, recuperación ante errores y guardado automático. */

/* Monta el local con la partida cargada. Si la partida provoca un error, prueba con
 * la última copia buena; si tampoco sirve, bloquea el guardado para no perder nada. */
function arrancar() {
  initLayout();
  if (S.shift) busy = S.shift.c.filter((c) => !c.paid).length;
}
try {
  arrancar();
} catch (e) {
  console.error("Error al montar la partida", e);
  let ok = false;
  if (rawCargado) lsSet(KEY_RESCATE, rawCargado);
  for (const k of [KEY_BUENA, KEY_CAMBIO, KEY_ANTES_V13]) {
    const r = lsGet(k);
    if (!r || r === rawCargado) continue;
    try {
      S = parsePartida(r);
      arrancar();
      rawCargado = r;
      avisoCarga = "⚠️ Tu partida daba un error y se ha recuperado la última copia de seguridad.";
      ok = true;
      break;
    } catch (e2) {}
  }
  if (!ok) {
    S = fresh();
    guardadoBloqueado = true;
    try {
      arrancar();
    } catch (e3) {}
  }
}
// La partida se ha cargado bien: queda como «última copia buena»
if (rawCargado && !guardadoBloqueado) lsSet(KEY_BUENA, rawCargado);

window.addEventListener("resize", fit);
draw();
requestAnimationFrame(loop);

/* ===== Guardado automático ===== */
let hid = 0;
document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    hid = Date.now();
    flush();
  } else {
    if (hid && Date.now() - hid > 20000) settle();
    hid = 0;
  }
});
window.addEventListener("pagehide", flush);
window.addEventListener("beforeunload", flush);
document.addEventListener("freeze", flush);
// Red de seguridad: cada 10 s se escribe la partida si hay cambios o un servicio en marcha
setInterval(() => {
  if (pendiente || S.shift) flush();
}, 10000);

resume();

/* Pantalla de rescate: la partida guardada no se pudo leer de ninguna forma */
function pantallaRescate() {
  let o = document.getElementById("rescate");
  if (!o) {
    o = document.createElement("div");
    o.id = "rescate";
    o.className = "ov";
    document.body.appendChild(o);
  }
  o.innerHTML = `<div class="box"><h2>⚠️ No se pudo leer tu partida</h2>
  <p>No hemos borrado nada: tus datos se conservan aparte en este móvil.</p>
  <p class="mut">Descárgalos para recuperarlos más tarde, carga una partida exportada o empieza de cero.</p>
  <button class="big" onclick="rescateDescargar()">📤 Descargar mis datos</button>
  <button class="s ancho" onclick="document.getElementById('rescate').style.display='none';showCfg()">📥 Cargar partida exportada</button>
  <button class="s ancho" onclick="rescateNueva()">Empezar partida nueva</button></div>`;
  o.style.display = "flex";
}
function rescateDescargar() {
  const t = lsGet(KEY_RESCATE) || "";
  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob([t], { type: "application/json" }));
  a.download = "restaurante-rescate.json";
  document.body.appendChild(a);
  a.click();
  setTimeout(() => {
    URL.revokeObjectURL(a.href);
    a.remove();
  }, 1500);
}
function rescateNueva() {
  guardadoBloqueado = false;
  document.getElementById("rescate").style.display = "none";
  save();
  draw();
  askName();
}

if (guardadoBloqueado) pantallaRescate();
else if (!S.name) askName();
else setTimeout(tutMaybe, 600);
if (avisoCarga) setTimeout(() => toast(avisoCarga), 800);
