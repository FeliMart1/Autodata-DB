// departamentosController.js
// Controlador para gestión de departamentos

const db = require('../config/db-simple');
const logger = require('../config/logger');

/**
 * Obtener todos los departamentos activos
 */
const obtenerDepartamentos = async (req, res) => {
    try {
        const query = `
            SELECT 
                DepartamentoID,
                Codigo,
                Nombre,
                Pais,
                Activo,
                FechaCreacion
            FROM Departamento
            WHERE Activo = 1
            ORDER BY Nombre ASC
        `;

        const result = await db.query(query);

        res.json({
            success: true,
            data: result || [],
            count: result?.length || 0
        });

    } catch (error) {
        logger.error('Error al obtener departamentos:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener departamentos',
            error: error.message
        });
    }
};

/**
 * Obtener un departamento por ID
 */
const obtenerDepartamentoPorId = async (req, res) => {
    try {
        const { id } = req.params;

        const query = `
            SELECT 
                DepartamentoID,
                Codigo,
                Nombre,
                Pais,
                Activo,
                FechaCreacion
            FROM Departamento
            WHERE DepartamentoID = @id AND Activo = 1
        `;

        const result = await db.query(query, { id });

        if (!result || result.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Departamento no encontrado'
            });
        }

        res.json({
            success: true,
            data: result[0]
        });

    } catch (error) {
        logger.error('Error al obtener departamento:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener departamento',
            error: error.message
        });
    }
};

module.exports = {
    obtenerDepartamentos,
    obtenerDepartamentoPorId
};
