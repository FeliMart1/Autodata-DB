const multer = require('multer');
const { parse } = require('csv-parse/sync');
const db = require('../config/db-simple');
const logger = require('../config/logger');

const xlsx = require('xlsx');

// Normalization Helpers
const normalizeKey = (key) => key.trim().toLowerCase().replace(/[\s_.-]+/g, '');
const toBool = (val) => {
  if (val === null || val === undefined || val === '') return null;
  const str = String(val).trim().toLowerCase();
  if (['1', 'si', 'sí', 'true', 'x', 'yes', 'y'].includes(str)) return true;
  if (['0', 'no', 'false', 'n'].includes(str)) return false;
  return null;
};
const toNum = (val, type) => {
  if (val === null || val === undefined || val === '') return null;
  const parsed = type === 'int' ? parseInt(val, 10) : parseFloat(String(val).replace(/[^0-9.-]+/g, ''));
  return isNaN(parsed) ? null : parsed;
};

// Helper to execute parameterized queries and log SQL+params on error for easier debugging
const execWithDebug = async (sqlText, params = []) => {
  // Build processedQuery the same way db.queryWithParams does so we can log the final SQL
  try {
    let processedQuery = sqlText;
    // Replace in descending order (@p176 before @p17) to avoid accidental substring replacement (e.g. @p1 inside @p10)
    for (let index = params.length - 1; index >= 0; index--) {
      const param = params[index];
      const placeholder = `@p${index}`;
      let value;
      if (param === null || param === undefined) {
        value = 'NULL';
      } else if (typeof param === 'string') {
        value = `N'${param.replace(/'/g, "''")}'`;
      } else if (typeof param === 'number') {
        value = param.toString();
      } else if (typeof param === 'boolean') {
        value = param ? '1' : '0';
      } else if (param instanceof Date) {
        value = `'${param.toISOString()}'`;
      } else {
        value = `N'${JSON.stringify(param).replace(/'/g, "''")}'`;
      }
      processedQuery = processedQuery.replace(new RegExp(placeholder, 'g'), value);
    }

    // Log the expanded SQL at debug level
    logger.debug('Executing SQL', { processedQuery, params });

    // Execute the processed query
    return await db.queryRaw(processedQuery);
  } catch (err) {
    try {
      logger.error('SQL execution error', { sqlTemplate: sqlText, params, message: err.message, stack: err.stack });
    } catch (logErr) {
      console.error('Failed to log SQL error', logErr);
    }
    throw err;
  }
};

// Configuration de multer para archivos en memoria
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB máximo
  },
  fileFilter: (req, file, cb) => {
    const isCsv = file.mimetype === 'text/csv' || file.originalname.endsWith('.csv');
    const isExcel = file.mimetype === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || file.originalname.endsWith('.xlsx');
    
    if (isCsv || isExcel) {
      cb(null, true);
    } else {
      cb(new Error('Solo se permiten archivos CSV o Excel (.xlsx)'), false);
    }
  }
});

/**
 * POST /api/import/claudio
 * Importa un archivo CSV de Claudio a la tabla staging
 */
const importarCSV = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No se proporcionó ningún archivo'
      });
    }

    // Generar batch ID único para este lote
    const batchId = require('crypto').randomUUID();
    logger.info(`Iniciando importación CSV - Batch: ${batchId}`);

    // Parsear CSV
    const csvContent = req.file.buffer.toString('utf-8');
    
    let records;
    try {
      records = parse(csvContent, {
        columns: true, // Primera fila como headers
        skip_empty_lines: true,
        trim: true,
        bom: true, // Manejar BOM de UTF-8
        relaxColumnCount: true, // Permitir filas con diferente cantidad de columnas
        cast: false // No hacer casting automático, dejar todo como string
      });
    } catch (parseError) {
      logger.error('Error parseando CSV:', parseError);
      return res.status(400).json({
        success: false,
        message: 'Error al parsear el archivo CSV',
        error: parseError.message
      });
    }

    if (!records || records.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'El archivo CSV está vacío o no tiene datos válidos'
      });
    }

    logger.info(`CSV parseado exitosamente - ${records.length} registros encontrados`);

    // Insertar registros en staging
    let insertedCount = 0;
    let errorCount = 0;
    const errors = [];

    for (let i = 0; i < records.length; i++) {
      const record = records[i];
      
      try {
        // Preparar datos para inserción (mapeo flexible de columnas)
        const rowData = {
          load_batch_id: batchId,
          load_status: 'PENDING',
          raw_line: JSON.stringify(record),
          
          // Mapear columnas del CSV (nombres flexibles)
          marca: record.marca || record.Marca || record.MARCA || null,
          modelo: record.modelo || record.Modelo || record.MODELO || null,
          anio: record.anio || record.año || record.Año || record.Anio || null,
          version: record.version || record.Version || record.VERSION || null,
          combustible: record.combustible || record.Combustible || null,
          tipo: record.tipo || record.Tipo || record.tipo_vehiculo || null,
          origen: record.origen || record.Origen || null,
          categoria: record.categoria || record.Categoria || null,
          segmento: record.segmento || record.Segmento || null,
          cc: record.cc || record.CC || record.cilindrada || null,
          hp: record.hp || record.HP || record.potencia || null,
          traccion: record.traccion || record.Traccion || record.tracción || null,
          caja: record.caja || record.Caja || record.transmision || null,
          turbo: record.turbo || record.Turbo || null,
          puertas: record.puertas || record.Puertas || null,
          pasajeros: record.pasajeros || record.Pasajeros || null,
          precio: record.precio || record.Precio || null,
          moneda: record.moneda || record.Moneda || 'USD',
          
          // Equipamiento (opcional)
          airbag_conductor: record.airbag_conductor || null,
          airbag_acompanante: record.airbag_acompanante || null,
          airbags_laterales: record.airbags_laterales || null,
          airbags_cortina: record.airbags_cortina || null,
          abs: record.abs || record.ABS || null,
          control_estabilidad: record.control_estabilidad || record.esp || null,
          control_traccion: record.control_traccion || null,
          climatizador: record.climatizador || record.clima || null,
          aire_acondicionado: record.aire_acondicionado || record.ac || null,
          camara_retroceso: record.camara_retroceso || null,
          sensores_estacionamiento: record.sensores_estacionamiento || null,
          bluetooth: record.bluetooth || null,
          usb: record.usb || null,
          pantalla_tactil: record.pantalla_tactil || null,
          gps: record.gps || null,
          llantas_aleacion: record.llantas_aleacion || null,
          techo_panoramico: record.techo_panoramico || null,
          asientos_cuero: record.asientos_cuero || null,
          asientos_electricos: record.asientos_electricos || null
        };

        await db.insert('stg.Claudio_Modelos', rowData);
        insertedCount++;
      } catch (insertError) {
        errorCount++;
        errors.push({
          row: i + 2, // +2 porque es 0-indexed y hay header
          data: record,
          error: insertError.message
        });
        logger.error(`Error insertando fila ${i + 2}:`, insertError);
        
        // Si hay muchos errores, abortar
        if (errorCount > 100) {
          logger.error('Demasiados errores, abortando importación');
          break;
        }
      }
    }

    logger.info(`Importación completada - Insertados: ${insertedCount}, Errores: ${errorCount}`);

    res.json({
      success: true,
      message: 'Importación completada',
      data: {
        batchId,
        totalRows: records.length,
        inserted: insertedCount,
        errors: errorCount,
        errorDetails: errors.length > 0 ? errors.slice(0, 10) : [] // Solo primeros 10 errores
      }
    });

  } catch (error) {
    logger.error('Error en importación CSV:', error);
    res.status(500).json({
      success: false,
      message: 'Error al importar archivo CSV',
      error: error.message
    });
  }
};

/**
 * GET /api/import/batches
 * Lista todos los batches de importación
 */
const listarBatches = async (req, res) => {
  try {
    const query = `
      SELECT 
        load_batch_id,
        MIN(load_timestamp) as fecha_importacion,
        COUNT(*) as total_registros,
        SUM(CASE WHEN load_status = 'PENDING' THEN 1 ELSE 0 END) as pendientes,
        SUM(CASE WHEN load_status = 'PROCESSED' THEN 1 ELSE 0 END) as procesados,
        SUM(CASE WHEN load_status = 'ERROR' THEN 1 ELSE 0 END) as errores
      FROM stg.Claudio_Modelos
      GROUP BY load_batch_id
      ORDER BY MIN(load_timestamp) DESC
    `;

    const batches = await db.queryRaw(query);

    res.json({
      success: true,
      data: batches
    });
  } catch (error) {
    logger.error('Error listando batches:', error);
    res.status(500).json({
      success: false,
      message: 'Error al listar batches',
      error: error.message
    });
  }
};

/**
 * GET /api/import/batches/:batchId
 * Obtiene detalles de un batch específico
 */
const obtenerBatch = async (req, res) => {
  try {
    const { batchId } = req.params;

    const registros = await db.queryWithParams(
      'SELECT * FROM stg.Claudio_Modelos WHERE load_batch_id = @p0 ORDER BY load_id',
      [batchId]
    );

    if (!registros || registros.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Batch no encontrado'
      });
    }

    res.json({
      success: true,
      data: {
        batchId,
        registros
      }
    });
  } catch (error) {
    logger.error('Error obteniendo batch:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener batch',
      error: error.message
    });
  }
};

/**
 * POST /api/import/batches/:batchId/process
 * Procesa un batch y lo mueve a las tablas de trabajo (Marca, Modelo, etc)
 */
const procesarBatch = async (req, res) => {
  try {
    const { batchId } = req.params;

    // Obtener registros pendientes del batch
    const registros = await db.queryWithParams(
      'SELECT * FROM stg.Claudio_Modelos WHERE load_batch_id = @p0 AND load_status = @p1',
      [batchId, 'PENDING']
    );

    if (!registros || registros.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No hay registros pendientes en este batch'
      });
    }

    let procesados = 0;
    let errores = 0;
    const erroresDetalle = [];

    for (const reg of registros) {
      try {
        // 1. Verificar/crear marca
        let marca = await db.queryWithParams(
          'SELECT MarcaID FROM Marca WHERE LOWER(Descripcion) = LOWER(@p0)',
          [reg.marca]
        );

        let marcaId;
        if (!marca || marca.length === 0) {
          // Crear nueva marca
          const nuevaMarca = await db.insert('Marca', {
            CodigoMarca: reg.marca.substring(0, 10).toUpperCase(),
            Descripcion: reg.marca,
            ShortName: reg.marca,
            Origen: reg.origen
          });
          marcaId = nuevaMarca.MarcaID;
          logger.info(`Nueva marca creada: ${reg.marca} (ID: ${marcaId})`);
        } else {
          marcaId = marca[0].MarcaID;
        }

        // 2. Crear/actualizar modelo
        // Build modeloData mapping minimal fields from the staged row. Use flexible header names present in CSV.
        // We'll set Estado to 'definitivo' by default per requested workflow and look up the EstadoID from DB.
        const estadoDefinitivo = 'definitivo';
        let estadoIdDefinitivo = 1; // fallback if lookup fails
        try {
          const estadoRow = await db.queryWithParams("SELECT EstadoID FROM ModeloEstado WHERE LOWER(NombreEstado) = LOWER(@p0)", [estadoDefinitivo]);
          if (estadoRow && estadoRow.length > 0) estadoIdDefinitivo = estadoRow[0].EstadoID;
        } catch (e) {
          logger.warn('No se pudo obtener EstadoID definitivo, usando 1 como fallback', e.message);
        }

        const modeloData = {
          MarcaID: marcaId,
          CodigoModelo: `${reg.marca.substring(0, 3).toUpperCase()}-${String(reg.modelo || '').substring(0, 10).toUpperCase()}`,
          DescripcionModelo: reg.modelo,
          Familia: reg.familia || reg.modelo,
          OrigenCodigo: reg.origen || reg.Origen || null,
          CombustibleCodigo: reg.combustible || reg.Combustible || null,
          Anio: reg.anio ? parseInt(reg.anio) : null,
          Tipo: reg.tipo || reg.Tipo || null,
          CategoriaCodigo: reg.categoria || reg.Categoria || null,
          SegmentacionAutodata: reg.segmento || reg.Segmento || null,
          CC: reg.cc ? parseInt(String(reg.cc).replace(',', '.')) : (reg.CC ? parseInt(String(reg.CC).replace(',', '.')) : null),
          HP: reg.hp ? parseFloat(String(reg.hp).replace(',', '.')) : (reg.HP ? parseFloat(String(reg.HP).replace(',', '.')) : null),
          Traccion: reg.traccion || reg.Traccion || null,
          Caja: reg.caja || reg.Caja || null,
          Turbo: (String(reg.turbo || reg.Turbo || '').toLowerCase() === 'si' || String(reg.turbo || reg.Turbo || '') === '1'),
          Puertas: reg.puertas ? parseInt(reg.puertas) : (reg.Puertas ? parseInt(reg.Puertas) : null),
          Pasajeros: reg.pasajeros ? parseInt(reg.pasajeros) : (reg.Pasajeros ? parseInt(reg.Pasajeros) : null),
          Importador: reg.importador || reg.Importador || null,
          CodigoAutodata: reg.codigoautodata || reg.CodigoAutodata || null,
          Origen: reg.origen || null,
          Estado: estadoDefinitivo,
          EstadoID: estadoIdDefinitivo
        };

        // Ensure CodigoAutodata does not exceed DB length: try to query COLUMN property length if possible
        try {
          if (modeloData.CodigoAutodata) {
            const col = await db.queryRaw("SELECT CHARACTER_MAXIMUM_LENGTH as len FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'Modelo' AND COLUMN_NAME = 'CodigoAutodata'");
            const maxLen = col && col[0] && col[0].len ? parseInt(col[0].len) : null;
            if (maxLen && String(modeloData.CodigoAutodata).length > maxLen) {
              logger.warn('CodigoAutodata demasiado largo, truncando', { value: modeloData.CodigoAutodata, maxLen });
              modeloData.CodigoAutodata = String(modeloData.CodigoAutodata).substring(0, maxLen);
            }
          }
          } catch (e) {
            logger.warn('No se pudo verificar longitud de CodigoAutodata', e.message);
          }

        const nuevoModelo = await db.insert('Modelo', modeloData);
        const modeloId = nuevoModelo.ModeloID;

        // 3. Crear versión si hay datos
        if (reg.version) {
          await db.insert('VersionModelo', {
            ModeloID: modeloId,
            CodigoVersion: reg.version.substring(0, 50),
            Descripcion: reg.version,
            OrigenCodigo: reg.origen
          });
        }

        // 4. Agregar precio si existe
        if (reg.precio) {
          await db.insert('PrecioModelo', {
            ModeloID: modeloId,
            Precio: parseFloat(reg.precio),
            Moneda: reg.moneda || 'USD',
              FechaVigenciaDesde: new Date(),
            Fuente: 'Claudio CSV Import'
          });
        }

        // Marcar como procesado
        await db.update('stg.Claudio_Modelos', 'load_id', reg.load_id, {
          load_status: 'PROCESSED'
        });

        procesados++;

      } catch (error) {
        errores++;
        erroresDetalle.push({
          load_id: reg.load_id,
          marca: reg.marca,
          modelo: reg.modelo,
          error: error.message
        });

        // Marcar como error
        await db.update('stg.Claudio_Modelos', 'load_id', reg.load_id, {
          load_status: 'ERROR',
          load_error_message: error.message
        });

        logger.error(`Error procesando registro ${reg.load_id}:`, error);
      }
    }

    res.json({
      success: true,
      message: 'Procesamiento completado',
      data: {
        batchId,
        total: registros.length,
        procesados,
        errores,
        erroresDetalle: erroresDetalle.slice(0, 10)
      }
    });

  } catch (error) {
    logger.error('Error procesando batch:', error);
    res.status(500).json({
      success: false,
      message: 'Error al procesar batch',
      error: error.message
    });
  }
};

/**
 * DELETE /api/import/batches/:batchId
 * Elimina un batch de staging
 */
const eliminarBatch = async (req, res) => {
  try {
    const { batchId } = req.params;

    await db.queryWithParams(
      'DELETE FROM stg.Claudio_Modelos WHERE load_batch_id = @p0',
      [batchId]
    );

    res.json({
      success: true,
      message: 'Batch eliminado exitosamente'
    });
  } catch (error) {
    logger.error('Error eliminando batch:', error);
    res.status(500).json({
      success: false,
      message: 'Error al eliminar batch',
      error: error.message
    });
  }
};

/**
 * POST /api/import/excel-modelos
 * Importa modelos desde un Excel validando y manteniendo IDs (MARCOD, MARMODCOD, FAMCOD)
 */
const importarExcelAutos = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: 'No se proporcionó archivo excel' });
    const xlsx = require('xlsx');
    const rows = xlsx.utils.sheet_to_json(xlsx.read(req.file.buffer, { type: 'buffer' }).Sheets[xlsx.read(req.file.buffer, { type: 'buffer' }).SheetNames[0]], { header: 1 });
    if (rows.length < 2) return res.status(400).json({ success: false, message: 'Archivo vacío' });
    const getIdx = (name) => rows[0].findIndex(h => h === name);
    const cols = { marcod: getIdx('MARCOD'), mardsc: getIdx('MARDSC'), marmodcod: getIdx('MARMODCOD'), marmoddsc: getIdx('MARMODDSC'), famdsc: getIdx('FAMDSC'), combdsc: getIdx('COMBDSC'), catdsc: getIdx('CATDSC'), maevalor: getIdx('MAEVALOR') };
    if (cols.marcod === -1 || cols.mardsc === -1 || cols.marmodcod === -1 || cols.marmoddsc === -1) return res.status(400).json({ success: false, message: 'Faltan columnas requeridas' });

    const modelosArray = [];
    for (let i = 1; i < rows.length; i++) {
      const r = rows[i];
      if (!r || r.length === 0 || r[cols.marcod] == null) continue;
      modelosArray.push({ codMarca: String(r[cols.marcod]).trim().padStart(4, '0'), marcaDesc: r[cols.mardsc] ? String(r[cols.mardsc]).trim() : '', codModelo: String(r[cols.marmodcod]).trim().padStart(4, '0'), modeloDesc: r[cols.marmoddsc] ? String(r[cols.marmoddsc]).trim() : '', familiaDesc: cols.famdsc !== -1 && r[cols.famdsc] ? String(r[cols.famdsc]).trim() : null, combustible: cols.combdsc !== -1 && r[cols.combdsc] ? String(r[cols.combdsc]).trim() : null, categoria: cols.catdsc !== -1 && r[cols.catdsc] ? String(r[cols.catdsc]).trim() : null, precio: cols.maevalor !== -1 && r[cols.maevalor] ? parseFloat(r[cols.maevalor]) : null });
    }

    const usuarioId = req.user ? req.user.UsuarioID || req.user.id || 1 : 1;
    let creados = { marcas: 0, modelos: 0 };
    const marcaIdMap = new Map();
    for (const mod of modelosArray) {
      if (!marcaIdMap.has(mod.codMarca)) {
         const marcaIdInt = parseInt(mod.codMarca, 10);
         let dbMarca = await db.queryWithParams('SELECT MarcaID FROM Marca WHERE CodigoMarca = @p0 OR MarcaID = @p1', [mod.codMarca, marcaIdInt]);
         if (dbMarca.length === 0) {
           try {
             await db.queryRaw(`SET IDENTITY_INSERT Marca ON;`);
             const insertRes = await db.queryRaw(`INSERT INTO Marca (MarcaID, Descripcion, CodigoMarca) OUTPUT INSERTED.MarcaID VALUES (${marcaIdInt}, N'${mod.marcaDesc.replace(/'/g, "''")}', '${mod.codMarca}')`);
             await db.queryRaw(`SET IDENTITY_INSERT Marca OFF;`);
             if(insertRes && insertRes.length > 0) { marcaIdMap.set(mod.codMarca, insertRes[0].MarcaID); creados.marcas++; }
           } catch(err) {
             await db.queryRaw(`SET IDENTITY_INSERT Marca OFF;`);
             const insertRes = await db.queryRaw(`INSERT INTO Marca (Descripcion, CodigoMarca) OUTPUT INSERTED.MarcaID VALUES (N'${mod.marcaDesc.replace(/'/g, "''")}', '${mod.codMarca}')`);
             if(insertRes && insertRes.length > 0) { marcaIdMap.set(mod.codMarca, insertRes[0].MarcaID); creados.marcas++; }
           }
         } else { marcaIdMap.set(mod.codMarca, dbMarca[0].MarcaID); }
      }
      const dbMarcaId = marcaIdMap.get(mod.codMarca);
      if (!dbMarcaId) continue;
      const codigoAutodata = `${mod.codMarca}${mod.codModelo}`;
        const modExists = await db.queryWithParams(`SELECT ModeloID FROM Modelo WHERE CodigoAutodata = @p0 OR (MarcaID = @p1 AND CodigoModelo = @p2)`, [codigoAutodata, dbMarcaId, mod.codModelo]);
      let modeloIdDb = null;
      if (modExists.length === 0) {
        const importador = null; // or from mod
          const insertMod = await db.queryWithParams(`INSERT INTO Modelo (MarcaID, CodigoModelo, CodigoAutodata, DescripcionModelo, Familia, CombustibleCodigo, CategoriaCodigo, Estado, Activo, ModificadoPorID, PrecioInicial) OUTPUT INSERTED.ModeloID VALUES (@p0, @p1, @p2, @p3, @p4, @p5, @p6, 'importado', 1, @p7, @p8)`, [dbMarcaId, mod.codModelo, codigoAutodata, mod.modeloDesc, mod.familiaDesc, mod.combustible, mod.categoria, usuarioId, mod.precio]);
        if (insertMod && insertMod.length > 0) {
           modeloIdDb = insertMod[0].ModeloID;
           await db.queryWithParams(`INSERT INTO ModeloHistorial (ModeloID, Campo, ValorAnterior, ValorNuevo, Usuario) VALUES (@p0, 'Estado', NULL, 'importado', 'Sistema')`, [modeloIdDb]);
           creados.modelos++;
        }
      } else {
         modeloIdDb = modExists[0].ModeloID;
      }
      if (modeloIdDb && mod.precio != null && !isNaN(mod.precio)) {
         await db.queryWithParams(`INSERT INTO PrecioModelo (ModeloID, Precio, Moneda, FechaVigenciaDesde, Fuente, FechaCarga) VALUES (@p0, @p1, 'USD', GETDATE(), 'Precio importado Excel', GETDATE())`, [modeloIdDb, mod.precio]);
      }
    }
    return res.json({ success: true, message: 'Importación completada', data: { creados } });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Error al importar:' + error.message });
  }
};

const importarExcelPrecios = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: 'Archivo no proporcionado.' });

    const workbook = xlsx.read(req.file.buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const data = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

    const creados = { precios: 0, ignorados: 0 };
    const usuarioId = req.user?.id || 1; // Ajusta si el auth token manda distinto el id

    for (const row of data) {
      const codigoAutodata = row['CODIGO CONCATENADO']?.toString().trim();
      let ultimoPrecio = row['ULTIMO PRECIO'];

      if (!codigoAutodata) continue;
      
      // Limpiar precio (puede venir como ' USD 25.000', o '#N/A')
      if (typeof ultimoPrecio === 'string') {
        ultimoPrecio = parseFloat(ultimoPrecio.replace(/[^\d.-]/g, ''));
      }
      
      if (!ultimoPrecio || isNaN(ultimoPrecio)) {
        creados.ignorados++;
        continue;
      }

      // Buscar modelo por codigo concatenado
      const modExists = await db.queryWithParams(`SELECT ModeloID FROM Modelo WHERE CodigoAutodata = @p0`, [codigoAutodata]);
      if (modExists.length > 0) {
        const modeloIdDb = modExists[0].ModeloID;

        // Validar si ese precio ya es el actual, o insertar uno nuevo
        // Para simplificar, inserta uno nuevo siempre que actualizamos
        await db.queryWithParams(
          `INSERT INTO PrecioModelo (ModeloID, Precio, Moneda, FechaVigenciaDesde, Fuente, FechaCarga) VALUES (@p0, @p1, 'USD', GETDATE(), 'Actualización por Excel Tabulado', GETDATE())`,
          [modeloIdDb, ultimoPrecio]
        );

        // Opcional: Actualizar el PrecioInicial del modelo
        await db.queryWithParams(`UPDATE Modelo SET PrecioInicial = @p0 WHERE ModeloID = @p1`, [ultimoPrecio, modeloIdDb]);

        creados.precios++;
        } else {
          creados.ignorados++;
        }
      }

    return res.status(200).json({ success: true, message: 'Precios importados con éxito', creados });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Error al importar precios: ' + error.message });
  }
};



const descargarTemplateCompleto = async (req, res) => {
  try {
    const fs = require('fs');
    const path = require('path');
    const filePath = path.join(__dirname, '../../data/Plantilla Maestra.xlsx');
    
    if (fs.existsSync(filePath)) {
      return res.download(filePath, 'Plantilla_Maestra.xlsx');
    } else {
      return res.status(404).json({ success: false, message: 'La plantilla no existe en el servidor.' });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Error al descargar plantilla: ' + error.message });
  }
};

const importarExcelCompleto = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: 'Archivo no proporcionado.' });

    const xlsx = require('xlsx');
    const workbook = xlsx.read(req.file.buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const data = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName], { defval: null });

    const creados = { marcas: 0, modelos: 0, equipamiento_inserts: 0, equipamiento_updates: 0, precios: 0 };
    const usuarioId = req.user?.id || req.user?.UsuarioID || 1;

    // Discover Equipment columns & types dynamically
    const colsInfoQuery = await db.queryRaw("SELECT COLUMN_NAME as name, DATA_TYPE as type FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'EquipamientoModelo' AND COLUMN_NAME NOT IN ('EquipamientoID', 'ModeloID')");
    
    // Map DB columns to normalized keys for row matching
    const dbEquipCols = colsInfoQuery.map(c => ({
      dbName: c.name, 
      normKey: normalizeKey(c.name),
      isNumeric: ['int', 'decimal', 'numeric', 'float', 'real'].includes(c.type.toLowerCase()),
      isBit: c.type.toLowerCase() === 'bit'
    }));

    const marcaIdMap = new Map();

    for (const row of data) {
      // Normalize row keys for alias mapping
      const normRow = {};
      for (const key in row) normRow[normalizeKey(key)] = row[key];

      const codMarca = String(normRow['codigomarca'] || row['Codigo_Marca'] || '').trim().padStart(4, '0');
      if (!codMarca) continue;
      const marcaDesc = String(normRow['marca'] || row['Marca'] || '').trim();

      const codModelo = String(normRow['codigomodelo'] || row['Codigo_Modelo'] || '').trim().padStart(4, '0');
      const modeloDesc = String(normRow['descripcionmodelo'] || row['Descripcion_Modelo'] || '').trim();  
      const familiaDesc = normRow['familia'] ? String(normRow['familia']).trim() : null;
      
      let precioVal = normRow['preciousd'] || row['Precio_USD'];
      let precioNum = toNum(precioVal, 'decimal');

      let codigoAutodata = String(normRow['codconcatenado'] || normRow['codigoconcatenado'] || row['CODIGO CONCATENADO'] || '').trim();
      if (!codigoAutodata) codigoAutodata = `${codMarca}${codModelo}`;
      if (codigoAutodata.length > 8) codigoAutodata = codigoAutodata.substring(0, 8); // truncate to preserve schema

      // 1. Marca Upsert with IDENTITY_INSERT fallback logic
      if (!marcaIdMap.has(codMarca)) {
        const marcaIdInt = parseInt(codMarca, 10);
        let marcaExists = await execWithDebug(`SELECT MarcaID FROM Marca WHERE CodigoMarca = @p0 OR MarcaID = @p1`, [codMarca, marcaIdInt]);
        
        if (marcaExists.length === 0) {
          try {
              // Note the column is "Descripcion" in your DB, not "Nombre"
              await execWithDebug(`SET IDENTITY_INSERT Marca ON; INSERT INTO Marca (MarcaID, Descripcion, CodigoMarca) VALUES (@p0, @p1, @p2); SET IDENTITY_INSERT Marca OFF;`, [marcaIdInt, marcaDesc, codMarca]);
              marcaIdMap.set(codMarca, marcaIdInt);
              creados.marcas++;
            } catch (e) {
              // Fallback if IDENTITY_INSERT fails
              await execWithDebug(`SET IDENTITY_INSERT Marca OFF; INSERT INTO Marca (Descripcion, CodigoMarca) VALUES (@p0, @p1)`, [marcaDesc, codMarca]);
              const newMarca = await execWithDebug(`SELECT MarcaID FROM Marca WHERE CodigoMarca = @p0`, [codMarca]);
              marcaIdMap.set(codMarca, newMarca[0].MarcaID);
              creados.marcas++;
            }
        } else {
          marcaIdMap.set(codMarca, marcaExists[0].MarcaID);
          // Note the column is "Descripcion" in your DB, not "Nombre"
          await execWithDebug(`UPDATE Marca SET Descripcion = @p0 WHERE MarcaID = @p1`, [marcaDesc, marcaExists[0].MarcaID]);
        }
      }
      const dbMarcaId = marcaIdMap.get(codMarca);
      if (!dbMarcaId) continue;

      // 2. Modelo Upsert
      const modExists = await execWithDebug(`SELECT ModeloID FROM Modelo WHERE CodigoAutodata = @p0 OR (MarcaID = @p1 AND CodigoModelo = @p2)`, [codigoAutodata, dbMarcaId, codModelo]);
      let modeloIdDb = null;

      // Extract basic minimum data from the row
      const anioNum = toNum(normRow['año'] || normRow['anio'] || row['Año'], 'int');
      const segmentoDesc = String(normRow['segmento'] || normRow['segmentacionautodata'] || row['Categoria'] || '').trim() || null;
      const carroceriaDesc = String(normRow['carrocería'] || normRow['carroceria'] || row['TIPO2 (Carrocería)']  || row['Tipo'] || '').trim() || null;
      const origenDesc = String(normRow['origen'] || row['ORIGEN'] || '').trim() || null;
      const importadorDesc = String(normRow['importador'] || row['Importador'] || '').trim() || null;
      const tipoMotorDesc = String(normRow['tipomotor'] || row['Tipo Motor'] || '').trim() || null;
      const vehiculoElectricoDesc = String(normRow['tipodevehículoelectrico/híbrido'] || normRow['tipovehiculoelectrico/hibrido'] || normRow['tipovehiculoelectrico'] || row['Tipo Vehículo Electrico'] || '').trim() || null;
      const tipoCajaDesc = String(normRow['tipodecaja'] || normRow['tipocaja'] || normRow['tipocajaautomatica'] || row['Tipo Caja Automática'] || row['Caja'] || '').trim() || null;
      const cilinCcNum = toNum(normRow['cilindrada(cc)'] || normRow['cilindrada'] || normRow['cc'] || row['CC'], 'int');
      const potenciaHpNum = toNum(normRow['potencia(hp)'] || normRow['potencia'] || normRow['hp'] || row['HP (CV)'], 'int');
      const cilindrosNum = toNum(normRow['cilindros'] || row['Cilindros'], 'int');
      const valvulasNum = toNum(normRow['válvulas'] || normRow['valvulas'] || row['Valvulas'], 'int');
      const puertasNum = toNum(normRow['puertas'] || normRow['numeropuertas'] || row['Numero Puertas'], 'int');
      const asientosNum = toNum(normRow['asientos'] || normRow['numeroasientos'] || row['Numero Asientos'], 'int');
      const combDesc = String(normRow['combustible'] || row['COMBUSTIBLE'] || '').trim() || null;

      const precioIniNum = precioNum; // initial load maps to base price as well

      if (modExists.length === 0) {
        const res = await execWithDebug(`
          INSERT INTO Modelo (
            MarcaID, DescripcionModelo, CodigoModelo, CodigoAutodata, Familia, 
            Anio, SegmentacionAutodata, Carroceria, OrigenCodigo, Importador, 
            TipoMotor, TipoVehiculoElectrico, TipoCaja, CC, HP, 
            Cilindros, Valvulas, Puertas, Asientos, PrecioInicial, CombustibleCodigo,
            Estado, Activo
          ) OUTPUT INSERTED.ModeloID VALUES (
            @p0, @p1, @p2, @p3, @p4, 
            @p5, @p6, @p7, @p8, @p9, 
            @p10, @p11, @p12, @p13, @p14, 
            @p15, @p16, @p17, @p18, @p19, @p20,
            'importado', 1
          )`, 
          [
            dbMarcaId, modeloDesc, codModelo, codigoAutodata, familiaDesc,
            anioNum, segmentoDesc, carroceriaDesc, origenDesc, importadorDesc,
            tipoMotorDesc, vehiculoElectricoDesc, tipoCajaDesc, cilinCcNum, potenciaHpNum,
            cilindrosNum, valvulasNum, puertasNum, asientosNum, precioIniNum, combDesc
          ]
        );
        modeloIdDb = res[0].ModeloID;
        creados.modelos++;

        // Add history log explicitly
        await execWithDebug(`INSERT INTO ModeloHistorial (ModeloID, Campo, ValorAnterior, ValorNuevo, Usuario) VALUES (@p0, 'Estado', NULL, 'importado', 'ImportacionMasiva')`, [modeloIdDb]);
      } else {
        modeloIdDb = modExists[0].ModeloID;
        await execWithDebug(`
          UPDATE Modelo SET 
            DescripcionModelo = @p0, CodigoAutodata = @p1, Familia = @p2,
            Anio = @p3, SegmentacionAutodata = @p4, Carroceria = @p5, OrigenCodigo = @p6, Importador = @p7,
            TipoMotor = @p8, TipoVehiculoElectrico = @p9, TipoCaja = @p10, CC = @p11, HP = @p12,
            Cilindros = @p13, Valvulas = @p14, Puertas = @p15, Asientos = @p16, PrecioInicial = @p17, CombustibleCodigo = @p18
          WHERE ModeloID = @p19`, 
          [
            modeloDesc, codigoAutodata, familiaDesc,
            anioNum, segmentoDesc, carroceriaDesc, origenDesc, importadorDesc,
            tipoMotorDesc, vehiculoElectricoDesc, tipoCajaDesc, cilinCcNum, potenciaHpNum,
            cilindrosNum, valvulasNum, puertasNum, asientosNum, precioIniNum, combDesc,
            modeloIdDb
          ]
        );
      }

      if (!modeloIdDb) continue;

      // 3. Insert PrecioModelo
      if (precioNum !== null) {
        await execWithDebug(`
          INSERT INTO PrecioModelo (ModeloID, Precio, Moneda, FechaRegistro, UsuarioID, Estado)
          VALUES (@p0, @p1, 'USD', GETDATE(), @p2, 'Activo')
        `, [modeloIdDb, precioNum, usuarioId]);
        creados.precios++;
      }

      // 4. EquipamientoModelo Upsert (dynamic payloads by DB column types)
      const equipPayload = { ModeloID: modeloIdDb };
      for (const col of dbEquipCols) {
        let val = normRow[col.normKey];
        if (val !== undefined && val !== null && val !== '') {
          if (col.isBit) val = toBool(val);
          else if (col.isNumeric) val = toNum(val, 'decimal');
          equipPayload[col.dbName] = val;
        }
      }

      const eqExists = await execWithDebug(`SELECT EquipamientoID FROM EquipamientoModelo WHERE ModeloID = @p0`, [modeloIdDb]);
      
      const payloadKeys = Object.keys(equipPayload).filter(k => k !== 'ModeloID');
      if (payloadKeys.length > 0) {
        if (eqExists.length === 0) {
          const keysStr = ['ModeloID', ...payloadKeys].join(', ');
          const valsIdx = ['@p0', ...payloadKeys.map((_, i) => `@p${i + 1}`)].join(', ');
          const params = [modeloIdDb, ...payloadKeys.map(k => equipPayload[k])];
          await execWithDebug(`INSERT INTO EquipamientoModelo (${keysStr}) VALUES (${valsIdx})`, params);
          creados.equipamiento_inserts++;
        } else {
          const updateStr = payloadKeys.map((k, i) => `${k} = @p${i + 1}`).join(', ');
          const params = [modeloIdDb, ...payloadKeys.map(k => equipPayload[k])];
          await execWithDebug(`UPDATE EquipamientoModelo SET ${updateStr} WHERE ModeloID = @p0`, params);
          creados.equipamiento_updates++;
        }
      }
    }

    return res.status(200).json({
      success: true,
      message: 'Archivo procesado con éxito',
      data: { creados }
    });
  } catch (error) {
    logger.error('Error procesando plantilla:', error);
    return res.status(500).json({ success: false, message: 'Error en la importación: ' + error.message });
  }
};

module.exports = {
  upload,
  importarExcelAutos,
  importarExcelPrecios,
  importarCSV,
  importarExcelCompleto,
  descargarTemplateCompleto,
  listarBatches,
  obtenerBatch,
  procesarBatch,
  eliminarBatch
};

