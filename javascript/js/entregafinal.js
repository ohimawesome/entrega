function cargarYIndexarProductos() {
  fetch('productos.json') // Cambiamos a la nueva ruta del archivo JSON
    .then(response => response.json())
    .then(data => {
      const productosIndexados = indexarProductosPorId(data);
      mostrarProductos(productosIndexados);
      asignarEventoCalcularTotal(productosIndexados);
    })
    .catch(error => console.error('Error al cargar el archivo productos.json:', error));
}

function indexarProductosPorId(productos) {
  const indice = {};
  productos.forEach(producto => {
    indice[producto.id] = producto;
  });
  return indice;
}

function mostrarProductos(productosIndexados) {
  const listaProductos = document.getElementById("ropa");
  listaProductos.innerHTML = '';
  Object.values(productosIndexados).forEach(producto => {
    const listItem = document.createElement("li");
    listItem.className = "list-group-item";
    listItem.innerHTML = `
        Color: ${producto.color}, Talla: ${producto.size}, Precio: ${producto.price.toFixed(2)}
        <input type="number" min="0" id="cantidad-${producto.id}" value="0" style="margin-left: 10px;">
      `;
    listaProductos.appendChild(listItem);
  });
}

function asignarEventoCalcularTotal(productosIndexados) {
  const calcularTotalBtn = document.getElementById("calcularTotalBtn");
  if (calcularTotalBtn) {
    calcularTotalBtn.addEventListener("click", () => calcularTotal(productosIndexados));
  } else {
    console.error("No se encontró el botón para calcular el total");
  }
}

function calcularTotal(productosIndexados) {
  let total = 0;
  Object.values(productosIndexados).forEach(producto => {
    const cantidadInput = document.getElementById(`cantidad-${producto.id}`);
    const cantidad = parseInt(cantidadInput.value, 10);
    if (!isNaN(cantidad) && cantidad > 0) {
      total += producto.price * cantidad;
    }
  });

  Swal.fire({
    title: 'Total de la compra',
    text: `El total es de: ${total.toFixed(2)}`,
    icon: 'success',
    confirmButtonText: 'Aceptar'
  });

  guardarEnStorage("totalCompra", total);
}

function guardarEnStorage(clave, valor) {
  localStorage.setItem(clave, JSON.stringify(valor));
}

function recuperarDeStorage(clave) {
  const valor = localStorage.getItem(clave);
  return JSON.parse(valor);
}

document.addEventListener("DOMContentLoaded", () => {
  cargarYIndexarProductos();
});
