// importar librerias
import express from "express";
import exphbs from "express-handlebars";
// importar routers
import productsRouter from "./routes/products.router.js";
import cartsRouter from "./routes/carts.router.js";
import apiRouter from "./routes/api.router.js";
// importar vistas
import viewsRouter from "./routes/views.router.js";
import { Server } from "socket.io";
import { readProducts, writeProducts } from "./utils.js";
import "./config/database.js";
import ProductModel from "./models/product.model.js";

const app = express();
const PORT = 8001;
const VERSION = '0.0.1-2024-10-09';

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
app.use("/api", apiRouter);

// Rutas
app.use("/", viewsRouter);

// Iniciamos servidor
const httpServer = app.listen(PORT, () => {
  console.log(`✅ Servidor Listo. Escuchando en el puerto ${PORT}.`);
  console.log(`✅ Versión: ${VERSION}. Backend I - Comisión 70170. Campo Gabriel.`);
});

// Iniciamos servidor de sockets
const socketServer = new Server(httpServer);

socketServer.on('connection', socket => {
  console.log('Nuevo cliente conectado.');

  socket.on('message', data => {
    console.log(`Mensaje Recibido: ${data}`);
  });

  socket.on('agregarProducto', data => {
    //console.log('agregarProducto', data);
    agregarProducto(socket, data);
  });

  socket.on('editarProducto', data => {
    //console.log('editarProducto', data);
    editarProducto(socket, data);
  });

  socket.on('borrarProducto', data => {
    //console.log('Borrar', data);
    borrarProducto(socket, data);
  });
});

async function agregarProducto(socket, datos) {
  const { code, name, price, stock, category } = datos;
  const producto = await ProductModel.create({ code, name, price, stock, category });
  //console.log(producto);

  if (!producto) socket.emit('mostrarMsj', { tipo: 'error', mensaje: 'No existe el producto que se intenta modificar.' });

  socket.emit('agregarProductoAgregado', producto);
}

async function editarProducto(socket, data) {
  try {
    //console.log('data', data);
    const id = data._id;
    delete data._id;
    const producto = await ProductModel.findByIdAndUpdate(id, data, { returnDocument: 'after' });

    if (!producto) socket.emit('mostrarMsj', { tipo: 'error', mensaje: 'No existe el producto que se intenta modificar.' });

    await producto.save();
    //console.log(producto);
    socket.emit('editarProductoEditado', producto);
  } catch (error) {
    socket.emit('mostrarMsj', { tipo: 'error', mensaje: 'Error al modificar el producto: ' + error.message });
  }
}

async function borrarProducto(socket, id) {
  try {
    const product = await ProductModel.findByIdAndDelete(id);
    if (!product) socket.emit('mostrarMsj', { tipo: 'error', mensaje: 'No existe el producto que se intenta eliminar.' });
    socket.emit('borrarProductoBorrado', id);
  } catch (error) {
    socket.emit('mostrarMsj', { tipo: 'error', mensaje: 'Error al eliminar el producto: ' + error.message });
  }
}
