/* muebles.js — Dibujo de mesas, sillas, barras, plantas, adornos, ventanas y fachada. */

const it = (k, h) => `<div class="it" data-k="${k}">${h}</div>`;
const UMC = { u: "#e74c3c", u1: "#2e86de", u2: "#2e9e5b", u3: "#f4c20d", u4: "#f08a24", u5: "#e84393" };
const bigN = (s) => {
  const o = OPT.t[s | 0],
    g = o && o[2];
  return typeof g === "string" && /^G\d$/.test(g) ? +g[1] : 0;
};
function bigRun(i) {
  const g = S.tbl[i] && S.tbl[i][3];
  if (!g) return [i];
  return S.tbl
    .map((t, j) => (t[3] === g ? j : -1))
    .filter((j) => j >= 0)
    .sort((a, b) => S.tbl[a][0] - S.tbl[b][0]);
}
function bigChairs(run) {
  return S.chr
    .map((c, j) => (run.some((r) => S.tbl[r][0] === c[0] && Math.abs(S.tbl[r][1] - c[1]) === 1) ? j : -1))
    .filter((j) => j >= 0);
}
function placeBig(x, y) {
  const n = bigN(pick.s),
    SC = SCn(),
    o = occ(),
    T = [],
    C = [];
  let ok = !(x < SC && x + n - 1 >= SC);
  for (let i = 0; i < n; i++) {
    T.push([x + i, y]);
    C.push([x + i, y - 1], [x + i, y + 1]);
  }
  [...T, ...C].forEach((c) => {
    if (!inGrid(c) || o.has(key(c))) ok = false;
  });
  if (!ok) {
    note =
      "La mesa grande necesita " +
      n +
      " casillas libres en fila hacia la derecha, con sitio para sillas arriba y abajo.";
    draw();
    return;
  }
  const g = "g" + Date.now() + Math.random(),
    l = S.inv.t,
    j = l.indexOf(pick.s);
  if (j >= 0) l.splice(j, 1);
  if (l.indexOf(pick.s) < 0) pick = null;
  T.forEach((c) => S.tbl.push([c[0], c[1], OPT.t.findIndex((q) => q[2] === "G" + n), g]));
  C.forEach((c) => S.chr.push([c[0], c[1], 0]));
  note = "";
  save();
  draw();
}
function moveBig(i, x, y) {
  const run = bigRun(i),
    ch = bigChairs(run),
    dx = x - S.tbl[i][0],
    dy = y - S.tbl[i][1],
    o = occ(),
    SC = SCn();
  run.forEach((r) => o.delete(key(S.tbl[r])));
  ch.forEach((c) => o.delete(key(S.chr[c])));
  const nt = run.map((r) => [S.tbl[r][0] + dx, S.tbl[r][1] + dy]),
    nc = ch.map((c) => [S.chr[c][0] + dx, S.chr[c][1] + dy]);
  let ok = !(nt.some((c) => c[0] < SC) && nt.some((c) => c[0] >= SC));
  [...nt, ...nc].forEach((c) => {
    if (!inGrid(c) || o.has(key(c))) ok = false;
  });
  if (ok) {
    run.forEach((r, q) => {
      S.tbl[r][0] = nt[q][0];
      S.tbl[r][1] = nt[q][1];
    });
    ch.forEach((c, q) => {
      S.chr[c][0] = nc[q][0];
      S.chr[c][1] = nc[q][1];
    });
    save();
  } else note = "No cabe la mesa grande ahí.";
  draw();
}
function removeBig(i) {
  const run = bigRun(i),
    ch = bigChairs(run),
    st = S.tbl[i][2];
  [...ch].sort((a, b) => b - a).forEach((c) => S.chr.splice(c, 1));
  [...run].sort((a, b) => b - a).forEach((r) => S.tbl.splice(r, 1));
  return st;
}
function tableHtml(x, y, tc, sh) {
  if (typeof sh === "string" && sh[0] === "G")
    return (
      bx(x + 3, y + 4, 5, 5, 14, "#5a4636", 2) +
      bx(x + 32, y + 4, 5, 5, 14, "#5a4636", 2) +
      bx(x + 3, y + 31, 5, 5, 14, "#5a4636", 2) +
      bx(x + 32, y + 31, 5, 5, 14, "#5a4636", 2) +
      bx(x, y + 2, 40, 36, 4, tc, 16) +
      bx(x + 2, y + 6, 36, 28, 1, lt(tc, 28), 20) +
      bx(x + 8, y + 16, 10, 10, 1, "#ffffff", 21) +
      bx(x + 25, y + 12, 5, 5, 7, "#cfe8ff", 21) +
      bx(x + 17, y + 6, 5, 5, 9, "#e84393", 21)
    );
  if (UMC[sh]) {
    const uc = UMC[sh];
    return (
      tableHtml(x, y, tc, 0) +
      bx(x + 18, y + 18, 4, 4, 52, "#8d6e63") +
      bx(x + 4, y + 4, 32, 32, 3, uc, 52) +
      bx(x + 10, y + 10, 20, 20, 3, "#fff", 55) +
      bx(x + 16, y + 16, 8, 8, 3, uc, 58)
    );
  }
  if (sh === "r")
    return (
      dsc(x + 9, y + 9, 22, 2, "#5a4636", 0) +
      dsc(x + 16, y + 16, 8, 12, "#5a4636", 2) +
      dsc(x + 1, y + 1, 38, 4, tc, 16) +
      dsc(x + 5, y + 5, 30, 0, lt(tc, 28), 20.5) +
      dsc(x + 13, y + 14, 9, 0, "#ffffff", 21) +
      bx(x + 25, y + 12, 5, 5, 7, "#cfe8ff", 21) +
      bx(x + 17, y + 6, 5, 5, 9, "#e84393", 21)
    );
  return (
    bx(x + 10, y + 10, 20, 20, 2, "#5a4636") +
    bx(x + 17, y + 17, 6, 6, 14, "#5a4636", 2) +
    bx(x + 2, y + 2, 36, 36, 4, tc, 16) +
    bx(x + 6, y + 6, 28, 28, 1, lt(tc, 28), 20) +
    bx(x + 10, y + 16, 10, 10, 1, "#ffffff", 21) +
    bx(x + 25, y + 12, 5, 5, 7, "#cfe8ff", 21) +
    bx(x + 17, y + 6, 5, 5, 9, "#e84393", 21)
  );
}
function chairHtml(x, y, cu, d, ds) {
  let o =
    bx(x + 14, y + 14, 12, 12, 10, "#5a4636") +
    bx(x + 8, y + 8, 24, 24, 3, cu, 10) +
    bx(x + 10, y + 10, 20, 20, 1, lt(cu, 35), 13);
  const tl = ds === "a" ? 26 : 18;
  if (d) {
    const a = d[0],
      b = d[1];
    o +=
      a === 0
        ? bx(x + 8, b > 0 ? y + 8 : y + 29, 24, 3, tl, cu, 14)
        : bx(a > 0 ? x + 8 : x + 29, y + 8, 3, 24, tl, cu, 14);
  }
  if (ds === "a")
    o +=
      d && d[0] !== 0
        ? bx(x + 10, y + 6, 20, 3, 9, cu, 13) + bx(x + 10, y + 31, 20, 3, 9, cu, 13)
        : bx(x + 6, y + 10, 3, 20, 9, cu, 13) + bx(x + 31, y + 10, 3, 20, 9, cu, 13);
  return o;
}

const BARS = [
    ["Madera", "#7b5a3c", "#e9d8b8"],
    ["Moderna", "#2d3436", "#b2bec3"],
    ["Rústica", "#8d6e63", "#d7ccc8"],
    ["Blanca", "#ecf0f1", "#74b9ff"],
    ["Neón", "#1e272e", "#00cec9"],
    ["Mármol", "#dfe6e9", "#b2bec3"],
  ],
  STC = [
    ["Rojo", "#d6453d"],
    ["Azul", "#3b6fd4"],
    ["Madera", "#a1704a"],
    ["Negro", "#2b2b2b"],
    ["Verde", "#3aa35c"],
    ["Rosa", "#e84393"],
  ];
const barH = (x, y, s) => {
  const b = BARS[s] || BARS[0];
  let o =
    bx(x, y + 8, 160, 24, 26, b[1]) +
    bx(x - 2, y + 6, 164, 28, 3, b[2], 26) +
    bx(x + 6, y + 12, 6, 6, 10, "#2e7d32", 29) +
    bx(x + 22, y + 12, 6, 6, 12, "#c62828", 29) +
    bx(x + 36, y + 13, 6, 6, 9, "#1565c0", 29) +
    bx(x + 70, y + 12, 5, 5, 14, "#b0bec5", 29) +
    bx(x + 128, y + 10, 16, 12, 9, "#444", 29);
  if (y === CS) {
    o += bx(x + 4, 1, 152, 6, 3, "#8d5a3b", 58);
    for (let i = 0; i < 8; i++)
      o += bx(x + 10 + i * 18, 2, 6, 5, 12, ["#2e7d32", "#c62828", "#1565c0", "#f9a825"][i % 4], 61);
  }
  return o;
};
const G = 'stroke="rgba(43,33,24,.32)" stroke-width=".7" stroke-linejoin="round" stroke-linecap="round"';
const sv = (w, h, i, m) =>
  `<svg viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" ${m ? `style="position:absolute;left:-${w / 2}px;bottom:0;overflow:visible"` : ""}><g ${G}>${i}</g></svg>`;
const bb = (x, y, svg) => `<div class="bb" style="transform:translate3d(${x}px,${y}px,0) ${BB}">${svg}</div>`;
const pot = (x, w, h, c, b) => {
  c = c || "#c8693a";
  b = b || 54;
  return `<path d="M${x - w / 2 + 2} ${b - h} H${x + w / 2 - 2} L${x + w / 2 - 5} ${b} H${x - w / 2 + 5}Z" fill="${c}"/><rect x="${x - w / 2}" y="${b - h - 3}" width="${w}" height="5" rx="1.5" fill="${lt(c, 25)}"/><path d="M${x + w / 6} ${b - h} H${x + w / 2 - 2} L${x + w / 2 - 5} ${b} H${x + w / 6}Z" fill="rgba(0,0,0,.13)" stroke="none"/><path d="M${x - w / 2 + 3} ${b - h + 1} H${x - w / 6} L${x - w / 6 - 1} ${b - 1} H${x - w / 2 + 6}Z" fill="rgba(255,255,255,.15)" stroke="none"/>`;
};

const fl = (x, y, r, c, m) => {
  let o = "";
  for (let a = 0; a < 8; a++)
    o += `<ellipse cx="${x}" cy="${y - r}" rx="${r * 0.45}" ry="${r * 0.7}" transform="rotate(${a * 45} ${x} ${y})" fill="${c}"/>`;
  return o + `<circle cx="${x}" cy="${y}" r="${r * 0.45}" fill="${m || "#f1c40f"}"/>`;
};

const ADN = [
  "Lámpara de pie",
  "Columna",
  "Escultura",
  "Pecera",
  "Reloj de pie",
  "Fuente",
  "Gramola",
  "Estantería",
];

const dsc = (x, y, d, h, c, z) => {
  if (d <= 4) return bx(x, y, d, d, h, c, z);
  let o = "";
  const dk = lt(c, -40),
    st = d <= 16 ? 1 : 2;
  for (let i = 0; i <= h; i += st)
    o += `<div class="dc" style="left:${x}px;top:${y}px;width:${d}px;height:${d}px;background:${i >= h ? c : dk};transform:translateZ(${z + i}px)"></div>`;
  return o;
};
const stoolH = (x, y, s) => {
  const c = (STC[s] || STC[0])[1];
  if (s >= 6 && s < 9) {
    const lg = s === 8 ? "#37474f" : "#8d5a3b";
    return (
      bx(x + 10, y + 10, 3, 3, 18, lg) +
      bx(x + 27, y + 10, 3, 3, 18, lg) +
      bx(x + 10, y + 27, 3, 3, 18, lg) +
      bx(x + 27, y + 27, 3, 3, 18, lg) +
      bx(x + 11, y + 18, 18, 3, 1, lg, 7) +
      dsc(x + 9, y + 9, 22, 4, c, 18) +
      dsc(x + 12, y + 12, 16, 0, lt(c, 35), 22.5) +
      (s === 7 ? dsc(x + 9, y + 9, 22, 1, "#8d6e43", 17) : "")
    );
  }
  return (
    dsc(x + 11, y + 11, 18, 2, "#444", 0) +
    dsc(x + 17, y + 17, 6, 16, "#666", 2) +
    dsc(x + 9, y + 9, 22, 4, c, 18) +
    dsc(x + 12, y + 12, 16, 0, lt(c, 35), 22.5)
  );
};

const esc = (s) =>
  String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);

const EXT = {
  door: [
    ["Madera", "#8d5a3b"],
    ["Roja", "#c0392b"],
    ["Azul", "#2e5aa8"],
    ["Verde", "#2f8f5b"],
    ["Negra", "#2d3436"],
    ["Dorada", "#c9a227"],
  ],
  fac: [
    ["Piedra", "#b9a58a"],
    ["Ladrillo", "repeating-linear-gradient(0deg,#b4533c 0 8px,#e8d9c8 8px 10px)"],
    ["Blanca", "#f1f1f1"],
    ["Azul", "#5b8bd6"],
    ["Verde", "#6fb07a"],
    ["Madera", "repeating-linear-gradient(90deg,#a1704a 0 10px,#8d5f3c 10px 12px)"],
    ["Rosa", "#f0a6c3"],
    ["Crema", "#f3e3c3"],
  ],
  awn: [
    ["Rojo y blanco", "#c0392b", "#ffffff"],
    ["Verde y blanco", "#2f8f5b", "#ffffff"],
    ["Azul y blanco", "#2e5aa8", "#ffffff"],
    ["Amarillo y blanco", "#f1c40f", "#ffffff"],
    ["Negro y dorado", "#222222", "#d4af37"],
    ["Naranja", "#e67e22", "#f5b041"],
  ],
  sign: [
    ["Clásico", "#6d4c41", "#f5e6c8"],
    ["Neón", "#1e272e", "#ff6bcb"],
    ["Elegante", "#222222", "#d4af37"],
    ["Pizarra", "#2f3b2f", "#ffffff"],
    ["Vintage", "#f5deb3", "#8b2f2f"],
    ["Moderno", "#ffffff", "#222222"],
  ],
  board: [
    ["Clásica", "#2b2b2b", "#8d5a3b", "#ffffff"],
    ["Verde", "#2f4f3f", "#d7ccc8", "#ffffff"],
    ["Negra", "#1e1e1e", "#c0392b", "#ffffff"],
    ["Blanca", "#f4f4f4", "#555555", "#222222"],
  ],
  win: [
    ["Sencilla", "#f8f8f8", "#9ad4f5"],
    ["Postigos verdes", "#f8f8f8", "#9ad4f5", "#2f8f5b"],
    ["Madera", "#8d5a3b", "#bfe3ff"],
    ["Cortinas rojas", "#f8f8f8", "#bfe3ff", "#c0392b"],
    ["Dorada", "#c9a227", "#d6f0ff"],
    ["Moderna", "#2d3436", "#7fb8d8"],
  ],
  orn: [
    ["Guirnalda de luces", "#ffe066"],
    ["Cajas de flores", "#e84393"],
    ["Farolillos rojos", "#e74c3c"],
    ["Banderines", "#3498db"],
    ["Hiedra", "#2f9e44"],
    ["Faroles dorados", "#d4af37"],
  ],
};
const EXL = {
  door: "Puerta",
  fac: "Fachada (pared exterior)",
  awn: "Toldo",
  sign: "Cartel",
  board: "Pizarra del menú",
  win: "Ventanas",
  orn: "Adornos exteriores",
};
const signCss = (i) => {
  const g = EXT.sign[i];
  return `background:${g[1]};color:${g[2]};border-color:${lt(g[1], 45)};${i === 1 ? `text-shadow:0 0 6px ${g[2]},0 0 14px ${g[2]};` : ""}`;
};
const WALLF = (g0, g1, W, D) => {
  const fc = EXT.fac[S.ext.fac][1];
  return (
    bxs(0, D - 4, g0, 5, 14, fc).replace(/class="b"/g, 'class="b fcd"') +
    bxs(g1, D - 4, W - g1, 5, 14, fc).replace(/class="b"/g, 'class="b fcd"')
  );
};
const WD = () => ({ n: SCn(), m: SRn(), dc: (SCn() >> 1) - 1 });
const wFree = (w, p, j) => {
  const d = WD(),
    N = w ? d.m : d.n;
  if (p < 0 || p >= N) return false;
  if (!w && (p === d.dc || p === d.dc + 1)) return false;
  if (w && TCn() && p === d.m - 2) return false;
  return !S.wins.some((o, i) => i !== j && o[0] === w && o[1] === p);
};
const wFind = (w, p, dir, j) => {
  const d = WD(),
    N = w ? d.m : d.n;
  for (let q = p + dir; q >= 0 && q < N; q += dir) if (wFree(w, q, j)) return q;
  return -1;
};
const wn = (k) => (k === "u" ? SCn() : Math.max(1, Math.floor(KWn() / 40)));
const wfk = (k, p, j) => p >= 0 && p < wn(k) && !ARR(k).some((o, i) => i !== j && o[0] === p);
function wiSync() {
  if (!Array.isArray(S.bw))
    S.bw = [
      [1, 0, 0],
      [Math.max(2, SCn() - 2), 0, 0],
    ];
  if (!Array.isArray(S.kwn)) S.kwn = [];
}
const iwModel = (cx, sty) => {
  const d = EXT.win[sty] || EXT.win[0],
    f = d[1],
    g = isNight() ? "#ffe08a" : d[2],
    sh = d[3],
    z0 = 46,
    H = 34;
  if (d[4]) {
    const w = sty === 10 ? 50 : 42,
      h = sty === 10 ? 30 : 25;
    return (
      bx(cx - w / 2, 0.5, w, 5, h, f, z0) +
      bx(cx - w / 2 + 2, 5.3, w - 4, 0.8, h - 4, d[2], z0 + 2) +
      bx(cx - w / 2 + 4, 5.7, w * 0.4, 0.6, h * 0.35, "rgba(255,255,255,.28)", z0 + h * 0.45) +
      bx(cx - 3, 0.5, 6, 3, 3, "#333", z0 - 3)
    );
  }
  let o =
    bx(cx - 21, 0.5, 42, 7, 3, lt(f, 18), z0 - 3) +
    bx(cx - 15, 0.5, 30, 3, H, f, z0) +
    bx(cx - 12, 2.5, 24, 2, H - 6, g, z0 + 3) +
    bx(cx - 1, 3, 2, 2.5, H - 6, f, z0 + 3) +
    bx(cx - 12, 3, 24, 2.5, 2, f, z0 + H / 2 - 1) +
    bx(cx - 17, 0.5, 34, 4, 3, lt(f, 18), z0 + H);
  if (sh) o += bx(cx - 23, 0.5, 6, 3, H, sh, z0) + bx(cx + 17, 0.5, 6, 3, H, sh, z0);
  return o;
};
const iwMk = (cx, c) =>
  bx(cx - 23, 4.6, 46, 1.5, 2, c, 42) +
  bx(cx - 23, 4.6, 46, 1.5, 2, c, 82) +
  bx(cx - 23, 4.6, 2, 1.5, 42, c, 42) +
  bx(cx + 21, 4.6, 2, 1.5, 42, c, 42);
const iwX = (k, p) => (k === "u" ? (p + 0.5) * CS : -KWn() + (p + 0.5) * 40);
function winsIn() {
  wiSync();
  let o = "";
  for (const k of ["u", "q"]) {
    o += ARR(k)
      .map((m, j) =>
        it(k + j, iwModel(iwX(k, m[0]), m[2]) + (sel === k + j ? iwMk(iwX(k, m[0]), "#ffb300") : "")),
      )
      .join("");
    const ex = sel && sel[0] === k ? +sel.slice(1) : pick && pick.k === k ? -1 : null;
    if (ex != null)
      for (let p = 0; p < wn(k); p++)
        if (wfk(k, p, ex))
          o +=
            `<div class="wcm" data-wc="${k},${p}">` +
            bx(iwX(k, p) - 17, 5, 34, 2, 34, "rgba(255,179,0,.55)", 46) +
            "</div>";
  }
  return o;
}
function wgrid(k) {
  return `<p class="mut"><b>${k === "u" ? "Ventanas y televisores de pared (salón)" : "Ventanas de cocina"}</b> · se compran y van al Inventario; pulsa <b>Colocar</b> y toca una casilla de la pared del fondo.</p><div class="grid">${EXT.win.map((w, i) => (w[4] && k !== "u" ? "" : `<div class="card item">${xpv("win", i)}<b>${w[0]}</b><div class="mut">${PRICE[k][i]} 🪙 · vende ${half(k, i)}</div><button class="s" onclick="buyItem('${k}',${i})" ${S.coins < PRICE[k][i] ? "disabled" : ""}>Comprar</button></div>`)).join("")}</div>`;
}
function tapWin(w, p) {
  if (busy) return;
  const k = typeof w === "string" ? w : "v";
  if (sel && sel[0] === k) {
    const i = +sel.slice(1),
      m = ARR(k)[i];
    if (m) {
      if (k === "v") {
        if (wFree(w, p, i)) {
          m[0] = w;
          m[1] = p;
          save();
        }
      } else if (wfk(k, p, i)) {
        m[0] = p;
        save();
      }
    }
    draw();
  } else if (pick && pick.k === k) {
    const l = S.inv[k],
      j = l.indexOf(pick.s);
    if (j >= 0 && (k === "v" ? wFree(w, p, -1) : wfk(k, p, -1))) {
      ARR(k).push(k === "v" ? [w, p, pick.s] : [p, 0, pick.s]);
      l.splice(j, 1);
      if (l.indexOf(pick.s) < 0) pick = null;
      save();
    }
    draw();
  }
}
function winSync() {
  let ch = false;
  const nf = () => [0, 1].map((w) => [w, wFind(w, -1, 1, -1)]).find((a) => a[1] >= 0);
  if (!Array.isArray(S.inv.v)) S.inv.v = [];
  S.wins = (S.wins || []).map((o) => (Array.isArray(o) ? o : ((ch = true), [o.w, o.p, o.s | 0])));
  if (Array.isArray(S.winv) && S.winv.length) {
    S.inv.v.push(...S.winv);
    S.winv = [];
    ch = true;
  }
  if (S.wg == null) {
    S.wg = 2 + (S.sal | 0);
    ch = true;
  }
  for (let i = S.wins.length - 1; i >= 0; i--) {
    const o = S.wins[i];
    if (!wFree(o[0], o[1], i)) {
      S.inv.v.push(o[2]);
      S.wins.splice(i, 1);
      ch = true;
      if (sel && sel[0] === "v") sel = null;
    }
  }
  while (S.wg < 2 + (S.sal | 0)) {
    const k = nf();
    if (!k) break;
    S.wins.push([k[0], k[1], 0]);
    S.wg++;
    ch = true;
  }
  if (ch) save();
}
const winSvg = (i) => {
  const d = EXT.win[i] || EXT.win[0],
    f = d[1],
    g = d[2],
    sh = d[3];
  return `<svg viewBox="0 0 46 34" width="46" height="34">${sh ? `<rect x="0" y="4" width="8" height="26" fill="${sh}"/><rect x="38" y="4" width="8" height="26" fill="${sh}"/>` : ""}<rect x="9" y="4" width="28" height="26" fill="${f}"/><rect x="12" y="7" width="22" height="20" fill="${g}"/><rect x="22" y="7" width="2" height="20" fill="${f}"/><rect x="12" y="16" width="22" height="2" fill="${f}"/></svg>`;
};
function vgrid() {
  return `<p class="mut"><b>Ventanas</b> · se compran como el resto de objetos: van al Inventario, pulsa <b>Colocar</b> y toca una casilla de la pared (fachada o pared derecha). Todas quedan a la misma altura.</p><div class="grid">${EXT.win.map((w, i) => (w[4] ? "" : `<div class="card item">${xpv("win", i)}<b>${w[0]}</b><div class="mut">${PRICE.v[i]} 🪙 · vende ${half("v", i)}</div><button class="s" onclick="buyItem('v',${i})" ${S.coins < PRICE.v[i] ? "disabled" : ""}>Comprar</button></div>`)).join("")}</div>`;
}

const ORN = (g0, g1, W, D, i, H) => {
  const c = EXT.orn[i | 0][1];
  let o = "";
  const out = (x) => x > g0 - 6 && x < g1 + 6,
    nt = isNight();
  const row = (st, f) => {
    let k = 0;
    for (let x = 8; x < W - 8; x += st, k++) if (!out(x)) o += f(x, k);
  };
  const sag = (x, st) => {
    const t = (x % 80) / 80;
    return Math.sin(t * Math.PI) * 6;
  };
  if (i === 0)
    row(8, (x, k) => {
      const z = H - 8 - sag(x),
        on = k % 2;
      return (
        bx(x, D + 1, 8, 0.8, 0.8, "#37474f", z + 2.2) +
        bx(x + 3, D + 1, 3.2, 3, 3.2, on ? "#fff3b0" : c, z) +
        (nt ? bx(x + 2, D + 0.6, 5, 4, 5, "rgba(255,230,120,.35)", z - 1) : "")
      );
    });
  else if (i === 1)
    row(
      18,
      (x) =>
        bx(x, D + 1, 13, 6, 6, "#6b4226", 12) +
        bx(x - 0.8, D + 0.4, 14.6, 7.2, 1.4, "#8d5a3b", 18) +
        [0, 1, 2]
          .map(
            (j) =>
              CY(x + 3 + j * 3.6, D + 4, 4.4, 5, "#2f9e44", 19) +
              CY(x + 3 + j * 3.6, D + 4, 3.2, 2, [c, "#f1c40f", "#ff8fb1"][j], 24),
          )
          .join(""),
    );
  else if (i === 2)
    row(
      24,
      (x, k) =>
        bx(x + 3.4, D + 1, 0.8, 0.8, 6, "#37474f", H - 8) +
        CY(x + 3.8, D + 2, 5, 1.6, "#c9a227", H - 17.6) +
        CY(x + 3.8, D + 2, 8, 2, lt(c, -20), H - 16) +
        CY(x + 3.8, D + 2, 10, 4, c, H - 14) +
        CY(x + 3.8, D + 2, 8, 2, lt(c, -20), H - 10) +
        CY(x + 3.8, D + 2, 5, 1.6, "#c9a227", H - 8.4) +
        (nt ? CY(x + 3.8, D + 2, 14, 0.5, "rgba(255,120,80,.3)", H - 11) : ""),
    );
  else if (i === 3)
    row(7, (x, k) => {
      const cl = [c, "#f1c40f", "#e74c3c", "#2ecc71"][k % 4],
        z = H - 9 - sag(x);
      return (
        bx(x, D + 1, 8, 0.8, 0.8, "#cfd8dc", z + 6) +
        bx(x + 1, D + 1, 6, 0.8, 3.4, cl, z + 2.6) +
        bx(x + 2, D + 1, 4, 0.8, 2.4, cl, z + 0.6) +
        bx(x + 3.2, D + 1, 1.6, 0.8, 1.4, cl, z - 0.6)
      );
    });
  else if (i === 4)
    row(8, (x, k) => {
      if (k % 5 === 4) return "";
      const h = 10 + ((k * 7) % 18);
      let q = bx(x + 2.4, D + 1, 1.4, 1.4, h, "#2e7d32", H - h);
      for (let j = 0; j < 3; j++)
        q +=
          bx(
            x + (j % 2 ? -0.5 : 3),
            D + 0.5,
            4,
            3.4,
            3,
            (k + j) % 2 ? "#3cb44f" : "#2f9e44",
            H - 3 - (j * h) / 3.2,
          ) + bx(x + (j % 2 ? 1 : 2), D + 0.2, 2, 2, 1.4, lt("#3cb44f", 25), H - 2 - (j * h) / 3.2);
      return q + (k % 7 === 2 ? bx(x + 2, D + 0.2, 2.4, 2.4, 2.4, "#f1c40f", H - h - 1) : "");
    });
  else if (i === 5)
    o =
      bx(g0 - 17, D + 1, 2, 2, 34, "#37474f", 0) +
      bx(g0 - 20, D + 0.5, 8, 7, 2, "#263238", 32) +
      bx(g0 - 19, D + 1, 6, 5, 8, nt ? "#ffe58a" : "#e6c35c", 34) +
      bx(g0 - 20, D + 0.5, 8, 7, 2, "#263238", 42) +
      bx(g0 - 17, D + 2, 2, 2, 3, "#263238", 44) +
      bx(g1 + 15, D + 1, 2, 2, 34, "#37474f", 0) +
      bx(g1 + 12, D + 0.5, 8, 7, 2, "#263238", 32) +
      bx(g1 + 13, D + 1, 6, 5, 8, nt ? "#ffe58a" : "#e6c35c", 34) +
      bx(g1 + 12, D + 0.5, 8, 7, 2, "#263238", 42) +
      bx(g1 + 15, D + 2, 2, 2, 3, "#263238", 44);
  else if (i === 6)
    row(9, (x, k) => {
      const z = H - 8 - sag(x),
        cl = ["#ff6b6b", "#feca57", "#48dbfb", "#1dd1a1"][k % 4];
      return (
        bx(x, D + 1, 9, 0.8, 0.8, "#37474f", z + 2.4) +
        bx(x + 3, D + 1, 3.6, 3.4, 3.6, cl, z) +
        (nt ? bx(x + 2, D + 0.6, 5.6, 4.6, 5.6, "rgba(255,255,255,.28)", z - 1) : "")
      );
    });
  else if (i === 7)
    row(12, (x, k) => {
      const z = H - 8 - sag(x);
      return (
        bx(x, D + 1, 12, 0.8, 0.8, "#2f9e44", z + 2) +
        bx(x + 3, D + 1, 4, 3, 3, k % 2 ? "#f78fb3" : "#fff3a0", z - 1) +
        bx(x + 4, D + 0.6, 2, 2, 1.4, "#f1c40f", z + 0.4) +
        bx(x + 8, D + 1, 2.6, 2.2, 2.6, "#2f9e44", z)
      );
    });
  else
    o =
      bx(g0 - 14, D + 1, 6, 6, 8, c, 26) +
      bx(g0 - 12, D + 1, 2, 2, 26, "#37474f", 0) +
      bx(g1 + 8, D + 1, 6, 6, 8, c, 26) +
      bx(g1 + 10, D + 1, 2, 2, 26, "#37474f", 0);
  return o;
};
function EXTH(g0, g1, W, D) {
  const H = 60,
    e = S.ext,
    fc = EXT.fac[e.fac][1],
    dc = EXT.door[e.door][1],
    aw = EXT.awn[e.awn],
    bd = EXT.board[e.board];
  const bxf = (...a) =>
    bxs(a[0], a[1], a[2], a[3], a[4], a[5], a[6] || 0, swp(a[5])).replace(/class="b"/g, 'class="b fcd"');
  let o =
    bxf(0, D - 4, g0, 5, H, fc) +
    bxf(g1, D - 4, W - g1, 5, H, fc) +
    bxf(g0 - 5, D - 4, g1 - g0 + 10, 5, H - 34, fc, 34) +
    (TCn()
      ? bxf(W - 1, 0, 5, (SRn() - 2) * CS, H, fc) +
        bxf(W - 1, (SRn() - 1) * CS, 5, CS, H, fc) +
        bxf(W - 1, (SRn() - 2) * CS, 5, CS, H - 34, fc, 34)
      : bxf(W - 1, 0, 5, D, H, fc)) +
    bxs(0, D - 5, g0, 7, 5, "#6d6258") +
    bxs(g1, D - 5, W - g1, 7, 5, "#6d6258") +
    bxs(W - 2, 0, 7, D, 5, "#6d6258") +
    bxs(0, D - 5, g0, 7, 3, "#efe9dd", H - 3) +
    bxs(g1, D - 5, W - g1, 7, 3, "#efe9dd", H - 3) +
    bxs(W - 2, 0, 7, D, 3, "#efe9dd", H - 3) +
    WIN(g0, g1, W, D, e.win) +
    ORN(g0, g1, W, D, e.orn, H) +
    bx(g0 - 5, D - 6, 5, 6, 34, dc) +
    bx(g1, D - 6, 5, 6, 34, dc) +
    bx(g0 - 5, D - 6, g1 - g0 + 10, 6, 5, dc, 34) +
    bx(g0 - 6, D - 7, 1.5, 8, 36, lt(dc, 30)) +
    bx(g1 + 4.5, D - 7, 1.5, 8, 36, lt(dc, 30)) +
    bx(g0 - 6, D - 7, g1 - g0 + 12, 8, 2, lt(dc, 30), 36) +
    bx(g0, D - 7, 10, 3, 31, dc) +
    bx(g1 - 10, D - 7, 10, 3, 31, dc) +
    bx(g0 + 1.5, D - 8, 7, 1, 11, lt(dc, -28), 2) +
    bx(g1 - 8.5, D - 8, 7, 1, 11, lt(dc, -28), 2) +
    bx(g0 + 1.5, D - 8, 7, 1, 12, isNight() ? "#ffe08a" : "#bfe3ff", 16) +
    bx(g1 - 8.5, D - 8, 7, 1, 12, isNight() ? "#ffe08a" : "#bfe3ff", 16) +
    bx(g0 + 4.6, D - 8.4, 0.8, 1, 12, lt(dc, 20), 16) +
    bx(g1 - 5.4, D - 8.4, 0.8, 1, 12, lt(dc, 20), 16) +
    bx(g0 + 8, D - 8.6, 1.6, 1.4, 6, "#d4af37", 14) +
    bx(g1 - 9.6, D - 8.6, 1.6, 1.4, 6, "#d4af37", 14) +
    bx(g0 - 8, D - 1, g1 - g0 + 16, 7, 2, "#cfc8bb", 0) +
    bx(g0 + 6, D + 6, g1 - g0 - 12, 6, 1, "#6d3b2a", 0) +
    bx(g0 + 8, D + 7, g1 - g0 - 16, 4, 1.2, "#8a4a35", 0) +
    bx(g0 - 11, D - 3, 4, 4, 3, "#263238", 22) +
    bx(g0 - 10.2, D - 2.2, 2.4, 2.4, 5, isNight() ? "#ffe58a" : "#ffd54f", 25) +
    bx(g0 - 11, D - 3, 4, 4, 2, "#263238", 30) +
    bx(g1 + 7, D - 3, 4, 4, 3, "#263238", 22) +
    bx(g1 + 7.8, D - 2.2, 2.4, 2.4, 5, isNight() ? "#ffe58a" : "#ffd54f", 25) +
    bx(g1 + 7, D - 3, 4, 4, 2, "#263238", 30);
  {
    const n = 8,
      sw = (g1 - g0 + 16) / n;
    for (let i = 0; i < n; i++) {
      const cl = i % 2 ? aw[2] : aw[1],
        x = g0 - 8 + i * sw;
      o +=
        bx(x, D + 1, sw, 6, 3, cl, 41) +
        bx(x, D + 7, sw, 6, 3, lt(cl, -6), 38) +
        bx(x, D + 13, sw, 5, 3, lt(cl, -12), 35) +
        bx(x, D + 17.6, sw, 1.4, 5, cl, 31);
    }
    o += bx(g0 - 9, D + 1, 1.5, 18, 2, "#37474f", 34) + bx(g1 + 7.5, D + 1, 1.5, 18, 2, "#37474f", 34);
  }
  const planter = (x0, x1, cols) => {
    let q =
      bx(x0, D + 2, x1 - x0, 8, 7, "#7a4b2a") +
      bx(x0 - 1, D + 1, x1 - x0 + 2, 10, 1.5, "#9a6a3f", 7) +
      bx(x0 + 1, D + 3, x1 - x0 - 2, 6, 1, "#3e2a1c", 8);
    for (let x = x0 + 5, k = 0; x < x1 - 3; x += 9, k++) {
      q +=
        CY(x, D + 6, 7, 5, "#2f9e44", 8) +
        CY(x + 1, D + 7, 5, 3, "#43b05a", 12) +
        CY(x - 2, D + 5, 2.4, 3, cols[k % 3], 14) +
        CY(x + 2, D + 8, 2.4, 3, cols[(k + 1) % 3], 14) +
        CY(x, D + 6, 2.4, 3, cols[(k + 2) % 3], 15);
    }
    return q;
  };
  o +=
    planter(10, g0 - 14, ["#e74c3c", "#f1c40f", "#e84393"]) +
    planter(g1 + 14, W - 14, ["#f1c40f", "#e84393", "#e74c3c"]);
  const nm = esc(S.name || "Mi restaurante"),
    fs = 7,
    wp = (x, w, h, z, html) =>
      `<div class="wp" style="left:${x}px;top:${D + 1.5 - h}px;width:${w}px;height:${h}px;transform:translateZ(${z}px) rotateX(-90deg)">${html}</div>`;
  o += wp(g0, g1 - g0, 10, 46, `<div class="sgn" style="${signCss(e.sign)}font-size:${fs}px">${nm}</div>`);
  const mn =
    [...S.menu, ...(S.menuD || [])]
      .map((id) => rec(id))
      .filter(Boolean)
      .map((r) => `<div>${esc(r.n)} <i>${r.p}🪙</i></div>`)
      .join("") || "<div>—</div>";
  o += wp(
    g1 + 4,
    32,
    24,
    1,
    `<div class="brd" style="background:${bd[1]};border-color:${bd[2]};color:${bd[3]}"><b>MENÚ DE HOY</b>${mn}</div>`,
  );
  return o;
}

function xpv(g, i) {
  const d = EXT[g][i];
  if (g === "roof") return roofSvg(i);
  if (g === "door") return `<div class="pvf"><div class="xd" style="background:${d[1]}"><u></u></div></div>`;
  if (g === "win" && d[4])
    return `<div class="pvf"><div style="width:48px;height:30px;border:4px solid ${d[1]};border-radius:3px;background:linear-gradient(135deg,${d[2]},#0d2a45);box-shadow:0 0 0 1px #555"></div></div>`;
  if (g === "win")
    return `<div class="pvf"><div style="width:40px;height:32px;border:5px solid ${d[1]};background:${d[2]};box-shadow:${d[3] ? `-9px 0 0 ${d[3]},9px 0 0 ${d[3]}` : "none"}"></div></div>`;
  if (g === "orn")
    return `<div class="pvf"><div style="font-size:26px;line-height:1">${["💡", "🌸", "🏮", "🚩", "🌿", "🕯️", "🎉", "🌼"][i]}</div></div>`;
  if (g === "fac") return `<div class="pvf"><i class="pw" style="background:${d[1]}"></i></div>`;
  if (g === "awn")
    return `<div class="pvf"><div class="xa" style="background:repeating-linear-gradient(90deg,${d[1]} 0 10px,${d[2]} 10px 20px)"></div></div>`;
  if (g === "sign")
    return `<div class="pvf"><div class="sgn sm" style="${signCss(i)}">${esc(S.name || "Mi restaurante")}</div></div>`;
  return `<div class="pvf"><div class="brd sm" style="background:${d[1]};border-color:${d[2]};color:${d[3]}"><b>MENÚ</b><div>· · ·</div></div></div>`;
}
function xStyle(g, i) {
  const k = "x" + g + i,
    pr = i * 40;
  if (i > 0 && !S.own.includes(k)) {
    if (S.coins < pr) return;
    S.coins -= pr;
    S.own.push(k);
  }
  S.ext[g] = i;
  save();
  draw();
}
function xgrid() {
  return (
    vgrid() +
    Object.keys(EXT)
      .filter((g) => g !== "win")
      .map(
        (g) =>
          `<p class="mut"><b>${EXL[g]}</b></p><div class="grid">${EXT[g]
            .map((d, i) => {
              const own = i === 0 || S.own.includes("x" + g + i),
                use = S.ext[g] === i;
              return `<div class="card item">${xpv(g, i)}<b>${d[0]}</b><div class="mut">${own ? (use ? "✔ En uso" : "Tuyo") : i * 40 + " 🪙"}</div><button class="s" onclick="xStyle('${g}',${i})" ${use || (!own && S.coins < i * 40) ? "disabled" : ""}>${own ? "Usar" : "Comprar"}</button></div>`;
            })
            .join("")}</div>`,
      )
      .join("")
  );
}
