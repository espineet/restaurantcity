/* guardado.js — Estado de la partida (S), carga, migración y guardado. */

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
let S = fresh(),
  tab = "rest";
try {
  const r = localStorage.getItem(KEY);
  if (r) S = load(JSON.parse(r));
} catch (e) {}
try {
  const o = { carne: "filete", pescado: "salmon", huevo: "huevos" };
  for (const k in S.stock) {
    if (o[k]) S.stock[o[k]] = (S.stock[o[k]] || 0) + S.stock[k];
  }
} catch (e) {}
/* migración de menú y almacén: se hace en initLayout, cuando ya existen todas las recetas */
let cat = "Verduras";
let remote = null,
  saveT = 0;
function flush() {
  clearTimeout(saveT);
  try {
    localStorage.setItem(KEY, JSON.stringify(S));
  } catch (e) {}
  if (remote) {
    try {
      remote.set({ s: JSON.stringify(S), t: S.ts || Date.now() }).catch(() => {});
    } catch (e) {}
  }
}
function save() {
  S.ts = Date.now();
  try {
    localStorage.setItem(KEY, JSON.stringify(S));
  } catch (e) {}
  clearTimeout(saveT);
  saveT = setTimeout(flush, 2500);
}
