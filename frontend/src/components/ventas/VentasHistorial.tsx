import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@components/ui/Card';
import { LoadingSpinner } from '@components/ui/LoadingSpinner';
import { Alert } from '@components/ui/Alert';
import { obtenerHistorialVentasModelo } from '@/services/ventasService';
import { BarChart3 } from 'lucide-react';

interface VentasHistorialProps {
  modeloId: number;
}

interface VentaHistorial {
  Periodo: string;
  Cantidad: number;
  FechaModificacion?: string;
}

export function VentasHistorial({ modeloId }: VentasHistorialProps) {
  const [historial, setHistorial] = useState<VentaHistorial[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadHistorial();
  }, [modeloId]);

  const loadHistorial = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await obtenerHistorialVentasModelo(modeloId, 12);
      if (response.success) {
        setHistorial(response.data);
      } else {
        setError('No se pudieron cargar las ventas');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al cargar el historial de ventas');
    } finally {
      setIsLoading(false);
    }
  };

  const formatPeriodo = (periodo: string) => {
    const [año, mes] = periodo.split('-');
    const fecha = new Date(parseInt(año), parseInt(mes) - 1);
    return fecha.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return <Alert variant="destructive">{error}</Alert>;
  }

  if (historial.length === 0) {
    return (
      <Card>
        <CardContent className="py-12">
          <div className="text-center text-muted-foreground">
            <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No hay registro de ventas para este modelo</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const totalVentas = historial.reduce((sum, item) => sum + item.Cantidad, 0);
  const promedioMensual = Math.round(totalVentas / historial.length);

  return (
    <div className="space-y-6">
      {/* Resumen */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total Ventas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalVentas.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Últimos {historial.length} meses
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
          <CardTitle>Historial de Ventas por Mes</CardTitle>
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
    </div>
  );
}
