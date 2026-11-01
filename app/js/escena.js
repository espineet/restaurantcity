/* escena.js — Escena isométrica: geometría, personajes (SVG), distribución del local y rutas. */

const swp = (s) => String(s).replace(/(\d+)deg/g, (m, a) => (a === "0" ? "90deg" : a === "90" ? "0deg" : m));
const bx = (x, y, w, d, h, c, z = 0, c2) =>
  `<div class="b" style="left:${x}px;top:${y}px;--w:${w}px;--d:${d}px;--h:${h}px;--c:${c};${c2 ? `--c2:${c2};` : ""}transform:translateZ(${z}px)"><i class="t"></i><i class="s1"></i><i class="s2"></i></div>`;
const bxs = (x, y, w, d, h, c, z = 0, c2, m = 48) => {
  if (w <= m * 1.5 && d <= m * 1.5) return bx(x, y, w, d, h, c, z, c2);
  const nx = Math.max(1, Math.ceil(w / m)),
    ny = Math.max(1, Math.ceil(d / m));
  let q = "";
  for (let i = 0; i < nx; i++)
    for (let j = 0; j < ny; j++) {
      const x0 = x + (w * i) / nx,
        y0 = y + (d * j) / ny;
      q += bx(x0, y0, w / nx + (i < nx - 1 ? 0.3 : 0), d / ny + (j < ny - 1 ? 0.3 : 0), h, c, z, c2);
    }
  return q;
};
const TKC = 1500,
  CS = 40,
  SCn = () => 8 + S.sal,
  SRn = () => 8 + S.sal,
  KWn = () => 160 + 26 * S.kit,
  KDn = () => 200 + 20 * S.kit,
  cc = (c) => c * CS + CS / 2,
  XL = -90,
  XR = () => SCn() * CS + 90 + 6 * CS,
  DOOR = () => SCn() * 20,
  BB = "rotateZ(-45deg) rotateX(-90deg) scaleY(1.155)",
  PY = 140,
  key = (c) => c[0] + "," + c[1];
const RSV = new Set();
let GRPN = 0;
let busy = 0,
  last = 0,
  sp = 1,
  cr = 3,
  sel = null,
  pick = null,
  note = "",
  ccat = "f",
  seatsig = "";
const P = [],
  K = [],
  SEATS = [],
  BSEATS = [],
  BM = [],
  DM = [],
  Q = [],
  WS = [],
  CKS = [],
  CT = [
    ["f", "Suelo"],
    ["w", "Pared"],
    ["t", "Mobiliario"],
    ["b", "Barra"],
    ["d", "Adornos"],
    ["x", "Exterior"],
    ["k", "Cocina"],
    ["z", "Terraza"],
    ["r", "Ropa"],
    ["i", "Inventario"],
  ],
  DP = { cerveza: 9, vinotinto: 14, agua: 4, vinoblanco: 14, cola: 6, limonada: 7, zumo: 8, champan: 22 };
const stage = document.createElement("div");
stage.className = "stage";
stage.innerHTML =
  '<div class="iso" id="bk"><div id="bkw"></div></div><div class="iso" id="iso"><div id="wd"></div><div id="crowd"></div></div><div class="iso" id="rf"><div id="rfw"></div></div><div class="sign" id="sign"></div><div class="zc"><button onclick="zb(1.25)">＋</button><button onclick="zb(.8)">－</button><button onclick="zr()">⟲</button></div>';
const iso = stage.querySelector("#iso"),
  bk = stage.querySelector("#bk"),
  bkw = stage.querySelector("#bkw"),
  wd = stage.querySelector("#wd"),
  rf = stage.querySelector("#rf"),
  rfw = stage.querySelector("#rfw"),
  crowd = stage.querySelector("#crowd"),
  sign = stage.querySelector("#sign");
const lt = (c, a) => {
  if (c.length === 4) c = "#" + [...c.slice(1)].map((x) => x + x).join("");
  return (
    "#" +
    [1, 3, 5]
      .map((i) =>
        Math.max(0, Math.min(255, parseInt(c.substr(i, 2), 16) + a))
          .toString(16)
          .padStart(2, "0"),
      )
      .join("")
  );
};
const rnd = (a) => a[(Math.random() * a.length) | 0];
let restSel = 0;
const rcRem = () => 2 - (S.rest && S.rest.w === mon(S.day) ? S.rest.n : 0);
function person(o = {}) {
  const fx = o.chef || o.waiter || o.barman,
    r = Math.random(),
    f = fx ? 0 : Math.random() < 0.5,
    kid = !fx && r < 0.15,
    eld = !fx && r > 0.85;

  const sk =
      o.look && o.look[0]
        ? o.look[0]
        : fx
          ? "#f0c29a"
          : rnd(["#f3c9a5", "#e8b48a", "#c68a5e", "#8d5a3b", "#5c3a24", "#f6d6bd"]),
    hc =
      o.look && o.look[1]
        ? o.look[1]
        : eld
          ? rnd(["#b8b8b8", "#e0e0e0"])
          : rnd(["#2b1d14", "#4a2e1b", "#7a4a22", "#c79a3b", "#1c1c1c", "#b5472a"]),
    formal = !fx && !f && !kid && !eld && Math.random() < 0.25,
    tp = o.uni
      ? o.uni.t
      : o.barman
        ? "#7b1e3a"
        : fx
          ? "#ffffff"
          : formal
            ? "#2d3436"
            : rnd([
                "#e74c3c",
                "#3498db",
                "#2ecc71",
                "#f39c12",
                "#9b59b6",
                "#1abc9c",
                "#e67e22",
                "#fd79a8",
                "#fdcb6e",
                "#ecf0f1",
                "#2d3436",
              ]),
    pc = o.uni
      ? o.uni.p
      : o.chef
        ? "#4a4a4a"
        : o.waiter || o.barman
          ? "#1f1f1f"
          : formal
            ? "#2d3436"
            : rnd(["#2c3e50", "#34495e", "#6c5ce7", "#7f8c8d", "#2d3436", "#0984e3", "#8d6e63"]),
    sk2 = f && !kid && Math.random() < 0.4,
    lng = o.look ? !!(o.look[2] & 1) : f && Math.random() < 0.6,
    bun = f && !lng && Math.random() < 0.5,
    bald = eld && !f && Math.random() < 0.3,
    s = kid ? 0.72 : 1,
    st = 'stroke="rgba(43,33,24,.5)" stroke-width="1" stroke-linejoin="round"',
    lg = sk2 ? sk : pc;
  let g = `<g class="bd" ${st}>`;
  g += `<g class="lgA"><rect x="13" y="50" width="6" height="26" rx="2.5" fill="${lg}"/><ellipse cx="16" cy="77" rx="5" ry="3" fill="#222"/></g><g class="lgB"><rect x="21" y="50" width="6" height="26" rx="2.5" fill="${lg}"/><ellipse cx="24" cy="77" rx="5" ry="3" fill="#222"/></g>`;
  if (lng) g += `<path d="M9 14 L7 38 L33 38 L31 14Z" fill="${hc}"/>`;
  g += `<rect x="11" y="26" width="18" height="${sk2 ? 20 : 26}" rx="5" fill="${tp}"/>`;
  if (sk2) g += `<path d="M11 44 L29 44 L33 62 L7 62Z" fill="${pc}"/>`;
  if (o.uni && o.uni.vest)
    g += `<path d="M11 27 L17.5 27 L20 50 L11 52Z" fill="${o.uni.vest}"/><path d="M29 27 L22.5 27 L20 50 L29 52Z" fill="${o.uni.vest}"/>`;
  if (o.uni && o.uni.apron)
    g += `<rect x="13" y="31" width="14" height="30" rx="3" fill="${o.uni.apron}"/><rect x="12" y="44" width="16" height="3" fill="rgba(0,0,0,.25)"/>`;
  if (formal || o.waiter)
    g += `<path d="M20 26 L16.5 34 L20 49 L23.5 34Z" fill="#fff"/><path d="M20 29 L18.8 35 L20 45 L21.2 35Z" fill="${(o.uni && o.uni.tie) || "#c0392b"}"/>`;
  g += `<g class="arA"><rect x="6" y="27" width="5" height="21" rx="2.5" fill="${tp}"/><circle cx="8.5" cy="50" r="2.8" fill="${sk}"/></g><g class="arB"><rect x="29" y="27" width="5" height="21" rx="2.5" fill="${tp}"/><circle cx="31.5" cy="50" r="2.8" fill="${sk}"/></g>`;
  g += `<rect x="17.5" y="22" width="5" height="6" fill="${sk}"/><circle cx="9.7" cy="15" r="2" fill="${sk}"/><circle cx="30.3" cy="15" r="2" fill="${sk}"/><circle cx="20" cy="14" r="10.5" fill="${sk}"/>`;
  if (bun) g += `<circle cx="20" cy="2" r="4.5" fill="${hc}"/>`;
  if (!bald)
    g += `<path d="M9.5 13 Q8.5 1.5 20 2 Q31.5 1.5 30.5 13 Q27 6.5 20 7.5 Q13 6.5 9.5 13Z" fill="${hc}"/>`;
  if (o.chef) {
    const hh = (o.uni && o.uni.hat) || "#fff";
    g += `<rect x="12" y="-6" width="16" height="9" rx="4" fill="${hh}"/><rect x="11" y="1" width="18" height="4" fill="${hh}"/>`;
  }
  g += `<g stroke="none"><circle cx="16.3" cy="14.5" r="1.3" fill="#222"/><circle cx="23.7" cy="14.5" r="1.3" fill="#222"/><circle cx="14" cy="18" r="2" fill="#e57373" opacity=".35"/><circle cx="26" cy="18" r="2" fill="#e57373" opacity=".35"/></g><path d="M16 18.5 Q20 22.5 24 18.5" stroke="#222" fill="none" stroke-width="1.2" stroke-linecap="round"/>`;
  if (eld || (o.look && o.look[2] & 2) || (!o.look && Math.random() < 0.12))
    g += `<circle cx="16.3" cy="14.5" r="3" fill="none"/><circle cx="23.7" cy="14.5" r="3" fill="none"/><path d="M19.3 14.5h1.4" fill="none"/>`;
  return `<svg viewBox="0 -8 40 92" width="${22 * s}" height="${50.6 * s}" style="margin-left:-${11 * s}px">${g}</g></svg>`;
}
function mkp(svg, st) {
  const d = document.createElement("div");
  d.className = "pp";
  if (st) d.dataset.st = st;
  d.innerHTML = '<span class="sh"></span>' + svg;
  crowd.appendChild(d);
  return d;
}
function face(p, t) {
  let b = p.el.querySelector(".bub");
  if (!b) {
    b = document.createElement("span");
    b.className = "bub";
    p.el.appendChild(b);
  }
  b.textContent = t;
}
function solid(ex) {
  const b = new Set();
  S.tbl.forEach((t, i) => {
    if (!(ex && ex[0] === "t" && ex[1] === i)) b.add(key(t));
  });
  S.chr.forEach((t, i) => {
    if (!(ex && ex[0] === "c" && ex[1] === i)) b.add(key(t));
  });
  S.plt.forEach((p, i) => {
    if (!(ex && ex[0] === "p" && ex[1] === i)) b.add(key(p));
  });
  S.bars.forEach((r, i) => {
    if (!(ex && ex[0] === "b" && ex[1] === i))
      for (let k = 0; k < 4; k++) {
        b.add(r[0] + k + "," + r[1]);
        b.add(r[0] + k + "," + (r[1] - 1));
      }
  });
  S.stl.forEach((t, i) => {
    if (!(ex && ex[0] === "s" && ex[1] === i)) b.add(key(t));
  });
  S.dec.forEach((t, i) => {
    if (!(ex && ex[0] === "d" && ex[1] === i)) b.add(key(t));
  });
  return b;
}
function occ(ex) {
  const b = solid(ex),
    m = SCn() >> 1,
    r = SRn() - 1;
  b.add("0,3");
  b.add(m - 1 + "," + r);
  b.add(m + "," + r);
  if (TCn()) {
    b.add(SCn() - 1 + "," + (SRn() - 2));
    b.add(SCn() + "," + (SRn() - 2));
    b.add(SCn() + 1 + "," + (SRn() - 1));
  }
  return b;
}
function spot() {
  const o = occ(),
    SC = SCn(),
    SR = SRn();
  for (let y = 4; y <= SR - 3; y += 3)
    for (let x = 1; x < SC; x += 2) {
      if (
        ![
          [x, y],
          [x, y - 1],
          [x, y + 1],
        ].some((c) => o.has(c + ""))
      )
        return [x, y];
    }
  return null;
}
function addTable() {
  const p = spot();
  if (!p) return false;
  S.tbl.push([p[0], p[1], 0]);
  S.chr.push([p[0], p[1] - 1, 0], [p[0], p[1] + 1, 0]);
  return true;
}
function addPlant() {
  const o = occ(),
    SC = SCn(),
    SR = SRn(),
    m = SC >> 1,
    c = [];
  for (let x = 0; x < SC; x++) if (x < m - 1 || x > m + 1) c.push([x, 0]);
  for (let y = 1; y < SR - 1; y++) c.push([SC - 1, y], [0, y]);
  for (const p of c)
    if (!o.has(key(p)) && p[1] !== 3) {
      S.plt.push([p[0], p[1], 0]);
      return true;
    }
  return false;
}
function migrMenu() {
  try {
    S.unlocked = (S.unlocked || []).filter((i) => REC.some((r) => r.id === i));
    for (const r of REC) if (r.u === 0 && !S.unlocked.includes(r.id)) S.unlocked.push(r.id);
    S.menu = (S.menu || []).filter((i) => S.unlocked.includes(i) && rec(i) && !rec(i).d);
    if (!S.menu.length) S.menu = ["guisantes", "huevos"];
    S.menuD = (S.menuD || []).filter((i) => S.unlocked.includes(i) && rec(i) && rec(i).d);
    if (!S.menuD.length) S.menuD = ["melon", "sandia"];
    for (const k in S.stock) if (!ING[k]) delete S.stock[k];
  } catch (e) {}
}
function initLayout() {
  migrMenu();
  if (!S.v10) {
    S.sal *= 2;
    S.kit *= 2;
    S.v10 = 1;
  }
  S.menu = S.menu.slice(0, slots());
  S.menuD = S.menuD.slice(0, dslots());
  const n = S.inv;
  if (!Array.isArray(n.t))
    S.inv = { t: Array(n.t | 0).fill(S.look.t), c: Array(n.c | 0).fill(S.look.c), p: Array(n.p | 0).fill(0) };
  const em = S.inv.t.length + S.inv.c.length + S.inv.p.length === 0;
  if (!S.laid && !S.tbl.length && !S.chr.length && !S.plt.length && em) {
    while (S.tbl.length < S.tables) if (!addTable()) break;
    while (S.plt.length < S.deco) if (!addPlant()) break;
  }
  S.tbl.forEach((t) => {
    if (t[2] == null) t[2] = S.look.t;
  });
  S.chr.forEach((c) => {
    if (c[2] == null) c[2] = S.look.c;
  });
  S.plt.forEach((p) => {
    if (p[2] == null) p[2] = 0;
  });
  ["b", "s", "d", "v", "u", "q", "k"].forEach((k) => {
    if (!Array.isArray(S.inv[k])) S.inv[k] = [];
  });
  wiSync();
  crewPad();
  ccrewPad();
  if (!S.uni) S.uni = { w: 0, c: 0 };
  if (!S.dec) S.dec = [];
  S.laid = 1;
  if (!S.barL) {
    S.barL = 1;
    let ok = 0;
    for (const q of [
      [2, 1],
      [1, 1],
      [0, 1],
      [3, 1],
      [4, 1],
      [2, 2],
      [1, 2],
      [2, 5],
    ])
      if (canPut("b", q[0], q[1])) {
        S.bars.push([q[0], q[1], 0]);
        ok = 1;
        break;
      }
    if (!ok) S.inv.b.push(0);
  }
}
function tdir(c) {
  const T = S.tbl.map(key);
  return (
    [
      [0, 1],
      [0, -1],
      [1, 0],
      [-1, 0],
    ].find((d) => T.includes(c[0] + d[0] + "," + (c[1] + d[1]))) || null
  );
}
function seatsFor() {
  const sig = JSON.stringify([S.tbl, S.chr, S.bars, S.stl]);
  if (sig === seatsig) return;
  seatsig = sig;
  SEATS.length = 0;
  BSEATS.length = 0;
  S.chr.forEach((c) => {
    if (tdir(c))
      SEATS.push({
        cx: c[0],
        cy: c[1],
        x: cc(c[0]),
        y: cc(c[1]),
        u: 0,
        rs: RSV.has(c[0] + "," + c[1]) ? 1 : 0,
      });
  });
  S.stl.forEach((s) => {
    const j = S.bars.findIndex((b) => s[1] === b[1] + 1 && s[0] >= b[0] && s[0] <= b[0] + 3);
    if (j >= 0) BSEATS.push({ cx: s[0], cy: s[1], x: cc(s[0]), y: cc(s[1]), u: 0, bar: j });
  });
}
function route(a, b) {
  const s = solid(),
    SC = SCn(),
    SR = GRn(),
    SI = SRn(),
    mm = SC >> 1;
  if (TCn() && b[0] >= SC && a[1] === SI - 1 && (a[0] === mm - 1 || a[0] === mm)) a = [SC + 1, SI - 1];
  s.delete(key(a));
  s.delete(key(b));
  const prev = new Map([[key(a), null]]),
    q = [a];
  while (q.length) {
    const c = q.shift();
    if (c[0] === b[0] && c[1] === b[1]) break;
    for (const d of [
      [1, 0],
      [-1, 0],
      [0, 1],
      [0, -1],
    ]) {
      const n = [c[0] + d[0], c[1] + d[1]];
      if (
        n[0] < 0 ||
        n[1] < 0 ||
        !inGrid(n) ||
        s.has(key(n)) ||
        prev.has(key(n)) ||
        (TCn() && ((c[0] === SC - 1 && n[0] === SC) || (c[0] === SC && n[0] === SC - 1)) && c[1] !== SI - 2)
      )
        continue;
      prev.set(key(n), c);
      q.push(n);
    }
  }
  if (!prev.has(key(b))) return null;
  const r = [];
  for (let c = b; c; c = prev.get(key(c))) r.push([cc(c[0]), cc(c[1])]);
  return r.reverse();
}
