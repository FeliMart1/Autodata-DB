const express = require('express');
const router = express.Router();
const preciosController = require('../controllers/preciosController');

// Rutas de precios de modelo
router.get('/modelo/:modeloId', preciosController.getPreciosByModelo);
router.get('/modelo/:modeloId/actual', preciosController.getPrecioActual);
router.post('/modelo', preciosController.createPrecio);
router.put('/:precioId', preciosController.updatePrecio);
router.delete('/:precioId', preciosController.deletePrecio);

module.exports = router;
