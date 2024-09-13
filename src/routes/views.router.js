import { Router } from 'express';
const router = Router();

// Listar productos de un carrito por ID
router.get('/', (req, res) => {
    res.render("index");
});

export default router;
