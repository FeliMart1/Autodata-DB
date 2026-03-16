// routes/familias.js
// Rutas para gestión de familias

const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/auth');
const familiasController = require('../controllers/familiasController');

// Todas las rutas requieren autenticación
router.use(authMiddleware);

// GET /api/familias - Obtener todas las familias (opcionalmente filtradas por marca)
router.get('/', familiasController.obtenerFamilias);

// GET /api/familias/:id - Obtener una familia por ID
router.get('/:id', familiasController.obtenerFamiliaPorId);

// POST /api/familias - Crear una nueva familia
router.post('/', familiasController.crearFamilia);

// PUT /api/familias/:id - Actualizar una familia
router.put('/:id', familiasController.actualizarFamilia);

// DELETE /api/familias/:id - Eliminar (desactivar) una familia
router.delete('/:id', familiasController.eliminarFamilia);

module.exports = router;
