const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });
const marcasController = require('../controllers/marcasController');

router.get('/', marcasController.getAll);
router.post('/import', upload.single('file'), marcasController.importarExcel);
router.get('/:id', marcasController.getById);
router.post('/', marcasController.create);
router.put('/:id', marcasController.update);
router.delete('/:id', marcasController.delete);

module.exports = router;
