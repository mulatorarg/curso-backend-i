const socket = io();

const formAgregarProducto = document.getElementById('formAgregarProducto');
const formEditarProducto = document.getElementById('formEditarProducto');
const btnAgregarProducto = document.getElementById('btnAgregarProducto');
const btnEditarProducto = document.getElementById('btnEditarProducto');
const btnBorrarProducto = document.getElementById('btnBorrarProducto');

const lstProductos = document.getElementById('lstProductos');

function editarProducto(id, nombre, categoria, precio, stock, thumbnail) {
  formEditarProducto.producto_id.value = id;
  formEditarProducto.producto_nombre.value = nombre;
  formEditarProducto.producto_categoria.value = categoria;
  formEditarProducto.producto_precio.value = precio;
  formEditarProducto.producto_stock.value = stock;
  formEditarProducto.producto_thumbnail.value = thumbnail;
}

function borrarProducto(id) {
  Swal.fire({
    title: "¿Estás seguro de eliminar el producto?",
    showCancelButton: true,
    confirmButtonText: "Eliminar",
  }).then((result) => {
    if (result.isConfirmed) {
      socket.emit('borrarProducto', id);
    }
  });
}

function msjExito(texto = 'Genial!') {
  Swal.fire({
    position: "top-end",
    icon: "success",
    text: texto,
    showConfirmButton: false,
    timer: 1500,
    toast: true,
    confirmButtonText: "Aceptar"
  });
}

btnAgregarProducto.addEventListener('click', (e) => {

  if (formAgregarProducto.producto_nombre.value.length == 0) return;
  if (formAgregarProducto.producto_categoria.value.length == 0) return;
  if (formAgregarProducto.producto_precio.value.length == 0) return;
  if (formAgregarProducto.producto_stock.value.length == 0) return;

  const datos = {
    nombre: formAgregarProducto.producto_nombre.value,
    categoria: formAgregarProducto.producto_categoria.value,
    precio: formAgregarProducto.producto_precio.value,
    stock: formAgregarProducto.producto_stock.value,
  };

  socket.emit('agregarProducto', datos);
});

btnEditarProducto.addEventListener('click', (e) => {

  if (formEditarProducto.producto_id.value.length == 0) return;
  if (formEditarProducto.producto_nombre.value.length == 0) return;
  if (formEditarProducto.producto_categoria.value.length == 0) return;
  if (formEditarProducto.producto_precio.value.length == 0) return;
  if (formEditarProducto.producto_stock.value.length == 0) return;
  if (formEditarProducto.producto_thumbnail.value.length == 0) return;

  const datos = {
    id: formEditarProducto.producto_id.value,
    nombre: formEditarProducto.producto_nombre.value,
    categoria: formEditarProducto.producto_categoria.value,
    precio: formEditarProducto.producto_precio.value,
    stock: formEditarProducto.producto_stock.value,
    thumbnail: formEditarProducto.producto_thumbnail.value,
  };

  socket.emit('editarProducto', datos);
});

socket.on('agregarProductoAgregado', (producto) => {
  msjExito(`Se ha agregado un nuevo producto: ${producto.nombre}.`);

  const nuevoProductoCol = `<div id="producto_${producto.id}" class="col">
    <div class="card shadow-sm">
      <img src="../img/productos/${producto.thumbnail}" class="card-img-top" alt="${producto.nombre}">
      <div class="card-body">
        <p id="producto_${producto.id}_nombre" class="card-text">${producto.nombre}}</p>
        <div class="d-flex justify-content-between align-items-center">
          <div class="btn-group">
            <button type="button" onclick="editarProducto(${producto.id}, '${producto.nombre}', '${producto.categoria}', '${producto.precio}', '${producto.stock}', '${producto.thumbnail}')" class="btn btn-sm btn-success">Editar</button>
            <button type="button" onclick="borrarProducto(${producto.id})" class="btn btn-sm btn-danger">Eliminar</button>
          </div>
          <small id="producto_${producto.id}_precio" class="text-body-secondary">$ ${producto.precio}</small>
        </div>
      </div>
    </div>
  </div>`;
  lstProductos.innerHTML += nuevoProductoCol;
});

socket.on('editarProductoEditado', (producto) => {
  msjExito(`Se ha editado el producto: ${producto.nombre}.`);
  const elementoNombre = document.getElementById(`producto_${producto.id}_nombre`);
  if (elementoNombre) elementoNombre.innerHTML = producto.nombre;

  const elementoCategoria = document.getElementById(`producto_${producto.id}_categoria`);
  if (elementoCategoria) elementoCategoria.innerHTML = producto.categoria;

  const elementoPrecio = document.getElementById(`producto_${producto.id}_precio`);
  if (elementoPrecio) elementoPrecio.innerHTML = producto.precio;

  const elementoStock = document.getElementById(`producto_${producto.id}_stock`);
  if (elementoStock) elementoStock.innerHTML = `$ {producto.stock}`;
});

socket.on('borrarProductoBorrado', (producto) => {
  msjExito(`Se ha eliminado un producto.`);
  const elemento = document.getElementById('producto_' + producto);
  if (elemento) {
    elemento.parentNode.removeChild(elemento);
  } else {
    console.log('Elemento no encontrado');
  }
});
