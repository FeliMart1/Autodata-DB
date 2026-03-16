const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authMiddleware } = require('../middleware/auth');
const { loginLimiter, strictLimiter } = require('../middleware/rateLimiter');

// Rutas públicas (con rate limiting)
router.post('/login', loginLimiter, authController.login);
router.post('/refresh', authController.refresh);

// Rutas protegidas
router.get('/me', authMiddleware, authController.me);
router.post('/logout', authMiddleware, authController.logout);
router.post('/change-password', authMiddleware, strictLimiter, authController.changePassword);

module.exports = router;
