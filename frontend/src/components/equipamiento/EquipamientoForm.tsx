import {  useEffect, useState  } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@components/ui/Card';
import { Checkbox } from '@components/ui/Checkbox';
import { Button } from '@components/ui/Button';
import { Input } from '@components/ui/Input';
import { Alert } from '@components/ui/Alert';
import { LoadingSpinner } from '@components/ui/LoadingSpinner';
import { equipamientoService } from '@services/equipamientoService';
import { EquipamientoModelo } from '@/types/index';
import { Save, CheckSquare, Square } from 'lucide-react';
import { useToast } from '@context/ToastContext';

interface EquipamientoFormProps {
  modeloId: number;
  onUpdate: () => void;
  readOnly?: boolean;
}

// Generate categories dynamically
export function EquipamientoForm({ modeloId, onUpdate, readOnly = false }: EquipamientoFormProps) {
  const [equipamiento, setEquipamiento] = useState<Partial<EquipamientoModelo>>({});
  const [dbColumns, setDbColumns] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const { addToast } = useToast();

  useEffect(() => {
    loadEquipamiento();
  }, [modeloId]);

  const loadEquipamiento = async () => {
    try {
      setIsLoading(true);
      const data = await equipamientoService.getByModeloId(modeloId);
      
      // Load all available columns from DB if none are returned (or extract from backend structure)
      // Actually we will use the data object structure to read the columns
      // For dynamic purposes, we assume any property not ModeloID, EquipamientoID or nulls if required.
      const initialEquip = data || {};
      setEquipamiento(initialEquip);
      
      // To properly load all columns we extract keys from the data (backend must return full schema)
      if(data) {
          const keys = Object.keys(data).filter(k => !['EquipamientoID', 'ModeloID', 'FechaCreacion', 'FechaModificacion', 'OtrosDatos'].includes(k));
          setDbColumns(keys);
      }
    } catch (error) {
      addToast('Error al cargar equipamiento', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (key: keyof EquipamientoModelo, value: any) => {
    setEquipamiento((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      if (equipamiento.id_equipamiento) {
        await equipamientoService.update(modeloId, equipamiento);
      } else {
        await equipamientoService.create({ ...equipamiento, id_modelo: modeloId });
      }
      addToast('Equipamiento guardado correctamente', 'success');
      onUpdate();
      loadEquipamiento();
    } catch (error: any) {
      addToast(error.response?.data?.message || 'Error al guardar equipamiento', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggleCategory = (fields: string[], selectAll: boolean) => {
    const updates: Partial<EquipamientoModelo> = {};
    fields.forEach((field) => {
      // Solo hace toggle de booleanos si sabemos que son checkboxes
      if (typeof equipamiento[field as keyof EquipamientoModelo] === 'boolean' || 
          typeof equipamiento[field as keyof EquipamientoModelo] === 'number') {
        const currentVal = equipamiento[field as keyof EquipamientoModelo];
        // si es 1/0 o true/false asumimos que se puede togglear
        if (currentVal === 1 || currentVal === 0 || typeof currentVal === 'boolean' || currentVal == null) {
          updates[field as keyof EquipamientoModelo] = selectAll ? true : false as any;
        }
      }
    });
    setEquipamiento((prev) => ({ ...prev, ...updates }));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner size="lg" text="Cargando equipamiento..." />
      </div>
    );
  }

  // Generate dynamic fields from actual db columns
  const filteredFields = dbColumns.filter(col => 
    col.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <Input
          placeholder="Buscar equipamiento..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-md"
        />
        {!readOnly && (
          <Button onClick={handleSave} isLoading={isSaving}>
            <Save className="h-4 w-4 mr-2" />
            Guardar
          </Button>
        )}
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Equipamiento Completo</CardTitle>
            {!readOnly && (
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleToggleCategory(filteredFields, true)}
                >
                  <CheckSquare className="h-4 w-4 mr-2" />
                  Marcar Visibles
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleToggleCategory(filteredFields, false)}
                >
                  <Square className="h-4 w-4 mr-2" />
                  Desmarcar Visibles
                </Button>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredFields.map((field) => {
              const val = equipamiento[field as keyof EquipamientoModelo];
              // Si su valor es estrictamente TRUE, FALSE, 1 o 0 (O NULO), lo consideramos un Checkbox.
              // Si no, lo consideramos un Text/Input simple
              const isBooleanish = typeof val === 'boolean' || val === 1 || val === 0 || val === 'Si' || val === 'No';
              
              if (!isBooleanish && typeof val === 'string' && val !== '') {
                return (
                  <Input
                    key={field}
                    type="text"
                    label={field.replace(/([A-Z])/g, ' $1').trim()} // CamelCase to readable
                    value={(val as string) || ''}
                    onChange={(e) => handleChange(field as keyof EquipamientoModelo, e.target.value)}
                    disabled={readOnly}
                  />
                );
              }

              return (
                <Checkbox
                  key={field}
                  label={field.replace(/([A-Z])/g, ' $1').trim()}
                  checked={val === true || val === 1 || val === 'Si'}
                  onCheckedChange={(checked) => handleChange(field as keyof EquipamientoModelo, checked ? true : false)}
                  disabled={readOnly}
                />
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
