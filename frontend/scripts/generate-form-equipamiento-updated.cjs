const fs = require('fs');
const path = require('path');

const dbSchemaPath = path.resolve(__dirname, '../../db_schema_details.json');
const dbSchema = JSON.parse(fs.readFileSync(dbSchemaPath, 'utf8'));

const configPath = path.resolve(__dirname, '../../config_parsed.json');
const configData = JSON.parse(fs.readFileSync(configPath, 'utf8'));

const normalizeStr = str => (str || '').toLowerCase().replace(/[^a-z0-9]/g, '');

function getFieldOptionsAndProps(fieldName) {
  const normField = normalizeStr(fieldName);
  const matchingKey = Object.keys(configData).find(k => normalizeStr(k) === normField);
  
  let result = {
      label: matchingKey ? matchingKey.replace(/\s+/g, ' ').trim() : fieldName.replace(/([A-Z])/g, ' $1').trim(),
    props: {},
    options: [],
    customDatalist: false,
    maxLengthToSlice: null,
    extraOnKeyDown: false
  };

  if (!matchingKey) return result;

  const rules = configData[matchingKey] || [];
  const rulesStr = rules.join(' ').toLowerCase();

  if (rulesStr.includes('cuatro cifras')) {
    result.inputType = 'number';
    result.props.max = 9999;
    result.props.min = 0;
    result.maxLengthToSlice = 4;
    result.extraOnKeyDown = true;
  }
  if (rulesStr.includes('dos cifras')) {
    result.inputType = 'number';
    result.props.max = 99;
    result.props.min = 0;
    result.maxLengthToSlice = 2;
    result.extraOnKeyDown = true;
  }

  if (rulesStr.includes('con decimales')) {
    result.props.step = 0.01;
  } else if (rulesStr.includes('sin decimales') || rulesStr.includes('cuatro cifras') || rulesStr.includes('dos cifras')) {
    result.props.step = 1;
    result.extraOnKeyDown = true;
  }

  if (rulesStr.includes('2 ó 3 letras en mayúsculas') || rulesStr.includes('2 o 3 letras en mayúsculas') || normField === 'origen') {
    result.props.maxLength = 3;
    result.props.pattern = "^[A-Z]*$";
    result.props.title = "2 ó 3 letras en mayúsculas";
  }

  const isOption = (opt) => {
    const o = String(opt).toLowerCase();
    if (o.includes('numeros') || o.includes('números') || o.includes('cifras') || o.includes('letras') || o.includes('columna') || o.includes('poner un check') || o.includes('formato:')) return false;
    return true;
  };
  
  let validOptions = rules.filter(isOption).map(String);
  
  let hasCustomEntry = validOptions.some(o => o.toLowerCase().includes('dejar opci') || o.toLowerCase().includes('dejar en blanco para agregar'));
  validOptions = validOptions.filter(o => !o.toLowerCase().includes('dejar opci') && !o.toLowerCase().includes('dejar en blanco para agregar'));

  if (validOptions.length > 0) {
    result.options = validOptions;
    
    const isTinyBooleanList = validOptions.length <= 5 && validOptions.every(o => ['si', 'no', 'n/a', 'del', 'tras', 'ver', 'fija', 'variable', 'todas', 'conductor', 'nd'].some(b => o.toLowerCase().includes(b)));
    
    if (hasCustomEntry) {
      result.inputType = 'datalist';
    } else if (isTinyBooleanList || validOptions.length > 0) {
      result.inputType = 'select'; // simple closed choices
    }
  }

  if (result.inputType === 'text' && rulesStr.includes('numeros')) {
     result.inputType = 'number';
     result.extraOnKeyDown = true;
  }

  return result;
}

const equipamientoFields = dbSchema.EquipamientoModelo;

function getTsType(sqlType) {
  if (sqlType.includes('bit')) return 'boolean';
  if (sqlType.includes('int') || sqlType.includes('decimal') || sqlType.includes('float')) return 'number';
  return 'string';
}

const parsedFields = equipamientoFields.map(field => {
  const match = field.match(/([a-zA-Z0-9_]+) \(([^,]+), (YES|NO)\)/);
  if (!match) return null;
  return { name: match[1], type: getTsType(match[2]) };
}).filter(Boolean);

const categorizer = (field) => {
  const name = field.name.toLowerCase();
  
  // Custom categorizer intercept para Eléctricos
  if (["tipovehiculoelectrico","tipodevehiculoelectrico","epedal","capacidadtanquehidrogeno","captanquehidrgeno","autonomamaxrange","autonomamaxrangeenkilometros","ciclonorma","potenciamotor","potenciamotorkw","capacidadoperativabateria","capoperativabat","potenciacargamax","potenciadecargapotmxkwenca","tiposconectores","tiposdeconectores","garantiacapbat","tecnologiabat"].some(k => name.includes(k))) return 'Electricos';

  if (['largo', 'ancho', 'altura', 'peso', 'ejes', 'puertas', 'asientos', 'kg', 'capacidad', 'volumen', 'carga', 'neumaticos', 'llantas', 'diametro', 'despeje'].some(k => name.includes(k))) return 'Dimensiones';
  if (['cilindros', 'valvulas', 'inyeccion', 'traccion', 'suspension', 'caja', 'marchas', 'turbo', 'aceite', 'norma', 'startstop', 'motor', 'bateria', 'epedal', 'consumo', 'co2', 'aceleracion', 'chassis', 'freno'].some(k => name.includes(k))) return 'Mecanica';
  return 'Equipamiento';
};

const categorizedFields = { Electricos: [], Dimensiones: [], 'Mecanica': [], Equipamiento: [] };

parsedFields.forEach(field => {
  if (['EquipamientoID', 'ModeloID', 'CreadoPorID', 'FechaCreacion', 'ModificadoPorID', 'FechaModificacion'].includes(field.name)) return;
  categorizedFields[categorizer(field)].push(field);
});

let reactContent = `import React from 'react';
import { EquipamientoModelo } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@components/ui/Card';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';

interface FormularioEquipamientoProps {
  equipamiento: Partial<EquipamientoModelo>;
  onSave?: (data: Partial<EquipamientoModelo>) => Promise<void>;
  onCancel?: () => void;
  onSendRevision?: (data: Partial<EquipamientoModelo>) => Promise<void>;
  onChange?: (data: Partial<EquipamientoModelo>) => void;
  readonly?: boolean;
}

export const FormularioEquipamiento: React.FC<FormularioEquipamientoProps> = ({
  equipamiento,
  onSave,
  onCancel,
  onSendRevision,
  onChange,
  readonly = false
}) => {
  const [formData, setFormData] = useState<Partial<EquipamientoModelo>>(equipamiento || {});
  const [seccionesAbiertas, setSeccionesAbiertas] = useState<Record<string, boolean>>({
    Electricos: true,
    Dimensiones: true,
    Mecanica: false,
    Equipamiento: false
    });

  const isElectricoInitial = ['TipoVehiculoElectrico','TipodeVehiculoElectricoHibrido','EPedal','CapacidadTanqueHidrogeno','CapTanqueHidrgeno','AutonomiaMaxRange','AutonomaMaxRangeenkilometros','CicloNorma','PotenciaMotor','PotenciamotorKW','CapacidadOperativaBateria','CapoperativabatBatterycapacityKwh','PotenciaCargaMax','PotenciadecargaPotMxKWenCA','TiposConectores','Tiposdeconectores','GarantiaCapBat','TecnologiaBat'].some((f) => (equipamiento || {})[f] != null && (equipamiento || {})[f] !== '' && (equipamiento || {})[f] !== false);
  const [isElectrico, setIsElectrico] = useState(isElectricoInitial);

  const handleChange = (field: keyof EquipamientoModelo, value: any) => {
    const newData = { ...formData, [field]: value };
    setFormData(newData);
    if (onChange) onChange(newData);
  };

  const toggleSeccion = (seccion: string) => {
    setSeccionesAbiertas(prev => ({
      ...prev,
      [seccion]: !prev[seccion]
    }));
  };

  const handleAction = async (action: 'save' | 'revision') => {
    if (action === 'save' && onSave) await onSave(formData);
    if (action === 'revision' && onSendRevision) await onSendRevision(formData);
  };

  return (
    <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); if (onSendRevision) handleAction('revision'); }}>
`;

Object.keys(categorizedFields).forEach(category => {
  const fields = categorizedFields[category];
  if (!fields.length) return;
  
  reactContent += `      <Card className="border shadow-sm">
        <div 
          className="flex justify-between items-center p-4 cursor-pointer hover:bg-slate-50 transition-colors"
          onClick={() => toggleSeccion('${category}')}
        >
          <h3 className="text-lg font-semibold text-slate-800">${category}</h3>
          {seccionesAbiertas['${category}'] ? (
            <ChevronUp className="h-5 w-5 text-slate-500" />
          ) : (
            <ChevronDown className="h-5 w-5 text-slate-500" />
          )}
        </div>
        
        <div className={seccionesAbiertas['${category}'] ? 'block' : 'hidden'}>
          <CardContent className="pt-0 pb-5">
            {'${category}' === 'Electricos' && (
              <div className="px-4 pb-4 mb-4 border-b bg-slate-50 pt-4 -mx-4">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between mx-4">
                  <span className="font-semibold text-slate-800 text-lg mb-2 md:mb-0">¿Es un vehículo eléctrico o híbrido?</span>
                  <div className="flex gap-6">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="radio" name="is_electrico_toggle" checked={isElectrico} onChange={() => setIsElectrico(true)} disabled={readonly} className="text-brand-blue ring-brand-blue w-5 h-5" />
                      <span className="text-base font-medium">Sí</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="radio" name="is_electrico_toggle" checked={!isElectrico} onChange={() => { 
                        setIsElectrico(false); 
                        ['TipoVehiculoElectrico','TipodeVehiculoElectricoHibrido','EPedal','CapacidadTanqueHidrogeno','CapTanqueHidrgeno','AutonomiaMaxRange','AutonomaMaxRangeenkilometros','CicloNorma','PotenciaMotor','PotenciamotorKW','CapacidadOperativaBateria','CapoperativabatBatterycapacityKwh','PotenciaCargaMax','PotenciadecargaPotMxKWenCA','TiposConectores','Tiposdeconectores','GarantiaCapBat','TecnologiaBat'].forEach(f => handleChange(f as any, undefined)); 
                      }} disabled={readonly} className="text-brand-blue ring-brand-blue w-5 h-5" />
                      <span className="text-base font-medium">No</span>
                    </label>
                  </div>
                </div>
              </div>
            )}
            <div className={\`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 px-4 \${'${category}' === 'Electricos' && !isElectrico ? 'hidden' : 'pt-4'}\`}>
`;

  fields.forEach(f => {
    const c = getFieldOptionsAndProps(f.name);
    // stringify props
    let propsObj = {...c.props};
    let extraPropsStr = '';
    Object.keys(propsObj).forEach(k => {
      let val = propsObj[k];
      if (typeof val === 'string') extraPropsStr += ` ${k}="${val}"`;
      else extraPropsStr += ` ${k}={${val}}`;
    });
    
    let onKeyDownCode = '';
    if (c.extraOnKeyDown) {
        onKeyDownCode = ` onKeyDown={(e) => { if(['e','E','+','-','.'].includes(e.key)) e.preventDefault(); }}`;
    }

    let onChangeCode = `handleChange('${f.name}', e.target.value);`;

    if (f.type === 'number' || c.inputType === 'number') {
        if (c.maxLengthToSlice) {
            onChangeCode = `
            const raw = e.target.value;
            let sliced = raw;
            if (raw && raw.length > ${c.maxLengthToSlice}) {
              sliced = raw.slice(0, ${c.maxLengthToSlice});
            }
            handleChange('${f.name}', sliced === '' ? undefined : parseFloat(sliced));
            `;
        } else {
            onChangeCode = `handleChange('${f.name}', e.target.value === '' ? undefined : parseFloat(e.target.value));`;
        }
    } 
    
    if (c.props.pattern === "^[A-Z]*$") {
        onChangeCode = `handleChange('${f.name}', e.target.value.replace(/[^A-Za-z]/g, '').toUpperCase());`;
    }

    reactContent += `              <div className="flex flex-col gap-1.5">\n`;
      reactContent += `                <label className="text-sm font-medium text-slate-700 leading-tight break-words">${c.label || f.name.replace(/([A-Z])/g, ' $1').trim()}</label>\n`;
    if (f.type === 'boolean') {
        reactContent += `                <input type="checkbox" disabled={readonly} checked={(formData['${f.name}'] as boolean) || false} onChange={(e) => handleChange('${f.name}', e.target.checked)} className="w-4 h-4 rounded border-slate-300 text-brand-blue" />\n`;
    } else if (c.inputType === 'select') {
        reactContent += `                <select disabled={readonly} value={(formData['${f.name}'] as string | number) || ''} onChange={(e) => { ${onChangeCode} }} className="w-full h-10 px-3 rounded-md border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-blue/50 bg-white"${extraPropsStr}>\n`;
        reactContent += `                  <option value="">Seleccionar...</option>\n`;
        c.options.forEach(opt => {
            reactContent += `                  <option value="${opt}">${opt}</option>\n`;
        });
        reactContent += `                </select>\n`;
    } else if (c.inputType === 'datalist') {
        reactContent += `                <input type="text" list="${f.name}_list" disabled={readonly} value={(formData['${f.name}'] as string | number) || ''} onChange={(e) => { ${onChangeCode} }} className="w-full h-10 px-3 rounded-md border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-blue/50"${extraPropsStr}${onKeyDownCode} />\n`;
        reactContent += `                <datalist id="${f.name}_list">\n`;
        c.options.forEach(opt => {
            reactContent += `                  <option value="${opt}" />\n`;
        });
        reactContent += `                </datalist>\n`;
    } else {
        reactContent += `                <input type={'${c.inputType === 'number' || f.type === 'number' ? 'number' : 'text'}'} disabled={readonly} value={(formData['${f.name}'] as string | number) || ''} onChange={(e) => { ${onChangeCode} }} className="w-full h-10 px-3 rounded-md border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-blue/50"${extraPropsStr}${onKeyDownCode} />\n`;
    }
    
    reactContent += `              </div>\n`;
  });

  reactContent += `            </div>
          </CardContent>
        </div>
      </Card>\n`;
});

reactContent += `
      {!readonly && (
        <div className="flex justify-end gap-3 pt-6 border-t mt-8">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-50"
            >
              Cancelar
            </button>
          )}
          {onSendRevision && (
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-brand-blue bg-blue-50 border border-brand-blue/30 rounded-md hover:bg-blue-100"
            >
              Enviar a Revisión
            </button>
          )}
          {onSave && (
            <button
              type="button"
              onClick={() => handleAction('save')}
              className="px-4 py-2 text-sm font-medium text-white bg-brand-blue rounded-md hover:bg-brand-blue/90"
            >
              Guardar Cambios
            </button>
          )}
        </div>
      )}
    </form>
  );
};
`;

const destComponentPath = path.resolve(__dirname, '../src/components/modelos/FormularioEquipamiento.tsx');
fs.writeFileSync(destComponentPath, reactContent);
console.log('✅ FormularioEquipamiento.tsx updated.');
