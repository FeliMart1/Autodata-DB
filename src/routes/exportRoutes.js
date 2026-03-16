const express = require('express');
const router = express.Router();
const exportController = require('../controllers/exportController');

router.get('/ventas', exportController.exportarVentasExcel);
router.get('/empadronamientos', exportController.exportarEmpadronamientosExcel);

module.exports = router;
