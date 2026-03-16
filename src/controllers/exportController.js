const xl = require('xlsx');
const db = require('../config/db-simple');
const logger = require('../config/logger');

exports.exportarVentasExcel = async (req, res) => {
  try {
    const { anio, mes } = req.query;

    if (!anio || !mes) {
      return res.status(400).json({ success: false, message: 'Año y mes son requeridos' });
    }

    const query = `
      SELECT 
        m.CodigoAutodata AS [CODIGO CONCATENADO],
        v.Anio AS [AÑO],
        v.Mes AS [MES],
        -- Generar fecha aproximada como string DD/MM/YY
        RIGHT('0' + CAST(v.Mes AS VARCHAR(2)), 2) + '/01/' + RIGHT(CAST(v.Anio AS VARCHAR(4)), 2) AS [FECHA],
        v.Cantidad AS [VENTAS],
        ISNULL(m.PrecioInicial, 0) AS [PRECIO],
        (v.Cantidad * ISNULL(m.PrecioInicial, 0)) AS [USD],
        ISNULL(m.Tipo, m.CategoriaCodigo) AS [TIPO],
        ISNULL(m.SegmentacionAutodata, '') AS [SEGMENTO]
      FROM Venta v
      JOIN Modelo m ON v.ModeloID = m.ModeloID
      WHERE v.Anio = @p0 AND v.Mes = @p1
    `;

    const ventas = await db.queryWithParams(query, [anio, mes]);

    if (!ventas || ventas.length === 0) {
      return res.status(404).json({ success: false, message: 'No se encontraron ventas para el periodo especificado' });
    }

    const wb = xl.utils.book_new();
    const ws = xl.utils.json_to_sheet(ventas);
    xl.utils.book_append_sheet(wb, ws, 'Ventas');

    const buffer = xl.write(wb, { type: 'buffer', bookType: 'xlsx' });

    res.setHeader('Content-Disposition', `attachment; filename=Ventas_${anio}_${mes}.xlsx`);
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.status(200).send(buffer);

  } catch (error) {
    logger.error('Error exportando ventas:', error);
    res.status(500).json({ success: false, message: 'Error interno exportando datos', error: error.message });
  }
};

exports.exportarEmpadronamientosExcel = async (req, res) => {
  try {
    const { anio, mes } = req.query;

    if (!anio || !mes) {
      return res.status(400).json({ success: false, message: 'Año y mes son requeridos' });
    }

    const query = `
      SELECT 
        m.CodigoAutodata AS [CODIGO MODELO],
        e.Mes AS [Mes],
        -- En el Excel del usuario la FECHA es un serial date de Excel o string, enviaremos en formato fecha
        RIGHT('0' + CAST(e.Mes AS VARCHAR(2)), 2) + '/01/' + RIGHT(CAST(e.Anio AS VARCHAR(4)), 2) AS [FECHA],
        UPPER(ISNULL(d.Nombre, '')) AS [Departamento],
        e.Cantidad AS [CANTIDAD]
      FROM Empadronamiento e
      JOIN Modelo m ON e.ModeloID = m.ModeloID
      JOIN Departamento d ON e.DepartamentoID = d.DepartamentoID
      WHERE e.Anio = @p0 AND e.Mes = @p1
    `;

    const empadronamientos = await db.queryWithParams(query, [anio, mes]);

    if (!empadronamientos || empadronamientos.length === 0) {
      return res.status(404).json({ success: false, message: 'No se encontraron empadronamientos para el periodo especificado' });
    }

    const wb = xl.utils.book_new();
    const ws = xl.utils.json_to_sheet(empadronamientos);
    xl.utils.book_append_sheet(wb, ws, 'Empadronamiento');

    const buffer = xl.write(wb, { type: 'buffer', bookType: 'xlsx' });

    res.setHeader('Content-Disposition', `attachment; filename=Empadronamientos_${anio}_${mes}.xlsx`);
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.status(200).send(buffer);

  } catch (error) {
    logger.error('Error exportando empadronamientos:', error);
    res.status(500).json({ success: false, message: 'Error interno exportando datos', error: error.message });
  }
};
