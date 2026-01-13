/**
 * Utilidades para manejar el sistema de CodigoAutodata
 * 
 * CodigoAutodata: 8 dígitos (XXXXXXXX)
 * - Primeros 4 dígitos: CodigoMarca (ej: 0007)
 * - Últimos 4 dígitos: CodigoModelo (ej: 0276)
 * - Ejemplo: Audi (0007) + Q3 Advanced (0276) = 00070276
 */

/**
 * Formatea un número a 4 dígitos con padding de ceros
 * @param {number} num - Número a formatear
 * @returns {string} - String de 4 dígitos (ej: 7 -> "0007")
 */
function formatToCodigo4(num) {
  if (num === null || num === undefined) {
    throw new Error('Número no puede ser null o undefined');
  }
  
  const numStr = String(num);
  if (numStr.length > 4) {
    throw new Error(`Número ${num} excede 4 dígitos (máximo: 9999)`);
  }
  
  return numStr.padStart(4, '0');
}

/**
 * Genera el CodigoAutodata combinando CodigoMarca y CodigoModelo
 * @param {string|number} codigoMarca - Código de marca (4 dígitos o número)
 * @param {string|number} codigoModelo - Código de modelo (4 dígitos o número)
 * @returns {string} - CodigoAutodata de 8 dígitos
 */
function generarCodigoAutodata(codigoMarca, codigoModelo) {
  // Formatear a 4 dígitos si son números
  const marca = typeof codigoMarca === 'number' 
    ? formatToCodigo4(codigoMarca) 
    : String(codigoMarca).padStart(4, '0');
    
  const modelo = typeof codigoModelo === 'number'
    ? formatToCodigo4(codigoModelo)
    : String(codigoModelo).padStart(4, '0');
  
  // Validar longitud
  if (marca.length !== 4) {
    throw new Error(`CodigoMarca debe tener 4 dígitos, recibido: ${marca}`);
  }
  if (modelo.length !== 4) {
    throw new Error(`CodigoModelo debe tener 4 dígitos, recibido: ${modelo}`);
  }
  
  return marca + modelo;
}

/**
 * Separa un CodigoAutodata en sus componentes
 * @param {string} codigoAutodata - Código de 8 dígitos
 * @returns {{ codigoMarca: string, codigoModelo: string }}
 */
function descomponerCodigoAutodata(codigoAutodata) {
  if (!codigoAutodata || codigoAutodata.length !== 8) {
    throw new Error(`CodigoAutodata debe tener 8 dígitos, recibido: ${codigoAutodata}`);
  }
  
  return {
    codigoMarca: codigoAutodata.substring(0, 4),
    codigoModelo: codigoAutodata.substring(4, 8)
  };
}

/**
 * Valida que un CodigoAutodata tenga el formato correcto
 * @param {string} codigoAutodata - Código a validar
 * @returns {boolean}
 */
function validarCodigoAutodata(codigoAutodata) {
  if (!codigoAutodata) return false;
  
  // Debe tener exactamente 8 caracteres
  if (codigoAutodata.length !== 8) return false;
  
  // Debe ser solo dígitos
  if (!/^\d{8}$/.test(codigoAutodata)) return false;
  
  return true;
}

/**
 * Valida un código de 4 dígitos (Marca o Modelo)
 * @param {string} codigo - Código a validar
 * @returns {boolean}
 */
function validarCodigo4(codigo) {
  if (!codigo) return false;
  
  // Debe tener exactamente 4 caracteres
  if (codigo.length !== 4) return false;
  
  // Debe ser solo dígitos
  if (!/^\d{4}$/.test(codigo)) return false;
  
  return true;
}

/**
 * Obtiene el siguiente CodigoMarca disponible
 * @param {Object} db - Conexión a la base de datos
 * @returns {Promise<string>} - Próximo código disponible
 */
async function obtenerProximoCodigoMarca(db) {
  const result = await db.queryRaw(
    'SELECT MAX(CAST(CodigoMarca AS INT)) AS MaxCodigo FROM Marca'
  );
  
  const maxCodigo = result[0]?.MaxCodigo || 0;
  return formatToCodigo4(maxCodigo + 1);
}

/**
 * Obtiene el siguiente CodigoModelo disponible para una marca específica
 * @param {Object} db - Conexión a la base de datos
 * @param {number} marcaId - ID de la marca
 * @returns {Promise<string>} - Próximo código disponible para esa marca
 */
async function obtenerProximoCodigoModelo(db, marcaId) {
  if (!marcaId) {
    throw new Error('marcaId es requerido para obtener el próximo código de modelo');
  }
  
  const result = await db.queryRaw(
    `SELECT MAX(CAST(CodigoModelo AS INT)) AS MaxCodigo FROM Modelo WHERE MarcaID = ${marcaId}`
  );
  
  const maxCodigo = result[0]?.MaxCodigo || 0;
  return formatToCodigo4(maxCodigo + 1);
}

/**
 * Verifica si un CodigoAutodata ya existe
 * @param {Object} db - Conexión a la base de datos
 * @param {string} codigoAutodata - Código a verificar
 * @returns {Promise<boolean>}
 */
async function existeCodigoAutodata(db, codigoAutodata) {
  const result = await db.queryRaw(
    `SELECT COUNT(*) AS Count FROM Modelo WHERE CodigoAutodata = '${codigoAutodata}'`
  );
  
  return result[0]?.Count > 0;
}

/**
 * Verifica si un CodigoMarca ya existe
 * @param {Object} db - Conexión a la base de datos
 * @param {string} codigoMarca - Código a verificar
 * @returns {Promise<boolean>}
 */
async function existeCodigoMarca(db, codigoMarca) {
  const result = await db.queryRaw(
    `SELECT COUNT(*) AS Count FROM Marca WHERE CodigoMarca = '${codigoMarca}'`
  );
  
  return result[0]?.Count > 0;
}

/**
 * Verifica si un CodigoModelo ya existe
 * @param {Object} db - Conexión a la base de datos
 * @param {string} codigoModelo - Código a verificar
 * @returns {Promise<boolean>}
 */
async function existeCodigoModelo(db, codigoModelo) {
  const result = await db.queryRaw(
    `SELECT COUNT(*) AS Count FROM Modelo WHERE CodigoModelo = '${codigoModelo}'`
  );
  
  return result[0]?.Count > 0;
}

module.exports = {
  formatToCodigo4,
  generarCodigoAutodata,
  descomponerCodigoAutodata,
  validarCodigoAutodata,
  validarCodigo4,
  obtenerProximoCodigoMarca,
  obtenerProximoCodigoModelo,
  existeCodigoAutodata,
  existeCodigoMarca,
  existeCodigoModelo
};
