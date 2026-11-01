/* tienda.js — Nivel, almacén, precios del día (ofertas), compra de ingredientes y menú. */

const lvl = () => 1 + Math.floor(S.xp / 100);
const slots = () => Math.min(20, 2 + Math.floor(lvl() / 5));
const dslots = () => Math.min(9, 2 + Math.floor(lvl() / 7));
const rec = (id) => REC.find((r) => r.id === id);
const st = (k) => S.stock[k] || 0;
let almOpen = false;
const stTot = () => Object.values(S.stock || {}).reduce((a, b) => a + (b | 0), 0),
  stCap = () =>
    (S.kobj || []).reduce((a, o) => a + (o[2] === 1 || o[2] === 11 ? 50 : o[2] === 12 ? 100 : 0), 0);
function dealInit() {
  if (S.deal && S.deal.d === S.day) return;
  const ks = Object.keys(ING).filter((k) => !agot(k)),
    pick = (n) => {
      const r = [];
      while (r.length < n && ks.length) {
        const k = ks.splice((Math.random() * ks.length) | 0, 1)[0];
        r.push(k);
      }
      return r;
    },
    o = {};
  pick(3 + (Math.random() < 0.5 ? 1 : 0)).forEach((k) => {
    o[k] = Math.random() < 0.5 ? 0.7 : 0.6;
  });
  if (Math.random() < 0.7)
    pick(1 + (Math.random() < 0.5 ? 1 : 0)).forEach((k) => {
      o[k] = 1.3;
    });
  S.deal = { d: S.day, o };
  save();
}
const dealM = (k) => {
    dealInit();
    return (S.deal.o || {})[k] || 1;
  },
  priceOf = (k) => Math.max(1, Math.round(ING[k][1] * dealM(k)));
function priceHtml(k) {
  const m = dealM(k),
    pr = priceOf(k);
  return m < 1
    ? `<span style="text-decoration:line-through;opacity:.6">${ING[k][1]}</span> <b class="ok">${pr} 🪙</b> <span style="font-size:11px;background:#2f9e44;color:#fff;border-radius:6px;padding:1px 5px">🏷️ Oferta −${Math.round((1 - m) * 100)}%</span>`
    : m > 1
      ? `<span style="text-decoration:line-through;opacity:.6">${ING[k][1]}</span> <b class="bad">${pr} 🪙</b> <span style="font-size:11px;background:#c0392b;color:#fff;border-radius:6px;padding:1px 5px">📈 Caro +${Math.round((m - 1) * 100)}%</span>`
      : ING[k][1] + " 🪙";
}
function dealBanner() {
  dealInit();
  const e = Object.entries(S.deal.o || {}),
    of = e.filter(([, m]) => m < 1),
    ca = e.filter(([, m]) => m > 1),
    f = (L) =>
      L.map(([k, m]) => NAME[k] + " " + (m < 1 ? "−" : "+") + Math.round(Math.abs(1 - m) * 100) + "%").join(
        ", ",
      );
  return `<div class="card"><b>📅 Precios de hoy</b><div class="mut" style="margin-top:4px">🏷️ Ofertas: ${f(of) || "ninguna"}</div>${ca.length ? `<div class="mut">📈 Caro: ${f(ca)}</div>` : ""}<div class="mut sm">Cambian cada día (la comida y la cena comparten precios).</div></div>`;
}
function buy(k, n) {
  const c = priceOf(k) * n;
  if (S.coins < c || agot(k) || stTot() + n > stCap()) return;
  msBump("buyn", n);
  if (dealM(k) < 1) msBump("dealb", n);
  S.coins -= c;
  S.stock[k] = st(k) + n;
  {
    const tg = S.day + ":" + (S.svc | 0);
    if (S.lbT !== tg) {
      S.lbT = tg;
      S.lb = [];
    }
    if (!S.lb.includes(k)) S.lb.push(k);
  }
  save();
  draw();
}
function unlock(id) {
  const r = rec(id);
  if (S.coins < r.u) return;
  S.coins -= r.u;
  S.unlocked.push(id);
  save();
  draw();
}
function toggleD(id) {
  const i = S.menuD.indexOf(id);
  if (i >= 0) S.menuD.splice(i, 1);
  else if (S.menuD.length < dslots()) S.menuD.push(id);
  save();
  draw();
}
function toggle(id) {
  const i = S.menu.indexOf(id);
  if (i >= 0) S.menu.splice(i, 1);
  else if (S.menu.length < slots()) S.menu.push(id);
  save();
  draw();
}
