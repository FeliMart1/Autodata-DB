const { Model } = require('objection');

class VersionModelo extends Model {
  static get tableName() {
    return 'VersionModelo';
  }

  static get idColumn() {
    return 'VersionID';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['ModeloID', 'CodigoVersion'],
      properties: {
        VersionID: { type: 'integer' },
        ModeloID: { type: 'integer' },
        CodigoVersion: { type: 'string', maxLength: 100 },
        Descripcion: { type: 'string' },
        Equipamiento: { type: 'string' },
        OrigenCodigo: { type: 'string', maxLength: 50 },
        FechaCarga: { type: 'string', format: 'date-time' }
      }
    };
  }

  static get relationMappings() {
    const Modelo = require('./Modelo');
    const PrecioVersion = require('./PrecioVersion');
    
    return {
      modelo: {
        relation: Model.BelongsToOneRelation,
        modelClass: Modelo,
        join: {
          from: 'VersionModelo.ModeloID',
          to: 'Modelo.ModeloID'
        }
      },
      precios: {
        relation: Model.HasManyRelation,
        modelClass: PrecioVersion,
        join: {
          from: 'VersionModelo.VersionID',
          to: 'PrecioVersion.VersionID'
        }
      }
    };
  }

  $beforeInsert() {
    this.FechaCarga = new Date().toISOString();
  }
}

module.exports = VersionModelo;
