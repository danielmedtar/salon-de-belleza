document.addEventListener('DOMContentLoaded', function() {
    iniciarApp();
})

function iniciarApp() {
    mostrarServicios();
}

async function mostrarServicios() {
    try {
        const resultado = await fetch('./servicios.json')
        const db = await resultado.json()

        const {servicios} = db;

        servicios.forEach(servicio => {
            const {id, nombre, precio} = servicio;

            //**INICIA DOM SCRIPTING
            //* Generar el nombre del servicio

            const nombreServicio = document.createElement('P')
            nombreServicio.textContent = nombre;
            nombreServicio.classList.add('nombre-servicio')

            //*Generar el precio
        
            const precioServicio = document.createElement('P')
            precioServicio.textContent = `$${precio}`;
            precioServicio.classList.add('precio-servicio')

            //*Generar el div principal de los servicios
            const contenedorServicio = document.createElement('DIV')
            contenedorServicio.classList.add('servicio')
            contenedorServicio.dataset.idServicio = id;

            //*Seleccionar servicio
            contenedorServicio.onclick = seleccionarServicio;

            contenedorServicio.appendChild(nombreServicio)
            contenedorServicio.appendChild(precioServicio)

            document.querySelector('#servicios').appendChild(contenedorServicio)

        

        });

        
    } catch(error) {
        console.log(error);
    }
}

function seleccionarServicio(e) {

    let elemento;
    //*Forzar que el elemento que tome el click sea el div servicio
    if(e.target.tagName === 'P') {
        elemento = (e.target.parentElement);
    } else {
        elemento = e.target;
    }

    if(elemento.classList.contains('seleccionado')) {
        elemento.classList.remove('seleccionado')
    } else {
        elemento.classList.add('seleccionado')
    }

}