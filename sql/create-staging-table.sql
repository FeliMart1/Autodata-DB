-- Crear esquema staging si no existe
IF NOT EXISTS (SELECT * FROM sys.schemas WHERE name = 'stg')
BEGIN
    EXEC('CREATE SCHEMA stg')
END
GO

-- Tabla staging para importación CSV de Claudio
IF OBJECT_ID('stg.Claudio_Modelos', 'U') IS NOT NULL
    DROP TABLE stg.Claudio_Modelos;
GO

CREATE TABLE stg.Claudio_Modelos (
    load_id INT IDENTITY(1,1) PRIMARY KEY,
    load_batch_id UNIQUEIDENTIFIER NOT NULL DEFAULT NEWID(),
    load_timestamp DATETIME2 NOT NULL DEFAULT GETDATE(),
    load_status VARCHAR(50) DEFAULT 'PENDING', -- PENDING, PROCESSED, ERROR
    load_error_message NVARCHAR(MAX),
    
    -- Datos del CSV (todas las columnas como NVARCHAR para recibir cualquier dato)
    marca NVARCHAR(100),
    modelo NVARCHAR(200),
    anio NVARCHAR(10),
    version NVARCHAR(500),
    combustible NVARCHAR(50),
    tipo NVARCHAR(50),
    origen NVARCHAR(100),
    categoria NVARCHAR(100),
    segmento NVARCHAR(100),
    cc NVARCHAR(20),
    hp NVARCHAR(20),
    traccion NVARCHAR(50),
    caja NVARCHAR(100),
    turbo NVARCHAR(10),
    puertas NVARCHAR(10),
    pasajeros NVARCHAR(10),
    precio NVARCHAR(50),
    moneda NVARCHAR(10),
    
    -- Equipamiento (columnas opcionales del CSV)
    airbag_conductor NVARCHAR(10),
    airbag_acompanante NVARCHAR(10),
    airbags_laterales NVARCHAR(10),
    airbags_cortina NVARCHAR(10),
    abs NVARCHAR(10),
    control_estabilidad NVARCHAR(10),
    control_traccion NVARCHAR(10),
    asistente_arranque_pendiente NVARCHAR(10),
    climatizador NVARCHAR(10),
    aire_acondicionado NVARCHAR(10),
    camara_retroceso NVARCHAR(10),
    sensores_estacionamiento NVARCHAR(10),
    bluetooth NVARCHAR(10),
    usb NVARCHAR(10),
    pantalla_tactil NVARCHAR(10),
    gps NVARCHAR(10),
    llantas_aleacion NVARCHAR(10),
    techo_panoramico NVARCHAR(10),
    asientos_cuero NVARCHAR(10),
    asientos_electricos NVARCHAR(10),
    
    -- Metadata adicional
    raw_line NVARCHAR(MAX), -- Línea completa del CSV para debug
    
    INDEX IX_Claudio_Modelos_Batch (load_batch_id),
    INDEX IX_Claudio_Modelos_Status (load_status),
    INDEX IX_Claudio_Modelos_Timestamp (load_timestamp)
);
GO

-- Vista para datos pendientes de procesar
CREATE OR ALTER VIEW stg.v_Claudio_Modelos_Pending AS
SELECT 
    load_id,
    load_batch_id,
    load_timestamp,
    marca,
    modelo,
    anio,
    version,
    combustible,
    tipo,
    origen,
    categoria,
    precio,
    moneda
FROM stg.Claudio_Modelos
WHERE load_status = 'PENDING';
GO

PRINT 'Tabla stg.Claudio_Modelos creada exitosamente';
