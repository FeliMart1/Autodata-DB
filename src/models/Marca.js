const { Model } = require('objection');

class Marca extends Model {
  static get tableName() {
    return 'Marca';
  }

  static get idColumn() {
    return 'MarcaID';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['CodigoMarca', 'Descripcion'],
      properties: {
        MarcaID: { type: 'integer' },
        CodigoMarca: { type: 'string', maxLength: 50 },
        Descripcion: { type: 'string', maxLength: 200 },
        ShortName: { type: 'string', maxLength: 50 },
        Origen: { type: 'string', maxLength: 100 },
        CodigoOrigen: { type: 'string', maxLength: 50 },
        FechaCreacion: { type: 'string', format: 'date-time' }
      }
    };
  }

  static get relationMappings() {
    const Modelo = require('./Modelo');
    
    return {
      modelos: {
        relation: Model.HasManyRelation,
        modelClass: Modelo,
        join: {
          from: 'Marca.MarcaID',
          to: 'Modelo.MarcaID'
        }
      }
    };
  }

  $beforeInsert() {
    this.FechaCreacion = new Date().toISOString();
  }
}

module.exports = Marca;
