/* guardado.js — Estado de la partida (S), carga, migración y guardado.
 *
 * IMPORTANTE: el progreso de los jugadores vive en localStorage con la clave KEY.
 * No cambies KEY ni el formato de S sin añadir una migración en load().
 *
 * Copias de seguridad automáticas (todas en localStorage, junto a la partida):
 *  - KEY_ANTES_V13: la partida tal como estaba antes de instalar esta versión (se hace una sola vez).
 *  - KEY_BUENA:     la última partida que se cargó bien (se renueva en cada arranque correcto).
 *  - KEY_CAMBIO:    la partida justo antes de reiniciar o de cargar otra partida.
 *  - KEY_RESCATE:   datos que no se pudieron leer (nunca se borran solos).
 */
const KEY = "restaurante_v1";
const KEY_CFG = "restaurante_cfg";
const KEY_ANTES_V13 = KEY + "_copia_antes_v13";
const KEY_BUENA = KEY + "_copia_ultima_buena";
const KEY_CAMBIO = KEY + "_copia_antes_de_cambio";
const KEY_RESCATE = KEY + "_rescate";

/* Lectura y escritura seguras (en modo privado de Safari localStorage puede fallar) */
const lsGet = (k) => {
  try {
    return localStorage.getItem(k);
  } catch (e) {
    return null;
  }
};
const lsSet = (k, v) => {
  try {
    localStorage.setItem(k, v);
    return true;
  } catch (e) {
    return false;
  }
};

/* Convierte una partida guardada (de cualquier versión anterior) al formato actual.
 * Rellena con valores por defecto todo lo que falte; nunca quita nada. */
function load(o) {
  const s = Object.assign(fresh(), o);
  s.ext = Object.assign({ door: 0, fac: 0, awn: 0, sign: 0, board: 0, win: 0, orn: 0, roof: 0 }, o.ext);
  if (o.fb == null) s.fb = 4;
  if (o.barL == null) s.barL = 0;
  if (o.rst == null && (o.crew || o.ccrew)) s.lg = 1;
  return s;
}
const fresh = () => ({
  look: { f: 9, w: 9, t: 0, c: 0, kf: 0, kw: 0 },
  own: ["f0", "w0", "f9", "w9", "t0", "c0", "kf0", "kw0"],
  coins: 200,
  day: 1,
  xp: 0,
  tables: 2,
  deco: 0,
  chef: 2,
  waiters: 1,
  q: 0,
  buzz: 0,
  shift: null,
  ts: 0,
  v10: 0,
  name: "",
  ext: { door: 0, fac: 0, awn: 0, sign: 0, board: 0, win: 0, orn: 0, roof: 0 },
  wins: [
    [0, 0, 0],
    [1, 1, 0],
  ],
  winv: [],
  wg: 2,
  kobj: [],
  ter: 0,
  terL: 0,
  inv: { t: [], c: [], p: [], b: [], s: [], d: [], v: [], u: [], q: [], k: [] },
  bars: [],
  stl: [],
  dec: [],
  barL: 1,
  fb: 1,
  laid: 0,
  sal: 0,
  kit: 0,
  tbl: [],
  chr: [],
  plt: [],
  stock: {},
  unlocked: ["guisantes", "huevos", "melon", "sandia"],
  menu: ["guisantes", "huevos"],
  menuD: ["melon", "sandia"],
  last: null,
  pass: [],
  tut: 0,
});

/* Lee y convierte una partida en texto. Lanza un error si el texto no es una partida. */
function parsePartida(txt) {
  const o = JSON.parse(txt);
  if (!o || typeof o !== "object" || Array.isArray(o)) throw new Error("formato no válido");
  return load(o);
}

let S = fresh(),
  tab = "rest";
let rawCargado = null; // texto de la partida cargada al arrancar
let avisoCarga = ""; // mensaje para el jugador si hubo que recuperar una copia
let guardadoBloqueado = false; // true si no se pudo leer la partida: así nunca se sobrescribe

(function cargarPartida() {
  const raw = lsGet(KEY);
  if (!raw) return; // jugador nuevo
  // Copia de seguridad de la partida antes de esta versión (solo la primera vez)
  if (!lsGet(KEY_ANTES_V13)) lsSet(KEY_ANTES_V13, raw);
  try {
    S = parsePartida(raw);
    rawCargado = raw;
    return;
  } catch (e) {
    console.error("No se pudo leer la partida", e);
  }
  // La partida principal está dañada: se guarda aparte y se prueba con las copias
  lsSet(KEY_RESCATE, raw);
  for (const k of [KEY_BUENA, KEY_CAMBIO, KEY_ANTES_V13]) {
    const r = lsGet(k);
    if (!r || r === raw) continue;
    try {
      S = parsePartida(r);
      rawCargado = r;
      avisoCarga = "⚠️ Tu partida no se podía leer y se ha recuperado la última copia de seguridad.";
      return;
    } catch (e) {}
  }
  // Ninguna copia sirve: no se guarda nada encima hasta que el jugador decida
  S = fresh();
  guardadoBloqueado = true;
})();
try {
  const o = { carne: "filete", pescado: "salmon", huevo: "huevos" };
  for (const k in S.stock) {
    if (o[k]) S.stock[o[k]] = (S.stock[o[k]] || 0) + S.stock[k];
  }
} catch (e) {}
/* migración de menú y almacén: se hace en initLayout, cuando ya existen todas las recetas */
let cat = "Verduras";
/* ===== Guardado =====
 * save() se llama tras cada acción: marca la partida como cambiada y la escribe
 * como mucho una vez por segundo. flush() la escribe al momento (al cerrar u ocultar la app). */
let saveT = 0,
  ultimaEscritura = 0,
  pendiente = false,
  avisoEspacio = false;
function flush() {
  clearTimeout(saveT);
  saveT = 0;
  if (guardadoBloqueado) return false;
  let txt;
  try {
    txt = JSON.stringify(S);
  } catch (e) {
    console.error("No se pudo preparar el guardado", e);
    return false;
  }
  if (!txt || txt.length < 20) return false;
  if (lsSet(KEY, txt)) {
    pendiente = false;
    avisoEspacio = false;
    ultimaEscritura = Date.now();
    return true;
  }
  if (!avisoEspacio) {
    avisoEspacio = true;
    try {
      toast("⚠️ No se ha podido guardar: el móvil no tiene espacio libre. Exporta tu partida en ⚙️ Ajustes.");
    } catch (e) {}
  }
  return false;
}
function save() {
  S.ts = Date.now();
  pendiente = true;
  if (Date.now() - ultimaEscritura >= 1000) flush();
  else if (!saveT) saveT = setTimeout(flush, 1000);
}
/* Guarda una copia de la partida actual antes de reiniciar o de cargar otra */
function copiaAntesDeCambio() {
  try {
    lsSet(KEY_CAMBIO, JSON.stringify(S));
  } catch (e) {}
}
