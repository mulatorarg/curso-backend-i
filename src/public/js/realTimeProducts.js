const socket = io();

const datosProducto = {};

const formProducto = document.getElementById('formProducto');
const btnGuardarProducto = document.getElementById('btnGuardarProducto');
const btnBorrarProducto = document.getElementById('btnBorrarProducto');

btnGuardarProducto.addEventListener('click', (e)=> {
  console.log("verificando valores");

  if (formProducto.producto_id.value.length == 0 ) return;
  if (formProducto.producto_nombre.value.length == 0 ) return;

  console.log('valores correctos, enviados');
  const datos = {
    id: formProducto.producto_id.value,
    nombre: formProducto.producto_nombre.value,
  };

  socket.emit('crearProducto', datos);
});





//socket.emit('message', 'soy un mensaje');
