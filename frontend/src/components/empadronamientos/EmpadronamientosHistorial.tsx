import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@components/ui/Card';
import { LoadingSpinner } from '@components/ui/LoadingSpinner';
import { Alert } from '@components/ui/Alert';
import { obtenerDepartamentos } from '@/services/departamentosService';
import { obtenerHistorialEmpadronamientosModelo } from '@/services/empadronamientosService';
import { FileText } from 'lucide-react';
import type { Departamento } from '@/types/ventas.types';

interface EmpadronamientosHistorialProps {
  modeloId: number;
}

interface EmpadronamientoHistorial {
  Periodo: string;
  DepartamentoID: number;
  Cantidad: number;
  FechaModificacion?: string;
}

export function EmpadronamientosHistorial({ modeloId }: EmpadronamientosHistorialProps) {
  const [departamentos, setDepartamentos] = useState<Departamento[]>([]);
  const [departamentoSeleccionado, setDepartamentoSeleccionado] = useState<number | null>(null);
  const [historial, setHistorial] = useState<EmpadronamientoHistorial[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadDepartamentos();
  }, []);

  useEffect(() => {
    if (departamentoSeleccionado) {
      loadHistorial();
    }
  }, [modeloId, departamentoSeleccionado]);

  const loadDepartamentos = async () => {
    try {
      const response = await obtenerDepartamentos();
      if (response.success) {
        setDepartamentos(response.data);
        // Seleccionar el primer departamento por defecto
        if (response.data.length > 0) {
          setDepartamentoSeleccionado(response.data[0].DepartamentoID);
        }
      }
    } catch (err: any) {
      setError('Error al cargar los departamentos');
    }
  };

  const loadHistorial = async () => {
    if (!departamentoSeleccionado) return;

    setIsLoading(true);
    setError(null);
    try {
      const response = await obtenerHistorialEmpadronamientosModelo(
        modeloId,
        departamentoSeleccionado,
        12
      );
      if (response.success) {
        setHistorial(response.data);
      } else {
        setError('No se pudieron cargar los empadronamientos');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al cargar el historial de empadronamientos');
    } finally {
      setIsLoading(false);
    }
  };

  const formatPeriodo = (periodo: string) => {
    const [año, mes] = periodo.split('-');
    const fecha = new Date(parseInt(año), parseInt(mes) - 1);
    return fecha.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });
  };

  const departamentoActual = departamentos.find(d => d.DepartamentoID === departamentoSeleccionado);

  if (error && !departamentoSeleccionado) {
    return <Alert variant="destructive">{error}</Alert>;
  }

  const totalEmpadronamientos = historial.reduce((sum, item) => sum + item.Cantidad, 0);
  const promedioMensual = historial.length > 0 ? Math.round(totalEmpadronamientos / historial.length) : 0;

  return (
    <div className="space-y-6">
      {/* Selector de Departamento */}
      <Card>
        <CardHeader>
          <CardTitle>Seleccionar Departamento</CardTitle>
        </CardHeader>
        <CardContent>
          <select
            value={departamentoSeleccionado || ''}
            onChange={(e) => setDepartamentoSeleccionado(Number(e.target.value))}
            className="w-full md:w-1/2 px-3 py-2 border rounded-md"
          >
            <option value="">Seleccione un departamento...</option>
            {departamentos.map((depto) => (
              <option key={depto.DepartamentoID} value={depto.DepartamentoID}>
                {depto.Nombre}
              </option>
            ))}
          </select>
        </CardContent>
      </Card>

      {departamentoSeleccionado && (
        <>
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <LoadingSpinner size="lg" />
            </div>
          ) : error ? (
            <Alert variant="destructive">{error}</Alert>
          ) : historial.length === 0 ? (
            <Card>
              <CardContent className="py-12">
                <div className="text-center text-muted-foreground">
                  <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No hay registro de empadronamientos para este modelo en {departamentoActual?.Nombre}</p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <>
              {/* Resumen */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium">Total Empadronamientos</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{totalEmpadronamientos.toLocaleString()}</div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {departamentoActual?.Nombre} - Últimos {historial.length} meses
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium">Promedio Mensual</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{promedioMensual.toLocaleString()}</div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Unidades por mes
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium">Último Mes</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {historial[0]?.Cantidad.toLocaleString() || 0}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {historial[0] && formatPeriodo(historial[0].Periodo)}
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Tabla de historial */}
              <Card>
                <CardHeader>
                  <CardTitle>Historial de Empadronamientos - {departamentoActual?.Nombre}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-3 px-4 font-medium">Periodo</th>
                          <th className="text-right py-3 px-4 font-medium">Cantidad</th>
                          <th className="text-right py-3 px-4 font-medium">Última Modificación</th>
                        </tr>
                      </thead>
                      <tbody>
                        {historial.map((item, index) => (
                          <tr key={item.Periodo} className={index % 2 === 0 ? 'bg-muted/50' : ''}>
                            <td className="py-3 px-4 font-medium capitalize">
                              {formatPeriodo(item.Periodo)}
                            </td>
                            <td className="py-3 px-4 text-right text-lg font-semibold">
                              {item.Cantidad.toLocaleString()}
                            </td>
                            <td className="py-3 px-4 text-right text-sm text-muted-foreground">
                              {item.FechaModificacion
                                ? new Date(item.FechaModificacion).toLocaleDateString('es-ES', {
                                    day: '2-digit',
                                    month: '2-digit',
                                    year: 'numeric',
                                  })
                                : '-'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </>
      )}
    </div>
  );
}
