/* cocina.js — Cocina: objetos, colocación, fogones, repostería; terraza; plantas y adornos detallados. */

function kitchenHtml(KW, KD) {
  return kitchenNew(KW, KD);
}

const KU = 26,
  KN = [
    "Fogón",
    "Nevera",
    "Barra de bebidas",
    "Encimera",
    "Estantería",
    "Planta",
    "Barril",
    "Mesa de trabajo",
    "Carro de platos",
    "Lavaplatos",
    "Mesa de repostería",
    "Nevera",
    "Arcón congelador",
  ];

const kDim = () => [Math.max(4, Math.floor(KWn() / KU)), Math.max(5, Math.floor(KDn() / KU))];
function kBlk(x, y) {
  const px = -KWn() + x * KU,
    py = y * KU;
  return px < -4 && px + KU > -38 && py < 122 && py + KU > 94;
}
function kFree(x, y, ex) {
  const d = kDim();
  if (x < 0 || y < 0 || x >= d[0] || y >= d[1] || kBlk(x, y)) return false;
  return !S.kobj.some((o, i) => i !== ex && o[0] === x && o[1] === y);
}
function kNext() {
  const d = kDim();
  for (let y = 0; y < d[1]; y++) for (let x = 0; x < d[0]; x++) if (kFree(x, y, -1)) return [x, y];
  return null;
}
function kPut(t, x, y) {
  const c = kFree(x, y, -1) ? [x, y] : kNext();
  if (!c) return false;
  S.kobj.push([c[0], c[1], t]);
  return true;
}
function kSync() {
  ccaFix();
  const B = fogN(),
    has = (t) => S.kobj.filter((o) => o[2] === t).length;
  if (!has(1)) kPut(1, 0, 0);
  while (has(0) > B) {
    const j = S.kobj.map((o) => o[2]).lastIndexOf(0);
    S.kobj.splice(j, 1);
  }
  while (has(0) < B) {
    if (!kPut(0, 1 + has(0), 0)) break;
  }
  if (S.kit >= 2 && !has(2)) kPut(2, 0, 2);
  while (has(10) < 1 + S.kit) {
    if (!kPut(10, 3, 0)) break;
  }
  if (!has(3)) kPut(3, 2, 3);
  if (!has(9)) kPut(9, 0, 1);
  if (S.kit >= 4 && has(3) < 2) kPut(3, 2, kDim()[1] - 3);
  ccaFix();
}
function kinit() {
  const old = (S.kobj || []).filter((o) => !Array.isArray(o) && o.t > 0);
  S.kobj = [];
  S.kv = 2;
  kSync();
  old.forEach((o) => kPut(o.t + 3, 2, 3));
}

const KHn1 = (X, Y, on, bx) =>
  bx(X + 1, Y + 1, 24, 24, 64, "#e8edf1") +
  bx(X + 1, Y + 1, 24, 24, 2, "#cfd6dc", 64) +
  bx(X + 1, Y + 25, 24, 1, 1, "#aeb8c0", 40) +
  bx(X + 14, Y + 25, 5, 1, 6, "#e74c3c", 48) +
  bx(X + 19, Y + 25, 4, 1, 5, "#f1c40f", 52) +
  bx(X + 13, Y + 25, 9, 1, 8, "#c7d2da", 26);
const KH = [
  (X, Y, on, bx) =>
    bx(X, Y + 1, 26, 24, 18, "#3d4650") +
    bx(X, Y + 1, 26, 24, 2, "#b8c0c8", 18) +
    bx(X + 3, Y + 4, 8, 8, 1, on ? "#ff8a3d" : "#2b2f33", 20) +
    bx(X + 15, Y + 4, 8, 8, 1, "#2b2f33", 20) +
    bx(X + 3, Y + 14, 8, 8, 1, "#2b2f33", 20) +
    bx(X + 15, Y + 14, 8, 8, 1, on ? "#ffb347" : "#2b2f33", 20) +
    (on ? bx(X + 4, Y + 5, 10, 10, 6, "#9aa0a6", 21) + bx(X + 3, Y + 4, 12, 12, 1, "#cfd8dc", 27) : "") +
    bx(X + 4, Y + 25, 4, 2, 3, "#222", 12) +
    bx(X + 11, Y + 25, 4, 2, 3, "#222", 12) +
    bx(X + 18, Y + 25, 4, 2, 3, "#222", 12) +
    bx(X + 3, Y + 25, 20, 1, 9, "#252b31", 3) +
    bx(X + 1, Y + 1, 24, 16, 3, "#9aa0a6", 54) +
    bx(X + 9, Y + 4, 8, 8, 16, "#b0b7be", 57) +
    bx(X + 6, Y + 26, 14, 1, 5, "#8fb3c9", 5) +
    bx(X + 5, Y + 26, 16, 1, 1, "#cfd8dc", 11) +
    bx(X + 2, Y + 25, 22, 1, 2, "#1e2429", 16) +
    (on ? bx(X + 11, Y + 25, 2, 2, 2, "#ff6b3d", 14) : ""),
  (X, Y, on, bx) =>
    bx(X + 1, Y + 1, 24, 24, 64, "#e8edf1") +
    bx(X + 1, Y + 1, 24, 24, 2, "#cfd6dc", 64) +
    bx(X + 1, Y + 25, 24, 1, 1, "#aeb8c0", 40) +
    bx(X + 4, Y + 25, 2, 2, 14, "#8a949c", 44) +
    bx(X + 4, Y + 25, 2, 2, 18, "#8a949c", 18) +
    bx(X + 14, Y + 25, 5, 1, 6, "#e74c3c", 48) +
    bx(X + 19, Y + 25, 4, 1, 5, "#f1c40f", 52) +
    bx(X + 3, Y + 25, 20, 1, 2, "#9aa5ad", 1) +
    bx(X + 13, Y + 25, 9, 1, 8, "#c7d2da", 26),
  (X, Y, on, bx) =>
    bx(X + 1, Y + 2, 24, 23, 18, "#6d4c41") +
    bx(X, Y + 1, 26, 25, 2, "#a1887f", 18) +
    bx(X + 3, Y + 25, 20, 1, 12, "#4e342e", 3) +
    bx(X + 3, Y + 5, 5, 5, 9, "#c0392b", 20) +
    bx(X + 4.5, Y + 6.5, 2, 2, 5, "#c0392b", 29) +
    bx(X + 10, Y + 5, 5, 5, 9, "#2f9e44", 20) +
    bx(X + 11.5, Y + 6.5, 2, 2, 5, "#2f9e44", 29) +
    bx(X + 17, Y + 5, 5, 5, 9, "#e0a526", 20) +
    bx(X + 18.5, Y + 6.5, 2, 2, 5, "#e0a526", 29) +
    bx(X + 4, Y + 15, 5, 5, 5, "#d6f0ff", 20) +
    bx(X + 13, Y + 16, 4, 6, 3, "#9aa0a6", 20),
  (X, Y, on, bx) =>
    bx(X, Y + 1, 26, 24, 16, "#b99b6b") +
    bx(X - 0.5, Y + 0.5, 27, 25, 2, "#ece6d8", 16) +
    bx(X + 12.5, Y + 25, 1, 1, 14, "#8a6f45", 1) +
    bx(X + 8, Y + 25, 2, 1, 3, "#555", 9) +
    bx(X + 16, Y + 25, 2, 1, 3, "#555", 9) +
    bx(X + 3, Y + 5, 12, 9, 1, "#d9a35c", 18) +
    bx(X + 17, Y + 7, 7, 2, 1, "#cfd8dc", 18) +
    bx(X + 17, Y + 13, 6, 6, 3, "#fff", 18) +
    bx(X + 18, Y + 14, 4, 4, 1, "#e74c3c", 21),
  (X, Y, on, bx) =>
    bx(X + 1, Y + 8, 24, 10, 2, "#8d5a3b", 6) +
    bx(X + 1, Y + 8, 24, 10, 2, "#8d5a3b", 20) +
    bx(X + 1, Y + 8, 24, 10, 2, "#8d5a3b", 34) +
    bx(X + 1, Y + 8, 2, 10, 38, "#6d4c41") +
    bx(X + 23, Y + 8, 2, 10, 38, "#6d4c41") +
    bx(X + 5, Y + 10, 6, 6, 8, "#c0392b", 8) +
    bx(X + 13, Y + 10, 6, 6, 8, "#2f9e44", 8) +
    bx(X + 5, Y + 10, 6, 6, 8, "#3498db", 22) +
    bx(X + 13, Y + 10, 6, 6, 8, "#e67e22", 22) +
    bx(X + 8, Y + 10, 10, 6, 6, "#f5f5f5", 36),
  (X, Y, on, bx) =>
    bx(X + 7, Y + 7, 12, 12, 9, "#b5651d") +
    bx(X + 6, Y + 6, 14, 14, 2, "#c97a2b", 9) +
    bx(X + 8, Y + 8, 10, 10, 1, "#4e342e", 11) +
    bx(X + 9, Y + 9, 8, 8, 12, "#2f9e44", 11) +
    bx(X + 7, Y + 10, 5, 5, 8, "#3cb44f", 14) +
    bx(X + 14, Y + 8, 5, 5, 10, "#27ae60", 14) +
    bx(X + 10, Y + 10, 6, 6, 6, "#43c463", 22),
  (X, Y, on, bx) =>
    bx(X + 4, Y + 4, 18, 18, 22, "#8d6e63") +
    bx(X + 4, Y + 4, 18, 18, 2, "#a1887f", 22) +
    bx(X + 3, Y + 3, 20, 20, 2, "#37474f", 4) +
    bx(X + 3, Y + 3, 20, 20, 2, "#37474f", 15) +
    bx(X + 11, Y + 22, 4, 3, 3, "#c9a227", 9),
  (X, Y, on, bx) =>
    bx(X + 1, Y + 2, 3, 3, 12, "#78909c") +
    bx(X + 22, Y + 2, 3, 3, 12, "#78909c") +
    bx(X + 1, Y + 21, 3, 3, 12, "#78909c") +
    bx(X + 22, Y + 21, 3, 3, 12, "#78909c") +
    bx(X + 2, Y + 3, 22, 20, 1, "#b0bec5", 4) +
    bx(X, Y + 1, 26, 24, 2, "#cfd8dc", 12) +
    bx(X + 4, Y + 5, 9, 9, 5, "#78909c", 14) +
    bx(X + 16, Y + 8, 6, 10, 2, "#fff", 14),
  (X, Y, on, bx) =>
    bx(X + 2, Y + 4, 22, 18, 2, "#78909c", 4) +
    bx(X + 2, Y + 4, 22, 18, 2, "#90a4ae", 16) +
    bx(X + 3, Y + 5, 2, 2, 12, "#607d8b", 4) +
    bx(X + 21, Y + 5, 2, 2, 12, "#607d8b", 4) +
    bx(X + 3, Y + 19, 2, 2, 12, "#607d8b", 4) +
    bx(X + 21, Y + 19, 2, 2, 12, "#607d8b", 4) +
    bx(X + 5, Y + 7, 8, 8, 7, "#fff", 18) +
    bx(X + 14, Y + 7, 7, 7, 9, "#f5f5f5", 18) +
    bx(X + 4, Y + 3, 3, 3, 3, "#222", 1) +
    bx(X + 19, Y + 20, 3, 3, 3, "#222", 1),
  (X, Y, on, bx) =>
    bx(X + 1, Y + 1, 24, 24, 20, "#cfd8dc") +
    bx(X, Y, 26, 26, 2, "#eceff1", 20) +
    bx(X + 2, Y + 25, 22, 1, 16, "#b0bec5", 2) +
    bx(X + 5, Y + 26, 16, 1, 1, "#546e7a", 15) +
    bx(X + 2, Y + 25, 22, 1, 3, "#37474f", 17) +
    bx(X + 5, Y + 26, 3, 1, 1, "#4caf50", 18) +
    bx(X + 10, Y + 26, 3, 1, 1, "#ffb300", 18) +
    bx(X + 15, Y + 26, 3, 1, 1, "#90a4ae", 18) +
    bx(X + 8, Y + 8, 6, 6, 2, "#fff", 22) +
    bx(X + 16, Y + 10, 5, 5, 3, "#80cbc4", 22),
  (X, Y, on, bx) =>
    bx(X + 2, Y + 2, 3, 3, 12, "#8d6e63") +
    bx(X + 21, Y + 2, 3, 3, 12, "#8d6e63") +
    bx(X + 2, Y + 21, 3, 3, 12, "#8d6e63") +
    bx(X + 21, Y + 21, 3, 3, 12, "#8d6e63") +
    bx(X, Y + 1, 26, 24, 2, "#f8bbd0", 12) +
    bx(X + 2, Y + 3, 22, 20, 1, "#fff", 14) +
    bx(X + 5, Y + 6, 9, 9, 5, "#f5d9a8", 15) +
    bx(X + 6, Y + 7, 7, 7, 3, "#f48fb1", 20) +
    bx(X + 9, Y + 9, 2, 2, 3, "#e53935", 23) +
    bx(X + 16, Y + 7, 5, 5, 3, "#a1887f", 15) +
    bx(X + 16, Y + 7, 5, 5, 2, "#ffcdd2", 18) +
    bx(X + 15, Y + 16, 8, 2, 2, "#d7b98a", 15),
  KHn1,
  (X, Y, on, bx) =>
    bx(X + 1, Y + 5, 24, 18, 3, "#546e7a", 2) +
    bx(X + 1, Y + 5, 24, 18, 16, "#eceff1", 5) +
    bx(X + 1, Y + 5, 24, 18, 2, "#b3e5fc", 21) +
    bx(X + 3, Y + 7, 20, 14, 1, "#cfe9f5", 23) +
    bx(X + 9, Y + 23, 8, 1, 3, "#607d8b", 12) +
    bx(X + 2, Y + 23, 22, 1, 2, "#4fc3f7", 8) +
    bx(X + 3, Y + 8, 6, 3, 1, "#fff", 24),
];
function kRot(k) {
  const d = kDim(),
    a = [k[1], k[0], d[1] - 1 - k[1], d[0] - 1 - k[0]];
  let r = 0;
  for (let i = 1; i < 4; i++) if (a[i] < a[r]) r = i;
  return r;
}
const kRB = (r, X, Y) => (u, v, w, d, h, c, z) =>
  r === 0
    ? bx(X + u, Y + v, w, d, h, c, z)
    : r === 1
      ? bx(X + v, Y + 26 - u - w, d, w, h, c, z)
      : r === 2
        ? bx(X + 26 - u - w, Y + 26 - v - d, w, d, h, c, z)
        : bx(X + 26 - v - d, Y + u, d, w, h, c, z);
function kpv(t) {
  return `<div class="mini"><div class="isom" style="transform:scale(1.25) rotateX(60deg) rotateZ(45deg)">${KH[t](-13, -13, 0, bx)}</div></div>`;
}
function chefSlot(i) {
  ccaFix();
  const p = isPas(i);
  let n = 0;
  for (let j = 0; j < i; j++) if (isPas(j) === p) n++;
  return cookSlot2(p ? 10 : 0, n);
}

function cookSlot2(t, i) {
  const x0 = -KWn(),
    s = S.kobj.filter((o) => o[2] === t)[i];
  if (!s) return [x0 + 30, 44];
  const d = kDim(),
    v = [
      [0, 1],
      [1, 0],
      [0, -1],
      [-1, 0],
    ][kRot(s)];
  let cx = s[0] + v[0],
    cy = s[1] + v[1];
  if (cx < 0 || cy < 0 || cx >= d[0] || cy >= d[1]) {
    cx = s[0];
    cy = s[1] + 1 < d[1] ? s[1] + 1 : s[1] - 1;
  }
  return [
    x0 + cx * KU + (v[0] > 0 ? 16 : v[0] < 0 ? 10 : 13),
    cy * KU + (v[1] > 0 ? 16 : v[1] < 0 ? 10 : 13),
  ];
}
const FLTX = [
  "repeating-linear-gradient(0deg,rgba(255,255,255,.06) 0 2px,rgba(0,0,0,.05) 2px 5px),",
  "linear-gradient(135deg,rgba(255,255,255,.22),transparent 45%),",
  "linear-gradient(115deg,transparent 40%,rgba(120,130,140,.18) 41%,transparent 43%),linear-gradient(60deg,transparent 60%,rgba(120,130,140,.14) 61%,transparent 63%),",
  "repeating-linear-gradient(90deg,rgba(255,255,255,.05) 0 1px,transparent 1px 4px),",
  "linear-gradient(135deg,rgba(255,255,255,.25),transparent 50%),",
  "repeating-linear-gradient(0deg,rgba(255,255,255,.05) 0 2px,rgba(0,0,0,.08) 2px 5px),",
  "radial-gradient(rgba(255,255,255,.18) 1px,transparent 1.5px) 0 0/10px 10px,",
  "repeating-linear-gradient(0deg,rgba(255,255,255,.06) 0 2px,rgba(0,0,0,.05) 2px 5px),",
  "radial-gradient(rgba(255,255,255,.08) 1px,transparent 1.5px) 0 0/9px 9px,",
  "radial-gradient(rgba(0,0,0,.07) 1px,transparent 1.5px) 0 0/7px 7px,radial-gradient(rgba(255,255,255,.08) 1px,transparent 1.5px) 3px 3px/9px 9px,",
];
const WLTX = [
  "radial-gradient(rgba(0,0,0,.035) 1px,transparent 1.5px) 0 0/8px 8px,",
  "radial-gradient(rgba(0,0,0,.035) 1px,transparent 1.5px) 0 0/8px 8px,",
  "radial-gradient(rgba(0,0,0,.04) 1px,transparent 1.5px) 0 0/8px 8px,",
  "repeating-linear-gradient(90deg,rgba(0,0,0,.14) 0 2px,transparent 2px 34px),linear-gradient(rgba(255,255,255,.1),transparent 40%),",
  "radial-gradient(rgba(0,0,0,.03) 1px,transparent 1.5px) 0 0/8px 8px,",
  "",
  "radial-gradient(rgba(255,255,255,.06) 1px,transparent 1.5px) 0 0/8px 8px,",
  "repeating-linear-gradient(0deg,rgba(255,255,255,.05) 0 2px,rgba(0,0,0,.06) 2px 5px),",
  "radial-gradient(rgba(255,255,255,.1) 1px,transparent 2px) 0 0/14px 11px,",
  "radial-gradient(rgba(0,0,0,.03) 1px,transparent 1.5px) 0 0/8px 8px,",
];
function dgrid(k) {
  return `<p class="mut"><b>${k === "p" ? "Plantas" : "Adornos"}</b></p><div class="grid">${PRICE[k].map((pr, i) => `<div class="card item">${pv(k, i)}<b>${nameOf(k, i)}</b><div class="mut">${pr} 🪙 · vende ${Math.floor(pr / 2)}</div><button class="s" onclick="buyItem('${k}',${i})" ${S.coins < pr ? "disabled" : ""}>Comprar</button></div>`).join("")}</div>`;
}
OPT.t.push(
  ["Mesa de terraza", "#cdb38b"],
  ["Mesa de hierro", "#3a4a4f", "r"],
  ["Mesa con sombrilla roja", "#e8d9b8", "u"],
  ["Mesa con sombrilla azul", "#e8d9b8", "u1"],
  ["Mesa con sombrilla verde", "#e8d9b8", "u2"],
  ["Mesa con sombrilla amarilla", "#e8d9b8", "u3"],
  ["Mesa con sombrilla naranja", "#e8d9b8", "u4"],
  ["Mesa con sombrilla rosa", "#e8d9b8", "u5"],
);
STC.push(
  ["Taburete de playa", "#f1dfae"],
  ["Taburete de mimbre", "#c9a66b"],
  ["Taburete de jardín", "#3b7a57"],
);
ADN.push("Farol de jardín", "Barril de vino", "Pizarra del menú", "Cubo de champán", "Calefactor de terraza");

OPT.c.push(["Silla de terraza", "#9c7b54"], ["Silla de mimbre", "#c9a66b"], ["Silla de hierro", "#374248"]);
BARS.push(["Barra de playa", "#c9a66b", "#f5e6c8"], ["Barra de jardín", "#5d7a4b", "#e6dfc8"]);
const TERA = { t: 10, c: 9, b: 6, s: 6, d: 8 },
  TCOST = 600,
  TRn = () => 0,
  GRn = () => SRn(),
  TSZ = (L) => 4 + 2 * L,
  TCn = () => (S.ter && lvl() >= 10 ? TSZ(Math.min(5, S.terL | 0)) : 0),
  TRw = () => Math.min(SRn(), TSZ(Math.min(5, S.terL | 0))),
  TY0 = () => Math.max(0, SRn() - TRw()),
  TUP = [400, 600, 800, 1000, 1300],
  inGrid = (n) =>
    n[0] >= 0 &&
    n[1] >= 0 &&
    ((n[0] < SCn() && n[1] < SRn()) ||
      (TCn() > 0 && n[0] >= SCn() && n[0] < SCn() + TCn() && n[1] >= TY0() && n[1] < SRn()));
const dp = (s) => (s.cx >= SCn() ? [[(SCn() + 1) * CS + 20, SRn() * CS + 14]] : [[DOOR(), SRn() * CS - 6]]);
function terBuild() {
  if (lvl() < 10 || S.ter || S.coins < TCOST) return;
  S.coins -= TCOST;
  S.ter = 1;
  save();
  draw();
}

function zgrid() {
  const L = lvl();
  if (L < 10) return `<p class="mut">🔒 La terraza se desbloquea en el nivel 10 (ahora eres nivel ${L}).</p>`;
  if (!S.ter)
    return `<p class="mut">Amplía tu restaurante con una terraza en el solar de la derecha: 4×4 casillas para mesas, sillas y barras, con entrada desde la calle y puerta de servicio.</p><button class="big" ${S.coins < TCOST ? "disabled" : ""} onclick="terBuild()">🌿 Construir terraza · ${TCOST} 🪙</button>`;
  const g = (k, n) =>
    `<p class="mut"><b>${n}</b></p><div class="grid">${PRICE[k].map((pr, i) => (!isT(k, i) ? "" : `<div class="card item">${pv(k, i)}<b>${nameOf(k, i)}</b><div class="mut">${pr} 🪙 · vende ${Math.floor(pr / 2)}</div><button class="s" onclick="buyItem('${k}',${i})" ${S.coins < pr ? "disabled" : ""}>Comprar</button></div>`)).join("")}</div>`;
  return (
    `<p class="mut">Terraza de ${TCn()}×${TRw()} casillas en el solar de la derecha (para ampliarla ve a 🔧 Mejoras). Colócalo en sus casillas; la entrada y la puerta de servicio quedan libres.</p>` +
    g("t", "Mesas de terraza") +
    g("c", "Sillas de terraza") +
    g("b", "Barras de terraza") +
    g("s", "Taburetes de terraza (para la barra)") +
    g("d", "Adornos de terraza")
  );
}
const RB40 = (r, X, Y) => (u, v, w, d, h, c, z) =>
  r === 0
    ? bx(X + u, Y + v, w, d, h, c, z)
    : r === 1
      ? bx(X + v, Y + 40 - u - w, d, w, h, c, z)
      : r === 2
        ? bx(X + 40 - u - w, Y + 40 - v - d, w, d, h, c, z)
        : bx(X + 40 - v - d, Y + u, d, w, h, c, z);
function dRot(p) {
  const a = [p[1], p[0], SRn() - 1 - p[1], SCn() - 1 - p[0]];
  let r = 0;
  for (let i = 1; i < 4; i++) if (a[i] < a[r]) r = i;
  return r;
}

function plH(X, Y, s) {
  s |= 0;
  const B = (u, v, w, d, h, c, z) => bx(X + u, Y + v, w, d, h, c, z),
    C = (cx, cy, d, h, c, z) => dsc(X + cx - d / 2, Y + cy - d / 2, d, h, c, z),
    S3 = (cx, cy, D, z, c) =>
      [
        [0.6, 0],
        [0.92, 0.2],
        [1, 0.45],
        [0.92, 0.7],
        [0.6, 0.9],
      ]
        .map(([f, t], j) => C(cx, cy, D * f, 2, lt(c, j * 8 - 8), z + D * t))
        .join(""),
    pot = (c1, c2) =>
      C(20, 20, 18, 10, c1 || "#b5651d", 0) +
      C(20, 20, 22, 2, c2 || "#c97a2b", 10) +
      C(20, 20, 16, 0, "#4e342e", 12.5);
  switch (s) {
    case 10:
      return (
        pot() +
        C(16, 20, 2, 16, "#2f9e44", 13) +
        C(20, 18, 2, 20, "#2f9e44", 13) +
        C(24, 21, 2, 15, "#2f9e44", 13) +
        C(16, 20, 6, 4, "#e84393", 29) +
        C(20, 18, 6, 4, "#f1c40f", 33) +
        C(24, 21, 6, 4, "#e74c3c", 28)
      );
    case 11:
      return (
        pot() +
        S3(20, 20, 16, 13, "#6aa84f") +
        [
          [14, 16],
          [18, 23],
          [22, 15],
          [26, 21],
          [20, 19],
        ]
          .map(
            ([a, b], j) =>
              C(a, b, 4, 12 + (j % 2) * 4, "#8e6bbf", 15) + C(a, b, 2, 3, "#b79ae0", 27 + (j % 2) * 4),
          )
          .join("")
      );
    case 12:
      return (
        pot() +
        C(20, 20, 4, 18, "#6b4226", 13) +
        S3(20, 20, 26, 28, "#2f9e44") +
        C(14, 18, 4, 4, "#f39c12", 34) +
        C(26, 22, 4, 4, "#f39c12", 38) +
        C(20, 26, 4, 4, "#f39c12", 32)
      );
    case 0:
      return (
        pot() +
        C(20, 20, 4, 16, "#6b4226", 13) +
        S3(20, 20, 26, 22, "#3cb44f") +
        S3(25, 17, 12, 38, "#52c765")
      );
    case 1:
      return (
        pot() +
        C(20, 20, 10, 22, "#3d9a4a", 13) +
        S3(20, 20, 10, 31, "#3d9a4a") +
        B(12, 18, 5, 4, 3, "#3d9a4a", 22) +
        C(12, 20, 4, 10, "#3d9a4a", 22) +
        B(23, 18, 5, 4, 3, "#3d9a4a", 26) +
        C(28, 20, 4, 9, "#3d9a4a", 26) +
        C(20, 20, 5, 1, "#f48fb1", 41)
      );
    case 2:
      return (
        pot() +
        C(20, 20, 12, 6, "#2f9e44", 13) +
        B(14.5, 15.5, 1.5, 1.5, 9, "#2f9e44", 13) +
        B(25.5, 16.5, 1.5, 1.5, 12, "#2f9e44", 13) +
        B(19.5, 24.5, 1.5, 1.5, 8, "#2f9e44", 13) +
        C(15, 16, 8, 1, "#fff", 22) +
        C(15, 16, 3, 1, "#f1c40f", 23) +
        C(26, 17, 8, 1, "#fff", 25) +
        C(26, 17, 3, 1, "#f1c40f", 26) +
        C(20, 25, 8, 1, "#fff", 21) +
        C(20, 25, 3, 1, "#f1c40f", 22)
      );
    case 3:
      return (
        pot() +
        C(20, 20, 26, 3, "#2f9e44", 13) +
        C(20, 20, 22, 3, "#3cb44f", 17) +
        C(20, 20, 16, 3, "#43b05a", 21) +
        C(20, 20, 9, 3, "#52c765", 25)
      );
    case 4:
      return (
        S3(20, 20, 28, 0, "#2f9e44") +
        S3(13, 24, 14, 10, "#3cb44f") +
        C(23, 17, 4, 1, "#e74c3c", 25) +
        C(16, 19, 4, 1, "#e74c3c", 26) +
        C(26, 24, 4, 1, "#e74c3c", 17)
      );
    case 5:
      return (
        pot() +
        C(20, 20, 6, 36, "#8d5a3b", 13) +
        C(20, 20, 7, 1, "#6b4226", 24) +
        C(20, 20, 7, 1, "#6b4226", 34) +
        B(6, 18, 28, 4, 3, "#2f9e44", 49) +
        B(18, 6, 4, 28, 3, "#43b05a", 51) +
        C(20, 20, 10, 2, "#3cb44f", 52) +
        C(17, 17, 4, 2, "#6b4226", 46) +
        C(23, 22, 4, 2, "#6b4226", 46)
      );
    case 6:
      return (
        C(20, 20, 22, 5, "#8d6e63", 0) +
        C(20, 20, 25, 1, "#a1887f", 5) +
        C(20, 20, 18, 0, "#4e342e", 6.5) +
        C(20, 20, 4, 10, "#5d4037", 7) +
        C(18, 20, 16, 2, "#2f9e44", 16) +
        C(22, 19, 13, 2, "#3cb44f", 19) +
        C(19, 20, 9, 2, "#52c765", 22)
      );
    case 7:
      return (
        pot("#eceff1", "#cfd8dc") +
        C(20, 20, 2, 22, "#2f9e44", 13) +
        B(10, 17, 9, 4, 2, "#43b05a", 13) +
        B(21, 22, 9, 4, 2, "#43b05a", 13) +
        C(16, 17, 7, 1, "#f8bbd0", 32) +
        C(24, 20, 7, 1, "#f48fb1", 35) +
        C(19, 25, 7, 1, "#f8bbd0", 28) +
        C(19, 18, 3, 1, "#f1c40f", 33)
      );
    case 8:
      return (
        pot() +
        C(15, 16, 4, 34, "#7cb342", 13) +
        C(22, 22, 4, 42, "#8bc34a", 13) +
        C(25, 15, 4, 30, "#7cb342", 13) +
        C(15, 16, 5, 1, "#558b2f", 24) +
        C(22, 22, 5, 1, "#558b2f", 30) +
        C(22, 22, 5, 1, "#558b2f", 40) +
        C(25, 15, 5, 1, "#558b2f", 22) +
        C(22, 22, 12, 2, "#9ccc65", 53)
      );
    default:
      return (
        pot() +
        C(20, 20, 3, 30, "#2f9e44", 13) +
        C(20, 20, 21, 1, "#f9a825", 42) +
        C(20, 20, 17, 3, "#f1c40f", 43) +
        C(20, 20, 9, 3, "#5d4037", 45) +
        B(21, 17, 9, 4, 2, "#43b05a", 24)
      );
  }
}
function dcH(X, Y, s, r) {
  s |= 0;
  const B = RB40(r | 0, X, Y),
    C = (cx, cy, d, h, c, z) => dsc(X + cx - d / 2, Y + cy - d / 2, d, h, c, z),
    S3 = (cx, cy, D, z, c) =>
      [
        [0.6, 0],
        [0.92, 0.2],
        [1, 0.45],
        [0.92, 0.7],
        [0.6, 0.9],
      ]
        .map(([f, t], j) => C(cx, cy, D * f, 2, lt(c, j * 8 - 8), z + D * t))
        .join("");
  switch (s) {
    case 13:
      return (
        B(5, 10, 30, 22, 25, "#1c1c1c", 7) +
        B(4, 9, 32, 24, 2, "#111", 32) +
        B(6, 31, 28, 6, 3, "#fafafa", 19) +
        B(8, 31, 2, 6, 2, "#111", 22) +
        B(12, 31, 2, 6, 2, "#111", 22) +
        B(18, 31, 2, 6, 2, "#111", 22) +
        B(22, 31, 2, 6, 2, "#111", 22) +
        B(26, 31, 2, 6, 2, "#111", 22) +
        B(8, 32, 24, 0.5, 6, "#1c1c1c", 22) +
        B(9, 12, 22, 1, 9, "#2b2b2b", 34) +
        B(11, 11.4, 18, 0.5, 7, "#fafafa", 35) +
        B(6, 28, 4, 4, 7, "#111") +
        B(30, 28, 4, 4, 7, "#111") +
        B(7, 12, 3, 3, 7, "#111") +
        B(30, 12, 3, 3, 7, "#111") +
        B(17, 35, 6, 2, 1, "#c9a227", 2)
      );
    case 14:
      return (
        B(7, 15, 6, 10, 3, "#6d4c41") +
        B(27, 15, 6, 10, 3, "#6d4c41") +
        B(8, 17, 24, 4, 48, "#c9a227", 3) +
        B(10, 21, 20, 1, 44, "#d6f0ff", 5) +
        B(12, 21.6, 3, 0.5, 34, "#ffffff", 9) +
        B(17, 21.6, 1.5, 0.5, 20, "#ffffff", 14) +
        B(8, 17, 24, 4, 3, "#e0b84a", 51) +
        B(14, 17, 12, 4, 3, "#e0b84a", 54)
      );
    case 15:
      return (
        C(20, 20, 16, 2, "#5a4636", 0) +
        B(19, 19, 2.5, 2.5, 52, "#6d4c41", 2) +
        B(12, 19, 16, 2, 2, "#6d4c41", 46) +
        B(11, 18.5, 3, 3, 4, "#8d6e43", 46) +
        B(26, 18.5, 3, 3, 4, "#8d6e43", 46) +
        B(12, 21, 6, 3, 19, "#c0392b", 26) +
        B(12, 21, 6, 1, 4, "#e57373", 41) +
        B(22, 21, 6, 3, 22, "#2e5aa8", 23) +
        B(23, 20, 4, 5, 2, "#8d6e43", 44) +
        C(20, 20, 7, 3, "#8d5a3b", 52) +
        C(20, 20, 12, 1, "#8d5a3b", 51)
      );
    case 0:
      return (
        C(20, 20, 12, 2, "#37474f", 0) +
        C(20, 20, 8, 1, "#546e7a", 2) +
        B(19, 19, 2, 2, 46, "#607d8b", 3) +
        C(20, 20, 18, 3, "#c9a24a", 48) +
        C(20, 20, 16, 3, "#dcb85e", 51) +
        C(20, 20, 14, 3, "#ecd07e", 54) +
        C(20, 20, 11, 2, "#fff0b8", 57) +
        C(20, 20, 4, 2, "#fffde7", 59) +
        (isNight() ? C(20, 20, 38, 0, "rgba(255,225,130,.22)", 0.6) : "")
      );
    case 1:
      return (
        B(9, 9, 22, 22, 3, "#cfd8dc") +
        B(11, 11, 18, 18, 3, "#dfe6ea", 3) +
        C(20, 20, 13, 34, "#eceff1", 6) +
        B(13.6, 19, 1, 2, 32, "#d3dce1", 7) +
        B(25.4, 19, 1, 2, 32, "#cfd8dc", 7) +
        B(19, 13.6, 2, 1, 32, "#d3dce1", 7) +
        B(19, 25.4, 2, 1, 32, "#cfd8dc", 7) +
        C(20, 20, 17, 3, "#dfe6ea", 40) +
        B(9, 9, 22, 22, 3, "#cfd8dc", 43) +
        B(11, 11, 18, 18, 2, "#eceff1", 46)
      );
    case 2:
      return (
        B(9, 9, 22, 22, 3, "#90a4ae") +
        B(11, 11, 18, 18, 17, "#eceff1", 3) +
        B(10, 10, 20, 20, 2, "#cfd8dc", 20) +
        C(20, 20, 10, 10, "#8d9ea7", 22) +
        C(20, 20, 15, 3, "#8d9ea7", 30) +
        B(9, 18, 4, 4, 10, "#8d9ea7", 24) +
        B(27, 18, 4, 4, 10, "#8d9ea7", 24) +
        C(20, 20, 5, 3, "#8d9ea7", 33) +
        S3(20, 20, 10, 35, "#a9b8c0")
      );
    case 3:
      return (
        B(6, 8, 28, 24, 10, "#5d4037") +
        B(7, 9, 26, 22, 2, "#4e342e", 10) +
        B(7, 9, 26, 22, 18, "#9edcf0", 12) +
        B(8, 10, 24, 20, 2, "#d7c29a", 12) +
        B(8, 10, 24, 20, 15, "#6ec6e6", 14) +
        B(10, 11, 2, 2, 11, "#2f9e44", 14) +
        B(13, 11, 2, 2, 7, "#43a047", 14) +
        B(28, 12, 2, 2, 9, "#388e3c", 14) +
        B(14, 19, 6, 2, 4, "#ff9800", 21) +
        B(12, 19, 2, 2, 3, "#ffb74d", 21.5) +
        B(22, 22, 5, 2, 3, "#f06292", 25) +
        B(20, 22, 2, 2, 2, "#f8bbd0", 25.5) +
        B(18, 24, 1.5, 1.5, 1.5, "#e1f5fe", 27) +
        B(19, 26, 1.5, 1.5, 1.5, "#e1f5fe", 30) +
        B(6, 8, 28, 24, 2, "#455a64", 30) +
        B(10, 13, 20, 3, 1, "#fff8e1", 32)
      );
    case 4:
      return (
        B(11, 13, 18, 14, 5, "#4e342e") +
        B(13, 15, 14, 10, 33, "#6d4c41", 5) +
        B(15, 25, 10, 1, 22, "#3e2723", 10) +
        B(19, 25.6, 2, 0.6, 14, "#c9a227", 14) +
        B(17.5, 25.6, 5, 0.6, 4, "#e0b84a", 10) +
        B(11, 13, 18, 14, 14, "#6d4c41", 38) +
        B(13, 26, 14, 1, 11, "#fff8e1", 40) +
        B(19.4, 26.6, 1.2, 0.5, 5, "#222", 45) +
        B(19.4, 26.6, 4, 0.5, 1.2, "#222", 45) +
        B(10, 12, 20, 16, 3, "#4e342e", 52) +
        B(17, 17, 6, 6, 4, "#c9a227", 55)
      );
    case 5:
      return (
        C(20, 20, 35, 8, "#cfd8dc", 0) +
        C(20, 20, 31, 1, "#4fc3f7", 8) +
        C(20, 20, 6, 18, "#b0bec5", 8) +
        C(20, 20, 18, 3, "#cfd8dc", 24) +
        C(20, 20, 14, 1, "#4fc3f7", 27) +
        C(20, 20, 2, 6, "#81d4fa", 27)
      );
    case 6:
      return (
        B(7, 11, 26, 18, 5, "#6d1f17") +
        B(8, 12, 24, 16, 24, "#b03a2e", 5) +
        B(9, 12, 22, 16, 3, "#c0392b", 29) +
        B(11, 12, 18, 16, 3, "#c0392b", 32) +
        B(14, 12, 12, 16, 3, "#d4553f", 35) +
        B(11, 28, 18, 1, 16, "#ffe082", 10) +
        B(12, 28.6, 16, 0.5, 3, "#ff8a65", 20) +
        B(9, 28, 2, 1, 22, "#cfd8dc", 6) +
        B(29, 28, 2, 1, 22, "#cfd8dc", 6) +
        B(8, 28, 24, 1, 3, "#cfd8dc", 5) +
        B(12, 29, 3, 1, 3, "#4caf50", 27) +
        B(18, 29, 3, 1, 3, "#2196f3", 27) +
        B(24, 29, 3, 1, 3, "#f1c40f", 27) +
        B(13, 28.6, 14, 0.5, 4, "#37474f", 14)
      );
    case 8:
      return (
        C(20, 20, 10, 2, "#37474f", 0) +
        C(20, 20, 3, 36, "#455a64", 2) +
        B(14, 14, 12, 12, 2, "#263238", 36) +
        B(15, 15, 10, 10, 12, "#ffd54f", 38) +
        B(13, 13, 14, 14, 2, "#263238", 50) +
        B(17, 17, 6, 6, 4, "#263238", 52)
      );
    case 9:
      return (
        C(20, 20, 22, 3, "#6d4c41", 0) +
        C(20, 20, 28, 3, "#7d4e2e", 3) +
        C(20, 20, 31, 9, "#8d5a3b", 6) +
        C(20, 20, 28, 3, "#7d4e2e", 15) +
        C(20, 20, 31, 2, "#455a64", 5) +
        C(20, 20, 33, 2, "#455a64", 9.5) +
        C(20, 20, 31, 2, "#455a64", 14) +
        C(20, 20, 23, 1, "#a1704a", 18) +
        B(27, 17, 7, 5, 3, "#b0bec5", 8) +
        B(32, 18, 2, 3, 5, "#8d6e63", 5)
      );
    case 10:
      return (
        B(7, 15, 3, 10, 36, "#8d5a3b") +
        B(30, 15, 3, 10, 36, "#8d5a3b") +
        B(7, 15, 26, 10, 3, "#8d5a3b", 30) +
        B(10, 17, 20, 6, 24, "#2b3a35", 6) +
        B(12, 16, 16, 1, 2, "#fff", 24) +
        B(12, 16, 11, 1, 2, "#fff", 20) +
        B(12, 16, 13, 1, 2, "#ffd54f", 15) +
        B(7, 15, 26, 10, 2, "#8d5a3b", 4)
      );
    case 11:
      return (
        B(12, 12, 16, 16, 3, "#607d8b") +
        C(20, 20, 20, 16, "#90a4ae", 3) +
        C(20, 20, 22, 2, "#cfd8dc", 18) +
        C(20, 20, 17, 1, "#b3e5fc", 19) +
        B(11, 13, 5, 5, 4, "#e1f5fe", 19) +
        B(23, 12, 5, 5, 4, "#e1f5fe", 19) +
        B(17, 24, 5, 5, 3, "#e1f5fe", 19) +
        C(16, 17, 6, 16, "#1b5e20", 12) +
        C(16, 17, 2.6, 8, "#1b5e20", 28) +
        C(16, 17, 3.4, 2, "#ffd54f", 34) +
        C(25, 19, 6, 16, "#2e7d32", 12) +
        C(25, 19, 2.6, 8, "#2e7d32", 28) +
        C(25, 19, 3.4, 2, "#ffd54f", 34) +
        C(20, 16, 6, 3, "#fafafa", 28)
      );
    case 12:
      return (
        C(20, 20, 16, 2, "#37474f", 0) +
        C(20, 20, 3, 50, "#78909c", 2) +
        C(20, 20, 20, 3, "#b0bec5", 50) +
        C(20, 20, 15, 3, "#cfd8dc", 53) +
        C(20, 20, 10, 3, "#eceff1", 56) +
        C(20, 20, 8, 2, "#ff7043", 58) +
        C(20, 20, 4, 2, "#ffab40", 60)
      );
    default:
      return (
        B(6, 12, 2, 10, 40, "#6d4c41") +
        B(32, 12, 2, 10, 40, "#6d4c41") +
        B(6, 12, 28, 10, 2, "#8d5a3b", 2) +
        B(6, 12, 28, 10, 2, "#8d5a3b", 14) +
        B(6, 12, 28, 10, 2, "#8d5a3b", 26) +
        B(6, 12, 28, 10, 2, "#8d5a3b", 38) +
        B(9, 14, 3, 6, 8, "#c0392b", 4) +
        B(13, 14, 3, 6, 10, "#3498db", 4) +
        B(17, 14, 4, 6, 7, "#f1c40f", 4) +
        B(22, 14, 3, 6, 9, "#2f9e44", 16) +
        B(26, 14, 4, 6, 7, "#e67e22", 16) +
        B(10, 14, 5, 6, 8, "#8e44ad", 28) +
        B(17, 14, 3, 6, 9, "#c0392b", 28)
      );
  }
}
OPT.kf = [
  ["Baldosa clara", "conic-gradient(#ece8de 25%,#dcd7ca 0 50%,#ece8de 0 75%,#dcd7ca 0) 0 0/52px 52px", 0],
  [
    "Azulejo blanco",
    "linear-gradient(rgba(0,0,0,.14) 1px,transparent 1px) 0 0/26px 26px,linear-gradient(90deg,rgba(0,0,0,.14) 1px,transparent 1px) 0 0/26px 26px,#f4f6f7",
    40,
  ],
  ["Gres gris", "conic-gradient(#b8bcc0 25%,#a7abaf 0 50%,#b8bcc0 0 75%,#a7abaf 0) 0 0/52px 52px", 60],
  ["Baldosa roja", "conic-gradient(#b5523c 25%,#9c432f 0 50%,#b5523c 0 75%,#9c432f 0) 0 0/52px 52px", 70],
  [
    "Terrazo",
    "radial-gradient(#8a8f95 1px,transparent 1.5px) 0 0/9px 9px,radial-gradient(#c9a58a 1px,transparent 1.6px) 4px 5px/13px 13px,#e3e0da",
    80,
  ],
  [
    "Antideslizante oscuro",
    "repeating-linear-gradient(45deg,rgba(255,255,255,.07) 0 2px,transparent 2px 6px),#4a5258",
    90,
  ],
  [
    "Damero industrial",
    "conic-gradient(#2f3a40 25%,#e8ecee 0 50%,#2f3a40 0 75%,#e8ecee 0) 0 0/52px 52px",
    110,
  ],
];
const KWG = (c, t) =>
  `linear-gradient(rgba(0,0,0,.14) 1px,transparent 1px) 0 0/${t[0]}px ${t[1]}px,linear-gradient(90deg,rgba(0,0,0,.14) 1px,transparent 1px) 0 0/${t[2]}px ${t[1] * 2}px,${c}`;
OPT.kw = [
  ["Estuco crema", "#eee9df", 0, "#e3dccd"],
  ["Azulejo blanco", KWG("#f6f8f9", [20, 20, 20]), 40, KWG("#e9eef0", [20, 20, 20])],
  [
    "Acero inoxidable",
    "linear-gradient(90deg,rgba(255,255,255,.35),transparent 30%,rgba(0,0,0,.08) 60%,transparent) 0 0/60px 100%,#b9c2c8",
    90,
    "linear-gradient(90deg,rgba(255,255,255,.3),transparent 30%,rgba(0,0,0,.08) 60%,transparent) 0 0/60px 100%,#a9b3ba",
  ],
  ["Azulejo metro verde", KWG("#8fb89d", [22, 11, 44]), 60, KWG("#7fa88d", [22, 11, 44])],
  ["Azulejo metro azul", KWG("#8fb2c8", [22, 11, 44]), 60, KWG("#7fa2b8", [22, 11, 44])],
  [
    "Ladrillo blanco",
    "repeating-linear-gradient(90deg,rgba(0,0,0,.12) 0 2px,transparent 2px 40px),repeating-linear-gradient(0deg,rgba(0,0,0,.12) 0 2px,transparent 2px 20px),#f1eee8",
    50,
    "repeating-linear-gradient(90deg,rgba(0,0,0,.12) 0 2px,transparent 2px 40px),repeating-linear-gradient(0deg,rgba(0,0,0,.12) 0 2px,transparent 2px 20px),#e6e2da",
  ],
  ["Gris pizarra", "#6b757c", 70, "#5d676e"],
];
const KWG4 = (c, t) =>
  `linear-gradient(90deg,rgba(0,0,0,.14) 1px,transparent 1px) 0 0/${t[1]}px ${t[0]}px,linear-gradient(rgba(0,0,0,.14) 1px,transparent 1px) 0 0/${t[1] * 2}px ${t[2]}px,${c}`;
{
  const k = OPT.kw;
  k[1][3] = KWG4("#e9eef0", [20, 20, 20]);
  k[2][3] = swp(k[2][3]);
  k[3][3] = KWG4("#7fa88d", [22, 11, 44]);
  k[4][3] = KWG4("#7fa2b8", [22, 11, 44]);
  k[5][3] = swp(k[5][3]);
  k.push(
    ["Azulejo metro amarillo", KWG("#f1d98a", [22, 11, 44]), 60, KWG4("#e3c978", [22, 11, 44])],
    ["Azulejo metro blanco", KWG("#f6f8f9", [22, 11, 44]), 55, KWG4("#e9eef0", [22, 11, 44])],
    ["Estuco rosado", "#f0d9d2", 35, "#e4c8bf"],
  );
  OPT.kf.push(
    ["Baldosa verde", "conic-gradient(#cfe3d4 25%,#b9d4c0 0 50%,#cfe3d4 0 75%,#b9d4c0) 0 0/52px 52px", 65],
    ["Madera clara", "repeating-linear-gradient(90deg,#d9b88f 0 30px,#c9a574 30px 32px)", 75],
    ["Cemento pulido", "#9aa0a4", 55],
  );
}
function kpvl(k, i) {
  return k === "kf"
    ? `<div class="pvf"><i style="background:${OPT.kf[i][1]}"></i></div>`
    : `<div class="pvf"><i class="pw" style="background:${OPT.kw[i][1]}"></i></div>`;
}
function klook(k, n) {
  return `<p class="mut"><b>${n}</b></p><div class="grid">${OPT[k]
    .map((o, i) => {
      const own = i === 0 || S.own.includes(k + i),
        use = (S.look[k] | 0) === i;
      return `<div class="card item">${kpvl(k, i)}<b>${o[0]}</b><div class="mut">${own ? (use ? "✔ En uso" : "Tuyo") : o[2] + " 🪙"}</div><button class="s" onclick="style_('${k}',${i})" ${use || (!own && S.coins < o[2]) ? "disabled" : ""}>${own ? "Usar" : "Comprar"}</button></div>`;
    })
    .join("")}</div>`;
}
function mgrid(k, n) {
  return `<p class="mut"><b>${n}</b></p><div class="grid">${PRICE[k].map((pr, i) => (isT(k, i) ? "" : `<div class="card item">${pv(k, i)}<b>${nameOf(k, i)}</b><div class="mut">${pr} 🪙 · vende ${Math.floor(pr / 2)}</div><button class="s" onclick="buyItem('${k}',${i})" ${S.coins < pr ? "disabled" : ""}>Comprar</button></div>`)).join("")}</div>`;
}
