const rateLimit = require('express-rate-limit');
const logger = require('../config/logger');

// Rate limiter para endpoints de login
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 20, // Máximo 20 intentos (aumentado de 5 para desarrollo)
  message: {
    success: false,
    message: 'Demasiados intentos de login. Por favor, intente nuevamente en 15 minutos.',
    retryAfter: '15 minutos'
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  
  // Personalizar el mensaje según los intentos restantes
  handler: (req, res) => {
    logger.warn(`Rate limit excedido para IP: ${req.ip}, Usuario: ${req.body?.username || 'N/A'}`);
    
    res.status(429).json({
      success: false,
      message: 'Demasiados intentos de inicio de sesión. Por favor, espere antes de intentar nuevamente.',
      retryAfter: '15 minutos'
    });
  },
  
  // Omitir el rate limit si es exitoso (reduce el contador en logins exitosos)
  skipSuccessfulRequests: true,
  skipFailedRequests: false,
});

// Rate limiter general para la API
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 500, // Máximo 500 requests por ventana (aumentado de 100 para desarrollo)
  message: {
    success: false,
    message: 'Demasiadas solicitudes desde esta IP. Por favor, intente más tarde.'
  },
  standardHeaders: true,
  legacyHeaders: false,
  
  handler: (req, res) => {
    logger.warn(`API rate limit excedido para IP: ${req.ip}, Ruta: ${req.path}`);
    
    res.status(429).json({
      success: false,
      message: 'Ha excedido el límite de solicitudes. Por favor, intente más tarde.'
    });
  }
});

// Rate limiter estricto para operaciones sensibles (cambio de contraseña, etc.)
const strictLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hora
  max: 3, // Máximo 3 intentos por hora
  message: {
    success: false,
    message: 'Demasiados intentos. Por favor, intente nuevamente en 1 hora.'
  },
  standardHeaders: true,
  legacyHeaders: false,
  
  handler: (req, res) => {
    logger.warn(`Strict rate limit excedido para IP: ${req.ip}, Ruta: ${req.path}`);
    
    res.status(429).json({
      success: false,
      message: 'Ha excedido el límite de intentos para esta operación. Intente nuevamente en 1 hora.'
    });
  }
});

module.exports = {
  loginLimiter,
  apiLimiter,
  strictLimiter
};
