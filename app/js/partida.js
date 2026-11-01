/* partida.js — Nombre del restaurante, reinicio, sueldos, facturas y Pase de plato. */

function resetGo() {
  document.getElementById("rs").style.display = "none";
  if (!guardadoBloqueado) copiaAntesDeCambio(); // por si fue sin querer: se puede restaurar en Ajustes
  guardadoBloqueado = false;
  S = fresh();
  try {
    [WS, CKS, BM, P, Q, DM].forEach((l) => {
      l.forEach((p) => {
        try {
          p && p.el && p.el.remove();
        } catch (e) {}
      });
      l.length = 0;
    });
    [orderQ, cookQ, readyQ, payQ].forEach((l) => {
      l.length = 0;
    });
    busy = 0;
    S.stock = {};
    tkStaff();
  } catch (e) {}
  initLayout();
  save();
  flush();
  draw();
  if (!S.name) askName();
}
function askName() {
  const o = document.getElementById("nm");
  document.getElementById("nmi").value = S.name || "";
  o.style.display = "flex";
}
function setName() {
  const v = document.getElementById("nmi").value.trim().slice(0, 24);
  if (!v) return;
  S.name = v;
  save();
  document.getElementById("nm").style.display = "none";
  drawTop();
  if (stage.isConnected) build();
  setTimeout(tutMaybe, 300);
}
const fogN = () => S.fb + S.kit;
const DAYN = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"],
  dname = (d) => DAYN[(((d - 1) % 7) + 7) % 7];
const wage = (k, i) => {
  const a = stOf(k, i),
    q = a.reduce((x, y) => x + y, 0) / (k === "w" ? 50 : 40);
  return Math.round(10 + 50 * q * q);
};
let TRD = { w: [], c: [] };
const wageF = (k, i, tr) => {
  const z = (k === "w" ? S.cwz : S.ccz) || [];
  return z[i] || tr ? (stOf(k, i)[0] <= 4 ? 0.25 : 0.5) : 1;
};
const wageNow = (k, i) => Math.round(wage(k, i) * wageF(k, i));
const wageTotal = () => {
  let t = 0;
  for (let i = 0; i < S.waiters; i++) t += wageNow("w", i);
  for (let i = 0; i < S.chef; i++) t += wageNow("c", i);
  return t;
};
function wageAccrue() {
  crewPad();
  ccrewPad();
  let t = 0;
  for (let i = 0; i < S.waiters; i++) t += wage("w", i) * wageF("w", i, TRD.w[i]);
  for (let i = 0; i < S.chef; i++) t += wage("c", i) * wageF("c", i, TRD.c[i]);
  TRD = { w: [], c: [] };
  S.wacc = (S.wacc || 0) + t / 14;
  S.wn = (S.wn | 0) + 1;
}
function mkBills() {
  const old = (S.bills || [])
    .filter((b) => !b.paid)
    .map((b) => ({ n: b.n, i: b.i, a: Math.ceil(b.a * 1.1), late: 1 }));
  const inc = S.wk | 0,
    t = S.tbl.length,
    st = S.waiters + S.chef;
  const nw = [
    ["Alquiler del local", "🏠", 80 + 15 * t],
    ["Sueldos del personal", "👥", (S.wn | 0) > 0 ? Math.round(((S.wacc || 0) * 14) / S.wn) : wageTotal()],
    [
      "Luz y gas",
      "💡",
      18 * (S.kobj || []).filter((o) => o[2] === 0).length +
        10 * (S.kobj || []).filter((o) => o[2] === 1 || o[2] === 11).length +
        15 * (S.kobj || []).filter((o) => o[2] === 12).length,
    ],
    ["Agua", "💧", 15 + 3 * t],
    ["Impuestos y licencia", "📑", Math.round(inc * 0.05) + 10],
    ["Seguro y limpieza", "🧹", 20 + 4 * lvl()],
    ...(S.tk ? [["Repartidor", "🛵", 70]] : []),
  ].map(([n, i, a]) => ({ n, i, a }));
  try {
    histPush(
      S.wk | 0,
      nw.reduce((a, b) => a + b.a, 0),
    );
  } catch (e) {}
  S.bills = [...old, ...nw];
  S.wk = 0;
  S.wacc = 0;
  S.wn = 0;
}
const billsDue = () => (S.bills || []).filter((b) => !b.paid);
function payBill(k) {
  const b = (S.bills || [])[k];
  if (!b || b.paid) return;
  if (S.coins < b.a) {
    toast("No tienes monedas suficientes");
    return;
  }
  S.coins -= b.a;
  b.paid = 1;
  msBump("bills", 1);
  if (!billsDue().length) S.bills = null;
  save();
  upd();
  showBills();
  if (tab === "rest") draw();
}
function payAll() {
  const t = billsDue().reduce((a, b) => a + b.a, 0);
  if (S.coins < t) {
    toast("No llega para todas: paga las que puedas");
    return;
  }
  S.coins -= t;
  msBump("bills", billsDue().length);
  S.bills = null;
  save();
  upd();
  showBills();
  if (tab === "rest") draw();
}
/* ===== Pase de plato ===== */
const PASS = [
  [5, "🪙 50 monedas", { coins: 50 }],
  [10, "🪑 Mesa individual azul y 2 sillas azules", { inv: { t: [4], c: [1, 1] } }],
  [15, "🧥 Perchero y 🪙 100 monedas", { inv: { d: [15] }, coins: 100 }],
  [20, "🧊 Nevera y 🪙 150 monedas", { k: [11], coins: 150 }],
  [25, "💡 Barra de neón", { inv: { b: [4] } }],
  [30, "🪑 Mesa grande para 6", { inv: { t: [25] } }],
  [35, "🪙 350 monedas", { coins: 350 }],
  [40, "🪑 Mesa grande para 8", { inv: { t: [26] } }],
  [45, '🍊 Naranjo, ❄️ arcón y 📺 Televisión 32"', { inv: { p: [12], u: [9] }, k: [12] }],
  [50, "🪙 500 monedas", { coins: 500 }],
  [55, "🪑 Mesa grande para 10", { inv: { t: [27] } }],
  [60, "🌿 Mejora de terraza", { ter: 1 }],
  [65, '📺 TV 50", ⛲ fuente y 🪙 200 monedas', { inv: { u: [10], d: [5] }, coins: 200 }],
  [70, "👔 Ropa de camarero de gala y 👨‍🍳 ropa de chef negro", { own: ["uw5", "uc2"] }],
  [75, "🤵 Camarero gratis al azar", { hire: "w" }],
  [80, "👨‍🍳 Cocinero gratis al azar", { hire: "c" }],
  [85, "🪙 850 monedas", { coins: 850 }],
  [90, "📖 Recetas de huevas de salmón y mousse de bayas", { rec: ["ikura", "mousse"] }],
  [95, "🏠 Mejora de salón y de cocina", { sal: 1, kit: 1 }],
  [100, "🪙 1000 monedas", { coins: 1000 }],
];
let ppMsg = "";
const ppClose = () => {
  const o = document.getElementById("pp");
  if (o) o.style.display = "none";
  ppMsg = "";
};
const passOk = (l) => (S.pass || []).includes(l),
  passAvail = () => PASS.filter((p) => lvl() >= p[0] && !passOk(p[0])).length;
function passClaim(l) {
  const p = PASS.find((x) => x[0] === l);
  if (!p || lvl() < l || passOk(l)) return;
  const r = p[2];
  ppMsg = "";
  if (r.k) {
    if (!Array.isArray(S.inv.k)) S.inv.k = [];
    S.inv.k.push(...r.k);
  }
  let hid = null;
  if (r.hire === "w") {
    crewPad();
    const used = new Set([...(S.crew || []), ...(S.retw || [])]),
      pool = CAND.map((_, i) => i).filter((i) => !used.has(i));
    if (S.waiters >= 10 || !pool.length) {
      ppMsg = "Ya tienes el máximo de camareros (10). Despide a alguien y vuelve a reclamar.";
      showPass();
      return;
    }
    hid = rnd(pool);
    S.waiters++;
    S.crew.push(hid);
    crewPad();
    if (S.cand) S.cand.ids = S.cand.ids.filter((x) => x !== hid);
  }
  if (r.hire === "c") {
    ccrewPad();
    ccaFix();
    const used = new Set([...(S.ccrew || []), ...(S.retc || [])]),
      pool = CAND2.map((_, i) => i).filter((i) => !used.has(i));
    if (maxed("chef") || !pool.length) {
      ppMsg =
        "No tienes sitio para otro cocinero: necesitas un fogón o una mesa de repostería libre. Vuelve a reclamar cuando lo tengas.";
      showPass();
      return;
    }
    hid = rnd(pool);
    S.chef++;
    S.ccrew.push(hid);
    ccrewPad();
    ccaFix();
    if (S.ccand) S.ccand.ids = S.ccand.ids.filter((x) => x !== hid);
  }
  if (r.coins) S.coins += r.coins;
  if (r.inv)
    for (const k in r.inv) {
      if (!Array.isArray(S.inv[k])) S.inv[k] = [];
      S.inv[k].push(...r.inv[k]);
    }
  if (r.own)
    r.own.forEach((o) => {
      if (!S.own.includes(o)) S.own.push(o);
    });
  if (r.rec)
    r.rec.forEach((id) => {
      if (!S.unlocked.includes(id)) S.unlocked.push(id);
    });
  if (r.ter) {
    if (!S.ter) S.ter = 1;
    else S.terL = Math.min(5, (S.terL | 0) + 1);
  }
  if (r.sal) S.sal = Math.min(10, S.sal + 1);
  if (r.kit) S.kit = Math.min(10, S.kit + 1);
  if (!S.pass) S.pass = [];
  S.pass.push(l);
  ppMsg =
    "🎁 ¡Recompensa del nivel " +
    l +
    " reclamada!" +
    (hid != null ? " Se une " + (r.hire === "w" ? CAND : CAND2)[hid][0] + "." : "") +
    (r.inv ? " Lo nuevo está en el Inventario." : "");
  save();
  drawTop();
  draw();
  showPass();
}
function showPass() {
  let o = document.getElementById("pp");
  if (!o) {
    o = document.createElement("div");
    o.id = "pp";
    o.className = "ov";
    document.body.appendChild(o);
  }
  const L = lvl(),
    nx = PASS.find((p) => !passOk(p[0]) && p[0] > L);
  o.onclick = (e) => {
    if (e.target === o) ppClose();
  };
  o.innerHTML = `<div class="box hoja"><button class="x" onclick="ppClose()" aria-label="Cerrar">✕</button><h2 style="text-align:center;margin:0 0 4px">🍽️ Pase de plato</h2><p class="mut" style="text-align:center;margin:0 0 8px">Cada 5 niveles, una recompensa. Eres nivel <b>${L}</b>${nx ? ` · próxima: nivel <b>${nx[0]}</b>` : ""}.</p>${ppMsg ? `<div class="card" style="margin:6px 0"><b>${ppMsg}</b></div>` : ""}${PASS.map(
    (p) => {
      const ok = passOk(p[0]),
        av = !ok && L >= p[0];
      return `<div class="row" style="margin:6px 0;padding:6px 8px;border-radius:10px;background:${ok ? "rgba(0,160,60,.12)" : av ? "rgba(255,170,0,.22)" : "rgba(0,0,0,.04)"};opacity:${ok || av ? 1 : 0.7};gap:8px;align-items:center"><span style="min-width:44px"><b>Nv ${p[0]}</b></span><span style="flex:1;font-size:13px">${p[1]}</span><span>${ok ? "✅" : av ? `<button class="s" onclick="passClaim(${p[0]})">Reclamar</button>` : "🔒"}</span></div>`;
    },
  ).join("")}<button class="big" style="margin-top:10px" onclick="ppClose()">Cerrar</button></div>`;
  o.style.display = "flex";
}

function showBills() {
  let o = document.getElementById("bl");
  if (!o) {
    o = document.createElement("div");
    o.id = "bl";
    o.className = "ov";
    document.body.appendChild(o);
  }
  const d = billsDue();
  if (!d.length) {
    o.style.display = "none";
    return;
  }
  const tot = d.reduce((a, b) => a + b.a, 0);
  o.innerHTML = `<div class="box"><h2>🧾 Facturas del domingo</h2><p class="mut">Ha terminado la semana: toca pagar. Las que no pagues se recargan un 10% el próximo domingo.</p>${(S.bills || []).map((b, k) => (b.paid ? "" : `<div class="row" style="margin:8px 0"><span>${b.i || "🧾"} ${b.n}${b.late ? ' <small class="bad">(atrasada +10%)</small>' : ""}</span><span><b>${b.a} 🪙</b> <button class="s" onclick="payBill(${k})">Pagar</button></span></div>`)).join("")}<div class="row" style="margin:12px 0"><b>Total</b><b class="bad">${tot} 🪙</b></div><button class="big" onclick="payAll()">Pagar todo</button><button class="s" style="margin-top:8px;width:100%" onclick="document.getElementById('bl').style.display='none'">Pagar más tarde</button></div>`;
  o.style.display = "flex";
}
const billsCard = () => {
  const d = billsDue();
  return d.length
    ? `<div class="card"><div class="row"><b>🧾 ${d.length} factura${d.length > 1 ? "s" : ""} pendiente${d.length > 1 ? "s" : ""}</b><b class="bad">${d.reduce((a, b) => a + b.a, 0)} 🪙</b></div><button class="big" style="margin-top:8px" onclick="showBills()">Ver y pagar facturas</button></div><div style="height:10px"></div>`
    : "";
};
