/* ajustes.js — Tutorial, ajustes, exportar e importar la partida. */

/* tutorial */
const TUT = [
  [
    "🍽️ ¡Bienvenido!",
    "Eres el dueño de un restaurante. Tu objetivo: servir comidas y cenas, ganar monedas 🪙, subir de nivel y hacer crecer el local. Este repaso rápido te enseña lo básico.",
  ],
  [
    "🏠 Local",
    "Aquí ves tu restaurante. Pulsa el botón naranja para abrir la comida o la cena. Al terminar verás un resumen: clientes servidos, contentos, normales y enfadados, y por qué se enfadaron. Dos veces por semana puedes marcar un 😴 Día de descanso para cerrar.",
  ],
  [
    "📋 Menú",
    "Elige los platos y postres que cocinas. Los nuevos se desbloquean con monedas, y a más nivel, más huecos. Cada plato necesita ingredientes: sin ellos los clientes se van.",
  ],
  [
    "🛒 Tienda",
    "Compra aquí los ingredientes. Se guardan en el 🧊 Almacén (neveras y arcones): cada nevera guarda 50 y cada arcón 100. Pulsa el almacén para ver lo que tienes por tipo.",
  ],
  [
    "🎨 Catálogo",
    "Compra mesas, sillas, plantas, barras, decoración y muebles de cocina. Todo va primero al Inventario: pulsa “Colocar” y toca la casilla donde lo quieres. Más mesas = más clientes; la decoración los atrae.",
  ],
  [
    "👥 Plantilla",
    "Tu equipo. Cada persona tiene stats (resistencia, velocidad, etc.). Entra en su ficha para asignarle puesto (mesas, barra, fogones, repostería o descanso), pagar formaciones o despedirla. Aguantan tantos servicios seguidos como su resistencia y luego descansan.",
  ],
  [
    "🔧 Mejoras",
    "Contrata camareros y cocineros nuevos (Buscar) y amplía el salón, la cocina y la terraza. Cada ampliación de cocina añade un fogón y una mesa de repostería. Un nivel de cocina nuevo permite más cocineros.",
  ],
  [
    "😊 Clientes y fama",
    "Cada cliente sale contento, normal o enfadado según la calidad de platos y postres, las plantas y la simpatía de los camareros. Los contentos suben tu fama y traen más gente; los enfadados la bajan. Si no hay sitio, la gente hace cola y al rato se va.",
  ],
  [
    "🧾 Gastos y eventos",
    "Cada domingo por la noche llegan las facturas (alquiler, sueldos, luz, agua…). Págalas a tiempo: las atrasadas se recargan un 10%. También hay eventos aleatorios: críticos, lluvia, reservas, bajas, averías, ayudas…",
  ],
  [
    "⭐ Pase de plato",
    "Pulsa tu nivel arriba (⭐) para ver las recompensas cada 5 niveles: monedas, muebles, personal y recetas. Se reclaman a mano.",
  ],
  [
    "💾 Guarda tu partida",
    "Tu progreso vive en este navegador. En ⚙️ Ajustes puedes exportar la partida a un archivo o código y cargarla en otro móvil o tras borrar datos. ¡Hazlo de vez en cuando! Allí también controlas el sonido y la música, y puedes volver a ver este tutorial.",
  ],
];
let tuI = 0;
function tutShow() {
  let o = document.getElementById("tu");
  if (!o) {
    o = document.createElement("div");
    o.id = "tu";
    o.className = "ov";
    document.body.appendChild(o);
  }
  const t = TUT[tuI],
    last = tuI === TUT.length - 1;
  o.innerHTML = `<div class="box hoja"><h2 style="margin:0 0 8px">${t[0]}</h2><p style="margin:0 0 12px;line-height:1.45">${t[1]}</p><div style="text-align:center;margin:6px 0 12px;letter-spacing:4px;font-size:12px;color:var(--ac)">${TUT.map((_, i) => (i === tuI ? "●" : "○")).join("")}</div><div class="row" style="gap:8px">${tuI > 0 ? `<button class="s" onclick="tuI--;tutShow()">‹ Atrás</button>` : `<button class="s" onclick="tutEnd()">Saltar</button>`}<button class="big" style="flex:1;margin:0" onclick="${last ? "tutEnd()" : "tuI++;tutShow()"}">${last ? "¡A cocinar!" : "Siguiente ›"}</button></div></div>`;
  o.style.display = "flex";
}
function tutEnd() {
  S.tut = 1;
  save();
  const o = document.getElementById("tu");
  if (o) o.style.display = "none";
}
function tutMaybe() {
  if (S.tut) return;
  if (!S.name) return;
  if (S.day > 1 || S.xp > 0 || S.last) {
    S.tut = 1;
    save();
    return;
  }
  tuI = 0;
  tutShow();
}
function tutOpen() {
  const c = document.getElementById("cf");
  if (c) c.style.display = "none";
  tuI = 0;
  tutShow();
}
/* ===== Ajustes: sonido, copia de seguridad (exportar/importar) y copias automáticas ===== */
let cfMsg = "",
  cfPend = null;
function cfEl() {
  let o = document.getElementById("cf");
  if (!o) {
    o = document.createElement("div");
    o.id = "cf";
    o.className = "ov";
    o.onclick = (e) => {
      if (e.target === o) cerrarVentana("cf");
    };
    document.body.appendChild(o);
  }
  return o;
}
const fechaCorta = (t) =>
  new Date(t).toLocaleString("es-ES", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });
/* Resumen de una partida guardada (para enseñarla antes de restaurarla) */
function resumenPartida(d) {
  return `«${esc(d.name || "sin nombre")}» · nivel ${1 + Math.floor((d.xp | 0) / 100)} · día ${d.day | 0} · ${d.coins | 0} 🪙`;
}
/* Copias automáticas que hay en este móvil */
const COPIAS = [
  [KEY_BUENA, "Última partida que se abrió bien"],
  [KEY_CAMBIO, "Antes de reiniciar o cargar otra partida"],
  [KEY_ANTES_V13, "Antes de la actualización a la versión 13"],
  [KEY_RESCATE, "Datos que no se pudieron leer"],
];
function copiasHtml() {
  const filas = COPIAS.map(([k, t]) => {
    const r = lsGet(k);
    if (!r) return "";
    let d = null;
    try {
      d = JSON.parse(r);
    } catch (e) {}
    const ok = d && typeof d === "object" && typeof d.coins === "number";
    return `<div class="copia"><div><b>${t}</b><div class="mut sm">${ok ? resumenPartida(d) + (d.ts ? " · " + fechaCorta(d.ts) : "") : "No se puede leer"}</div></div>${ok ? `<button class="s" onclick="cfRestaurar('${k}')">Restaurar</button>` : ""}</div>`;
  }).join("");
  return filas || `<div class="mut sm">Todavía no hay copias automáticas.</div>`;
}
function cfRestaurar(k) {
  cfImport(lsGet(k) || "");
}
function showCfg() {
  const o = cfEl(),
    sw = (k, i, l) =>
      `<div class="row"><span>${i} ${l}</span><button class="s interruptor ${AU.cfg[k] ? "on" : ""}" onclick="setAud('${k}')">${AU.cfg[k] ? "Sí" : "No"}</button></div>`;
  const bk = S.bk ? fechaCorta(S.bk) : "nunca";
  o.innerHTML = `<div class="box hoja">${btnCerrar("cf")}<h2>⚙️ Ajustes</h2>
 <h3>Sonido</h3>${sw("sfx", "🔊", "Efectos (monedas, campanilla…)")}${sw("mus", "🎵", "Música y ambiente de local")}
 <h3>🌗 Pantalla</h3><div class="botones tema">${[
   ["auto", "📱 Automática"],
   ["claro", "☀️ Clara"],
   ["oscuro", "🌙 Oscura"],
 ]
   .map(
     ([t, l]) =>
       `<button class="s interruptor ${(AU.cfg.tema || "auto") === t ? "on" : ""}" onclick="setTema('${t}')">${l}</button>`,
   )
   .join("")}</div><div class="mut sm">Automática: clara u oscura según el ajuste de tu móvil.</div>
 <h3>💾 Copia de seguridad</h3><div class="mut sm">Tu progreso se guarda solo en este móvil. Descarga una copia de vez en cuando para no perderlo nunca. Última copia: <b>${bk}</b>.</div>
 <div class="botones"><button class="s" onclick="cfExport()">📤 Guardar archivo</button><button class="s" onclick="cfCopy()">📋 Copiar código</button></div>
 <h3>📥 Cargar una partida</h3><div class="mut sm">Elige un archivo exportado o pega el código. Antes de reemplazar tu partida se guarda una copia automática.</div>
 <div class="botones"><label class="s">📂 Elegir archivo<input type="file" accept=".json,application/json,text/plain" hidden onchange="cfFile(this)"></label></div>
 <textarea id="cft" placeholder="O pega aquí el código de la partida"></textarea>
 <button class="s ancho" onclick="cfImport(document.getElementById('cft').value)">Cargar código</button>
 ${cfMsg ? `<div class="card aviso">${cfMsg}</div>` : ""}
 ${cfPend ? `<div class="card peligro"><b>¿Reemplazar tu partida actual?</b><div class="mut sm">Partida a cargar: ${resumenPartida(cfPend)}.<br>Tu partida actual (${resumenPartida(S)}) se guardará como copia automática.</div><div class="botones"><button class="s rojo" onclick="cfApply()">✔ Sí, cargar</button><button class="s" onclick="cfPend=null;cfMsg='';showCfg()">Cancelar</button></div></div>` : ""}
 <h3>🛟 Copias automáticas</h3><div class="mut sm">El juego guarda estas copias solo, por si algo falla.</div>${copiasHtml()}
 <h3>Más</h3><div class="botones"><button class="s" onclick="tutOpen()">📖 Ver tutorial</button><button class="s" onclick="cerrarVentana('cf');document.getElementById('rs').style.display='flex'">🔄 Reiniciar partida</button></div>
 <div class="mut sm version">Mi Restaurante · versión ${VERSION}</div></div>`;
  o.style.display = "flex";
}
function setTema(t) {
  AU.cfg.tema = t;
  auSave();
  aplicarTema(t);
  showCfg();
}
const cfData = () => JSON.stringify({ game: "restaurante", v: 1, t: Date.now(), data: S });
function cfHecho(msg) {
  S.bk = Date.now();
  save();
  cfMsg = msg;
  showCfg();
}
async function cfExport() {
  const nombre = "restaurante-" + new Date().toISOString().slice(0, 10) + ".json";
  const txt = cfData();
  // En el móvil (sobre todo iPhone) se usa el menú Compartir: permite «Guardar en Archivos»
  try {
    const f = new File([txt], nombre, { type: "application/json" });
    if (navigator.canShare && navigator.canShare({ files: [f] })) {
      await navigator.share({ files: [f], title: "Copia de Mi Restaurante" });
      cfHecho("✅ Copia guardada. Guárdala en un sitio seguro (Archivos, Drive, correo…).");
      return;
    }
  } catch (e) {
    if (e && e.name === "AbortError") return; // el jugador canceló
  }
  try {
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([txt], { type: "application/json" }));
    a.download = nombre;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      URL.revokeObjectURL(a.href);
      a.remove();
    }, 1500);
    cfHecho("✅ Archivo descargado. Guárdalo en un sitio seguro (si no se descarga, usa “Copiar código”).");
  } catch (e) {
    cfMsg = "No se pudo descargar. Usa “Copiar código”.";
    showCfg();
  }
}
function cfCopy() {
  const t = cfData();
  const ok = () => cfHecho("✅ Código copiado. Pégalo en un mensaje o nota para guardarlo."),
    fb = () => {
      const a = document.createElement("textarea");
      a.value = t;
      document.body.appendChild(a);
      a.select();
      let r = false;
      try {
        r = document.execCommand("copy");
      } catch (e) {}
      a.remove();
      if (r) ok();
      else {
        cfMsg = "No se pudo copiar automáticamente. Usa “Guardar archivo”.";
        showCfg();
      }
    };
  try {
    navigator.clipboard.writeText(t).then(ok, fb);
  } catch (e) {
    fb();
  }
}
function cfFile(inp) {
  const f = inp.files && inp.files[0];
  if (!f) return;
  const r = new FileReader();
  r.onload = () => cfImport(String(r.result || ""));
  r.onerror = () => {
    cfMsg = "No se pudo leer el archivo.";
    showCfg();
  };
  r.readAsText(f);
}
function cfImport(txt) {
  cfPend = null;
  let d = null;
  try {
    d = JSON.parse(String(txt).trim());
  } catch (e) {}
  if (d && d.data && typeof d.data === "object") d = d.data;
  if (
    !d ||
    typeof d !== "object" ||
    typeof d.coins !== "number" ||
    !Array.isArray(d.tbl) ||
    !Array.isArray(d.menu) ||
    typeof d.day !== "number"
  ) {
    cfMsg = "❌ Ese archivo o código no es una partida válida.";
    showCfg();
    return;
  }
  cfPend = d;
  cfMsg = "";
  showCfg();
}
function cfApply() {
  const d = cfPend;
  if (!d) return;
  const anterior = S;
  try {
    // se comprueba que la partida funciona antes de sustituir la actual
    S = load(JSON.parse(JSON.stringify(d)));
    S.ts = Date.now();
    S.tut = 1;
    initLayout();
  } catch (e) {
    S = anterior;
    cfMsg = "❌ No se pudo cargar la partida: tu partida actual sigue intacta.";
    showCfg();
    return;
  }
  const nueva = S;
  S = anterior;
  if (!guardadoBloqueado) copiaAntesDeCambio();
  S = nueva;
  guardadoBloqueado = false;
  flush();
  cfPend = null;
  cfMsg = "";
  cfEl().innerHTML = '<div class="box"><h2>✅ Partida cargada</h2><p>Recargando…</p></div>';
  setTimeout(() => location.reload(), 900);
}

botonCabecera("cfb", "⚙️", "Ajustes", () => {
  cfMsg = "";
  cfPend = null;
  showCfg();
});
