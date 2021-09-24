let pagina = 1;

document.addEventListener('DOMContentLoaded', function() {
    iniciarApp();
})

function iniciarApp() {
    mostrarServicios();

    //*Resalta div actual segun el tab presionado
    mostrarSeccion()

    //*Oculta o muestra div actual segun el tab presionado
    cambiarSeccion();

    //*Paginacion siguiente y anterior
    paginaSiguiente();

    paginaAnterior();

    //*Comprobar pagina actual para que no se desfase paginacion
    botonesPaginador()
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

function mostrarSeccion() {

    //*Eliminar mostrar-seccion de la seccion anterior
    const seccionAnterior = document.querySelector('.mostrar-seccion');
    if (seccionAnterior) {
        seccionAnterior.classList.remove('mostrar-seccion')
    }    

    const seccionActual = document.querySelector(`#paso-${pagina}`)
    seccionActual.classList.add('mostrar-seccion')

    //*Elimina la clase 'actual' del anterior
    const tabAnterior = document.querySelector('.tabs .actual')

    if(tabAnterior) {
        tabAnterior.classList.remove('actual')
    }

    //**Resaltar el tab actual
    const tab = document.querySelector(`[data-paso="${pagina}"]`)
    tab.classList.add('actual')
}

function cambiarSeccion() {
    const enlaces = document.querySelectorAll('.tabs button')

    enlaces.forEach(enlace => {
        enlace.addEventListener('click', e => {
            e.preventDefault();
            pagina = parseInt(e.target.dataset.paso);

            mostrarSeccion()
            botonesPaginador()
        })
    } )
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

function paginaSiguiente(){
    const paginaSiguiente = document.querySelector('#siguiente')
    paginaSiguiente.addEventListener('click', () => {
        pagina++;
        console.log(pagina);

        botonesPaginador()
    })
}

function paginaAnterior(){
    const paginaAnterior = document.querySelector('#anterior')
    paginaAnterior.addEventListener('click', () => {
        pagina--;

        console.log(pagina);

        botonesPaginador()
    })
}

function botonesPaginador() {
    const paginaSiguiente = document.querySelector('#siguiente')
    const paginaAnterior = document.querySelector('#anterior')

    if(pagina === 1) {
        paginaAnterior.classList.add('ocultar')
        
    } else if (pagina === 3) {
        paginaSiguiente.classList.add('ocultar')   
        paginaAnterior.classList.remove('ocultar')   
        
    } else {
        paginaAnterior.classList.remove('ocultar')
        paginaSiguiente.classList.remove('ocultar')
    }

    mostrarSeccion()

}