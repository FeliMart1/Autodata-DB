const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const db = require('../config/db-simple');
const logger = require('../config/logger');

const JWT_SECRET = process.env.JWT_SECRET || 'tu_secreto_super_seguro';
const JWT_EXPIRES_IN = '24h';

// POST /api/auth/login - Login de usuario
exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: 'Usuario y contraseña requeridos'
      });
    }

    // Buscar usuario (crear tabla si no existe)
    const query = `
      SELECT * FROM Usuario 
      WHERE Username = N'${username}' AND Activo = 1
    `;
    
    let usuarios;
    try {
      usuarios = await db.queryRaw(query);
    } catch (err) {
      logger.error('Error al buscar usuario:', err);
      return res.status(500).json({
        success: false,
        message: 'Error al buscar usuario en la base de datos'
      });
    }

    const usuario = usuarios[0];
    
    if (!usuario) {
      return res.status(401).json({
        success: false,
        message: 'Credenciales inválidas'
      });
    }

    // Verificar contraseña
    const passwordValida = await bcrypt.compare(password, usuario.Password);
    
    if (!passwordValida) {
      return res.status(401).json({
        success: false,
        message: 'Credenciales inválidas'
      });
    }

    // Generar token JWT
    const token = jwt.sign(
      { 
        id: usuario.UsuarioID, 
        username: usuario.Username,
        rol: usuario.Rol 
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    logger.info(`Usuario ${username} inició sesión exitosamente`);

    res.json({
      success: true,
      message: 'Login exitoso',
      token,
      user: {
        id: usuario.UsuarioID,
        username: usuario.Username,
        nombre: usuario.Nombre,
        email: usuario.Email,
        rol: usuario.Rol
      }
    });

  } catch (error) {
    logger.error('Error en login:', error);
    res.status(500).json({
      success: false,
      message: 'Error al iniciar sesión',
      error: error.message
    });
  }
};

// GET /api/auth/me - Obtener información del usuario actual
exports.me = async (req, res) => {
  try {
    const usuario = req.user;
    
    res.json({
      success: true,
      data: {
        id: usuario.UsuarioID,
        username: usuario.Username,
        nombre: usuario.Nombre,
        email: usuario.Email,
        rol: usuario.Rol
      }
    });
  } catch (error) {
    logger.error('Error al obtener usuario actual:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener información del usuario',
      error: error.message
    });
  }
};
