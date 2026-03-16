// departamentosRoutes.js
// Rutas para gestión de departamentos

const express = require('express');
const router = express.Router();
const departamentosController = require('../controllers/departamentosController');
const { authMiddleware } = require('../middleware/auth');

// Todas las rutas requieren autenticación
router.use(authMiddleware);

// GET /api/departamentos - Obtener todos los departamentos
router.get('/', departamentosController.obtenerDepartamentos);

// GET /api/departamentos/:id - Obtener un departamento por ID
router.get('/:id', departamentosController.obtenerDepartamentoPorId);

module.exports = router;
