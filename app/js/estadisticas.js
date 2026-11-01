/* estadisticas.js — Pedidos para llevar, historial y estadísticas. */

/* ===== Pedidos para llevar ===== */
const tkSp = () => SRn() * CS - KDn() >= 150;
const tkHtml = (KW, KD) => {
  const x = -KW + 24,
    y = KD + 24,
    w = KW - 48,
    d = 110;
  return (
    `<div style="position:absolute;left:${x}px;top:${y}px;width:${w}px;height:${d}px;background:repeating-conic-gradient(#d9d2c0 0 25%,#cbc3ad 0 50%) 0 0/36px 36px;box-shadow:0 0 0 3px #7a6a4a;transform:translateZ(.4px)"></div>` +
    bx(x + 10, y + 10, 90, 26, 30, "#8d6e63") +
    bx(x + 8, y + 8, 94, 30, 4, "#f5e6c8", 30) +
    bx(x + 8, y + 8, 4, 4, 70, "#5d4037") +
    bx(x + 98, y + 8, 4, 4, 70, "#5d4037") +
    bx(x + 6, y + 6, 98, 34, 5, "#c62828", 70) +
    bx(x + 24, y + 16, 10, 8, 9, "#fbc02d", 34) +
    bx(x + 56, y + 16, 10, 8, 9, "#fbc02d", 34)
  );
};
let TKO = null,
  CR = null;
function tkStaff() {
  if (!S.tk) {
    if (TKO) {
      TKO.forEach((e) => e.remove());
      TKO = null;
    }
    if (CR) {
      CR.el.remove();
      CR = null;
    }
    return;
  }
  const KW = KWn(),
    KD = KDn(),
    x = -KW + 24,
    y = KD + 24,
    w = KW - 48;
  if (!TKO) {
    TKO = [mk("🪧", 34), mk("🛵", 36)];
  }
  put({ el: TKO[0], x: x + w - 14, y: y + 24 });
  put({ el: TKO[1], x: x + w - 22, y: y + 96 });
  if (!CR) {
    CR = {
      el: mkp(person({ waiter: 1, look: cLook(S.waiters + 3), uni: uniOf("w") }), "tk"),
      x: x + 45,
      y: y + 65,
      v: 68,
      path: [],
      then: null,
      wait: 0,
      n: 0,
    };
    put(CR);
  }
  CR.hx = x + 45;
  CR.hy = y + 65;
  if (!CR.placed) {
    CR.placed = 1;
    CR.x = CR.hx;
    CR.y = CR.hy;
    put(CR);
  }
}
function tkTrip() {
  const c = CR,
    KD = KDn(),
    D = SRn() * CS;
  go(
    c,
    [
      [CL, KD + 40],
      [-30, KD - 10],
    ],
    () => {
      c.wait = 1.2;
      c.then = () => {
        face(c, "🛍️");
        go(
          c,
          [
            [CL, KD + 40],
            [c.hx + 20, D + 14],
          ],
          () => {
            c.wait = 1.5;
            c.then = () => {
              unface(c);
              go(c, [[c.hx, c.hy]], null);
            };
          },
        );
      };
    },
  );
}
function tkLoop(dt) {
  if (!CR) return;
  tick(CR, dt);
  if (!CR.path.length && !(CR.wait > 0) && !CR.then) {
    if (S.shift && S.last && S.last.tk && (CR.n | 0) < Math.min(8, S.last.tk.n))
      (CR.n = (CR.n | 0) + 1), tkTrip();
    else {
      if (!S.shift) CR.n = 0;
      if (Math.hypot(CR.x - CR.hx, CR.y - CR.hy) > 3) go(CR, [[CR.hx, CR.hy]], null);
    }
  }
  put(CR);
}
function tkCard() {
  const ok = lvl() >= 20,
    sp = tkSp();
  if (S.tk)
    return `<div class="card"><div class="row"><div><b>🛵 Pedidos para llevar</b><div class="mut">Tu repartidor lleva comida a domicilio desde la cocina: hasta ${3 + Math.floor(lvl() / 5)} pedidos por servicio (sube con tu nivel), cerca del 30% de los clientes de sala (más con fama y con lluvia) y +10% de precio. Sueldo del repartidor: 70 🪙 a la semana.</div></div><span class="ok">Activo</span></div></div>`;
  return `<div class="card"><div class="row"><div><b>🛵 Pedidos para llevar</b><div class="mut">${ok ? (sp ? "Habilita el solar entre la cocina y la carretera: un mostrador y un repartidor que lleva comida a quien se la lleva a casa, sin ocupar mesas." : "🔒 Falta espacio entre la cocina y la carretera: amplía antes el salón.") : "🔒 Se desbloquea en el nivel 20."}</div></div><button class="s" onclick="tkBuild()" ${ok && sp && S.coins >= TKC ? "" : "disabled"}>${TKC} 🪙</button></div></div>`;
}
function tkBuild() {
  if (S.tk || lvl() < 20 || !tkSp() || S.coins < TKC) return;
  S.coins -= TKC;
  S.tk = 1;
  save();
  AUsfx("ok");
  draw();
  toast("🛵 ¡Pedidos para llevar desbloqueados!");
}
/* ===== Estadísticas ===== */
function cwAdd() {
  const L = S.last;
  if (!L) return;
  const c = (S.cw = S.cw || {}),
    a = (k, v) => {
      c[k] = (c[k] | 0) + (v | 0);
    };
  a("cli", L.served);
  a("lost", (L.lost | 0) + (L.out | 0));
  a("hp", L.hp);
  a("ang", L.ang);
  a("tk", L.tk ? L.tk.n : 0);
  a("svc", (L.arrive | 0) > 0 ? 1 : 0);
  a("dr", L.dr);
  a("arr", L.arrive);
  S.dtot = S.dtot || {};
  for (const k in L.sold || {}) S.dtot[k] = (S.dtot[k] | 0) + L.sold[k];
  S.btot = S.btot || {};
  for (const k in L.dsold || {}) S.btot[k] = (S.btot[k] | 0) + L.dsold[k];
}
function histPush(inc, exp) {
  S.hist = S.hist || [];
  const c = S.cw || {};
  S.hist.push({
    w: mon(S.last ? S.last.day : S.day),
    inc: inc | 0,
    exp: exp | 0,
    cli: c.cli | 0,
    lost: c.lost | 0,
    hp: c.hp | 0,
    ang: c.ang | 0,
    tk: c.tk | 0,
    svc: c.svc | 0,
    dr: c.dr | 0,
    arr: c.arr | 0,
    buzz: S.buzz | 0,
    coins: S.coins | 0,
    lv: lvl(),
  });
  if (S.hist.length > 26) S.hist.shift();
  S.cw = {};
}
let stTab = "w";
function showStats() {
  let o = document.getElementById("stv");
  if (!o) {
    o = document.createElement("div");
    o.id = "stv";
    o.className = "ov";
    o.onclick = (e) => {
      if (e.target === o) o.style.display = "none";
    };
    document.body.appendChild(o);
  }
  msEnsure();
  const H = S.hist || [],
    c = S.cw || {},
    T = S.ms.tot,
    n = (v) => Number(Math.round(v)).toLocaleString("es-ES"),
    pc = (a, b) => (b > 0 ? Math.round(((a - b) * 100) / b) : null),
    f = (v) => (v == null ? "—" : (v >= 0 ? "📈 +" : "📉 ") + v + "%");
  const kv = (a, b) =>
    `<div class="row" style="justify-content:space-between;padding:3px 0;border-bottom:1px solid var(--bd)"><span>${a}</span><b>${b}</b></div>`;
  const tabs = [
    ["w", "Semanas"],
    ["t", "Totales"],
    ["p", "Platos"],
  ];
  let body = "";
  if (stTab === "w") {
    let trend = "";
    if (H.length >= 2) {
      const a = H[H.length - 1],
        b = H[H.length - 2];
      trend = `<div class="card" style="margin:6px 0"><b>Última semana frente a la anterior</b><div class="mut">Ingresos: ${f(pc(a.inc, b.inc))} · Clientes: ${f(pc(a.cli, b.cli))} · Beneficio: ${f(pc(a.inc - a.exp, b.inc - b.exp))}</div><div class="mut">Contentos: ${f(pc(a.hp, b.hp))} · Enfadados: ${f(pc(a.ang, b.ang))} · Perdidos: ${f(pc(a.lost, b.lost))}</div></div>`;
    } else
      trend = `<p class="mut">Aún no hay semanas completas. La primera aparece al cerrar el domingo (cuando llegan las facturas).</p>`;
    const L = H.slice(-10);
    let ch1 = "",
      ch2 = "";
    if (L.length) {
      const W = 340,
        Hh = 130,
        gap = W / L.length,
        bw = Math.min(14, gap / 2.6),
        mx = Math.max(1, ...L.map((h) => Math.max(h.inc, h.exp)));
      ch1 =
        `<b>💰 Ingresos y gastos</b><svg viewBox="0 0 ${W} ${Hh + 22}" style="width:100%;height:auto;display:block">` +
        L.map((h, i) => {
          const x = i * gap + gap / 2,
            hi = (h.inc / mx) * Hh,
            he = (h.exp / mx) * Hh;
          return `<rect x="${x - bw - 1}" y="${Hh - hi}" width="${bw}" height="${Math.max(1, hi)}" rx="2" fill="#2f9e44"/><rect x="${x + 1}" y="${Hh - he}" width="${bw}" height="${Math.max(1, he)}" rx="2" fill="#e03131"/><text x="${x}" y="${Hh + 14}" font-size="10" text-anchor="middle" fill="currentColor" opacity=".7">S${h.w}</text>`;
        }).join("") +
        `</svg><div class="mut sm" style="text-align:center">🟩 Ingresos · 🟥 Gastos</div>`;
      const mc = Math.max(1, ...L.map((h) => h.cli + h.lost)),
        bw2 = Math.min(26, gap * 0.6);
      ch2 =
        `<b style="display:block;margin-top:10px">👥 Clientes por semana</b><svg viewBox="0 0 ${W} ${Hh + 22}" style="width:100%;height:auto;display:block">` +
        L.map((h, i) => {
          const x = i * gap + gap / 2,
            u = Hh / mc,
            nor = Math.max(0, h.cli - h.hp - h.ang);
          let y = Hh;
          const seg = (v, col) => {
            const hh = v * u;
            y -= hh;
            return hh > 0
              ? `<rect x="${x - bw2 / 2}" y="${y}" width="${bw2}" height="${hh}" fill="${col}"/>`
              : "";
          };
          return (
            seg(h.hp, "#2f9e44") +
            seg(nor, "#adb5bd") +
            seg(h.ang, "#e03131") +
            seg(h.lost, "#495057") +
            `<text x="${x}" y="${Hh + 14}" font-size="10" text-anchor="middle" fill="currentColor" opacity=".7">S${h.w}</text>`
          );
        }).join("") +
        `</svg><div class="mut sm" style="text-align:center">🟩 Contentos · ⬜ Normales · 🟥 Enfadados · ⬛ Perdidos</div>`;
    }
    const rows = H.slice()
      .reverse()
      .map(
        (h) =>
          `<tr><td>S${h.w}</td><td>${n(h.inc)}</td><td>${n(h.exp)}</td><td style="color:${h.inc - h.exp >= 0 ? "#2f9e44" : "#e03131"};font-weight:700">${h.inc - h.exp >= 0 ? "+" : ""}${n(h.inc - h.exp)}</td><td>${n(h.cli)}</td><td>${h.hp}</td><td>${h.ang}</td><td>${h.lost}</td><td>${h.tk || 0}</td><td>${h.buzz == null ? "—" : h.buzz}</td></tr>`,
      )
      .join("");
    body = `<div class="card" style="margin:6px 0"><b>Semana en curso</b><div class="mut">Ingresos hasta ahora: ${n(S.wk | 0)} 🪙 · Clientes: ${n(c.cli | 0)} · 😊 ${c.hp | 0} · 😡 ${c.ang | 0} · Perdidos: ${c.lost | 0}${S.tk ? " · 🛵 " + (c.tk | 0) : ""}</div></div>${trend}${ch1}${ch2}${H.length ? `<div style="overflow-x:auto"><table style="width:100%;border-collapse:collapse;font-size:12px;margin-top:10px;white-space:nowrap"><thead><tr style="text-align:left"><th>Sem.</th><th>Ingr.</th><th>Gastos</th><th>Benef.</th><th>Cli.</th><th>😊</th><th>😡</th><th>Perd.</th><th>🛵</th><th>Fama</th></tr></thead><tbody>${rows}</tbody></table></div>` : ""}`;
  } else if (stTab === "t") {
    const sv = T.svc | 0,
      srv = T.srv | 0,
      tt = H.length,
      inc = H.reduce((a, h) => a + h.inc, 0),
      exp = H.reduce((a, h) => a + h.exp, 0),
      best = H.reduce((m, h) => (!m || h.inc > m.inc ? h : m), null),
      worst = H.reduce((m, h) => (!m || h.inc - h.exp < m.inc - m.exp ? h : m), null),
      bb = H.reduce((m, h) => (!m || h.inc - h.exp > m.inc - m.exp ? h : m), null);
    body = `<div class="card" style="margin:6px 0"><b>📅 Partida</b>${kv("Día actual", S.day)}${kv("Nivel", lvl())}${kv("Servicios abiertos", n(sv))}${kv("Logros", S.ach.length + "/" + ACH.length)}${kv("Misiones completadas", n(T.qdone | 0))}${kv("Facturas pagadas", n(T.bills | 0))}</div>
  <div class="card" style="margin:6px 0"><b>👥 Clientes</b>${kv("Atendidos", n(srv))}${kv("Contentos", n(T.hp | 0) + (srv ? " (" + Math.round(((T.hp | 0) * 100) / srv) + "%)" : ""))}${kv("Enfadados", n(T.ang | 0) + (srv ? " (" + Math.round(((T.ang | 0) * 100) / srv) + "%)" : ""))}${kv("Media por servicio", sv ? n(srv / sv) : "—")}${kv("Mejor racha sin enfadados", (S.ms.best | 0) + " servicios")}${kv("Fama máxima", S.ms.maxBuzz | 0)}</div>
  <div class="card" style="margin:6px 0"><b>🍽️ Producción</b>${kv("Platos servidos", n(T.dish | 0))}${kv("Postres servidos", n(T.des | 0))}${kv("Bebidas servidas", n(T.drk | 0))}${kv("Ingredientes en oferta comprados", n(T.dealb | 0))}${kv("Días de descanso usados", n(T.rest | 0))}</div>
  <div class="card" style="margin:6px 0"><b>💰 Dinero</b>${kv("Ingresos totales", n(T.inc | 0) + " 🪙")}${kv("Monedas ahora", n(S.coins) + " 🪙")}${tt ? kv("Media semanal de ingresos", n(inc / tt) + " 🪙") + kv("Media semanal de gastos", n(exp / tt) + " 🪙") + kv("Beneficio medio semanal", n((inc - exp) / tt) + " 🪙") + kv("Mejor semana (ingresos)", "S" + best.w + " · " + n(best.inc) + " 🪙") + kv("Mejor beneficio", "S" + bb.w + " · " + n(bb.inc - bb.exp) + " 🪙") + kv("Peor beneficio", "S" + worst.w + " · " + n(worst.inc - worst.exp) + " 🪙") : `<div class="mut">Las medias semanales aparecen tras la primera semana completa.</div>`}</div>`;
  } else {
    const top = (m, lab) => {
      const a = Object.entries(m || {})
          .filter(([k]) => lab(k))
          .sort((x, y) => y[1] - x[1])
          .slice(0, 10),
        mx = a.length ? a[0][1] : 1;
      return a.length
        ? a
            .map(
              ([k, v]) =>
                `<div style="margin:5px 0"><div class="row" style="justify-content:space-between"><span>${lab(k)}</span><b>${n(v)}</b></div><div style="height:6px;background:var(--bd);border-radius:4px;overflow:hidden"><div style="height:100%;width:${(v * 100) / mx}%;background:var(--ac)"></div></div></div>`,
            )
            .join("")
        : `<div class="mut">Aún no hay datos. Se llenan desde ahora, al terminar cada servicio.</div>`;
    };
    const nm = (k) => {
      const r = rec(k);
      return r ? (r.d ? "🍰 " : "🍲 ") + r.n : "";
    };
    body = `<div class="card" style="margin:6px 0"><b>🏅 Lo más vendido (platos y postres)</b>${top(S.dtot, nm)}</div><div class="card" style="margin:6px 0"><b>🥤 Bebidas más vendidas</b>${top(S.btot, (k) => NAME[k] || k)}</div>`;
  }
  o.innerHTML = `<div class="box hoja"><button class="x" onclick="cerrarVentana('stv')" aria-label="Cerrar">✕</button><h2 style="margin:0 0 8px">📊 Estadísticas</h2><div class="row" style="gap:6px;margin-bottom:6px">${tabs.map(([k, t]) => `<button class="s" style="flex:1;${stTab === k ? "outline:2px solid var(--ac)" : "opacity:.6"}" onclick="stTab='${k}';showStats()">${t}</button>`).join("")}</div>${body}</div>`;
  o.style.display = "flex";
}
botonCabecera("stb", "📊", "Estadísticas", () => showStats());
