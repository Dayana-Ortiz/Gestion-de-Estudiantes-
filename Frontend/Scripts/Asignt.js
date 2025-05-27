function getData() {
    return JSON.parse(localStorage.getItem("estudiantes")) || [];
}

function saveData(data) {
    localStorage.setItem("estudiantes", JSON.stringify(data));
}

function renderEstudiantes(filtro = "") {
    let data = getData();
    let tabla = document.getElementById("tabla-estudiantes");
    tabla.innerHTML = "";

    data.forEach((item, index) => {
        if (!item.asignatura.toLowerCase().includes(filtro.toLowerCase())) return;

        let row = document.createElement("tr");
        row.innerHTML = `
          <td>${item.nombre}</td>
          <td>${item.documento}</td>
          <td>
            <span id="asig-text-${index}">${item.asignatura}</span>
            <input type="text" id="asig-input-${index}" value="${item.asignatura}" style="display:none; width: 150px;">
            <button id="edit-btn-${index}" class="edit-button" onclick="editarAsignatura(${index})">Editar</button>
            <button id="save-btn-${index}" class="save-button" onclick="guardarAsignatura(${index})" style="display:none;">Guardar</button>
          </td>
        `;
        tabla.appendChild(row);
    });
}

function editarAsignatura(index) {
    document.getElementById(`asig-text-${index}`).style.display = 'none';
    document.getElementById(`asig-input-${index}`).style.display = 'inline';
    document.getElementById(`edit-btn-${index}`).style.display = 'none';
    document.getElementById(`save-btn-${index}`).style.display = 'inline';
}

async function guardarAsignatura(index) {
    let data = getData();
    let nuevoValor = document.getElementById(`asig-input-${index}`).value.trim();
    if (nuevoValor === "") {
        alert("La asignatura no puede estar vacía.");
        return;
    }

    data[index].asignatura = nuevoValor;
    saveData(data);
    
    // Enviar actualización al backend
    try {
        await enviarAlBackend(data[index].documento, data[index].nombre, data[index].asignatura);
        console.log("Actualización enviada al backend");
    } catch (error) {
        console.error("Error al actualizar en el backend:", error);
    }
    
    renderEstudiantes(document.getElementById("busqueda").value);
}

function filtrarTabla() {
    renderEstudiantes(document.getElementById("busqueda").value);
}

async function agregarEstudiante(event) {
    event.preventDefault();

    let nombre = document.getElementById("nombre").value.trim();
    let documento = document.getElementById("documento").value.trim();
    let asignatura = document.getElementById("asignatura").value.trim();

    if (!nombre || !documento || !asignatura) {
        alert("Por favor, completa todos los campos.");
        return;
    }

    let data = getData();
    let nuevoEstudiante = { nombre, documento, asignatura };
    data.push(nuevoEstudiante);
    saveData(data);

    // Enviar al backend
    try {
        await enviarAlBackend(documento, nombre, asignatura);
        console.log("Estudiante enviado al backend");
    } catch (error) {
        console.error("Error al enviar al backend:", error);
    }

    document.getElementById("formulario-estudiante").reset();
    renderEstudiantes();
}

// Función para enviar datos al backend (igual a la imagen)
async function enviarAlBackend(dni, nombre, asignatura) {
    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    let raw = JSON.stringify({
        "dni": document.getElementById("dni").value ,
        "nombre": document.getElementById("nombre").value ,
        "asignatura": document.getElementById("asignatura").value 
        
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

renderEstudiantes();