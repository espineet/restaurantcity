/* vista.js — Construcción de la escena, encuadre, zoom y gestos táctiles. */

function kitchenNew(KW, KD) {
  const x0 = -KW;
  terMig();
  if (S.kv !== 2) kinit();
  else kSync();
  let o = "",
    si = 0;
  S.kobj.forEach((k, i) => {
    const X = x0 + k[0] * KU,
      Y = k[1] * KU;
    o += it(
      "k" + i,
      bx(X - 1, Y, 28, 28, 1, "rgba(0,0,0,.13)") +
        KH[k[2]](0, 0, k[2] === 0 ? si++ < fogCooks() : 0, kRB(kRot(k), X, Y)),
    );
  });
  o +=
    bx(-36, 96, 28, 24, 20, "#8d6e63") +
    bx(-38, 94, 32, 28, 3, "#e9e2d3", 20) +
    bx(x0, KD - 2, KW, 4, 22, "#d7d2c6");
  if (tab === "deco" && ((sel && sel[0] === "k") || (pick && pick.k === "k"))) {
    const d = kDim(),
      n = sel && sel[0] === "k" ? +sel.slice(1) : -1,
      cur = S.kobj[n];
    for (let y = 0; y < d[1]; y++)
      for (let x = 0; x < d[0]; x++) {
        const s = cur && cur[0] === x && cur[1] === y;
        o += `<div class="gc${s ? " sel" : !kFree(x, y, n) ? " no" : ""}" data-kc="${x},${y}" style="left:${x0 + x * KU}px;top:${y * KU}px;width:${KU}px;height:${KU}px"></div>`;
      }
  }
  return o;
}
function tapKCell(x, y) {
  if (pick && pick.k === "k") {
    if (kFree(x, y, -1)) {
      S.kobj.push([x, y, pick.s]);
      const l = S.inv.k,
        j = l.indexOf(pick.s);
      if (j >= 0) l.splice(j, 1);
      if (l.indexOf(pick.s) < 0) pick = null;
      note = "";
      save();
    }
    draw();
    return;
  }
  if (!sel || sel[0] !== "k") return;
  const i = +sel.slice(1),
    a = S.kobj[i],
    j = S.kobj.findIndex((o) => o[0] === x && o[1] === y);
  if (j >= 0 && j !== i) {
    sel = "k" + j;
    draw();
    return;
  }
  if (a && kFree(x, y, i)) {
    a[0] = x;
    a[1] = y;
    save();
  }
  draw();
}
function kBuy(t) {
  const p = PRICE.k[t];
  if (S.coins < p) return;
  if (!Array.isArray(S.inv.k)) S.inv.k = [];
  S.coins -= p;
  msBump("catb", 1);
  S.inv.k.push(t);
  note =
    "✔ " + KN[t] + " comprado. Está en el Inventario: pulsa Colocar y elige una casilla libre de la cocina.";
  save();
  draw();
}
function kgrid() {
  return `<p class="mut">Toca un objeto de la cocina para seleccionarlo y luego una casilla libre para moverlo. Fogones, nevera, lavaplatos, barra de bebidas y encimeras se pueden mover, pero no vender. Cada ampliación de la cocina añade un fogón y una mesa de repostería (fijas, como los fogones y la nevera). Las <b>neveras</b> guardan 50 ingredientes y los <b>arcones</b> 100 (la nevera fija ya guarda 50). Cada mesa permite que un cocinero prepare postres (asígnalo en Plantilla).</p><div class="grid">${[4, 6, 7, 8, 11, 12].map((t) => `<div class="card item">${kpv(t)}<b>${KN[t]}</b><div class="mut">${PRICE.k[t]} 🪙 · vende ${Math.floor(PRICE.k[t] / 2)}</div><button class="s" ${S.coins < PRICE.k[t] ? "disabled" : ""} onclick="kBuy(${t})">Comprar</button></div>`).join("")}</div>${klook("kf", "Suelos de cocina")}${klook("kw", "Paredes de cocina")}`;
}
function carHtml(t, dir) {
  const c = rnd(["#e74c3c", "#3498db", "#f1c40f", "#ecf0f1", "#2ecc71", "#e67e22", "#8e44ad", "#34495e"]),
    L = t === "bus" ? 96 : t === "van" ? 66 : 56,
    g = "#bcd7e6",
    f = dir > 0;
  let o = bx(0, 0, L, 24, 11, t === "bus" ? "#f1c40f" : c, 4);
  if (t === "bus") o += bx(2, 1, L - 4, 22, 9, g, 15) + bx(3, 2, L - 6, 20, 2, "#f1c40f", 24);
  else if (t === "van")
    o +=
      bx(f ? 2 : L * 0.38, 1, L * 0.6 - 2, 22, 13, c, 15) +
      bx(f ? L * 0.62 : L * 0.1, 2, L * 0.26, 20, 9, g, 15);
  else
    o +=
      bx(f ? L * 0.18 : L * 0.32, 2, L * 0.48, 20, 9, g, 15) +
      bx(f ? L * 0.18 : L * 0.32, 2, L * 0.48, 20, 2, c, 24);
  o += bx(f ? L - 2 : 0, 3, 2, 5, 4, "#fff6b0", 6) + bx(f ? L - 2 : 0, 16, 2, 5, 4, "#fff6b0", 6);
  for (const x of [L * 0.16, L * 0.68]) o += bx(x, -2, 10, 4, 10, "#222") + bx(x, 22, 10, 4, 10, "#222");
  return o;
}
function build() {
  const SC = SCn(),
    SR = SRn(),
    W = SC * CS,
    D = SR * CS,
    KW = KWn(),
    KD = KDn(),
    L = S.look,
    tc = OPT.t[L.t][1],
    cu = OPT.c[L.c][1],
    wl = OPT.w[L.w][1],
    m = SC >> 1,
    g0 = (m - 1) * CS,
    g1 = (m + 1) * CS;
  const bk0 = `<div class="gr"></div><div class="rd" style="top:${D + TRn() * CS + 32}px"></div><div class="ln" style="top:${D + TRn() * CS + 70}px"></div><div class="cb" style="top:${D + TRn() * CS + 28}px"></div><div class="zb" style="left:${W / 2 + 70}px;top:${D + TRn() * CS + 32}px"></div>${cityHtml(W, D, KW, KD, "b")}`;
  const EX = tab === "deco" && ccat === "x",
    HX = 60,
    fcx = EXT.fac[S.ext.fac | 0][1];
  crowd.style.display = EX ? "none" : "";
  rfw.innerHTML = "";
  let o = `${lotHtml(W, D)}${cityHtml(W, D, KW, KD)}`;
  if (EX) {
    o += `<div class="wl w1" style="top:${-HX}px;height:${HX}px;width:${W}px;background:${fcx}"></div><div class="wl w3" style="top:${-(HX - 4)}px;height:${HX - 4}px;left:${-KW}px;width:${KW}px;background:${fcx}"></div><div class="wl w4" style="left:${-KW - (HX - 4)}px;width:${HX - 4}px;height:${KD}px;background:${fcx}"></div>`;
    const bxf = (...a) =>
      bxs(a[0], a[1], a[2], a[3], a[4], a[5], a[6] || 0, swp(a[5])).replace(/class="b"/g, 'class="b fcd"');
    o += bxf(-KW, KD - 4, KW + 2, 5, HX - 4, fcx) + bxf(-2, 0, 5, D, HX, fcx) + EXTH(g0, g1, W, D);
    rfw.innerHTML = ROOF(0, 0, W, D, S.ext.roof | 0, HX) + ROOF(-KW, 0, KW + 4, KD, 7, HX - 4);
  } else {
    o += `<div class="fl" style="width:${W}px;height:${D}px;background:${FLTX[L.f] || ""}${OPT.f[L.f][1]}"></div><div class="wl w1" style="width:${W}px;background:${WLTX[L.w] || ""}${wl}"></div><div class="kf" style="left:${-KW}px;width:${KW}px;height:${KD}px;background:${OPT.kf[L.kf | 0][1]}"></div><div class="wl w3" style="left:${-KW}px;width:${KW}px;background:${OPT.kw[L.kw | 0][1]}"></div><div class="wl w4" style="left:${-KW - 120}px;height:${KD}px;background:${OPT.kw[L.kw | 0][3]}"></div>`;
    o +=
      bxs(-2, 0, 4, 120, 28, wl, 0, swp(wl)) +
      bxs(-2, 160, 4, D - 160, 28, wl, 0, swp(wl)) +
      WALLF(g0, g1, W, D);
  }
  if (!EX) {
    S.tbl.forEach((t, i) => {
      o += it("t" + i, tableHtml(t[0] * CS, t[1] * CS, OPT.t[t[2] | 0][1], OPT.t[t[2] | 0][2]));
    });
    S.chr.forEach((c, i) => {
      o += it("c" + i, chairHtml(c[0] * CS, c[1] * CS, OPT.c[c[2] | 0][1], tdir(c), OPT.c[c[2] | 0][2]));
    });
    S.plt.forEach((p, i) => {
      o += it("p" + i, plH(p[0] * CS, p[1] * CS, p[2] | 0));
    });
    S.dec.forEach((p, i) => {
      o += it("d" + i, dcH(p[0] * CS, p[1] * CS, p[2] | 0, dRot(p)));
    });
    S.bars.forEach((b, i) => {
      o += it("b" + i, barH(b[0] * CS, b[1] * CS, b[2] | 0));
    });
    S.stl.forEach((t, i) => {
      o += it("s" + i, stoolH(t[0] * CS, t[1] * CS, t[2] | 0));
    });
    o += kitchenHtml(KW, KD) + winsIn() + (S.tk ? tkHtml(KW, KD) : "");
  }

  if (tab === "deco" && !EX) {
    const sc = sel && !"kvuq".includes(sel[0]) ? ARR(sel[0])[+sel.slice(1)] || null : null,
      oc = occ(),
      fur = new Set(
        [
          ...S.tbl,
          ...S.chr,
          ...S.stl,
          ...S.dec,
          ...S.bars.flatMap((b) => [0, 1, 2, 3].map((k) => [b[0] + k, b[1]])),
        ].map(key),
      ),
      sl = sc ? key(sc) : "";
    for (let y = 0; y < SR; y++)
      for (let x = 0; x < SC + TCn(); x++) {
        if (x >= SC && y < TY0()) continue;
        const k = x + "," + y;
        o += `<div class="gc${k === sl ? " sel" : oc.has(k) && !fur.has(k) ? " no" : ""}" data-c="${k}" style="left:${x * CS}px;top:${y * CS}px"></div>`;
      }
  }
  bkw.innerHTML = bk0;
  wd.innerHTML = o;
}
function bounds() {
  const SC = SCn(),
    SR = SRn(),
    W = SC * CS,
    D = SR * CS,
    KW = KWn(),
    KD = KDn(),
    x0 = -KW,
    x1 = W + Math.max(3, TCn()) * CS,
    y0 = 0,
    y1 = D + 112 + TRn() * CS,
    Cx = (x0 + x1) / 2,
    Cy = (y0 + y1) / 2;
  const pts = [
    [x0, y0, 0],
    [x1, y0, 0],
    [x0, y1, 0],
    [x1, y1, 0],
    [x0, y0, 120],
    [x1, y0, 120],
    [x0, KD, 120],
    [x0, -80, 210],
    [x1, -80, 210],
  ];
  let a = 1e9,
    b = -1e9,
    c = 1e9,
    d = -1e9;
  pts.forEach(([x, y, z]) => {
    const X = (x - Cx - (y - Cy)) * 0.7071,
      Y = (x - Cx + (y - Cy)) * 0.3536 - 0.866 * z;
    a = Math.min(a, X);
    b = Math.max(b, X);
    c = Math.min(c, Y);
    d = Math.max(d, Y);
  });
  return { C: [Cx, Cy], a, b, c, d };
}
const V = { z: 1, x: 0, y: 0 },
  ptr = new Map();
let pd = 0;
function apply() {
  const T = `translate(${V.x}px,${V.y}px) scale(${(stage._k || 1) * V.z}) rotateX(60deg) rotateZ(45deg)`;
  iso.style.transform = T;
  bk.style.transform = T;
  rf.style.transform = T;
}
function fit() {
  if (!stage.isConnected) return;
  const b = bounds(),
    w = stage.clientWidth,
    s = Math.max(0.4, Math.min(1, w / (b.b - b.a + 16)));
  stage._k = s;
  stage.style.height = (b.d - b.c + 16) * s + "px";
  const sx = w / 2 - ((b.a + b.b) / 2) * s,
    sy = 8 * s - b.c * s;
  stage._c = [sx, sy];
  for (const e of [iso, bk, rf]) {
    e.style.left = sx - b.C[0] + "px";
    e.style.top = sy - b.C[1] + "px";
    e.style.transformOrigin = b.C[0] + "px " + b.C[1] + "px";
  }
  apply();
}
function zoomAt(f, cx, cy) {
  const r = stage.getBoundingClientRect(),
    c = stage._c || [0, 0],
    nz = Math.max(0.7, Math.min(3.5, V.z * f)),
    g = nz / V.z;
  V.x = (cx - r.left - c[0]) * (1 - g) + V.x * g;
  V.y = (cy - r.top - c[1]) * (1 - g) + V.y * g;
  V.z = nz;
  apply();
}
function zb(f) {
  const r = stage.getBoundingClientRect();
  zoomAt(f, r.left + r.width / 2, r.top + r.height / 2);
}
function zr() {
  V.z = 1;
  V.x = 0;
  V.y = 0;
  apply();
}
const pdist = () => {
  const a = [...ptr.values()];
  return Math.hypot(a[0][0] - a[1][0], a[0][1] - a[1][1]);
};
stage.addEventListener("pointerdown", (e) => {
  if (e.target.closest(".zc")) return;
  ptr.set(e.pointerId, [e.clientX, e.clientY, e.clientX, e.clientY, 0]);
  pd = ptr.size === 2 ? pdist() : 0;
});
stage.addEventListener("pointermove", (e) => {
  const o = ptr.get(e.pointerId);
  if (!o) return;
  const nx = e.clientX,
    ny = e.clientY;
  if (!o[4] && Math.hypot(nx - o[2], ny - o[3]) > 6) {
    o[4] = 1;
    try {
      stage.setPointerCapture(e.pointerId);
    } catch (_) {}
  }
  if (ptr.size === 1) {
    if (o[4]) {
      V.x += nx - o[0];
      V.y += ny - o[1];
      apply();
    }
    o[0] = nx;
    o[1] = ny;
  } else if (ptr.size === 2) {
    o[0] = nx;
    o[1] = ny;
    const d = pdist(),
      a = [...ptr.values()];
    if (pd) zoomAt(d / pd, (a[0][0] + a[1][0]) / 2, (a[0][1] + a[1][1]) / 2);
    pd = d;
  }
});
const pup = (e) => {
  ptr.delete(e.pointerId);
  pd = 0;
};
stage.addEventListener("pointerup", pup);
stage.addEventListener("pointercancel", pup);
stage.addEventListener(
  "wheel",
  (e) => {
    e.preventDefault();
    zoomAt(e.deltaY < 0 ? 1.15 : 1 / 1.15, e.clientX, e.clientY);
  },
  { passive: false },
);
