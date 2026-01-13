const { Model } = require('objection');

class ModeloEstado extends Model {
  static get tableName() {
    return 'ModeloEstado';
  }

  static get idColumn() {
    return 'EstadoID';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['NombreEstado'],
      properties: {
        EstadoID: { type: 'integer' },
        NombreEstado: { type: 'string', maxLength: 100 }
      }
    };
  }
}

module.exports = ModeloEstado;
