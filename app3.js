/* Inicio variables, acumuladores, arrays  */

let carritoDeCompras = []
let reservas = []

/* LLAMADO DE los elementos de HTML */

const contenedor_servicios = document.getElementById('contenedorServicios');
const contenedorCarrito = document.getElementById('carrito-contenedor');

const contadorCarrito = document.getElementById('contadorCarrito');
const precioTotal = document.getElementById('precioTotal');

/* FUNCIONES */

/* Ver/Cargar servicios desde servicios.json */

function verServicios() {
    contenedor_servicios.innerHTML = '';
    console.log(fetch('/servicios.json'));
    fetch('/servicios.json')
        .then((res) => res.json())
        .then((servicio) => {
            array = servicio;
            /* Creación de la card de cada servicio */
            servicio.forEach((serv) => {
                let card = document.createElement("div");
                card.className = "servicio"; //Otra opción: card.setAttribute("class", ("servicio"));
                card.innerHTML += `
                                <h3>Servicio ${serv.id}</h3>
                                <p>Descripción: ${serv.descripcion}</p>
                                <p>Precio: $${serv.precio}</p>
                                <img src="media/logo.jpg" alt="">
                                <a id="btn-${serv.id}" class="btn-agregar">Agregar💅🏼</a>
                                `;
                /* Agrega al contenedor para poder verlo */
                contenedor_servicios.appendChild(card)
                    /* Botón para agregar servicio al carrito */
                let btn_agregar = document.getElementById(`btn-${serv.id}`)
                btn_agregar.addEventListener("click", () => {
                    /* Cada vez que se agrega un servicio */
                    Swal.fire({
                        icon: 'success',
                        title: 'Servicio agregado al carrito',
                        showConfirmButton: false,
                        timer: 1200,
                        position: 'top-end',

                    })
                    agregarAlCarrito(serv.id)
                })

            })
        })

}


/* Mostrar servicios en el carrito */

function mostrarCarrito(servicioAgregar) {
    const { descripcion, precio, id, cantidad } = servicioAgregar
    let div = document.createElement('div')
    div.className = 'servicioEnCarrito'
    div.innerHTML = `
        <p class="desc_carrito">${descripcion}</p>
        <p>Precio: $${precio}</p>
        <p id="cantidad${id}">Cantidad: ${cantidad}</p>
        <button id="botonEliminar${id}" class="boton-eliminar">Eliminar X</button>
        `
        /* Se agrega para verlo en el carrito */
    contenedorCarrito.appendChild(div)
        /* Eliminar del carrito */
    let btnEliminar = document.getElementById(`botonEliminar${id}`)
    btnEliminar.addEventListener('click', () => {

        if (servicioAgregar.cantidad > 1) { /* Resta la cantidad del mismo servicio solo si hay más de uno */
            servicioAgregar.cantidad -= 1
            document.getElementById(`cantidad${servicioAgregar.id}`).innerHTML = `<p id= cantidad${servicioAgregar.id}>Cantidad: ${servicioAgregar.cantidad}</p>`
            actualizarCarrito()
            localStorage.setItem('carrito', JSON.stringify(carritoDeCompras))


        } else { /* Si hay solo uno, lo elimina completamente y avisa */
            Swal.fire({
                icon: 'error',
                title: 'Servicio eliminado',
                showConfirmButton: false,
                timer: 750,
                position: 'top-end',

            })
            btnEliminar.parentElement.remove()
            carritoDeCompras = carritoDeCompras.filter(elemento => elemento.id != servicioAgregar.id)
            actualizarCarrito()
            localStorage.setItem('carrito', JSON.stringify(carritoDeCompras))
        }
    })

}

/* Agregar servicios al carrito */

function agregarAlCarrito(id) {
    /* Busca si hay de ese servicio en el carrito */
    let repetido = carritoDeCompras.find(item => item.id == id)
    if (repetido) {
        /* Si esta repetido solo le suma uno a la cantidad */
        repetido.cantidad += 1
        document.getElementById(`cantidad${repetido.id}`).innerHTML = `<p id= cantidad${repetido.id}>Cantidad: ${repetido.cantidad}</p>`
        actualizarCarrito()
    } else {
        /* Si no está lo agrega */
        let servicioAgregar = array.find(elemento => elemento.id == id)

        carritoDeCompras = [...carritoDeCompras, servicioAgregar]
        actualizarCarrito()
        mostrarCarrito(servicioAgregar)
    }
    localStorage.setItem('carrito', JSON.stringify(carritoDeCompras))

}

/* Función para mostrar texto si el carrito está vacío, controla el contador del carrito */
function carritoVacio(contador) {
    if (contador == 0) {
        document.getElementById("carrito-vacio").style.display = "flex";
    } else {
        document.getElementById("carrito-vacio").style.display = "none";
    }

}
/* Actualizador del carrito para la cantidad de servicios en el carrito y para actualizar el precio del mismo */
function actualizarCarrito() {
    contadorCarrito.innerText = carritoDeCompras.reduce((acc, el) => acc + el.cantidad, 0)
    precioTotal.innerText = carritoDeCompras.reduce((acc, el) => acc + (el.precio * el.cantidad), 0)
    carritoVacio(contadorCarrito.innerText)
}

/* Reservar servicios */

function reservar() {
    let btn = document.getElementById("btn")
    btn.onclick = () => {
        /* Acceso a los elementos */
        let servicio = document.getElementById("servicio").value
        let fecha = document.getElementById("fecha").value
        let horario = document.getElementById('hora').value

        let newReserva = { dia: fecha, hora: horario };

        let horaRepetida = reservas.find(item => item.hora == horario)
        let diaRepetido = reservas.find(item => item.dia == fecha)

        /* Validación del número de ID ingresado, debe ser mayor a 0  */
        if (servicio < 1) {
            Swal.fire({
                icon: 'error',
                title: "Número de servicio inválido",
                showConfirmButton: false,
                timer: 950,
                position: 'top-end',
            })
        } else { /* Validación de selección de fecha y horario, no puede estar sin seleccionar para reservar */
            if (fecha == "" || horario == "") {
                Swal.fire({
                    icon: 'error',
                    title: "Falta seleccionar algún dato",
                    showConfirmButton: false,
                    timer: 950,
                    position: 'top-end',
                })
            } else { /* Control para ver si el mismo día y hora ya fue reservado anteriormente, no importa el servicio */
                if (diaRepetido && horaRepetida) {
                    Swal.fire({
                        icon: 'error',
                        title: 'Horario ocupado',
                        showConfirmButton: false,
                        timer: 750,
                        position: 'top-end',
                    })
                } else { /* Reserva exitosa */
                    Swal.fire({
                            icon: 'success',
                            title: 'Servicio reservado',
                            showConfirmButton: false,
                            timer: 1200,
                            position: 'top-end',
                        })
                        /* Guardado */
                    reservas.push(newReserva)
                    localStorage.setItem('horasRes', JSON.stringify(reservas))
                }
            }
        }
    }
}

/* Recuperar desde el Local Storage */

function recuperar() {

    let recuperarLScarrito = JSON.parse(localStorage.getItem('carrito')) || []
    let recuperarLSreserva = JSON.parse(localStorage.getItem('horasRes')) || []

    if (recuperarLScarrito) {
        recuperarLScarrito.forEach(element => {
            mostrarCarrito(element)
            carritoDeCompras.push(element)
            actualizarCarrito()
        });
    }
    if (recuperarLSreserva) {
        recuperarLSreserva.forEach(element => {
            reservas.push(element)
        });
    }

}

/* Llamado de funciones */
actualizarCarrito()
recuperar()
reservar()
verServicios()