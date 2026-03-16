// ventasRoutes.js
// Rutas para gestión de ventas

const express = require('express');
const router = express.Router();
const ventasController = require('../controllers/ventasController');
const { authMiddleware, requireRole } = require('../middleware/auth');

// Todas las rutas requieren autenticación
router.use(authMiddleware);

// GET /api/ventas/familia - Obtener ventas por familia y periodo
router.get('/familia', ventasController.obtenerVentasPorFamilia);

// GET /api/ventas/periodo-anterior - Obtener ventas del periodo anterior
router.get('/periodo-anterior', ventasController.obtenerVentasPeriodoAnterior);

// GET /api/ventas/resumen - Obtener resumen de ventas
router.get('/resumen', ventasController.obtenerResumenVentas);

// GET /api/ventas/modelo/:modeloId/historial - Obtener historial de un modelo
router.get('/modelo/:modeloId/historial', ventasController.obtenerHistorialVentasModelo);

// POST /api/ventas/crear-batch - Crear o actualizar ventas en batch
// Requiere rol entrada_datos o admin
router.post(
    '/crear-batch', 
    requireRole('admin', 'entrada_datos'), 
    ventasController.crearVentasBatch
);

module.exports = router;
