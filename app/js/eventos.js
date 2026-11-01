/* eventos.js — Eventos aleatorios de cada servicio y decisiones del jugador. */

const EVD = {
  critico: {
    ic: "⭐",
    n: "Crítico gastronómico",
    d: "Hoy puede venir un crítico a comer. Si casi todos salen contentos y nadie se va sin plato, ganarás monedas, XP y fama. Si no, perderás fama.",
  },
  excursion: {
    ic: "🚌",
    n: "Excursión escolar",
    d: "Llega un autobús lleno de niños: mucha gente de golpe, pero pagan un 40% menos y no dejan propina. Necesitas sitio y personal.",
  },
  sanidad: {
    ic: "🧾",
    n: "Inspección de sanidad",
    d: "Pasa un inspector. Revisará que tengas un cocinero, una nevera y un lavaplatos en la cocina. Premio si lo tienes todo; multa si falta casi todo.",
  },
  lluvia: {
    ic: "🌧️",
    n: "Día de lluvia",
    d: "Sale menos gente, pero los platos calientes (cremas, estofados, legumbres, arroces, pasta) se venden un 30% más caros.",
  },
  famoso: {
    ic: "🌟",
    n: "Cliente famoso",
    d: "Viene una celebridad y pedirá el plato y el postre más caros de tu carta (necesitas ingredientes). Paga el cuádruple y tu fama sube.",
  },
  agotado: {
    ic: "📦",
    n: "Producto agotado",
    d: "El proveedor se ha quedado sin un producto: no se puede comprar en la tienda durante todo el día.",
  },
  aniversario: {
    ic: "💑",
    n: "Cena de aniversario",
    d: "Una pareja viene a celebrar su aniversario y paga el doble, pero solo si el local tiene alguna planta o adorno.",
  },
  reserva: {
    ic: "📅",
    n: "Reserva de grupo",
    d: "Un grupo grande reserva mesa y paga un 30% más por persona.",
  },
  enfermo: {
    ic: "🤒",
    n: "Alguien no se encuentra bien",
    d: "Un miembro de tu equipo está enfermo y hoy no puede trabajar.",
  },
  averia: {
    ic: "⚡",
    n: "Avería eléctrica",
    d: "Se ha ido la luz de madrugada: la comida de neveras y arcones se ha puesto mala y te quedas sin ingredientes. Evento poco frecuente.",
  },
  ayuda: {
    ic: "🏛️",
    n: "Ayuda concedida",
    d: "El gobierno te concede una ayuda para negocios: recibes entre 250 y 500 monedas extra.",
  },
  plaga: {
    ic: "🪳",
    n: "Plaga de cucarachas",
    d: "Hay que pagar a una empresa para desinsectar el local. Este servicio no se puede abrir y no hay ingresos.",
  },
  proveedor: {
    ic: "🎁",
    n: "Proveedor generoso",
    d: "Un proveedor te regala entre 5 y 15 unidades de uno de los ingredientes de tu última compra (si tienes hueco en neveras y arcones).",
  },
  cumple: {
    ic: "🎂",
    n: "Cumpleaños",
    d: "Un grupo quiere celebrar un cumpleaños en tu local y pide una mesa grande. Si les haces la tarta gratis, el grupo paga un 25% menos, pero tu fama sube mucho si todos quedan servidos. Necesitas una mesa grande preparada (mesas juntas en fila con sillas arriba y abajo). Tú decides.",
  },
  musico: {
    ic: "🎻",
    n: "Músico callejero",
    d: "Un músico pide tocar en tu local. Si le dejas, los clientes dejan más propina y algunos se alegran con la música, pero hay ruido y, con un 30% de probabilidad, 1 o 2 clientes se quejarán. Si lo echas, nada cambia. Tú decides.",
  },
  cartel: {
    ic: "🪧",
    n: "Campaña publicitaria",
    d: "Te ofrecen poner carteles y repartir folletos por el barrio: durante 3 servicios llega un 25% más de gente. Tienes que pagarla ahora. Tú decides.",
  },
  candidato: {
    ic: "🧑‍🍳",
    n: "Candidato que pide trabajo",
    d: "Alguien de otro local se presenta pidiendo trabajo. Si lo fichas pagas un 60% del coste de contratación normal y queda a prueba: durante sus 5 primeros servicios puedes despedirle sin indemnización. Tú decides.",
  },
  oferta: {
    ic: "💼",
    n: "Oferta del proveedor",
    d: "Un proveedor te ofrece un lote grande de un ingrediente a mitad de precio. Tú decides: comprarlo o dejarlo pasar. Solo vale para este servicio.",
  },
  fiesta: {
    ic: "🎤",
    n: "Fiesta privada",
    d: "Un grupo quiere alquilar todo el local para una fiesta privada. Pagan bien, pero este servicio el local cierra al público y no hay clientes normales. Tú decides.",
  },
  baja: {
    ic: "🏥",
    n: "Baja de personal",
    d: "Un miembro de tu equipo está de baja y no trabaja durante 1 o 2 servicios.",
  },
  partido: {
    ic: "⚽",
    n: "Partido en la tele",
    d: "Hay partido: viene un 25% más de gente y se piden muchas más bebidas. Solo ocurre si tienes una tele colgada en la pared (Catálogo → Adornos). Una barra de bebidas te hace ganar mucho más.",
  },
};
const evN = (id) => (id === "lluvia" && (S.svc | 0) === 1 ? "Noche de lluvia" : EVD[id].n);
const HOT = [
  "crema",
  "verduras",
  "estofado",
  "lentejas",
  "garbanzos",
  "menestra",
  "arroz",
  "pisto",
  "macarrones",
  "carbonara",
  "arrozcangrejo",
  "paella",
];
const agot = (k) => !!(S.agot && S.agot.d === S.day && S.agot.k === k);
const hasTV = () => (S.bw || []).some((w) => EXT.win[w[2]] && EXT.win[w[2]][4]);
function evRoll() {
  const sv = S.svc | 0;
  if (S.evt && S.evt.d === S.day && S.evt.s === sv) {
    if (S.evt.id === "enfermo") S.evt.id = null;
    if (S.evt.id === "partido" && !hasTV()) S.evt.id = null;
    return S.evt;
  }
  const L0 = sv
      ? ["aniversario", "partido", "famoso", "reserva", "baja", "lluvia"]
      : ["critico", "excursion", "sanidad", "lluvia", "famoso", "agotado", "reserva", "baja"],
    sk = lvl() >= 10 ? sickPick() : null,
    L = L0.filter(
      (e) =>
        (e !== "baja" || sk) &&
        (e !== "reserva" || lvl() >= 7) &&
        (e !== "famoso" || lvl() >= 3) &&
        (e !== "partido" || hasTV()),
    ),
    rr = Math.random(),
    pe = sv ? 0.35 : 0.4,
    id =
      rr >= pe
        ? null
        : rr < 0.015
          ? stTot() > 0
            ? "averia"
            : rnd(L)
          : rr < 0.03
            ? "ayuda"
            : rr < 0.045
              ? "plaga"
              : rr < 0.06 && (S.lb || []).length
                ? "proveedor"
                : rr < 0.075
                  ? "oferta"
                  : rr < 0.09 && lvl() >= 5
                    ? "fiesta"
                    : rr < 0.105 && lvl() >= 7
                      ? "cumple"
                      : rr < 0.12
                        ? "musico"
                        : rr < 0.135 && !(S.ad && S.ad.n > 0)
                          ? "cartel"
                          : rr < 0.15 && candPick()
                            ? "candidato"
                            : rnd(L);
  let x = null;
  if (id === "ayuda") x = 250 + ((Math.random() * 251) | 0);
  if (id === "oferta") {
    const u = [...(S.menu || []), ...(S.menuD || [])]
        .map(rec)
        .filter(Boolean)
        .flatMap((r) => Object.keys(r.i))
        .filter((k) => ING[k]),
      k = rnd(u.length ? u : Object.keys(ING)),
      n = 20 + ((Math.random() * 11) | 0);
    x = { k, n, c: Math.max(1, Math.round(n * ING[k][1] * 0.5)) };
  }
  if (id === "cumple") x = rnd([5, 6, 7, 8]);
  if (id === "cartel") x = 100 + 20 * lvl();
  if (id === "candidato") {
    const c = candPick();
    if (c) x = Object.assign({}, c, { c: Math.round((c.k === "w" ? cCost(c.id) : kCost(c.id)) * 0.6) });
  }
  if (id === "fiesta")
    x = Math.round(Math.max(150 + 25 * lvl() + 8 * S.tbl.length, 1.2 * ((S.last && S.last.income) || 0)));
  if (id === "averia") {
    x = stTot();
    S.stock = {};
  }
  if (id === "reserva") x = rnd([5, 6, 7, 8, 9, 10]);
  if (id === "baja") x = sk;
  if (id === "agotado") {
    const u = [...(S.menu || []), ...(S.menuD || [])]
        .map(rec)
        .filter(Boolean)
        .flatMap((r) => Object.keys(r.i))
        .filter((k) => ING[k]),
      pool = u.length ? u : Object.keys(ING);
    x = rnd(pool);
    S.agot = { k: x, d: S.day };
  }
  S.evt = { d: S.day, s: sv, id, x, n: id === "baja" ? 1 + (Math.random() < 0.5 ? 1 : 0) : 0 };
  save();
  return S.evt;
}
function sickPick() {
  crewPad();
  ccaFix();
  const o = [];
  if (S.waiters >= 2) for (let i = 0; i < S.waiters; i++) if (!(S.cwz && S.cwz[i])) o.push({ k: "w", i });
  const nf = fogCooks(),
    np = S.chef - nf;
  for (let i = 0; i < S.chef; i++)
    if ((isPas(i) ? np >= 2 : nf >= 2) && !(S.ccz && S.ccz[i])) o.push({ k: "c", i });
  if (!o.length) return null;
  const v = rnd(o);
  v.cid = (v.k === "w" ? S.crew : S.ccrew)[v.i];
  return v;
}
const sickName = (v) => {
  const c = v.cid == null ? null : (v.k === "w" ? CAND : CAND2)[v.cid];
  return c ? c[0] : v.k === "w" ? "Un camarero" : "Un cocinero";
};
function grpSpot(N) {
  const k = Math.ceil(N / 2),
    T = new Set(S.tbl.map(key)),
    C = new Set(S.chr.map(key)),
    SC = SCn();
  for (const t of S.tbl) {
    const x0 = t[0],
      y = t[1];
    if (x0 < SC && x0 + k - 1 >= SC) continue;
    let ok = true;
    for (let i = 0; i < k; i++)
      if (!T.has(x0 + i + "," + y)) {
        ok = false;
        break;
      }
    if (!ok) continue;
    const ch = [];
    for (let i = 0; i < k; i++)
      for (const dy of [-1, 1]) if (C.has(x0 + i + "," + (y + dy))) ch.push([x0 + i, y + dy]);
    if (ch.length >= N) return { ch };
  }
  return null;
}
function evExtra(E) {
  if (E.id === "reserva" || E.id === "cumple") {
    const N = E.x | 0,
      k = Math.ceil(N / 2),
      g = grpSpot(N);
    return ` Son <b>${N} personas</b>. Necesitan una mesa grande: <b>${k} mesas juntas en fila</b> con sillas arriba y abajo (una mesa grande del catálogo o mesas pequeñas pegadas). Prepárala antes de empezar el servicio. ${g ? "✅ Mesa preparada." : "❌ Todavía no tienes la mesa preparada."}`;
  }
  if (E.id === "averia") return ` Has perdido <b>${E.x | 0}</b> ingredientes.`;
  if (E.id === "enfermo" && E.x) return ` <b>${sickName(E.x)}</b> está enfermo y hoy no trabaja.`;
  if (E.id === "baja" && E.x)
    return ` <b>${sickName(E.x)}</b> está de baja y no trabaja ${E.n === 2 ? "en este servicio ni en el siguiente" : "en este servicio"}.`;
  if (E.id === "plaga") return ` Coste de la empresa: <b>${120 + 30 * lvl()} 🪙</b>.`;
  return "";
}
function candPick() {
  const o = [];
  if (S.waiters < 10) {
    crewPad();
    const pool = CAND.map((_, i) => i).filter((i) => !S.crew.includes(i) && !(S.retw || []).includes(i));
    if (pool.length) o.push({ k: "w", id: rnd(pool) });
  }
  ccrewPad();
  ccaFix();
  if (!maxed("chef")) {
    const pool = CAND2.map((_, i) => i).filter((i) => !S.ccrew.includes(i) && !(S.retc || []).includes(i));
    if (pool.length) o.push({ k: "c", id: rnd(pool) });
  }
  return o.length ? rnd(o) : null;
}
function evDecHtml(E) {
  const x = E.x;
  const yn = (a, b, okA) =>
    `<div class="row" style="gap:8px;margin-top:8px"><button class="s" style="flex:1" onclick="evDec(1)" ${okA === false ? "disabled" : ""}>${a}</button><button class="s" style="flex:1" onclick="evDec(2)">${b}</button></div>`;
  if (E.id === "cumple" && x)
    return E.dec
      ? `<div style="margin-top:6px">${E.dec === 1 ? "✅ Vas a hacer la tarta gratis al grupo." : "❌ Has rechazado el cumpleaños."}</div>`
      : yn("🎂 Hacer la tarta gratis", "No hacerlo");
  if (E.id === "musico")
    return E.dec
      ? `<div style="margin-top:6px">${E.dec === 1 ? "✅ El músico tocará durante este servicio." : "❌ Has echado al músico."}</div>`
      : yn("🎻 Dejarle tocar", "Echarlo");
  if (E.id === "cartel" && x)
    return E.dec
      ? `<div style="margin-top:6px">${E.dec === 1 ? "✅ Campaña contratada: +25% de clientes durante 3 servicios." : "❌ Has ahorrado la campaña."}</div>`
      : yn("🪧 Pagar campaña · " + x + " 🪙", "Ahorrar", S.coins >= x);
  if (E.id === "candidato" && x) {
    const L = x.k === "w" ? CAND : CAND2,
      c = L[x.id],
      img = x.k === "w" ? cImg(x.id) : kImg(x.id);
    if (E.dec)
      return `<div style="margin-top:6px">${E.dec === 1 ? "✅ " + c[0] + " ficha a prueba." : "❌ Has rechazado a " + c[0] + "."}</div>`;
    const room = x.k === "w" ? S.waiters < 10 : !maxed("chef"),
      ok = S.coins >= x.c && room;
    return (
      `<div class="row cd" style="margin-top:8px">${img}<div style="flex:1;min-width:0"><b>${c[0]}</b>, ${c[1]} años · ${x.k === "w" ? "Camarero" : "Cocinero"}<div class="mut">${c[2] ? c[2] + " año" + (c[2] > 1 ? "s" : "") + " de experiencia" : "Sin experiencia"}</div><div class="mut">${c[3]}</div>${stChips(x.k, stBase(x.k, x.id))}</div></div>` +
      yn("Fichar a prueba · " + x.c + " 🪙", "Rechazar", ok) +
      (ok
        ? ""
        : `<div class="mut sm">${room ? "No tienes monedas suficientes." : "No tienes sitio para otra persona."}</div>`)
    );
  }
  if (E.id === "oferta" && x) {
    if (E.dec)
      return `<div style="margin-top:6px">${E.dec === 1 ? "✅ Lote comprado." : "❌ Has dejado pasar la oferta."}</div>`;
    const ok = S.coins >= x.c && stTot() + x.n <= stCap();
    return `<div class="row" style="gap:8px;margin-top:8px"><button class="s" style="flex:1" onclick="evDec(1)" ${ok ? "" : "disabled"}>Comprar ${x.n} × ${NAME[x.k]} · ${x.c} 🪙</button><button class="s" style="flex:1" onclick="evDec(2)">Pasar</button></div>${ok ? `<div class="mut sm">Precio normal: ${x.n * ING[x.k][1]} 🪙</div>` : `<div class="mut sm">${S.coins < x.c ? "No tienes monedas suficientes." : "No tienes hueco en neveras y arcones."}</div>`}`;
  }
  if (E.id === "fiesta" && x) {
    if (E.dec)
      return `<div style="margin-top:6px">${E.dec === 1 ? "✅ Aceptada: este servicio el local queda cerrado al público y cobrarás " + x + " 🪙." : "❌ Has rechazado la fiesta: servicio normal."}</div>`;
    return `<div class="row" style="gap:8px;margin-top:8px"><button class="s" style="flex:1" onclick="evDec(1)">Aceptar · +${x} 🪙 (cierras este servicio)</button><button class="s" style="flex:1" onclick="evDec(2)">Rechazar</button></div>`;
  }
  return "";
}
function evDec(v) {
  const E = S.evt;
  if (!E || S.shift || E.dec) return;
  if (E.id === "cartel" && v === 1) {
    if (S.coins < E.x) return;
    S.coins -= E.x;
    S.ad = { n: 3 };
  }
  if (E.id === "candidato" && v === 1) {
    const { k, id, c } = E.x;
    if (S.coins < c) return;
    if (k === "w") {
      if (S.waiters >= 10) return;
      crewPad();
      S.coins -= c;
      S.waiters++;
      S.crew.push(id);
      crewPad();
      if (S.cand) S.cand.ids = S.cand.ids.filter((q) => q !== id);
    } else {
      ccrewPad();
      ccaFix();
      if (maxed("chef")) return;
      S.coins -= c;
      S.chef++;
      S.ccrew.push(id);
      ccrewPad();
      ccaFix();
      if (S.ccand) S.ccand.ids = S.ccand.ids.filter((q) => q !== id);
    }
    msEnsure();
    S.trl = S.trl || {};
    S.trl[k + id] = S.ms.tot.svc | 0;
  }
  if (E.id === "oferta" && v === 1) {
    const { k, n, c } = E.x;
    if (S.coins < c || stTot() + n > stCap()) return;
    S.coins -= c;
    S.stock[k] = st(k) + n;
    msBump("dealb", n);
  }
  E.dec = v;
  save();
  AUsfx("ok");
  drawTop();
  draw();
}
function evCard() {
  if (S.shift) return "";
  const E = evRoll();
  if (!E.id) return "";
  const d = EVD[E.id];
  return `<div class="card" style="border-color:#e8590c"><b>${d.ic} ${evN(E.id)}</b><div class="mut">${d.d}${E.id === "agotado" && E.x && NAME[E.x] ? ` Hoy no puedes comprar <b>${NAME[E.x]}</b> en la tienda.` : ""}${evExtra(E)}</div>${evDecHtml(E)}</div>`;
}
