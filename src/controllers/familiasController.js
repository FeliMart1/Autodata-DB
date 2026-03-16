// familiasController.js
// Controlador para gestión de familias de modelos

const db = require('../config/db-simple');
const logger = require('../config/logger');

/**
 * GET /api/familias
 * Obtener todas las familias (opcionalmente filtradas por marca)
 */
const obtenerFamilias = async (req, res) => {
    try {
        const { marcaId } = req.query;

        let query = `
            SELECT 
                f.FamiliaID,
                f.MarcaID,
                ma.Descripcion as Marca,
                f.Nombre,
                f.Descripcion,
                f.Activo,
                f.FechaCreacion,
                f.FechaModificacion,
                COUNT(m.ModeloID) as CantidadModelos
            FROM Familia f
            INNER JOIN Marca ma ON f.MarcaID = ma.MarcaID
            LEFT JOIN Modelo m ON f.FamiliaID = m.FamiliaID AND m.Activo = 1
        `;

        const params = {};

        if (marcaId) {
            query += ` WHERE f.MarcaID = @marcaId`;
            params.marcaId = marcaId;
        }

        query += `
            GROUP BY f.FamiliaID, f.MarcaID, ma.Descripcion, f.Nombre, f.Descripcion, f.Activo, f.FechaCreacion, f.FechaModificacion
            ORDER BY ma.Descripcion, f.Nombre
        `;

        const result = await db.query(query, params);

        res.json({
            success: true,
            data: result || [],
            count: result?.length || 0
        });

    } catch (error) {
        logger.error('Error al obtener familias:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener familias',
            error: error.message
        });
    }
};

/**
 * GET /api/familias/:id
 * Obtener una familia por ID
 */
const obtenerFamiliaPorId = async (req, res) => {
    try {
        const { id } = req.params;

        const query = `
            SELECT 
                f.FamiliaID,
                f.MarcaID,
                ma.Descripcion as Marca,
                f.Nombre,
                f.Descripcion,
                f.Activo,
                f.FechaCreacion,
                f.FechaModificacion,
                COUNT(m.ModeloID) as CantidadModelos
            FROM Familia f
            INNER JOIN Marca ma ON f.MarcaID = ma.MarcaID
            LEFT JOIN Modelo m ON f.FamiliaID = m.FamiliaID AND m.Activo = 1
            WHERE f.FamiliaID = @id
            GROUP BY f.FamiliaID, f.MarcaID, ma.Descripcion, f.Nombre, f.Descripcion, f.Activo, f.FechaCreacion, f.FechaModificacion
        `;

        const result = await db.query(query, { id });
        const familia = result[0];

        if (!familia) {
            return res.status(404).json({
                success: false,
                message: 'Familia no encontrada'
            });
        }

        res.json({
            success: true,
            data: familia
        });

    } catch (error) {
        logger.error('Error al obtener familia:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener familia',
            error: error.message
        });
    }
};

/**
 * POST /api/familias
 * Crear una nueva familia
 */
const crearFamilia = async (req, res) => {
    try {
        const { marcaId, nombre, descripcion } = req.body;

        // Validaciones
        if (!marcaId || !nombre) {
            return res.status(400).json({
                success: false,
                message: 'MarcaID y Nombre son requeridos'
            });
        }

        // Verificar si ya existe una familia con ese nombre en esa marca
        const existente = await db.query(
            `SELECT FamiliaID FROM Familia WHERE MarcaID = @marcaId AND Nombre = @nombre`,
            { marcaId, nombre }
        );

        if (existente && existente.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'Ya existe una familia con ese nombre para esta marca'
            });
        }

        // Crear familia
        const query = `
            INSERT INTO Familia (MarcaID, Nombre, Descripcion, FechaCreacion)
            OUTPUT INSERTED.FamiliaID
            VALUES (@marcaId, @nombre, @descripcion, GETDATE())
        `;

        const result = await db.query(query, { marcaId, nombre, descripcion: descripcion || null });
        const familiaId = result[0]?.FamiliaID;

        logger.info(`Familia creada: ${nombre} (ID: ${familiaId}, Marca: ${marcaId})`);

        res.status(201).json({
            success: true,
            message: 'Familia creada exitosamente',
            data: { familiaId }
        });

    } catch (error) {
        logger.error('Error al crear familia:', error);
        res.status(500).json({
            success: false,
            message: 'Error al crear familia',
            error: error.message
        });
    }
};

/**
 * PUT /api/familias/:id
 * Actualizar una familia
 */
const actualizarFamilia = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, descripcion, activo } = req.body;

        // Validaciones
        if (!nombre) {
            return res.status(400).json({
                success: false,
                message: 'Nombre es requerido'
            });
        }

        // Verificar si la familia existe
        const existente = await db.query(
            `SELECT FamiliaID FROM Familia WHERE FamiliaID = @id`,
            { id }
        );

        if (!existente || existente.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Familia no encontrada'
            });
        }

        // Actualizar familia
        const query = `
            UPDATE Familia
            SET 
                Nombre = @nombre,
                Descripcion = @descripcion,
                Activo = @activo,
                FechaModificacion = GETDATE()
            WHERE FamiliaID = @id
        `;

        await db.query(query, {
            id,
            nombre,
            descripcion: descripcion || null,
            activo: activo !== undefined ? activo : 1
        });

        logger.info(`Familia actualizada: ID ${id}`);

        res.json({
            success: true,
            message: 'Familia actualizada exitosamente'
        });

    } catch (error) {
        logger.error('Error al actualizar familia:', error);
        res.status(500).json({
            success: false,
            message: 'Error al actualizar familia',
            error: error.message
        });
    }
};

/**
 * DELETE /api/familias/:id
 * Eliminar (desactivar) una familia
 */
const eliminarFamilia = async (req, res) => {
    try {
        const { id } = req.params;

        // Verificar si la familia tiene modelos asociados
        const modelos = await db.query(
            `SELECT COUNT(*) as Total FROM Modelo WHERE FamiliaID = @id AND Activo = 1`,
            { id }
        );

        const totalModelos = modelos[0]?.Total || 0;

        if (totalModelos > 0) {
            return res.status(400).json({
                success: false,
                message: `No se puede eliminar la familia porque tiene ${totalModelos} modelo(s) asociado(s)`
            });
        }

        // Desactivar familia
        await db.query(
            `UPDATE Familia SET Activo = 0, FechaModificacion = GETDATE() WHERE FamiliaID = @id`,
            { id }
        );

        logger.info(`Familia eliminada (desactivada): ID ${id}`);

        res.json({
            success: true,
            message: 'Familia eliminada exitosamente'
        });

    } catch (error) {
        logger.error('Error al eliminar familia:', error);
        res.status(500).json({
            success: false,
            message: 'Error al eliminar familia',
            error: error.message
        });
    }
};

module.exports = {
    obtenerFamilias,
    obtenerFamiliaPorId,
    crearFamilia,
    actualizarFamilia,
    eliminarFamilia
};
