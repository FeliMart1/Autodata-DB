const express = require('express');
const router = express.Router();
const equipamientoController = require('../controllers/equipamientoController');
const { authMiddleware } = require('../middleware/auth');

// Todas las rutas requieren autenticación
router.use(authMiddleware);

// GET /api/equipamiento/modelo/:modeloId - Obtener equipamiento por modelo
router.get('/modelo/:modeloId', equipamientoController.getByModeloId);

// POST /api/equipamiento - Crear equipamiento
router.post('/', equipamientoController.create);

// PUT /api/equipamiento/modelo/:modeloId - Actualizar equipamiento
router.put('/modelo/:modeloId', equipamientoController.update);

// DELETE /api/equipamiento/:id - Eliminar equipamiento
router.delete('/:id', equipamientoController.delete);

module.exports = router;
