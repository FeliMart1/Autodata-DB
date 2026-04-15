const db = require('./src/config/db-simple');
const fs = require('fs');

async function run() {
    try {
        const query = `
            SELECT TABLE_NAME, COLUMN_NAME, DATA_TYPE, IS_NULLABLE
            FROM INFORMATION_SCHEMA.COLUMNS
            WHERE TABLE_SCHEMA = 'dbo'
        `;
        const columns = await db.queryRaw(query);
        const schema = {};
        columns.forEach(col => {
            if (!schema[col.TABLE_NAME]) schema[col.TABLE_NAME] = [];
            schema[col.TABLE_NAME].push(`${col.COLUMN_NAME} (${col.DATA_TYPE}, ${col.IS_NULLABLE})`);
        });
        
        fs.writeFileSync('db_schema_details.json', JSON.stringify(schema, null, 2));
        console.log('Schema saved to db_schema_details.json');
        process.exit(0);
    } catch(e) {
        console.error(e);
        process.exit(1);
    }
}
run();
