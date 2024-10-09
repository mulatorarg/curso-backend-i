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

function agregarProducto(socket, datos) {
  const productos = readProducts();
  let productoAgregar = JSON.parse(datos);
  productoAgregar.thumbnail = 'nuevo.jpeg';

  productos.push(productoAgregar);
  writeProducts(productos);
  socket.emit('agregarProductoAgregado', productoAgregar);
}

async function editarProducto(socket, productUpdated) {
  try {
    console.log('productUpdated', productUpdated);
    const id = productUpdated._id;
    delete productUpdated._id;
    const product = await ProductModel.findByIdAndUpdate(id, productUpdated, {returnDocument: 'after'});

    console.log('producto actualizado', product);

    if (!product) return null;

    await product.save();
    console.log("Editar. Producto actualizado correctamente.");
    socket.emit('editarProductoEditado', productoEditar);
  } catch (error) {
    console.log('Editar Producto. Error: ' + error.message);
    return null;
  }
}

async function borrarProducto(socket, id) {
  try {
    const product = await ProductModel.findByIdAndDelete(id);

    if (!product) return null;

    console.log('Eliminar. Producto no existe.');
    socket.emit('borrarProductoBorrado', id);
  } catch (error) {
    console.log('Eliminar. Producto no existe.');
  }
}
