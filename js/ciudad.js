/* ciudad.js — Ventanas, calle, edificios y ciudad alrededor del local. */

function winModel(wl, ctr, sty, W, D) {
  const d = EXT.win[sty] || EXT.win[0],
    f = d[1],
    g = isNight() ? "#ffe08a" : d[2],
    s = d[3],
    Wd = 36,
    Hh = 30,
    z0 = 16,
    u0 = ctr - Wd / 2;
  const P = (u, v, w, dd, h, c, z) =>
    wl ? bx(W - 2 + v, u0 + u, dd, w, h, c, z) : bx(u0 + u, D - 5 + v, w, dd, h, c, z);
  let o =
    P(-3, 6, Wd + 6, 5, 3, "#e9e4d9", z0 - 3) +
    P(0, 0, Wd, 7, Hh, f, z0) +
    P(3, -1, Wd - 6, 9, Hh - 6, g, z0 + 3) +
    P(Wd / 2 - 1, -1.5, 2, 10, Hh - 6, f, z0 + 3) +
    P(3, -1.5, Wd - 6, 10, 2, f, z0 + Hh / 2 - 1) +
    P(-2, 0, Wd + 4, 7, 3, lt(f, 18), z0 + Hh);
  if (s && sty === 3) o += P(3, -2, 9, 11, Hh - 6, s, z0 + 3) + P(Wd - 12, -2, 9, 11, Hh - 6, s, z0 + 3);
  else if (s) {
    o += P(-8, 0, 6, 7, Hh, s, z0) + P(Wd + 2, 0, 6, 7, Hh, s, z0);
    for (const j of [6, 13, 20])
      o += P(-8, -0.5, 6, 8, 1, lt(s, -25), z0 + j) + P(Wd + 2, -0.5, 6, 8, 1, lt(s, -25), z0 + j);
  }
  return o;
}
const WIN = (g0, g1, W, D) => {
  winSync();
  const mk = (w, ctr, c) =>
    w
      ? bx(W + 3, ctr - 21, 1.5, 42, 2, c, 12) +
        bx(W + 3, ctr - 21, 1.5, 42, 2, c, 46) +
        bx(W + 3, ctr - 21, 1.5, 2, 36, c, 12) +
        bx(W + 3, ctr + 19, 1.5, 2, 36, c, 12)
      : bx(ctr - 21, D + 2, 42, 1.5, 2, c, 12) +
        bx(ctr - 21, D + 2, 42, 1.5, 2, c, 46) +
        bx(ctr - 21, D + 2, 2, 1.5, 36, c, 12) +
        bx(ctr + 19, D + 2, 2, 1.5, 36, c, 12);
  let o = S.wins
    .map((w, j) =>
      it(
        "v" + j,
        winModel(w[0], (w[1] + 0.5) * CS, w[2], W, D) +
          (sel === "v" + j ? mk(w[0], (w[1] + 0.5) * CS, "#ffb300") : ""),
      ),
    )
    .join("");
  const ex = sel && sel[0] === "v" ? +sel.slice(1) : pick && pick.k === "v" ? -1 : null;
  if (ex != null)
    for (const w of [0, 1])
      for (let p = 0; p < (w ? SRn() : SCn()); p++)
        if (wFree(w, p, ex))
          o +=
            `<div class="wcm" data-wc="${w},${p}">` +
            (w
              ? bx(W + 3, (p + 0.5) * CS - 19, 1.5, 38, 36, "rgba(255,179,0,.55)", 12)
              : bx((p + 0.5) * CS - 19, D + 2, 38, 1.5, 36, "rgba(255,179,0,.55)", 12)) +
            "</div>";
  return o;
};
const CY = (cx, cy, d, h, c, z) => dsc(cx - d / 2, cy - d / 2, d, h, c, z);
const SPH = (cx, cy, D, z, c) =>
  [
    [0.6, 0],
    [0.92, 0.2],
    [1, 0.45],
    [0.92, 0.7],
    [0.6, 0.9],
  ]
    .map(([f, t], j) => dsc(cx - (D * f) / 2, cy - (D * f) / 2, D * f, 2, lt(c, j * 8 - 8), z + D * t))
    .join("");
function treeC(cx, cy, k) {
  if (k === 1) {
    let o = CY(cx, cy, 5, 14, "#5d4037", 0);
    for (let j = 0; j < 6; j++) o += CY(cx, cy, 34 - j * 5.5, 6, lt("#2e7d46", j * 5), 12 + j * 9);
    return o;
  }
  return (
    CY(cx, cy, 6, 24, "#6b4226", 0) +
    SPH(cx, cy, 34, 20, k === 2 ? "#6aa84f" : "#3f9b4a") +
    SPH(cx + 8, cy - 6, 22, 34, k === 2 ? "#8bc34a" : "#4caf56")
  );
}
function lampC(cx, cy) {
  const n = isNight();
  return (
    CY(cx, cy, 6, 2, "#37474f", 0) +
    CY(cx, cy, 2.5, 46, "#455a64", 2) +
    bx(cx - 5, cy - 3, 10, 6, 3, "#37474f", 47) +
    bx(cx - 4, cy - 2.5, 8, 5, 3, n ? "#ffe58a" : "#cfd8dc", 44) +
    (n ? CY(cx, cy, 56, 0, "rgba(255,225,130,.22)", 0.6) : "")
  );
}
const benchC = (x, y) =>
  bx(x, y, 28, 10, 4, "#8d5a3b", 8) +
  bx(x, y, 28, 2, 10, "#8d5a3b", 12) +
  bx(x + 2, y + 1, 3, 8, 8, "#37474f") +
  bx(x + 23, y + 1, 3, 8, 8, "#37474f");
const binC = (cx, cy) => CY(cx, cy, 9, 14, "#546e7a", 0) + CY(cx, cy, 10, 1, "#37474f", 14);
const hydC = (cx, cy) =>
  CY(cx, cy, 6, 10, "#c0392b", 0) +
  CY(cx, cy, 8, 2, "#e74c3c", 8) +
  bx(cx + 3, cy - 1, 3, 2, 2, "#c0392b", 5);
const busC = (x, y) =>
  bx(x, y, 52, 14, 3, "#455a64", 38) +
  bx(x + 2, y + 1, 3, 3, 38, "#37474f") +
  bx(x + 47, y + 1, 3, 3, 38, "#37474f") +
  bx(x + 2, y, 48, 1.5, 28, "#b3e5fc", 8) +
  bx(x + 8, y + 4, 36, 6, 4, "#8d5a3b", 8) +
  bx(x + 44, y + 10, 6, 2, 18, "#1976d2", 12);
const bldH = (x, y, w, d, h, c, rc, aw) =>
  bx(x, y, w, d, h, c).replace('class="b"', 'class="b cbd"') +
  bx(x - 2, y - 2, w + 4, d + 4, 4, rc, h) +
  bx(x + w - 26, y + 8, 16, 14, 10, "#8d6e63", h + 4) +
  bx(x + w / 2 - 9, y + d, 18, 2, 26, "#5d4037") +
  bx(x + w / 2 - 14, y + d, 28, 9, 3, aw, 28) +
  bx(x + 8, y + d, Math.max(8, w / 2 - 22), 1.5, 16, "#9fd2f0", 6) +
  bx(x + w / 2 + 14, y + d, Math.max(8, w / 2 - 22), 1.5, 16, "#9fd2f0", 6);
function lotHtml(W, D) {
  const LW = Math.max(3, TCn()) * CS,
    x1 = W + LW,
    y0 = TY0() * CS,
    built = TCn() > 0,
    r = "#7a5c3a",
    p = "#5d4037";
  let o = `<div class="lg" style="left:${W}px;top:0;width:${LW}px;height:${D}px"></div>`;
  if (built) o += `<div class="tf" style="left:${W}px;top:${y0}px;width:${LW}px;height:${D - y0}px"></div>`;
  o +=
    bx(x1 - 3, 0, 4, D, 10, r) +
    bx(W, 0, LW, 4, 10, r) +
    bx(x1 - 4, 0, 5, 5, 16, p) +
    bx(x1 - 4, D - 4, 5, 5, 16, p) +
    bx(W, D - 4, 5, 5, 16, p);
  if (built) {
    o +=
      bx(W, D - 3, CS, 4, 10, r) +
      bx(W + 2 * CS, D - 3, LW - 2 * CS, 4, 10, r) +
      bx(W + CS - 2, D - 4, 5, 5, 16, p) +
      bx(W + 2 * CS - 2, D - 4, 5, 5, 16, p) +
      bx(W, y0 - 3, LW, 6, 12, "#2f7d3a") +
      bx(W + 6, y0 - 3, LW - 12, 6, 3, "#43b05a", 12);
    o += treeC(W + 34, Math.max(20, y0 / 2), 2) + treeC(x1 - 34, Math.max(34, y0 / 2 + 30), 0);
  } else {
    o +=
      bx(W, D - 3, LW, 4, 10, r) +
      bx(W + LW / 2 - 1, D - 4, 3, 3, 26, p) +
      bx(W + LW / 2 - 16, D - 5, 32, 2, 13, "#2e7d32", 24) +
      treeC(W + 30, D / 2, 2) +
      treeC(x1 - 30, D / 3, 0) +
      bx(W + LW / 2 - 14, D / 2 + 30, 28, 10, 4, "#8d6e63", 0);
  }
  return o;
}

function terMig() {
  const SR = SRn();
  let ch = false;
  for (const k of ["t", "c", "p", "b", "s", "d"]) {
    const a = ARR(k);
    for (let i = a.length - 1; i >= 0; i--)
      if (a[i][1] >= SR) {
        (S.inv[k] = S.inv[k] || []).push(a[i][2] | 0);
        a.splice(i, 1);
        ch = true;
      }
  }
  if (ch) {
    sel = null;
    save();
  }
}
function terDesc() {
  if (!S.ter || lvl() < 10) return "🔒 Construye primero la terraza (nivel 10) en Catálogo → Terraza.";
  const L = Math.min(5, S.terL | 0);
  let t = `Nivel ${L}/5. Ahora ${TCn()}×${TRw()} casillas (+2×2 por nivel).`;
  if (L < 5 && SRn() < TSZ(L + 1))
    t += ` Para pasar a ${TSZ(L + 1)}×${TSZ(L + 1)} necesitas un salón de ${TSZ(L + 1)}×${TSZ(L + 1)}: amplíalo antes.`;
  return t;
}
function cityHtml(W, D, KW, KD, part) {
  const pal = [
      ["#d9b89a", "#9a6a4a", "#c0392b"],
      ["#c98f7a", "#8a5a4a", "#2f6f9f"],
      ["#e8d6b0", "#a88a5a", "#2e7d32"],
      ["#9fb4c7", "#5f7a92", "#c0392b"],
      ["#b7c5a1", "#6f8a55", "#8e44ad"],
      ["#cfa3a3", "#8f5f5f", "#e67e22"],
      ["#a5a5b8", "#6a6a80", "#2f6f9f"],
      ["#e0c27a", "#a8893f", "#c0392b"],
    ],
    wL = [130, 160, 120, 180, 140, 150, 125, 170],
    hL = [150, 210, 170, 240, 160, 200, 180, 230],
    x1 = W + 6 * CS,
    ys = Math.max(D, KD);
  let o = `<div class="lg" style="left:${W}px;top:0;width:${6 * CS}px;height:${D}px;opacity:.5"></div><div class="rd" style="top:-122px;height:58px"></div><div class="ln" style="top:-94px"></div><div class="cb" style="top:-128px"></div><div class="cb" style="top:-64px"></div>`,
    x = -KW - 330,
    k = 0;
  while (x < x1 + 300) {
    const w = wL[k % 8],
      h = hL[(k * 3 + 1) % 8],
      q = pal[k % 8];
    o += bldH(x, -212, w, 84, h, q[0], q[1], q[2]);
    x += w + 8;
    k++;
  }
  const dy = (ys + 30) / 3;
  for (let i = 0; i < 3; i++) {
    const q = pal[(i + 2) % 8];
    o += bldH(-KW - 150, -10 + i * dy, 112, dy - 8, [170, 140, 200][i], q[0], q[1], q[2]);
  }
  for (let i = 0, tx = -KW - 60; tx < x1 + 60; tx += 120, i++)
    o += treeC(tx, -38, i % 3 === 1 ? 1 : i % 3 === 2 ? 2 : 0);
  const ob = o;
  o = "";
  for (const tx of [-KW + 50, -KW + 170]) if (tx < -50) o += treeC(tx, ys + 30, tx % 2 ? 1 : 0);
  o += treeC(x1 + 60, D + 30, 0) + treeC(x1 + 150, D + 30, 1);
  for (const lx of [-KW + 30, -110, -12, W + 12, x1 + 12, x1 + 120, x1 + 230])
    if (lx > -KW + 10) o += lampC(lx, (lx < 0 ? ys : D) + 24);
  o +=
    benchC(-KW + 90, ys + 6) +
    benchC(x1 + 40, D + 6) +
    binC(-30, ys + 22) +
    hydC(-60, ys + 22) +
    hydC(x1 + 90, D + 22) +
    busC(x1 + 160, D + 4);
  return part === "b" ? ob : o;
}
