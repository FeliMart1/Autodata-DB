require('dotenv').config();

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
module.exports = {
  development: {
    client: 'mssql',
    connection: {
      server: 'localhost',
      database: 'Autodata',
      options: {
        encrypt: false,
        trustServerCertificate: true,
        enableArithAbort: true,
        instanceName: 'SQLEXPRESS',
        trustedConnection: true  // Windows Authentication con tedious
      }
    },
    pool: {
      min: 1,
      max: 5
    },
    migrations: {
      directory: './src/migrations',
      tableName: 'knex_migrations'
    },
    seeds: {
      directory: './src/seeds'
    }
  },

  production: {
    client: 'mssql',
    connection: {
      server: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT || '1433'),
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      options: {
        encrypt: true,
        trustServerCertificate: false,
        enableArithAbort: true
      }
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      directory: './src/migrations',
      tableName: 'knex_migrations'
    }
  }
};
