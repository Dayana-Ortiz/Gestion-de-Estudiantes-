// ========== UTILIDADES DE LOCALSTORAGE ==========
function getData() {
  return JSON.parse(localStorage.getItem("estudiantes")) || [];
}

function saveData(data) {
  localStorage.setItem("estudiantes", JSON.stringify(data));
}

// ========== RENDERIZAR TABLA ==========
function renderEstudiantes(filtro = "") {
  let data = getData();
  let tabla = document.getElementById("tabla-estudiantes");
  tabla.innerHTML = "";

  data.forEach((item, index) => {
    if (!item.nombre.toLowerCase().includes(filtro.toLowerCase())) return;

    let row = document.createElement("tr");
    row.innerHTML = `
      <td>${item.nombre}</td>
      <td>${item.tipoDoc}</td>
      <td>${item.documento}</td>
      <td>${item.departamento}</td>
      <td>${item.codigo}</td>
      <td>${item.grupo}</td>
      <td>${item.semestre}</td>
      <td>${item.asignatura}</td>
      <td>${item.fecha}</td>
      <td>${getAsistenciaTexto(item.asistencia)}</td>
      <td>
        <button onclick="editarEstudiante(${index})">Editar</button>
        <button onclick="eliminarEstudiante(${index})">Eliminar</button>
      </td>
    `;
    tabla.appendChild(row);
  });
}

function getAsistenciaTexto(valor) {
  switch (valor) {
    case "1": return "Asistió";
    case "0": return "No asistió";
    case "r": return "Retardo";
    default: return valor;
  }
}

// ========== FORMULARIO ==========
function mostrarFormulario() {
  document.getElementById("form-estudiante").reset();
  document.getElementById("form-estudiante").dataset.editIndex = "";
}

document.getElementById("form-estudiante").addEventListener("submit", async function(e) {
  e.preventDefault();

  let nuevoEstudiante = {
    nombre: document.getElementById("nombre").value.trim(),
    tipoDoc: document.getElementById("tipoDoc").value,
    documento: document.getElementById("documento").value.trim(),
    departamento: document.getElementById("departamento").value.trim(),
    codigo: document.getElementById("codigo").value.trim(),
    grupo: document.getElementById("grupo").value.trim(),
    semestre: document.getElementById("semestre").value.trim(),
    asignatura: document.getElementById("asignatura").value.trim(),
    fecha: document.getElementById("fecha").value,
    asistencia: document.getElementById("asistencia").value
  };

  let data = getData();
  let editIndex = this.dataset.editIndex;

  try {
    // Enviar al backend
    await enviarAlBackend({
      dni: nuevoEstudiante.documento,
      nombre: nuevoEstudiante.nombre,
      tipo_documento: nuevoEstudiante.tipoDoc,
      departamento: nuevoEstudiante.departamento,
      codigo: nuevoEstudiante.codigo,
      grupo: nuevoEstudiante.grupo,
      semestre: nuevoEstudiante.semestre,
      asignatura: nuevoEstudiante.asignatura,
      fecha: nuevoEstudiante.fecha,
      asistencia: nuevoEstudiante.asistencia
    });

    // Actualizar localmente
    if (editIndex !== "") {
      data[editIndex] = nuevoEstudiante;
    } else {
      data.push(nuevoEstudiante);
    }
    
    saveData(data);
    renderEstudiantes();
    this.reset();
    this.dataset.editIndex = "";
    
  } catch (error) {
    console.error("Error al enviar al backend:", error);
    alert("Los datos se guardaron localmente pero hubo un error al enviar al servidor.");
    
    // Fallback local
    if (editIndex !== "") {
      data[editIndex] = nuevoEstudiante;
    } else {
      data.push(nuevoEstudiante);
    }
    saveData(data);
    renderEstudiantes();
  }
});

// ========== EDITAR Y ELIMINAR ==========
function editarEstudiante(index) {
  let data = getData();
  let estudiante = data[index];

  document.getElementById("nombre").value = estudiante.nombre;
  document.getElementById("tipoDoc").value = estudiante.tipoDoc;
  document.getElementById("documento").value = estudiante.documento;
  document.getElementById("departamento").value = estudiante.departamento;
  document.getElementById("codigo").value = estudiante.codigo;
  document.getElementById("grupo").value = estudiante.grupo;
  document.getElementById("semestre").value = estudiante.semestre;
  document.getElementById("asignatura").value = estudiante.asignatura;
  document.getElementById("fecha").value = estudiante.fecha;
  document.getElementById("asistencia").value = estudiante.asistencia;

  document.getElementById("form-estudiante").dataset.editIndex = index;
}

async function eliminarEstudiante(index) {
  let data = getData();
  let estudiante = data[index];
  
  if (confirm("¿Estás seguro de que deseas eliminar este estudiante?")) {
    try {
      // Eliminar del backend
      await eliminarDelBackend(estudiante.documento);
      
      // Eliminar localmente
      data.splice(index, 1);
      saveData(data);
      renderEstudiantes();
    } catch (error) {
      console.error("Error al eliminar del backend:", error);
      alert("No se pudo eliminar del servidor. El estudiante fue eliminado localmente.");
      data.splice(index, 1);
      saveData(data);
      renderEstudiantes();
    }
  }
}

// ========== INTEGRACIÓN CON BACKEND ==========
async function enviarAlBackend(estudiante) {
  let myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  let raw = JSON.stringify(estudiante);

  let requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow"
  };

  let response = await fetch(
    "https://proyectofinaldsws.netlify.app/.netlify/functions/usuarios", 
    requestOptions
  );
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  
  return await response.json();
}

async function eliminarDelBackend(dni) {
  let requestOptions = {
    method: "DELETE",
    redirect: "follow"
  };

  let response = await fetch(
    `https://proyectofinaldsws.netlify.app/.netlify/functions/usuarios/${dni}`, 
    requestOptions
  );
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  
  return await response.json();
}

// ========== FILTRAR ==========
function filtrarTabla() {
  renderEstudiantes(document.getElementById("busqueda").value);
}

// ========== INICIALIZACIÓN ==========
document.addEventListener("DOMContentLoaded", () => {
  renderEstudiantes();
  
  document.getElementById("busqueda").addEventListener("input", filtrarTabla);
});
