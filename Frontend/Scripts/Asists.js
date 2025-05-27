// Obtener datos desde localStorage
function getData() {
    return JSON.parse(localStorage.getItem("estudiantes")) || [];
}

// Guardar datos en localStorage
function saveData(data) {
    localStorage.setItem("estudiantes", JSON.stringify(data));
}

// Mostrar estudiantes en la tabla, con filtro opcional
function renderEstudiantes(filtro = "") {
    let data = getData();
    let tabla = document.getElementById("tabla-estudiantes");
    tabla.innerHTML = "";

    data.forEach((item, index) => {
        if (!item.asistencia.toLowerCase().includes(filtro.toLowerCase())) return;

        let row = document.createElement("tr");
        row.innerHTML = `
            <td>${item.nombre}</td>
            <td>${item.documento}</td>
            <td>
                <span id="asis-text-${index}">${formatearAsistencia(item.asistencia)}</span>
                <select id="asis-select-${index}" style="display:none;">
                    <option value="1">Asistió</option>
                    <option value="0">No asistió</option>
                    <option value="r">Retardo</option>
                </select>
                <button class="edit-button" onclick="editarAsistencia(${index})">Editar</button>
                <button class="save-button" onclick="guardarAsistencia(${index})" style="display:none;">Guardar</button>
            </td>
        `;
        tabla.appendChild(row);
    });
}

// Cambiar de texto a selector
function editarAsistencia(index) {
    document.getElementById(`asis-text-${index}`).style.display = 'none';
    let select = document.getElementById(`asis-select-${index}`);
    select.style.display = 'inline';

    // Preseleccionar el valor actual
    let data = getData();
    select.value = data[index].asistencia;

    document.querySelector(`#asis-select-${index} + .edit-button`).style.display = 'none';
    document.querySelector(`#asis-select-${index} + .edit-button + .save-button`).style.display = 'inline';
}

// Guardar valor modificado
async function guardarAsistencia(index) {
    let data = getData();
    let nuevoValor = document.getElementById(`asis-select-${index}`).value;
    data[index].asistencia = nuevoValor;
    saveData(data);
    
    // Enviar actualización al backend
    try {
        await enviarAlBackend(data[index].documento, data[index].nombre, data[index].asistencia);
        console.log("Asistencia actualizada en el backend");
    } catch (error) {
        console.error("Error al actualizar en el backend:", error);
    }
    
    renderEstudiantes(document.getElementById("busqueda").value);
}

// Filtro al escribir
function filtrarTabla() {
    renderEstudiantes(document.getElementById("busqueda").value);
}

// Agregar nuevo estudiante desde el formulario
async function agregarEstudiante(event) {
    event.preventDefault();

    let nombre = document.getElementById("nombre").value.trim();
    let documento = document.getElementById("documento").value.trim();
    let asistencia = document.getElementById("asistencia").value;

    if (!nombre || !documento || !asistencia) {
        alert("Por favor completa todos los campos");
        return;
    }

    let data = getData();

    let existe = data.some(est => est.documento === documento);
    if (existe) {
        alert("Ya existe un estudiante con ese documento");
        return;
    }

    let nuevoEstudiante = { nombre, documento, asistencia };
    data.push(nuevoEstudiante);
    saveData(data);
    
    // Enviar al backend
    try {
        await enviarAlBackend(documento, nombre, asistencia);
        console.log("Estudiante registrado en el backend");
    } catch (error) {
        console.error("Error al enviar al backend:", error);
    }

    document.getElementById("form-estudiante").reset();
    renderEstudiantes(document.getElementById("busqueda").value);
}

// Función auxiliar para mostrar texto legible
function formatearAsistencia(valor) {
    switch (valor) {
        case "1": return "Asistió";
        case "0": return "No asistió";
        case "r": return "Retardo";
        default: return valor;
    }
}

// Función para enviar datos al backend (como en la imagen)
async function enviarAlBackend(dni, nombre, asistencia) {
    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    let raw = JSON.stringify({
        "dni": dni,
        "nombre": nombre,
        "asistencia": asistencia
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

// Mostrar al cargar
renderEstudiantes();