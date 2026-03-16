const jwt = require('jsonwebtoken');
const db = require('../config/db-simple');
const logger = require('../config/logger');

const JWT_SECRET = process.env.JWT_SECRET || 'tu_secreto_super_seguro';

// Middleware para verificar JWT token
const authMiddleware = async (req, res, next) => {
  try {
    // Obtener token del header
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: 'Token no proporcionado'
      });
    }

    // Formato: "Bearer TOKEN"
    const parts = authHeader.split(' ');
    
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      return res.status(401).json({
        success: false,
        message: 'Formato de token inválido'
      });
    }

    const token = parts[1];

    // Verificar token
    jwt.verify(token, JWT_SECRET, async (err, decoded) => {
      if (err) {
        logger.warn(`Token inválido o expirado. Error: ${err.message}, IP: ${req.ip}`);
        
        return res.status(401).json({
          success: false,
          message: 'Token inválido o expirado',
          code: err.name === 'TokenExpiredError' ? 'TOKEN_EXPIRED' : 'TOKEN_INVALID'
        });
      }

      // Verificar que el usuario sigue activo en la BD
      try {
        const usuarios = await db.query(
          `SELECT UsuarioID, Username, Nombre, Email, Rol, Activo 
           FROM Usuario 
           WHERE UsuarioID = @usuarioID`,
          { usuarioID: decoded.id }
        );

        const usuario = usuarios[0];

        if (!usuario || !usuario.Activo) {
          logger.warn(`Intento de acceso con token válido pero usuario inactivo: ${decoded.username}`);
          return res.status(401).json({
            success: false,
            message: 'Usuario no autorizado'
          });
        }

        // Agregar información completa del usuario al request
        req.user = {
          id: usuario.UsuarioID,
          username: usuario.Username,
          nombre: usuario.Nombre,
          email: usuario.Email,
          rol: usuario.Rol
        };
        
        next();
      } catch (dbError) {
        logger.error('Error al verificar usuario en BD:', dbError);
        return res.status(500).json({
          success: false,
          message: 'Error al verificar autenticación'
        });
      }
    });

  } catch (error) {
    logger.error('Error en authMiddleware:', error);
    res.status(500).json({
      success: false,
      message: 'Error al verificar token'
    });
  }
};

// Middleware para verificar roles específicos
const requireRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'No autenticado'
      });
    }

    if (!roles.includes(req.user.rol)) {
      logger.warn(`Acceso denegado - Usuario: ${req.user.username}, Rol: ${req.user.rol}, Roles requeridos: ${roles.join(', ')}`);
      return res.status(403).json({
        success: false,
        message: 'No tiene permisos para esta acción',
        requiredRoles: roles
      });
    }

    next();
  };
};

// Middleware para verificar que el usuario es admin
const requireAdmin = requireRole('admin');

// Middleware para verificar que el usuario es admin o aprobación
const requireAdminOrAprobacion = requireRole('admin', 'aprobacion');

module.exports = {
  authMiddleware,
  requireRole,
  requireAdmin,
  requireAdminOrAprobacion
};
