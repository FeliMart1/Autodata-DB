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
    let data = equipamiento[0] || null;
    
    // Si existe data en formato JSON dentro de OtrosDatos, la parseamos y mezclamos
    if (data && data.OtrosDatos) {
      try {
        const extraData = JSON.parse(data.OtrosDatos);
        data = { ...extraData, ...data }; // Las columnas de base de datos tienen prioridad
      } catch (e) {
        logger.error('Error parseando OtrosDatos en equipamiento:', e);
      }
    }

    res.json({
      success: true,
      data: data
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

// Funci\u00F3n de ayuda para obtener columnas
const getDBColumns = async () => {
    const cols = await db.queryRaw("SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME='EquipamientoModelo'");
    return cols.map(c => c.COLUMN_NAME);
};

// POST /api/equipamiento - Crear equipamiento para un modelo
exports.create = async (req, res) => {
  try {
    const { modeloId, ...equipamiento } = req.body;

    if (!modeloId) {
      return res.status(400).json({
        success: false,
        message: 'ModeloId es requerido'
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

    const dbCols = await getDBColumns();
    const columnasToInsert = ['ModeloID'];
    const valoresToInsert = [modeloId];

    // Siempre guardamos el payload crudo en OtrosDatos por si cambian las columnas
    if (dbCols.includes('OtrosDatos')) {
        columnasToInsert.push('OtrosDatos');
        const safeJson = JSON.stringify(equipamiento).replace(/'/g, "''");
        valoresToInsert.push(`'${safeJson}'`);
    }

    // Insertar columnas que existan en la base de datos
    for (const key of Object.keys(equipamiento)) {
      if (dbCols.includes(key) && key !== 'ModeloID' && key !== 'OtrosDatos' && key !== 'EquipamientoID' && key !== 'FechaModificacion' && key !== 'FechaActualizacion') {
        columnasToInsert.push(key);
        const val = equipamiento[key];
        if (val === null || val === undefined) {
          valoresToInsert.push('NULL');
        } else if (typeof val === 'boolean') {
          valoresToInsert.push(val ? 1 : 0);
        } else if (typeof val === 'string') {
          valoresToInsert.push(`N'${val.replace(/'/g, "''")}'`);
        } else {
          valoresToInsert.push(val);
        }
      }
    }

    const insertQuery = `
      INSERT INTO EquipamientoModelo (${columnasToInsert.join(', ')})
      VALUES (${valoresToInsert.join(', ')});
    `;

    await db.queryRaw(insertQuery);

    const creado = await db.queryRaw(`SELECT * FROM EquipamientoModelo WHERE ModeloID = ${modeloId}`);
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

    const existeQuery = `SELECT EquipamientoID FROM EquipamientoModelo WHERE ModeloID = ${modeloId}`;
    const existe = await db.queryRaw(existeQuery);

    if (existe.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No se encontr\u00F3 equipamiento para este modelo'
      });
    }

    const setClauses = [];
    const dbCols = await getDBColumns();

    // Guardamos absolutamente todo el payload en la columna JSON para preservar TODOS los botones y textos 100% como los manda el cliente
    if (dbCols.includes('OtrosDatos')) {
        const safeJson = JSON.stringify(equipamiento).replace(/'/g, "''");
        setClauses.push(`OtrosDatos = '${safeJson}'`);
    }
    
    // Tratamos de buscar la columna correcta de actualización segun version del SQL
    if (dbCols.includes('FechaModificacion')) {
        setClauses.push('FechaModificacion = GETDATE()');
    } else if (dbCols.includes('FechaActualizacion')) {
        setClauses.push('FechaActualizacion = GETDATE()');
    }

    // Actualizar columnas que existan en la base de datos de manera individual, excluyendo IDs para evitar conflictos
    for (const key of Object.keys(equipamiento)) {
      if (dbCols.includes(key) && key !== 'ModeloID' && key !== 'OtrosDatos' && key !== 'EquipamientoID' && key !== 'FechaModificacion' && key !== 'FechaActualizacion' && key !== 'FechaCreacion') {
        const val = equipamiento[key];
        if (val === null || val === undefined) {
          setClauses.push(`${key} = NULL`);
        } else if (typeof val === 'boolean') {
          setClauses.push(`${key} = ${val ? 1 : 0}`);
        } else if (typeof val === 'string') {
          setClauses.push(`${key} = N'${val.replace(/'/g, "''")}'`);
        } else {
          setClauses.push(`${key} = ${val}`);
        }
      }
    }

    if (setClauses.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No hay datos para actualizar o no existe columna OtrosDatos en DB'
      });
    }

    const updateQuery = `
      UPDATE EquipamientoModelo
      SET ${setClauses.join(', ')}
      WHERE ModeloID = ${modeloId}
    `;

    await db.queryRaw(updateQuery);

    const actualizado = await db.queryRaw(`SELECT * FROM EquipamientoModelo WHERE ModeloID = ${modeloId}`);

    logger.info(`Equipamiento actualizado (v\u00eda JSON payload) para modelo ${modeloId}`);

    res.json({
      success: true,
      message: 'Equipamiento actualizado json exitosamente',
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