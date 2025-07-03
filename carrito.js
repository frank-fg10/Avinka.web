let carrito = [];

document.addEventListener('DOMContentLoaded', () => {
    const botonesComprar = document.querySelectorAll('.comprar-btn');

    botonesComprar.forEach(btn => {
        btn.addEventListener('click', function () {
            const producto = this.closest('.producto');
            const nombre = producto.querySelector('.titulo-producto').textContent;
            const precioTexto = producto.querySelector('.precio').textContent;
            const precio = parseFloat(precioTexto.replace('$', ''));

            agregarAlCarrito(nombre, precio);
            mostrarCarrito();
            mostrarBotonToggle(false); 
        });
    });

    crearBotonFlotante();
});

function agregarAlCarrito(nombre, precio) {
    const productoExistente = carrito.find(item => item.nombre === nombre);

    if (productoExistente) {
        productoExistente.cantidad++;
    } else {
        carrito.push({ nombre, precio, cantidad: 1 });
    }
}


function mostrarCarrito() {
    let contenedor = document.querySelector("#carrito-contenedor");

    if (!contenedor) {
        contenedor = document.createElement("div");
        contenedor.id = "carrito-contenedor";
        document.body.appendChild(contenedor);
    }

    contenedor.innerHTML = `
        <button id="cerrar-carrito">&times;</button>
        <h3>Carrito</h3>
    `;

    if (carrito.length === 0) {
        contenedor.innerHTML += "<p>El carrito está vacío</p>";
    }

    const lista = document.createElement("div");

    let total = 0;
    carrito.forEach(item => {
        total += item.precio * item.cantidad;

        const icono = item.nombre.toLowerCase().includes("gallina")
            ? "images/gallina.png"
            : "images/gallo.png";

        const itemContainer = document.createElement("div");
        itemContainer.classList.add("item-carrito");

        itemContainer.innerHTML = `
            <div class="contenido">
                <img src="${icono}" alt="icono">
                <span>${item.nombre} - $${item.precio}</span>
                <div class="controles-cantidad">
                    <button class="btn-menos" data-nombre="${item.nombre}">−</button>
                    <span class="cantidad">${item.cantidad}</span>
                    <button class="btn-mas" data-nombre="${item.nombre}">+</button>
                </div>
            </div>
        `;

        lista.appendChild(itemContainer);
    });

    contenedor.appendChild(lista);
    contenedor.innerHTML += `<p class="total-carrito">Total: $${total.toFixed(2)}</p>`;

    const btnConfirmar = document.createElement("button");
    btnConfirmar.id = "btn-confirmar";
    btnConfirmar.textContent = "Confirmar compra";

    btnConfirmar.addEventListener("click", function () {
        confirmarCompra();
    });

    contenedor.appendChild(btnConfirmar);

    document.getElementById('cerrar-carrito').addEventListener('click', () => {
        contenedor.style.display = "none";
        mostrarBotonToggle(true);
    });

    contenedor.style.display = "block";

    const botonesMas = contenedor.querySelectorAll(".btn-mas");
    const botonesMenos = contenedor.querySelectorAll(".btn-menos");

    botonesMas.forEach(btn => {
        btn.addEventListener("click", function () {
            const nombre = this.getAttribute("data-nombre");
            agregarCantidad(nombre);
        });
    });

    botonesMenos.forEach(btn => {
        btn.addEventListener("click", function () {
            const nombre = this.getAttribute("data-nombre");
            quitarCantidad(nombre);
        });
    });
}

function agregarCantidad(nombre) {
    const item = carrito.find(p => p.nombre === nombre);
    if (item) {
        item.cantidad++;
        mostrarCarrito();
    }
}

function quitarCantidad(nombre) {
    const index = carrito.findIndex(p => p.nombre === nombre);
    if (index !== -1) {
        carrito[index].cantidad--;
        if (carrito[index].cantidad <= 0) {
            carrito.splice(index, 1);
        }
        mostrarCarrito();
    }
}


function confirmarCompra() {
    if (carrito.length === 0) {
        alert("Tu carrito está vacío.");
        return;
    }
    const contenedor = document.querySelector("#carrito-contenedor");
    contenedor.innerHTML = `
        <h2>¡Gracias por tu compra!</h2>
        <p>Tu pedido ha sido confirmado exitosamente.</p>
    `;
    carrito = [];
    contenedor.style.transition = "opacity 1s";
    contenedor.style.opacity = "1";
    setTimeout(() => {
        contenedor.style.opacity = "0";
        setTimeout(() => {
            contenedor.style.display = "none";
            mostrarBotonToggle(true);
            contenedor.style.opacity = "1";
        }, 1000);
    }, 1500);
}

function crearBotonFlotante() {
    const boton = document.createElement('button');
    boton.id = "toggle-carrito";
    boton.title = "Ver carrito";
    boton.textContent = "🛒";
    document.body.appendChild(boton);

    boton.addEventListener('click', () => {
        mostrarCarrito();
        mostrarBotonToggle(false);
    });
}

function mostrarBotonToggle(mostrar) {
    const btn = document.getElementById("toggle-carrito");
    if (btn) btn.style.display = mostrar ? "block" : "none";
}
