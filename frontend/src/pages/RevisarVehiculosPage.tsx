import { useState, useEffect } from 'react';
import { PageHeader } from '@components/layout/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@components/ui/Card';
import { Button } from '@components/ui/Button';
import { Input } from '@components/ui/Input';
import { Badge } from '@components/ui/Badge';
import { LoadingSpinner } from '@components/ui/LoadingSpinner';
import { Textarea } from '@components/ui/Textarea';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@components/ui/Dialog';
import { modeloService } from '@services/modeloService';
import { useToast } from '@context/ToastContext';
import { Modelo, ModeloEstado } from '@/types';
import { Search, CheckCircle2, XCircle } from 'lucide-react';
import { ModeloDetailView } from '@components/modelos/ModeloDetailView';
import { EquipamientoView } from '@components/equipamiento/EquipamientoView';

export function RevisarVehiculosPage() {
  const [modelos, setModelos] = useState<Modelo[]>([]);
  const [modeloSeleccionado, setModeloSeleccionado] = useState<Modelo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showRechazoDialog, setShowRechazoDialog] = useState(false);
  const [observaciones, setObservaciones] = useState('');
  const { addToast } = useToast();

  useEffect(() => {
    loadModelos();
  }, []);

  const loadModelos = async () => {
    try {
      setIsLoading(true);
      // Cargar solo modelos en estado "en_revision" o "para_corregir"
      const responseRevision = await modeloService.getAll({ estado: ModeloEstado.REVISION_EQUIPAMIENTO });
      const responseCorregir = await modeloService.getAll({ estado: ModeloEstado.CORREGIR_EQUIPAMIENTO });
      setModelos([...(responseRevision.data || []), ...(responseCorregir.data || [])]);
    } catch (error: any) {
      addToast('Error al cargar modelos', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerDetalle = async (modelo: Modelo) => {
    try {
      const detalleCompleto = await modeloService.getById(modelo.ModeloID);
      setModeloSeleccionado(detalleCompleto);
    } catch (error: any) {
      addToast('Error al cargar detalles del modelo', 'error');
    }
  };

  const handleAprobar = async () => {
    if (!modeloSeleccionado) return;

    try {
      setIsProcessing(true);
      await modeloService.update(modeloSeleccionado.ModeloID, {
        Estado: ModeloEstado.DEFINITIVO
      });
      addToast('Modelo aprobado y marcado como definitivo', 'success');
      setModeloSeleccionado(null);
      loadModelos();
    } catch (error: any) {
      addToast(error.response?.data?.message || 'Error al aprobar modelo', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRechazar = () => {
    setShowRechazoDialog(true);
  };

  const handleConfirmarRechazo = async () => {
    if (!modeloSeleccionado) return;

    try {
      setIsProcessing(true);
      await modeloService.update(modeloSeleccionado.ModeloID, {
        Estado: ModeloEstado.CORREGIR_EQUIPAMIENTO,
        Observaciones: observaciones
      });
      addToast('Modelo marcado para corrección', 'success');
      setShowRechazoDialog(false);
      setObservaciones('');
      setModeloSeleccionado(null);
      loadModelos();
    } catch (error: any) {
      addToast(error.response?.data?.message || 'Error al rechazar modelo', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  const modelosFiltrados = modelos.filter(m =>
    m.Modelo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.MarcaNombre?.toLowerCase().includes(searchTerm.toLowerCase())
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
      <PageHeader title="Revisar Vehículos" />

      <div className="grid grid-cols-12 gap-6">
        {/* Lista de modelos */}
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Modelos en Revisión</CardTitle>
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
                  No hay modelos pendientes de revisión
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
                    onClick={() => handleVerDetalle(modelo)}
                  >
                    <div className="font-medium">{modelo.MarcaNombre} {modelo.Modelo}</div>
                    <div className="text-sm text-muted-foreground">
                      {modelo.Anio} • {modelo.Familia || 'Sin familia'}
                    </div>
                    <Badge
                      variant={modelo.Estado === ModeloEstado.CORREGIR_EQUIPAMIENTO ? 'destructive' : 'default'}
                      className="mt-1"
                    >
                      {modelo.Estado === ModeloEstado.CORREGIR_EQUIPAMIENTO ? 'Para Corregir' : 'En Revisión'}
                    </Badge>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Detalle del modelo */}
        <div className="col-span-8 space-y-4">
          {!modeloSeleccionado ? (
            <Card>
              <CardContent className="py-12">
                <p className="text-center text-muted-foreground">
                  Selecciona un modelo de la lista para revisar sus detalles
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
                        Estado: {modeloSeleccionado.Estado}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="destructive" onClick={handleRechazar} disabled={isProcessing}>
                        <XCircle className="h-4 w-4 mr-2" />
                        Rechazar
                      </Button>
                      <Button onClick={handleAprobar} isLoading={isProcessing}>
                        <CheckCircle2 className="h-4 w-4 mr-2" />
                        Aprobar como Definitivo
                      </Button>
                    </div>
                  </div>
                </CardHeader>
              </Card>

              {/* Mostrar observaciones si las hay */}
              {modeloSeleccionado.observaciones && (
                <Card className="border-destructive">
                  <CardHeader>
                    <CardTitle className="text-destructive">Observaciones Anteriores</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">{modeloSeleccionado.observaciones}</p>
                  </CardContent>
                </Card>
              )}

              {/* Datos del modelo */}
              <ModeloDetailView modelo={modeloSeleccionado} />

              {/* Equipamiento */}
              <Card>
                <CardHeader>
                  <CardTitle>Equipamiento</CardTitle>
                </CardHeader>
                <CardContent>
                  <EquipamientoView modeloId={modeloSeleccionado.ModeloID} />
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </div>

      {/* Dialog de rechazo */}
      <Dialog open={showRechazoDialog} onOpenChange={setShowRechazoDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rechazar Modelo</DialogTitle>
            <DialogDescription>
              Indica qué debe corregirse en este modelo
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="observaciones">Observaciones *</Label>
              <Textarea
                id="observaciones"
                placeholder="Describe los problemas encontrados..."
                value={observaciones}
                onChange={(e) => setObservaciones(e.target.value)}
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRechazoDialog(false)}>
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirmarRechazo}
              disabled={!observaciones.trim() || isProcessing}
            >
              Confirmar Rechazo
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
