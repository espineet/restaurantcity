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
  o.innerHTML = `<div class="box" style="text-align:left;width:min(92vw,360px)"><h2 style="margin:0 0 8px">${t[0]}</h2><p style="margin:0 0 12px;line-height:1.45">${t[1]}</p><div style="text-align:center;margin:6px 0 12px;letter-spacing:4px;font-size:12px;color:var(--ac)">${TUT.map((_, i) => (i === tuI ? "●" : "○")).join("")}</div><div class="row" style="gap:8px">${tuI > 0 ? `<button class="s" onclick="tuI--;tutShow()">‹ Atrás</button>` : `<button class="s" onclick="tutEnd()">Saltar</button>`}<button class="big" style="flex:1;margin:0" onclick="${last ? "tutEnd()" : "tuI++;tutShow()"}">${last ? "¡A cocinar!" : "Siguiente ›"}</button></div></div>`;
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
/* ajustes, exportar e importar */
let cfMsg = "",
  cfPend = null;
function cfEl() {
  let o = document.getElementById("cf");
  if (!o) {
    o = document.createElement("div");
    o.id = "cf";
    o.className = "ov";
    o.onclick = (e) => {
      if (e.target === o) {
        o.style.display = "none";
      }
    };
    document.body.appendChild(o);
  }
  return o;
}
function showCfg() {
  const o = cfEl(),
    sw = (k, i, l) =>
      `<div class="row" style="margin:6px 0"><span>${i} ${l}</span><button class="s" style="min-width:64px;${AU.cfg[k] ? "outline:2px solid var(--ac)" : "opacity:.6"}" onclick="setAud('${k}')">${AU.cfg[k] ? "Sí" : "No"}</button></div>`;
  const bk = S.bk
    ? new Date(S.bk).toLocaleString("es-ES", {
        day: "numeric",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "nunca";
  o.innerHTML = `<div class="box" style="text-align:left;max-height:90vh;overflow:auto;width:min(92vw,380px)"><div style="position:sticky;top:-20px;height:0;text-align:right;z-index:2"><button onclick="document.getElementById('cf').style.display='none'" aria-label="Cerrar" style="position:relative;top:-8px;right:-8px;width:36px;height:36px;border-radius:50%;border:0;background:#e8590c;color:#fff;font-size:20px;font-weight:700;cursor:pointer;box-shadow:0 2px 6px rgba(0,0,0,.3)">✕</button></div><h2 style="margin:0 0 8px">⚙️ Ajustes</h2>
 <b>Sonido</b>${sw("sfx", "🔊", "Efectos (monedas, campanilla…)")}${sw("mus", "🎵", "Música y ambiente de local")}
 <div style="margin:14px 0 4px"><b>💾 Guardar la partida</b></div><div class="mut sm">Tu progreso solo vive en este navegador. Exporta una copia para no perderlo. Última copia: ${bk}.</div>
 <div class="row" style="gap:8px;margin:8px 0;flex-wrap:wrap"><button class="s" onclick="cfExport()">📤 Descargar archivo</button><button class="s" onclick="cfCopy()">📋 Copiar código</button></div>
 <div style="margin:14px 0 4px"><b>📥 Cargar una partida</b></div><div class="mut sm">Elige un archivo exportado o pega el código. Se reemplazará la partida actual.</div>
 <div class="row" style="gap:8px;margin:8px 0"><label class="s" style="cursor:pointer;display:inline-block;padding:8px 12px;border-radius:10px;border:2px solid var(--bd)">📂 Elegir archivo<input type="file" accept=".json,application/json,text/plain" style="display:none" onchange="cfFile(this)"></label></div>
 <textarea id="cft" placeholder="O pega aquí el código de la partida" style="width:100%;height:70px;border-radius:10px;border:2px solid var(--bd);background:var(--bg);color:var(--tx);padding:8px;font-size:12px"></textarea>
 <button class="s" style="width:100%;margin-top:6px" onclick="cfImport(document.getElementById('cft').value)">Cargar código</button>
 ${cfMsg ? `<div class="card" style="margin:8px 0">${cfMsg}</div>` : ""}
 ${cfPend ? `<div class="card" style="border-color:#c0392b;margin:8px 0"><b>¿Reemplazar tu partida actual?</b><div class="mut sm">Partida a cargar: «${cfPend.name || "sin nombre"}», nivel ${1 + Math.floor((cfPend.xp | 0) / 100)}, día ${cfPend.day | 0}, ${cfPend.coins | 0} 🪙. Tu partida actual se perderá (exporta una copia antes si quieres).</div><div class="row" style="gap:8px;margin-top:8px"><button class="s" style="background:#c0392b;color:#fff" onclick="cfApply()">✔ Sí, cargar</button><button class="s" onclick="cfPend=null;cfMsg='';showCfg()">Cancelar</button></div></div>` : ""}
 <div style="margin:14px 0 4px"><b>Más</b></div><div class="row" style="gap:8px;flex-wrap:wrap"><button class="s" onclick="tutOpen()">📖 Ver tutorial</button><button class="s" onclick="document.getElementById('cf').style.display='none';document.getElementById('rs').style.display='flex'">🔄 Reiniciar partida</button></div></div>`;
  o.style.display = "flex";
}
const cfData = () => JSON.stringify({ game: "restaurante", v: 1, t: Date.now(), data: S });
function cfExport() {
  try {
    const b = new Blob([cfData()], { type: "application/json" }),
      a = document.createElement("a");
    a.href = URL.createObjectURL(b);
    a.download = "restaurante-" + new Date().toISOString().slice(0, 10) + ".json";
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      URL.revokeObjectURL(a.href);
      a.remove();
    }, 1500);
    S.bk = Date.now();
    save();
    cfMsg = "✅ Archivo descargado. Guárdalo en un sitio seguro (si no se descarga, usa “Copiar código”).";
    showCfg();
  } catch (e) {
    cfMsg = "No se pudo descargar. Usa “Copiar código”.";
    showCfg();
  }
}
function cfCopy() {
  const t = cfData();
  const ok = () => {
      S.bk = Date.now();
      save();
      cfMsg = "✅ Código copiado. Pégalo en un mensaje o nota para guardarlo.";
      showCfg();
    },
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
        cfMsg = "No se pudo copiar automáticamente. Usa “Descargar archivo”.";
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
  try {
    S = load(d);
    S.ts = Date.now();
    S.tut = 1;
    initLayout();
    flush();
    cfPend = null;
    cfMsg = "";
    const o = cfEl();
    o.innerHTML = '<div class="box"><h2>✅ Partida cargada</h2><p>Recargando…</p></div>';
    setTimeout(() => location.reload(), 900);
  } catch (e) {
    cfMsg = "❌ No se pudo cargar la partida.";
    showCfg();
  }
}
try {
  (function () {
    const b = document.createElement("button");
    b.id = "cfb";
    b.textContent = "⚙️";
    b.setAttribute("aria-label", "Ajustes");
    b.style.cssText =
      "position:fixed;top:2px;right:4px;z-index:40;width:28px;height:28px;border-radius:50%;border:1px solid var(--bd);background:var(--card);font-size:14px;cursor:pointer;padding:0;line-height:1";
    b.onclick = () => {
      cfMsg = "";
      cfPend = null;
      showCfg();
    };
    document.body.appendChild(b);
  })();
} catch (e) {}
