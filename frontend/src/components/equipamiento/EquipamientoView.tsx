import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@components/ui/Card';
import { Badge } from '@components/ui/Badge';
import { LoadingSpinner } from '@components/ui/LoadingSpinner';
import { Alert } from '@components/ui/Alert';
import { equipamientoService } from '@services/equipamientoService';
import { CheckCircle2, XCircle } from 'lucide-react';

interface EquipamientoViewProps {
  modeloId: number;
}

export function EquipamientoView({ modeloId }: EquipamientoViewProps) {
  const [equipamiento, setEquipamiento] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadEquipamiento();
  }, [modeloId]);

  const loadEquipamiento = async () => {
    try {
      setIsLoading(true);
      const data = await equipamientoService.getByModeloId(modeloId);
      setEquipamiento(data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al cargar equipamiento');
    } finally {
      setIsLoading(false);
    }
  };

  const BooleanBadge = ({ value }: { value: any }) => {
    // Acepta boolean true/false, número 1/0, o strings 'Si'/'No'/'N/A'
    if (value === true || value === 1 || value === 'Si' || value === 'Sí') {
        return <Badge variant="success" className="gap-1 bg-green-500 hover:bg-green-600"><CheckCircle2 className="h-3 w-3" /> Sí</Badge>;
    }
    if (value === false || value === 0 || value === 'No') {
        return <Badge variant="secondary" className="gap-1"><XCircle className="h-3 w-3" /> No</Badge>;
    }
    if (value === 'N/A' || value === 'N/D') {
        return <Badge variant="outline" className="gap-1 border-slate-300 text-slate-500">{value}</Badge>;
    }
    return <></>;
  };

  const InfoRow = ({ label, value }: { label: string; value: any }) => {
    if (value === null || value === undefined || value === '') return null; // Don't show empty fields

    // Incluye 1/0 numéricos que devuelve msnodesqlv8 para columnas BIT
    const isBooleanish = value === true || value === false || value === 1 || value === 0
      || value === 'Si' || value === 'No' || value === 'Sí' || value === 'N/A';
    
    return (
      <div className="flex items-center justify-between py-2 border-b border-slate-100 last:border-b-0">
        <span className="text-sm font-medium text-slate-500 w-2/3 pr-4 leading-tight break-words">{label}</span>
        <div className="text-sm font-semibold text-slate-800 text-right">
            {isBooleanish ? <BooleanBadge value={value} /> : value}
        </div>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner text="Cargando equipamiento..." />
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        {error}
      </Alert>
    );
  }

  // null = no existe registro en DB (modelo importado sin equipamiento cargado aún)
  // objeto sin EquipamientoID = caso legacy, tratar igual
  if (!equipamiento || !equipamiento.EquipamientoID) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Equipamiento del Vehículo</CardTitle>
        </CardHeader>
        <CardContent>
          <Alert>
            <div className="space-y-2">
              <p className="font-medium">No hay equipamiento cargado para este modelo</p>
              <p className="text-sm text-muted-foreground">
                El equipamiento se carga en la fase correspondiente del flujo de trabajo.
                Una vez completados los datos mínimos y aprobados, podrás cargar los campos de equipamiento.
              </p>
            </div>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  // Mapa de claves DB → etiqueta legible en la vista
  // IMPORTANTE: este mapa actúa como WHITELIST de columnas canónicas.
  // Solo se muestran columnas presentes aquí, eliminando las ~98 columnas legacy de la DB.
  const labelMap: Record<string, string> = {
    // --- Dimensiones y neumáticos ---
    Largo: "Largo (mm)",
    Ancho: "Ancho (mm)",
    Altura: "Altura (mm)",
    DistanciaEjes: "Distancia entre ejes (mm)",
    PesoOrdenMarcha: "Peso orden de marcha (kg)",
    KgPorHP: "Kg/HP",
    Neumaticos: "Neumáticos",
    LlantasAleacion: "Llantas de aleación",
    DiametroLlantas: "Diámetro llantas (pulg.)",
    TPMS: "TPMS (sensor presión neumáticos)",
    KitInflableAntiPinchazo: "Kit inflable anti-pinchazo",
    RuedaAuxHomogenea: "Rueda auxiliar homogénea",
    // --- Mecánica ---
    Cilindros: "Cilindros",
    Valvulas: "Válvulas",
    Inyeccion: "Inyección",
    Traccion: "Tracción",
    Suspension: "Suspensión",
    Caja: "Tipo de Caja Automática",
    MarchasVelocidades: "Marchas / velocidades",
    Turbo: "Turbo",
    NumeroPuertas: "Número de puertas",
    Aceite: "Aceite",
    Norma: "Norma",
    StartStop: "Start / Stop",
    // --- Consumo y emisiones ---
    CO2_g_km: "CO₂ (g/km)",
    ConsumoRuta: "Consumo ruta (l/100km)",
    ConsumoUrbano: "Consumo urbano (l/100km)",
    ConsumoMixto: "Consumo mixto (l/100km)",
    // --- Garantía ---
    GarantiaAnios: "Garantía (años)",
    GarantiaKm: "Garantía (km)",
    GarantiasDiferenciales: "Garantías diferenciales",
    // --- Eléctrico / Híbrido ---
    TipoVehiculoElectrico: "Tipo vehículo eléctrico / híbrido",
    EPedal: "E-Pedal",
    CapacidadTanqueHidrogeno: "Capacidad tanque hidrógeno",
    AutonomiaMaxRange: "Autonomía máxima (km)",
    CicloNorma: "Ciclo / norma",
    PotenciaMotor: "Potencia motor",
    CapacidadOperativaBateria: "Capacidad operativa batería",
    ParMotorTorque: "Par motor / torque",
    PotenciaCargaMax: "Potencia de carga máxima",
    TiposConectores: "Tipos de conectores",
    GarantiaCapBat: "Garantía cap. batería",
    TecnologiaBat: "Tecnología batería",
    TiempoCarga: "Tiempo de carga",
    CodigoFichaTecnica: "Código ficha técnica",
    // --- Confort e interior ---
    SistemaClimatizacion: "Sistema climatización",
    Direccion: "Dirección",
    TipoBloqueo: "Tipo de bloqueo",
    KeylessSmartKey: "Keyless / Smart Key",
    LevantaVidrios: "Levantavidrios",
    EspejosElectricos: "Espejos eléctricos",
    EspejoInteriorElectrocromado: "Espejo interior electrocromado",
    EspejosAbatiblesElectricamente: "Espejos abatibles eléctricamente",
    Tapizado: "Tapizado",
    VolanteRevestidoCuero: "Volante revestido en cuero",
    TablerDigital: "Tablero Digital",
    Computadora: "Computadora a bordo",
    GPS: "GPS",
    VelocidadCrucero: "Control velocidad crucero",
    Inmovilizador: "Inmovilizador",
    Alarma: "Alarma",
    // --- Seguridad activa ---
    ABAG: "Airbags",
    SRI: "Sistema Retención Infantil",
    ABS: "ABS",
    EBD_EBV_REF: "EBD / EBV / REF",
    DiscosFrenos: "Discos / frenos",
    FrenoEstacionamientoElectrico: "Freno de estacionamiento eléctrico",
    ESP_ControlEstabilidad: "ESP / Control Estabilidad",
    ControlTraccion: "Control de tracción",
    AsistFrenadoDetectorDistancia: "Asist. frenado / detector distancia",
    AsistPendiente: "Asistencia en pendiente",
    DetectorCambioFila: "Detector cambio de fila",
    DetectorPuntoCiego: "Detector punto ciego",
    TrafficSignRecognition: "Reconocimiento señales de tráfico",
    DriverAttentionControl: "Control atención del conductor",
    DetectorLluvia: "Detector de lluvia",
    GripControl: "Grip Control",
    LimitadorVelocidad: "Limitador de velocidad",
    AsistDescensoHDC: "Asistencia de descenso (HDC)",
    PaddleShift: "Paddle Shift",
    // --- Multimedia y conectividad ---
    ComandoAudioVolante: "Comando audio en volante",
    CD: "CD",
    MP3: "MP3",
    USB: "USB",
    Bluetooth: "Bluetooth",
    DVD: "DVD",
    MirrorScreen: "Mirror Screen",
    SistemaMultimedia: "Sistema multimedia",
    PantallaMultimediaPulgadas: "Pantalla multimedia (pulgadas)",
    PantallaTactil: "Pantalla táctil",
    CargadorSmartphoneInduccion: "Cargador smartphone por inducción",
    KitHiFi: "Kit HiFi",
    Radio: "Radio",
    // --- Asientos ---
    NumeroAsientos: "Número de asientos",
    AsientoElectricoCalefMasaje: "Asiento eléctrico / calef. / masaje",
    AsientosRango2y3: "Asientos rango 2 y 3",
    Asiento2Mas1: "Asiento 2+1",
    ButacaElectrica: "Butaca eléctrica",
    AsientoVentilado: "Asiento ventilado",
    AsientosMasajeador: "Asientos con masajeador",
    ApoyabrazosDelantero: "Apoyabrazos delantero",
    ApoyabrazosCentralTrasero: "Apoyabrazos central trasero",
    SoporteMusloDelantero: "Soporte de muslo delantero",
    AsientoTraseroAjusteElectrico: "Asiento trasero ajuste eléctrico",
    TerceraFilaAsientosElectricos: "3ra fila de asientos eléctricos",
    TipoAlturaAsientoDelantero: "Tipo / altura asiento delantero",
    SeatAdjustmentMemoryDriver: "Memoria asiento conductor",
    SeatAdjustmentMemoryCoDriver: "Memoria asiento acompañante",
    LumbarAdjustmentFrontDriver: "Ajuste lumbar conductor",
    LumbarAdjustmentFrontCoDriver: "Ajuste lumbar acompañante",
    SeatHeatingRear: "Calefacción asientos traseros",
    // --- Techo y exterior ---
    Techo: "Techo",
    TechoBiTono: "Techo bi-tono",
    BarrasTecho: "Barras de techo",
    NumeroTechosQueSeAbren: "Número de techos que se abren",
    // --- Estacionamiento y cámara ---
    SensorEstacionamiento: "Sensor de estacionamiento",
    Camara: "Cámara",
    SistemaAutomaticoEstacionamiento: "Sistema automático de estacionamiento",
    // --- Iluminación ---
    FarosNeblina: "Faros de niebla",
    FarosDireccionales: "Faros direccionales",
    FarosFullLED: "Faros Full LED",
    FarosHalogenosDRL_LED: "Faros halógenos / DRL LED",
    FarosXenonLimpiadores: "Faros xenón / limpiadores",
    PackVisibilidad: "Pack visibilidad",
    PasoLucesCruzRutaAutomatica: "Paso de luces cruce/ruta automático",
    VisionNocturna: "Visión nocturna",
    FarosMatrix: "Faros Matrix",
    LucesTraserasLED: "Luces traseras LED",
    LucesTraserasOLED: "Luces traseras OLED",
    // --- Maletero / carga ---
    MaleteraAperturaElectrica: "Maletero apertura eléctrica",
    CapacidadBaul: "Capacidad baúl (L)",
    CapacidadTanqueCombustible: "Capacidad tanque combustible (L)",
    ProtectorCaja: "Protector de caja",
    ParticionCabina: "Partición de cabina",
    NumPuertasLaterales: "N° puertas laterales",
    PuertaLateralElectrica: "Puerta lateral eléctrica",
    CargaUtil_kg: "Carga útil (kg)",
    VolumenUtil_m3: "Volumen útil (m³)",
    TipoAlturaUL: "Tipo / altura carga útil",
    CapacidadCargaCamiones: "Capacidad carga camiones",
    // --- Seguridad avanzada ---
    AlertaTraficoCruzadoTrasero: "Alerta tráfico cruzado trasero",
    AlertaTraficoCruzadoFrontal: "Alerta tráfico cruzado frontal",
    FrenadoMulticolision: "Frenado multicolisión",
    HeadUpDisplay: "Head Up Display",
    CityStop: "City Stop",
    FrenoPeatones: "Frenado peatones",
    BloqueDiferencialTerreno: "Bloqueo diferencial por terreno",
    DesempaniadorElectrico: "Desempañador eléctrico",
    IluminacionAmbiental: "Iluminación ambiental",
    LimpiaLavaParabrisasTrasero: "Limpia/lava parabrisas trasero",
    BlackWheelFrame: "Black Wheel Frame",
    VolanteMultifuncion: "Volante multifunción",
    TablerDigital3D: "Tablero Digital 3D",
    // --- Performance y tech avanzada ---
    AceleracionBEV_0a100: "Aceleración BEV 0-100 km/h (s)",
    AccelerationICE: "Aceleración ICE 0-100 km/h (s)",
    CargaElectricaWireless: "Carga eléctrica wireless",
    CargaElectricaInduccion: "Carga eléctrica por inducción",
    CableElectricoTipo3Incluido: "Cable eléctrico tipo 3 incluido",
    ChassisDriveSelect: "Chassis Drive Select",
    ChassisSportSuspension: "Chassis suspensión sport",
    DireccionCuatroRuedas: "Dirección en cuatro ruedas",
    LucesLaser: "Luces láser",
    DashboardDisplayConfigurable: "Dashboard display configurable",
    WirelessSmartphoneIntegration: "Wireless smartphone integration",
    MobilePhoneAntenna: "Antena teléfono móvil",
    DeflectorViento: "Deflector de viento",
    AsientosDeportivos: "Asientos deportivos",
  };

  // Filtrar a solo columnas canónicas con etiqueta definida (excluye las ~98 legacy de la DB)
  const keys = Object.keys(equipamiento).filter(k => Object.prototype.hasOwnProperty.call(labelMap, k));

  const formatLabel = (key: string) => labelMap[key] || key.replace(/([A-Z])/g, ' $1').trim();

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2">

        <Card className="border shadow-sm overflow-hidden border-slate-200 col-span-full">
          <CardHeader className="bg-slate-50 border-b border-slate-200 py-3">
            <CardTitle className="text-base text-slate-800">Equipamiento Completo</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-4 px-4 py-2">
              {keys.map(key => (
                <InfoRow key={key} label={formatLabel(key)} value={equipamiento[key]} />
              ))}
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}
