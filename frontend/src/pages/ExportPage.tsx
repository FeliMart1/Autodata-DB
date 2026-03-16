import { useState } from 'react';
import { Download, CalendarDays, FileSpreadsheet } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/context/ToastContext';

export function ExportPage() {
  const { addToast } = useToast();
  const [tipoExport, setTipoExport] = useState('ventas');
  const [mes, setMes] = useState(new Date().getMonth() + 1);
  const [anio, setAnio] = useState(new Date().getFullYear());
  const [isExporting, setIsExporting] = useState(false);

  // Generar opciones para años (últimos 5 años)
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear - i);

  // Meses
  const months = [
    { id: 1, name: 'Enero' },
    { id: 2, name: 'Febrero' },
    { id: 3, name: 'Marzo' },
    { id: 4, name: 'Abril' },
    { id: 5, name: 'Mayo' },
    { id: 6, name: 'Junio' },
    { id: 7, name: 'Julio' },
    { id: 8, name: 'Agosto' },
    { id: 9, name: 'Septiembre' },
    { id: 10, name: 'Octubre' },
    { id: 11, name: 'Noviembre' },
    { id: 12, name: 'Diciembre' }
  ];

  const handleExport = async () => {
    setIsExporting(true);
    try {
      let endpoint = '';
      if (tipoExport === 'ventas') {
        endpoint = `/api/export/ventas?anio=${anio}&mes=${mes}`;
      } else if (tipoExport === 'empadronamientos') {
        endpoint = `/api/export/empadronamientos?anio=${anio}&mes=${mes}`;
      } else if (tipoExport === 'definitivos') {
        addToast('Export de definitivos en desarrollo...', 'info');
        setIsExporting(false);
        return;
      }
      
      const token = localStorage.getItem('token');
      
      const response = await fetch(endpoint, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        if (response.status === 404) {
             throw new Error('No se encontraron datos para el mes y año seleccionados');
        }
        throw new Error('Error al generar el export');
      }

      // Convertir la respuesta a blob y descargar
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${tipoExport === 'ventas' ? 'Ventas' : 'Empadronamientos'}_${anio}_${mes}.xlsx`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      addToast('Export generado correctamente', 'success');
    } catch (error: any) {
      addToast(error.message || 'Error al exportar', 'error');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Exportar Datos (Excel)</h1>
        <p className="text-slate-500 text-sm mt-1">
          Descarga los archivos Excel compatibles con el formato histórico.
        </p>
      </div>

      <div className="bg-white rounded-lg shadow border border-slate-200 mx-auto max-w-2xl mt-8">
        <div className="p-6">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipo de Exportación
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => setTipoExport('ventas')}
                  className={`flex flex-col items-center justify-center p-4 rounded-lg border-2 transition-all ${
                    tipoExport === 'ventas'
                      ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                      : 'border-slate-200 text-slate-600 hover:border-indigo-300 hover:bg-slate-50'
                  }`}
                >
                  <FileSpreadsheet className="h-6 w-6 mb-2" />
                  <span className="font-medium text-sm">Ventas</span>
                </button>
                <button
                  type="button"
                  onClick={() => setTipoExport('empadronamientos')}
                  className={`flex flex-col items-center justify-center p-4 rounded-lg border-2 transition-all ${
                    tipoExport === 'empadronamientos'
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-700'
                      : 'border-slate-200 text-slate-600 hover:border-emerald-300 hover:bg-slate-50'
                  }`}
                >
                  <FileSpreadsheet className="h-6 w-6 mb-2" />
                  <span className="font-medium text-sm">Empadronamientos</span>
                </button>
                <button
                  type="button"
                  onClick={() => setTipoExport('definitivos')}
                  className={`flex flex-col items-center justify-center p-4 rounded-lg border-2 transition-all opacity-60 ${
                    tipoExport === 'definitivos'
                      ? 'border-amber-600 bg-amber-50 text-amber-700'
                      : 'border-slate-200 text-slate-600 hover:border-amber-300 hover:bg-slate-50'
                  }`}
                >
                  <FileSpreadsheet className="h-6 w-6 mb-2" />
                  <span className="font-medium text-sm">Próximamente...</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <div className="flex items-center gap-2">
                    <CalendarDays className="h-4 w-4" />
                    Mes
                  </div>
                </label>
                <select
                  value={mes}
                  onChange={(e) => setMes(Number(e.target.value))}
                  className="w-full rounded-md border border-slate-300 px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                >
                  {months.map((m) => (
                    <option key={m.id} value={m.id}>{m.name}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Año
                </label>
                <select
                  value={anio}
                  onChange={(e) => setAnio(Number(e.target.value))}
                  className="w-full rounded-md border border-slate-300 px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                >
                  {years.map((y) => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>
              </div>
            </div>

          </div>
        </div>

        <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 rounded-b-lg">
          <Button
            onClick={handleExport}
            disabled={isExporting || tipoExport === 'definitivos'}
            className="w-full py-2.5 text-base flex justify-center items-center gap-2"
          >
            {isExporting ? (
              <span className="flex items-center gap-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Generando Excel...
              </span>
            ) : (
              <>
                <Download className="h-5 w-5" />
                Exportar Excel
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
