const fs = require('fs');

const dbSchema = JSON.parse(fs.readFileSync('db_schema_details.json', 'utf8'));
const configParsed = JSON.parse(fs.readFileSync('config_parsed.json', 'utf8'));

const equipColsOriginal = dbSchema.EquipamientoModelo.map(c => c.split(' ')[0]);
const modeloColsOriginal = dbSchema.Modelo.map(c => c.split(' ')[0]);
const existingColsSet = new Set([...equipColsOriginal.map(c => c.toLowerCase()), ...modeloColsOriginal.map(c => c.toLowerCase())]);

function cleanName(name) {
    let clean = name.replace(/[^a-zA-Z0-9\+]/g, ' ').replace(/\+/g, 'Plus');
    return clean.split(' ').filter(x => x).map(w => w.charAt(0).toUpperCase() + w.slice(1)).join('');
}

function getType(rules) {
    let rs = rules.join(' ').toLowerCase();
    
    if (rules.every(r => r === 'Si' || r === 'No' || r === 'N/A' || r === 'No tiene' || r === 'Adaptativo')) return 'BIT';
    
    if (rs.includes('si') && rs.includes('no') && !rs.includes('numeros') && rules.length <= 4 && !rs.includes('desde 0')) {
        return 'BIT';
    }
    
    if (rs.includes('numeros')) {
        if (rs.includes('sin decimales') || rs.includes('hasta dos cifras') || rs.includes('hasta cuatro cifras') || rs.includes('cuatro cifras') || rs.includes('con separacion de miles')) {
            return 'INT';
        }
        if (rs.includes('decimales') || rs.includes('con decimales')) {
            return 'DECIMAL(10,2)';
        }
        return 'INT'; 
    }
    
    if (rules.every(r => typeof r === 'number' || !isNaN(Number(r)))) return 'INT';
    
    return 'NVARCHAR(255)';
}

const knownMappings = {
    'TIPO2 - Carrocería': 'Tipo2',
    'ORIGEN': 'OrigenCodigo',
    'COMBUSTIBLE': 'CombustibleCodigo',
    'Largo ': 'Largo',
    'Ancho': 'Ancho',
    'Altura': 'Altura',
    'Dist. Ejes': 'DistanciaEjes',
    'Peso en orden de marcha ': 'PesoOrdenMarcha',
    'kg/hp': 'KgPorHP',
    'Neumáticos': 'Neumaticos',
    'Llantas de aleación': 'LlantasAleacion',
    'Diámetro llantas ': 'DiametroLlantas',
    'TPMS Monitoreo presión de neumáticos': 'TPMS',
    'Kit Inflable AntiPinchazo': 'KitInflableAntiPinchazo',
    'Rueda aux. homogeneo': 'RuedaAuxHomogenea',
    'Cilindros': 'Cilindros',
    'Válvulas': 'Valvulas',
    'CC': 'CC',
    'HP - CV': 'HP',
    'Iny.': 'Inyeccion',
    'Tracción': 'Traccion',
    'Suspensión': 'Suspension',
    'Caja': 'Caja',
    'Tipo caja Aut.': 'TipoCajaAut',
    'Marchas / velocidades': 'MarchasVelocidades',
    'Turbo': 'Turbo',
    'N° de puertas': 'NumeroPuertas',
    'Aceite': 'Aceite',
    'Norma': 'Norma',
    'CO2 (g/Km)': 'CO2_g_km',
    'Consumo ruta      (l/100 km)': 'ConsumoRuta',
    'Consumo urbano     (l/100 km)': 'ConsumoUrbano',
    'Consumo mixto      (l/100 km)': 'ConsumoMixto',
    'Garantía en años': 'GarantiaAnios',
    'Garantía en Km': 'GarantiaKm',
    'Garantías diferenciales': 'GarantiasDiferenciales',
    'Tipo de Vehiculo Electrico / Hibrido': 'TipoVehiculoElectrico',
    'E-Pedal': 'EPedal',
    'Cap. Tanque Hidrógeno': 'CapacidadTanqueHidrogeno',
    'Autonomía / Max. Range en kilometros': 'AutonomiaMaxRange',
    'Ciclo/norma': 'CicloNorma',
    'Potencia motor (KW)': 'PotenciaMotor',
    'Cap. operativa bat. / Battery capacity (Kwh)': 'CapacidadOperativaBateria',
    'Par del Motor - torque (Nm)': 'ParMotorTorque',
    'Potencia de carga-                 Pot. Máx (KW en CA)': 'PotenciaCargaMax',
    'Tipos de conectores': 'TiposConectores',
    'Garantía cap. Bat.': 'GarantiaCapBat',
    'Tecnología Bat. (materiales)': 'TecnologiaBat',
    'Sistema de climatización': 'SistemaClimatizacion',
    'Dirección': 'Direccion',
    'Tipo de bloqueo': 'TipoBloqueo',
    'Keyless o Smart key': 'KeylessSmartKey',
    'Levanta vidrios': 'LevantaVidrios',
    'Espejos eléct.': 'EspejosElectricos',
    'Espejo interior electrocromado': 'EspejoInteriorElectrocromado',
    'Espejos abatibles electricamente': 'EspejosAbatiblesElectricamente',
    'Tapizado ': 'Tapizado',
    'Volante revestido en Cuero': 'VolanteRevestidoCuero',
    'Tablero digital': 'TablerDigital',
    'Computadora': 'Computadora',
    'GPS': 'GPS',
    'Vel crucero': 'VelocidadCrucero',
    'Inmobilizador': 'Inmovilizador',
    'Alarma': 'Alarma',
    'ABAG': 'ABAG',
    'SRI (Sistema de retención infantil)': 'SRI',
    'ABS': 'ABS',
    'EBD-EBV-REF (Distribución elect. de frenada)': 'EBD_EBV_REF',
    'DISCOS FRENOS': 'DiscosFrenos',
    'Freno Estacionamento Electrico (EPB)': 'FrenoEstacionamientoElectrico',
    'ESP Control estabilidad': 'ESP_ControlEstabilidad',
    'Control tracción': 'ControlTraccion',
    'Asist. frenado detector distancia': 'AsistFrenadoDetectorDistancia',
    'Asist. Pendiente': 'AsistPendiente',
    'Det. cambio de fila': 'DetectorCambioFila',
    'Det. punto ciego': 'DetectorPuntoCiego',
    'Traffic Sign recognition': 'TrafficSignRecognition',
    'Driver attention control': 'DriverAttentionControl',
    'Detector   lluvia': 'DetectorLluvia',
    'Grip Control': 'GripControl',
    'Comando audio en volante': 'ComandoAudioVolante',
    'CD': 'CD',
    'MP3': 'MP3',
    'USB': 'USB',
    'Bluetooth': 'Bluetooth',
    'DVD': 'DVD',
    'Mirror Screen - Smartphone Display          ': 'MirrorScreen',
    'Sist. Multimedia': 'SistemaMultimedia',
    'Pant. Multimedia (")': 'PantallaMultimediaPulgadas',
    'Pantalla Tactil': 'PantallaTactil',
    'Cargador Smartphone con inducción': 'CargadorSmartphoneInduccion',
    'Kit Hi Fi (Bose/JBL/Focal)': 'KitHiFi',
    'Número de asientos ': 'NumeroAsientos',
    'Asiento elect. + Calef. + Masaje': 'AsientoElectricoCalefMasaje',
    'asientos rango 2 y 3': 'AsientosRango2y3',
    'asiento 2+1': 'Asiento2Mas1',
    'But. Electr.': 'ButacaElectrica',
    'Techo': 'Techo',
    'Techo Bi-tono': 'TechoBiTono',
    'Barras de techo': 'BarrasTecho',
    'Sensor estacionamiento': 'SensorEstacionamiento',
    'Cámara': 'Camara',
    'Sist. automático de estacionamento': 'SistemaAutomaticoEstacionamiento',
    'Faros de neblina': 'FarosNeblina',
    'Faros direccionales': 'FarosDireccionales',
    'Faros full LED    ': 'FarosFullLED',
    'Faros halógenos  + DRL LED (Diurnas)': 'FarosHalogenosDRL_LED',
    'Faros xenon + Limpadores': 'FarosXenonLimpiadores',
    'Pack Visibilidad - Encendido auto faros ': 'PackVisibilidad',
    'Paso de luces Cruz / ruta automática': 'PasoLucesCruzRutaAutomatica',
    'Visión nocturna': 'VisionNocturna',
    'Maletera apertura eléctrica': 'MaleteraAperturaElectrica',
    'Cap. Baúl ': 'CapacidadBaul',
    'Cap. Tanque combustible ': 'CapacidadTanqueCombustible',
    'Protector CAJA': 'ProtectorCaja',
    'Partición de cabina': 'ParticionCabina',
    'N° Puertas Lat.': 'NumPuertasLaterales',
    'Puerta lat. Eléctrica': 'PuertaLateralElectrica',
    'Carga útil (Kg)': 'CargaUtil_kg',
    'Volumen útil (m3)': 'VolumenUtil_m3',
    'Start Stop': 'StartStop',
    'limitador de velocidad': 'LimitadorVelocidad',
    'Alerta de tráfico cruzado trasero': 'AlertaTraficoCruzadoTrasero',
    'Alerta de tráfico cruzado frontal': 'AlertaTraficoCruzadoFrontal',
    'Frenado multicolisión': 'FrenadoMulticolision',
    'Head-Up Display': 'HeadUpDisplay',
    'Radio': 'Radio',
    'Asist. Descenso\r\n(HDC)': 'AsistDescensoHDC',
    'Paddle Shift': 'PaddleShift',
    'Apoyabrazo delantero': 'ApoyabrazosDelantero',
    'Faros Matrix': 'FarosMatrix',
    'Luces traseras led': 'LucesTraserasLED',
    'Bloqueo diferencial por terreno': 'BloqueDiferencialTerreno',
    'Número de techos que se abren': 'NumeroTechosQueSeAbren',
    'Asiento ventilado': 'AsientoVentilado',
    'Asientos con masajeador (número)': 'AsientosMasajeador',
    'Autonomía del motor eléctrico (BEV y PHEV)': 'AutonomiaMotorElectricoBEV_PHEV',
    'City Stop': 'CityStop',
    'Freno de peatones': 'FrenoPeatones',
    'Desempañador eléctrico': 'DesempaniadorElectrico',
    'Iluminación ambiental': 'IluminacionAmbiental',
    'Limpia-lava parabrisas trasero eléct.': 'LimpiaLavaParabrisasTrasero',
    'Apoyabrazo central de asiento trasero': 'ApoyabrazosCentralTrasero',
    'Soporte para muslo delantero': 'SoporteMusloDelantero',
    'Asiento trasero con ajuste eléctrico': 'AsientoTraseroAjusteElectrico',
    '3ra. Fila de asientos eléctricos': 'TerceraFilaAsientosElectricos',
    'Volante multifunción': 'VolanteMultifuncion',
    'Tablero digital 3D': 'TablerDigital3D',
    'Aceleracion BEV       0 a 100': 'AceleracionBEV_0a100',
    'Acceleration ICE': 'AccelerationICE',
    'Carga electrica por wireless': 'CargaElectricaWireless',
    'Carga electrica por induccion': 'CargaElectricaInduccion',
    'Cable electrico tipo 3 incluido': 'CableElectricoTipo3Incluido',
    'Chassis Drive Select': 'ChassisDriveSelect',
    'Chassis Sport Suspension': 'ChassisSportSuspension',
    'Direccion en las cuatro ruedas': 'DireccionCuatroRuedas',
    'Luces Laser': 'LucesLaser',
    'Luces tras. OLED': 'LucesTraserasOLED',
    'Dashboard display configurable': 'DashboardDisplayConfigurable',
    'Wireless Smartphone integration': 'WirelessSmartphoneIntegration',
    'Mobile phone Antenna': 'MobilePhoneAntenna',
    'Deflector de viento': 'DeflectorViento',
    'Asientos deportivos': 'AsientosDeportivos',
    'Seat adjustment, memory (Driver)': 'SeatAdjustmentMemoryDriver',
    'Seat adjustment, memory (Co-Driver)': 'SeatAdjustmentMemoryCoDriver',
    'Lumbar, Lumbar adjustment front (Driver)': 'LumbarAdjustmentFrontDriver',
    'Lumbar, Lumbar adjustment front (Co-Driver)': 'LumbarAdjustmentFrontCoDriver',
    'Seat heating, rear': 'SeatHeatingRear',
    'Precio a fecha de carga': 'PrecioAFechaDeCarga'
};

const migrationLines = [];
const addedFields = [];
const handled = new Set();
for (let c of existingColsSet) {
    handled.add(c);
}

for (const [key, rules] of Object.entries(configParsed)) {
    let colName = knownMappings[key];
    if (!colName) {
        colName = cleanName(key);
    }
    
    colName = colName.replace(/_+/g, '_').trim();
    
    const ln = colName.toLowerCase();
    if (!handled.has(ln)) {
        handled.add(ln);
        const type = getType(rules);
        migrationLines.push(`    ADD ${colName} ${type};`);
        addedFields.push(colName);
    }
}

let sqlOut = `-- Migration 15: Agregar campos faltantes de config_parsed.json a EquipamientoModelo\n`;
sqlOut += `ALTER TABLE EquipamientoModelo\n`;
sqlOut += migrationLines.join('\n') + '\n';

fs.writeFileSync('sql/migrations/15_agregar_campos_equipamiento.sql', sqlOut, 'utf8');
fs.writeFileSync('added_fields.json', JSON.stringify(addedFields, null, 2), 'utf8');
console.log(JSON.stringify(addedFields));
