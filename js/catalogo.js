/* catalogo.js — Catálogo: precios, más opciones, tejados, colocación de objetos e inventario. */

const NM = {
    k: "Cocina",
    t: "Mesa",
    c: "Silla",
    p: "Planta",
    b: "Barra",
    s: "Taburete",
    d: "Adorno",
    v: "Ventana",
    u: "Ventana de pared",
    q: "Ventana de cocina",
  },
  PLN = [
    "Ficus",
    "Cactus",
    "Margaritas",
    "Helecho",
    "Arbusto",
    "Palmera",
    "Bonsái",
    "Orquídea",
    "Bambú",
    "Girasol",
  ],
  PRICE = {
    k: [0, 0, 0, 0, 25, 15, 20, 40, 35, 0, 60, 80, 140],
    t: [60, 75, 75, 90, 100, 100, 90, 100, 95, 130, 70, 85, 120],
    c: [20, 25, 25, 30, 30, 35, 45, 45, 45, 25, 30, 35],
    p: [25, 30, 35, 40, 55, 70, 80, 60, 50, 45],
    b: [120, 150, 150, 180, 200, 220, 140, 170],
    s: [15, 20, 25, 25, 25, 25],
    d: [40, 60, 90, 120, 100, 150, 200, 80],
  },
  ARR = (k) =>
    ({
      t: S.tbl,
      c: S.chr,
      p: S.plt,
      b: S.bars,
      s: S.stl,
      d: S.dec,
      v: S.wins,
      u: S.bw,
      q: S.kwn,
      k: S.kobj,
    })[k],
  nameOf = (k, s) =>
    k === "t"
      ? OPT.t[s][0]
      : k === "c"
        ? OPT.c[s][0]
        : k === "b"
          ? BARS[s][0]
          : k === "s"
            ? STC[s][0]
            : k === "d"
              ? ADN[s]
              : k === "v" || k === "u" || k === "q"
                ? EXT.win[s][0]
                : PLN[s],
  label = (k, s) =>
    k === "k"
      ? KN[s]
      : k === "p" || k === "d" || (k === "s" && s >= 6) || (k === "u" && EXT.win[s] && EXT.win[s][4])
        ? nameOf(k, s)
        : NM[k] + " " + nameOf(k, s),
  half = (k, s) => Math.floor(PRICE[k][s | 0] / 2);
PRICE.t.push(120, 120, 120, 120, 120);
PRICE.s.push(30, 35, 40);
PRICE.d.push(45, 80, 50, 110, 160);
PRICE.v = [30, 60, 90, 120, 150, 180, 210, 240, 270];
PRICE.u = PRICE.v.slice();
PRICE.q = PRICE.v.slice();
/* ===== Más opciones de catálogo ===== */
const TEND = { t: OPT.t.length, c: OPT.c.length, b: BARS.length, s: STC.length, d: ADN.length },
  isT = (k, i) => i >= TERA[k] && i < TEND[k];
OPT.f.push(
  ["Pizarra", "conic-gradient(#59636b 25%,#4b545b 0 50%,#59636b 0 75%,#4b545b 0) 0 0/60px 60px", 110],
  ["Terracota", "conic-gradient(#c8704a 25%,#b45f3c 0 50%,#c8704a 0 75%,#b45f3c 0) 0 0/50px 50px", 120],
  ["Espiga", "repeating-linear-gradient(45deg,#c9a574 0 14px,#b58f5c 14px 16px),#c9a574", 140],
  ["Damero negro", "conic-gradient(#222 25%,#eee 0 50%,#222 0 75%,#eee 0) 0 0/60px 60px", 150],
  ["Madera ceniza", "repeating-linear-gradient(90deg,#cfc6b8 0 34px,#b9b0a2 34px 36px)", 130],
  ["Moqueta verde", "repeating-linear-gradient(0deg,#2f6b4a 0 6px,#2a5f42 6px 12px)", 110],
  ["Azul marino", "#2c3e63", 100],
);
OPT.w.push(
  ["Ladrillo blanco", "repeating-linear-gradient(0deg,#ece6dc 0 18px,#cfc7ba 18px 20px)", 120],
  ["Verde oliva", "#8a9a5b", 90],
  ["Mostaza", "#e1b12c", 90],
  ["Gris perla", "#cfd3d6", 80],
  ["Burdeos", "#7b2d3b", 100],
  ["Madera clara", "repeating-linear-gradient(90deg,#d9b88f 0 28px,#c9a574 28px 30px)", 130],
  ["Madera oscura", "repeating-linear-gradient(90deg,#5d4037 0 28px,#4a312a 28px 30px)", 140],
  [
    "Azulejo turquesa",
    "linear-gradient(rgba(0,0,0,.12) 1px,transparent 1px) 0 0/20px 20px,linear-gradient(90deg,rgba(0,0,0,.12) 1px,transparent 1px) 0 0/20px 20px,#5bb5b0",
    150,
  ],
);
OPT.t.push(
  ["Mesa verde", "#3f8f5f"],
  ["Mesa gris", "#7f8c8d"],
  ["Mesa nogal", "#5d4037"],
  ["Mesa amarilla", "#e6b422"],
  ["Redonda roja", "#c0392b", "r"],
  ["Redonda verde", "#2f8f5b", "r"],
  ["Redonda nogal", "#5d4037", "r"],
);
PRICE.t.push(80, 80, 110, 90, 110, 110, 130);
OPT.t.push(
  ["Grande para 6 (3 mesas)", "#a0643c", "G3"],
  ["Grande para 8 (4 mesas)", "#8d6e63", "G4"],
  ["Grande para 10 (5 mesas)", "#5d4037", "G5"],
);
PRICE.t.push(190, 250, 310);
OPT.c.push(
  ["Amarilla", "#f1c40f"],
  ["Naranja", "#e67e22"],
  ["Morada", "#8e44ad"],
  ["Blanca", "#f1f1f1"],
  ["Gris", "#7f8c8d"],
  ["Sillón negro", "#2b2b2b", "a"],
  ["Sillón mostaza", "#d4a017", "a"],
  ["Sillón rosa", "#e84393", "a"],
);
PRICE.c.push(25, 25, 30, 30, 30, 50, 50, 50);
BARS.push(["Roja", "#c0392b", "#f5e6c8"], ["Azul", "#2e5aa8", "#e8eef7"], ["Nogal", "#4e342e", "#d7ccc8"]);
PRICE.b.push(160, 170, 190);
STC.push(["Taburete amarillo", "#f1c40f"], ["Taburete blanco", "#eeeeee"], ["Taburete morado", "#8e44ad"]);
PRICE.s.push(25, 25, 30);
ADN.push("Piano", "Espejo de pie", "Perchero");
PRICE.d.push(220, 120, 70);
PLN.push("Tulipanes", "Lavanda", "Naranjo");
PRICE.p.push(35, 40, 95);
EXT.door.push(["Turquesa", "#1fa3a0"], ["Burdeos", "#7b2d3b"], ["Madera clara", "#c19a6b"]);
EXT.fac.push(
  ["Gris", "#9aa0a6"],
  ["Mostaza", "#e1b12c"],
  ["Ladrillo claro", "repeating-linear-gradient(0deg,#d9a27a 0 8px,#f1e6d8 8px 10px)"],
  ["Madera oscura", "repeating-linear-gradient(90deg,#5d4037 0 10px,#4a312a 10px 12px)"],
);
EXT.awn.push(
  ["Rosa y blanco", "#e84393", "#ffffff"],
  ["Morado y crema", "#6c3483", "#f5e6c8"],
  ["Turquesa y blanco", "#1fa3a0", "#ffffff"],
);
EXT.sign.push(
  ["Rústico", "#4e342e", "#f1dfae"],
  ["Mar", "#1b4f72", "#f7fbff"],
  ["Rosa", "#f8c8dc", "#7b1f4b"],
);
EXT.board.push(["Roja", "#7b241c", "#d7ccc8", "#ffffff"], ["Azul", "#1b2a41", "#8d6e63", "#ffffff"]);
EXT.win.push(
  ["Postigos azules", "#f8f8f8", "#9ad4f5", "#2e5aa8"],
  ["Cortinas verdes", "#f8f8f8", "#bfe3ff", "#2f8f5b"],
  ["Blanca", "#ffffff", "#d6f0ff"],
  ['Televisión 32"', "#1a1a1e", "#2f6fb5", null, 1],
  ['Televisión 50"', "#111114", "#2aa0c8", null, 1],
);
PRICE.v.push(220, 380);
PRICE.u.push(220, 380);
PRICE.q.push(220, 380);
EXT.orn.push(["Luces de colores", "#ff6b6b"], ["Guirnalda de flores", "#f78fb3"]);
EXT.roof = [
  ["Teja roja a dos aguas", "#b5472f", "#9d3b27", "g"],
  ["Teja marrón a cuatro aguas", "#8d5a3b", "#774a2f", "h"],
  ["Pizarra a dos aguas", "#59636b", "#4b545b", "g"],
  ["Teja verde a cuatro aguas", "#3f8f5f", "#35794f", "h"],
  ["Mansarda azul", "#3b6ea5", "#325d8c", "m"],
  ["Tejado de paja", "#d9bd6b", "#c4a553", "t"],
  ["Pagoda roja", "#b03a2e", "#933026", "p"],
  ["Azotea gris", "#9aa0a6", "#868c92", "f"],
  ["Terraza de madera", "#a1704a", "#8d5f3c", "d"],
  ["Azotea con jardín", "#5fa850", "#4f9442", "j"],
];
EXL.roof = "Tejado";
const ROOF = (x0, y0, w, d, i, Z) => {
  const r = EXT.roof[i | 0] || EXT.roof[0],
    c1 = r[1],
    c2 = r[2],
    t = r[3],
    cc = (k) => (k % 2 ? c2 : c1);
  let o = "";
  const lay = (X, Y, w, d, z, h, c) => (w > 0 && d > 0 ? bx(X, Y, w, d, h, c, z) : "");
  const hip = (X, Y, w, d, z, st, rs, col) => {
    let k = 0;
    for (; w - 2 * k * st >= 3 && d - 2 * k * st >= 3; k++)
      o += lay(X + k * st, Y + k * st, w - 2 * k * st, d - 2 * k * st, z + k * rs, rs + 0.6, col(k));
    return [k, z + k * rs];
  };
  const ov = t === "p" ? 14 : t === "t" ? 12 : 8,
    X = x0 - ov,
    Y = y0 - ov,
    w2 = w + 2 * ov,
    d2 = d + 2 * ov;
  o += lay(X, Y, w2, d2, Z, 3, lt(c1, -35));
  if (t === "g") {
    let k = 0;
    for (; d2 - 2 * k * 10 >= 6; k++) o += lay(X, Y + k * 10, w2, d2 - 2 * k * 10, Z + 3 + k * 3, 3.6, cc(k));
    o += lay(X - 2, Y + d2 / 2 - 2, w2 + 4, 4, Z + 3 + k * 3, 3, lt(c1, -30));
  } else if (t === "h") {
    const [k, z] = hip(X, Y, w2, d2, Z + 3, 10, 3, cc);
    o += lay(X + w2 / 2 - 3, Y + d2 / 2 - 3, 6, 6, z, 12, lt(c1, -30));
  } else if (t === "m") {
    const [k, z] = hip(X, Y, w2, d2, Z + 3, 6, 6, (k) => (k < 8 ? cc(k) : c1));
    let n = 0;
    const q = Math.min(8, Math.floor(Math.min(w2, d2) / 12));
    o = "";
    o += lay(X, Y, w2, d2, Z, 3, lt(c1, -35));
    for (; n < q; n++) o += lay(X + n * 6, Y + n * 6, w2 - 12 * n, d2 - 12 * n, Z + 3 + n * 6, 6.6, cc(n));
    o +=
      lay(X + q * 6, Y + q * 6, w2 - 12 * q, d2 - 12 * q, Z + 3 + q * 6, 3, lt(c1, 25)) +
      lay(X + q * 6 - 2, Y + q * 6 - 2, w2 - 12 * q + 4, 3, Z + 3 + q * 6, 6, lt(c1, -30)) +
      lay(X + q * 6 - 2, Y + d2 - q * 6 - 1, w2 - 12 * q + 4, 3, Z + 3 + q * 6, 6, lt(c1, -30)) +
      lay(X + q * 6 - 2, Y + q * 6 - 2, 3, d2 - 12 * q + 4, Z + 3 + q * 6, 6, lt(c1, -30)) +
      lay(X + w2 - q * 6 - 1, Y + q * 6 - 2, 3, d2 - 12 * q + 4, Z + 3 + q * 6, 6, lt(c1, -30)) +
      lay(X + w2 / 2 - 14, Y + d2 / 2 - 10, 28, 20, Z + 3 + q * 6, 10, "#8d6e63");
  } else if (t === "t") {
    hip(X, Y, w2, d2, Z + 3, 8, 3, cc);
    for (let j = 0; j * 7 < w2 - 6; j++) o += lay(X + j * 7, Y + d2 - 1.5, 5, 2, Z - 4, 7, lt(c1, -18));
    for (let j = 0; j * 7 < d2 - 6; j++) o += lay(X + w2 - 1.5, Y + j * 7, 2, 5, Z - 4, 7, lt(c1, -18));
  } else if (t === "p") {
    const [k1, z1] = hip(X, Y, w2, d2, Z + 3, 8, 3, cc),
      n = Math.min(6, k1 - 1),
      zb = Z + 3 + n * 3,
      ix = X + n * 8,
      iy = Y + n * 8,
      iw = w2 - 16 * n,
      id = d2 - 16 * n;
    o = "";
    o += lay(X, Y, w2, d2, Z, 3, lt(c1, -35));
    for (let k = 0; k < n; k++)
      o += lay(X + k * 8, Y + k * 8, w2 - 16 * k, d2 - 16 * k, Z + 3 + k * 3, 3.6, cc(k));
    o += lay(ix + 14, iy + 14, iw - 28, id - 28, zb, 16, "#efe3cf");
    for (const [px, py] of [
      [ix + 14, iy + 14],
      [ix + iw - 20, iy + 14],
      [ix + 14, iy + id - 20],
      [ix + iw - 20, iy + id - 20],
    ])
      o += lay(px, py, 6, 6, zb, 16, "#8e2c20");
    const X2 = ix + 2,
      Y2 = iy + 2,
      W2 = iw - 4,
      D2 = id - 4,
      z2 = zb + 16;
    o += lay(X2, Y2, W2, D2, z2, 3, lt(c1, -35));
    let k = 0;
    for (; W2 - 2 * k * 8 >= 3 && D2 - 2 * k * 8 >= 3; k++)
      o += lay(X2 + k * 8, Y2 + k * 8, W2 - 2 * k * 8, D2 - 2 * k * 8, z2 + 3 + k * 3.5, 4.1, cc(k));
    o += lay(X2 + W2 / 2 - 1.5, Y2 + D2 / 2 - 1.5, 3, 3, z2 + 3 + k * 3.5, 16, "#c9a227");
  } else if (t === "f") {
    o += lay(X, Y, w2, d2, Z + 3, 2, c1);
    for (const [a, b, c, e] of [
      [X, Y, w2, 4],
      [X, Y + d2 - 4, w2, 4],
      [X, Y, 4, d2],
      [X + w2 - 4, Y, 4, d2],
    ])
      o += lay(a, b, c, e, Z + 3, 7, c2);
    o +=
      lay(X + 50, Y + 50, 34, 24, Z + 5, 14, "#cfd8dc") +
      lay(X + 58, Y + 57, 18, 10, Z + 19, 2, "#455a64") +
      lay(X + w2 - 100, Y + 60, 40, 34, Z + 5, 18, "#8d6e63") +
      lay(X + w2 - 92, Y + 94, 16, 1.5, Z + 5, 12, "#5d4037") +
      lay(X + w2 - 60, Y + d2 - 80, 3, 3, Z + 5, 40, "#37474f") +
      lay(X + w2 - 66, Y + d2 - 80, 15, 1.5, Z + 30, 1.2, "#37474f");
  } else if (t === "d") {
    o += lay(X, Y, w2, d2, Z + 3, 2, c1);
    for (let j = 0; j * 12 < d2; j++) o += lay(X, Y + j * 12, w2, 1, Z + 5, 0.6, c2);
    for (let x = 0; x <= w2; x += 32)
      for (const y of [0, d2 - 3]) o += lay(X + Math.min(x, w2 - 3), Y + y, 3, 3, Z + 5, 15, "#e8d9c8");
    for (let y = 32; y < d2; y += 32)
      for (const x of [0, w2 - 3]) o += lay(X + x, Y + Math.min(y, d2 - 3), 3, 3, Z + 5, 15, "#e8d9c8");
    for (const [a, b, c, e] of [
      [X, Y, w2, 2.5],
      [X, Y + d2 - 2.5, w2, 2.5],
      [X, Y, 2.5, d2],
      [X + w2 - 2.5, Y, 2.5, d2],
    ])
      o += lay(a, b, c, e, Z + 19, 2, "#e8d9c8");
    for (const [px, py, uc] of [
      [X + 80, Y + 90, "#e74c3c"],
      [X + w2 - 130, Y + d2 - 130, "#2e86de"],
    ])
      o +=
        lay(px, py, 36, 36, Z + 5, 9, "#c9a574") +
        lay(px + 17, py + 17, 3, 3, Z + 14, 36, "#8d6e63") +
        lay(px - 14, py - 14, 64, 64, Z + 50, 3, uc) +
        lay(px + 6, py + 6, 24, 24, Z + 53, 3, "#fff") +
        lay(px + 30, py + 54, 12, 12, Z + 5, 8, "#7b5a3c") +
        lay(px - 8, py + 40, 12, 12, Z + 5, 8, "#7b5a3c");
  } else if (t === "j") {
    o += lay(X, Y, w2, d2, Z + 3, 2, "#6d4c41");
    for (const [a, b, c, e] of [
      [X, Y, w2, 5],
      [X, Y + d2 - 5, w2, 5],
      [X, Y, 5, d2],
      [X + w2 - 5, Y, 5, d2],
    ])
      o += lay(a, b, c, e, Z + 3, 9, "#8d6e63");
    o += lay(X + 5, Y + 5, w2 - 10, d2 - 10, Z + 5, 5, c1);
    for (let gx = 44; gx < w2 - 30; gx += 62)
      for (let gy = 44; gy < d2 - 30; gy += 62) {
        const q = (gx * 7 + gy * 3) % 5;
        o +=
          CY(X + gx, Y + gy, 16 + q * 3, 7 + (q % 2) * 4, q % 2 ? "#3f9b4a" : "#2f8a3f", Z + 10) +
          CY(X + gx + 2, Y + gy - 1, 10 + q * 2, 5, "#56b45f", Z + 17 + (q % 2) * 4) +
          (q % 2
            ? CY(X + gx + 4, Y + gy + 3, 3, 2, "#e84393", Z + 22)
            : CY(X + gx - 3, Y + gy + 2, 3, 2, "#f1c40f", Z + 18));
      }
    o += lay(X + w2 / 2 - 14, Y + d2 - 16, 28, 3, Z + 10, 2, "#d7ccc8");
  }
  return o;
};
const roofSvg = (i) => {
  const r = EXT.roof[i],
    c1 = r[1],
    c2 = r[2],
    t = r[3];
  const P = (pts, c) => `<polygon points="${pts}" fill="${c}"/>`;
  let g = "";
  if (t === "g")
    g = P("4,34 30,10 56,34", c1) + P("30,10 56,34 30,34", c2) + P("4,34 56,34 52,38 8,38", "#d7ccc8");
  else if (t === "h")
    g = P("4,34 18,16 42,16 56,34", c1) + P("18,16 42,16 30,10", c2) + P("4,34 56,34 52,38 8,38", "#d7ccc8");
  else if (t === "m")
    g =
      P("4,34 12,16 48,16 56,34", c1) +
      P("12,16 48,16 44,12 16,12", c2) +
      P("4,34 56,34 52,38 8,38", "#d7ccc8");
  else if (t === "t")
    g =
      P("2,36 16,14 44,14 58,36", c1) +
      P("16,14 44,14 30,8", c2) +
      '<path d="M2 36h56" stroke="' +
      c2 +
      '" stroke-width="3" stroke-dasharray="3 2"/>';
  else if (t === "p")
    g =
      P("6,34 54,34 46,26 14,26", c1) +
      P("14,26 46,26 46,20 14,20", "#efe3cf") +
      P("12,20 48,20 38,12 22,12", c2) +
      P("29,12 31,12 31,5 29,5", "#c9a227") +
      P("2,36 58,36 54,34 6,34", c2);
  else if (t === "f")
    g =
      P("4,18 56,18 56,34 4,34", c1) +
      P("4,18 56,18 52,14 8,14", c2) +
      P("10,22 22,22 22,28 10,28", "#cfd8dc");
  else if (t === "d")
    g =
      P("4,22 56,22 56,34 4,34", c1) +
      P("4,22 56,22 52,16 8,16", c2) +
      P("14,10 30,10 22,18", "#e74c3c") +
      P("21,18 23,18 23,28 21,28", "#8d6e63");
  else
    g =
      P("4,22 56,22 56,34 4,34", "#6d4c41") +
      P("6,20 54,20 54,30 6,30", c1) +
      '<circle cx="16" cy="20" r="6" fill="#3f9b4a"/><circle cx="32" cy="18" r="7" fill="#56b45f"/><circle cx="46" cy="20" r="5" fill="#2f8a3f"/><circle cx="36" cy="15" r="1.6" fill="#e84393"/>';
  return `<div class="pvf"><svg viewBox="0 0 60 40" width="84" height="56">${g}</svg></div>`;
};

function canPut(k, x, y, ex) {
  const o = occ(ex);
  if (k !== "b") return !o.has(x + "," + y);
  if (TCn() > 0 && x >= SCn()) {
    if (x + 3 >= SCn() + TCn() || y - 1 < TY0() || y >= SRn()) return false;
  } else if (y < 1 || x + 3 >= SCn()) return false;
  for (let i = 0; i < 4; i++) if (o.has(x + i + "," + y) || o.has(x + i + "," + (y - 1))) return false;
  return true;
}
function bgrid(k) {
  return `<p class="mut"><b>${k === "b" ? "Barras" : "Taburetes"}</b>${k === "s" ? " · se sientan en la barra (hasta 4 por barra)" : ""}</p><div class="grid">${PRICE[k].map((pr, i) => (TERA[k] != null && isT(k, i) ? "" : `<div class="card item">${pv(k, i)}<b>${nameOf(k, i)}</b><div class="mut">${pr} 🪙 · vende ${Math.floor(pr / 2)}</div><button class="s" onclick="buyItem('${k}',${i})" ${S.coins < pr ? "disabled" : ""}>Comprar</button></div>`)).join("")}</div>`;
}
function selItem(k) {
  sel = sel === k ? null : k;
  pick = null;
  draw();
}
function tapCell(x, y) {
  if (pick && pick.k === "k") return;
  if (sel && "kvuq".includes(sel[0])) return;
  if (pick && "vuq".includes(pick.k)) return;
  if (sel && sel[0] === "t" && S.tbl[+sel.slice(1)] && bigN(S.tbl[+sel.slice(1)][2])) {
    moveBig(+sel.slice(1), x, y);
    return;
  }
  if (sel) {
    const i = +sel.slice(1),
      a = ARR(sel[0]);
    if (a[i] && canPut(sel[0], x, y, [sel[0], i])) {
      a[i] = [x, y, a[i][2] | 0];
      save();
    }
    draw();
  } else if (pick && pick.k === "t" && bigN(pick.s)) {
    placeBig(x, y);
  } else if (pick) {
    if (pick.k === "b" && S.waiters < 2) {
      note = "Necesitas al menos 2 camareros para poner una barra.";
      draw();
      return;
    }
    const l = S.inv[pick.k],
      j = l.indexOf(pick.s);
    if (j >= 0 && canPut(pick.k, x, y)) {
      ARR(pick.k).push([x, y, pick.s]);
      l.splice(j, 1);
      if (l.indexOf(pick.s) < 0) pick = null;
      save();
    }
    draw();
  }
}
function store(w) {
  if (!sel || busy) return;
  const k = sel[0],
    i = +sel.slice(1),
    m = ARR(k)[i];
  if (!m) return;
  if (k === "k" && ![4, 5, 6, 7, 8, 11, 12].includes(m[2])) return;
  if (k === "t" && bigN(m[2])) {
    S.inv.t.push(removeBig(i));
    sel = null;
    save();
    draw();
    return;
  }
  if (k === "t" && w) {
    const ids = [];
    S.chr.forEach((c, j) => {
      if (
        [
          [0, 1],
          [0, -1],
          [1, 0],
          [-1, 0],
        ].some((d) => c[0] + d[0] === m[0] && c[1] + d[1] === m[1])
      )
        ids.push(j);
    });
    ids.reverse().forEach((j) => {
      S.inv.c.push(S.chr[j][2] | 0);
      S.chr.splice(j, 1);
    });
  }
  S.inv[k].push(m[2] | 0);
  ARR(k).splice(i, 1);
  sel = null;
  save();
  draw();
}
function sellSel() {
  if (!sel || busy) return;
  if (
    sel[0] === "k" &&
    (!S.kobj[+sel.slice(1)] ||
      S.kobj[+sel.slice(1)][2] < 4 ||
      S.kobj[+sel.slice(1)][2] === 9 ||
      S.kobj[+sel.slice(1)][2] === 10)
  )
    return;
  const k = sel[0],
    i = +sel.slice(1),
    m = ARR(k)[i];
  if (!m) return;
  S.coins += half(k, m[2]);
  if (k === "t" && bigN(m[2])) removeBig(i);
  else ARR(k).splice(i, 1);
  sel = null;
  save();
  draw();
}
function invSell(k, s) {
  const l = S.inv[k],
    j = l.indexOf(s);
  if (j < 0) return;
  l.splice(j, 1);
  S.coins += half(k, s);
  if (pick && pick.k === k && l.indexOf(pick.s) < 0) pick = null;
  save();
  draw();
}
function invPick(k, s) {
  pick = pick && pick.k === k && pick.s === s ? null : { k, s };
  sel = null;
  if (pick && "vuq".includes(k)) ccat = k === "v" ? "x" : k === "u" ? "d" : "k";
  draw();
}
function buyItem(k, s) {
  if (isLocked(k, s)) {
    note = "🔒 Bloqueado: se desbloquea con el logro «" + lockName(k, s) + "»";
    draw();
    return;
  }
  const pr = PRICE[k][s];
  if (k === "b" && S.waiters < 2) {
    note = "Necesitas al menos 2 camareros para poner una barra: uno atiende las mesas y otro la barra.";
    draw();
    return;
  }
  if (S.coins < pr) return;
  S.coins -= pr;
  msBump("catb", 1);
  S.inv[k].push(s);
  note = "✔ " + label(k, s) + " comprada. Está en el Inventario: pulsa Colocar.";
  save();
  draw();
}
const thumb = (k, s) =>
  k === "t"
    ? tableHtml(-20, -20, OPT.t[s][1], OPT.t[s][2])
    : k === "c"
      ? chairHtml(-20, -20, OPT.c[s][1], [0, 1], OPT.c[s][2])
      : k === "b"
        ? barH(-80, -20, s)
        : k === "s"
          ? stoolH(-20, -20, s)
          : k === "p"
            ? plH(-20, -20, s)
            : dcH(-20, -20, s, 0);
