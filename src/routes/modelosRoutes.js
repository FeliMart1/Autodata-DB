const express = require('express');
const router = express.Router();
const modelosController = require('../controllers/modelosController');

router.get('/', modelosController.getAll);
router.get('/codigo/:codigoAutodata', modelosController.getByCodigoAutodata);
router.get('/:id', modelosController.getById);
router.post('/', modelosController.create);
router.put('/:id', modelosController.update);
router.delete('/:id', modelosController.delete);

// Workflow endpoints
router.post('/:id/mark-minimos', modelosController.markMinimos);
router.post('/:id/send-review', modelosController.sendReview);
router.post('/:id/approve', modelosController.approve);

module.exports = router;
