const db = require('../config/db-simple');
const logger = require('../config/logger');

// GET /api/equipamiento/modelo/:modeloId - Obtener equipamiento por modelo
exports.getByModeloId = async (req, res) => {
  try {
    const { modeloId } = req.params;
    
    const query = `
      SELECT * FROM EquipamientoModelo
      WHERE ModeloID = ${modeloId}
    `;
    
    const equipamiento = await db.queryRaw(query);
    
    res.json({
      success: true,
      data: equipamiento[0] || null
    });
  } catch (error) {
    logger.error('Error al obtener equipamiento:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener equipamiento',
      error: error.message
    });
  }
};

// POST /api/equipamiento - Crear equipamiento para un modelo
exports.create = async (req, res) => {
  try {
    const { modeloId, ...equipamiento } = req.body;
    
    if (!modeloId) {
      return res.status(400).json({
        success: false,
        message: 'ModeloID es requerido'
      });
    }
    
    // Verificar si ya existe equipamiento para este modelo
    const existeQuery = `SELECT EquipamientoID FROM EquipamientoModelo WHERE ModeloID = ${modeloId}`;
    const existe = await db.queryRaw(existeQuery);
    
    if (existe.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Este modelo ya tiene equipamiento cargado'
      });
    }
    
    // Construir query dinámicamente
    const campos = ['ModeloID'];
    const valores = [modeloId];
    
    const camposBooleanos = [
      'AirbagConductor', 'AirbagPasajero', 'AirbagLaterales', 'AirbagCortina',
      'ABS', 'ControlEstabilidad', 'ControlTraccion', 'AsistenciaArranque', 'AnclajesISOFIX',
      'AireAcondicionado', 'Climatizador', 'AlzavidriosDel', 'AlzavidriosTras',
      'CierreCentralizado', 'EspejosElectricos', 'ControlCrucero', 'ComputadoraABordo',
      'LlantasAleacion', 'FarosLED', 'FarosXenon', 'Neblineros', 'TechoSolar',
      'TapizCuero', 'AsientosElectricos', 'VolanteCuero', 'PantallaTouch',
      'AppleCarPlay', 'AndroidAuto', 'Bluetooth', 'GPS', 'PuertoUSB',
      'CamaraRetroceso', 'SensoresEstacionamiento', 'NeumaticoRepuestoCompleto',
      'Keyless', 'EncendidoBoton', 'StartStop'
    ];
    
    for (const campo of camposBooleanos) {
      if (equipamiento[campo] !== undefined) {
        campos.push(campo);
        valores.push(equipamiento[campo] ? '1' : '0');
      }
    }
    
    const insertQuery = `
      INSERT INTO EquipamientoModelo (${campos.join(', ')})
      VALUES (${valores.join(', ')});
    `;
    
    await db.queryRaw(insertQuery);
    
    // Obtener el equipamiento creado
    const creado = await db.queryRaw(`SELECT * FROM EquipamientoModelo WHERE ModeloID = ${modeloId}`);
    
    logger.info(`Equipamiento creado para modelo ${modeloId}`);
    
    res.status(201).json({
      success: true,
      message: 'Equipamiento creado exitosamente',
      data: creado[0]
    });
  } catch (error) {
    logger.error('Error al crear equipamiento:', error);
    res.status(500).json({
      success: false,
      message: 'Error al crear equipamiento',
      error: error.message
    });
  }
};

// PUT /api/equipamiento/modelo/:modeloId - Actualizar equipamiento
exports.update = async (req, res) => {
  try {
    const { modeloId } = req.params;
    const equipamiento = req.body;
    
    // Verificar si existe
    const existeQuery = `SELECT EquipamientoID FROM EquipamientoModelo WHERE ModeloID = ${modeloId}`;
    const existe = await db.queryRaw(existeQuery);
    
    if (existe.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No se encontró equipamiento para este modelo'
      });
    }
    
    // Construir SET clause
    const setClauses = [];
    const camposBooleanos = [
      'AirbagConductor', 'AirbagPasajero', 'AirbagLaterales', 'AirbagCortina',
      'ABS', 'ControlEstabilidad', 'ControlTraccion', 'AsistenciaArranque', 'AnclajesISOFIX',
      'AireAcondicionado', 'Climatizador', 'AlzavidriosDel', 'AlzavidriosTras',
      'CierreCentralizado', 'EspejosElectricos', 'ControlCrucero', 'ComputadoraABordo',
      'LlantasAleacion', 'FarosLED', 'FarosXenon', 'Neblineros', 'TechoSolar',
      'TapizCuero', 'AsientosElectricos', 'VolanteCuero', 'PantallaTouch',
      'AppleCarPlay', 'AndroidAuto', 'Bluetooth', 'GPS', 'PuertoUSB',
      'CamaraRetroceso', 'SensoresEstacionamiento', 'NeumaticoRepuestoCompleto',
      'Keyless', 'EncendidoBoton', 'StartStop'
    ];
    
    for (const campo of camposBooleanos) {
      if (equipamiento[campo] !== undefined) {
        setClauses.push(`${campo} = ${equipamiento[campo] ? '1' : '0'}`);
      }
    }
    
    if (setClauses.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No hay datos para actualizar'
      });
    }
    
    setClauses.push('FechaActualizacion = GETDATE()');
    
    const updateQuery = `
      UPDATE EquipamientoModelo
      SET ${setClauses.join(', ')}
      WHERE ModeloID = ${modeloId}
    `;
    
    await db.queryRaw(updateQuery);
    
    // Obtener equipamiento actualizado
    const actualizado = await db.queryRaw(`SELECT * FROM EquipamientoModelo WHERE ModeloID = ${modeloId}`);
    
    logger.info(`Equipamiento actualizado para modelo ${modeloId}`);
    
    res.json({
      success: true,
      message: 'Equipamiento actualizado exitosamente',
      data: actualizado[0]
    });
  } catch (error) {
    logger.error('Error al actualizar equipamiento:', error);
    res.status(500).json({
      success: false,
      message: 'Error al actualizar equipamiento',
      error: error.message
    });
  }
};

// DELETE /api/equipamiento/:id - Eliminar equipamiento
exports.delete = async (req, res) => {
  try {
    const { id } = req.params;
    
    const deleteQuery = `DELETE FROM EquipamientoModelo WHERE EquipamientoID = ${id}`;
    await db.queryRaw(deleteQuery);
    
    logger.info(`Equipamiento eliminado: ID ${id}`);
    
    res.json({
      success: true,
      message: 'Equipamiento eliminado exitosamente'
    });
  } catch (error) {
    logger.error('Error al eliminar equipamiento:', error);
    res.status(500).json({
      success: false,
      message: 'Error al eliminar equipamiento',
      error: error.message
    });
  }
};
