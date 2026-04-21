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

  const BooleanBadge = ({ value }: { value: boolean }) => {
    // Treat string 'No' or false as false, 'Si' 'N/A' etc accordingly
    if (value === true || value === 'Si' || value === 'Sí') {
        return <Badge variant="success" className="gap-1 bg-green-500 hover:bg-green-600"><CheckCircle2 className="h-3 w-3" /> Sí</Badge>;
    }
    if (value === false || value === 'No') {
        return <Badge variant="secondary" className="gap-1"><XCircle className="h-3 w-3" /> No</Badge>;
    }
    if (value === 'N/A' || value === 'N/D') {
        return <Badge variant="outline" className="gap-1 border-slate-300 text-slate-500">{value}</Badge>;
    }
    return <></>; // Won't be reached usually
  };

  const InfoRow = ({ label, value }: { label: string; value: any }) => {
    if (value === null || value === undefined || value === '') return null; // Don't show empty fields

    const isBooleanish = value === true || value === false || value === 'Si' || value === 'No' || value === 'Sí' || value === 'N/A';
    
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

  if (!equipamiento || Object.keys(equipamiento).length <= 1) {
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

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2">

        {/* ELECTRICOS */}
        <Card className="border shadow-sm overflow-hidden border-slate-200">
          <CardHeader className="bg-slate-50 border-b border-slate-200 py-3">
            <CardTitle className="text-base text-slate-800">Electricos</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="flex flex-col px-4 py-2">
              <InfoRow label="E-Pedal" value={equipamiento['EPedal']} />
              <InfoRow label="Cap. Tanque Hidrógeno" value={equipamiento['CapacidadTanqueHidrogeno']} />
              <InfoRow label="Autonomía / Max. Range en kilometros" value={equipamiento['AutonomiaMaxRange']} />
              <InfoRow label="Ciclo/norma" value={equipamiento['CicloNorma']} />
              <InfoRow label="Potencia motor (KW)" value={equipamiento['PotenciaMotor']} />
              <InfoRow label="Cap. operativa bat. / Battery capacity (Kwh)" value={equipamiento['CapacidadOperativaBateria']} />
              <InfoRow label="Potencia de carga- Pot. Máx (KW en CA)" value={equipamiento['PotenciaCargaMax']} />
              <InfoRow label="Tipos de conectores" value={equipamiento['TiposConectores']} />
              <InfoRow label="Garantía cap. Bat." value={equipamiento['GarantiaCapBat']} />
              <InfoRow label="Tecnología Bat. (materiales)" value={equipamiento['TecnologiaBat']} />
              <InfoRow label="Tiempo de carga" value={equipamiento['TiempoCarga']} />
            </div>
          </CardContent>
        </Card>

        {/* DIMENSIONES */}
        <Card className="border shadow-sm overflow-hidden border-slate-200">
          <CardHeader className="bg-slate-50 border-b border-slate-200 py-3">
            <CardTitle className="text-base text-slate-800">Dimensiones</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="flex flex-col px-4 py-2">
              <InfoRow label="Largo" value={equipamiento['Largo']} />
              <InfoRow label="Ancho" value={equipamiento['Ancho']} />
              <InfoRow label="Altura" value={equipamiento['Altura']} />
              <InfoRow label="Distancia Ejes" value={equipamiento['DistanciaEjes']} />
              <InfoRow label="Peso Orden Marcha" value={equipamiento['PesoOrdenMarcha']} />
              <InfoRow label="Kg Por H P" value={equipamiento['KgPorHP']} />
              <InfoRow label="Llantas de aleación" value={equipamiento['LlantasAleacion']} />
              <InfoRow label="Carga Util_kg" value={equipamiento['CargaUtil_kg']} />
              <InfoRow label="Volumen Util_m3" value={equipamiento['VolumenUtil_m3']} />
              <InfoRow label="TPMS" value={equipamiento['TPMS']} />
              <InfoRow label="Kit Inflable AntiPinchazo" value={equipamiento['KitInflableAntiPinchazo']} />
              <InfoRow label="Partición de cabina" value={equipamiento['ParticionCabina']} />
              <InfoRow label="Puerta lat. Eléctrica" value={equipamiento['PuertaLateralElectrica']} />
              <InfoRow label="Rueda aux. homogeneo" value={equipamiento['RuedaAuxHomogenea']} />
              <InfoRow label="Neumaticos" value={equipamiento['Neumaticos']} />
              <InfoRow label="Diámetro llantas" value={equipamiento['DiametroLlantas']} />
              <InfoRow label="N° Puertas Lat." value={equipamiento['NumeroPuertas']} />
            </div>
          </CardContent>
        </Card>

        {/* MECANICA */}
        <Card className="border shadow-sm overflow-hidden border-slate-200">
          <CardHeader className="bg-slate-50 border-b border-slate-200 py-3">
            <CardTitle className="text-base text-slate-800">Mecanica</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="flex flex-col px-4 py-2">
              <InfoRow label="Inyección" value={equipamiento['Inyeccion']} />
              <InfoRow label="Tracción" value={equipamiento['Traccion']} />
              <InfoRow label="Suspensión" value={equipamiento['Suspension']} />
              <InfoRow label="Tipo caja Aut." value={equipamiento['TipoCajaAut']} />
              <InfoRow label="Marchas / velocidades" value={equipamiento['MarchasVelocidades']} />
              <InfoRow label="Turbo" value={equipamiento['Turbo']} />
              <InfoRow label="Par del Motor - torque (Nm)" value={equipamiento['PardelMotortorqueNm']} />
              <InfoRow label="Aceite" value={equipamiento['Aceite']} />
              <InfoRow label="Norma" value={equipamiento['Norma']} />
              <InfoRow label="CO2 (g/Km)" value={equipamiento['CO2_g_km']} />
              <InfoRow label="Consumo ruta (l/100 km)" value={equipamiento['Consumorutal100km']} />
              <InfoRow label="Consumo urbano (l/100 km)" value={equipamiento['Consumourbanol100km']} />
              <InfoRow label="Consumo mixto (l/100 km)" value={equipamiento['Consumomixtol100km']} />
              <InfoRow label="Garantía en años" value={equipamiento['Garantaenaos']} />
              <InfoRow label="Garantía en Km" value={equipamiento['GarantaenKm']} />
              <InfoRow label="Garantías diferenciales" value={equipamiento['Garantasdiferenciales']} />
            </div>
          </CardContent>
        </Card>

        {/* EQUIPAMIENTO */}
        <Card className="border shadow-sm overflow-hidden border-slate-200">
          <CardHeader className="bg-slate-50 border-b border-slate-200 py-3">
            <CardTitle className="text-base text-slate-800">Equipamiento</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="flex flex-col px-4 py-2">
              <InfoRow label="Sistema de climatización" value={equipamiento['Sistemadeclimatizacion']} />
              <InfoRow label="Dirección" value={equipamiento['Direccion']} />
              <InfoRow label="Tipo de bloqueo" value={equipamiento['Tipodebloqueo']} />
              <InfoRow label="Keyless o Smart key" value={equipamiento['KeylessoSmartkey']} />
              <InfoRow label="Levanta vidrios" value={equipamiento['Levantavidrios']} />
              <InfoRow label="Espejos eléct." value={equipamiento['Espejoselect']} />
              <InfoRow label="Espejo interior electrocromado" value={equipamiento['Espejointeriorelectrocromado']} />
              <InfoRow label="Espejos abatibles electricamente" value={equipamiento['Espejosabatibleselectricamente']} />
              <InfoRow label="Tapizado" value={equipamiento['Tapizado']} />
              <InfoRow label="Volante revestido en Cuero" value={equipamiento['VolanterevestidoenCuero']} />
              <InfoRow label="Tablero digital" value={equipamiento['Tablerodigital']} />
              <InfoRow label="Computadora" value={equipamiento['Computadora']} />
              <InfoRow label="GPS" value={equipamiento['GPS']} />
              <InfoRow label="Vel crucero" value={equipamiento['Velcrucero']} />
              <InfoRow label="Inmobilizador" value={equipamiento['Inmobilizador']} />
              <InfoRow label="Alarma" value={equipamiento['Alarma']} />
              <InfoRow label="ABAG" value={equipamiento['ABAG']} />
              <InfoRow label="SRI (Sistema de retención infantil)" value={equipamiento['SRISistemaderetencioninfantil']} />
              <InfoRow label="ABS" value={equipamiento['ABS']} />
              <InfoRow label="EBD-EBV-REF (Distribución elect. de frenada)" value={equipamiento['EBDEBVREFDistribucionelectdefrenada']} />
              <InfoRow label="DISCOS FRENOS" value={equipamiento['DISCOSFRENOS']} />
              <InfoRow label="Freno Estacionamento Electrico (EPB)" value={equipamiento['FrenoEstacionamentoElectricoEPB']} />
              <InfoRow label="ESP Control estabilidad" value={equipamiento['ESPControlestabilidad']} />
              <InfoRow label="Control tracción" value={equipamiento['Controltraccion']} />
              <InfoRow label="Asist. frenado detector distancia" value={equipamiento['Asistfrenadodetectordistancia']} />
              <InfoRow label="Asist. Pendiente" value={equipamiento['AsistPendiente']} />
              <InfoRow label="Det. cambio de fila" value={equipamiento['Detcambiodefila']} />
              <InfoRow label="Det. punto ciego" value={equipamiento['Detpuntociego']} />
              <InfoRow label="Traffic Sign recognition" value={equipamiento['TrafficSignrecognition']} />
              <InfoRow label="Driver attention control" value={equipamiento['Driverattentioncontrol']} />
              <InfoRow label="Detector   lluvia" value={equipamiento['Detectorlluvia']} />
              <InfoRow label="Grip Control" value={equipamiento['GripControl']} />
              <InfoRow label="Comando audio en volante" value={equipamiento['Comandoaudioenvolante']} />
              <InfoRow label="CD" value={equipamiento['CD']} />
              <InfoRow label="MP3" value={equipamiento['MP3']} />
              <InfoRow label="USB" value={equipamiento['USB']} />
              <InfoRow label="Bluetooth" value={equipamiento['Bluetooth']} />
              <InfoRow label="DVD" value={equipamiento['DVD']} />
              <InfoRow label="Mirror Screen - Smartphone Display" value={equipamiento['MirrorScreenSmartphoneDisplay']} />
              <InfoRow label="Sist. Multimedia" value={equipamiento['SistMultimedia']} />
              <InfoRow label="Pant. Multimedia (&quot;)" value={equipamiento['PantMultimedia']} />
              <InfoRow label="Pantalla Tactil" value={equipamiento['PantallaTactil']} />
              <InfoRow label="Cargador Smartphone con inducción" value={equipamiento['CargadorSmartphoneconinduccion']} />
              <InfoRow label="Kit Hi Fi (Bose/JBL/Focal)" value={equipamiento['KitHiFiBoseJBLFocal']} />
              <InfoRow label="Asiento elect. + Calef. + Masaje" value={equipamiento['AsientoelectCalefMasaje']} />
              <InfoRow label="asientos rango 2 y 3" value={equipamiento['asientosrango2y3']} />
              <InfoRow label="asiento 2+1" value={equipamiento['asiento21']} />
              <InfoRow label="But. Electr." value={equipamiento['ButElectr']} />
              <InfoRow label="Techo" value={equipamiento['Techo']} />
              <InfoRow label="Techo Bi-tono" value={equipamiento['TechoBitono']} />
              <InfoRow label="Barras de techo" value={equipamiento['Barrasdetecho']} />
              <InfoRow label="Sensor estacionamiento" value={equipamiento['Sensorestacionamiento']} />
              <InfoRow label="Cámara" value={equipamiento['Camara']} />
              <InfoRow label="Sist. automático de estacionamento" value={equipamiento['Sistautomaticodeestacionamento']} />
              <InfoRow label="Faros de neblina" value={equipamiento['Farosdeneblina']} />
              <InfoRow label="Faros direccionales" value={equipamiento['Farosdireccionales']} />
              <InfoRow label="Faros full LED" value={equipamiento['FarosfullLED']} />
              <InfoRow label="Faros halógenos  + DRL LED (Diurnas)" value={equipamiento['FaroshalogenosDRLLEDDiurnas']} />
              <InfoRow label="Faros xenon + Limpadores" value={equipamiento['FarosxenonLimpadores']} />
              <InfoRow label="Pack Visibilidad - Encendido auto faros" value={equipamiento['PackVisibilidadEncendidoautofaros']} />
              <InfoRow label="Paso de luces Cruz / ruta automática" value={equipamiento['PasodelucesCruzrutaautomatica']} />
              <InfoRow label="Visión nocturna" value={equipamiento['Visionnocturna']} />
              <InfoRow label="Maletera apertura eléctrica" value={equipamiento['Maleteraaperturaelectrica']} />
              <InfoRow label="Protector CAJA" value={equipamiento['ProtectorCAJA']} />
              <InfoRow label="Start Stop" value={equipamiento['StartStop']} />
              <InfoRow label="limitador de velocidad" value={equipamiento['limitadordevelocidad']} />
              <InfoRow label="Alerta de tráfico cruzado trasero" value={equipamiento['Alertadetraficocruzadotrasero']} />
              <InfoRow label="Alerta de tráfico cruzado frontal" value={equipamiento['Alertadetraficocruzadofrontal']} />
              <InfoRow label="Frenado multicolisión" value={equipamiento['Frenadomulticolision']} />
              <InfoRow label="Head-Up Display" value={equipamiento['HeadUpDisplay']} />
              <InfoRow label="Radio" value={equipamiento['Radio']} />
              <InfoRow label="Asist. Descenso (HDC)" value={equipamiento['AsistDescensoHDC']} />
              <InfoRow label="Paddle Shift" value={equipamiento['PaddleShift']} />
              <InfoRow label="Apoyabrazo delantero" value={equipamiento['Apoyabrazodelantero']} />
              <InfoRow label="Faros Matrix" value={equipamiento['FarosMatrix']} />
              <InfoRow label="Luces traseras led" value={equipamiento['Lucestraserasled']} />
              <InfoRow label="Bloqueo diferencial por terreno" value={equipamiento['Bloqueodiferencialporterreno']} />
              <InfoRow label="Número de techos que se abren" value={equipamiento['Numerodetechosqueseabren']} />
              <InfoRow label="Asiento ventilado" value={equipamiento['Asientoventilado']} />
              <InfoRow label="Asientos con masajeador (número)" value={equipamiento['Asientosconmasajeadornumero']} />
              <InfoRow label="Autonomía del motor eléctrico (BEV y PHEV)" value={equipamiento['AutonomiadelmotorelectricoBEVyPHEV']} />
              <InfoRow label="City Stop" value={equipamiento['CityStop']} />
              <InfoRow label="Freno de peatones" value={equipamiento['Frenodepeatones']} />
              <InfoRow label="Desempañador eléctrico" value={equipamiento['Desempanadorelectrico']} />
              <InfoRow label="Iluminación ambiental" value={equipamiento['Iluminacionambiental']} />
              <InfoRow label="Limpia-lava parabrisas trasero eléct." value={equipamiento['Limpialavaparabrisastraseroelect']} />
              <InfoRow label="Apoyabrazo central de asiento trasero" value={equipamiento['Apoyabrazocentraldeasientotrasero']} />
              <InfoRow label="Soporte para muslo delantero" value={equipamiento['Soporteparamuslodelantero']} />
              <InfoRow label="Asiento trasero con ajuste eléctrico" value={equipamiento['Asientotraseroconajusteelectrico']} />
              <InfoRow label="3ra. Fila de asientos eléctricos" value={equipamiento['3raFiladeasientoselectricos']} />
              <InfoRow label="Volante multifunción" value={equipamiento['Volantemultifuncion']} />
              <InfoRow label="Tablero digital 3D" value={equipamiento['Tablerodigital3D']} />
              <InfoRow label="Aceleracion BEV       0 a 100" value={equipamiento['AceleracionBEV0a100']} />
              <InfoRow label="Acceleration ICE" value={equipamiento['AccelerationICE']} />
              <InfoRow label="Carga electrica por wireless" value={equipamiento['Cargaelectricaporwireless']} />
              <InfoRow label="Carga electrica por induccion" value={equipamiento['Cargaelectricaporinduccion']} />
              <InfoRow label="Cable electrico tipo 3 incluido" value={equipamiento['Cableelectricotipo3incluido']} />
              <InfoRow label="Chassis Drive Select" value={equipamiento['ChassisDriveSelect']} />
              <InfoRow label="Chassis Sport Suspension" value={equipamiento['ChassisSportSuspension']} />
              <InfoRow label="Direccion en las cuatro ruedas" value={equipamiento['Direccionenlascuatroruedas']} />
              <InfoRow label="Luces Laser" value={equipamiento['LucesLaser']} />
              <InfoRow label="Luces tras. OLED" value={equipamiento['LucestrasOLED']} />
              <InfoRow label="Dashboard display configurable" value={equipamiento['Dashboarddisplayconfigurable']} />
              <InfoRow label="Wireless Smartphone integration" value={equipamiento['WirelessSmartphoneintegration']} />
              <InfoRow label="Mobile phone Antenna" value={equipamiento['MobilephoneAntenna']} />
              <InfoRow label="Deflector de viento" value={equipamiento['Deflectordeviento']} />
              <InfoRow label="Asientos deportivos" value={equipamiento['Asientosdeportivos']} />
              <InfoRow label="Seat adjustment, memory (Driver)" value={equipamiento['SeatadjustmentmemoryDriver']} />
              <InfoRow label="Seat adjustment, memory (Co-Driver)" value={equipamiento['SeatadjustmentmemoryCoDriver']} />
              <InfoRow label="Lumbar, Lumbar adjustment front (Driver)" value={equipamiento['LumbarLumbaradjustmentfrontDriver']} />
              <InfoRow label="Lumbar, Lumbar adjustment front (Co-Driver)" value={equipamiento['LumbarLumbaradjustmentfrontCoDriver']} />
              <InfoRow label="Seat heating, rear" value={equipamiento['Seatheatingrear']} />
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}
