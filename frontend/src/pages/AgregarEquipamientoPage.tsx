import { useState, useEffect } from 'react';
import { PageHeader } from '@components/layout/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@components/ui/Card';
import { Button } from '@components/ui/Button';
import { Input } from '@components/ui/Input';
import { Badge } from '@components/ui/Badge';
import { LoadingSpinner } from '@components/ui/LoadingSpinner';
import { Checkbox } from '@components/ui/Checkbox';
import { Label } from '@/components/ui/label';
import { modeloService } from '@services/modeloService';
import { equipamientoService } from '@services/equipamientoService';
import { useToast } from '@context/ToastContext';
import { Modelo, ModeloEstado } from '@/types';
import { Search, CheckCircle2 } from 'lucide-react';

export function AgregarEquipamientoPage() {
  const [modelos, setModelos] = useState<Modelo[]>([]);
  const [modeloSeleccionado, setModeloSeleccionado] = useState<Modelo | null>(null);
  const [equipamiento, setEquipamiento] = useState<any>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const { addToast } = useToast();

  useEffect(() => {
    loadModelos();
  }, []);

  const loadModelos = async () => {
    try {
      setIsLoading(true);
      // Cargar solo modelos en estado "requisitos_minimos"
      const response = await modeloService.getAll({ estado: ModeloEstado.DATOS_MINIMOS });
      setModelos(response.data || []);
    } catch (error: any) {
      addToast('Error al cargar modelos', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleModeloSelect = async (modelo: Modelo) => {
    setModeloSeleccionado(modelo);
    // Cargar equipamiento existente si lo hay
    try {
      const equip = await equipamientoService.getByModeloId(modelo.ModeloID);
      if (equip) {
        setEquipamiento(equip);
      } else {
        // Inicializar todo en false
        setEquipamiento({});
      }
    } catch (error) {
      setEquipamiento({});
    }
  };

  const handleCheckboxChange = (campo: string, valor: boolean) => {
    setEquipamiento((prev: any) => ({
      ...prev,
      [campo]: valor
    }));
  };

  const handleGuardarYEnviarRevision = async () => {
    if (!modeloSeleccionado) return;

    try {
      setIsSaving(true);
      
      // Guardar equipamiento
      const equipData = {
        modeloId: modeloSeleccionado.ModeloID,
        ...equipamiento
      };

      try {
        // Intentar obtener equipamiento existente
        await equipamientoService.getByModeloId(modeloSeleccionado.ModeloID);
        // Si existe, actualizar
        await equipamientoService.update(modeloSeleccionado.ModeloID, equipamiento);
      } catch (error: any) {
        // Si no existe (404), crear
        if (error.response?.status === 404) {
          await equipamientoService.create(equipData);
        } else {
          throw error;
        }
      }

      // Cambiar estado del modelo a "en_revision"
      await modeloService.update(modeloSeleccionado.ModeloID, {
        Estado: ModeloEstado.REVISION_EQUIPAMIENTO
      });

      addToast('Equipamiento guardado y modelo enviado a revisión', 'success');
      setModeloSeleccionado(null);
      setEquipamiento({});
      loadModelos(); // Recargar lista
    } catch (error: any) {
      addToast(error.response?.data?.message || 'Error al guardar equipamiento', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const modelosFiltrados = modelos.filter(m =>
    m.Modelo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.MarcaNombre?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const EquipamientoSection = ({ title, fields }: { title: string; fields: Array<{ key: string; label: string }> }) => (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          {fields.map(field => (
            <div key={field.key} className="flex items-center space-x-2">
              <Checkbox
                id={field.key}
                checked={equipamiento[field.key] || false}
                onCheckedChange={(checked) => handleCheckboxChange(field.key, checked as boolean)}
              />
              <Label htmlFor={field.key} className="cursor-pointer">
                {field.label}
              </Label>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner size="lg" text="Cargando modelos..." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Agregar Equipamiento" />

      <div className="grid grid-cols-12 gap-6">
        {/* Lista de modelos */}
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Modelos para Equipar</CardTitle>
            <div className="mt-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar modelo..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-[600px] overflow-y-auto">
              {modelosFiltrados.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">
                  No hay modelos pendientes de equipamiento
                </p>
              ) : (
                modelosFiltrados.map(modelo => (
                  <div
                    key={modelo.ModeloID}
                    className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                      modeloSeleccionado?.ModeloID === modelo.ModeloID
                        ? 'bg-primary/10 border-primary'
                        : 'hover:bg-muted'
                    }`}
                    onClick={() => handleModeloSelect(modelo)}
                  >
                    <div className="font-medium">{modelo.MarcaNombre} {modelo.Modelo}</div>
                    <div className="text-sm text-muted-foreground">
                      {modelo.Anio} • {modelo.Familia || 'Sin familia'}
                    </div>
                    {modelo.Estado && (
                      <Badge estado={modelo.Estado as ModeloEstado} className="mt-1" />
                    )}
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Formulario de equipamiento */}
        <div className="col-span-8 space-y-4">
          {!modeloSeleccionado ? (
            <Card>
              <CardContent className="py-12">
                <p className="text-center text-muted-foreground">
                  Selecciona un modelo de la lista para cargar su equipamiento
                </p>
              </CardContent>
            </Card>
          ) : (
            <>
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>
                        {modeloSeleccionado.MarcaNombre} {modeloSeleccionado.Modelo}
                      </CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">
                        {modeloSeleccionado.Anio} • {modeloSeleccionado.Familia}
                      </p>
                    </div>
                    <Button onClick={handleGuardarYEnviarRevision} isLoading={isSaving}>
                      <CheckCircle2 className="h-4 w-4 mr-2" />
                      Guardar y Enviar a Revisión
                    </Button>
                  </div>
                </CardHeader>
              </Card>

              <EquipamientoSection
                title="Seguridad"
                fields={[
                  { key: 'AirbagConductor', label: 'Airbag Conductor' },
                  { key: 'AirbagPasajero', label: 'Airbag Pasajero' },
                  { key: 'AirbagLaterales', label: 'Airbags Laterales' },
                  { key: 'AirbagCortina', label: 'Airbag de Cortina' },
                  { key: 'ABS', label: 'ABS' },
                  { key: 'ControlEstabilidad', label: 'Control de Estabilidad' },
                  { key: 'ControlTraccion', label: 'Control de Tracción' },
                  { key: 'AsistenciaArranque', label: 'Asistencia de Arranque' },
                  { key: 'AnclajesISOFIX', label: 'Anclajes ISOFIX' },
                ]}
              />

              <EquipamientoSection
                title="Confort"
                fields={[
                  { key: 'AireAcondicionado', label: 'Aire Acondicionado' },
                  { key: 'Climatizador', label: 'Climatizador' },
                  { key: 'AlzavidriosDel', label: 'Alzavidrios Delanteros' },
                  { key: 'AlzavidriosTras', label: 'Alzavidrios Traseros' },
                  { key: 'CierreCentralizado', label: 'Cierre Centralizado' },
                  { key: 'EspejosElectricos', label: 'Espejos Eléctricos' },
                  { key: 'ControlCrucero', label: 'Control de Crucero' },
                  { key: 'ComputadoraABordo', label: 'Computadora a Bordo' },
                  { key: 'TechoSolar', label: 'Techo Solar' },
                ]}
              />

              <EquipamientoSection
                title="Exterior & Interior"
                fields={[
                  { key: 'LlantasAleacion', label: 'Llantas de Aleación' },
                  { key: 'FarosLED', label: 'Faros LED' },
                  { key: 'FarosXenon', label: 'Faros Xenón' },
                  { key: 'Neblineros', label: 'Neblineros' },
                  { key: 'TapizCuero', label: 'Tapizado de Cuero' },
                  { key: 'AsientosElectricos', label: 'Asientos Eléctricos' },
                  { key: 'VolanteCuero', label: 'Volante de Cuero' },
                  { key: 'NeumaticoRepuestoCompleto', label: 'Neumático de Repuesto' },
                ]}
              />

              <EquipamientoSection
                title="Tecnología"
                fields={[
                  { key: 'PantallaTouch', label: 'Pantalla Touch' },
                  { key: 'AppleCarPlay', label: 'Apple CarPlay' },
                  { key: 'AndroidAuto', label: 'Android Auto' },
                  { key: 'Bluetooth', label: 'Bluetooth' },
                  { key: 'GPS', label: 'GPS' },
                  { key: 'PuertoUSB', label: 'Puerto USB' },
                  { key: 'CamaraRetroceso', label: 'Cámara de Retroceso' },
                  { key: 'SensoresEstacionamiento', label: 'Sensores de Estacionamiento' },
                  { key: 'Keyless', label: 'Keyless' },
                  { key: 'EncendidoBoton', label: 'Encendido por Botón' },
                  { key: 'StartStop', label: 'Start/Stop' },
                ]}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
