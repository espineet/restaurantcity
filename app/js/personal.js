/* personal.js — Plantilla: candidatos, estadísticas, puestos, formación, despidos, edad y contratación. */

const CAND = [
  [
    "Álvaro",
    29,
    5,
    "Metódico y sonriente. Dice que nunca se le ha caído una bandeja.",
    "#f3c9a5",
    "#c79a3b",
    0,
  ],
  [
    "Javier",
    34,
    9,
    "Lleva media vida en restaurantes. Se sabe la carta de memoria.",
    "#e8b48a",
    "#7a4a22",
    0,
  ],
  ["Daniel", 24, 2, "Joven y con ganas. Corre entre mesas sin despeinarse.", "#f3c9a5", "#4a2e1b", 0],
  ["Samuel", 38, 12, "Elegante y tranquilo. Los clientes habituales piden su mesa.", "#8d5a3b", "#1c1c1c", 0],
  ["Ernesto", 61, 35, "Camarero de toda la vida. Lo ha visto todo y lo sirve todo.", "#f6d6bd", "#e0e0e0", 2],
  ["Mei", 26, 4, "Rápida y precisa. Memoriza comandas sin apuntar nada.", "#f3c9a5", "#1c1c1c", 0],
  ["Pablo", 41, 15, "Veterano de banquetes. Aguanta turnos larguísimos.", "#e8b48a", "#2b1d14", 0],
  [
    "Rafael",
    58,
    30,
    "Educado y paciente, con las gafas siempre en la punta de la nariz.",
    "#f6d6bd",
    "#b8b8b8",
    2,
  ],
  ["Carmen", 33, 8, "Simpática y resolutiva. Convierte las quejas en propinas.", "#f3c9a5", "#b5651d", 1],
  [
    "Kofi",
    30,
    7,
    "Muy observador: sabe qué quiere cada mesa antes de que lo pidan.",
    "#8d5a3b",
    "#1c1c1c",
    2,
  ],
  ["Sergio", 22, 1, "Recién salido de la escuela de hostelería. Aprende rápido.", "#e8b48a", "#4a2e1b", 0],
  ["Hugo", 27, 3, "Tranquilo y fiable. Nunca se agobia, ni en hora punta.", "#f3c9a5", "#2b1d14", 0],
  ["Iván", 36, 11, "Experto en vinos y en sonrisas. Sabe recomendar.", "#e8b48a", "#7a4a22", 0],
  ["Nico", 19, 0, "Es su primer trabajo, pero tiene mucha energía.", "#f6d6bd", "#e3cf8a", 0],
  ["Aitana", 23, 2, "Atenta y alegre. Se hace amiga de todos los clientes.", "#f3c9a5", "#1f2a5a", 1],
  ["Marcos", 39, 14, "Serio y profesional. Gestiona cuatro mesas a la vez.", "#e8b48a", "#7a4a22", 0],
  ["Gonzalo", 55, 28, "Maestro del servicio. Con una mirada ya sabe qué falta.", "#f3c9a5", "#c9c9c9", 0],
  ["Marta", 28, 5, "Ordenada y rápida. Su zona nunca tiene platos sucios.", "#f3c9a5", "#8b3a2b", 1],
  ["Leo", 25, 3, "Siempre con una sonrisa, aunque la cocina vaya con retraso.", "#f3c9a5", "#6b4423", 0],
  ["Elena", 31, 7, "Se recoge el pelo y no se le escapa ni una mesa.", "#f3c9a5", "#5a3a22", 1],
  [
    "Oliver",
    22,
    1,
    "Despistado con los nombres, pero con las gafas siempre limpias.",
    "#f6d6bd",
    "#b5651d",
    2,
  ],
  ["Mamadou", 35, 10, "Voz profunda y trato exquisito. Domina la sala con calma.", "#6b4226", "#1c1c1c", 0],
  ["Lucía", 27, 4, "Educada y eficiente. Nunca pierde una comanda.", "#f3c9a5", "#4a2e1b", 1],
  ["Ramón", 57, 33, "Barba plateada y gafas: un clásico de la casa.", "#f6d6bd", "#c9c9c9", 2],
  ["Rocío", 29, 6, "Su melena pelirroja y su energía animan cualquier sala.", "#f3c9a5", "#b5472a", 1],
  ["Takeshi", 26, 3, "Disciplinado y silencioso. Todo en su sitio.", "#f3c9a5", "#1c1c1c", 0],
  ["Rosa", 59, 32, "Cariñosa y paciente: los clientes la adoran.", "#f6d6bd", "#b8b8b8", 1],
  ["Ravi", 32, 8, "Barbudo y elegante, domina la barra y el servicio.", "#c68a5e", "#1c1c1c", 0],
  ["Bruno", 44, 17, "Veterano sereno. Calma a cualquier cliente enfadado.", "#e8b48a", "#4a4a4a", 0],
  ["Valeria", 24, 2, "Rubia, rápida y sonriente. Aprende a velocidad de vértigo.", "#f6d6bd", "#e3c06a", 1],
  ["Gerardo", 52, 26, "Canoso y de pocas palabras. Siempre llega el primero.", "#e8b48a", "#8a8a8a", 0],
  ["Naomi", 28, 5, "Amable y organizada. Sirve con una sonrisa enorme.", "#8d5a3b", "#1c1c1c", 1],
  ["Arturo", 62, 38, "De la vieja escuela: manda con la mirada y con el ejemplo.", "#f6d6bd", "#e0e0e0", 2],
  ["Irene", 30, 6, "Pelo corto y mucho ojo: detecta las mesas impacientes.", "#f3c9a5", "#1c1c1c", 0],
  ["Tomás", 21, 0, "Recién llegado, pelirrojo y pecoso. Lleno de energía.", "#f3c9a5", "#a5582a", 0],
  ["Pilar", 56, 29, "Rizos plateados y mucha mano izquierda con los clientes.", "#f3c9a5", "#9a9a9a", 1],
  ["Andrés", 37, 12, "Gafas, barba y memoria de elefante: nadie pide dos veces.", "#e8b48a", "#2b1d14", 2],
  ["Sofía", 25, 3, "Melena larga y paso ligero. Cruza el salón sin hacer ruido.", "#f3c9a5", "#2b1d14", 1],
];
const CIMG = [
  "img/camareros/0.jpg",
  "img/camareros/1.jpg",
  "img/camareros/2.jpg",
  "img/camareros/3.jpg",
  "img/camareros/4.jpg",
  "img/camareros/5.jpg",
  "img/camareros/6.jpg",
  "img/camareros/7.jpg",
  "img/camareros/8.jpg",
  "img/camareros/9.jpg",
  "img/camareros/10.jpg",
  "img/camareros/11.jpg",
  "img/camareros/12.jpg",
  "img/camareros/13.jpg",
  "img/camareros/14.jpg",
  "img/camareros/15.jpg",
  "img/camareros/16.jpg",
  "img/camareros/17.jpg",
  "img/camareros/18.jpg",
  "img/camareros/19.jpg",
  "img/camareros/20.jpg",
  "img/camareros/21.jpg",
  "img/camareros/22.jpg",
  "img/camareros/23.jpg",
  "img/camareros/24.jpg",
  "img/camareros/25.jpg",
  "img/camareros/26.jpg",
  "img/camareros/27.jpg",
  "img/camareros/28.jpg",
  "img/camareros/29.jpg",
  "img/camareros/30.jpg",
  "img/camareros/31.jpg",
  "img/camareros/32.jpg",
  "img/camareros/33.jpg",
  "img/camareros/34.jpg",
  "img/camareros/35.jpg",
  "img/camareros/36.jpg",
  "img/camareros/37.jpg",
];
const cOf = (i) => {
    const c = S.crew && S.crew[i];
    return c == null ? null : CAND[c];
  },
  cCap = (c) => 2 + Math.min(4, (Array.isArray(c) ? c[2] : c) >> 1),
  expW = (i) => {
    const c = cOf(i);
    return (c ? c[2] : 2) + Math.floor(((S.cwx || [])[i] | 0) / 15);
  },
  expC = (i) => {
    const c = kOf(i);
    return (c ? c[2] : 2) + Math.floor(((S.ccx || [])[i] | 0) / 15);
  },
  cLook = (i) => {
    const c = cOf(i);
    return c ? [c[4], c[5], c[6]] : null;
  },
  cSp = (i) => 80 + stOf("w", i)[2] * 6;
const waitCap = () => {
  let t = 0;
  for (let i = 0; i < S.waiters; i++)
    if (!(S.cwo && S.cwo[i]) && !(S.cwb && S.cwb[i])) t += capS(stOf("w", i)[2]);
  return t;
};
const cCost = (id) =>
  Math.max(
    60,
    cost("cam") +
      Math.round(stSum(stBase("w", id)) * 5.5) +
      Math.min(15, CAND[id][2]) * 10 -
      Math.max(0, CAND[id][1] - 54) * 8,
  );
const WST = [
    [3, 6, 6, 5, 5],
    [3, 6, 6, 5, 8],
    [2, 5, 8, 3, 3],
    [3, 8, 6, 7, 6],
    [2, 9, 5, 6, 9],
    [3, 6, 9, 5, 5],
    [4, 6, 6, 5, 7],
    [2, 9, 4, 6, 8],
    [3, 9, 6, 5, 7],
    [3, 7, 7, 6, 8],
    [2, 5, 6, 4, 3],
    [4, 6, 5, 4, 4],
    [3, 8, 5, 9, 8],
    [4, 5, 7, 3, 2],
    [3, 9, 6, 4, 4],
    [3, 5, 8, 6, 6],
    [2, 8, 6, 7, 9],
    [3, 6, 8, 5, 5],
    [3, 7, 6, 4, 5],
    [3, 8, 6, 5, 7],
    [2, 5, 7, 3, 4],
    [3, 8, 5, 6, 7],
    [3, 6, 8, 6, 4],
    [2, 7, 5, 6, 8],
    [3, 9, 6, 4, 8],
    [3, 5, 8, 4, 4],
    [2, 9, 4, 5, 7],
    [3, 6, 6, 8, 6],
    [4, 6, 5, 5, 6],
    [2, 7, 9, 3, 5],
    [3, 5, 6, 5, 6],
    [3, 9, 6, 6, 7],
    [2, 8, 4, 5, 9],
    [3, 7, 7, 5, 5],
    [2, 6, 7, 3, 3],
    [2, 8, 5, 5, 8],
    [3, 6, 6, 6, 7],
    [3, 6, 8, 4, 5],
  ],
  KST = [
    [3, 7, 5, 4],
    [3, 5, 8, 6],
    [2, 6, 6, 5],
    [3, 5, 9, 7],
    [3, 8, 6, 4],
    [3, 6, 8, 5],
    [2, 8, 5, 5],
    [3, 5, 9, 8],
    [3, 8, 7, 4],
    [2, 6, 7, 7],
    [4, 5, 8, 5],
    [3, 5, 6, 10],
    [2, 7, 6, 5],
    [2, 3, 10, 7],
    [3, 7, 7, 5],
    [2, 8, 4, 4],
    [3, 6, 8, 8],
    [4, 6, 7, 4],
    [3, 7, 6, 8],
    [3, 8, 5, 4],
    [2, 6, 6, 9],
    [3, 9, 7, 5],
    [3, 5, 9, 6],
    [2, 3, 10, 6],
    [2, 6, 5, 9],
    [3, 6, 7, 9],
    [3, 5, 8, 7],
    [3, 7, 5, 5],
    [3, 7, 6, 5],
    [2, 7, 4, 5],
    [2, 3, 9, 9],
    [3, 5, 10, 5],
    [2, 6, 8, 7],
    [2, 4, 9, 7],
    [3, 6, 6, 9],
    [2, 8, 5, 4],
    [2, 5, 6, 10],
    [4, 6, 8, 5],
    [3, 9, 5, 5],
    [2, 7, 5, 6],
  ];
const SL = {
  w: [
    ["Resistencia", "💪", "Turnos seguidos que aguanta antes de descansar.", "Res"],
    ["Carisma", "😊", "Don de gentes y simpatía: clientes más contentos y más fieles.", "Car"],
    ["Velocidad", "⚡", "Rapidez al moverse y servir a los clientes.", "Vel"],
    ["Coctelería y barismo", "🍸", "Rapidez al preparar las bebidas (solo eso).", "Cóc"],
    ["Venta sugestiva", "💬", "Recomienda platos, entrantes y postres: sube el ticket medio.", "Ven"],
  ],
  c: [
    ["Resistencia", "💪", "Turnos seguidos que aguanta antes de descansar.", "Res"],
    ["Velocidad", "⚡", "Rapidez al preparar el plato y al llevarlo a la encimera.", "Vel"],
    [
      "Arte culinario",
      "👨‍🍳",
      "Calidad de los platos (no postres ni bebidas). Solo cuenta en fogones.",
      "Arte",
    ],
    ["Repostería", "🧁", "Calidad de los postres. Solo cuenta si trabaja en la mesa de repostería.", "Rep"],
  ],
};
function rndStats(k, cid) {
  const L = k === "w" ? CAND : CAND2,
    e = (L[cid] && L[cid][2]) || 2,
    n = k === "w" ? 5 : 4,
    r = [Math.max(1, Math.min(10, Math.round(1 + Math.random() * 9 + (e - 8) * 0.08)))];
  for (let j = 1; j < n; j++)
    r.push(Math.max(1, Math.min(10, Math.round(1 + Math.random() * 9 + (e - 8) * 0.08))));
  return r;
}
function stBase(k, cid) {
  if (cid == null) return k === "w" ? [2, 5, 5, 5, 5] : [2, 5, 5, 5];
  if (!S.rst) S.rst = { w: {}, c: {} };
  const R = S.rst[k];
  let r = R[cid];
  if (!r) {
    const T = (k === "w" ? WST : KST)[cid],
      cr = k === "w" ? S.crew : S.ccrew;
    r = T && S.lg && (cr || []).includes(cid) ? T.slice() : rndStats(k, cid);
    R[cid] = r;
  }
  return r.slice();
}
function stOf(k, i) {
  const cr = k === "w" ? S.crew : S.ccrew,
    dl = k === "w" ? S.cwd : S.ccd,
    pn = k === "w" ? S.cwp : S.ccp,
    vi = k === "w" ? 2 : 1,
    b = stBase(k, cr[i]),
    d = (dl && dl[i]) || [];
  return b.map((v, j) => Math.max(1, Math.min(10, v + (d[j] | 0) - (j === vi && pn && pn[i] ? 1 : 0))));
}
const stSum = (a) => a[0] + a.slice(1).reduce((x, y) => x + y, 0),
  capS = (v) => 3;
function resOf(k, i) {
  const r = stOf(k, i)[0],
    a = ageOf(k, i);
  return a >= 60 ? Math.min(r, 2) : a >= 55 ? Math.min(r, 3) : r;
}
const isPas = (i) => !!(S.cca && S.cca[i]),
  pasN = () => (S.kobj || []).filter((o) => o[2] === 10).length;
function ccaFix() {
  if (S.chef < 2) S.chef = 2;
  if (S.waiters < 1) S.waiters = 1;
  ccrewPad();
  const n = S.ccrew.length;
  let cnt = 0;
  for (let i = 0; i < n; i++) {
    if (S.cca[i]) {
      if (cnt < pasN()) cnt++;
      else S.cca[i] = 0;
    }
  }
  let fg = 0;
  for (let i = 0; i < n; i++) if (!S.cca[i]) fg++;
  for (let i = n - 1; i >= 0 && fg > fogN() && cnt < pasN() && fg > 1; i--)
    if (!S.cca[i]) {
      S.cca[i] = 1;
      cnt++;
      fg--;
    }
  if (n && S.cca.slice(0, n).every((x) => x)) S.cca[0] = 0;
  if (n >= 2 && pasN() >= 1 && !S.cca.slice(0, n).some((x) => x)) S.cca[n - 1] = 1;
}
const fogCooks = () => {
  let c = 0;
  for (let i = 0; i < S.chef; i++) if (!isPas(i)) c++;
  return c;
};
function cAvg(j, pas) {
  let t = 0,
    c = 0;
  for (let i = 0; i < S.chef; i++) {
    if (S.cco && S.cco[i]) continue;
    if (isPas(i) !== pas) continue;
    t += stOf("c", i)[j];
    c++;
  }
  return c ? t / c : 0;
}
function setCca(i, v) {
  if (busy) {
    note = "No puedes cambiar de puesto durante el servicio.";
    showFicha("c" + i, "No puedes cambiar de puesto durante el servicio.");
    return;
  }
  ccaFix();
  if (v) {
    if (S.cca.reduce((a, b) => a + (b ? 1 : 0), 0) >= pasN()) {
      showFicha("c" + i, "Necesitas una mesa de repostería libre: amplía la cocina en Mejoras.");
      return;
    }
  } else if (S.cca[i] && S.cca.slice(0, S.chef).reduce((a, b) => a + (b ? 1 : 0), 0) <= 1) {
    showFicha("c" + i, "Debe haber al menos un cocinero en repostería.");
    return;
  }
  if (v && S.cca.slice(0, S.chef).filter((x, j) => !x && j !== i).length < 1) {
    showFicha("c" + i, "Debe quedar al menos un cocinero en fogones.");
    return;
  }
  S.cca[i] = v ? 1 : 0;
  if (!v && fogCooks() > fogN()) {
    S.cca[i] = 1;
    showFicha("c" + i, "No hay fogones libres: amplía la cocina.");
    return;
  }
  S.ccz[i] = 0;
  save();
  draw();
  showFicha("c" + i);
}
function setRestC(i) {
  if (busy) {
    showFicha("c" + i, "No puedes cambiar de puesto durante el servicio.");
    return;
  }
  ccaFix();
  ccrewPad();
  if (S.ccz[i]) {
    S.ccz[i] = 0;
    save();
    draw();
    showFicha("c" + i);
    return;
  }
  const p = isPas(i);
  let o = 0;
  for (let j = 0; j < S.chef; j++) if (j !== i && isPas(j) === p && !S.ccz[j]) o++;
  if (!o) {
    showFicha(
      "c" + i,
      p
        ? "Debe quedar al menos un cocinero trabajando en repostería."
        : "Debe quedar al menos un cocinero trabajando en fogones.",
    );
    return;
  }
  S.ccz[i] = 1;
  save();
  draw();
  showFicha("c" + i);
}
function setW(i, m) {
  if (busy) {
    showFicha("w" + i, "No puedes cambiar de puesto durante el servicio.");
    return;
  }
  crewPad();
  const z = S.cwz,
    b = S.cwb;
  let fl = 0;
  for (let j = 0; j < S.waiters; j++) if (j !== i && !z[j] && !b[j]) fl++;
  if (m === 0) {
    z[i] = 0;
    b[i] = 0;
  } else if (m === 1) {
    if (!S.bars.length) {
      showFicha("w" + i, "Necesitas una barra de bebidas en el local.");
      return;
    }
    for (let j = 0; j < S.waiters; j++)
      if (j !== i && b[j]) {
        showFicha("w" + i, "Ya hay un camarero en la barra: solo puede haber uno.");
        return;
      }
    if (!fl) {
      showFicha("w" + i, "Debe quedar al menos un camarero atendiendo las mesas.");
      return;
    }
    z[i] = 0;
    b[i] = 1;
  } else {
    if (!fl && !z[i] && !b[i]) {
      showFicha("w" + i, "Debe quedar al menos un camarero atendiendo las mesas.");
      return;
    }
    z[i] = 1;
    b[i] = 0;
  }
  save();
  draw();
  showFicha("w" + i);
}
function puestoW(i, msg) {
  crewPad();
  const z = !!S.cwz[i],
    b = !!S.cwb[i],
    sb = (on) => (on ? "outline:2px solid var(--ac)" : "opacity:.5");
  return `<div style="margin:10px 0 4px"><b>Puesto</b></div><div class="row" style="justify-content:flex-start;gap:8px;flex-wrap:wrap"><button class="s" style="${sb(!z && !b)}" onclick="setW(${i},0)">🤵 Camarero</button><button class="s" style="${sb(b)}" onclick="setW(${i},1)">🍸 Barra</button><button class="s" style="${sb(z)}" onclick="setW(${i},2)">😴 Descansar</button></div><div class="mut sm">${z ? "Descansa: no aparece en el local mientras no le asignes un puesto." : b ? "Atiende la barra: prepara las bebidas con su Coctelería y no sirve las mesas. Solo uno a la vez." : "Atiende las mesas del local."}</div>${msg && !String(msg).startsWith("🎓") ? `<div class="mut sm bad">${msg}</div>` : ""}`;
}
function workAvg(k, j) {
  const n = k === "w" ? S.waiters : S.chef,
    off = k === "w" ? S.cwo : S.cco;
  if (k === "w" && j === 3 && S.cwb)
    for (let i = 0; i < n; i++)
      if (S.cwb[i] && !(off && off[i]) && !(S.cwz && S.cwz[i])) return stOf("w", i)[3];
  let t = 0,
    c = 0;
  for (let i = 0; i < n; i++) {
    if (off && off[i]) continue;
    t += stOf(k, i)[j];
    c++;
  }
  return c ? t / c : 0;
}
const SCOL = {
  w: ["#e03131", "#1c7ed6", "#e8a800", "#f76707", "#2f9e44"],
  c: ["#e03131", "#e8a800", "#f76707", "#7048e8"],
};
const stChips = (k, a, col) =>
  `<div class="mut">${SL[k].map((l, j) => (col ? `<span style="color:${SCOL[k][j]}">${l[3]} <b>${a[j]}</b></span>` : l[3] + " <b>" + a[j] + "</b>")).join(" · ")}</div>`;
const stRow = (k, j, v) => {
  const L = SL[k][j],
    mx = 10;
  return `<div style="margin:6px 0"><div class="row" style="margin:0"><span>${L[1]} ${L[0]}</span><b>${j === 0 ? v + " turno" + (v > 1 ? "s" : "") : v + "/10"}</b></div><div class="sbar">${Array.from({ length: mx }, (_, q) => `<i class="${q < v ? "on" : ""}" ${q < v ? `style="background:${SCOL[k][j]}"` : ""}></i>`).join("")}</div><div class="mut sm">${L[2]}</div></div>`;
};
function padX(k) {
  const cr = k === "w" ? S.crew : S.ccrew;
  (k === "w"
    ? ["cwo", "cwt", "cwd", "cwf", "cwg", "cwi", "cwp", "cwk", "cwz", "cwb"]
    : ["cco", "cct", "ccd", "cca", "ccf", "ccg", "cci", "ccp", "cck", "ccz"]
  ).forEach((q) => {
    if (!Array.isArray(S[q])) S[q] = [];
    while (S[q].length < cr.length) S[q].push(q === "cwd" || q === "ccd" ? [] : 0);
  });
}
function restTick() {
  crewPad();
  ccrewPad();
  const m = [];
  [
    ["w", S.crew, S.cwo, S.cwt, "Camarero", CAND],
    ["c", S.ccrew, S.cco, S.cct, "Cocinero", CAND2],
  ].forEach(([k, cr, off, tn, role, L]) => {
    const n = cr.length,
      nm = [];
    const zz = k === "w" ? S.cwz : S.ccz;
    for (let i = 0; i < n; i++) {
      const res = resOf(k, i);
      if (zz[i]) {
        off[i] = 1;
        tn[i] = 0;
      } else if ((tn[i] | 0) >= res) {
        off[i] = 1;
        tn[i] = 0;
      } else off[i] = 0;
    }
    if (n && off.slice(0, n).every((x) => x)) {
      let b = -1;
      for (let i = 0; i < n; i++) if (!zz[i] && (b < 0 || resOf(k, i) > resOf(k, b))) b = i;
      if (b >= 0) off[b] = 0;
    }
    TRD[k] = Array.from({ length: n }, (_, i) => !zz[i] && !!off[i]);
    for (let i = 0; i < n; i++) {
      if (!off[i]) tn[i] = (tn[i] | 0) + 1;
      else nm.push(cr[i] == null ? role + " " + (i + 1) : L[cr[i]][0]);
    }
    if (nm.length) m.push("😴 Descansan este turno: " + nm.join(", "));
  });
  return m;
}
function crewGrow() {
  crewPad();
  ccrewPad();
  const m = [];
  [
    ["w", S.crew, S.cwx, CAND, "Camarero", S.cwo, S.cwd],
    ["c", S.ccrew, S.ccx, CAND2, "Cocinero", S.cco, S.ccd],
  ].forEach(([k, cr, xs, L, role, off, dl]) => {
    xs.forEach((n, i) => {
      if (off[i]) return;
      xs[i] = n + 1;
      if ((n + 1) % 15 === 0) {
        const c = cr[i] == null ? null : L[cr[i]],
          nm = c ? c[0] : role + " " + (i + 1),
          st = stOf(k, i),
          cand = st.map((v, j) => j).filter((j) => st[j] < 10),
          e = (c ? c[2] : 2) + (n + 1) / 15;
        if (cand.length) {
          const j = rnd(cand);
          if (!dl[i]) dl[i] = [];
          dl[i][j] = (dl[i][j] | 0) + 1;
          m.push(
            "🎓 " +
              nm +
              " ya tiene " +
              e +
              " años de experiencia y mejora su " +
              SL[k][j][0].toLowerCase() +
              " (" +
              st[j] +
              " → " +
              (st[j] + 1) +
              ")",
          );
        } else m.push("🎓 " + nm + " ya tiene " + e + " años de experiencia");
      }
    });
  });
  return m;
}
const FMJ = { w: [3, 4], c: [2, 3] },
  fmCost = (k, i, j) => 60 + 25 * stOf(k, i)[j];
function fmOk(k, i) {
  const cr = k === "w" ? S.crew : S.ccrew,
    ff = k === "w" ? S.cwf : S.ccf;
  let n = 0;
  for (let q = 0; q < cr.length; q++)
    if (q !== i && !(ff[q] | 0) && (k === "w" || isPas(q) === isPas(i))) n++;
  return n > 0;
}
function fmBlock(k, i, msg) {
  padX(k);
  const ff = k === "w" ? S.cwf : S.ccf,
    gg = k === "w" ? S.cwg : S.ccg,
    cur = (ff[i] | 0) - 1,
    m = msg && String(msg).startsWith("🎓") ? `<div class="mut sm bad">${msg}</div>` : "";
  if (cur >= 0)
    return `<div style="margin:12px 0 4px"><b>🎓 Formación</b></div><div class="mut sm">Ya tiene pagada una formación de <b>${SL[k][cur][0].toLowerCase()}</b>: en el próximo servicio no trabajará y al terminar subirá 1 punto.</div><button class="s" style="margin-top:6px" onclick="fmCancel('${k}',${i})">Cancelar y recuperar ${fmCost(k, i, cur)} 🪙</button>${m}`;
  return `<div style="margin:12px 0 4px"><b>🎓 Formación</b></div><div class="mut sm">Paga un curso: sube 1 punto en la estadística elegida, pero esa persona no trabajará durante el próximo servicio. Solo puede hacer una formación de cada tipo (2 en total).</div><div class="row" style="justify-content:flex-start;gap:8px;flex-wrap:wrap;margin-top:6px">${FMJ[
    k
  ]
    .map((j) => {
      const v = stOf(k, i)[j],
        c = fmCost(k, i, j),
        dn = (gg[i] | 0) & (1 << j);
      return `<button class="s" ${dn || v >= 10 || S.coins < c ? "disabled" : ""} onclick="fmPay('${k}',${i},${j})">${dn ? "✔ Formación de " + SL[k][j][0].toLowerCase() + " hecha" : "Pagar formación de " + SL[k][j][0].toLowerCase() + " · " + (v >= 10 ? "máx." : c + " 🪙")}</button>`;
    })
    .join("")}</div>${m}`;
}
function fmPay(k, i, j) {
  padX(k);
  const ff = k === "w" ? S.cwf : S.ccf,
    gg = k === "w" ? S.cwg : S.ccg,
    c = fmCost(k, i, j);
  if (ff[i] | 0 || (gg[i] | 0) & (1 << j) || S.coins < c || stOf(k, i)[j] >= 10) return;
  if (!fmOk(k, i)) {
    showFicha(k + i, "🎓 No puede ir a formación: no quedaría nadie más en su puesto.");
    return;
  }
  S.coins -= c;
  ff[i] = j + 1;
  gg[i] = gg[i] | 0 | (1 << j);
  save();
  draw();
  showFicha(k + i);
}
function fmCancel(k, i) {
  padX(k);
  const ff = k === "w" ? S.cwf : S.ccf,
    gg = k === "w" ? S.cwg : S.ccg,
    j = (ff[i] | 0) - 1;
  if (j < 0) return;
  S.coins += fmCost(k, i, j);
  ff[i] = 0;
  gg[i] = (gg[i] | 0) & ~(1 << j);
  save();
  draw();
  showFicha(k + i);
}
function puesto(i, msg) {
  ccaFix();
  const p = isPas(i),
    zc = !!(S.ccz && S.ccz[i]);
  return `<div style="margin:10px 0 4px"><b>Puesto</b></div><div class="row" style="justify-content:flex-start;gap:8px;flex-wrap:wrap"><button class="s" style="${p || zc ? "opacity:.5" : "outline:2px solid var(--ac)"}" onclick="setCca(${i},0)">🔥 Fogones</button><button class="s" style="${!p || zc ? "opacity:.5" : "outline:2px solid var(--ac)"}" onclick="setCca(${i},1)">🧁 Repostería</button><button class="s" style="${zc ? "outline:2px solid var(--ac)" : "opacity:.5"}" onclick="setRestC(${i})">😴 Descansar</button></div><div class="mut sm">${zc ? "Descansa: no aparece en el local mientras no le asignes un puesto. " : ""}${p ? "Prepara los postres en la mesa de repostería: su Repostería es la calidad del postre." : "Cocina los platos en los fogones: su Arte culinario es la calidad de los platos."} Mesas de repostería: ${pasN()}.</div>${msg && !String(msg).startsWith("🎓") ? `<div class="mut sm bad">${msg}</div>` : ""}`;
}
function rosterTag(k, i) {
  const z = (k === "w" ? S.cwz : S.ccz) || [],
    b = S.cwb || [],
    off = (k === "w" ? S.cwo : S.cco) || [],
    tn = ((k === "w" ? S.cwt : S.cct) || [])[i] | 0,
    res = resOf(k, i),
    left = Math.max(0, res - tn);
  const pu = z[i]
    ? "😴 Descansando"
    : k === "w"
      ? b[i]
        ? "🍸 En la barra"
        : "🤵 Atiende mesas"
      : isPas(i)
        ? "🧁 Repostería"
        : "🔥 Fogones";
  const tr = off[i] ? "descansa este turno" : left + " turno" + (left === 1 ? "" : "s") + " más";
  return z[i] ? pu + " · no trabaja" : pu + " · " + (off[i] ? tr : "quedan " + tr);
}
let fireSel = null,
  fireMsg = "";
const fireCost = (k, i) => {
  const cr = k === "w" ? S.crew : S.ccrew,
    t = S.trl && S.trl[k + cr[i]];
  if (t != null && ((S.ms && S.ms.tot.svc) | 0) - t < 5) return 0;
  return Math.min(600, 80 + 5 * ((k === "w" ? S.cwx : S.ccx)[i] | 0));
};
function fireBlock(k, i) {
  const id = k + i,
    c = fireCost(k, i),
    cr = k === "w" ? S.crew : S.ccrew,
    L = k === "w" ? CAND : CAND2,
    nm = cr[i] != null ? L[cr[i]][0] : k === "w" ? "este camarero" : "este cocinero",
    er = fireMsg ? `<div class="mut sm bad">${fireMsg}</div>` : "";
  if (fireSel !== id)
    return `${er}<button class="s" style="margin-top:10px;width:100%;border-color:#c0392b;color:#c0392b" onclick="fireSel='${id}';fireMsg='';showFicha('${id}')">🚪 Despedir</button>`;
  return `<div class="card" style="border-color:#c0392b;margin:10px 0 0;text-align:left"><b>¿Seguro que quieres despedir a ${nm}?</b><div class="mut sm">Tendrás que pagar una indemnización de <b>${c} 🪙</b> ${c === 0 ? "(está a prueba: sin coste)" : "(80 + 5 por servicio trabajado, máx. 600)"}. No se puede deshacer.</div>${er}<div class="row" style="gap:8px;margin-top:8px"><button class="s" style="background:#c0392b;color:#fff" onclick="fireDo('${id}')">✔ Confirmar y pagar ${c} 🪙</button><button class="s" onclick="fireSel=null;fireMsg='';showFicha('${id}')">Cancelar</button></div></div>`;
}
function fireDo(id) {
  const k = id[0],
    i = +id.slice(1);
  if (fireSel !== id) return;
  const err = (m) => {
    fireMsg = m;
    showFicha(id);
  };
  if (busy) return err("No puedes despedir durante el servicio.");
  if (k === "w") crewPad();
  else {
    ccrewPad();
    ccaFix();
  }
  const cr = k === "w" ? S.crew : S.ccrew,
    c = fireCost(k, i);
  if (i >= cr.length) return;
  if (S.coins < c) return err("No tienes monedas para la indemnización (" + c + " 🪙).");
  if (k === "w") {
    if (S.waiters <= 1) return err("Debe quedar al menos un camarero.");
    if (!S.cwz[i] && !S.cwb[i]) {
      let o = 0;
      for (let j = 0; j < S.waiters; j++) if (j !== i && !S.cwz[j] && !S.cwb[j]) o++;
      if (!o) return err("Debe quedar al menos un camarero atendiendo las mesas.");
    }
  } else {
    const p = isPas(i);
    let o = 0;
    for (let j = 0; j < S.chef; j++) if (j !== i && isPas(j) === p) o++;
    if (!o)
      return err(
        p
          ? "Debe quedar al menos un cocinero en repostería."
          : "Debe quedar al menos un cocinero en fogones.",
      );
    if (S.chef <= 2) return err("Debe haber al menos 2 cocineros.");
  }
  S.coins -= c;
  const cid = cr[i];
  (k === "w"
    ? [S.crew, S.cwx, S.cwh, S.cwo, S.cwt, S.cwd, S.cwf, S.cwg, S.cwi, S.cwp, S.cwk, S.cwz, S.cwb]
    : [S.ccrew, S.ccx, S.cch, S.cco, S.cct, S.ccd, S.cca, S.ccf, S.ccg, S.cci, S.ccp, S.cck, S.ccz]
  ).forEach((a) => a && a.splice(i, 1));
  if (k === "w") S.waiters--;
  else S.chef--;
  if (S.bj && S.bj.k === k && S.bj.cid === cid) S.bj = null;
  WS.forEach((w) => w.el.remove());
  WS.length = 0;
  CKS.forEach((w) => w.el.remove());
  CKS.length = 0;
  fireSel = null;
  fireMsg = "";
  ccaFix();
  save();
  draw();
  const o = document.getElementById("fi");
  if (o) o.style.display = "none";
  drawTop();
}
function showFicha(id, msg) {
  const k = id[0],
    i = +id.slice(1);
  if (k === "w") crewPad();
  else ccrewPad();
  const cr = k === "w" ? S.crew : S.ccrew,
    L = k === "w" ? CAND : CAND2,
    xs = k === "w" ? S.cwx : S.ccx,
    off = k === "w" ? S.cwo : S.cco,
    tn = k === "w" ? S.cwt : S.cct;
  if (i >= cr.length) return;
  const cid = cr[i],
    c = cid == null ? null : L[cid],
    n = xs[i] | 0,
    exp = (c ? c[2] : 2) + Math.floor(n / 15),
    role = k === "w" ? "Camarero" : "Cocinero",
    st = stOf(k, i);
  const pic = c
    ? (k === "w" ? cImg(cid) : kImg(cid)).replace(
        '<img class="av"',
        '<img class="av" style="width:84px;height:106px"',
      )
    : `<div class="av" style="display:flex;align-items:center;justify-content:center;font-size:40px;width:84px;height:106px">${k === "w" ? "🤵" : "👨‍🍳"}</div>`;
  let o = document.getElementById("fi");
  if (!o) {
    o = document.createElement("div");
    o.id = "fi";
    o.className = "ov";
    o.onclick = (e) => {
      if (e.target === o) o.style.display = "none";
    };
    document.body.appendChild(o);
  }
  o.innerHTML = `<div class="box hoja">${btnCerrar("fi")}<div class="row" style="gap:12px;align-items:flex-start;justify-content:flex-start">${pic}<div><h2 style="margin:0">${c ? c[0] : role + " " + (i + 1)}</h2><div class="mut">${role}, ${ageOf(k, i)} años</div><div class="mut">${off[i] || (k === "w" ? S.cwz : S.ccz)[i] ? "😴 Descansa en este turno" : "💼 Trabajando"} · turnos seguidos ${tn[i] | 0}/${resOf(k, i)}</div></div></div>${c ? `<p class="mut" style="margin:10px 0">${c[3]}</p>` : ""}
 <div style="margin:8px 0 2px"><b>Estadísticas</b></div>${st.map((v, j) => stRow(k, j, j === 0 ? resOf(k, i) : v)).join("")}${resOf(k, i) < st[0] ? `<div class="mut sm bad">Por su edad solo aguanta ${resOf(k, i)} turno${resOf(k, i) > 1 ? "s" : ""} seguido${resOf(k, i) > 1 ? "s" : ""} (sin la edad: ${st[0]}).</div>` : ""}${(k === "w" ? S.cwp : S.ccp) && (k === "w" ? S.cwp : S.ccp)[i] ? `<div class="mut sm bad">⚠️ Lleva tiempo sin trabajar y tiene −1 de velocidad. Se recupera trabajando 2 turnos seguidos.</div>` : ""}${k === "c" ? puesto(i, msg) : puestoW(i, msg)}
 <div class="row"><span>Edad</span><b>${ageOf(k, i)} años</b></div><div class="mut sm" style="margin-bottom:4px">Cumple 1 año cada lunes. Se jubila a los 65 (en ${Math.max(0, 65 - ageOf(k, i))} semana${65 - ageOf(k, i) === 1 ? "" : "s"}).</div><div class="row"><span>Sueldo semanal</span><b>${wage(k, i)} 🪙</b></div>${((k === "w" ? S.cwz : S.ccz) || [])[i] ? `<div class="mut sm">Descansando cobra el ${Math.round(wageF(k, i) * 100)}% (${wageNow(k, i)} 🪙 a la semana).</div>` : ""}<div class="row"><span>Experiencia</span><b>${exp} año${exp === 1 ? "" : "s"}</b></div><div class="row"><span>Servicios trabajados</span><b>${n}</b></div>
 <div class="mut" style="margin-top:8px">Siguiente año de experiencia: ${n % 15}/15 servicios</div><div style="height:8px;background:var(--bd);border-radius:6px;overflow:hidden;margin:4px 0 8px"><div style="height:100%;width:${((n % 15) * 100) / 15}%;background:var(--ac)"></div></div>
 <div class="mut sm">Cada año de experiencia mejora una de sus estadísticas al azar.</div>${fmBlock(k, i, msg)}${fireBlock(k, i)}<button class="big" style="margin-top:12px" onclick="document.getElementById('fi').style.display='none'">Cerrar</button></div>`;
  o.style.display = "flex";
}
const candHide = { w: 0, c: 0 };
const mon = (d) => Math.floor((d + 6) / 7);
function ageOf(k, i) {
  const cr = k === "w" ? S.crew : S.ccrew,
    hs = k === "w" ? S.cwh : S.cch,
    c = cr[i] == null ? null : (k === "w" ? CAND : CAND2)[cr[i]];
  return (c ? c[1] : 30) + (mon(S.day) - mon(hs[i]));
}
function ageTick() {
  crewPad();
  ccrewPad();
  const m = [];
  [
    ["w", S.crew, S.cwx, S.cwh, CAND, "Camarero"],
    ["c", S.ccrew, S.ccx, S.cch, CAND2, "Cocinero"],
  ].forEach(([k, cr, xs, hs, L, role]) => {
    for (let i = cr.length - 1; i >= 0; i--) {
      const c = cr[i] == null ? null : L[cr[i]],
        age = ageOf(k, i),
        nm = c ? c[0] : role + " " + (i + 1);
      if (age >= 65) {
        if (cr.length > 1) {
          if (cr[i] != null) {
            const key = k === "w" ? "retw" : "retc";
            if (!S[key]) S[key] = [];
            S[key].push(cr[i]);
          }
          cr.splice(i, 1);
          xs.splice(i, 1);
          hs.splice(i, 1);
          (k === "w"
            ? [S.cwo, S.cwt, S.cwd, S.cwf, S.cwg, S.cwi, S.cwp, S.cwk, S.cwz, S.cwb]
            : [S.cco, S.cct, S.ccd, S.cca, S.ccf, S.ccg, S.cci, S.ccp, S.cck, S.ccz]
          ).forEach((a) => a && a.splice(i, 1));
          if (k === "w") S.waiters--;
          else S.chef--;
          m.push("🎉 " + nm + " se ha jubilado a los 65 años. ¡Gracias por tantos años de servicio!");
        } else m.push("⏳ " + nm + " debería jubilarse, pero seguirá hasta que contrates un sustituto");
      } else if (age === 64 && S.day % 7 === 1)
        m.push("⏳ " + nm + " cumple 64 años: se jubila dentro de una semana");
    }
  });
  if (m.some((x) => x[0] === "🎉")) {
    WS.forEach((w) => w.el.remove());
    WS.length = 0;
    CKS.forEach((w) => w.el.remove());
    CKS.length = 0;
  }
  return m;
}
function legacy(cr, hs, ret, L) {
  for (let i = 0; i < cr.length; i++)
    if (cr[i] == null) {
      const ok = L.map((_, j) => j).filter(
        (j) => !cr.includes(j) && !(ret || []).includes(j) && L[j][2] <= 6 && L[j][1] <= 40,
      );
      if (ok.length) {
        cr[i] = rnd(ok);
        hs[i] = S.day;
        if (S.day <= 1 && !S.last && !(S.xp > 0)) {
          const k = L === CAND ? "w" : "c";
          if (!S.rst) S.rst = { w: {}, c: {} };
          const r = rndStats(k, cr[i]);
          r[0] = 8 + Math.floor(Math.random() * 3);
          S.rst[k][cr[i]] = r;
        }
      }
    }
}
function crewPad() {
  if (!Array.isArray(S.crew)) S.crew = [];
  if (!Array.isArray(S.cwx)) S.cwx = [];
  while (S.crew.length < S.waiters) S.crew.push(null);
  while (S.cwx.length < S.crew.length) S.cwx.push(0);
  if (!Array.isArray(S.cwh)) S.cwh = [];
  while (S.cwh.length < S.crew.length) S.cwh.push(S.day);
  legacy(S.crew, S.cwh, S.retw, CAND);
  padX("w");
}
function search() {
  if (S.waiters >= 10) return;
  const l = lvl();
  if (S.cand && S.cand.l === l) {
    candHide.w = !candHide.w;
    draw();
    return;
  }
  candHide.w = 0;
  crewPad();
  const pool = CAND.map((_, i) => i).filter((i) => !S.crew.includes(i) && !(S.retw || []).includes(i)),
    ids = [];
  while (ids.length < 5 && pool.length) ids.push(pool.splice((Math.random() * pool.length) | 0, 1)[0]);
  S.cand = { l, ids };
  save();
  draw();
}
function hire(id) {
  if (!S.cand || S.cand.l !== lvl() || !S.cand.ids.includes(id) || S.waiters >= 10) return;
  const c = cCost(id);
  if (S.coins < c) return;
  S.coins -= c;
  crewPad();
  S.waiters++;
  S.crew.push(id);
  crewPad();
  S.cand.ids = S.cand.ids.filter((x) => x !== id);
  note = "";
  save();
  draw();
}
const cImg = (id) => `<img class="av" alt="" src="${CIMG[id]}">`;
function camPanel() {
  const has = S.cand && S.cand.l === lvl(),
    max = S.waiters >= 10;
  crewPad();
  const team = S.crew
    .map((id, i) => (id == null ? "" : `<div class="tm">${cImg(id)}<small>${CAND[id][0]}</small></div>`))
    .join("");
  let body = "";
  if (!max && !has)
    body = `<div class="mut" style="margin-top:6px">Pulsa Buscar para ver 5 candidatos al azar. Podrás volver a buscar cuando subas de nivel (ahora: nivel ${lvl()}).</div>`;
  else if (!max && !(S.cand.ids || []).length)
    body = `<div class="mut" style="margin-top:6px">Ya no quedan candidatos de este nivel. Sube de nivel para buscar otros.</div>`;
  else if (!max)
    body = S.cand.ids
      .map((id) => {
        const c = CAND[id],
          pr = cCost(id);
        return `<div class="row cd">${cImg(id)}<div style="flex:1;min-width:0"><b>${c[0]}</b>, ${c[1]} años<div class="mut">${c[2] ? c[2] + " año" + (c[2] > 1 ? "s" : "") + " de experiencia" : "Sin experiencia"}</div><div class="mut">${c[3]}</div>${stChips("w", stBase("w", id))}</div><button class="s" onclick="hire(${id})" ${S.coins < pr ? "disabled" : ""}>${pr} 🪙</button></div>`;
      })
      .join("");
  if (has && candHide.w) body = "";
  return `<div class="card"><div class="row"><div><b>🧑‍🍳 Camarero nuevo</b><div class="mut">Tienes ${S.waiters}/10. Compara sus estadísticas: cada uno es bueno en algo distinto.</div></div>${max ? `<span class="ok">Máximo</span>` : `<button class="s" onclick="search()">${has ? (candHide.w ? "▼ Ver" : "▲ Ocultar") : "🔍 Buscar"}</button>`}</div>${team ? `<div class="team">${team}</div>` : ""}${body}</div>`;
}
const CAND2 = [
  [
    "Mateo",
    24,
    2,
    "Sonriente y con ganas de aprender. Pica verdura a toda velocidad.",
    "#e8b48a",
    "#2b1d14",
    0,
  ],
  ["Camila", 29, 6, "Trenza larga y mano firme: sus fondos son pura paciencia.", "#e8b48a", "#2b1d14", 1],
  ["Fionn", 22, 1, "Pelirrojo e inquieto. Con las gafas empañadas sigue cocinando.", "#f6d6bd", "#b5472a", 2],
  ["Imani", 33, 9, "Su cocina huele a hogar: especias, calma y mucho sabor.", "#5c3a24", "#1c1c1c", 1],
  ["Hiro", 26, 4, "Preciso y silencioso. Corta con exactitud de cirujano.", "#f3c9a5", "#1c1c1c", 0],
  [
    "Greta",
    31,
    7,
    "Rubia y serena. Cocina con los brazos cruzados y los ojos bien abiertos.",
    "#f6d6bd",
    "#c9a05a",
    1,
  ],
  ["Joaquín", 27, 3, "Pelo rebelde y buen humor. Improvisa platos que funcionan.", "#e8b48a", "#2b1d14", 0],
  ["Sara", 34, 10, "Perfeccionista y de gafas. Anota cada receta en su cuaderno.", "#f3c9a5", "#5a3a22", 3],
  ["Darío", 28, 5, "Alegre y rápido. Cocina bailando entre los fogones.", "#c68a5e", "#2b1d14", 0],
  ["Yuna", 25, 3, "Mechas de colores y creatividad en cada plato.", "#f3c9a5", "#2b1d14", 1],
  ["Karim", 38, 13, "Barbudo y generoso. Sus guisos son de los que repiten.", "#c68a5e", "#2b1d14", 0],
  ["Brenda", 30, 6, "Rizos de fuego y carácter fuerte. Reina de los postres.", "#f3c9a5", "#a5441f", 1],
  ["Tao", 23, 2, "Gafas, método y mucha curiosidad. Todo lo cronometra.", "#f3c9a5", "#1c1c1c", 2],
  [
    "Bartolomé",
    58,
    34,
    "Barba gris y mucha cocina a la espalda. Sabe cuándo está en su punto.",
    "#f6d6bd",
    "#9a9a9a",
    0,
  ],
  ["Anaya", 26, 4, "Coleta y buen oído: escucha cómo suena la sartén.", "#c68a5e", "#3a2417", 1],
  ["Leif", 21, 0, "Rubio y recién salido de la escuela. Trabaja sin parar.", "#f6d6bd", "#d9b05f", 0],
  ["Mika", 32, 8, "Pelo en bob y sonrisa permanente. Presentación impecable.", "#f3c9a5", "#1c1c1c", 0],
  ["Moussa", 29, 6, "Sereno y fuerte. Aguanta turnos larguísimos en los fogones.", "#5c3a24", "#1c1c1c", 0],
  [
    "Paula",
    27,
    4,
    "Moño alto y manos ágiles. Pasa de la masa al emplatado sin pestañear.",
    "#f3c9a5",
    "#7a4a22",
    1,
  ],
  ["Rubén", 24, 2, "Rizos oscuros y mucha energía. Siempre pide otra tarea.", "#e8b48a", "#2b1d14", 0],
  ["Zara", 26, 3, "Rizos al viento y creatividad sin límites con el chocolate.", "#5c3a24", "#1c1c1c", 1],
  ["Kenji", 30, 7, "Disciplinado y rápido. Su mesa de trabajo siempre reluce.", "#f3c9a5", "#1c1c1c", 0],
  ["Marina", 35, 11, "Melena larga y gafas. Maestra de las salsas.", "#f6d6bd", "#7a4a22", 3],
  ["Ambrosio", 61, 40, "Veterano de mil banquetes. Su sopa cura cualquier mal.", "#f6d6bd", "#c9c9c9", 0],
  ["Gael", 25, 3, "Pelo rizado y manos de mantequilla para la masa.", "#e8b48a", "#8a5a2b", 0],
  ["Noa", 28, 5, "Pelo corto y mucha precisión. Pesa todo al gramo.", "#f3c9a5", "#1c1c1c", 0],
  [
    "Valentina",
    31,
    8,
    "Larga melena roja y brazos cruzados: no admite ni un fallo.",
    "#f3c9a5",
    "#a5441f",
    1,
  ],
  ["Adrián", 23, 1, "Tranquilo y aplicado. Aprende rápido del jefe.", "#f3c9a5", "#6b4423", 0],
  ["Idris", 27, 4, "Alegre y trabajador. Le encanta el fuego vivo.", "#5c3a24", "#1c1c1c", 0],
  ["Eric", 20, 0, "Rubio y tímido. Un diamante en bruto.", "#f6d6bd", "#d9c07a", 0],
  ["Venancio", 59, 31, "Gafas y paciencia: el rey del horno lento.", "#f6d6bd", "#b8b8b8", 2],
  ["Tariq", 36, 12, "Barba cuidada y sazón perfecta. Sus arroces son leyenda.", "#5c3a24", "#1c1c1c", 0],
  ["Aiko", 26, 3, "Bob negro y sonrisa tímida. Cuida cada detalle del plato.", "#f3c9a5", "#1c1c1c", 0],
  ["Teodoro", 56, 28, "Canoso y barbudo. Tiene un truco para cada guiso.", "#f6d6bd", "#9a9a9a", 0],
  ["Lola", 29, 6, "Coleta, buen humor y mucha mano para las tartas.", "#f3c9a5", "#6b4423", 1],
  ["Iker", 22, 1, "Joven y despierto. Corta, pela y sonríe.", "#f3c9a5", "#6b4423", 0],
  ["Alma", 24, 2, "Rubia y delicada. Sus postres son pequeñas obras de arte.", "#f6d6bd", "#d9b05f", 1],
  ["Baltasar", 40, 15, "Barba negra y firmeza de capitán en los fogones.", "#5c3a24", "#1c1c1c", 0],
  ["Nelson", 25, 3, "Rizos y ritmo. Cocina siguiendo la música.", "#e8b48a", "#2b1d14", 0],
  ["Óscar", 22, 1, "Pelirrojo y curioso: prueba todo lo que cocina.", "#f3c9a5", "#a5582a", 0],
];
const CIMG2 = [
  "img/cocineros/0.jpg",
  "img/cocineros/1.jpg",
  "img/cocineros/2.jpg",
  "img/cocineros/3.jpg",
  "img/cocineros/4.jpg",
  "img/cocineros/5.jpg",
  "img/cocineros/6.jpg",
  "img/cocineros/7.jpg",
  "img/cocineros/8.jpg",
  "img/cocineros/9.jpg",
  "img/cocineros/10.jpg",
  "img/cocineros/11.jpg",
  "img/cocineros/12.jpg",
  "img/cocineros/13.jpg",
  "img/cocineros/14.jpg",
  "img/cocineros/15.jpg",
  "img/cocineros/16.jpg",
  "img/cocineros/17.jpg",
  "img/cocineros/18.jpg",
  "img/cocineros/19.jpg",
  "img/cocineros/20.jpg",
  "img/cocineros/21.jpg",
  "img/cocineros/22.jpg",
  "img/cocineros/23.jpg",
  "img/cocineros/24.jpg",
  "img/cocineros/25.jpg",
  "img/cocineros/26.jpg",
  "img/cocineros/27.jpg",
  "img/cocineros/28.jpg",
  "img/cocineros/29.jpg",
  "img/cocineros/30.jpg",
  "img/cocineros/31.jpg",
  "img/cocineros/32.jpg",
  "img/cocineros/33.jpg",
  "img/cocineros/34.jpg",
  "img/cocineros/35.jpg",
  "img/cocineros/36.jpg",
  "img/cocineros/37.jpg",
  "img/cocineros/38.jpg",
  "img/cocineros/39.jpg",
];
const kOf = (i) => {
    const c = S.ccrew && S.ccrew[i];
    return c == null ? null : CAND2[c];
  },
  kLook = (i) => {
    const c = kOf(i);
    return c ? [c[4], c[5], c[6]] : null;
  },
  kSp = (i) => 60 + stOf("c", i)[1] * 6,
  kTime = (i) => 1.45 - 0.085 * stOf("c", i)[1];
const chefCap = () => {
  let t = 0;
  for (let i = 0; i < S.chef; i++) if (!(S.cco && S.cco[i])) t += capS(stOf("c", i)[1]);
  return t;
};
const kCost = (id) =>
  Math.max(
    60,
    cost("chef") +
      Math.round(stSum(stBase("c", id)) * 5.5) +
      Math.min(15, CAND2[id][2]) * 10 -
      Math.max(0, CAND2[id][1] - 54) * 8,
  );
function recAvg() {
  return cAvg(2, false);
}
function desAvg() {
  return cAvg(3, true);
}
function desQ() {
  return Math.min(10, Math.round(desAvg()));
}
function recQ() {
  return Math.min(10, Math.round(recAvg()));
}

function ccrewPad() {
  if (!Array.isArray(S.ccrew)) S.ccrew = [];
  if (!Array.isArray(S.ccx)) S.ccx = [];
  while (S.ccrew.length < S.chef) S.ccrew.push(null);
  while (S.ccx.length < S.ccrew.length) S.ccx.push(0);
  if (!Array.isArray(S.cch)) S.cch = [];
  while (S.cch.length < S.ccrew.length) S.cch.push(S.day);
  legacy(S.ccrew, S.cch, S.retc, CAND2);
  padX("c");
}
function csearch() {
  if (S.chef >= 10) return;
  const l = lvl();
  if (S.ccand && S.ccand.l === l) {
    candHide.c = !candHide.c;
    draw();
    return;
  }
  candHide.c = 0;
  ccrewPad();
  const pool = CAND2.map((_, i) => i).filter((i) => !S.ccrew.includes(i) && !(S.retc || []).includes(i)),
    ids = [];
  while (ids.length < 5 && pool.length) ids.push(pool.splice((Math.random() * pool.length) | 0, 1)[0]);
  S.ccand = { l, ids };
  save();
  draw();
}
function chire(id) {
  if (!S.ccand || S.ccand.l !== lvl() || !S.ccand.ids.includes(id) || maxed("chef")) return;
  const c = kCost(id);
  if (S.coins < c) return;
  S.coins -= c;
  ccrewPad();
  S.chef++;
  S.ccrew.push(id);
  ccrewPad();
  S.ccand.ids = S.ccand.ids.filter((x) => x !== id);
  note = "";
  save();
  draw();
}
const kImg = (id) => `<img class="av" alt="" src="${CIMG2[id]}">`;
function chefPanel() {
  const has = S.ccand && S.ccand.l === lvl(),
    top = S.chef >= 10,
    full = maxed("chef");
  ccrewPad();
  const team = S.ccrew
    .map((id) => (id == null ? "" : `<div class="tm">${kImg(id)}<small>${CAND2[id][0]}</small></div>`))
    .join("");
  let body = "";
  if (!top && !has)
    body = `<div class="mut" style="margin-top:6px">Pulsa Buscar para ver 5 candidatos al azar. Podrás volver a buscar cuando subas de nivel (ahora: nivel ${lvl()}).</div>`;
  else if (!top && !(S.ccand.ids || []).length)
    body = `<div class="mut" style="margin-top:6px">Ya no quedan candidatos de este nivel. Sube de nivel para buscar otros.</div>`;
  else if (!top)
    body =
      (full
        ? `<div class="mut bad" style="margin-top:6px">No tienes fogones libres: amplía la cocina para contratar a otro cocinero.</div>`
        : "") +
      S.ccand.ids
        .map((id) => {
          const c = CAND2[id],
            pr = kCost(id);
          return `<div class="row cd">${kImg(id)}<div style="flex:1;min-width:0"><b>${c[0]}</b>, ${c[1]} años<div class="mut">${c[2] ? c[2] + " año" + (c[2] > 1 ? "s" : "") + " de experiencia" : "Sin experiencia"}</div><div class="mut">${c[3]}</div>${stChips("c", stBase("c", id))}</div><button class="s" onclick="chire(${id})" ${S.coins < pr || full ? "disabled" : ""}>${pr} 🪙</button></div>`;
        })
        .join("");
  if (has && candHide.c) body = "";
  return `<div class="card"><div class="row"><div><b>👨‍🍳 Cocinero nuevo</b><div class="mut">Tienes ${S.chef}/${Math.min(10, fogN() + pasN())} (un fogón y una mesa de repostería por cada ampliación de la cocina). Compara sus estadísticas: cada uno es bueno en algo distinto.${S.chef >= fogN() + pasN() && S.chef < 10 ? " Amplía la cocina: cada nivel añade 1 fogón y 1 mesa de repostería." : ""}</div></div>${top ? `<span class="ok">Máximo</span>` : `<button class="s" onclick="csearch()">${has ? (candHide.c ? "▼ Ver" : "▲ Ocultar") : "🔍 Buscar"}</button>`}</div>${team ? `<div class="team">${team}</div>` : ""}${body}</div>`;
}
