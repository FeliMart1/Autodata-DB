const express = require('express');
const router = express.Router();
const {
  upload,
  importarCSV,
  listarBatches,
  obtenerBatch,
  procesarBatch,
  eliminarBatch
} = require('../controllers/importController');

// POST /api/import/claudio - Upload e importar CSV
router.post('/claudio', upload.single('file'), importarCSV);

// GET /api/import/batches - Listar todos los batches
router.get('/batches', listarBatches);

// GET /api/import/batches/:batchId - Obtener detalles de un batch
router.get('/batches/:batchId', obtenerBatch);

// POST /api/import/batches/:batchId/process - Procesar batch a tablas de trabajo
router.post('/batches/:batchId/process', procesarBatch);

// DELETE /api/import/batches/:batchId - Eliminar batch
router.delete('/batches/:batchId', eliminarBatch);

module.exports = router;
