const db = require('../config/db-simple');
const logger = require('../config/logger');

// GET /api/equipamiento/modelo/:modeloId - Obtener equipamiento por modelo
exports.getByModeloId = async (req, res) => {
  try {
    const { modeloId } = req.params;

    // Get all columns of the EquipamientoModelo table
    // IMPORTANTE: filtrar a ORDINAL_POSITION <= 178 para excluir las ~98 columnas legacy
    // (ej: Espejoselct, Tablerodigital, Controltraccin) añadidas por versiones antiguas del formulario.
    // Las columnas canónicas del schema original van de 1 a 178 (hasta DistEjes).
    const columnsQuery = await db.queryRaw("SELECT COLUMN_NAME, DATA_TYPE FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'EquipamientoModelo' AND ORDINAL_POSITION <= 178");
    
    // Get actual data
    const query = `
      SELECT * FROM EquipamientoModelo
      WHERE ModeloID = ${modeloId}
    `;

    const equipamiento = await db.queryRaw(query);
    let dbData = equipamiento[0] || {};
    
    // Auto-fill an empty object with all schema columns mapping them to null/false so the frontend knows they exist even if empty
    let data = {};
    columnsQuery.forEach(col => {
      // Default to null or false depending on bit type
      const defaultVal = col.DATA_TYPE === 'bit' ? false : null;
      let val = dbData[col.COLUMN_NAME] !== undefined ? dbData[col.COLUMN_NAME] : defaultVal;
      // msnodesqlv8 devuelve columnas BIT como 1/0 (número) en lugar de true/false (booleano).
      // Normalizamos aquí para que el frontend siempre reciba true/false.
      if (col.DATA_TYPE === 'bit' && val !== null && val !== undefined) {
        val = val === 1 || val === true;
      }
      data[col.COLUMN_NAME] = val;
    });

    // Si existe data en formato JSON dentro de OtrosDatos, la parseamos
    // IMPORTANTE: solo se usa como fallback para columnas reales de la DB que estén en null.
    // NO se agregan claves extra que no existan en el schema → evita duplicados en la vista
    // (ej: "Espejoselct", "Espejoselect" vs "EspejosElectricos" que son la misma cosa con nombre distinto)
    if (data && data.OtrosDatos && typeof data.OtrosDatos === 'string') {
      const trimmed = data.OtrosDatos.trim();
      if (trimmed.startsWith('{') || trimmed.startsWith('[')) {
        try {
          const extraData = JSON.parse(trimmed);
          const dbColumnSet = new Set(columnsQuery.map(col => col.COLUMN_NAME));
          for (const [key, val] of Object.entries(extraData)) {
            // Solo aplicar si la clave es una columna real de la DB
            if (!dbColumnSet.has(key)) continue;
            // Solo usar OtrosDatos como fallback si el valor en DB es null (DB tiene prioridad)
            if (data[key] !== null) continue;
            // No aplicar valores nulos/indefinidos de OtrosDatos
            if (val === null || val === undefined) continue;
            data[key] = val;
          }
        } catch (e) {
          logger.warn('OtrosDatos no es JSON válido, se ignora el parseo:', data.OtrosDatos);
        }
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

// Función de ayuda para obtener columnas CANÓNICAS (ORDINAL_POSITION <= 178)
// Excluye las ~98 columnas legacy añadidas por versiones antiguas del formulario
const getDBColumns = async () => {
    const cols = await db.queryRaw("SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME='EquipamientoModelo' AND ORDINAL_POSITION <= 178");
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
    const columnasToInsert = ['ModeloID', 'FechaCreacion'];
    const valoresToInsert = [modeloId, 'GETDATE()'];

    // Siempre guardamos el payload crudo en OtrosDatos por si cambian las columnas
    if (dbCols.includes('OtrosDatos')) {
        columnasToInsert.push('OtrosDatos');
        const safeJson = JSON.stringify(equipamiento).replace(/'/g, "''");
        valoresToInsert.push(`'${safeJson}'`);
    }

    // Insertar columnas que existan en la base de datos
    for (const key of Object.keys(equipamiento)) {
      if (dbCols.includes(key) && key !== 'ModeloID' && key !== 'OtrosDatos' && key !== 'EquipamientoID' && key !== 'FechaModificacion' && key !== 'FechaActualizacion' && key !== 'FechaCreacion') {
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

    // Solo guardamos en OtrosDatos las claves que NO tienen columna real en la DB.
    // Guardar TODO en OtrosDatos provocaba que getByModeloId retornara claves duplicadas con nombres
    // alternativos (ej: "Espejoselct" y "EspejosElectricos" a la vez).
    if (dbCols.includes('OtrosDatos')) {
      const skipAlways = new Set(['ModeloID', 'EquipamientoID', 'FechaCreacion', 'FechaModificacion', 'FechaActualizacion', 'OtrosDatos']);
      const extraKeys = Object.keys(equipamiento).filter(k => !dbCols.includes(k) && !skipAlways.has(k));
      if (extraKeys.length > 0) {
        const extraData = {};
        extraKeys.forEach(k => { extraData[k] = equipamiento[k]; });
        const safeJson = JSON.stringify(extraData).replace(/'/g, "''");
        setClauses.push(`OtrosDatos = '${safeJson}'`);
      } else {
        // Sin datos extra → limpiar OtrosDatos para eliminar residuos de versiones anteriores
        setClauses.push(`OtrosDatos = NULL`);
      }
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