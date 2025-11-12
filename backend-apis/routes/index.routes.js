import { Router } from 'express';
import { getDni } from '../controllers/reniec.controller.js';
import { getRuc } from '../controllers/sunat.controller.js';
import { getTipoCambio } from '../controllers/currency.controller.js';
import { register, login } from '../controllers/auth.controller.js';
import { getProductos, createProducto } from '../controllers/producto.controller.js';
import { postComprobante, getComprobantes, getComprobante } from '../controllers/comprobante.controller.js';
import authMiddleware from '../middleware/auth.middleware.js';

const router = Router();

// Define las URLs de nuestra API
router.get('/reniec/:dni', getDni);
router.get('/sunat/:ruc', getRuc);
router.get('/currency/usd-pen', getTipoCambio);

// Rutas de Autenticación
router.post('/auth/register', register);
router.post('/auth/login', login);

// --- RUTAS DE PRODUCTOS (Protegidas) ---
router.get('/productos', authMiddleware, getProductos);
router.post('/productos', authMiddleware, createProducto);

// --- RUTAS DE COMPROBANTES (Protegidas) ---
router.post('/comprobantes', authMiddleware, postComprobante);
router.get('/comprobantes', authMiddleware, getComprobantes);
router.get('/comprobantes/:id', authMiddleware, getComprobante);

export default router;