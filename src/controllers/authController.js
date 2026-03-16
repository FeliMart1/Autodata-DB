const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const db = require('../config/db-simple');
const logger = require('../config/logger');

// Configuración de JWT
const JWT_SECRET = process.env.JWT_SECRET || 'tu_secreto_super_seguro';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'tu_secreto_refresh_super_seguro';
const JWT_EXPIRES_IN = '15m'; // Access token corto
const JWT_REFRESH_EXPIRES_IN = '7d'; // Refresh token largo

// Validación de entrada
const validateLoginInput = (username, password) => {
  const errors = [];
  
  if (!username || typeof username !== 'string' || username.trim().length === 0) {
    errors.push('Usuario requerido');
  }
  
  if (!password || typeof password !== 'string' || password.length === 0) {
    errors.push('Contraseña requerida');
  }
  
  // Validar formato de username (alfanumérico, punto, guión bajo)
  if (username && !/^[a-zA-Z0-9._-]{3,50}$/.test(username)) {
    errors.push('Formato de usuario inválido');
  }
  
  return errors;
};

// Registrar auditoría
const registrarAuditoria = async (usuarioID, username, accion, exitoso, req, mensajeError = null) => {
  try {
    const ipAddress = req.ip || req.connection.remoteAddress;
    const userAgent = req.get('user-agent') || null;
    
    await db.query(
      `EXEC sp_RegistrarAcceso 
        @UsuarioID = @usuarioID,
        @Username = @username,
        @Accion = @accion,
        @Exitoso = @exitoso,
        @IpAddress = @ipAddress,
        @UserAgent = @userAgent,
        @MensajeError = @mensajeError`,
      {
        usuarioID: usuarioID || null,
        username,
        accion,
        exitoso: exitoso ? 1 : 0,
        ipAddress,
        userAgent,
        mensajeError
      }
    );
  } catch (error) {
    logger.error('Error al registrar auditoría:', error);
  }
};

// Generar refresh token
const generateRefreshToken = () => {
  return crypto.randomBytes(64).toString('hex');
};

// Guardar refresh token en BD
const saveRefreshToken = async (usuarioID, token, req) => {
  try {
    const ipAddress = req.ip || req.connection.remoteAddress;
    const userAgent = req.get('user-agent') || null;
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 días

    await db.query(
      `INSERT INTO RefreshToken (UsuarioID, Token, ExpiresAt, DeviceInfo, IpAddress)
       VALUES (@usuarioID, @token, @expiresAt, @deviceInfo, @ipAddress)`,
      {
        usuarioID,
        token,
        expiresAt,
        deviceInfo: userAgent,
        ipAddress
      }
    );
  } catch (error) {
    logger.error('Error al guardar refresh token:', error);
    throw error;
  }
};

// POST /api/auth/login - Login de usuario
exports.login = async (req, res) => {
  const startTime = Date.now();
  let username = '';
  
  try {
    username = req.body.username?.trim();
    const password = req.body.password;

    // Validar entrada
    const validationErrors = validateLoginInput(username, password);
    if (validationErrors.length > 0) {
      await registrarAuditoria(null, username || 'unknown', 'login_fallido', false, req, validationErrors.join(', '));
      return res.status(400).json({
        success: false,
        message: 'Datos inválidos',
        errors: validationErrors
      });
    }

    // Buscar usuario - PROTECCIÓN CONTRA SQL INJECTION
    const usuarios = await db.query(
      `SELECT UsuarioID, Username, Password, Nombre, Email, Rol, Activo, FechaUltimoAcceso
       FROM Usuario 
       WHERE Username = @username AND Activo = 1`,
      { username }
    );

    const usuario = usuarios[0];
    
    // Usuario no encontrado
    if (!usuario) {
      await registrarAuditoria(null, username, 'login_fallido', false, req, 'Usuario no existe o inactivo');
      logger.warn(`Intento de login fallido - Usuario no existe: ${username} desde IP: ${req.ip}`);
      
      // Mismo mensaje genérico para evitar enumeración de usuarios
      return res.status(401).json({
        success: false,
        message: 'Credenciales inválidas'
      });
    }

    // Verificar contraseña
    const passwordValida = await bcrypt.compare(password, usuario.Password);
    
    if (!passwordValida) {
      await registrarAuditoria(usuario.UsuarioID, username, 'login_fallido', false, req, 'Contraseña incorrecta');
      logger.warn(`Intento de login fallido - Contraseña incorrecta: ${username} desde IP: ${req.ip}`);
      
      return res.status(401).json({
        success: false,
        message: 'Credenciales inválidas'
      });
    }

    // Generar tokens
    const accessToken = jwt.sign(
      { 
        id: usuario.UsuarioID, 
        username: usuario.Username,
        rol: usuario.Rol 
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    const refreshToken = generateRefreshToken();
    
    // Guardar refresh token
    await saveRefreshToken(usuario.UsuarioID, refreshToken, req);

    // Actualizar fecha de último acceso
    await db.query(
      `UPDATE Usuario SET FechaUltimoAcceso = GETDATE() WHERE UsuarioID = @usuarioID`,
      { usuarioID: usuario.UsuarioID }
    );

    // Registrar login exitoso
    await registrarAuditoria(usuario.UsuarioID, username, 'login_exitoso', true, req);

    const duration = Date.now() - startTime;
    logger.info(`Login exitoso - Usuario: ${username}, IP: ${req.ip}, Duración: ${duration}ms`);

    res.json({
      success: true,
      message: 'Login exitoso',
      token: accessToken,
      refreshToken,
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
    await registrarAuditoria(null, username || 'unknown', 'login_fallido', false, req, error.message);
    
    res.status(500).json({
      success: false,
      message: 'Error al iniciar sesión',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Error interno del servidor'
    });
  }
};

// POST /api/auth/refresh - Refrescar access token
exports.refresh = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({
        success: false,
        message: 'Refresh token requerido'
      });
    }

    // Buscar refresh token en BD
    const tokens = await db.query(
      `SELECT rt.*, u.Username, u.Rol, u.Activo
       FROM RefreshToken rt
       INNER JOIN Usuario u ON rt.UsuarioID = u.UsuarioID
       WHERE rt.Token = @token 
         AND rt.IsRevoked = 0 
         AND rt.ExpiresAt > GETDATE()
         AND u.Activo = 1`,
      { token: refreshToken }
    );

    const tokenData = tokens[0];

    if (!tokenData) {
      logger.warn(`Intento de refresh con token inválido desde IP: ${req.ip}`);
      return res.status(401).json({
        success: false,
        message: 'Refresh token inválido o expirado'
      });
    }

    // Generar nuevo access token
    const newAccessToken = jwt.sign(
      { 
        id: tokenData.UsuarioID, 
        username: tokenData.Username,
        rol: tokenData.Rol 
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    // Opcionalmente, rotar el refresh token (más seguro)
    const newRefreshToken = generateRefreshToken();
    
    // Revocar token anterior
    await db.query(
      `UPDATE RefreshToken 
       SET IsRevoked = 1, RevokedAt = GETDATE(), ReplacedByToken = @newToken
       WHERE Token = @oldToken`,
      { oldToken: refreshToken, newToken: newRefreshToken }
    );

    // Guardar nuevo refresh token
    await saveRefreshToken(tokenData.UsuarioID, newRefreshToken, req);

    // Registrar auditoría
    await registrarAuditoria(tokenData.UsuarioID, tokenData.Username, 'refresh_token', true, req);

    logger.info(`Token refrescado - Usuario: ${tokenData.Username}`);

    res.json({
      success: true,
      token: newAccessToken,
      refreshToken: newRefreshToken
    });

  } catch (error) {
    logger.error('Error al refrescar token:', error);
    res.status(500).json({
      success: false,
      message: 'Error al refrescar token',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Error interno del servidor'
    });
  }
};

// POST /api/auth/logout - Cerrar sesión
exports.logout = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    const usuario = req.user;

    if (refreshToken) {
      // Revocar refresh token
      await db.query(
        `UPDATE RefreshToken 
         SET IsRevoked = 1, RevokedAt = GETDATE()
         WHERE Token = @token AND UsuarioID = @usuarioID`,
        { token: refreshToken, usuarioID: usuario.id }
      );
    }

    // Registrar logout
    await registrarAuditoria(usuario.id, usuario.username, 'logout', true, req);

    logger.info(`Logout - Usuario: ${usuario.username}`);

    res.json({
      success: true,
      message: 'Sesión cerrada exitosamente'
    });

  } catch (error) {
    logger.error('Error en logout:', error);
    res.status(500).json({
      success: false,
      message: 'Error al cerrar sesión'
    });
  }
};

// GET /api/auth/me - Obtener información del usuario actual
exports.me = async (req, res) => {
  try {
    const usuarioID = req.user.id;
    
    // Obtener datos actualizados desde la BD
    const usuarios = await db.query(
      `SELECT UsuarioID, Username, Nombre, Email, Rol, FechaCreacion, FechaUltimoAcceso
       FROM Usuario 
       WHERE UsuarioID = @usuarioID AND Activo = 1`,
      { usuarioID }
    );

    const usuario = usuarios[0];

    if (!usuario) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }
    
    res.json({
      success: true,
      data: {
        id: usuario.UsuarioID,
        username: usuario.Username,
        nombre: usuario.Nombre,
        email: usuario.Email,
        rol: usuario.Rol,
        fechaCreacion: usuario.FechaCreacion,
        fechaUltimoAcceso: usuario.FechaUltimoAcceso
      }
    });
  } catch (error) {
    logger.error('Error al obtener usuario actual:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener información del usuario',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Error interno del servidor'
    });
  }
};

// POST /api/auth/change-password - Cambiar contraseña
exports.changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const usuario = req.user;

    // Validar entrada
    if (!oldPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Contraseña actual y nueva contraseña requeridas'
      });
    }

    // Validar longitud y complejidad de nueva contraseña
    if (newPassword.length < 8) {
      return res.status(400).json({
        success: false,
        message: 'La nueva contraseña debe tener al menos 8 caracteres'
      });
    }

    // Obtener usuario actual
    const usuarios = await db.query(
      `SELECT Password FROM Usuario WHERE UsuarioID = @usuarioID`,
      { usuarioID: usuario.id }
    );

    const usuarioData = usuarios[0];

    // Verificar contraseña actual
    const passwordValida = await bcrypt.compare(oldPassword, usuarioData.Password);
    
    if (!passwordValida) {
      await registrarAuditoria(usuario.id, usuario.username, 'cambio_password', false, req, 'Contraseña actual incorrecta');
      return res.status(401).json({
        success: false,
        message: 'Contraseña actual incorrecta'
      });
    }

    // Generar hash de nueva contraseña
    const newPasswordHash = await bcrypt.hash(newPassword, 12);

    // Actualizar contraseña
    await db.query(
      `UPDATE Usuario SET Password = @password WHERE UsuarioID = @usuarioID`,
      { password: newPasswordHash, usuarioID: usuario.id }
    );

    // Revocar todos los refresh tokens del usuario (forzar re-login)
    await db.query(
      `UPDATE RefreshToken 
       SET IsRevoked = 1, RevokedAt = GETDATE()
       WHERE UsuarioID = @usuarioID AND IsRevoked = 0`,
      { usuarioID: usuario.id }
    );

    // Registrar cambio de contraseña
    await registrarAuditoria(usuario.id, usuario.username, 'cambio_password', true, req);

    logger.info(`Contraseña cambiada - Usuario: ${usuario.username}`);

    res.json({
      success: true,
      message: 'Contraseña cambiada exitosamente. Por favor, inicie sesión nuevamente.'
    });

  } catch (error) {
    logger.error('Error al cambiar contraseña:', error);
    res.status(500).json({
      success: false,
      message: 'Error al cambiar contraseña',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Error interno del servidor'
    });
  }
};
