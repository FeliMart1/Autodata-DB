const { Model } = require('objection');

class Modelo extends Model {
  static get tableName() {
    return 'Modelo';
  }

  static get idColumn() {
    return 'ModeloID';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['MarcaID', 'CodigoModelo', 'DescripcionModelo'],
      properties: {
        ModeloID: { type: 'integer' },
        MarcaID: { type: 'integer' },
        CodigoModelo: { type: 'string', maxLength: 100 },
        DescripcionModelo: { type: 'string', maxLength: 300 },
        CategoriaCodigo: { type: 'string', maxLength: 50 },
        CombustibleCodigo: { type: 'string', maxLength: 50 },
        OrigenCodigo: { type: 'string', maxLength: 50 },
        ShortName: { type: 'string', maxLength: 100 },
        Precio0KMInicial: { type: 'number' },
        Familia: { type: 'string', maxLength: 100 },
        Anio: { type: 'integer' },
        Tipo: { type: 'string', maxLength: 100 },
        Tipo2: { type: 'string', maxLength: 100 },
        CC: { type: 'integer' },
        HP: { type: 'integer' },
        Traccion: { type: 'string', maxLength: 50 },
        Caja: { type: 'string', maxLength: 50 },
        TipoCaja: { type: 'string', maxLength: 50 },
        Turbo: { type: 'boolean' },
        Puertas: { type: 'integer' },
        Pasajeros: { type: 'integer' },
        TipoVehiculo: { type: 'string', maxLength: 100 },
        SegmentacionAutodata: { type: 'string', maxLength: 50 },
        SegmentacionGM: { type: 'string', maxLength: 50 },
        SegmentacionAudi: { type: 'string', maxLength: 50 },
        SegmentacionSBI: { type: 'string', maxLength: 50 },
        SegmentacionCitroen: { type: 'string', maxLength: 50 },
        Importador: { type: 'string', maxLength: 200 },
        Estado: { type: 'string', maxLength: 50 },
        EstadoID: { type: 'integer' },
        FechaCreacion: { type: 'string', format: 'date-time' }
      }
    };
  }

  static get relationMappings() {
    const Marca = require('./Marca');
    const ModeloEstado = require('./ModeloEstado');
    const VersionModelo = require('./VersionModelo');
    const EquipamientoModelo = require('./EquipamientoModelo');
    const PrecioModelo = require('./PrecioModelo');
    
    return {
      marca: {
        relation: Model.BelongsToOneRelation,
        modelClass: Marca,
        join: {
          from: 'Modelo.MarcaID',
          to: 'Marca.MarcaID'
        }
      },
      estado: {
        relation: Model.BelongsToOneRelation,
        modelClass: ModeloEstado,
        join: {
          from: 'Modelo.EstadoID',
          to: 'ModeloEstado.EstadoID'
        }
      },
      versiones: {
        relation: Model.HasManyRelation,
        modelClass: VersionModelo,
        join: {
          from: 'Modelo.ModeloID',
          to: 'VersionModelo.ModeloID'
        }
      },
      equipamiento: {
        relation: Model.HasOneRelation,
        modelClass: EquipamientoModelo,
        join: {
          from: 'Modelo.ModeloID',
          to: 'EquipamientoModelo.ModeloID'
        }
      },
      precios: {
        relation: Model.HasManyRelation,
        modelClass: PrecioModelo,
        join: {
          from: 'Modelo.ModeloID',
          to: 'PrecioModelo.ModeloID'
        }
      }
    };
  }

  $beforeInsert() {
    this.FechaCreacion = new Date().toISOString();
  }
}

module.exports = Modelo;
