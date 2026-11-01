/* audio.js — Sonido y música (Web Audio, sin archivos). */

/* ===== Sonido, tutorial, guardar/cargar ===== */
const AU = { ctx: null, cfg: { sfx: 1, mus: 1 }, lv: 0, nt: 0, b: 0 };
try {
  const c = JSON.parse(localStorage.getItem("restaurante_cfg") || "null");
  if (c) AU.cfg = Object.assign(AU.cfg, c);
} catch (e) {}
const auSave = () => {
  try {
    localStorage.setItem("restaurante_cfg", JSON.stringify(AU.cfg));
  } catch (e) {}
};
const mtof = (m) => 440 * Math.pow(2, (m - 69) / 12);
function auInit() {
  try {
    if (AU.ctx) {
      if (AU.ctx.state === "suspended") AU.ctx.resume();
      return;
    }
    const C = window.AudioContext || window.webkitAudioContext;
    if (!C) return;
    const x = (AU.ctx = new C());
    AU.sg = x.createGain();
    AU.sg.gain.value = 0.9;
    AU.sg.connect(x.destination);
    AU.mg = x.createGain();
    AU.mg.gain.value = AU.cfg.mus ? 1 : 0;
    AU.mg.connect(x.destination);
    const nb = x.createBuffer(1, x.sampleRate * 2, x.sampleRate),
      d = nb.getChannelData(0);
    let l = 0;
    for (let i = 0; i < d.length; i++) {
      l = l * 0.97 + (Math.random() * 2 - 1) * 0.03;
      d[i] = l * 6;
    }
    const ns = x.createBufferSource();
    ns.buffer = nb;
    ns.loop = true;
    const bp = x.createBiquadFilter();
    bp.type = "bandpass";
    bp.frequency.value = 700;
    bp.Q.value = 0.4;
    AU.ag = x.createGain();
    AU.ag.gain.value = 0.0;
    ns.connect(bp);
    bp.connect(AU.ag);
    AU.ag.connect(AU.mg);
    ns.start();
    AU.nt = x.currentTime + 0.2;
    AU.b = 0;
    setInterval(auSched, 400);
    setInterval(() => {
      if (AU.ctx && AU.ag) AU.ag.gain.setTargetAtTime(S.shift ? 0.05 : 0.018, AU.ctx.currentTime, 1);
    }, 1000);
  } catch (e) {}
}
function tone(f, t, d, ty, v, dest) {
  const x = AU.ctx,
    o = x.createOscillator(),
    g = x.createGain();
  o.type = ty || "sine";
  o.frequency.value = f;
  g.gain.setValueAtTime(0, t);
  g.gain.linearRampToValueAtTime(v, t + 0.012);
  g.gain.exponentialRampToValueAtTime(0.0001, t + d);
  o.connect(g);
  g.connect(dest || AU.sg);
  o.start(t);
  o.stop(t + d + 0.05);
}
function AUsfx(n) {
  if (!AU.cfg.sfx || !AU.ctx || AU.ctx.state !== "running") return;
  const x = AU.ctx,
    t = x.currentTime + 0.005;
  if (n === "coin") {
    tone(1319, t, 0.11, "triangle", 0.09);
    tone(1760, t + 0.07, 0.22, "triangle", 0.09);
  } else if (n === "bell") {
    tone(1046, t, 0.5, "sine", 0.07);
    tone(1568, t + 0.02, 0.6, "sine", 0.04);
  } else if (n === "click") tone(620, t, 0.04, "sine", 0.05);
  else if (n === "ok") {
    [523, 659, 784, 1046].forEach((f, i) => tone(f, t + i * 0.07, 0.25, "triangle", 0.07));
  } else if (n === "lvl") {
    [523, 659, 784, 1046, 1319].forEach((f, i) => tone(f, t + i * 0.09, 0.4, "triangle", 0.09));
  } else if (n === "bad") {
    tone(220, t, 0.18, "sawtooth", 0.05);
    tone(165, t + 0.1, 0.25, "sawtooth", 0.05);
  }
}
const CHD = [
    [48, 55, 59, 64],
    [45, 52, 55, 60],
    [41, 48, 52, 57],
    [43, 50, 55, 59],
  ],
  PEN = [72, 74, 76, 79, 81, 84];
function auSched() {
  const x = AU.ctx;
  if (!x || !AU.cfg.mus || x.state !== "running") return;
  const bl = (60 / 76) * 4;
  while (AU.nt < x.currentTime + 2) {
    const t = AU.nt,
      ch = CHD[AU.b % 4];
    ch.forEach((m, i) => {
      const o = x.createOscillator(),
        g = x.createGain();
      o.type = "sine";
      o.frequency.value = mtof(m + (i > 1 ? 12 : 0));
      o.detune.value = (i - 1.5) * 4;
      g.gain.setValueAtTime(0, t);
      g.gain.linearRampToValueAtTime(0.02, t + 1.2);
      g.gain.linearRampToValueAtTime(0, t + bl + 0.6);
      o.connect(g);
      g.connect(AU.mg);
      o.start(t);
      o.stop(t + bl + 0.7);
    });
    tone(mtof(ch[0]), t, 1.4, "sine", 0.05, AU.mg);
    tone(mtof(ch[0]), t + bl / 2, 1.2, "sine", 0.035, AU.mg);
    for (let k = 0; k < 8; k++)
      if (Math.random() < 0.4) tone(mtof(rnd(PEN)), t + (k * bl) / 8, 0.9, "triangle", 0.03, AU.mg);
    AU.nt += bl;
    AU.b++;
  }
}
try {
  ["pointerdown", "touchend", "keydown"].forEach((e) => addEventListener(e, auInit, { passive: true }));
  document.addEventListener(
    "click",
    (e) => {
      const b = e.target.closest && e.target.closest("button");
      if (b && !b.disabled) AUsfx("click");
    },
    true,
  );
  document.addEventListener("visibilitychange", () => {
    if (!AU.ctx) return;
    if (document.hidden) AU.ctx.suspend();
    else AU.ctx.resume();
  });
} catch (e) {}
[
  "payNow:coin",
  "newC:bell",
  "passClaim:ok",
  "hire:ok",
  "chire:ok",
  "upg:ok",
  "fireDo:bad",
  "closeDay:ok",
].forEach((q) => {
  const [n, snd] = q.split(":"),
    G = typeof window !== "undefined" ? window : globalThis,
    f = G[n];
  if (typeof f !== "function") return;
  G[n] = function () {
    const r = f.apply(this, arguments);
    AUsfx(snd);
    return r;
  };
});
function setAud(k) {
  AU.cfg[k] = AU.cfg[k] ? 0 : 1;
  auSave();
  auInit();
  if (k === "mus" && AU.mg) AU.mg.gain.value = AU.cfg.mus ? 1 : 0;
  if (k === "mus" && AU.cfg.mus && AU.ctx) {
    AU.nt = AU.ctx.currentTime + 0.2;
  }
  showCfg();
}
