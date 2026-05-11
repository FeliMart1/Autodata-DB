-- Migración para actualizar VistaModeloDetalle de acuerdo al refactor de columnas
-- Extrae los datos minimos de Modelo y unifica todo el Equipamiento restante.

IF OBJECT_ID('dbo.VistaModeloDetalle', 'V') IS NOT NULL
    DROP VIEW dbo.VistaModeloDetalle;
GO

CREATE VIEW [dbo].[VistaModeloDetalle]
AS
SELECT 
    m.ModeloID,
    m.MarcaID,
    mar.Descripcion AS Marca,
    mar.CodigoMarca AS MARCOD,
    m.CodigoModelo AS MARMODCOD,
    m.CodigoAutodata,
    m.DescripcionModelo AS Modelo,
    m.Familia,
    m.Activo,
    m.Anio,
    
    -- Datos base de carga
    m.PrecioInicial AS PrecioBase,
    m.OrigenCodigo AS Origen,
    m.Importador,
    m.Carroceria,
    m.SegmentacionAutodata AS Segmento,
    m.TipoMotor,
    m.TipoVehiculoElectrico,
    m.TipoCaja,
    m.Cilindrada AS CC,
    m.Potencia AS HP,
    m.Cilindros,
    m.Valvulas,
    m.Puertas,
    m.Asientos,
    m.CombustibleCodigo AS Combustible,
    m.TipoVehiculo,
    
    -- Precio actual (buscado de la tabla PrecioModelo)
    (SELECT TOP 1 Precio FROM PrecioModelo p WHERE p.ModeloID = m.ModeloID AND p.Estado = 'Activo' ORDER BY p.FechaRegistro DESC) AS PrecioActual,

    -- Equipamiento y el resto dinamico
    eq.* 
FROM 
    Modelo m
INNER JOIN 
    Marca mar ON m.MarcaID = mar.MarcaID
LEFT JOIN 
    EquipamientoModelo eq ON m.ModeloID = eq.ModeloID;
GO
