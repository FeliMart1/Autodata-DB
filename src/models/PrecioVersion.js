const { Model } = require('objection');

class PrecioVersion extends Model {
  static get tableName() {
    return 'PrecioVersion';
  }

  static get idColumn() {
    return 'PrecioID';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['VersionID', 'Precio', 'Moneda'],
      properties: {
        PrecioID: { type: 'integer' },
        VersionID: { type: 'integer' },
        Precio: { type: 'number' },
        Moneda: { type: 'string', maxLength: 20 },
        FechaVigenciaDesde: { type: 'string', format: 'date' },
        FechaVigenciaHasta: { type: 'string', format: 'date' },
        Fuente: { type: 'string', maxLength: 400 },
        FechaCarga: { type: 'string', format: 'date-time' }
      }
    };
  }

  static get relationMappings() {
    const VersionModelo = require('./VersionModelo');
    
    return {
      version: {
        relation: Model.BelongsToOneRelation,
        modelClass: VersionModelo,
        join: {
          from: 'PrecioVersion.VersionID',
          to: 'VersionModelo.VersionID'
        }
      }
    };
  }

  $beforeInsert() {
    this.FechaCarga = new Date().toISOString();
  }
}

module.exports = PrecioVersion;
