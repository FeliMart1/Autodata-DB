import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '@components/layout/PageHeader';
import { Button } from '@components/ui/Button';
import { DataTable } from '@components/ui/DataTable';
import { LoadingSpinner } from '@components/ui/LoadingSpinner';
import { Input } from '@components/ui/Input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@components/ui/Select';
import { modeloService } from '@services/modeloService';
import { marcasService } from '@/services/marcasService';
import { Modelo, ModeloEstado, ModeloFilters } from '@/types/index';
import { Marca as MarcaResponse } from '@/types/marca';
import { Plus, Filter } from 'lucide-react';
import { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { useDebounce } from '@hooks/useDebounce';

export function ModelosPage() {
  const [modelos, setModelos] = useState<Modelo[]>([]);
  const [marcas, setMarcas] = useState<MarcaResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState<ModeloFilters>({});
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearch = useDebounce(searchTerm, 500);
  const navigate = useNavigate();

  useEffect(() => {
    loadMarcas();
  }, []);

  useEffect(() => {
    loadModelos();
  }, [debouncedSearch, filters]);

  const loadMarcas = async () => {
    try {
      const data = await marcasService.getAll();
      console.log('ModelosPage - Marcas loaded:', data);
      setMarcas(data || []);
    } catch (error: any) {
      console.error('Error loading marcas:', error);
      console.error('Error details:', error.response?.data);
      setMarcas([]);
    }
  };

  const loadModelos = async () => {
    setIsLoading(true);
    try {
      const filterParams: ModeloFilters = {
        ...filters,
        search: debouncedSearch || undefined,
      };
      console.log('Loading modelos with filters:', filterParams);
      const response = await modeloService.getAll(filterParams);
      console.log('Modelos response:', response);
      setModelos(response.data || []);
    } catch (error) {
      console.error('Error loading modelos:', error);
      setModelos([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFilterChange = (key: keyof ModeloFilters, value: any) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value || undefined,
    }));
  };

  const clearFilters = () => {
    setFilters({});
    setSearchTerm('');
  };

  const columns: ColumnDef<Modelo>[] = [
    {
      accessorKey: 'MarcaNombre',
      header: 'Marca',
      cell: ({ row }) => (
        <span className="font-medium">{row.original.MarcaNombre || '-'}</span>
      ),
    },
    {
      accessorKey: 'Modelo',
      header: 'Modelo',
      cell: ({ row }) => (
        <span className="font-medium">{row.original.Modelo}</span>
      ),
    },
    {
      accessorKey: 'Familia',
      header: 'Familia',
      cell: ({ row }) => (
        <span>{row.original.Familia || '-'}</span>
      ),
    },
    {
      accessorKey: 'Anio',
      header: 'Año',
      cell: ({ row }) => (
        <span>{row.original.Anio || '-'}</span>
      ),
    },
    {
      accessorKey: 'Combustible',
      header: 'Combustible',
      cell: ({ row }) => (
        <span>{row.original.CombustibleCodigo || '-'}</span>
      ),
    },
    {
      accessorKey: 'Tipo',
      header: 'Tipo',
      cell: ({ row }) => (
        <span>{row.original.Tipo || '-'}</span>
      ),
    },
    {
      accessorKey: 'Estado',
      header: 'Estado',
      cell: ({ row }) => {
        const estado = row.original.Estado;
        if (!estado) return <span className="text-muted-foreground text-sm">-</span>;
        
        const colors: Record<string, string> = {
          'importado': 'bg-gray-100 text-gray-800',
          'requisitos_minimos': 'bg-blue-100 text-blue-800',
          'en_revision': 'bg-yellow-100 text-yellow-800',
          'para_corregir': 'bg-red-100 text-red-800',
          'definitivo': 'bg-green-100 text-green-800',
        };
        
        const labels: Record<string, string> = {
          'importado': 'Importado',
          'requisitos_minimos': 'Requisitos Mínimos',
          'en_revision': 'En Revisión',
          'para_corregir': 'Para Corregir',
          'definitivo': 'Definitivo',
        };
        
        return (
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[estado] || 'bg-gray-100 text-gray-800'}`}>
            {labels[estado] || estado}
          </span>
        );
      },
    },
    {
      accessorKey: 'FechaCreacion',
      header: 'Fecha Creación',
      cell: ({ row }) => (
        <span className="text-sm text-muted-foreground">
          {row.original.FechaCreacion ? format(new Date(row.original.FechaCreacion), 'dd/MM/yyyy', { locale: es }) : '-'}
        </span>
      ),
    },
  ];

  if (isLoading && modelos.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner size="lg" text="Cargando modelos..." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Gestión de Modelos"
        description="Administra y visualiza todos los modelos del sistema"
        actions={
          <Button onClick={() => navigate('/modelos/nuevo')}>
            <Plus className="h-4 w-4 mr-2" />
            Nuevo Modelo
          </Button>
        }
      />

      {/* Filters */}
      <div className="bg-card rounded-lg border p-4">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <h3 className="font-medium">Filtros</h3>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          <Input
            placeholder="Buscar modelo..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          
          <Select
            value={filters.marcaId?.toString() || 'all'}
            onValueChange={(value) => handleFilterChange('marcaId', value === 'all' ? undefined : Number(value))}
          >
            <SelectTrigger label="Marca">
              <SelectValue placeholder="Todas las marcas" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas las marcas</SelectItem>
              {marcas.map((marca) => (
                <SelectItem key={marca.MarcaID} value={marca.MarcaID.toString()}>
                  {marca.Marca}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={filters.estado || ''}
            onValueChange={(value) => handleFilterChange('estado', value as ModeloEstado)}
          >
            <SelectTrigger label="Estado">
              <SelectValue placeholder="Todos los estados" />
            </SelectTrigger>
            <SelectContent>
              {Object.values(ModeloEstado).map((estado) => (
                <SelectItem key={estado} value={estado}>
                  {estado.replace(/_/g, ' ')}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Input
            type="number"
            placeholder="Año"
            value={filters.anio || ''}
            onChange={(e) => handleFilterChange('anio', e.target.value ? Number(e.target.value) : undefined)}
          />

          <Button variant="outline" onClick={clearFilters} className="w-full">
            Limpiar Filtros
          </Button>
        </div>
      </div>

      {/* Results */}
      <div className="bg-card rounded-lg border p-4">
        <div className="mb-4">
          <p className="text-sm text-muted-foreground">
            Mostrando {modelos.length} modelo{modelos.length !== 1 ? 's' : ''}
          </p>
        </div>
        <DataTable
          columns={columns}
          data={modelos}
          searchPlaceholder="Buscar en resultados..."
          onRowClick={(row) => navigate(`/modelos/${row.ModeloID}`)}
        />
      </div>
    </div>
  );
}
