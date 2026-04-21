import { useState } from 'react';
import { PageHeader } from '@components/layout/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@components/ui/Card';
import { Button } from '@components/ui/Button';
import { Input } from '@components/ui/Input';
import { useToast } from '@context/ToastContext';
import { Upload, FileSpreadsheet, CheckCircle2 } from 'lucide-react';
import api from '@services/api';

export function ImportPage() {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const { addToast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
      setResult(null);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      addToast('Selecciona un archivo Excel', 'warning');
      return;
    }

    setIsUploading(true);
    setResult(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await api.post('/import/excel-modelos', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      setResult(response.data);
      addToast('Archivo procesado con éxito', 'success');
      setFile(null);
      
      const fileInput = document.getElementById('excel-file') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
    } catch (error: any) {
      addToast(error.response?.data?.message || 'Error al procesar el archivo Excel', 'error');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Importación de Modelos" 
        description="Importa un archivo Excel para cargar marcas y modelos en el sistema"
      />

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileSpreadsheet className="h-5 w-5 text-blue-600" />
            Importar Excel de Modelos
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="p-4 bg-muted rounded-lg space-y-2 text-sm text-muted-foreground border">
            <p><strong>Formato requerido:</strong> Excel (.xlsx)</p>
            <p><strong>Columnas necesarias:</strong></p>
            <ul className="list-disc list-inside pl-4">
              <li><code>MARCOD</code>: Código de la Marca</li>
              <li><code>MARDSC</code>: Descripción de la Marca</li>
              <li><code>MARMODCOD</code>: Código del Modelo</li>
              <li><code>MARMODDSC</code>: Descripción del Modelo</li>
            </ul>
            <p><strong>Columnas opcionales:</strong></p>
            <ul className="list-disc list-inside pl-4">
               <li><code>FAMDSC</code>: Familia</li>
               <li><code>COMBDSC</code>: Combustible</li>
               <li><code>CATDSC</code>: Categoría</li>
               <li><code>MAEVALOR</code>: Precio Inicial</li>
            </ul>
            <p>Las marcas y modelos que no existan serán creados automáticamente.</p>
          </div>

          <div className="grid gap-4 md:flex items-end">
            <div className="flex-1 space-y-2">
              <label htmlFor="excel-file" className="text-sm font-medium leading-none">
                Seleccionar Archivo Excel
              </label>
              <Input
                id="excel-file"
                type="file"
                accept=".xlsx,.xls"
                onChange={handleFileChange}
                disabled={isUploading}
              />
            </div>
            <Button 
              onClick={handleUpload} 
              disabled={!file || isUploading}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Upload className="h-4 w-4 mr-2" />
              {isUploading ? 'Procesando...' : 'Importar Modelos'}
            </Button>
          </div>

          {result && result.success && (
            <div className="mt-6 p-4 border border-green-200 bg-green-50 rounded-lg">
              <h3 className="flex items-center gap-2 font-medium text-green-800">
                <CheckCircle2 className="h-5 w-5" />
                Resumen de Carga
              </h3>
              <ul className="mt-2 space-y-1 text-sm text-green-700 pl-7 list-disc">
                <li>Nuevas marcas creadas: <strong>{result.data?.creados?.marcas || 0}</strong></li>
                <li>Nuevos modelos creados: <strong>{result.data?.creados?.modelos || 0}</strong></li>
              </ul>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
