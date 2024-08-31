import express from "express";
import exphbs from "express-handlebars";
import productsRouter from "./routes/products.router.js";
import cartsRouter from "./routes/carts.router.js";

const app = express();
const PORT = 8080;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("./src/public"));

// Express-Handlebars
app.engine("handlebars", exphbs.engine());
app.set("view engine", "handlebars");
app.set("views", "./src/views");

app.use('/api', productsRouter);
app.use('/api', cartsRouter);

app.listen(PORT, () => {
    console.log(`Servidor Listo y Escuchando en el puerto ${PORT}.`);
});
