// =========================
// VARIABLES Y ESTRUCTURAS
// =========================
const form = document.getElementById("formGuia");
const tbody = document.querySelector("#listaGuias tbody");
const mensajeError = document.getElementById("mensajeError");

// Panel
const totalGuias = document.getElementById("totalGuias");
const guiasTransito = document.getElementById("guiasTransito");
const guiasEntregadas = document.getElementById("guiasEntregadas");

// Modal
const modal = document.getElementById("modalHistorial");
const cerrarModal = document.getElementById("cerrarModal");
const historialContenido = document.getElementById("historialContenido");

let guias = []; // lista de guías

// =========================
// FUNCIONES PRINCIPALES
// =========================

// Registrar guía
form.addEventListener("submit", (e) => {
  e.preventDefault();

  const nuevaGuia = {
    numero: document.getElementById("numeroGuia").value.trim(),
    destinatario: document.getElementById("destinatario").value.trim(),
    origen: document.getElementById("origen").value.trim(),
    destino: document.getElementById("destino").value.trim(),
    fecha: document.getElementById("fecha").value,
    estado: document.getElementById("estado").value,
    historial: [],
  };

  // Validaciones
  if (Object.values(nuevaGuia).some(v => v === "")) {
    mostrarError("Todos los campos son obligatorios");
    return;
  }

  if (guias.some(g => g.numero === nuevaGuia.numero)) {
    mostrarError("El número de guía ya existe");
    return;
  }

  // Agregar historial inicial
  nuevaGuia.historial.push({
    estado: nuevaGuia.estado,
    fecha: new Date().toLocaleString(),
  });

  guias.push(nuevaGuia);
  mostrarGuias();
  actualizarPanel();
  form.reset();
  mensajeError.textContent = "";
});

// Mostrar guías
function mostrarGuias() {
  tbody.innerHTML = "";
  guias.forEach((g) => {const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${g.numero}</td>
      <td>${g.estado}</td>
      <td>${g.origen}</td>
      <td>${g.destino}</td>
      <td>${g.fecha}</td>
      <td>
      <button class="btn small" onclick="actualizarEstado('${g.numero}')">Actualizar estado</button>
      <button class="btn small" onclick="verHistorial('${g.numero}')">Ver historial</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

// Mostrar errores
function mostrarError(msg) {
  mensajeError.textContent = msg;
  setTimeout(() => (mensajeError.textContent = ""), 3000);
}

// =========================
// ACTUALIZAR ESTADO
// =========================
function actualizarEstado(numero) {
  const guia = guias.find((g) => g.numero === numero);
  if (!guia) return;

  if (guia.estado === "Pendiente") guia.estado = "En tránsito";
  else if (guia.estado === "En tránsito") guia.estado = "Entregada";
  else return;

  guia.historial.push({
    estado: guia.estado,
    fecha: new Date().toLocaleString(),
  });

  mostrarGuias();
  actualizarPanel();
}

// =========================
// PANEL DE ESTADO GENERAL
// =========================
function actualizarPanel() {
  totalGuias.textContent = guias.length;
  guiasTransito.textContent = guias.filter((g) => g.estado === "En tránsito").length;
  guiasEntregadas.textContent = guias.filter((g) => g.estado === "Entregada").length;
}

// =========================
// HISTORIAL (MODAL)
// =========================
function verHistorial(numero) {
  const guia = guias.find((g) => g.numero === numero);
  if (!guia) return;

  historialContenido.innerHTML = "";
  guia.historial.forEach((h) => {
    const li = document.createElement("li");
    li.textContent = `${h.estado} - ${h.fecha}`;
    historialContenido.appendChild(li);
  });

  modal.style.display = "block";
}

cerrarModal.onclick = () => (modal.style.display = "none");
window.onclick = (e) => {
  if (e.target === modal) modal.style.display = "none";
};
