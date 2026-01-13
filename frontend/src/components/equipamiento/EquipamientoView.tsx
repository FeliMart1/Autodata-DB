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
      <Alert>
        No hay equipamiento cargado para este modelo
      </Alert>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Seguridad</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <EquipamientoRow label="Airbag Conductor" value={equipamiento.AirbagConductor} />
            <EquipamientoRow label="Airbag Pasajero" value={equipamiento.AirbagPasajero} />
            <EquipamientoRow label="Airbags Laterales" value={equipamiento.AirbagLaterales} />
            <EquipamientoRow label="Airbag de Cortina" value={equipamiento.AirbagCortina} />
            <EquipamientoRow label="ABS" value={equipamiento.ABS} />
            <EquipamientoRow label="Control de Estabilidad" value={equipamiento.ControlEstabilidad} />
            <EquipamientoRow label="Control de Tracción" value={equipamiento.ControlTraccion} />
            <EquipamientoRow label="Asistencia de Arranque" value={equipamiento.AsistenciaArranque} />
            <EquipamientoRow label="Anclajes ISOFIX" value={equipamiento.AnclajesISOFIX} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Confort</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <EquipamientoRow label="Aire Acondicionado" value={equipamiento.AireAcondicionado} />
            <EquipamientoRow label="Climatizador" value={equipamiento.Climatizador} />
            <EquipamientoRow label="Alzavidrios Delanteros" value={equipamiento.AlzavidriosDel} />
            <EquipamientoRow label="Alzavidrios Traseros" value={equipamiento.AlzavidriosTras} />
            <EquipamientoRow label="Cierre Centralizado" value={equipamiento.CierreCentralizado} />
            <EquipamientoRow label="Espejos Eléctricos" value={equipamiento.EspejosElectricos} />
            <EquipamientoRow label="Control de Crucero" value={equipamiento.ControlCrucero} />
            <EquipamientoRow label="Computadora a Bordo" value={equipamiento.ComputadoraABordo} />
            <EquipamientoRow label="Techo Solar" value={equipamiento.TechoSolar} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Exterior & Interior</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <EquipamientoRow label="Llantas de Aleación" value={equipamiento.LlantasAleacion} />
            <EquipamientoRow label="Faros LED" value={equipamiento.FarosLED} />
            <EquipamientoRow label="Faros Xenón" value={equipamiento.FarosXenon} />
            <EquipamientoRow label="Neblineros" value={equipamiento.Neblineros} />
            <EquipamientoRow label="Tapizado de Cuero" value={equipamiento.TapizCuero} />
            <EquipamientoRow label="Asientos Eléctricos" value={equipamiento.AsientosElectricos} />
            <EquipamientoRow label="Volante de Cuero" value={equipamiento.VolanteCuero} />
            <EquipamientoRow label="Neumático de Repuesto Completo" value={equipamiento.NeumaticoRepuestoCompleto} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Tecnología</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <EquipamientoRow label="Pantalla Touch" value={equipamiento.PantallaTouch} />
            <EquipamientoRow label="Apple CarPlay" value={equipamiento.AppleCarPlay} />
            <EquipamientoRow label="Android Auto" value={equipamiento.AndroidAuto} />
            <EquipamientoRow label="Bluetooth" value={equipamiento.Bluetooth} />
            <EquipamientoRow label="GPS" value={equipamiento.GPS} />
            <EquipamientoRow label="Puerto USB" value={equipamiento.PuertoUSB} />
            <EquipamientoRow label="Cámara de Retroceso" value={equipamiento.CamaraRetroceso} />
            <EquipamientoRow label="Sensores de Estacionamiento" value={equipamiento.SensoresEstacionamiento} />
            <EquipamientoRow label="Keyless" value={equipamiento.Keyless} />
            <EquipamientoRow label="Encendido por Botón" value={equipamiento.EncendidoBoton} />
            <EquipamientoRow label="Start/Stop" value={equipamiento.StartStop} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
