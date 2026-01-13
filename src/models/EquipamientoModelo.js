const { Model } = require('objection');

class EquipamientoModelo extends Model {
  static get tableName() {
    return 'EquipamientoModelo';
  }

  static get idColumn() {
    return 'EquipamientoID';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['ModeloID'],
      properties: {
        EquipamientoID: { type: 'integer' },
        ModeloID: { type: 'integer' },
        AirbagConductor: { type: 'boolean' },
        AirbagPasajero: { type: 'boolean' },
        AirbagLaterales: { type: 'boolean' },
        AirbagCortina: { type: 'boolean' },
        ABS: { type: 'boolean' },
        ControlEstabilidad: { type: 'boolean' },
        ControlTraccion: { type: 'boolean' },
        AsistenciaArranque: { type: 'boolean' },
        AnclajesISOFIX: { type: 'boolean' },
        AireAcondicionado: { type: 'boolean' },
        Climatizador: { type: 'boolean' },
        AlzavidriosDel: { type: 'boolean' },
        AlzavidriosTras: { type: 'boolean' },
        CierreCentralizado: { type: 'boolean' },
        EspejosElectricos: { type: 'boolean' },
        ControlCrucero: { type: 'boolean' },
        ComputadoraABordo: { type: 'boolean' },
        LlantasAleacion: { type: 'boolean' },
        FarosLED: { type: 'boolean' },
        FarosXenon: { type: 'boolean' },
        Neblineros: { type: 'boolean' },
        TechoSolar: { type: 'boolean' },
        TapizCuero: { type: 'boolean' },
        AsientosElectricos: { type: 'boolean' },
        VolanteCuero: { type: 'boolean' },
        PantallaTouch: { type: 'boolean' },
        AppleCarPlay: { type: 'boolean' },
        AndroidAuto: { type: 'boolean' },
        Bluetooth: { type: 'boolean' },
        GPS: { type: 'boolean' },
        PuertoUSB: { type: 'boolean' },
        CamaraRetroceso: { type: 'boolean' },
        SensoresEstacionamiento: { type: 'boolean' },
        NeumaticoRepuestoCompleto: { type: 'boolean' },
        Keyless: { type: 'boolean' },
        EncendidoBoton: { type: 'boolean' },
        StartStop: { type: 'boolean' },
        FechaCreacion: { type: 'string', format: 'date-time' },
        FechaActualizacion: { type: 'string', format: 'date-time' }
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
          from: 'EquipamientoModelo.ModeloID',
          to: 'Modelo.ModeloID'
        }
      }
    };
  }

  $beforeInsert() {
    this.FechaCreacion = new Date().toISOString();
  }

  $beforeUpdate() {
    this.FechaActualizacion = new Date().toISOString();
  }
}

module.exports = EquipamientoModelo;
