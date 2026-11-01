/* servicio.js — Simulación económica de un servicio (comida/cena): clientes, ingresos y humor. */

function closeDay() {
  if (S.shift || rcRem() < 1) return;
  const sv0 = S.svc | 0,
    w = mon(S.day);
  S.rest = { w, n: (S.rest && S.rest.w === w ? S.rest.n : 0) + 1 };
  crewPad();
  ccrewPad();
  (S.cwt || []).fill(0);
  (S.cct || []).fill(0);
  msBump("rest", 1);
  wageAccrue();
  S.last = {
    day: S.day,
    arrive: 0,
    served: 0,
    lost: 0,
    out: 0,
    income: 0,
    sold: {},
    hp: 0,
    buzz: S.buzz,
    dr: 0,
    ns: 0,
    nt: 0,
    nd: 0,
    svc: sv0,
    ev: [
      "😴 Día de descanso: el restaurante permanece cerrado este servicio y el personal descansa. No hay ingresos.",
    ],
  };
  S.evt = null;
  if (sv0 === 0) S.svc = 1;
  else {
    S.svc = 0;
    S.day++;
  }
  finishShift();
  save();
  draw();
}
const barIdx = () => {
  for (let i = 0; i < S.waiters; i++)
    if (S.cwb && S.cwb[i] && !(S.cwo && S.cwo[i]) && !(S.cwz && S.cwz[i])) return i;
  return -1;
};
const clampN = (v, a, b) => Math.max(a, Math.min(b, v));
function moodP(car, served, cap) {
  const rq = recQ(),
    dq = desQ(),
    pl = S.plt.length;
  let h = 0.04 + 0.025 * (rq - 4) + 0.015 * (dq - 4) + 0.01 * pl + 0.008 * (car - 4),
    a = 0.14 - 0.02 * (rq - 4) - 0.01 * (dq - 4) - 0.005 * pl - 0.006 * (car - 4);
  if (cap > 0 && served / cap > 0.85) {
    a += 0.07;
    h -= 0.03;
  }
  return { h: clampN(h, 0.02, 0.5), a: clampN(a, 0.01, 0.35) };
}
function angReasons(n, car, served, cap) {
  const rq = recQ(),
    dq = desQ(),
    w = {
      platos: Math.max(0, 0.02 * (4 - rq)),
      postres: Math.max(0, 0.01 * (4 - dq)),
      atencion: Math.max(0, 0.006 * (4 - car)),
      esperas: cap > 0 && served / cap > 0.85 ? 0.07 : 0,
      otros: 0.05,
    },
    tot = Object.values(w).reduce((a, b) => a + b, 0),
    r = { platos: 0, postres: 0, atencion: 0, esperas: 0, otros: 0 };
  for (let i = 0; i < n; i++) {
    let x = Math.random() * tot;
    for (const k in w) {
      if ((x -= w[k]) < 0) {
        r[k]++;
        break;
      }
    }
  }
  return r;
}
const ANGL = [
  ["ns", "🪑", "No había sitio"],
  ["nt", "⏱️", "Tardaron demasiado en atenderlos"],
  ["nd", "🍽️", "No había el plato que pedían"],
  ["ruido", "🎻", "Ruido del músico"],
  ["platos", "🍲", "Platos de poca calidad"],
  ["postres", "🍰", "Postres de poca calidad"],
  ["atencion", "😐", "Atención poco simpática"],
  ["esperas", "⌛", "Esperas largas con el equipo al límite"],
  ["otros", "🤷", "Sin motivo concreto (mal día)"],
];
function angBlock(a) {
  const R = Object.assign({ ns: a.ns | 0, nt: a.nt | 0, nd: a.nd | 0 }, a.angR || {}),
    tot = ANGL.reduce((t, [k]) => t + (R[k] | 0), 0);
  return (
    `<div class="row"><span>Enfadados</span><span class="bad">😡 ${tot}</span></div>` +
    ANGL.filter(([k]) => R[k] > 0)
      .map(
        ([k, i, l]) =>
          `<div class="row" style="margin-left:14px"><span class="mut">${i} ${l}</span><span class="bad">${R[k]}</span></div>`,
      )
      .join("")
  );
}
function soldRows(a) {
  const row = (t, items) =>
    items.length
      ? `<div style="display:flex;gap:10px;align-items:center;overflow-x:auto;white-space:nowrap;margin-top:6px"><span class="mut" style="min-width:58px">${t}</span>${items.join("")}</div>`
      : "";
  const E = Object.entries(a.sold || {}).filter(([id]) => rec(id)),
    m = ([id, n]) => `<span>${dico(rec(id), 28)} ×${n}</span>`;
  return (
    row("Platos", E.filter(([id]) => !rec(id).d).map(m)) +
    row("Postres", E.filter(([id]) => rec(id).d).map(m)) +
    row(
      "Bebidas",
      Object.entries(a.dsold || {}).map(
        ([k, n]) =>
          `<span>${(typeof IMG !== "undefined" && IMG[k]) || ING[k] ? ico(k, 28) : "🥤"} ×${n}</span>`,
      ),
    )
  );
}
function openDay() {
  if (S.shift) return;
  if (restSel) {
    restSel = 0;
    if (rcRem() > 0) {
      closeDay();
      return;
    }
  }
  const E = evRoll(),
    ev = E.id;
  let bz = 0,
    crit = 0,
    gift = "",
    musC = 0;
  const mus = ev === "musico" && E.dec === 1;
  if (ev === "proveedor") {
    const ks = (S.lb || []).filter((k) => ING[k]);
    if (ks.length) {
      const k = rnd(ks),
        want = 5 + ((Math.random() * 11) | 0),
        n = Math.max(0, Math.min(want, stCap() - stTot()));
      if (n > 0) {
        S.stock[k] = st(k) + n;
        gift = "🎁 Proveedor generoso: te regala " + n + " × " + NAME[k];
      } else
        gift = "🎁 Un proveedor quería regalarte " + NAME[k] + ", pero no tenías hueco en neveras ni arcones";
    }
  }
  if (ev === "fiesta" && E.dec === 1) {
    const fee = E.x | 0,
      sv0 = S.svc | 0;
    S.coins += fee;
    msBump("svc", 1);
    wageAccrue();
    S.last = {
      day: S.day,
      arrive: 0,
      served: 0,
      lost: 0,
      out: 0,
      income: fee,
      sold: {},
      hp: 0,
      buzz: S.buzz,
      dr: 0,
      ns: 0,
      nt: 0,
      nd: 0,
      svc: sv0,
      ev: [
        "📢 🎤 Fiesta privada",
        "🎤 Alquilaste el local para una fiesta privada: cobras " +
          fee +
          " 🪙. Este servicio no se abre al público.",
      ],
    };
    S.evt = null;
    if (sv0 === 0) S.svc = 1;
    else {
      S.svc = 0;
      S.day++;
    }
    finishShift();
    save();
    draw();
    return;
  }
  if (ev === "plaga") {
    const fee = Math.min(S.coins, 120 + 30 * lvl()),
      sv0 = S.svc | 0;
    S.coins -= fee;
    msBump("evpl", 1);
    msBump("svc", 1);
    wageAccrue();
    S.last = {
      day: S.day,
      arrive: 0,
      served: 0,
      lost: 0,
      out: 0,
      income: 0,
      sold: {},
      hp: 0,
      buzz: S.buzz,
      dr: 0,
      ns: 0,
      nt: 0,
      nd: 0,
      svc: sv0,
      ev: [
        "📢 🪳 Plaga de cucarachas",
        "🪳 Has pagado " +
          fee +
          " 🪙 a una empresa de desinsectación. El local permanece cerrado este servicio y no hay ingresos.",
      ],
    };
    S.evt = null;
    if (sv0 === 0) S.svc = 1;
    else {
      S.svc = 0;
      S.day++;
    }
    finishShift();
    save();
    draw();
    return;
  }
  const menu = S.menu.map(rec).filter(Boolean),
    menuD = (S.menuD || []).map(rec).filter(Boolean);
  if (!menu.length || !menuD.length) return;
  const retm = (S.svc | 0) === 0 ? ageTick() : [];
  ccaFix();
  const rst = restTick(),
    aCar = workAvg("w", 1),
    aCoc = workAvg("w", 3),
    aVen = workAvg("w", 4),
    aRep = desAvg(),
    vm = 1 + aVen * 0.015,
    dm = 1 + aRep * 0.03;
  let sickMsg = "";
  if (S.bj && ev !== "baja") {
    const v = S.bj,
      cr = v.k === "w" ? S.crew : S.ccrew,
      off = v.k === "w" ? S.cwo : S.cco,
      tn = v.k === "w" ? S.cwt : S.cct,
      i = cr.indexOf(v.cid);
    S.bj = null;
    if (i >= 0 && !off[i]) {
      let ok = 0;
      for (let j = 0; j < cr.length; j++)
        if (j !== i && !off[j] && (v.k === "w" || isPas(j) === isPas(i))) ok++;
      if (ok) {
        off[i] = 1;
        tn[i] = Math.max(0, (tn[i] | 0) - 1);
        sickMsg = "🏥 " + sickName({ k: v.k, cid: v.cid }) + " sigue de baja y no trabaja en este servicio";
      }
    }
  } else if (ev === "baja") S.bj = null;
  if (ev === "baja" && E.x) {
    const v = E.x,
      cr = v.k === "w" ? S.crew : S.ccrew,
      off = v.k === "w" ? S.cwo : S.cco,
      tn = v.k === "w" ? S.cwt : S.cct;
    if (cr[v.i] === v.cid && !off[v.i]) {
      let ok = 0;
      for (let j = 0; j < cr.length; j++)
        if (j !== v.i && !off[j] && (v.k === "w" || isPas(j) === isPas(v.i))) ok++;
      if (ok) {
        off[v.i] = 1;
        tn[v.i] = Math.max(0, (tn[v.i] | 0) - 1);
        if (E.n === 2) S.bj = { k: v.k, cid: v.cid };
        sickMsg =
          "🏥 " +
          sickName(v) +
          " está de baja y no trabaja en este servicio" +
          (E.n === 2 ? " ni en el siguiente" : "");
      }
    }
  }
  const fmM = [];
  [
    ["w", S.crew, S.cwo, S.cwt, S.cwf, S.cwd, CAND, "Camarero"],
    ["c", S.ccrew, S.cco, S.cct, S.ccf, S.ccd, CAND2, "Cocinero"],
  ].forEach(([k, cr, off, tn, ff, dl, L, role]) => {
    for (let i = 0; i < cr.length; i++) {
      const j = (ff[i] | 0) - 1;
      if (j < 0) continue;
      const c = cr[i] == null ? null : L[cr[i]],
        nm = c ? c[0] : role + " " + (i + 1);
      let ok = 0;
      for (let q = 0; q < cr.length; q++)
        if (q !== i && !off[q] && (k === "w" || isPas(q) === isPas(i))) ok++;
      if (!ok) {
        fmM.push("🎓 " + nm + " no puede ir a formación hoy: no hay nadie más que cubra su puesto");
        continue;
      }
      const st = stOf(k, i);
      off[i] = 1;
      tn[i] = Math.max(0, (tn[i] | 0) - 1);
      ff[i] = 0;
      if (st[j] < 10) {
        if (!dl[i]) dl[i] = [];
        dl[i][j] = (dl[i][j] | 0) + 1;
      }
      fmM.push(
        "🎓 " +
          nm +
          " hace una formación de " +
          SL[k][j][0].toLowerCase() +
          " (" +
          st[j] +
          " → " +
          Math.min(10, st[j] + 1) +
          ") y hoy no trabaja",
      );
    }
  });
  const idM = [];
  [
    ["w", S.crew, S.cwo, S.cwi, S.cwp, S.cwk, CAND, "Camarero"],
    ["c", S.ccrew, S.cco, S.cci, S.ccp, S.cck, CAND2, "Cocinero"],
  ].forEach(([k, cr, off, ii, pp, kk, L, role]) => {
    for (let i = 0; i < cr.length; i++) {
      const c = cr[i] == null ? null : L[cr[i]],
        nm = c ? c[0] : role + " " + (i + 1);
      if (off[i]) {
        ii[i] = (ii[i] | 0) + 1;
        kk[i] = 0;
        if (ii[i] > 2 && !pp[i]) {
          pp[i] = 1;
          idM.push("⚠️ " + nm + " lleva " + ii[i] + " turnos sin trabajar y pierde 1 punto de velocidad");
        }
      } else {
        ii[i] = 0;
        if (pp[i]) {
          kk[i] = (kk[i] | 0) + 1;
          if (kk[i] >= 2) {
            pp[i] = 0;
            kk[i] = 0;
            idM.push("💪 " + nm + " recupera su punto de velocidad tras trabajar 2 turnos seguidos");
          }
        }
      }
    }
  });
  RSV.clear();
  GRPN = 0;
  let gN = 0,
    gSp = null;
  if (ev === "reserva" || (ev === "cumple" && E.dec === 1)) {
    gN = E.x | 0;
    gSp = grpSpot(gN);
    if (gSp) gSp.ch.forEach((c) => RSV.add(c[0] + "," + c[1]));
  }
  seatsig = "";
  const base = 4 + S.tbl.length * 3 + S.plt.length * 2 + S.buzz,
    EVS = [
      ["☀️ Día soleado: hay más paseantes por la calle", 1.12, 30],
      ["🎉 Fiesta del barrio: ¡mucho movimiento!", 1.4, 6],
      ["🚧 Obras en la calle: llega menos gente", 0.8, 8],
      ["", 1, 36],
    ];
  let wr = Math.random() * EVS.reduce((a, e) => a + e[2], 0),
    evx = EVS[EVS.length - 1];
  for (const e of EVS) {
    if ((wr -= e[2]) < 0) {
      evx = e;
      break;
    }
  }
  if (ev === "lluvia")
    evx = [
      (S.svc | 0) === 1
        ? "🌧️ Noche de lluvia: sale menos gente, pero"
        : "🌧️ Día de lluvia: sale menos gente, pero los platos calientes se pagan más",
      0.7,
      0,
    ];
  if (ev === "partido") evx = ["⚽ Hay partido en la tele: viene más gente y se piden más bebidas", 1.25, 0];
  const wk = S.day % 7 === 6 || S.day % 7 === 0,
    fac = Math.max(0.55, Math.min(1.7, evx[1] * (wk ? 1.2 : 1) * (0.88 + Math.random() * 0.24)));
  S.dst = S.dst || {};
  const dn = {};
  menu.forEach((r) => {
    dn[r.id] = (S.dst[r.id] | 0) + 1;
  });
  S.dst = dn;
  const tired = menu.filter((r) => dn[r.id] > 4),
    mf = tired.length ? Math.max(0.6, 1 - (0.4 * tired.length) / menu.length) : 1;
  S.cur = S.svc | 0;
  const adOn = !!(S.ad && S.ad.n > 0);
  let arrive = Math.max(2, Math.round(base * fac * mf * (1 + 0.5 * decoLvl()) * (adOn ? 1.25 : 1)));
  const pen = Math.min(Math.round((S.unh | 0) * 0.6), Math.floor(arrive * 0.45));
  arrive = Math.max(2, arrive - pen);
  const kidsN = ev === "excursion" ? 6 + S.tbl.length * 2 : 0;
  arrive += kidsN;
  const evm = [
    evx[0],
    wk ? "🍷 Es fin de semana: viene más gente" : "",
    pen ? "😡 Algunos clientes se fueron descontentos: en este servicio vienen " + pen + " menos" : "",
    tired.length
      ? "🔁 Menú muy repetido: " +
        tired.map((r) => r.n + " (" + dn[r.id] + " servicios seguidos)").join(", ") +
        ". Viene menos gente."
      : "",
    decoLvl() > 0.02 ? "✨ Tu decoración atrae un +" + Math.round(decoLvl() * 50) + "% de clientes" : "",
  ].filter(Boolean);
  seatsFor();
  let seatCap = SEATS.filter((s) => !s.rs).length * 3;
  const timeCap = 2 + chefCap() + waitCap();
  let served = 0,
    income = 0,
    ns = 0,
    nt = 0,
    nd = 0,
    tkN = 0,
    tkInc = 0,
    tkLost = 0;
  const sold = {},
    pays = [],
    dfl = [],
    can = (r) => Object.entries(r.i).every(([k, n]) => st(k) >= n);
  for (let c = 0; c < arrive; c++) {
    if (served >= seatCap) {
      ns++;
      continue;
    }
    if (served >= timeCap) {
      nt++;
      continue;
    }
    let r = menu[Math.floor(Math.random() * menu.length)];
    if (!can(r)) {
      const ok = menu.filter(can);
      if (ok.length && Math.random() < 0.5) r = ok[Math.floor(Math.random() * ok.length)];
      else {
        nd++;
        continue;
      }
    }
    for (const [k, n] of Object.entries(r.i)) S.stock[k] -= n;
    const dd = menuD.filter(can);
    if (!dd.length) {
      for (const [k, n] of Object.entries(r.i)) S.stock[k] += n;
      nd++;
      continue;
    }
    const rd = dd[Math.floor(Math.random() * dd.length)];
    for (const [k, n] of Object.entries(rd.i)) S.stock[k] -= n;
    const kid = c >= arrive - kidsN,
      km = kid ? 0.6 : 1,
      tip = kid
        ? 0
        : Math.round((r.p + rd.p) * S.plt.length * 0.04) + (mus ? Math.round((r.p + rd.p) * 0.12) : 0),
      pay =
        Math.round(r.p * km * vm * (ev === "lluvia" && HOT.includes(r.id) ? 1.3 : 1)) +
        Math.round(rd.p * km * vm * dm) +
        tip;
    income += pay;
    pays.push(pay);
    dfl.push(0);
    served++;
    sold[r.id] = (sold[r.id] || 0) + 1;
    sold[rd.id] = (sold[rd.id] || 0) + 1;
  }
  const evm2 = [];
  if (gift) evm2.push(gift);
  if (adOn) {
    S.ad.n--;
    evm2.push(
      "🪧 Campaña publicitaria: +25% de clientes (" +
        (S.ad.n ? "quedan " + S.ad.n + " servicios" : "era el último servicio") +
        ")",
    );
  }
  if (mus) evm2.push("🎻 El músico animó el local: más propinas y algunos clientes más contentos");
  if (ev === "musico" && E.dec !== 1) evm2.push("🎻 Echaste al músico");
  if (ev === "cumple" && E.dec !== 1) evm2.push("🎂 No hiciste el cumpleaños");
  if (ev === "oferta")
    evm2.push(
      E.dec === 1 ? "💼 Aprovechaste la oferta del proveedor" : "💼 Dejaste pasar la oferta del proveedor",
    );
  if (S.tk) {
    const dem = Math.round(arrive * 0.3 * (1 + Math.min(12, S.buzz) * 0.04) * (ev === "lluvia" ? 1.5 : 1)),
      cap = 3 + Math.floor(lvl() / 5);
    for (let q = 0; q < dem; q++) {
      if (tkN >= cap) {
        tkLost = dem - q;
        break;
      }
      let r = menu[Math.floor(Math.random() * menu.length)];
      if (!can(r)) {
        const ok = menu.filter(can);
        if (!ok.length) break;
        r = rnd(ok);
      }
      for (const [k, n] of Object.entries(r.i)) S.stock[k] -= n;
      let pay = Math.round(r.p * vm * 1.1);
      sold[r.id] = (sold[r.id] || 0) + 1;
      const dd = menuD.filter(can);
      if (dd.length && Math.random() < 0.4) {
        const rd = rnd(dd);
        for (const [k, n] of Object.entries(rd.i)) S.stock[k] -= n;
        pay += Math.round(rd.p * dm);
        sold[rd.id] = (sold[rd.id] || 0) + 1;
      }
      tkInc += pay;
      tkN++;
    }
    S.coins += tkInc;
    income += tkInc;
    if (tkN) msBump("tk", tkN);
    evm2.push(
      "🛵 Pedidos para llevar: " +
        tkN +
        " repartido" +
        (tkN === 1 ? "" : "s") +
        " (+" +
        tkInc +
        " 🪙)" +
        (tkLost ? " · " + tkLost + " sin repartir: tu repartidor no da abasto" : ""),
    );
  }
  const xtra = (top, mult, lab, cnt) => {
    let tot = 0;
    for (let q = 0; q < (cnt || 1); q++) {
      if (served >= seatCap) {
        evm2.push("😕 " + lab + ": no había sitio libre y se marchó");
        break;
      }
      let r = top ? [...menu].sort((a, b) => b.p - a.p)[0] : rnd(menu);
      if (!can(r) && !top) {
        const ok = menu.filter(can);
        r = ok.length ? rnd(ok) : null;
      }
      if (!r || !can(r)) {
        evm2.push("😕 " + lab + ": no pudiste cocinar lo que pedía y se fue");
        break;
      }
      for (const [k, n] of Object.entries(r.i)) S.stock[k] -= n;
      const dd = top ? [...menuD].sort((a, b) => b.p - a.p).filter(can) : menuD.filter(can);
      if (!dd.length) {
        for (const [k, n] of Object.entries(r.i)) S.stock[k] += n;
        evm2.push("😕 " + lab + ": no había postre y se fue");
        break;
      }
      const rd = top ? dd[0] : rnd(dd);
      for (const [k, n] of Object.entries(rd.i)) S.stock[k] -= n;
      const pay = Math.round((r.p + rd.p) * mult);
      income += pay;
      pays.push(pay);
      dfl.push(0);
      served++;
      sold[r.id] = (sold[r.id] || 0) + 1;
      sold[rd.id] = (sold[rd.id] || 0) + 1;
      tot += pay;
    }
    return tot;
  };
  if (ev === "famoso") {
    const t = xtra(true, 4, "Cliente famoso");
    if (t > 0) {
      evm2.push("🌟 ¡Un cliente famoso comió en tu local y pagó " + t + " 🪙!");
      bz += 2;
    } else bz -= 1;
  }
  if (ev === "critico") {
    crit = xtra(false, 1.5, "El crítico") > 0 ? 1 : -1;
  }
  if (ev === "aniversario") {
    const nice = S.plt.length + S.dec.length > 0,
      t = xtra(false, nice ? 2 : 1, "Cena de aniversario", 2);
    if (t > 0)
      evm2.push(
        nice
          ? "💑 La pareja celebró su aniversario y pagó " + t + " 🪙 (el doble, gracias a tu decoración)"
          : "💑 Una pareja celebró su aniversario, pero sin plantas ni adornos no hubo ambiente y pagaron lo normal. Pon alguna decoración.",
      );
  }
  if (ev === "cumple" && E.dec === 1) {
    if (gSp) {
      seatCap += gN;
      const p0 = pays.length,
        t = xtra(false, 0.75, "Cumpleaños de " + gN + " personas", gN),
        gp = pays.splice(p0),
        gd = dfl.splice(p0);
      pays.unshift(...gp);
      dfl.unshift(...gd);
      GRPN = gp.length;
      if (gp.length) {
        evm2.push(
          "🎂 El grupo de " + gN + " personas celebró el cumpleaños con tarta gratis y pagó " + t + " 🪙",
        );
        if (gp.length >= gN) bz += 3;
      } else bz -= 1;
    } else {
      bz -= 1;
      evm2.push(
        "🎂 Prometiste una tarta de cumpleaños pero no tenías la mesa preparada (" +
          Math.ceil(gN / 2) +
          " mesas juntas con sillas): el grupo se fue. Pierdes fama.",
      );
    }
  }
  if (ev === "reserva") {
    if (gSp) {
      seatCap += gN;
      const p0 = pays.length,
        t = xtra(false, 1.3, "Reserva de " + gN + " personas", gN),
        gp = pays.splice(p0),
        gd = dfl.splice(p0);
      pays.unshift(...gp);
      dfl.unshift(...gd);
      GRPN = gp.length;
      if (gp.length) {
        evm2.push(
          "📅 El grupo de " +
            gN +
            " personas se sentó en su mesa preparada (" +
            gp.length +
            " comensales) y pagó " +
            t +
            " 🪙",
        );
        if (gp.length >= gN) bz += 2;
      }
    } else {
      bz -= 1;
      evm2.push(
        "📅 Reserva de " +
          gN +
          " personas cancelada: no tenías una mesa preparada (" +
          Math.ceil(gN / 2) +
          " mesas juntas con sillas). Pierdes fama.",
      );
    }
  }
  if (sickMsg) evm2.push(sickMsg);
  evm2.push(...fmM, ...idM);
  if (ev === "sanidad") {
    const ck = [
        ["un cocinero", S.chef >= 1],
        ["una nevera", S.kobj.some((k) => k[2] === 1)],
        ["un lavaplatos", S.kobj.some((k) => k[2] === 9)],
      ],
      ok = ck.filter((c) => c[1]).length,
      miss = ck
        .filter((c) => !c[1])
        .map((c) => c[0])
        .join(", ");
    if (ok === 3) {
      S.coins += 80;
      evm2.push("🧾 Inspección superada: todo en orden. Premio de 80 🪙");
    } else if (ok === 2)
      evm2.push("🧾 El inspector te pone una advertencia: te falta " + miss + ". Sin multa esta vez.");
    else {
      const m = Math.min(S.coins, 60);
      S.coins -= m;
      evm2.push("🧾 Inspección suspendida: te falta " + miss + ". Multa de " + m + " 🪙");
    }
  }
  if (ev === "excursion")
    evm2.push("🚌 Llegó una excursión escolar de " + kidsN + " niños: pagan un 40% menos y no dejan propina");
  if (ev === "ayuda" && E.x) {
    S.coins += E.x;
    evm2.push("🏛️ Ayuda del gobierno concedida: recibes " + E.x + " 🪙");
  }
  if (ev === "agotado" && E.x && NAME[E.x]) evm2.push("📦 Hoy no hay " + NAME[E.x] + " en la tienda");
  if (ev === "partido" && (!S.bars.length || barIdx() < 0))
    evm2.push("⚽ Sin barra de bebidas atendida por un camarero no sacas partido a la noche.");
  const lost = ns + nt,
    out = nd;
  seatsFor();
  const bpay = [],
    dsold = {},
    DK = ["cerveza", "vinotinto", "agua", "vinoblanco", "cola", "limonada", "zumo", "champan"];
  if (BSEATS.length && S.bars.length && barIdx() >= 0) {
    const nb = Math.min(
      BSEATS.length * 2,
      Math.max(1, Math.round((arrive / 2) * (ev === "partido" ? 1.5 : 1))),
    );
    for (let i = 0; i < nb; i++) {
      const av = DK.filter((k) => (S.stock[k] | 0) > 0);
      if (!av.length) break;
      const k = rnd(av);
      S.stock[k]--;
      bpay.push(DP[k]);
      dsold[k] = (dsold[k] || 0) + 1;
    }
  }
  let tdr = 0;
  if (S.bars.length && barIdx() >= 0) {
    for (let i = 0; i < pays.length; i++) {
      if (Math.random() < Math.min(0.97, ev === "partido" ? 0.95 : 0.6)) {
        const av = DK.filter((k) => (S.stock[k] | 0) > 0);
        if (!av.length) break;
        const k = rnd(av);
        S.stock[k]--;
        pays[i] += DP[k];
        income += DP[k];
        dfl[i] = 1;
        tdr++;
        dsold[k] = (dsold[k] || 0) + 1;
      }
    }
  }
  const mp = moodP(aCar, served, timeCap);
  let hp = 0,
    nor = 0,
    ang = 0;
  for (let i = 0; i < served; i++) {
    const r = Math.random();
    if (r < mp.h) hp++;
    else if (r < mp.h + mp.a) ang++;
    else nor++;
  }
  if (mus) {
    const cm = Math.random() < 0.3 ? Math.min(nor, 1 + (Math.random() < 0.5 ? 1 : 0)) : 0,
      pl = Math.min(nor - cm, Math.round(served * 0.1));
    nor -= cm + pl;
    ang += cm;
    hp += pl;
    musC = cm;
  }
  S.buzz = Math.max(0, Math.min(12, Math.round(hp * 0.8 + nor * 0.25 - ang * 0.8 - (lost + out) * 0.3)));
  S.unh = ang + lost + out;
  const angR = Object.assign(angReasons(ang - musC, aCar, served, timeCap), musC ? { ruido: musC } : {});
  if (crit) {
    if (crit > 0 && hp / served >= 0.2 && ang / served <= 0.1 && lost + out === 0) {
      const bn = 60 + 10 * lvl();
      S.coins += bn;
      S.xp += 20;
      bz += 3;
      evm2.push("⭐ El crítico quedó encantado: reseña de 5 estrellas. +" + bn + " 🪙 y +20 XP");
    } else {
      bz -= 2;
      if (crit > 0)
        evm2.push(
          "⭐ El crítico no quedó convencido: perdéis fama. Para la próxima, que todos salgan contentos y nadie se vaya sin plato.",
        );
    }
  }
  S.buzz = Math.max(0, Math.min(12, S.buzz + bz));
  evm2.push(...crewGrow());
  if (ev) evm.unshift("📢 " + EVD[ev].ic + " " + evN(ev));
  evm.push(...retm, ...rst, ...evm2);
  msService(
    served,
    hp,
    nor,
    ang,
    lost + out,
    sold,
    bpay.length + tdr,
    income + bpay.reduce((a, b) => a + b, 0),
    ev,
  );
  wageAccrue();
  S.last = {
    day: S.day,
    arrive,
    served,
    lost,
    out,
    income: income + bpay.reduce((a, b) => a + b, 0),
    sold,
    dsold,
    angR,
    hp,
    nor,
    ang,
    buzz: S.buzz,
    dr: bpay.length + tdr,
    ns,
    nt,
    nd,
    tk: { n: tkN, inc: tkInc, lost: tkLost },
    svc: S.svc | 0,
    ev: evm,
  };
  S.evt = null;
  if ((S.svc | 0) === 0) S.svc = 1;
  else {
    S.svc = 0;
    S.day++;
  }
  startShift(pays, hp, lost + out, bpay, dfl, { h: served ? hp / served : 0, a: served ? ang / served : 0 });
  save();
  draw();
}
