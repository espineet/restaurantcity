/* comun.js — Utilidades de interfaz compartidas por todas las ventanas. */

// Versión del juego (debe coincidir con la del service worker en sw.js)
const VERSION = "14";

/* Botón ✕ para cerrar una ventana (.ov) por su id */
const btnCerrar = (id) => `<button class="x" onclick="cerrarVentana('${id}')" aria-label="Cerrar">✕</button>`;

/* Cierra una ventana con una pequeña animación */
function cerrarVentana(id) {
  const o = document.getElementById(id);
  if (!o || o.style.display === "none") return;
  o.classList.add("saliendo");
  setTimeout(() => {
    o.classList.remove("saliendo");
    o.style.display = "none";
  }, 160);
}

/* Botón redondo de la cabecera (📊 📜 ⚙️) */
function botonCabecera(id, icono, titulo, fn) {
  const b = document.createElement("button");
  if (id) b.id = id;
  b.className = "hb";
  b.textContent = icono;
  b.setAttribute("aria-label", titulo);
  b.onclick = fn;
  (document.getElementById("hbtn") || document.body).appendChild(b);
  return b;
}
