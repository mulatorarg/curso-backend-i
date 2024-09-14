import { Router } from 'express';
import { readProducts } from '../utils.js';
const router = Router();

// Listar productos de un carrito por ID
router.get('/', (req, res) => {
  const titulo = 'Nuestros Productos';
  const productos = readProducts();
  res.render("home", {titulo, productos});
});

// Listar productos de un carrito por ID
router.get('/realtimeproducts', (req, res) => {
  const titulo = 'Gestión de Productos en RealTime 😎';
  const productos = readProducts();
  res.render("realtimeproducts", {titulo, productos});
});

export default router;
