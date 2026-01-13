import { Card, CardContent, CardHeader, CardTitle } from '@components/ui/Card';
import { Badge } from '@components/ui/Badge';
import { Modelo } from '@/types/index';

interface ModeloDetailViewProps {
  modelo: Modelo;
}

export function ModeloDetailView({ modelo }: ModeloDetailViewProps) {
  const InfoRow = ({ label, value }: { label: string; value: any }) => (
    <div className="grid grid-cols-3 gap-4 py-2 border-b last:border-b-0">
      <dt className="font-medium text-muted-foreground">{label}</dt>
      <dd className="col-span-2">{value || '-'}</dd>
    </div>
  );

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Información General</CardTitle>
            <Badge variant={modelo.Estado === 'DEFINITIVO' ? 'success' : 'default'}>
              {modelo.Estado}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <dl className="divide-y">
            <InfoRow label="ID" value={modelo.ModeloID} />
            <InfoRow label="Marca" value={modelo.MarcaNombre} />
            <InfoRow label="Modelo" value={modelo.Modelo || modelo.DescripcionModelo} />
            <InfoRow label="Código Modelo" value={modelo.CodigoModelo} />
            <InfoRow label="Familia" value={modelo.Familia} />
            <InfoRow label="Año" value={modelo.Anio} />
            <InfoRow label="Origen" value={modelo.OrigenCodigo} />
            <InfoRow label="Combustible" value={modelo.CombustibleCodigo} />
            <InfoRow label="Precio 0KM Inicial" value={modelo.Precio0KMInicial ? `$${modelo.Precio0KMInicial.toLocaleString()}` : '-'} />
          </dl>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Especificaciones Técnicas</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="divide-y">
            <InfoRow label="Tipo" value={modelo.Tipo} />
            <InfoRow label="Tipo 2" value={modelo.Tipo2} />
            <InfoRow label="CC" value={modelo.CC} />
            <InfoRow label="HP" value={modelo.HP} />
            <InfoRow label="Tracción" value={modelo.Traccion} />
            <InfoRow label="Caja" value={modelo.Caja} />
            <InfoRow label="Tipo de Caja" value={modelo.TipoCaja} />
            <InfoRow label="Turbo" value={modelo.Turbo ? 'Sí' : 'No'} />
            <InfoRow label="Puertas" value={modelo.Puertas} />
            <InfoRow label="Pasajeros" value={modelo.Pasajeros} />
          </dl>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Clasificación</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="divide-y">
            <InfoRow label="Tipo de Vehículo" value={modelo.TipoVehiculo} />
            <InfoRow label="Segmentación Autodata" value={modelo.SegmentacionAutodata} />
            <InfoRow label="Segmentación GM" value={modelo.SegmentacionGM} />
            <InfoRow label="Segmentación Audi" value={modelo.SegmentacionAudi} />
            <InfoRow label="Segmentación SBI" value={modelo.SegmentacionSBI} />
            <InfoRow label="Categoría" value={modelo.CategoriaCodigo} />
            <InfoRow label="Importador" value={modelo.Importador} />
          </dl>
        </CardContent>
      </Card>
    </div>
  );
}
