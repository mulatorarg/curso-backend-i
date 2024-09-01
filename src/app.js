const express = require("express");
const app = express();
const PORT = 8080;

const productsRouter = require("./routes/products.router.js");
const cartsRouter = require("./routes/carts.router.js");

app.use(express.json());
app.use("/api", productsRouter);
app.use("/api", cartsRouter);

app.listen(PORT, () => {
    console.log(`Servidor Listo y Escuchando en el puerto ${PORT}.`);
});
