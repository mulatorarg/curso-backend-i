// importar librerias
import express from "express";
import exphbs from "express-handlebars";
// importar routers
import productsRouter from "./routes/products.router.js";
import cartsRouter from "./routes/carts.router.js";
// importar vistas
import viewsRouter from "./routes/views.router.js";
import { Server } from "socket.io";
import { readProducts, writeProducts } from "./utils.js";

const app = express();
const PORT = 8000;

// Server
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("./src/public"));

// Express-Handlebars
app.engine("handlebars", exphbs.engine());
app.set("view engine", "handlebars");
app.set("views", "./src/views");

// Rutas
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);

// Rutas
app.use("/", viewsRouter);

// Iniciamos servidor
const httpServer= app.listen(PORT, () => {
    console.log(`Servidor Listo y Escuchando en el puerto ${PORT}.`);
});

// Iniciamos servidor de sockets
const socketServer = new Server(httpServer);

socketServer.on('connection', socket => {
  console.log('Nuevo cliente conectado.');

  socket.on('message', data => {
    console.log(`Mensaje Recibido: ${data}`);
  });

  socket.on('agregarProducto', data => {
    const datos = JSON.stringify(data);
    agregarProducto(socket, datos);
  });

  socket.on('editarProducto', data => {
    const datos = JSON.stringify(data);
    editarProducto(socket, datos);
  });

  socket.on('borrarProducto', data => {
    const id = parseInt(data);
    console.log('Borrar', id);
    borrarProducto(socket, id);
  });

});

function idMayor(miArray) {
  if (miArray.length === 0) return 0;
  let objetoConIdMayor = miArray[0];
  for (let i = 1; i < miArray.length; i++) {
    if (miArray[i].id > objetoConIdMayor.id) {
      objetoConIdMayor = miArray[i];
    }
  }
  return objetoConIdMayor.id;
}

function agregarProducto(socket, datos) {
  const productos = readProducts();
  const id = idMayor(productos) + 1;
  let productoAgregar = JSON.parse(datos);
  productoAgregar.id = parseInt(id);
  productoAgregar.thumbnail = 'nuevo.jpeg';

  productos.push(productoAgregar);
  writeProducts(productos);
  socket.emit('agregarProductoAgregado', productoAgregar);
}

function editarProducto(socket, datos) {
  const productos = readProducts();
  const productoEditar = JSON.parse(datos);
  productoEditar.id = parseInt(productoEditar.id);
  const indice = productos.findIndex(element => element.id == productoEditar.id);
  if (indice != -1) {
    productos[indice].nombre = productoEditar.nombre;
    productos[indice].categoria = productoEditar.categoria;
    productos[indice].precio = productoEditar.precio;
    productos[indice].stock = productoEditar.stock;
    productos[indice].thumbnail = productoEditar.thumbnail;

    writeProducts(productos);
    socket.emit('editarProductoEditado', productoEditar);
    } else {
    console.log('Editar. Producto no existe.');
  }
}

function borrarProducto(socket, id) {
  const productos = readProducts();
  id = parseInt(id);
  const indice = productos.findIndex(element => element.id == id);
  if (indice) {
    productos.splice(indice, 1);
    writeProducts(productos);
    socket.emit('borrarProductoBorrado', id);
  } else {
    console.log('Eliminar. Producto no existe.');
  }
}
