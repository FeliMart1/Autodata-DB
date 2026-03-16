const express = require('express');
const cors = require('cors');
const path = require('path');
const logger = require('./config/logger');
const routes = require('./routes');
const { apiLimiter } = require('./middleware/rateLimiter');

const app = express();

// Middlewares de seguridad
app.use(cors({
  origin: ['http://localhost:3001', 'https://2410773a5382.ngrok-free.app'],
  credentials: true
}));

// Rate limiting general para toda la API
app.use('/api/', apiLimiter);

app.use(express.json({ limit: '10mb' })); // Limitar tamaño de payload
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Seguridad: Ocultar header X-Powered-By
app.disable('x-powered-by');

// Servir archivos estáticos (frontend)
app.use(express.static(path.join(__dirname, '../public')));

// Logging de requests
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.path} - IP: ${req.ip}`);
  next();
});

// Rutas API
app.use('/api', routes);

// Ruta raíz
app.get('/', (req, res) => {
  res.json({
    name: 'Autodata API',
    version: '1.0.0',
    status: 'running',
    endpoints: {
      health: '/api/health',
      marcas: '/api/marcas',
      modelos: '/api/modelos'
    }
  });
});

// Manejo de errores 404
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint no encontrado'
  });
});

// Manejo de errores global
app.use((err, req, res, next) => {
  logger.error('Error no manejado:', err);
  res.status(500).json({
    success: false,
    message: 'Error interno del servidor',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

module.exports = app;
