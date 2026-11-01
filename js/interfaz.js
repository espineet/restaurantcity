/* interfaz.js — Interfaz: estilos comprados, modo noche, decoración y dibujo de cada pestaña. */

const stp = (k, i) => (OPT[k][i][2] != null ? OPT[k][i][2] : 50 * i);
function style_(k, i) {
  const id = k + i;
  if (!S.own.includes(id)) {
    const pr = k === "kf" || k === "kw" ? OPT[k][i][2] : stp(k, i);
    if (S.coins < pr) return;
    S.coins -= pr;
    S.own.push(id);
    note = "✔ " + invLN[k] + " «" + OPT[k][i][0] + "» comprado. Está en el Inventario: pulsa Poner.";
    save();
    draw();
    return;
  }
  S.look[k] = i;
  note = "";
  save();
  draw();
}
const invLN = { f: "Suelo", w: "Pared", kf: "Suelo de cocina", kw: "Pared de cocina" },
  invDef = ["f0", "w0", "f9", "w9", "kf0", "kw0"];
function invLooks() {
  let h = "";
  for (const k of ["f", "w", "kf", "kw"])
    OPT[k].forEach((o, i) => {
      const id = k + i;
      if (!S.own.includes(id) || invDef.includes(id) || (S.look[k] | 0) === i) return;
      h += `<div class="card"><div class="row"><div class="mini sm">${k === "kf" || k === "kw" ? kpvl(k, i) : pv(k, i)}</div><div style="flex:1"><b>${invLN[k]} ${o[0]}</b><div class="mut">Tuyo</div></div><div><button class="s" onclick="style_('${k}',${i})" ${busy ? "disabled" : ""}>Poner</button></div></div></div>`;
    });
  return h;
}
const isNight = () => (S.shift ? (S.cur | 0) === 1 : (S.svc | 0) === 1);
function applyNight() {
  document.body.classList.toggle("night", isNight());
}
function decoVal(St) {
  let v = 0;
  const A = {
    t: St.tbl,
    c: St.chr,
    p: St.plt,
    b: St.bars,
    s: St.stl,
    d: St.dec,
    v: St.wins,
    u: St.bw,
    q: St.kwn,
  };
  for (const k in A) for (const m of A[k] || []) v += (PRICE[k] || [])[m[2] | 0] || 0;
  for (const g of Object.keys(EXT)) if (g !== "win") v += ((St.ext || {})[g] | 0) * 40;
  for (const k of St.kobj || []) v += (PRICE.k || [])[Array.isArray(k) ? k[2] : 0] || 0;
  const lk = St.look || {};
  v += (+stp("f", lk.f | 0) || 0) + (+stp("w", lk.w | 0) || 0);
  return v;
}
let DB0 = null;
function baseDeco() {
  const sv = S;
  try {
    S = fresh();
    initLayout();
    return decoVal(S);
  } finally {
    S = sv;
  }
}
function decoLvl() {
  if (DB0 == null) DB0 = baseDeco();
  return Math.max(0, Math.min(1, (decoVal(S) - DB0) / 10000));
}
function dbar() {
  const st = document.querySelector(".stage");
  let e = document.getElementById("dbar");
  if (!st) {
    if (e) e.remove();
    return;
  }
  const l = decoLvl();
  if (!e) {
    e = document.createElement("div");
    e.id = "dbar";
    st.appendChild(e);
  }
  e.innerHTML = `<div>✨</div><div class="dbm"><div class="dbf" style="height:${Math.round(l * 100)}%"></div></div><div>+${Math.round(l * 50)}%</div>`;
}
function draw() {
  draw0();
  applyNight();
  dbar();
  try {
    lockPass();
  } catch (e) {}
}
function draw0() {
  drawTop();
  const T = [
    ["rest", "🏠<br>Local"],
    ["menu", "📋<br>Menú"],
    ["shop", "🛒<br>Tienda"],
    ["deco", "🎨<br>Catálogo"],
    ["staff", "👥<br>Plantilla"],
    ["up", "🔧<br>Mejoras"],
  ];
  document.getElementById("tabs").innerHTML = T.map(
    ([k, l]) =>
      `<button class="${tab === k ? "on" : ""}" onclick="tab='${k}';note='';if(tab==='up'){candHide.w=1;candHide.c=1}draw()">${l}</button>`,
  ).join("");
  const v = document.getElementById("view");
  if (tab === "rest") {
    const seats = Array.from({ length: 8 }, (_, i) => (i < S.tables ? "🍽️" : "▫️")).join("</span><span>");
    const dec = S.deco ? "🪴".repeat(Math.min(S.deco, 10)) : "Sin decoración";
    let l = "";
    if (S.shift) {
      l = `<div class="card"><div class="row"><b>Servicio en marcha</b><b class="ok" id="paid">${paidSum()} 🪙</b></div><div class="mut">Cobrado hasta ahora. El resumen del día aparecerá cuando termine el servicio.</div></div>`;
    } else if (S.last) {
      const a = S.last;
      l = `<div class="card"><b>Resultado del ${dname(a.day)} ${a.day} · ${a.svc ? "🌙 Cena" : "☀️ Comida"}</b>${(a.ev || []).map((e) => `<div class="mut" style="margin:4px 0">${e}</div>`).join("")}<div class="row"><span>Clientes llegados</span><span>${a.arrive}</span></div><div class="row"><span>Servidos</span><span class="ok">${a.served}</span></div>${a.hp != null ? `<div class="row"><span>Contentos</span><span class="ok">😊 ${a.hp}</span></div>` : ""}${a.nor != null ? `<div class="row"><span>Normales</span><span>🙂 ${a.nor}</span></div>` : ""}${a.dr ? `<div class="row"><span>Bebidas servidas</span><span class="ok">🍹 ${a.dr}</span></div>` : ""}${a.nor != null ? angBlock(a) : a.ns != null ? `<div class="row"><span>Se fueron: no había sitio</span><span class="bad">${a.ns}</span></div><div class="row"><span>Se fueron: tardaron demasiado en atenderlos</span><span class="bad">${a.nt}</span></div><div class="row"><span>Se fueron: no había el plato que pedían</span><span class="bad">${a.nd}</span></div>` : `<div class="row"><span>Sin sitio o tiempo</span><span class="bad">${a.lost}</span></div><div class="row"><span>Se fueron sin plato</span><span class="bad">${a.out}</span></div>`}<div class="row"><b>${S.shift ? "Cobrado hasta ahora" : "Ingresos"}</b><b class="ok" id="paid">${S.shift ? paidSum() : "+" + a.income} 🪙</b></div>${a.buzz != null ? `<div class="mut">📣 Boca a boca: mañana vienen +${a.buzz} clientes</div>` : ""}${soldRows(a)}</div>`;
    }
    const rep = S.menu
        .map(rec)
        .filter(Boolean)
        .map((r) => [r, S.dst && S.dst[r.id] | 0]),
      repB = rep.filter((a) => a[1] >= 4).map((a) => a[0].n),
      repY = rep.filter((a) => a[1] === 3).map((a) => a[0].n),
      repW =
        (repB.length
          ? `<div class="mut bad">🔁 Cambia el menú antes de abrir: ${repB.join(", ")} lleva${repB.length > 1 ? "n" : ""} 4 servicios seguidos y, si lo repites, vendrá menos gente.</div>`
          : "") +
        (repY.length
          ? `<div class="mut" style="color:#e8590c">🔁 ${repY.join(", ")}: ${repY.length > 1 ? "llevan" : "lleva"} 3 servicios seguidos. Tras el siguiente conviene cambiar el menú.</div>`
          : ""),
      warn =
        repW +
        (!S.menu.length || !S.menuD.length
          ? `<div class="mut bad">Elige al menos un plato y un postre en Menú.</div>`
          : S.bars.length && barIdx() < 0
            ? `<div class="mut bad">🍸 Tienes barra pero ningún camarero en ella: asigna uno en Plantilla (puesto Barra) para servir bebidas. Hacen falta al menos 2 camareros.</div>`
            : "");
    v.innerHTML = `<div class="card"><div id="slot"></div><div class="mut" style="text-align:center">👨‍🍳 Cocinero nivel ${S.chef}</div></div>${warn}${evCard()}${billsCard()}<div style="display:flex;gap:8px;align-items:stretch"><button class="big" style="flex:1" onclick="openDay()" ${(restSel && rcRem() > 0) || (S.menu.length && S.menuD.length) ? (!busy ? "" : "disabled") : "disabled"}>${busy ? "🍽️ Servicio en marcha..." : (restSel && rcRem() > 0 ? "😴 Cerrar el local " : S.svc | 0 ? "🌙 Abrir la cena del " : "☀️ Abrir la comida del ") + dname(S.day) + " " + S.day}</button><button class="s" onclick="restSel=!restSel;draw()" ${busy || rcRem() < 1 ? "disabled" : ""} style="width:84px;line-height:1.15;border:2px solid ${restSel && rcRem() > 0 ? "var(--ac)" : "var(--bd)"};${restSel && rcRem() > 0 ? "background:rgba(232,89,12,.15)" : ""}">😴<br><small>Día de descanso</small><br><small>${restSel && rcRem() > 0 ? "✔ " : ""}quedan ${Math.max(0, rcRem())}</small></button></div><div style="height:10px"></div>${l}<p class="mut">Consejo: compra ingredientes antes de abrir. Sin ingredientes, los clientes se van.</p><button class="s" onclick="document.getElementById('rs').style.display='flex'">Reiniciar partida</button>`;
  }
  if (tab === "menu") {
    const card = (r, mn, tog) => {
      const un = S.unlocked.includes(r.id),
        sel = mn.includes(r.id),
        ing = Object.entries(r.i)
          .map(([k, n]) => `${ico(k, 16)} ${NAME[k]} ×${n}`)
          .join(", "),
        can = Math.min(...Object.entries(r.i).map(([k, n]) => Math.floor(st(k) / n)));
      return `<div class="card dish dish2 ${sel ? "sel" : un ? "un" : ""}">${dico(r, 48)}<b>${r.n}</b><div class="mut">vende ${r.p} 🪙</div><div class="mut sm">${ing}</div>${un ? `<div class="mut">Puedes cocinar: ${can}</div><button class="s" onclick="${tog}('${r.id}')">${sel ? "Quitar" : "Añadir"}</button>` : `<button class="s" onclick="unlock('${r.id}')" ${S.coins < r.u ? "disabled" : ""}>Receta ${r.u} 🪙</button>`}</div>`;
    };
    const ord = (a, m) => [
        ...a.filter((r) => m.includes(r.id)),
        ...a.filter((r) => !m.includes(r.id) && S.unlocked.includes(r.id)),
        ...a.filter((r) => !S.unlocked.includes(r.id)),
      ],
      nl = (Math.floor(lvl() / 5) + 1) * 5,
      nd = (Math.floor(lvl() / 7) + 1) * 7;
    v.innerHTML = `<p class="mut">Cada cliente pide <b>1 plato y 1 postre</b>, así que necesitas al menos uno de cada en la carta.</p><div class="mcols"><div><h3>🍽️ Platos (${S.menu.length}/${slots()})</h3><div class="mut sm">Hueco nuevo cada 5 niveles. Próximo: nivel ${nl}.</div>${ord(
      REC.filter((r) => !r.d),
      S.menu,
    )
      .map((r) => card(r, S.menu, "toggle"))
      .join(
        "",
      )}</div><div><h3>🍰 Postres (${S.menuD.length}/${dslots()})</h3><div class="mut sm">${dslots() >= 9 ? "Todos los huecos desbloqueados." : "Hueco nuevo cada 7 niveles. Próximo: nivel " + nd + "."}</div>${ord(
      REC.filter((r) => r.d),
      S.menuD,
    )
      .map((r) => card(r, S.menuD, "toggleD"))
      .join("")}</div></div>`;
  }
  if (tab === "shop") {
    const ks0 =
      cat === "Bebidas"
        ? DRINKS
        : cat === "Postres"
          ? [
              "nata",
              "chocolate",
              "yogur",
              "azucar",
              "maicena",
              "leche",
              "harina",
              "vainilla",
              "caramelo",
              "miel",
            ]
          : Object.keys(ING).filter((k) => CAT[k] === cat);
    const use = (k) => REC.filter((r) => k in r.i).length,
      ks = [...ks0].sort((x, y) => use(y) - use(x) || ING[x][1] - ING[y][1]);
    v.innerHTML = `<div class="chips">${CATS.map((c) => `<button class="${c === cat ? "on" : ""}" onclick="cat='${c}';draw()">${c}</button>`).join("")}</div>${dealBanner()}<div class="card" style="cursor:pointer" onclick="almOpen=!almOpen;draw()"><div class="row"><b>🧊 Almacén ${almOpen ? "▲" : "▼"}</b><b class="${stTot() >= stCap() ? "bad" : ""}">${stTot()}/${stCap()}</b></div><div class="mut sm">Cada nevera guarda 50 ingredientes y cada arcón 100. ${almOpen ? "Toca para cerrar." : "Toca para ver lo que hay dentro."}</div>${
      almOpen
        ? (() => {
            const G = {};
            Object.keys(S.stock || {})
              .filter((k) => ING[k] && st(k) > 0)
              .forEach((k) => {
                const c = DRINKS.includes(k) ? "Bebidas" : CAT[k] || "Despensa";
                (G[c] = G[c] || []).push(k);
              });
            const cs = Object.keys(G);
            return cs.length
              ? `<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:8px;margin-top:8px">${cs
                  .map(
                    (c) =>
                      `<div style="border:1px solid var(--bd);border-radius:12px;padding:8px;background:var(--bg,#fff)"><div class="row" style="margin:0 0 6px"><b>${c}</b><span class="mut">${G[c].reduce((a, k) => a + st(k), 0)}</span></div><div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(54px,1fr));gap:6px">${G[
                        c
                      ]
                        .sort((x, y) => st(y) - st(x))
                        .map(
                          (k) =>
                            `<div style="text-align:center;border-radius:8px;background:rgba(0,0,0,.04);padding:4px 2px">${ico(k, 32)}<div style="font-size:11px;line-height:1.1">${NAME[k]}</div><b>${st(k)}</b></div>`,
                        )
                        .join("")}</div></div>`,
                  )
                  .join("")}</div>`
              : `<div class="mut" style="margin-top:8px">El almacén está vacío. Compra ingredientes abajo.</div>`;
          })()
        : ""
    }</div><div class="grid">${ks.map((k) => `<div class="card item">${ico(k, 56)}<b>${NAME[k]}</b><div class="mut">${agot(k) ? "📦 Agotado hoy" : priceHtml(k) + " · tienes " + st(k)}</div><div><button class="s" onclick="buy('${k}',1)" ${S.coins < priceOf(k) || agot(k) || stTot() + 1 > stCap() ? "disabled" : ""}>+1</button> <button class="s" onclick="buy('${k}',5)" ${S.coins < priceOf(k) * 5 || agot(k) || stTot() + 5 > stCap() ? "disabled" : ""}>+5</button></div></div>`).join("")}</div>`;
  }
  if (tab === "deco") {
    const iv = S.inv,
      tot =
        iv.t.length +
        iv.c.length +
        iv.p.length +
        iv.b.length +
        iv.s.length +
        iv.d.length +
        (iv.v || []).length +
        (iv.u || []).length +
        (iv.q || []).length,
      nm = sel && ARR(sel[0])[+sel.slice(1)] ? label(sel[0], ARR(sel[0])[+sel.slice(1)][2] | 0) : "";
    const help = busy
      ? "Espera a que acabe el servicio para mover muebles."
      : pick
        ? `Colocando: <b>${label(pick.k, pick.s)}</b>. ${"vuq".includes(pick.k) ? "Toca una casilla amarilla de la pared." : pick.k === "k" ? "Toca una casilla libre de la cocina (arriba a la izquierda)." : "Toca una casilla libre del salón."}`
        : sel
          ? `Seleccionado: <b>${nm}</b>. Toca una casilla libre para moverlo o usa los botones.`
          : "Toca un mueble o una planta para seleccionarlo. Pellizca para hacer zoom.";
    const bar =
      sel && !busy && ARR(sel[0])[+sel.slice(1)]
        ? `<div class="card"><div class="row" style="flex-wrap:wrap;justify-content:flex-start">${sel[0] === "k" && ![4, 5, 6, 7, 8, 11, 12].includes(ARR("k")[+sel.slice(1)][2]) ? "" : `<button class="s" onclick="store()">📦 Guardar</button>`}${sel[0] === "t" ? `<button class="s" onclick="store(1)">📦 Con sus sillas</button>` : ""}${sel[0] === "k" && (ARR("k")[+sel.slice(1)][2] < 4 || ARR("k")[+sel.slice(1)][2] === 9) ? "" : `<button class="s" onclick="sellSel()">💰 Vender +${half(sel[0], ARR(sel[0])[+sel.slice(1)][2])} 🪙</button>`}</div></div>`
        : "";
    let body = "";
    if (ccat === "i") {
      body =
        ["t", "c", "b", "s", "p", "d", "v", "u", "q", "k"]
          .map((k) => {
            const cs = {};
            (iv[k] || []).forEach((s) => (cs[s] = (cs[s] || 0) + 1));
            return Object.keys(cs)
              .map((s) => {
                s = +s;
                const on = pick && pick.k === k && pick.s === s;
                return `<div class="card"><div class="row">${k === "k" ? `<div class="mini sm"><div class="isom" style="transform:scale(.9) rotateX(60deg) rotateZ(45deg)">${KH[s](-13, -13, 0, bx)}</div></div>` : "vuq".includes(k) ? `<div class="mini sm" style="display:flex;align-items:center;justify-content:center">${winSvg(s)}</div>` : k === "p" || k === "d" ? `<div class="mini sm"><span class="sv">${thumb(k, s)}</span></div>` : `<div class="mini sm"><div class="isom"${k === "b" ? ' style="transform:scale(.32) rotateX(60deg) rotateZ(45deg)"' : ""}>${thumb(k, s)}</div></div>`}<div style="flex:1"><b>${label(k, s)}</b><div class="mut">× ${cs[s]}</div></div><div><button class="s" onclick="invPick('${k}',${s})" ${busy ? "disabled" : ""}>${on ? "✔ Colocando" : "Colocar"}</button> <button class="s" onclick="invSell('${k}',${s})">+${half(k, s)} 🪙</button></div></div></div>`;
              })
              .join("");
          })
          .join("") + invLooks() ||
        `<p class="mut">El inventario está vacío. Compra muebles en el catálogo o guarda los del salón.</p>`;
    } else if (ccat === "f" || ccat === "w")
      body = `<div class="grid">${OPT[ccat]
        .map((o, i) => {
          const own = S.own.includes(ccat + i),
            use = S.look[ccat] === i;
          return `<div class="card item">${pv(ccat, i)}<b>${o[0]}</b><div class="mut">${own ? (use ? "✔ En uso" : "Tuyo") : stp(ccat, i) + " 🪙"}</div><button class="s" onclick="style_('${ccat}',${i})" ${use || (!own && S.coins < stp(ccat, i)) ? "disabled" : ""}>${own ? "Usar" : "Comprar"}</button></div>`;
        })
        .join("")}</div>`;
    else if (ccat === "k") body = kgrid() + wgrid("q");
    else if (ccat === "z") body = zgrid();
    else if (ccat === "d") body = dgrid("d") + dgrid("p") + wgrid("u");
    else if (ccat === "x") body = xgrid();
    else if (ccat === "r") body = ropaGrid();
    else if (ccat === "b") body = bgrid("b") + bgrid("s");
    else if (ccat === "t") body = mgrid("t", "Mesas") + mgrid("c", "Sillas");
    else
      body = `<div class="grid">${PRICE[ccat].map((pr, i) => (TERA[ccat] != null && isT(ccat, i) ? "" : `<div class="card item">${pv(ccat, i)}<b>${nameOf(ccat, i)}</b><div class="mut">${pr} 🪙 · vende ${Math.floor(pr / 2)}</div><button class="s" onclick="buyItem('${ccat}',${i})" ${S.coins < pr ? "disabled" : ""}>Comprar</button></div>`)).join("")}</div>`;
    v.innerHTML = `<div class="card"><div id="slot"></div></div><p class="mut">${help}</p>${bar}<div class="chips">${CT.map(([k, n]) => `<button class="${k === ccat ? "on" : ""}" onclick="ccat='${k}';note='';draw()">${n}${k === "i" ? " (" + tot + ")" : ""}</button>`).join("")}</div>${note ? `<p class="mut">${note}</p>` : ""}${body}`;
  }
  if (tab === "staff") {
    crewPad();
    ccrewPad();
    const row = (k, i) => {
      const cr = k === "w" ? S.crew : S.ccrew,
        L = k === "w" ? CAND : CAND2,
        cid = cr[i],
        c = cid == null ? null : L[cid],
        xs = k === "w" ? S.cwx : S.ccx,
        n = xs[i] | 0,
        ex = (c ? c[2] : 2) + Math.floor(n / 15),
        role = k === "w" ? "Camarero" : "Cocinero",
        age = ageOf(k, i),
        pic = c
          ? k === "w"
            ? cImg(cid)
            : kImg(cid)
          : `<div class="av" style="display:flex;align-items:center;justify-content:center;font-size:26px">${k === "w" ? "🤵" : "👨‍🍳"}</div>`;
      return `<div class="card" style="cursor:pointer" onclick="fireSel=null;fireMsg='';showFicha('${k}${i}')"><div class="row" style="gap:12px;justify-content:flex-start">${pic}<div style="flex:1;min-width:0"><b>${c ? c[0] : role + " " + (i + 1)}</b>, ${age} años<div class="mut">${ex} año${ex === 1 ? "" : "s"} de experiencia</div><div style="font-size:13px;margin:2px 0"><b>${rosterTag(k, i)}</b></div>${stChips(k, stOf(k, i), 1)}</div><span class="mut">›</span></div></div>`;
    };
    v.innerHTML = `<p class="mut">Tu equipo. Toca a una persona para ver su ficha completa. Cumplen 1 año cada lunes y se jubilan a los 65. Cada 15 servicios ganan 1 año de experiencia y +1 punto en una estadística al azar.</p><p class="mut"><b>🧑‍🍳 Camareros (${S.waiters})</b></p>${S.crew.map((_, i) => row("w", i)).join("") || `<div class="mut">Aún no tienes camareros.</div>`}<p class="mut" style="margin-top:14px"><b>👨‍🍳 Cocineros (${S.chef})</b></p>${S.ccrew.map((_, i) => row("c", i)).join("") || `<div class="mut">Aún no tienes cocineros.</div>`}<p class="mut" style="margin-top:12px">Para contratar a alguien nuevo ve a 🔧 Mejoras.</p>`;
  }
  if (tab === "up") {
    const U = [
      [
        "sal",
        "🏠 Ampliar salón",
        `Nivel ${S.sal}/10. Ahora ${SCn()}×${SRn()} casillas, más sitio para muebles.`,
      ],
      [
        "kit",
        "🍳 Ampliar cocina",
        `Nivel ${S.kit}/10. Ahora ${fogN()} fogones (+1 por nivel) y más espacio.`,
      ],
      ["ter", "🌿 Ampliar terraza", terDesc()],
    ];
    v.innerHTML =
      (note ? `<p class="bad">${note}</p>` : "") +
      camPanel() +
      chefPanel() +
      U.map(
        ([t, n, d]) =>
          `<div class="card"><div class="row"><div><b>${n}</b><div class="mut">${d}</div></div>${maxed(t) ? `<span class="ok">Máximo</span>` : `<button class="s" onclick="upg('${t}')" ${S.coins < cost(t) || blocked(t) ? "disabled" : ""}>${cost(t)} 🪙</button>`}</div></div>`,
      ).join("") +
      tkCard();
  }
  attach();
}
