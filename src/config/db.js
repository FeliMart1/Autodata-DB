const sql = require('msnodesqlv8');
const Knex = require('knex');
const { Model } = require('objection');

// Connection string para Windows Authentication
const connectionString = "Server=localhost\\SQLEXPRESS;Database=Autodata;Trusted_Connection=Yes;Driver={ODBC Driver 17 for SQL Server}";

// Configurar Knex con custom client para msnodesqlv8
const knex = Knex({
  client: 'mssql',
  connection: connectionString
});

// Vincular Objection con Knex
Model.knex(knex);

module.exports = knex;
