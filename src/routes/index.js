const express = require('express');
const router = express.Router();

const authRoutes = require('./authRoutes');
const marcasRoutes = require('./marcasRoutes');
const modelosRoutes = require('./modelosRoutes');
const equipamientoRoutes = require('./equipamientoRoutes');
const importRoutes = require('./importRoutes');
const preciosRoutes = require('./preciosRoutes');
const departamentosRoutes = require('./departamentosRoutes');
const familiasRoutes = require('./familias');
const ventasRoutes = require('./ventasRoutes');
const empadronamientosRoutes = require('./empadronamientosRoutes');
const exportRoutes = require('./exportRoutes');
const { authMiddleware } = require('../middleware/auth');

// Rutas públicas
router.use('/auth', authRoutes);

// Rutas protegidas - requieren autenticación
router.use('/marcas', authMiddleware, marcasRoutes);
router.use('/modelos', authMiddleware, modelosRoutes);
router.use('/equipamiento', authMiddleware, equipamientoRoutes);
router.use('/import', authMiddleware, importRoutes);
router.use('/precios', authMiddleware, preciosRoutes);
router.use('/departamentos', authMiddleware, departamentosRoutes);
router.use('/familias', authMiddleware, familiasRoutes);
router.use('/ventas', authMiddleware, ventasRoutes);
router.use('/empadronamientos', authMiddleware, empadronamientosRoutes);
router.use('/export', authMiddleware, exportRoutes);

// Health check
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'API Autodata funcionando correctamente',
    timestamp: new Date().toISOString()
  });
});

module.exports = router;
