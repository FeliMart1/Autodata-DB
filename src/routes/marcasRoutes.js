const express = require('express');
const router = express.Router();
const marcasController = require('../controllers/marcasController');

router.get('/', marcasController.getAll);
router.get('/:id', marcasController.getById);
router.post('/', marcasController.create);
router.put('/:id', marcasController.update);
router.delete('/:id', marcasController.delete);

module.exports = router;
