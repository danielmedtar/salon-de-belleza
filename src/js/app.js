let pagina = 1;

const turno = {
    nombre: '',
    fecha: '',
    hora: '',
    servicios: []
}

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

    //*Validación de la info del formulario (mostrando el resumen o generando error de no pasar la validación)
    mostrarResumen()

    //*Almacena el nombre de la persona en el objeto
    nombreTurno()
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

        const id = parseInt(elemento.dataset.idServicio);

        eliminarServicio(id)
    } else {
        elemento.classList.add('seleccionado')

        const objServicio = {
            id: parseInt(elemento.dataset.idServicio),
            nombre: elemento.firstElementChild.textContent,
            precio: elemento.firstElementChild.nextElementSibling.textContent
        }
        
        agregarServicio(objServicio)
    }
}

function eliminarServicio(id) {
    const {servicios} = turno
    turno.servicios = servicios.filter(servicio => servicio.id !== id)
    console.log(turno);
}

function agregarServicio(objServicio) {
    const {servicios} = turno

    turno.servicios = [...servicios, objServicio]
    console.log(turno);
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

function mostrarResumen() {
    const {nombre, fecha, hora, servicios} = turno

    const contenidoResumen = document.querySelector('.contenido-resumen')

    if(Object.values(turno).includes('')) {
        const faltanDatos = document.createElement('P')
        faltanDatos.textContent = 'Faltan datos por agregar'

        faltanDatos.classList.add('invalidar-turno')

        contenidoResumen.appendChild(faltanDatos)
    }
}

function nombreTurno() {
    const nombreInput = document.querySelector('#nombre')

    nombreInput.addEventListener('input', (e) => {
        const nombreTexto = e.target.value.trim()

        if(nombreTexto === '' || nombreTexto.length < 3) {
            mostrarAlerta('nombre inválido', 'error');
        } else {
            const alerta = document.querySelector('.alerta')
            if(alerta) {
                alerta.remove()
            }
            turno.nombre = nombreTexto

            console.log(turno);
        }
        
    })
}

function mostrarAlerta(mensaje, tipo) {
    //*Si hay una alerta previa no crear mas
    const alertaPrevia = document.querySelector('.alerta')
    if(alertaPrevia) {
        return
    }

    const alerta = document.createElement('DIV')
    alerta.textContent = mensaje
    alerta.classList.add('alerta')

    if(tipo === 'error') {
        alerta.classList.add('error')
    }
    //insertar en html
    const formulario = document.querySelector('.formulario')
    formulario.appendChild(alerta)

    //ELIMINAR ALERTA DESPUES DE 3SEG
    setTimeout(() => {
        alerta.remove()
    }, 3000);
}