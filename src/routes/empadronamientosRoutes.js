// empadronamientosRoutes.js
// Rutas para gestión de empadronamientos

const express = require('express');
const router = express.Router();
const empadronamientosController = require('../controllers/empadronamientosController');
const { authMiddleware, requireRole } = require('../middleware/auth');

// Todas las rutas requieren autenticación
router.use(authMiddleware);

// GET /api/empadronamientos/familia - Obtener empadronamientos por familia, depto y periodo
router.get('/familia', empadronamientosController.obtenerEmpadronamientosPorFamilia);

// GET /api/empadronamientos/periodo-anterior - Obtener empadronamientos del periodo anterior
router.get('/periodo-anterior', empadronamientosController.obtenerEmpadronamientosPeriodoAnterior);

// GET /api/empadronamientos/resumen - Obtener resumen de empadronamientos
router.get('/resumen', empadronamientosController.obtenerResumenEmpadronamientos);

// GET /api/empadronamientos/modelo/:modeloId/departamento/:departamentoId/historial
router.get(
    '/modelo/:modeloId/departamento/:departamentoId/historial', 
    empadronamientosController.obtenerHistorialEmpadronamientosModelo
);

// POST /api/empadronamientos/crear-batch - Crear o actualizar empadronamientos en batch
// Requiere rol entrada_datos o admin
router.post(
    '/crear-batch', 
    requireRole('admin', 'entrada_datos'), 
    empadronamientosController.crearEmpadronamientosBatch
);

module.exports = router;
