const socket = io();

const formAddProduct = document.getElementById('formAddProduct');
const formEditProduct = document.getElementById('formEditProduct');
const btnAddProduct = document.getElementById('btnAddProduct');
const btnEditProduct = document.getElementById('btnEditProduct');
const btnDeleteProduct = document.getElementById('btnDeleteProduct');

const lstProductos = document.getElementById('lstProductos');

function editProduct(id, name, category, price, stock, thumbnail) {
  formEditProduct.product_id.value = id;
  formEditProduct.product_name.value = name;
  formEditProduct.product_category.value = category;
  formEditProduct.product_price.value = price;
  formEditProduct.product_stock.value = stock;
  formEditProduct.product_thumbnail.value = thumbnail;
  formEditProduct.product_name.focus();
}

function deleteProduct(id) {
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

function mostrarMsj(tipo = 'success', texto = 'Genial!') {
  Swal.fire({
    position: "top-end",
    icon: tipo,
    text: texto,
    showConfirmButton: false,
    timer: 1500,
    toast: true,
    confirmButtonText: "Aceptar"
  });
}

btnAddProduct.addEventListener('click', (e) => {

  if (formAddProduct.product_name.value.length == 0) return;
  if (formAddProduct.product_category.value.length == 0) return;
  if (formAddProduct.product_price.value.length == 0) return;
  if (formAddProduct.product_stock.value.length == 0) return;

  const datos = {
    name: formAddProduct.product_name.value,
    category: formAddProduct.product_category.value,
    price: formAddProduct.product_price.value,
    stock: formAddProduct.product_stock.value,
  };

  socket.emit('agregarProducto', datos);
});

btnEditProduct.addEventListener('click', (e) => {

  if (formEditProduct.product_id.value.length == 0) return;
  if (formEditProduct.product_name.value.length == 0) return;
  if (formEditProduct.product_category.value.length == 0) return;
  if (formEditProduct.product_price.value.length == 0) return;
  if (formEditProduct.product_stock.value.length == 0) return;
  if (formEditProduct.product_thumbnail.value.length == 0) return;

  const datos = {
    _id: formEditProduct.product_id.value,
    name: formEditProduct.product_name.value,
    category: formEditProduct.product_category.value,
    price: formEditProduct.product_price.value,
    stock: formEditProduct.product_stock.value,
    thumbnail: formEditProduct.product_thumbnail.value,
  };

  socket.emit('editarProducto', datos);
});

socket.on('agregarProductoSuccess', (producto) => {
  mostrarMsj('success', `Se ha agregado un nuevo producto: ${producto.name}.`);

  const nuevoProductoCol = `<div id="product_${producto._id}" class="col">
    <div class="card shadow-sm">
      <img src="../img/productos/${producto.thumbnail}" class="card-img-top" alt="${producto.name}">
      <div class="card-body">
        <p id="product_${producto._id}_name" class="card-text">${producto.name}}</p>
        <div class="d-flex justify-content-between align-items-center">
          <div class="btn-group">
            <button type="button" onclick="editarProducto('${producto._id}', '${producto.name}', '${producto.category}', '${producto.price}', '${producto.stock}', '${producto.thumbnail}')" class="btn btn-sm btn-success">Editar</button>
            <button type="button" onclick="borrarProducto('${producto._id}')" class="btn btn-sm btn-danger">Eliminar</button>
          </div>
          <small id="product_${producto._id}_price" class="text-body-secondary">$ ${producto.price}</small>
        </div>
      </div>
    </div>
  </div>`;
  lstProductos.innerHTML += nuevoProductoCol;
});

socket.on('editarProductoSuccess', (producto) => {
  mostrarMsj('success', `Se ha editado el producto: ${producto.name}.`);
  const elementoName = document.getElementById(`product_${producto._id}_name`);
  if (elementoName) elementoName.innerHTML = producto.name;

  const elementoCategory = document.getElementById(`product_${producto._id}_category`);
  if (elementoCategory) elementoCategory.innerHTML = producto.category;

  const elementoPrice = document.getElementById(`product_${producto._id}_price`);
  if (elementoPrice) elementoPrice.innerHTML = producto.price;

  const elementoStock = document.getElementById(`product_${producto._id}_stock`);
  if (elementoStock) elementoStock.innerHTML = `$ {producto.stock}`;
});

socket.on('borrarProductoSuccess', (producto) => {
  mostrarMsj('success', `Se ha eliminado un producto.`);
  const elemento = document.getElementById('product_' + producto);
  if (elemento) {
    elemento.parentNode.removeChild(elemento);
  } else {
    console.log('Elemento no encontrado');
  }
});

socket.on('mostrarMsj', (data) => {
  mostrarMsj(data.tipo, data.mensaje);
});
