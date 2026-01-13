-- =============================================
-- Script: Verificar Tablas Existentes
-- Descripción: Muestra qué tablas ya existen y cuáles faltan
-- =============================================

USE Autodata;
GO

PRINT '==============================================';
PRINT 'VERIFICACIÓN DE ESTRUCTURA EXISTENTE';
PRINT '==============================================';
PRINT '';

-- Mostrar todas las tablas actuales
PRINT 'TABLAS EXISTENTES EN LA BASE DE DATOS:';
PRINT '--------------------------------------';
SELECT 
    TABLE_NAME as 'Tabla',
    (SELECT COUNT(*) 
     FROM INFORMATION_SCHEMA.COLUMNS 
     WHERE TABLE_NAME = t.TABLE_NAME) as 'Columnas'
FROM INFORMATION_SCHEMA.TABLES t
WHERE TABLE_TYPE = 'BASE TABLE'
ORDER BY TABLE_NAME;
GO

PRINT '';
PRINT 'VERIFICACIÓN DE TABLAS NECESARIAS:';
PRINT '-----------------------------------';

-- Verificar cada tabla
DECLARE @tablasNecesarias TABLE (
    Tabla NVARCHAR(100),
    Descripcion NVARCHAR(200)
);

INSERT INTO @tablasNecesarias VALUES 
    ('Usuario', 'Gestión de usuarios y autenticación'),
    ('Marca', 'Catálogo de marcas'),
    ('Modelo', 'Modelos de vehículos'),
    ('ModeloEstado', 'Tracking de cambios de estado'),
    ('ModeloHistorial', 'Auditoría completa'),
    ('EquipamientoModelo', 'Equipamiento del vehículo'),
    ('VersionModelo', 'Versiones/variantes'),
    ('PrecioModelo', 'Historial de precios por modelo'),
    ('PrecioVersion', 'Historial de precios por versión'),
    ('VentasModelo', 'Ventas mensuales');

SELECT 
    t.Tabla,
    t.Descripcion,
    CASE 
        WHEN OBJECT_ID('dbo.' + t.Tabla, 'U') IS NOT NULL THEN '✓ EXISTE'
        ELSE '✗ FALTA'
    END as Estado,
    CASE 
        WHEN OBJECT_ID('dbo.' + t.Tabla, 'U') IS NOT NULL 
        THEN (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = t.Tabla)
        ELSE 0
    END as Columnas
FROM @tablasNecesarias t
ORDER BY 
    CASE WHEN OBJECT_ID('dbo.' + t.Tabla, 'U') IS NOT NULL THEN 1 ELSE 0 END DESC,
    t.Tabla;
GO

PRINT '';
PRINT 'COLUMNAS DE TABLAS EXISTENTES:';
PRINT '-------------------------------';

-- Mostrar estructura detallada de cada tabla
DECLARE @tabla NVARCHAR(100);
DECLARE tabla_cursor CURSOR FOR 
    SELECT TABLE_NAME 
    FROM INFORMATION_SCHEMA.TABLES 
    WHERE TABLE_TYPE = 'BASE TABLE'
    ORDER BY TABLE_NAME;

OPEN tabla_cursor;
FETCH NEXT FROM tabla_cursor INTO @tabla;

WHILE @@FETCH_STATUS = 0
BEGIN
    PRINT '';
    PRINT 'Tabla: ' + @tabla;
    PRINT REPLICATE('-', 50);
    
    SELECT 
        COLUMN_NAME as Columna,
        DATA_TYPE as Tipo,
        CHARACTER_MAXIMUM_LENGTH as Longitud,
        IS_NULLABLE as Nullable
    FROM INFORMATION_SCHEMA.COLUMNS
    WHERE TABLE_NAME = @tabla
    ORDER BY ORDINAL_POSITION;
    
    FETCH NEXT FROM tabla_cursor INTO @tabla;
END

CLOSE tabla_cursor;
DEALLOCATE tabla_cursor;
GO

PRINT '';
PRINT '==============================================';
PRINT 'VERIFICACIÓN COMPLETADA';
PRINT '==============================================';
