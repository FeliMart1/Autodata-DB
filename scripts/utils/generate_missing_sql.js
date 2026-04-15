const fs = require('fs');
const path = require('path');

const dbSchemaPath = path.join(__dirname, '../../db_schema_details.json');
const configPath = path.join(__dirname, '../../config_parsed.json');
const sqlOutPath = path.join(__dirname, '../../sql/migrations/15_agregar_campos_equipamiento.sql');

const dbSchema = JSON.parse(fs.readFileSync(dbSchemaPath, 'utf8'));
const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));

const eqCols = (dbSchema['EquipamientoModelo'] || []).map(c => c.split(' ')[0]);
const mCols = (dbSchema['Modelo'] || []).map(c => c.split(' ')[0]);

const normalize = s => s.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
const dbNorm = new Set([...eqCols, ...mCols].map(normalize));

const missingKeys = Object.keys(config).filter(k => !dbNorm.has(normalize(k)));

let sql = `-- Migracion generada dinamicamente
-- Agrega campos faltantes en EquipamientoModelo

`;

missingKeys.forEach(k => {
    let colName = k.replace(/[^a-zA-Z0-9_]/g, '');
    if (!colName) colName = 'Col_' + Math.floor(Math.random() * 1000);
    if (/^\d/.test(colName)) colName = 'C_' + colName;

    const values = config[k] || [];
    const valuesStr = values.join(' ').toUpperCase();

    let dataType = 'NVARCHAR(100)';
    if (valuesStr.includes('NUMEROS')) {
        if (valuesStr.includes('SIN DECIMALES')) {
            dataType = 'INT';
        } else {
            dataType = 'DECIMAL(10,2)';
        }
    } else if (valuesStr.includes('SI') && valuesStr.includes('NO')) {
        dataType = 'BIT';
    }

    sql += `IF NOT EXISTS (
    SELECT * FROM sys.columns 
    WHERE object_id = OBJECT_ID('EquipamientoModelo') AND name = '${colName}'
)
BEGIN
    ALTER TABLE EquipamientoModelo ADD [${colName}] ${dataType};
END
GO\n\n`;
});

fs.writeFileSync(sqlOutPath, sql, 'utf8');
console.log(`Generated SQL for ${missingKeys.length} missing columns.`);
