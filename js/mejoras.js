/* mejoras.js — Uniformes, mejoras del local (ampliaciones) y avisos (toast). */

const UNI = {
  w: [
    ["Clásico", { t: "#ffffff", p: "#1f1f1f", tie: "#c0392b" }],
    ["Chaleco negro", { t: "#ffffff", p: "#1f1f1f", tie: "#222222", vest: "#2b2b33" }],
    ["Burdeos", { t: "#8e2c3a", p: "#1f1f1f", tie: "#111111" }],
    ["Azul marino", { t: "#2c4a7c", p: "#4b4f58", tie: "#f1f1f1" }],
    ["Verde bosque", { t: "#2f6f4f", p: "#23302a", tie: "#e8d9a0", vest: "#1f4a35" }],
    ["Gala", { t: "#222228", p: "#16161a", tie: "#f5f5f5" }],
  ],
  c: [
    ["Clásico", { t: "#ffffff", p: "#4a4a4a" }],
    ["Delantal azul", { t: "#ffffff", p: "#27407a", apron: "#27407a" }],
    ["Chef negro", { t: "#26262b", p: "#26262b", hat: "#2b2b30" }],
    ["Rojo pasión", { t: "#c0392b", p: "#3a3a3a", hat: "#ffffff" }],
    ["Verde fresco", { t: "#e9f3e4", p: "#4a6b4a", apron: "#2f6f4f", hat: "#e9f3e4" }],
    ["Chef dorado", { t: "#f4e4b0", p: "#6b5a2a", apron: "#8a6d1a", hat: "#fff6d0" }],
  ],
};
const uniOf = (k) => UNI[k][(S.uni || {})[k] | 0][1],
  uniP = (k, i) => i * 50;
const uniOwn = (k, i) => i === 0 || (S.own || []).includes("u" + k + i);
function uniPrev(k, i) {
  return person({ [k === "w" ? "waiter" : "chef"]: 1, uni: UNI[k][i][1], look: ["#f3c9a5", "#4a2e1b", 0] })
    .replace(/width="22" height="50.6"/, 'width="44" height="101"')
    .replace(/margin-left:-11px/, "");
}
function uniAct(k, i) {
  if (busy) {
    note = "Espera a que acabe el servicio para cambiar la ropa.";
    draw();
    return;
  }
  if (!uniOwn(k, i)) {
    const pr = uniP(k, i);
    if (S.coins < pr) return;
    S.coins -= pr;
    S.own.push("u" + k + i);
  }
  if (!S.uni) S.uni = { w: 0, c: 0 };
  S.uni[k] = i;
  const A = k === "w" ? WS : CKS;
  A.forEach((w) => w.el.remove());
  A.length = 0;
  note = "";
  save();
  draw();
}
function ropaGrid() {
  if (!S.uni) S.uni = { w: 0, c: 0 };
  return [
    ["w", "🧑‍🍳 Uniformes de camarero"],
    ["c", "👨‍🍳 Uniformes de cocinero"],
  ]
    .map(
      ([k, t]) =>
        `<p class="mut"><b>${t}</b>${busy ? " · Durante el servicio no se puede cambiar" : ""}</p><div class="grid">${UNI[
          k
        ]
          .map((u, i) => {
            const own = uniOwn(k, i),
              use = (S.uni[k] | 0) === i;
            return `<div class="card item"><div style="height:110px;display:flex;align-items:flex-end;justify-content:center">${uniPrev(k, i)}</div><b>${u[0]}</b><div class="mut">${own ? (use ? "✔ En uso" : "Tuyo") : uniP(k, i) + " 🪙"}</div><button class="s" onclick="uniAct('${k}',${i})" ${use || busy || (!own && S.coins < uniP(k, i)) ? "disabled" : ""}>${own ? "Usar" : "Comprar"}</button></div>`;
          })
          .join("")}</div>`,
    )
    .join("");
}
const UP = {
  chef: ["chef", 10, (s) => 150 * s.chef],
  cam: ["waiters", 10, (s) => 120 * s.waiters],
  rec: ["q", 10, (s) => 100 * (s.q + 1)],
  sal: ["sal", 10, (s) => 250 * (s.sal + 1)],
  kit: ["kit", 10, (s) => 200 * (s.kit + 1)],
  ter: ["terL", 5, (s) => Math.round(TUP[Math.min(4, s.terL | 0)] / 0.75)],
};
const blocked = (t) => t === "ter" && (!S.ter || lvl() < 10 || SRn() < TSZ((S.terL | 0) + 1));
function upg(t) {
  const c = cost(t);
  if (S.coins < c || maxed(t) || blocked(t)) return;
  S.coins -= c;
  S[UP[t][0]]++;
  note = "";
  save();
  draw();
}
function cost(t) {
  return Math.round(UP[t][2](S) * 0.75);
}
function maxed(t) {
  return t === "chef" ? S.chef >= Math.min(10, fogN() + pasN()) : S[UP[t][0]] >= UP[t][1];
}
function toast(m) {
  const d = document.createElement("div");
  d.textContent = m;
  d.style.cssText =
    "position:fixed;top:64px;left:50%;transform:translateX(-50%);max-width:90%;padding:10px 14px;border-radius:12px;background:rgba(0,0,0,.82);color:#fff;font-size:13px;z-index:60;text-align:center";
  document.body.appendChild(d);
  setTimeout(() => d.remove(), 6500);
}
