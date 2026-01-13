require('dotenv').config();
const sql = require('msnodesqlv8');

const connectionString = "Server=localhost\\SQLEXPRESS;Database=Autodata;Trusted_Connection=Yes;Driver={ODBC Driver 17 for SQL Server}";

console.log('Intentando conectar con Windows Authentication...');
console.log('Connection String:', connectionString);

sql.query(connectionString, "SELECT @@VERSION AS version, DB_NAME() AS database_name", (err, rows) => {
  if (err) {
    console.error('✗ Error de conexión:', err);
    process.exit(1);
  }
  
  console.log('✓ Conexión exitosa!');
  console.log('SQL Server version:', rows[0].version);
  console.log('Database:', rows[0].database_name);
  process.exit(0);
});
