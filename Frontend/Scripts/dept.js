// ========== UTILIDADES DE LOCALSTORAGE ==========
function getData() {
    return JSON.parse(localStorage.getItem("estudiantes")) || [];
}

function saveData(data) {
    localStorage.setItem("estudiantes", JSON.stringify(data));
}

// ========== RENDERIZAR TABLA CON FILTRO ==========
function renderEstudiantes(filtro = "") {
    let data = getData();
    let tabla = document.getElementById("tabla-estudiantes");
    tabla.innerHTML = "";

    data.forEach((item, index) => {
        if (!item.departamento.toLowerCase().includes(filtro.toLowerCase())) return;

        let row = document.createElement("tr");
        row.innerHTML = `
            <td>${item.nombre}</td>
            <td>${item.documento}</td>
            <td>
                <span id="dep-text-${index}">${item.departamento}</span>
                <input type="text" id="dep-input-${index}" value="${item.departamento}" style="display:none;" />
                <button class="edit-button" onclick="editarDepartamento(${index})">Editar</button>
                <button class="save-button" onclick="guardarDepartamento(${index})" style="display:none;">Guardar</button>
            </td>
        `;
        tabla.appendChild(row);
    });
}

// ========== EDITAR Y GUARDAR DEPARTAMENTO ==========
function editarDepartamento(index) {
    document.getElementById(`dep-text-${index}`).style.display = 'none';
    let input = document.getElementById(`dep-input-${index}`);
    input.style.display = 'inline';
    input.focus();

    input.nextElementSibling.style.display = 'none';
    input.nextElementSibling.nextElementSibling.style.display = 'inline';
}

async function guardarDepartamento(index) {
    let input = document.getElementById(`dep-input-${index}`);
    let nuevoValor = input.value.trim();

    if (nuevoValor === "") {
        alert("El departamento no puede estar vacío.");
        return;
    }

    let data = getData();
    data[index].departamento = nuevoValor;
    saveData(data);
    
    // Enviar actualización al backend
    try {
        await enviarAlBackend(data[index].documento, data[index].nombre, data[index].departamento);
        console.log("Departamento actualizado en el backend");
    } catch (error) {
        console.error("Error al actualizar en el backend:", error);
    }
    
    renderEstudiantes(document.getElementById("busqueda").value);
}

// ========== FILTRAR ==========
function filtrarTabla() {
    renderEstudiantes(document.getElementById("busqueda").value);
}

// ========== AGREGAR NUEVA FACULTAD ==========
async function guardarNuevaFacultad() {
    let nombre = document.getElementById("nueva-nombre-facultad").value.trim();

    if (nombre === "") {
        alert("El nombre no puede estar vacío.");
        return;
    }

    let data = getData();
    let nuevoEstudiante = {
        nombre: "Estudiante X",
        documento: Math.floor(Math.random() * 1000000000).toString(),
        departamento: nombre
    };
    
    data.push(nuevoEstudiante);
    saveData(data);
    
    // Enviar al backend
    try {
        await enviarAlBackend(nuevoEstudiante.documento, nuevoEstudiante.nombre, nuevoEstudiante.departamento);
        console.log("Nueva facultad registrada en el backend");
    } catch (error) {
        console.error("Error al enviar al backend:", error);
    }
    
    cerrarModalAgregarFacultad();
    renderEstudiantes(document.getElementById("busqueda").value);
}

// ========== MODIFICAR NOMBRE DE FACULTAD ==========
let nombreSeleccionadoModificar = "";

function abrirModalModificarFacultad(nombreActual) {
    nombreSeleccionadoModificar = nombreActual;
    document.getElementById("nombre-facultad").value = nombreActual;
    document.getElementById("modalModificarFacultad").style.display = "block";
}

async function guardarModificacionFacultad() {
    let nuevoNombre = document.getElementById("nombre-facultad").value.trim();

    if (nuevoNombre === "") {
        alert("Debe ingresar un nombre.");
        return;
    }

    let data = getData();
    data.forEach(est => {
        if (est.departamento === nombreSeleccionadoModificar) {
            est.departamento = nuevoNombre;
        }
    });

    saveData(data);
    
    // Enviar actualizaciones al backend
    try {
        let estudiantesModificar = data.filter(est => est.departamento === nuevoNombre);
        for (let estudiante of estudiantesModificar) {
            await enviarAlBackend(estudiante.documento, estudiante.nombre, estudiante.departamento);
        }
        console.log("Facultad modificada en el backend");
    } catch (error) {
        console.error("Error al actualizar en el backend:", error);
    }
    
    cerrarModalModificarFacultad();
    renderEstudiantes(document.getElementById("busqueda").value);
}

// ========== MODALES ==========
function cerrarModalAgregarFacultad() {
    document.getElementById("modalAgregarFacultad").style.display = "none";
    document.getElementById("nueva-nombre-facultad").value = "";
}

function cerrarModalModificarFacultad() {
    document.getElementById("modalModificarFacultad").style.display = "none";
    document.getElementById("nombre-facultad").value = "";
    nombreSeleccionadoModificar = "";
}

// ========== INTEGRACIÓN CON BACKEND (como en la imagen) ==========
async function enviarAlBackend(dni, nombre, departamento) {
    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    let raw = JSON.stringify({
        "dni": dni,
        "nombre": nombre,
        "departamento": departamento
    });

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
    return await response.json();
}


document.addEventListener("DOMContentLoaded", () => {
    renderEstudiantes();

    let inputBusqueda = document.getElementById("busqueda");
    if (inputBusqueda) {
        inputBusqueda.addEventListener("input", filtrarTabla);
    }
});