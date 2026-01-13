import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@components/ui/Card';
import { StatCard } from '@components/layout/StatCard';
import { PageHeader } from '@components/layout/PageHeader';
import { Badge } from '@components/ui/Badge';
import { LoadingSpinner } from '@components/ui/LoadingSpinner';
import { Button } from '@components/ui/Button';
import { useAuth } from '@context/AuthContext';
import { modeloService } from '@services/modeloService';
import { Modelo, ModeloEstado, UserRole } from '@types/index';
import { 
  Car, 
  Upload, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  TrendingUp,
  Activity,
  DollarSign,
  Users,
  FileText,
  ArrowRight
} from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export function DashboardPage() {
  const [stats, setStats] = useState<any>(null);
  const [recentModels, setRecentModels] = useState<Modelo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      // Cargar estadísticas por estado
      const [allModels, minimosFetch, equipamientoFetch, revisionFetch, aprobacionFetch, corregirFetch, definitivoFetch] = await Promise.all([
        modeloService.getAll({ page: 1, limit: 10 }),
        modeloService.getAll({ estado: ModeloEstado.REQUISITOS_MINIMOS }),
        modeloService.getAll({ estado: ModeloEstado.EQUIPAMIENTO_CARGADO }),
        modeloService.getAll({ estado: ModeloEstado.EN_REVISION }),
        modeloService.getAll({ estado: ModeloEstado.EN_APROBACION }),
        modeloService.getAll({ estado: ModeloEstado.PARA_CORREGIR }),
        modeloService.getAll({ estado: ModeloEstado.DEFINITIVO })
      ]);

      setRecentModels(allModels.data || []);
      setStats({
        total: allModels.pagination?.total || 0,
        requisitos_minimos: minimosFetch.pagination?.total || 0,
        equipamiento_cargado: equipamientoFetch.pagination?.total || 0,
        en_revision: revisionFetch.pagination?.total || 0,
        en_aprobacion: aprobacionFetch.pagination?.total || 0,
        para_corregir: corregirFetch.pagination?.total || 0,
        definitivo: definitivoFetch.pagination?.total || 0
      });
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner size="lg" text="Cargando dashboard..." />
      </div>
    );
  }

  const getEstadoBadgeColor = (estado: string) => {
    switch(estado) {
      case ModeloEstado.REQUISITOS_MINIMOS: return 'bg-blue-100 text-blue-800';
      case ModeloEstado.EQUIPAMIENTO_CARGADO: return 'bg-yellow-100 text-yellow-800';
      case ModeloEstado.EN_REVISION: return 'bg-orange-100 text-orange-800';
      case ModeloEstado.EN_APROBACION: return 'bg-purple-100 text-purple-800';
      case ModeloEstado.PARA_CORREGIR: return 'bg-red-100 text-red-800';
      case ModeloEstado.DEFINITIVO: return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleQuickActions = () => {
    switch (user?.role) {
      case UserRole.ENTRADA_DATOS:
      case UserRole.ADMIN:
        return [
          { label: 'Importar Modelos CSV', href: '/import', icon: Upload, description: 'Importar desde archivo' },
          { label: 'Agregar Equipamiento', href: '/agregar-equipamiento', icon: FileText, description: 'Completar modelos pendientes' },
          { label: 'Ver Todos los Modelos', href: '/modelos', icon: Car, description: `${stats?.total || 0} modelos totales` },
        ];
      case UserRole.REVISION:
        return [
          { label: 'Revisar Modelos', href: '/revision', icon: CheckCircle2, description: `${stats?.en_revision || 0} pendientes` },
          { label: 'Ver Modelos', href: '/modelos', icon: Car, description: 'Ver todos los modelos' },
        ];
      case UserRole.APROBACION:
        return [
          { label: 'Aprobar Modelos', href: '/aprobacion', icon: CheckCircle2, description: `${stats?.en_aprobacion || 0} para aprobar` },
          { label: 'Ver Modelos', href: '/modelos', icon: Car, description: 'Ver todos los modelos' },
        ];
      default:
        return [
          { label: 'Ver Modelos', href: '/modelos', icon: Car, description: 'Ver catálogo completo' },
        ];
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Bienvenido, ${user?.nombre || user?.username}`}
        description="Panel de control del sistema Autodata"
      />

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total de Modelos"
          value={stats?.total || 0}
          icon={Car}
          description="En el sistema"
          trend="+12% vs mes anterior"
        />
        <StatCard
          title="En Revisión"
          value={stats?.en_revision || 0}
          icon={Clock}
          description="Esperando revisión"
          className="cursor-pointer hover:shadow-lg transition-shadow"
          onClick={() => navigate('/revision')}
        />
        <StatCard
          title="Para Corregir"
          value={stats?.para_corregir || 0}
          icon={AlertCircle}
          description="Requieren corrección"
          className="cursor-pointer hover:shadow-lg transition-shadow"
          onClick={() => navigate('/agregar-equipamiento')}
        />
        <StatCard
          title="Definitivos"
          value={stats?.definitivo || 0}
          icon={CheckCircle2}
          description="Aprobados y publicables"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Acciones Rápidas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {getRoleQuickActions().map((action) => (
              <button
                key={action.href}
                onClick={() => navigate(action.href)}
                className="w-full flex items-center justify-between p-4 rounded-lg border hover:bg-accent transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <action.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div className="text-left">
                    <p className="font-medium">{action.label}</p>
                    <p className="text-sm text-muted-foreground">{action.description}</p>
                  </div>
                </div>
                <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
              </button>
            ))}
          </CardContent>
        </Card>

        {/* Estado por Workflow */}
        <Card>
          <CardHeader>
            <CardTitle>Estado del Workflow</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-lg bg-blue-50 border border-blue-200">
              <span className="text-sm font-medium">Datos Mínimos</span>
              <span className="text-2xl font-bold text-blue-600">{stats?.requisitos_minimos || 0}</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-yellow-50 border border-yellow-200">
              <span className="text-sm font-medium">Equipamiento Cargado</span>
              <span className="text-2xl font-bold text-yellow-600">{stats?.equipamiento_cargado || 0}</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-orange-50 border border-orange-200">
              <span className="text-sm font-medium">En Revisión</span>
              <span className="text-2xl font-bold text-orange-600">{stats?.en_revision || 0}</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-purple-50 border border-purple-200">
              <span className="text-sm font-medium">En Aprobación</span>
              <span className="text-2xl font-bold text-purple-600">{stats?.en_aprobacion || 0}</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-red-50 border border-red-200">
              <span className="text-sm font-medium">Para Corregir</span>
              <span className="text-2xl font-bold text-red-600">{stats?.para_corregir || 0}</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-green-50 border border-green-200">
              <span className="text-sm font-medium">Definitivos</span>
              <span className="text-2xl font-bold text-green-600">{stats?.definitivo || 0}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Models */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Modelos Recientes
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={() => navigate('/modelos')}>
              Ver Todos
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {recentModels.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No hay modelos recientes</p>
          ) : (
            <div className="space-y-3">
              {recentModels.slice(0, 5).map((modelo) => (
                <div
                  key={modelo.ModeloID}
                  onClick={() => navigate(`/modelos/${modelo.ModeloID}`)}
                  className="flex items-center justify-between p-3 rounded-lg border hover:bg-accent cursor-pointer transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Car className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium group-hover:text-primary transition-colors">
                        {modelo.MarcaNombre} {modelo.Modelo}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {modelo.Familia} • {modelo.Anio}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {modelo.CodigoAutodata && (
                      <span className="text-xs font-mono px-2 py-1 rounded bg-purple-100 text-purple-800">
                        {modelo.CodigoAutodata}
                      </span>
                    )}
                    <Badge estado={modelo.Estado} />
                    <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
