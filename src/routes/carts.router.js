import { Router } from 'express';
import { readCarts, writeCarts } from '../utils.js';

const router = Router();

// Crear un nuevo carrito
router.post('/', (req, res) => {
    const carts = readCarts();
    const newCart = {
        id: String(carts.length + 1),
        products: []
    };

    carts.push(newCart);
    writeCarts(carts);
    res.status(201).json(newCart);
});

// Listar productos de un carrito por ID
router.get('/:cid', (req, res) => {
    const carts = readCarts();
    const cart = carts.find(c => c.id === req.params.cid);
    if (!cart) {
        return res.status(404).json({ message: 'Carrito no encontrado' });
    }
    res.json(cart.products);
});

// Agregar un producto al carrito
router.post('/:cid/product/:pid', (req, res) => {
    const carts = readCarts();
    const cart = carts.find(c => c.id === req.params.cid);
    if (!cart) {
        return res.status(404).json({ message: 'Carrito no encontrado' });
    }

    const existingProduct = cart.products.find(p => p.product === req.params.pid);
    if (existingProduct) {
        existingProduct.quantity += 1;
    } else {
        cart.products.push({ product: req.params.pid, quantity: 1 });
    }

    writeCarts(carts);
    res.status(201).json(cart);
});

export default router;
