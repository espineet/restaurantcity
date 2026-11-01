/* misiones.js — Misiones diarias/semanales y logros. */

/* ===== Misiones y logros ===== */
const msCap = (v, a, b) => Math.max(a, Math.min(b, Math.round(v)));
const QD = [
  ["dish", "Sirve {n} platos", (L) => msCap(8 + L, 8, 40)],
  ["des", "Sirve {n} postres", (L) => msCap(6 + 0.8 * L, 6, 30)],
  ["hp", "Consigue {n} clientes contentos", (L) => msCap(2 + L / 4, 2, 10)],
  ["clean", "Termina {n} servicio sin clientes enfadados", (L) => 1],
  ["inc", "Gana {n} 🪙", (L) => msCap(150 + 20 * L, 150, 1500)],
  ["drk", "Sirve {n} bebidas", (L) => msCap(4 + L / 2, 4, 20), () => S.bars.length > 0],
  ["dealb", "Compra {n} ingredientes en oferta", (L) => 6],
  ["srv", "Atiende a {n} clientes", (L) => msCap(10 + 1.5 * L, 10, 60)],
  ["svc", "Abre {n} servicios", (L) => 2],
  ["nolost", "Termina {n} servicio sin perder a ningún cliente", (L) => 1],
  ["var", "Haz {n} servicio sirviendo 3 platos distintos", (L) => 1],
  ["catb", "Compra {n} objeto del catálogo", (L) => 1],
  ["tk", "Entrega {n} pedidos para llevar", (L) => msCap(3 + L / 5, 3, 10), () => !!S.tk],
  ["buyn", "Compra {n} ingredientes", (L) => msCap(10 + L, 10, 50)],
];
const QW = [
  ["srv", "Atiende a {n} clientes", (L) => msCap(60 + 8 * L, 60, 400)],
  ["hp", "Consigue {n} clientes contentos", (L) => msCap(15 + 2 * L, 15, 120)],
  ["inc", "Gana {n} 🪙", (L) => msCap(800 + 120 * L, 800, 8000)],
  ["clean", "Termina {n} servicios sin clientes enfadados", (L) => 3],
  ["rest", "Usa {n} días de descanso", (L) => 2],
  ["dish", "Sirve {n} platos", (L) => msCap(40 + 5 * L, 40, 300)],
  ["des", "Sirve {n} postres", (L) => msCap(25 + 3 * L, 25, 200)],
  ["dealb", "Compra {n} ingredientes en oferta", (L) => 25],
  ["bills", "Paga {n} facturas", (L) => 6],
  ["nolost", "Termina {n} servicios sin perder a ningún cliente", (L) => 4],
  ["var", "Haz {n} servicios sirviendo 3 platos distintos", (L) => 5],
  ["catb", "Compra {n} objetos del catálogo", (L) => 3],
  ["tk", "Entrega {n} pedidos para llevar", (L) => msCap(15 + L, 15, 80), () => !!S.tk],
  ["evt", "Vive {n} eventos aleatorios", (L) => 4],
  ["buyn", "Compra {n} ingredientes", (L) => msCap(60 + 5 * L, 60, 300)],
  ["svc", "Abre {n} servicios", (L) => 10],
];
const OBJD = [
    ["c", [0, 1, 2, 3, 4, 5, 6, 7, 8]],
    ["p", [0, 1, 2, 3, 4]],
    ["s", [0, 1, 2, 3, 4, 5]],
    ["t", [0, 1, 2, 3, 4, 5]],
  ],
  OBJW = [
    ["d", [0, 3, 4, 7, 8, 9, 10, 11]],
    ["p", [5, 6, 7, 8, 9, 10, 11]],
    ["t", [6, 7, 8, 9]],
    ["b", [1, 2, 3, 5]],
  ];
function msObj(W) {
  const L = W ? OBJW : OBJD;
  for (let g = 0; g < 20; g++) {
    const o = rnd(L),
      k = o[0],
      x = rnd(o[1]);
    if (!isLocked(k, x)) return [k, x];
  }
  return ["p", 0];
}
function msGen(Q, n, objN, coinF, W) {
  const L = lvl(),
    pool = Q.filter((q) => !q[3] || q[3]()),
    pick = [];
  const pp = pool.slice();
  while (pick.length < n && pp.length) pick.push(pp.splice((Math.random() * pp.length) | 0, 1)[0]);
  const oi = new Set();
  while (oi.size < objN && oi.size < pick.length) oi.add((Math.random() * pick.length) | 0);
  return pick.map((q, i) => {
    const t = q[2](L);
    return {
      key: q[0],
      n: t,
      text: q[1].replace("{n}", t),
      r: oi.has(i) ? { o: msObj(!!W) } : { c: coinF(L) },
      cl: 0,
    };
  });
}
function msEnsure() {
  if (!S.ms) {
    S.ms = { tot: {}, streak: 0, best: 0, maxBuzz: 0 };
    if (S.day > 1) {
      const sv = (S.day - 1) * 2 + (S.svc | 0),
        n = sv * 5;
      S.ms.tot = { srv: n, hp: Math.floor(n * 0.2), dish: n, des: n, svc: sv };
    }
  }
  if (!S.ach) S.ach = [];
  const wk = mon(S.day);
  if (!S.pc || S.pc.d !== S.day || !S.dq) {
    S.pc = { d: S.day, c: {} };
    S.dq = msGen(QD, 5, 2, (L) => msCap(40 + 3 * L, 40, 250));
  }
  if (!S.pw || S.pw.w !== wk || !S.wq) {
    S.pw = { w: wk, c: {} };
    S.wq = msGen(QW, 5, 2, (L) => msCap(200 + 8 * L, 200, 900), 1);
  }
  if (S.wq.length < 5) {
    const have = new Set(S.wq.map((q) => q.key));
    S.wq.push(
      ...msGen(
        QW.filter((q) => !have.has(q[0])),
        5 - S.wq.length,
        0,
        (L) => msCap(200 + 8 * L, 200, 900),
        1,
      ),
    );
  }
}
function msBump(k, n) {
  msEnsure();
  n = n == null ? 1 : n;
  if (!n) return;
  S.ms.tot[k] = (S.ms.tot[k] | 0) + n;
  S.pc.c[k] = (S.pc.c[k] | 0) + n;
  S.pw.c[k] = (S.pw.c[k] | 0) + n;
  msCheck();
}
function msService(served, hp, nor, ang, lostN, sold, dr, income, ev) {
  msEnsure();
  const T = S.ms.tot;
  let dish = 0,
    des = 0;
  for (const id in sold) {
    const r = rec(id);
    if (!r) continue;
    if (r.d) des += sold[id];
    else dish += sold[id];
  }
  const clean = served > 0 && ang === 0 && lostN === 0 ? 1 : 0;
  S.ms.streak = clean ? (S.ms.streak | 0) + 1 : 0;
  S.ms.best = Math.max(S.ms.best | 0, S.ms.streak);
  const add = (k, n) => {
    if (!n) return;
    T[k] = (T[k] | 0) + n;
    S.pc.c[k] = (S.pc.c[k] | 0) + n;
    S.pw.c[k] = (S.pw.c[k] | 0) + n;
  };
  add("srv", served);
  add("hp", hp);
  add("ang", ang);
  add("dish", dish);
  add("des", des);
  add("drk", dr);
  add("inc", income);
  add("clean", clean);
  add("svc", 1);
  if (ev === "averia") add("evav", 1);
  if (served > 0 && lostN === 0) add("nolost", 1);
  if (
    Object.keys(sold).filter((id) => {
      const r = rec(id);
      return r && !r.d;
    }).length >= 3
  )
    add("var", 1);
  if (ev && ev !== "plaga") add("evt", 1);
  S.ms.maxBuzz = Math.max(S.ms.maxBuzz | 0, S.buzz | 0);
  msCheck();
}
const ACH = [
  ["first", "🍽️", "Primer servicio", "Atiende a tu primer cliente", () => [S.ms.tot.srv | 0, 1], 50, []],
  ["c100", "👥", "100 clientes", "Atiende a 100 clientes", () => [S.ms.tot.srv | 0, 100], 100, [["d", 6]]],
  ["c500", "👥", "500 clientes", "Atiende a 500 clientes", () => [S.ms.tot.srv | 0, 500], 200, [["d", 13]]],
  [
    "c1000",
    "👥",
    "1000 clientes",
    "Atiende a 1000 clientes",
    () => [S.ms.tot.srv | 0, 1000],
    300,
    [["t", 25]],
  ],
  [
    "c3000",
    "👥",
    "3000 clientes",
    "Atiende a 3000 clientes",
    () => [S.ms.tot.srv | 0, 3000],
    500,
    [["t", 26]],
  ],
  [
    "hp100",
    "😊",
    "Cliente feliz",
    "Consigue 100 clientes contentos",
    () => [S.ms.tot.hp | 0, 100],
    150,
    [["d", 3]],
  ],
  [
    "cl3",
    "✨",
    "Servicio impecable",
    "3 servicios seguidos sin clientes enfadados",
    () => [S.ms.best | 0, 3],
    100,
    [["d", 14]],
  ],
  [
    "cl10",
    "🌟",
    "Racha de oro",
    "10 servicios seguidos sin clientes enfadados",
    () => [S.ms.best | 0, 10],
    300,
    [["t", 27]],
  ],
  ["fama", "📣", "Boca a boca", "Llega a fama 12", () => [S.ms.maxBuzz | 0, 12], 200, [["b", 5]]],
  ["lv10", "⭐", "Nivel 10", "Alcanza el nivel 10", () => [lvl(), 10], 100, [["p", 6]]],
  ["lv25", "⭐", "Nivel 25", "Alcanza el nivel 25", () => [lvl(), 25], 250, [["t", 9]]],
  ["lv50", "🏅", "Nivel 50", "Alcanza el nivel 50", () => [lvl(), 50], 500, [["p", 7]]],
  ["lv100", "🏆", "Nivel 100", "Alcanza el nivel 100", () => [lvl(), 100], 1000, [["d", 2]]],
  ["w3", "🤵", "Equipo de sala", "Ten 3 camareros", () => [S.waiters, 3], 100, [["c", 17]]],
  ["w6", "🤵", "Gran sala", "Ten 6 camareros", () => [S.waiters, 6], 200, [["c", 18]]],
  ["k4", "👨‍🍳", "Gran cocina", "Ten 4 cocineros", () => [S.chef, 4], 150, [["d", 1]]],
  ["dish500", "🍲", "Mil platos… casi", "Sirve 500 platos", () => [S.ms.tot.dish | 0, 500], 200, [["d", 4]]],
  ["des200", "🍰", "Pastelero", "Sirve 200 postres", () => [S.ms.tot.des | 0, 200], 200, [["d", 7]]],
  ["inc5k", "🪙", "Primeras 5000", "Gana 5000 🪙 en total", () => [S.ms.tot.inc | 0, 5000], 200, [["d", 0]]],
  [
    "inc25k",
    "💰",
    "Gran negocio",
    "Gana 25000 🪙 en total",
    () => [S.ms.tot.inc | 0, 25000],
    500,
    [["b", 1]],
  ],
  ["bills10", "🧾", "Al día", "Paga 10 facturas", () => [S.ms.tot.bills | 0, 10], 150, [["d", 9]]],
  [
    "evav",
    "⚡",
    "Apagón superado",
    "Sobrevive a una avería eléctrica",
    () => [S.ms.tot.evav | 0, 1],
    100,
    [["d", 11]],
  ],
  [
    "evpl",
    "🪳",
    "Plaga controlada",
    "Sobrevive a una plaga de cucarachas",
    () => [S.ms.tot.evpl | 0, 1],
    100,
    [["d", 10]],
  ],
  ["day100", "📅", "100 días", "Llega al día 100", () => [S.day, 100], 200, [["c", 19]]],
  ["day365", "🎂", "Un año entero", "Llega al día 365", () => [S.day, 365], 600, [["b", 2]]],
  [
    "rest10",
    "😴",
    "Merecido descanso",
    "Usa 10 días de descanso",
    () => [S.ms.tot.rest | 0, 10],
    100,
    [["p", 9]],
  ],
  [
    "deal100",
    "🏷️",
    "Cazaofertas",
    "Compra 100 ingredientes en oferta",
    () => [S.ms.tot.dealb | 0, 100],
    150,
    [["p", 5]],
  ],
  ["q50", "📜", "Trabajador", "Completa 50 misiones", () => [S.ms.tot.qdone | 0, 50], 300, [["p", 10]]],
];
const ACHU = {};
ACH.forEach((a) =>
  a[6].forEach(([k, x]) => {
    ACHU[k + x] = a[0];
  }),
);
const isLocked = (k, x) => {
    const id = ACHU[k + x];
    return !!id && !(S.ach || []).includes(id);
  },
  lockName = (k, x) => {
    const a = ACH.find((a) => a[0] === ACHU[k + x]);
    return a ? a[2] + ": " + a[3] : "";
  };
function lockPass() {
  document.querySelectorAll('#view button[onclick^="buyItem("]').forEach((b) => {
    const m = /buyItem\('(\w)',(\d+)\)/.exec(b.getAttribute("onclick") || "");
    if (!m) return;
    const k = m[1],
      x = +m[2];
    if (isLocked(k, x)) {
      b.disabled = true;
      b.textContent = "🔒 Logro";
      b.title = lockName(k, x);
      const t = b.parentElement && b.parentElement.querySelector(".mut");
      if (t) t.innerHTML = "🔒 " + lockName(k, x);
    }
  });
}
function msCheck() {
  if (!S.ms || !S.ach) return;
  let any = false;
  for (const a of ACH) {
    if (S.ach.includes(a[0])) continue;
    let r;
    try {
      r = a[4]();
    } catch (e) {
      continue;
    }
    if (r[0] >= r[1]) {
      S.ach.push(a[0]);
      S.coins += a[5];
      any = true;
      toast(
        "🏆 Logro: " +
          a[2] +
          " · +" +
          a[5] +
          " 🪙" +
          (a[6].length ? " · desbloqueas " + a[6].map(([k, x]) => label(k, x)).join(", ") : ""),
      );
      AUsfx("lvl");
    }
  }
  if (any) {
    save();
    if (tab === "deco") draw();
  }
}
let msLast = 0;
function msTick() {
  msEnsure();
  const t = Date.now();
  if (t - msLast > 1500) {
    msLast = t;
    msCheck();
  }
  msBadge();
}
function msClaimable() {
  msEnsure();
  return [...S.dq, ...S.wq].filter((q, i) => {
    const c = (S.dq.includes(q) ? S.pc : S.pw).c[q.key] | 0;
    return !q.cl && c >= q.n;
  }).length;
}
function msBadge() {
  const b = document.getElementById("msb");
  if (!b) return;
  const n = msClaimable();
  b.innerHTML = "📜" + (n ? `<span class="globo">${n}</span>` : "");
}
let msTab = "d";
function msClaim(sc, i) {
  msEnsure();
  const Q = sc === "d" ? S.dq : S.wq,
    q = Q[i],
    c = (sc === "d" ? S.pc : S.pw).c[q.key] | 0;
  if (!q || q.cl || c < q.n) return;
  q.cl = 1;
  if (q.r.c) S.coins += q.r.c;
  if (q.r.o) {
    const [k, x] = q.r.o;
    if (!Array.isArray(S.inv[k])) S.inv[k] = [];
    S.inv[k].push(x);
  }
  S.ms.tot.qdone = (S.ms.tot.qdone | 0) + 1;
  save();
  AUsfx("ok");
  drawTop();
  msCheck();
  showMs();
  if (tab === "deco" || tab === "rest") draw();
}
const msRew = (r) => (r.c ? `🪙 ${r.c}` : `🎁 ${label(r.o[0], r.o[1])}`);
function showMs() {
  msEnsure();
  let o = document.getElementById("ms");
  if (!o) {
    o = document.createElement("div");
    o.id = "ms";
    o.className = "ov";
    o.onclick = (e) => {
      if (e.target === o) o.style.display = "none";
    };
    document.body.appendChild(o);
  }
  const tabs = [
      ["d", "Diarias"],
      ["w", "Semanales"],
      ["a", "Logros"],
    ],
    bar = (c, n) =>
      `<div style="height:7px;background:var(--bd);border-radius:5px;overflow:hidden;margin:4px 0"><div style="height:100%;width:${Math.min(100, (c * 100) / n)}%;background:var(--ac)"></div></div>`;
  const qrow = (sc, q, i) => {
    const c = Math.min(q.n, (sc === "d" ? S.pc : S.pw).c[q.key] | 0),
      done = c >= q.n;
    return `<div class="card" style="margin:6px 0;${q.cl ? "opacity:.6" : ""}"><div class="row"><b style="flex:1">${q.text}</b>${q.cl ? "✅" : done ? `<button class="s" onclick="msClaim('${sc}',${i})">Reclamar</button>` : ""}</div>${bar(c, q.n)}<div class="row"><span class="mut sm">${c}/${q.n}</span><span class="mut sm">Recompensa: ${msRew(q.r)}</span></div></div>`;
  };
  let body = "";
  if (msTab === "d")
    body =
      `<p class="mut" style="margin:4px 0">Se renuevan cada día (la comida y la cena cuentan para el mismo día).</p>` +
      S.dq.map((q, i) => qrow("d", q, i)).join("");
  else if (msTab === "w")
    body =
      `<p class="mut" style="margin:4px 0">Se renuevan cada lunes.</p>` +
      S.wq.map((q, i) => qrow("w", q, i)).join("");
  else
    body =
      `<p class="mut" style="margin:4px 0">${S.ach.length}/${ACH.length} logros. Los logros desbloquean objetos del Catálogo y dan monedas al instante.</p>` +
      ACH.map((a) => {
        const ok = S.ach.includes(a[0]);
        let r = [0, 1];
        try {
          r = a[4]();
        } catch (e) {}
        const c = Math.min(r[0], r[1]);
        return `<div class="card" style="margin:6px 0;${ok ? "" : "opacity:.85"}"><div class="row"><b style="flex:1">${a[1]} ${a[2]}</b>${ok ? "✅" : "🔒"}</div><div class="mut sm">${a[3]}</div>${ok ? "" : bar(c, r[1]) + `<div class="mut sm">${c}/${r[1]}</div>`}<div class="mut sm">🪙 ${a[5]}${a[6].length ? " · 🔓 " + a[6].map(([k, x]) => label(k, x)).join(", ") : ""}</div></div>`;
      }).join("");
  o.innerHTML = `<div class="box hoja"><button class="x" onclick="cerrarVentana('ms')" aria-label="Cerrar">✕</button><h2 style="margin:0 0 8px">📜 Misiones y logros</h2><div class="row" style="gap:6px;margin-bottom:6px">${tabs.map(([k, n]) => `<button class="s" style="flex:1;${msTab === k ? "outline:2px solid var(--ac)" : "opacity:.6"}" onclick="msTab='${k}';showMs()">${n}</button>`).join("")}</div>${body}</div>`;
  o.style.display = "flex";
}
botonCabecera("msb", "📜", "Misiones y logros", () => showMs());
