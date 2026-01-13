const { Model } = require('objection');

class PrecioModelo extends Model {
  static get tableName() {
    return 'PrecioModelo';
  }

  static get idColumn() {
    return 'PrecioID';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['ModeloID', 'Precio', 'Moneda'],
      properties: {
        PrecioID: { type: 'integer' },
        ModeloID: { type: 'integer' },
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
    const Modelo = require('./Modelo');
    
    return {
      modelo: {
        relation: Model.BelongsToOneRelation,
        modelClass: Modelo,
        join: {
          from: 'PrecioModelo.ModeloID',
          to: 'Modelo.ModeloID'
        }
      }
    };
  }

  $beforeInsert() {
    this.FechaCarga = new Date().toISOString();
  }
}

module.exports = PrecioModelo;
