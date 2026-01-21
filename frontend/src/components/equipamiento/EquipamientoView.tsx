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

interface Equipamiento {
  [key: string]: any;
}

export function EquipamientoView({ modeloId }: EquipamientoViewProps) {
  const [equipamiento, setEquipamiento] = useState<Equipamiento | null>(null);
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

  const BooleanBadge = ({ value }: { value: boolean }) => (
    value ? (
      <Badge variant="success" className="gap-1">
        <CheckCircle2 className="h-3 w-3" />
        Sí
      </Badge>
    ) : (
      <Badge variant="secondary" className="gap-1">
        <XCircle className="h-3 w-3" />
        No
      </Badge>
    )
  );

  const EquipamientoRow = ({ label, value }: { label: string; value: boolean }) => (
    <div className="flex items-center justify-between py-3 border-b last:border-b-0">
      <span className="text-sm font-medium">{label}</span>
      <BooleanBadge value={value} />
    </div>
  );

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

  if (!equipamiento) {
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
                Una vez completados los datos mínimos y aprobados, podrás cargar los ~150 campos de equipamiento.
              </p>
            </div>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  const InfoRow = ({ label, value }: { label: string; value: any }) => (
    <div className="flex items-center justify-between py-2 border-b last:border-b-0">
      <span className="text-sm font-medium text-muted-foreground">{label}</span>
      <span className="text-sm font-semibold">{value !== null && value !== undefined ? value : '-'}</span>
    </div>
  );

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {/* DIMENSIONES Y DATOS FÍSICOS */}
      <Card>
        <CardHeader>
          <CardTitle>Dimensiones y Datos Físicos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-1">
            <InfoRow label="Largo" value={equipamiento.Largo} />
            <InfoRow label="Ancho" value={equipamiento.Ancho} />
            <InfoRow label="Altura" value={equipamiento.Altura} />
            <InfoRow label="Dist. Ejes" value={equipamiento.DistanciaEjes} />
            <InfoRow label="Peso en orden de marcha" value={equipamiento.PesoOrdenMarcha} />
            <InfoRow label="kg/hp" value={equipamiento.KgPorHP} />
          </div>
        </CardContent>
      </Card>

      {/* NEUMÁTICOS Y RUEDAS */}
      <Card>
        <CardHeader>
          <CardTitle>Neumáticos y Ruedas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-1">
            <InfoRow label="Neumáticos" value={equipamiento.Neumaticos} />
            <EquipamientoRow label="Llantas de aleación" value={equipamiento.LlantasAleacion} />
            <InfoRow label="Diámetro llantas" value={equipamiento.DiametroLlantas} />
            <EquipamientoRow label="TPMS Monitoreo presión de neumáticos" value={equipamiento.TPMS} />
            <EquipamientoRow label="Kit Inflable AntiPinchazo" value={equipamiento.KitInflableAntiPinchazo} />
            <EquipamientoRow label="Rueda aux. homogeneo" value={equipamiento.RuedaAuxHomogenea} />
          </div>
        </CardContent>
      </Card>

      {/* MOTOR Y MECÁNICA */}
      <Card>
        <CardHeader>
          <CardTitle>Motor y Mecánica</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-1">
            <InfoRow label="Cilindros" value={equipamiento.Cilindros} />
            <InfoRow label="Válvulas" value={equipamiento.Valvulas} />
            <InfoRow label="Iny." value={equipamiento.Inyeccion} />
            <InfoRow label="Tracción" value={equipamiento.Traccion} />
            <InfoRow label="Suspensión" value={equipamiento.Suspension} />
            <InfoRow label="Caja" value={equipamiento.Caja} />
            <InfoRow label="Marchas / velocidades" value={equipamiento.MarchasVelocidades} />
            <EquipamientoRow label="Turbo" value={equipamiento.Turbo} />
            <InfoRow label="N° de puertas" value={equipamiento.NumeroPuertas} />
            <InfoRow label="Aceite" value={equipamiento.Aceite} />
            <InfoRow label="Norma" value={equipamiento.Norma} />
          </div>
        </CardContent>
      </Card>

      {/* CONSUMO Y EMISIONES */}
      <Card>
        <CardHeader>
          <CardTitle>Consumo y Emisiones</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-1">
            <InfoRow label="CO2 (g/Km)" value={equipamiento.CO2_g_km} />
            <InfoRow label="Consumo ruta (l/100 km)" value={equipamiento.ConsumoRuta} />
            <InfoRow label="Consumo urbano (l/100 km)" value={equipamiento.ConsumoUrbano} />
            <InfoRow label="Consumo mixto (l/100 km)" value={equipamiento.ConsumoMixto} />
          </div>
        </CardContent>
      </Card>

      {/* GARANTÍA */}
      <Card>
        <CardHeader>
          <CardTitle>Garantía</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-1">
            <InfoRow label="Garantía en años" value={equipamiento.GarantiaAnios} />
            <InfoRow label="Garantía en Km" value={equipamiento.GarantiaKm} />
            <InfoRow label="Garantías diferenciales" value={equipamiento.GarantiasDiferenciales} />
          </div>
        </CardContent>
      </Card>

      {/* VEHÍCULOS ELÉCTRICOS/HÍBRIDOS */}
      <Card>
        <CardHeader>
          <CardTitle>Vehículo Eléctrico / Híbrido</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-1">
            <InfoRow label="Tipo de Vehiculo Electrico / Hibrido" value={equipamiento.TipoVehiculoElectrico} />
            <EquipamientoRow label="E-Pedal" value={equipamiento.EPedal} />
            <InfoRow label="Cap. Tanque Hidrógeno" value={equipamiento.CapacidadTanqueHidrogeno} />
            <InfoRow label="Autonomía / Max. Range en kilometros" value={equipamiento.AutonomiaMaxRange} />
            <InfoRow label="Ciclo/norma" value={equipamiento.CicloNorma} />
            <InfoRow label="Potencia motor" value={equipamiento.PotenciaMotor} />
            <InfoRow label="Cap. operativa bat. / Battery capacity" value={equipamiento.CapacidadOperativaBateria} />
            <InfoRow label="Par del Motor - torque" value={equipamiento.ParMotorTorque} />
            <InfoRow label="Potencia de carga - Pot. Máx" value={equipamiento.PotenciaCargaMax} />
            <InfoRow label="Tipos de conectores" value={equipamiento.TiposConectores} />
            <InfoRow label="Garantía cap. Bat." value={equipamiento.GarantiaCapBat} />
            <InfoRow label="Tecnología Bat. (materiales)" value={equipamiento.TecnologiaBat} />
            <InfoRow label="TIEMPO DE CARGA" value={equipamiento.TiempoCarga} />
            <InfoRow label="Autonomía del motor eléctrico (BEV y PHEV)" value={equipamiento.AutonomiaMotorElectrico} />
          </div>
        </CardContent>
      </Card>

      {/* OTROS DATOS */}
      <Card>
        <CardHeader>
          <CardTitle>Código y Referencias</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-1">
            <InfoRow label="Código FICHA TÉCNICA" value={equipamiento.CodigoFichaTecnica} />
          </div>
        </CardContent>
      </Card>

      {/* CONFORT E INTERIOR */}
      <Card>
        <CardHeader>
          <CardTitle>Confort e Interior</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-1">
            <InfoRow label="Sistema de climatización" value={equipamiento.SistemaClimatizacion} />
            <InfoRow label="Dirección" value={equipamiento.Direccion} />
            <InfoRow label="Tipo de bloqueo" value={equipamiento.TipoBloqueo} />
            <EquipamientoRow label="Keyless o Smart key" value={equipamiento.KeylessSmartKey} />
            <InfoRow label="Levanta vidrios" value={equipamiento.LevantaVidrios} />
            <EquipamientoRow label="Espejos eléct." value={equipamiento.EspejosElectricos} />
            <EquipamientoRow label="Espejo interior electrocromado" value={equipamiento.EspejoInteriorElectrocromado} />
            <EquipamientoRow label="Espejos abatibles electricamente" value={equipamiento.EspejosAbatiblesElectricamente} />
            <InfoRow label="Tapizado" value={equipamiento.Tapizado} />
            <EquipamientoRow label="Volante revestido en Cuero" value={equipamiento.VolanteRevestidoCuero} />
            <EquipamientoRow label="Tablero digital" value={equipamiento.TablerDigital} />
            <EquipamientoRow label="Computadora" value={equipamiento.Computadora} />
            <EquipamientoRow label="GPS" value={equipamiento.GPS} />
            <EquipamientoRow label="Vel crucero" value={equipamiento.VelocidadCrucero} />
            <EquipamientoRow label="Inmovilizador" value={equipamiento.Inmovilizador} />
          </div>
        </CardContent>
      </Card>

      {/* SEGURIDAD */}
      <Card>
        <CardHeader>
          <CardTitle>Seguridad</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-1">
            <EquipamientoRow label="Alarma" value={equipamiento.Alarma} />
            <EquipamientoRow label="ABAG" value={equipamiento.ABAG} />
            <EquipamientoRow label="SRI (Sistema de retención infantil)" value={equipamiento.SRI} />
            <EquipamientoRow label="ABS" value={equipamiento.ABS} />
            <EquipamientoRow label="EBD o EBV o REF (Distribución elect. de frenada)" value={equipamiento.EBD_EBV_REF} />
            <InfoRow label="DISCOS FRENOS" value={equipamiento.DiscosFrenos} />
            <EquipamientoRow label="Freno Estacionamento Electrico (EPB)" value={equipamiento.FrenoEstacionamientoElectrico} />
            <EquipamientoRow label="ESP Control estabilidad (ESC)" value={equipamiento.ESP_ControlEstabilidad} />
            <EquipamientoRow label="Control tracción (TCS)" value={equipamiento.ControlTraccion} />
            <EquipamientoRow label="Asist. frenado detector distancia" value={equipamiento.AsistenciaFrenadoDetectorDistancia} />
            <EquipamientoRow label="Asist. Pendiente" value={equipamiento.AsistenciaPendiente} />
            <EquipamientoRow label="Det. cambio de fila" value={equipamiento.DetectorCambioFila} />
            <EquipamientoRow label="Det. punto ciego" value={equipamiento.DetectorPuntoCiego} />
            <EquipamientoRow label="Traffic Sign recognition" value={equipamiento.TrafficSignRecognition} />
            <EquipamientoRow label="Driver attention control" value={equipamiento.DriverAttentionControl} />
            <EquipamientoRow label="Detector lluvia" value={equipamiento.DetectorLluvia} />
            <EquipamientoRow label="Grip Control" value={equipamiento.GripControl} />
          </div>
        </CardContent>
      </Card>

      {/* MULTIMEDIA Y TECNOLOGÍA */}
      <Card>
        <CardHeader>
          <CardTitle>Multimedia y Tecnología</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-1">
            <EquipamientoRow label="Comando audio en volante" value={equipamiento.ComandoAudioVolante} />
            <EquipamientoRow label="CD" value={equipamiento.CD} />
            <EquipamientoRow label="MP3" value={equipamiento.MP3} />
            <EquipamientoRow label="USB" value={equipamiento.USB} />
            <EquipamientoRow label="Bluetooth" value={equipamiento.Bluetooth} />
            <EquipamientoRow label="DVD" value={equipamiento.DVD} />
            <EquipamientoRow label="Mirror Screen - Smartphone Display" value={equipamiento.MirrorScreen} />
            <InfoRow label="Sist. Multimedia" value={equipamiento.SistemaMultimedia} />
            <InfoRow label='Pant. Multimedia (")' value={equipamiento.PantallaMultimediaPulgadas} />
            <EquipamientoRow label="Pantalla Tactil" value={equipamiento.PantallaTactil} />
            <EquipamientoRow label="Cargador Smartphone con inducción" value={equipamiento.CargadorSmartphoneInduccion} />
            <InfoRow label="Kit Hi Fi (Bose/JBL/Focal)" value={equipamiento.KitHiFi} />
            <EquipamientoRow label="Radio" value={equipamiento.Radio} />
          </div>
        </CardContent>
      </Card>

      {/* ASIENTOS */}
      <Card>
        <CardHeader>
          <CardTitle>Asientos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-1">
            <InfoRow label="Número de asientos" value={equipamiento.NumeroAsientos} />
            <EquipamientoRow label="Asiento elect. + Calef. + Masaje" value={equipamiento.AsientoElectricoCalefMasaje} />
            <InfoRow label="Asientos rango 2 y 3" value={equipamiento.AsientosRango2y3} />
            <EquipamientoRow label="Asiento 2+1" value={equipamiento.Asiento2Mas1} />
            <EquipamientoRow label="But. Electr." value={equipamiento.ButacaElectrica} />
            <EquipamientoRow label="Asiento ventilado" value={equipamiento.AsientoVentilado} />
            <InfoRow label="Asientos con masajeador (número)" value={equipamiento.AsientosMasajeador} />
            <EquipamientoRow label="Apoyabrazo delantero" value={equipamiento.ApoyabrazosDelantero} />
            <EquipamientoRow label="Apoyabrazo central de asiento trasero" value={equipamiento.ApoyabrazosCentralTrasero} />
            <EquipamientoRow label="Soporte para muslo delantero" value={equipamiento.SoporteMusloDelantero} />
            <EquipamientoRow label="Asiento trasero con ajuste eléctrico" value={equipamiento.AsientoTraseroAjusteElectrico} />
            <EquipamientoRow label="3ra. Fila de asientos eléctricos" value={equipamiento.TerceraFilaAsientosElectricos} />
            <InfoRow label="Tipo de altura de asiento delantero" value={equipamiento.TipoAlturaAsientoDelantero} />
            <EquipamientoRow label="Seat adjustment, memory (Driver)" value={equipamiento.SeatAdjustmentMemoryDriver} />
            <EquipamientoRow label="Seat adjustment, memory (Co-Driver)" value={equipamiento.SeatAdjustmentMemoryCoDriver} />
            <EquipamientoRow label="Lumbar, Lumbar adjustment front (Driver)" value={equipamiento.LumbarAdjustmentFrontDriver} />
            <EquipamientoRow label="Lumbar, Lumbar adjustment front (Co-Driver)" value={equipamiento.LumbarAdjustmentFrontCoDriver} />
            <EquipamientoRow label="Seat heating, rear" value={equipamiento.SeatHeatingRear} />
            <EquipamientoRow label="Asientos deportivos" value={equipamiento.AsientosDeportivos} />
          </div>
        </CardContent>
      </Card>

      {/* TECHO */}
      <Card>
        <CardHeader>
          <CardTitle>Techo</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-1">
            <InfoRow label="Techo" value={equipamiento.Techo} />
            <EquipamientoRow label="Techo Bi-tono" value={equipamiento.TechoBiTono} />
            <EquipamientoRow label="Barras de techo" value={equipamiento.BarrasTecho} />
            <InfoRow label="Número de techos que se abren" value={equipamiento.NumeroTechosQueSeAbren} />
          </div>
        </CardContent>
      </Card>

      {/* SENSORES Y ASISTENCIA */}
      <Card>
        <CardHeader>
          <CardTitle>Sensores y Asistencia</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-1">
            <InfoRow label="Sensor estacionamiento" value={equipamiento.SensorEstacionamiento} />
            <InfoRow label="Cámara" value={equipamiento.Camara} />
            <EquipamientoRow label="Sist. automático de estacionamento" value={equipamiento.SistemaAutomaticoEstacionamiento} />
          </div>
        </CardContent>
      </Card>

      {/* ILUMINACIÓN */}
      <Card>
        <CardHeader>
          <CardTitle>Iluminación</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-1">
            <EquipamientoRow label="Faros de neblina" value={equipamiento.FarosNeblina} />
            <EquipamientoRow label="Faros direccionales" value={equipamiento.FarosDireccionales} />
            <EquipamientoRow label="Faros full LED" value={equipamiento.FarosFullLED} />
            <EquipamientoRow label="Faros halógenos + DRL LED (Diurnas)" value={equipamiento.FarosHalogenosDRL_LED} />
            <EquipamientoRow label="Faros xenon + Limpiadores" value={equipamiento.FarosXenonLimpiadores} />
            <EquipamientoRow label="Pack Visibilidad - Encendido auto faros" value={equipamiento.PackVisibilidad} />
            <EquipamientoRow label="Paso de luces Cruz / ruta automática" value={equipamiento.PasoLucesCruzRutaAutomatica} />
            <EquipamientoRow label="Visión nocturna" value={equipamiento.VisionNocturna} />
            <EquipamientoRow label="Faros Matrix" value={equipamiento.FarosMatrix} />
            <EquipamientoRow label="Luces traseras led" value={equipamiento.LucesTraserasLED} />
            <EquipamientoRow label="Luces tras. OLED" value={equipamiento.LucesTraserasOLED} />
            <EquipamientoRow label="Luces Laser" value={equipamiento.LucesLaser} />
          </div>
        </CardContent>
      </Card>

      {/* MALETERO Y CARGA */}
      <Card>
        <CardHeader>
          <CardTitle>Maletero y Carga</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-1">
            <EquipamientoRow label="Maletera apertura eléctrica" value={equipamiento.MaleteraAperturaElectrica} />
            <InfoRow label="Cap. Baúl" value={equipamiento.CapacidadBaul} />
            <InfoRow label="Cap. Tanque combustible" value={equipamiento.CapacidadTanqueCombustible} />
            <EquipamientoRow label="Protector CAJA" value={equipamiento.ProtectorCaja} />
            <EquipamientoRow label="Partición de cabina" value={equipamiento.ParticionCabina} />
            <InfoRow label="N° Puertas Lat." value={equipamiento.NumPuertasLaterales} />
            <EquipamientoRow label="Puerta lat. Eléctrica" value={equipamiento.PuertaLateralElectrica} />
            <InfoRow label="Carga útil (Kg)" value={equipamiento.CargaUtil_kg} />
            <InfoRow label="Volumen útil (m3)" value={equipamiento.VolumenUtil_m3} />
            <InfoRow label="Tipo de altura UL" value={equipamiento.TipoAlturaUL} />
            <InfoRow label="Capacidad de carga de camiones" value={equipamiento.CapacidadCargaCamiones} />
          </div>
        </CardContent>
      </Card>

      {/* CARACTERÍSTICAS ADICIONALES */}
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>Características Adicionales</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-x-8">
            <div className="space-y-1">
              <EquipamientoRow label="Start Stop" value={equipamiento.StartStop} />
              <EquipamientoRow label="Limitador de velocidad" value={equipamiento.LimitadorVelocidad} />
              <EquipamientoRow label="Alerta de tráfico cruzado trasero" value={equipamiento.AlertaTraficoCruzadoTrasero} />
              <EquipamientoRow label="Alerta de tráfico cruzado frontal" value={equipamiento.AlertaTraficoCruzadoFrontal} />
              <EquipamientoRow label="Frenado multicolisión" value={equipamiento.FrenadoMulticolision} />
              <EquipamientoRow label="Head-Up Display" value={equipamiento.HeadUpDisplay} />
              <EquipamientoRow label="Asist. Descenso (HDC)" value={equipamiento.AsistenciaDescenso} />
              <EquipamientoRow label="Paddle Shift" value={equipamiento.PaddleShift} />
              <InfoRow label="Bloqueo diferencial por terreno" value={equipamiento.BloqueDiferencialTerreno} />
              <EquipamientoRow label="City Stop" value={equipamiento.CityStop} />
              <EquipamientoRow label="Freno de peatones" value={equipamiento.FrenoPeatones} />
              <EquipamientoRow label="Desempañador eléctrico" value={equipamiento.DesempaniadorElectrico} />
              <EquipamientoRow label="Iluminación ambiental" value={equipamiento.IluminacionAmbiental} />
              <EquipamientoRow label="Limpia-lava parabrisas trasero eléct." value={equipamiento.LimpiaLavaParabrisasTrasero} />
              <EquipamientoRow label="Black Wheel Frame" value={equipamiento.BlackWheelFrame} />
            </div>
            <div className="space-y-1">
              <EquipamientoRow label="Volante multifunción" value={equipamiento.VolanteMultifuncion} />
              <EquipamientoRow label="Tablero digital 3D" value={equipamiento.TablerDigital3D} />
              <InfoRow label="Aceleracion BEV 0 a 100" value={equipamiento.AceleracionBEV_0a100} />
              <InfoRow label="Acceleration ICE" value={equipamiento.AccelerationICE} />
              <EquipamientoRow label="Carga electrica por wireless" value={equipamiento.CargaElectricaWireless} />
              <EquipamientoRow label="Carga electrica por induccion" value={equipamiento.CargaElectricaInduccion} />
              <EquipamientoRow label="Cable electrico tipo 3 incluido" value={equipamiento.CableElectricoTipo3Incluido} />
              <EquipamientoRow label="Chassis Drive Select" value={equipamiento.ChassisDriveSelect} />
              <EquipamientoRow label="Chassis Sport Suspension" value={equipamiento.ChassisSportSuspension} />
              <EquipamientoRow label="Direccion en las cuatro ruedas" value={equipamiento.DireccionCuatroRuedas} />
              <EquipamientoRow label="Dashboard display configurable" value={equipamiento.DashboardDisplayConfigurable} />
              <EquipamientoRow label="Wireless Smartphone integration" value={equipamiento.WirelessSmartphoneIntegration} />
              <EquipamientoRow label="Mobile phone Antenna" value={equipamiento.MobilePhoneAntenna} />
              <EquipamientoRow label="Deflector de viento" value={equipamiento.DeflectorViento} />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
