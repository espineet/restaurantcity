/* inicio.js — Arranque del juego. */

initLayout();
if (S.shift) busy = S.shift.c.filter((c) => !c.paid).length;
window.onresize = fit;
draw();
requestAnimationFrame(loop);
let hid = 0;
document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    hid = Date.now();
    flush();
  } else {
    if (hid && Date.now() - hid > 20000) settle();
    hid = 0;
  }
});
window.addEventListener("pagehide", flush);
resume();
if (!S.name) askName();
else setTimeout(tutMaybe, 600);
(async () => {
  try {
    if (!window.claude || !claude.use) return;
    const [db, user] = await Promise.all([claude.use("db"), claude.use("user")]);
    if (!db || !user) return;
    const uid = await user.id();
    if (!uid) return;
    const ref = db.collection("data/users/" + uid).doc("game"),
      sn = await ref.get(),
      d = sn.exists ? sn.data() : null;
    remote = ref;
    if (d && d.s && (d.t || 0) > (S.ts || 0)) {
      S = load(JSON.parse(d.s));
      S.ts = d.t;
      try {
        localStorage.setItem(KEY, d.s);
      } catch (e) {}
      initLayout();
      if (S.shift) busy = S.shift.c.filter((c) => !c.paid).length;
      draw();
      resume();
      if (!S.name) askName();
    } else flush();
  } catch (e) {}
})();
