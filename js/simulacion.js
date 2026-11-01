/* simulacion.js — Animación del servicio: clientes, camareros, cocineros, barra y bucle principal. */

wd.addEventListener("click", (e) => {
  if (tab !== "deco" || busy) return;
  let T = e.target;
  if (T.closest && T.closest("#crowd")) {
    const q = document
      .elementsFromPoint(e.clientX, e.clientY)
      .find((x) => x.closest && !x.closest("#crowd") && x.closest("[data-k],[data-c],[data-kc],[data-wc]"));
    if (q) T = q;
  }
  const k = T.closest("[data-k]"),
    g = T.closest("[data-c]");
  const kc = T.closest("[data-kc]"),
    wc = T.closest("[data-wc]");
  if (k) selItem(k.dataset.k);
  else if (wc) {
    const [w, p] = wc.dataset.wc.split(",");
    tapWin(/^\d$/.test(w) ? +w : w, +p);
  } else if (kc) {
    const [x, y] = kc.dataset.kc.split(",").map(Number);
    tapKCell(x, y);
  } else if (g) {
    const [x, y] = g.dataset.c.split(",").map(Number);
    tapCell(x, y);
  }
});
function attach() {
  const sl = document.getElementById("slot");
  if (sl) {
    sl.appendChild(stage);
    seatsFor();
    staff();
    build();
    fit();
  }
}
function put(p) {
  p.el.style.transform = `translate3d(${p.x}px,${p.y}px,0) ${BB}`;
}
function mk(e, sz) {
  const d = document.createElement("div");
  d.className = "pp";
  d.innerHTML = `<span class="sh"></span><span class="em" style="font-size:${sz || 26}px">${e}</span>`;
  crowd.appendChild(d);
  return d;
}
function pv(k, i) {
  const o = k === "f" || k === "w" || k === "t" || k === "c" ? OPT[k][i][1] : "";
  if (k === "f") return `<div class="pvf"><i style="background:${FLTX[i] || ""}${o}"></i></div>`;
  if (k === "w") return `<div class="pvf"><i class="pw" style="background:${WLTX[i] || ""}${o}"></i></div>`;
  if (k === "t") {
    const n = bigN(i);
    if (n)
      return `<div class="mini"><div class="isom" style="transform:scale(${n > 4 ? 0.42 : 0.52}) rotateX(60deg) rotateZ(45deg)">${Array.from({ length: n }, (_, q) => tableHtml(-20 * n + 40 * q, -20, o, OPT.t[i][2])).join("")}</div></div>`;
    return `<div class="mini"><div class="isom">${tableHtml(-20, -20, o, OPT.t[i][2])}</div></div>`;
  }
  if (k === "c")
    return `<div class="mini"><div class="isom">${chairHtml(-20, -20, o, [0, 1], OPT.c[i][2])}</div></div>`;
  if (k === "b")
    return `<div class="mini"><div class="isom" style="transform:scale(.5) rotateX(60deg) rotateZ(45deg)">${barH(-80, -20, i)}</div></div>`;
  if (k === "s") return `<div class="mini"><div class="isom">${stoolH(-20, -20, i)}</div></div>`;
  return `<div class="mini"><div class="isom">${k === "p" ? plH(-20, -20, i) : dcH(-20, -20, i, 0)}</div></div>`;
}
function unface(p) {
  const b = p.el.querySelector(".bub");
  if (b) b.remove();
}
function go(p, pts, fn) {
  p.path = pts;
  p.then = fn;
}
const orderQ = [],
  cookQ = [],
  readyQ = [],
  payQ = [],
  spawned = new WeakSet(),
  KP = [-10, 136],
  CL = -44,
  CP = [-26, 126];
function drawTop() {
  try {
    msTick();
  } catch (e) {}
  if (typeof AU !== "undefined") {
    const L = lvl();
    if (AU.lv && L > AU.lv) AUsfx("lvl");
    AU.lv = L;
  }
  const rn = document.getElementById("rn");
  if (rn) rn.textContent = S.name ? "🍽️ " + S.name + "  ✏️" : "";
  document.getElementById("top").innerHTML =
    `<div>🪙 ${S.coins}<small>monedas</small></div><div>📅 ${dname(S.shift && S.last ? S.last.day : S.day)} ${S.shift && S.last ? S.last.day : S.day}<small>${(S.shift ? S.cur | 0 : S.svc | 0) ? "🌙 Cena" : "☀️ Comida"} · ${S.menu.length}/${slots()} platos</small></div><div onclick="showPass()" style="cursor:pointer">⭐ Nivel ${lvl()}${passAvail() ? " 🎁" : ""}<small>${S.xp % 100}/100 XP</small></div>`;
}
const paidSum = () => (S.shift ? S.shift.c.reduce((a, c) => a + (c.paid ? c.pay : 0), 0) : 0),
  totalPay = () => (S.shift ? S.shift.c.reduce((a, c) => a + c.pay, 0) : 0);
function upd() {
  drawTop();
  const e = document.getElementById("paid");
  if (e) e.textContent = S.shift ? paidSum() + " 🪙" : "+" + (S.last ? S.last.income : 0) + " 🪙";
}
function finishShift() {
  try {
    cwAdd();
  } catch (e) {}
  if (S.last && S.last.served > 0) S.xp += 5;
  if (S.last) S.wk = (S.wk | 0) + (S.last.income | 0);
  let nb = 0;
  if (S.last && S.last.svc === 1 && S.last.day % 7 === 0) {
    mkBills();
    nb = 1;
  }
  S.shift = null;
  applyNight();
  save();
  upd();
  if (tab === "rest") draw();
  if (nb) setTimeout(showBills, 600);
}
function refreshBusy() {
  busy = S.shift ? S.shift.c.filter((c) => !c.paid).length : 0;
  if (S.shift && !busy) finishShift();
}
function payNow(c) {
  if (c.paid) return;
  c.paid = 1;
  S.coins += c.pay;
  S.xp += 3;
  save();
  refreshBusy();
  upd();
}
const QWt = [],
  QWb = [];
function qDrop(p) {
  [QWt, QWb].forEach((L) => {
    const i = L.indexOf(p);
    if (i >= 0) L.splice(i, 1);
  });
  p.inq = 0;
}
function qHold(p, L, side, retry) {
  if (!p.inq) {
    p.inq = 1;
    L.push(p);
  }
  const i = L.indexOf(p),
    tx = Math.max(XL + 10, Math.min(XR() - 10, DOOR() + (side < 0 ? -i * 26 : 34 + i * 26))),
    ty = GRn() * CS + 16;
  face(p, "🕒");
  p.qt = (p.qt || 0) + 1.2;
  if (Math.hypot(p.x - tx, p.y - ty) > 3)
    go(p, [[tx, ty]], () => {
      p.wait = 1.2;
      p.then = retry;
    });
  else {
    p.wait = 1.2;
    p.then = retry;
  }
}
function done(p) {
  qDrop(p);
  const i = P.indexOf(p);
  if (i >= 0) P.splice(i, 1);
  p.el.remove();
}
function pass(p) {
  face(p, "😕");
  go(p, [[p.dir > 0 ? XR() : XL, p.y]], () => done(p));
}
function gone(p) {
  p.gone = 1;
  if (p.seat) p.seat.u = 0;
  [orderQ, cookQ, readyQ, payQ].forEach((q) => {
    const i = q.indexOf(p);
    if (i >= 0) q.splice(i, 1);
  });
  rmDish(p);
  rmDrink(p);
  CKS.forEach((c) => {
    if (c.p === p) {
      c.p = null;
      c.path = [];
      c.then = null;
      c.wait = 0;
      c.busy = 0;
      unface(c);
      c.el.classList.remove("ck");
      c.x = c.bx;
      c.y = c.by;
      put(c);
    }
  });
  BM.forEach((b) => {
    const i = b.q.indexOf(p);
    if (i >= 0) b.q.splice(i, 1);
    if (b.cur === p) {
      b.cur = null;
      unface(b);
      b.el.classList.remove("ck");
    }
  });
  WS.forEach((w) => {
    if (w.p === p) {
      w.p = null;
      w.path = [];
      w.then = null;
      w.wait = 0;
      w.busy = 0;
      unface(w);
    }
  });
  done(p);
}
function addDish(p) {
  const d = mk("🍽️", 14);
  d.classList.add("dm");
  DM.push({ p, el: d });
  layDish();
}
function layDish() {
  DM.forEach((m, i) => {
    m.el.style.transform = `translate3d(${-30 + (i % 4) * 7}px,108px,22px) ${BB}`;
  });
}
function rmDish(p) {
  const i = DM.findIndex((m) => m.p === p);
  if (i >= 0) {
    DM[i].el.remove();
    DM.splice(i, 1);
    layDish();
  }
}
function arrive(p) {
  const gg = !!(p.c && p.c.g),
    s = SEATS.find((s) => !s.u && !!s.rs === gg);
  if (!s || (!gg && QWt.length && QWt[0] !== p)) {
    if ((p.qt || 0) > 80) {
      qDrop(p);
      payNow(p.c);
      return pass(p);
    }
    qHold(p, QWt, -1, () => arrive(p));
    return;
  }
  qDrop(p);
  const m = SCn() >> 1,
    a = [m - 1 + (Math.random() < 0.5 ? 0 : 1), SRn() - 1],
    r = route(a, [s.cx, s.cy]);
  if (!r) {
    payNow(p.c);
    return pass(p);
  }
  s.u = 1;
  p.seat = s;
  unface(p);
  go(p, [...dp(s), ...r], () => {
    p.el.classList.add("sit");
    face(p, "🙋");
    orderQ.push(p);
  });
}
const DKM = [];
function barStand() {
  const b = S.bars[0];
  if (!b) return null;
  const s0 = solid();
  return (
    [
      [b[0] - 1, b[1]],
      [b[0] + 4, b[1]],
      [b[0] - 1, b[1] + 1],
      [b[0] + 4, b[1] + 1],
      [b[0], b[1] + 1],
    ].find((c) => c[0] >= 0 && inGrid(c) && !s0.has(key(c))) || null
  );
}
function toBar(w) {
  const t = barStand();
  if (!t) return [];
  const a = w.x < 0 ? [0, 3] : cell(w),
    r = route(a, t) || [];
  return w.x < 0 ? [[0, PY], ...r] : r;
}
function layDrink() {
  const b = S.bars[0];
  if (!b) return;
  DKM.forEach((m, i) => {
    m.el.style.transform = `translate3d(${b[0] * CS + 30 + (i % 4) * 30}px,${b[1] * CS + 20}px,29px) ${BB}`;
  });
}
function addDrink(p) {
  const d = mk("🥤", 13);
  d.classList.add("dm");
  DKM.push({ p, el: d });
  layDrink();
}
function rmDrink(p) {
  const i = DKM.findIndex((m) => m.p === p);
  if (i >= 0) {
    DKM[i].el.remove();
    DKM.splice(i, 1);
    layDrink();
  }
}
function checkReady(p) {
  if (p.dishReady && (!p.drink || p.drinkReady)) readyQ.push(p);
}
function arriveB(p) {
  const s = BSEATS.find((s) => !s.u && BM[s.bar]);
  if (!s || (QWb.length && QWb[0] !== p)) {
    if ((p.qt || 0) > 80) {
      qDrop(p);
      payNow(p.c);
      return pass(p);
    }
    qHold(p, QWb, 1, () => arriveB(p));
    return;
  }
  qDrop(p);
  const m = SCn() >> 1,
    a = [m - 1 + (Math.random() < 0.5 ? 0 : 1), SRn() - 1],
    r = route(a, [s.cx, s.cy]);
  if (!r) {
    payNow(p.c);
    return pass(p);
  }
  s.u = 1;
  p.seat = s;
  unface(p);
  go(p, [...dp(s), ...r], () => {
    p.el.classList.add("sit", "hi");
    face(p, "🙋");
    BM[s.bar].q.push(p);
  });
}
function leave(p) {
  const s = p.seat;
  s.u = 0;
  p.seat = null;
  p.el.classList.remove("sit", "hi");
  face(p, p.hp === 2 ? "😋" : p.hp === 0 ? "😡" : "🙂");
  const m = SCn() >> 1,
    te = s.cx >= SCn(),
    r = route([s.cx, s.cy], te ? [SCn() + 1, SRn() - 1] : [m - 1, SRn() - 1]) || [],
    y = SRn() * CS + 16;
  go(p, [...r, [te ? (SCn() + 1) * CS + 20 : DOOR(), y], [p.dir > 0 ? XR() : XL, y]], () => done(p));
}
const cell = (w) => [
  Math.max(0, Math.min(SCn() + TCn() - 1, Math.floor(w.x / CS))),
  Math.max(0, Math.min(GRn() - 1, Math.floor(w.y / CS))),
];
function standCell(s) {
  const s0 = solid();
  return (
    [
      [1, 0],
      [-1, 0],
      [0, 1],
      [0, -1],
    ]
      .map((d) => [s.cx + d[0], s.cy + d[1]])
      .find((n) => n[0] >= 0 && n[1] >= 0 && inGrid(n) && !s0.has(key(n))) || [s.cx, s.cy]
  );
}
function toSeat(w, s) {
  const a = w.x < 0 ? [0, 3] : cell(w),
    s0 = solid(),
    ok = (n) => n[0] >= 0 && n[1] >= 0 && inGrid(n) && !s0.has(key(n));
  let best = null;
  for (const ds of [
    [
      [1, 0],
      [-1, 0],
    ],
    [
      [0, 1],
      [0, -1],
    ],
  ]) {
    for (const d of ds) {
      const n = [s.cx + d[0], s.cy + d[1]];
      if (!ok(n)) continue;
      const r = route(a, n);
      if (r && (!best || r.length < best.length)) best = r;
    }
    if (best) break;
  }
  if (!best) best = route(a, standCell(s)) || [];
  return w.x < 0 ? [[0, PY], ...best] : best;
}
function toKit(w) {
  if (w.x < 0) return [KP];
  const r = route(cell(w), [0, 3]) || [];
  return [...r, [0, PY], KP];
}
function work(w) {
  const k = payQ.length ? "pay" : readyQ.length ? "ready" : orderQ.length ? "order" : null;
  if (!k) return false;
  const p = (k === "pay" ? payQ : k === "ready" ? readyQ : orderQ).shift();
  if (p.gone) return work(w);
  w.p = p;
  w.busy = 1;
  const end = () => {
    w.p = null;
    w.busy = 0;
  };
  if (k === "order")
    go(w, toSeat(w, p.seat), () => {
      face(w, "📝");
      face(p, "🗣️");
      w.wait = 1.6;
      w.then = () => {
        unface(w);
        face(p, "⏳");
        go(w, toKit(w), () => {
          face(w, "🧾");
          w.wait = 0.8;
          w.then = () => {
            unface(w);
            cookQ.push(p);
            if (p.drink) {
              if (BM.length) BM[0].q.push(p);
              else p.drink = 0;
            }
            end();
          };
        });
      };
    });
  else if (k === "ready")
    go(w, toKit(w), () => {
      face(w, "🍽️");
      w.wait = 0.7;
      w.then = () => {
        rmDish(p);
        const dl = () =>
          go(w, toSeat(w, p.seat), () => {
            w.wait = 0.8;
            w.then = () => {
              unface(w);
              face(p, "🍽️");
              p.wait = 6 + Math.random() * 4;
              p.then = () => {
                face(p, "💶");
                payQ.push(p);
              };
              end();
            };
          });
        if (p.drink)
          go(w, toBar(w), () => {
            w.wait = 0.6;
            w.then = () => {
              rmDrink(p);
              dl();
            };
          });
        else dl();
      };
    });
  else
    go(w, toSeat(w, p.seat), () => {
      face(w, "💶");
      w.wait = 1.2;
      w.then = () => {
        unface(w);
        payNow(p.c);
        coin(p);
        leave(p);
        end();
      };
    });
  return true;
}
function coin(p) {
  const d = mk("+" + p.pay + " 🪙", 13);
  d.classList.add("cn");
  d.style.transform = `translate3d(${p.x}px,${p.y - 34}px,0) ${BB}`;
  setTimeout(() => d.remove(), 1500);
}
function mkpp(extra) {
  const dir = Math.random() < 0.5 ? 1 : -1,
    y = GRn() * CS + 8 + Math.random() * 16;
  return Object.assign(
    { el: mkp(person()), x: dir > 0 ? XL : XR(), y, v: 46 + Math.random() * 16, path: [], dir, tries: 0 },
    extra,
  );
}
function newC(c) {
  const p = mkpp({ c, pay: c.pay, hp: c.hp, drink: c.d });
  P.push(p);
  go(p, [[DOOR() + Math.random() * 8 - 4, p.y]], () => (c.k === "b" ? arriveB(p) : arrive(p)));
}
function newL() {
  const p = mkpp({});
  P.push(p);
  go(p, [[DOOR() + Math.random() * 8 - 4, p.y]], () => pass(p));
}
function newP() {
  const p = mkpp({ amb: 1 });
  p.el.classList.add("amb");
  P.push(p);
  go(p, [[p.dir > 0 ? XR() : XL, p.y]], () => done(p));
}
function car() {
  const dir = Math.random() < 0.5 ? 1 : -1,
    t = rnd(["car", "car", "van", "bus"]),
    d = document.createElement("div");
  d.className = "cr";
  d.innerHTML = carHtml(t, dir);
  crowd.appendChild(d);
  K.push({
    el: d,
    x: dir > 0 ? XL - 100 : XR() + 100,
    y: GRn() * CS + (dir > 0 ? 44 : 80),
    dir,
    v: 80 + Math.random() * 50,
  });
}
function spawnPending() {
  let tm = 200;
  S.shift.c.forEach((c) => {
    if (c.paid || spawned.has(c)) return;
    spawned.add(c);
    setTimeout(() => {
      if (!c.paid && S.shift) newC(c);
    }, tm);
    tm += 1500 + Math.random() * 7000;
  });
}
function startShift(pays, hp, lostN, bpay, dfl, md) {
  seatsFor();
  const mk = () => {
    const r = Math.random(),
      h = md ? md.h : 0.1,
      a = md ? md.a : 0.1;
    return r < h ? 2 : r < h + a ? 0 : 1;
  };
  bpay = bpay || [];
  const n = Math.min(pays.length, 24),
    base = pays.slice(0, n);
  let ex = pays.slice(n).reduce((a, b) => a + b, 0);
  for (let i = 0; ex > 0 && n; i = (i + 1) % n, ex--) base[i]++;
  const ph = pays.length ? hp / pays.length : 0.6,
    now = Date.now(),
    D = 44 / (1 + 0.12 * (S.waiters - 1) + 0.12 * (S.chef - 1)),
    free = Array(Math.max(1, SEATS.length)).fill(0);
  const c = base.map((pay, i) => {
    const s = free.indexOf(Math.min(...free)),
      st = Math.max(12 + i * 5, free[s]);
    free[s] = st + D;
    return {
      pay,
      hp: mk(),
      at: now + Math.round((st + D) * 1000),
      paid: 0,
      k: "t",
      g: i < GRPN ? 1 : 0,
      d: dfl && dfl[i] ? 1 : 0,
    };
  });
  const bb = bpay.slice(0, 8);
  let eb = bpay.slice(8).reduce((a, b) => a + b, 0);
  for (let i = 0; eb > 0 && bb.length; i = (i + 1) % bb.length, eb--) bb[i]++;
  const fb = Array(Math.max(1, BSEATS.length)).fill(0);
  bb.forEach((pay, i) => {
    const s = fb.indexOf(Math.min(...fb)),
      st = Math.max(14 + i * 6, fb[s]);
    fb[s] = st + 22;
    c.push({ pay, hp: mk(), at: now + Math.round((st + 22) * 1000), paid: 0, k: "b" });
  });
  for (let i = 0; i < Math.min(lostN, 4); i++) setTimeout(newL, 3000 + i * 9000);
  if (!c.length) {
    busy = 0;
    return;
  }
  S.shift = { t0: now, c };
  busy = c.length;
  spawnPending();
}
function settle() {
  if (!S.shift) return;
  const now = Date.now();
  let ch = 0;
  S.shift.c.forEach((c) => {
    if (!c.paid && c.at <= now) {
      ch = 1;
      const p = P.find((p) => p.c === c);
      if (p) gone(p);
      c.paid = 1;
      S.coins += c.pay;
      S.xp += 3;
    }
  });
  if (ch) {
    save();
    refreshBusy();
    upd();
    if (tab === "rest") draw();
  }
}
function resume() {
  if (!S.shift) return;
  settle();
  refreshBusy();
  if (S.shift) spawnPending();
}
function staff() {
  ccaFix();
  while (WS.length < S.waiters)
    WS.push({
      el: mkp(person({ waiter: 1, look: cLook(WS.length), uni: uniOf("w") }), "w" + WS.length),
      x: 0,
      y: 0,
      v: cSp(WS.length),
      path: [],
      then: null,
      wait: 0,
      busy: 0,
      p: null,
      idle: 0,
    });
  while (CKS.length < S.chef)
    CKS.push({
      el: mkp(person({ chef: 1, look: kLook(CKS.length), uni: uniOf("c") }), "c" + CKS.length),
      x: 0,
      y: 0,
      v: kSp(CKS.length),
      bx: 0,
      path: [],
      then: null,
      wait: 0,
      busy: 0,
      p: null,
      on: false,
    });
  crewPad();
  if (S.bars.length && !S.bseen && S.waiters >= 2) {
    if (!S.cwb.some((x) => x)) {
      let bi = -1;
      for (let i = 0; i < S.waiters; i++)
        if (!S.cwz[i] && (bi < 0 || stOf("w", i)[3] > stOf("w", bi)[3])) bi = i;
      if (bi >= 0 && S.waiters - S.cwz.filter((x) => x).length > 1) {
        S.cwb[bi] = 1;
        S.cwz[bi] = 0;
      }
    }
    S.bseen = 1;
    save();
  }
  if (!S.bars.length) S.bseen = 0;
  const bI = barIdx(),
    want = bI >= 0 ? S.bars.length : 0,
    bc = bI >= 0 ? S.crew[bI] : null;
  if (BM.length && BM[0].cid !== bc) {
    BM.forEach((b) => b.el.remove());
    BM.length = 0;
  }
  while (BM.length < want)
    BM.push({
      el: mkp(person({ waiter: 1, look: cLook(bI), uni: uniOf("w") }), "w" + bI),
      x: 0,
      y: 0,
      q: [],
      cur: null,
      t: 0,
      cid: bc,
    });
  while (BM.length > want) {
    const b = BM.pop();
    b.el.remove();
  }
  WS.forEach((w, i) => {
    w.hx = -36 - (i >> 1) * 22;
    w.hy = 132 + (i & 1) * 16;
    if (!w.placed) {
      w.x = w.hx;
      w.y = w.hy;
      w.placed = 1;
      put(w);
    }
  });
  CKS.forEach((c, i) => {
    const q = chefSlot(i);
    c.bx = q[0];
    c.by = q[1];
    if (!c.busy) {
      c.x = c.bx;
      c.y = c.by;
      put(c);
    }
  });
  WS.forEach((w, i) => {
    const o = !!((S.cwo && S.cwo[i]) || (S.cwz && S.cwz[i]) || (S.cwb && S.cwb[i]));
    if (w.off !== o) {
      w.off = o;
      w.el.style.display = o ? "none" : "";
    }
  });
  CKS.forEach((c, i) => {
    const o = !!((S.cco && S.cco[i]) || (S.ccz && S.ccz[i]));
    if (c.off !== o) {
      c.off = o;
      c.el.style.display = o ? "none" : "";
    }
    const q = isPas(i);
    if (!!c.pas !== q) {
      c.pas = q;
      if (q) {
        face(c, "🧁");
        c.el.classList.add("ck");
      } else {
        unface(c);
        c.el.classList.remove("ck");
      }
    }
    c.v = kSp(i);
  });
  WS.forEach((w, i) => {
    w.v = cSp(i);
  });
  BM.forEach((b, i) => {
    const r = S.bars[i];
    b.x = r[0] * CS + 80;
    b.y = r[1] * CS - 6;
    put(b);
  });
  tkStaff();
}
function tick(p, dt) {
  if (p.wait > 0) {
    p.el.classList.remove("wk");
    p.wait -= dt;
    if (p.wait <= 0) {
      const f = p.then;
      p.then = null;
      if (f) f();
    }
    return;
  }
  if (p.path.length) {
    p.el.classList.add("wk");
    const [tx, ty] = p.path[0],
      dx = tx - p.x,
      dy = ty - p.y,
      d = Math.hypot(dx, dy),
      s = p.v * dt;
    if (d <= s) {
      p.x = tx;
      p.y = ty;
      p.path.shift();
      if (!p.path.length && p.then) {
        const f = p.then;
        p.then = null;
        f();
      }
    } else {
      p.x += (dx / d) * s;
      p.y += (dy / d) * s;
    }
  } else p.el.classList.remove("wk");
  put(p);
}
function loop(t) {
  const dt = Math.min(0.1, (t - last) / 1000 || 0);
  last = t;
  sp -= dt;
  if (sp <= 0) {
    sp = 2 + Math.random() * 2.5;
    if (P.filter((p) => p.amb).length < 5) newP();
  }
  cr -= dt;
  if (cr <= 0) {
    cr = 5 + Math.random() * 5;
    car();
  }
  P.slice().forEach((p) => tick(p, dt));
  staff();
  WS.forEach((w) => {
    if (w.off) return;
    tick(w, dt);
    if (!w.path.length && !(w.wait > 0) && !w.then && !w.busy) {
      if (work(w)) {
        w.idle = 0;
        w.home = 0;
      } else {
        w.idle = (w.idle || 0) + dt;
        if (w.idle > 1.5 && !w.home) {
          w.home = 1;
          go(w, toKit(w).concat([[w.hx, w.hy]]), null);
        }
      }
    }
  });
  CKS.forEach((c) => {
    if (c.off) return;
    if (c.pas) {
      tick(c, dt);
      return;
    }
    tick(c, dt);
    if (!c.path.length && !(c.wait > 0) && !c.then && !c.busy && cookQ.length) {
      const p = cookQ.shift();
      if (p.gone) return;
      c.busy = 1;
      c.p = p;
      face(c, "🍳");
      c.el.classList.add("ck");
      c.wait =
        (9 / (1 + 0.3 * (Math.max(1, CKS.filter((x) => !x.off && !x.pas).length) - 1))) *
        kTime(CKS.indexOf(c));
      c.then = () => {
        c.el.classList.remove("ck");
        face(c, "🍲");
        go(c, [[CL, c.by], [CL, CP[1]], CP], () => {
          c.wait = 0.6;
          c.then = () => {
            unface(c);
            p.dishReady = 1;
            addDish(p);
            checkReady(p);
            go(
              c,
              [
                [CL, CP[1]],
                [CL, c.by],
                [c.bx, c.by],
              ],
              () => {
                c.busy = 0;
                c.p = null;
              },
            );
          };
        });
      };
    }
  });
  tkLoop(dt);
  BM.forEach((b) => {
    if (!b.cur && b.q.length) {
      const p = b.q.shift();
      if (p.gone) return;
      b.cur = p;
      b.t = Math.max(1, 4.4 - 0.34 * workAvg("w", 3));
      face(b, "🍹");
      b.el.classList.add("ck");
    } else if (b.cur) {
      b.t -= dt;
      if (b.t <= 0) {
        const p = b.cur;
        b.cur = null;
        unface(b);
        b.el.classList.remove("ck");
        if (p.seat && p.seat.bar !== undefined) {
          face(p, "🥤");
          p.wait = 7 + Math.random() * 3;
          p.then = () => {
            payNow(p.c);
            coin(p);
            leave(p);
          };
        } else {
          p.drinkReady = 1;
          addDrink(p);
          checkReady(p);
        }
      }
    }
  });
  K.slice().forEach((c) => {
    c.x += c.dir * c.v * dt;
    c.el.style.transform = `translate3d(${c.x}px,${c.y}px,0)`;
    if (c.x > XR() + 160 || c.x < XL - 160) {
      K.splice(K.indexOf(c), 1);
      c.el.remove();
    }
  });
  const t2 = busy ? "🟢 Abierto" : "🔴 Cerrado";
  if (sign.textContent !== t2) sign.textContent = t2;
  requestAnimationFrame(loop);
}
