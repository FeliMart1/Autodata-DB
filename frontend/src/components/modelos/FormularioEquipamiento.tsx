import React from 'react';
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
  const [formData, setFormData] = useState<Partial<EquipamientoModelo>>(equipamiento);
  const [seccionesAbiertas, setSeccionesAbiertas] = useState<Record<string, boolean>>({
    Dimensiones: true,
    Mecanica: false,
    Equipamiento: false
  });

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
      <Card className="border shadow-sm">
        <div 
          className="flex justify-between items-center p-4 cursor-pointer hover:bg-slate-50 transition-colors"
          onClick={() => toggleSeccion('Dimensiones')}
        >
          <h3 className="text-lg font-semibold text-slate-800">Dimensiones</h3>
          {seccionesAbiertas['Dimensiones'] ? (
            <ChevronUp className="h-5 w-5 text-slate-500" />
          ) : (
            <ChevronDown className="h-5 w-5 text-slate-500" />
          )}
        </div>
        
        <div className={seccionesAbiertas['Dimensiones'] ? 'block' : 'hidden'}>
          <CardContent className="pt-0 pb-5">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 px-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700 leading-tight break-words">Largo</label>
                <input type={'number'} disabled={readonly} value={(formData['Largo'] as string | number) || ''} onChange={(e) => { 
            const raw = e.target.value;
            let sliced = raw;
            if (raw && raw.length > 4) {
              sliced = raw.slice(0, 4);
            }
            handleChange('Largo', sliced === '' ? undefined : parseFloat(sliced));
             }} className="w-full h-10 px-3 rounded-md border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-blue/50" max={9999} min={0} step={1} onKeyDown={(e) => { if(['e','E','+','-','.'].includes(e.key)) e.preventDefault(); }} />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700 leading-tight break-words">Ancho</label>
                <input type={'number'} disabled={readonly} value={(formData['Ancho'] as string | number) || ''} onChange={(e) => { 
            const raw = e.target.value;
            let sliced = raw;
            if (raw && raw.length > 4) {
              sliced = raw.slice(0, 4);
            }
            handleChange('Ancho', sliced === '' ? undefined : parseFloat(sliced));
             }} className="w-full h-10 px-3 rounded-md border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-blue/50" max={9999} min={0} step={1} onKeyDown={(e) => { if(['e','E','+','-','.'].includes(e.key)) e.preventDefault(); }} />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700 leading-tight break-words">Altura</label>
                <input type={'number'} disabled={readonly} value={(formData['Altura'] as string | number) || ''} onChange={(e) => { 
            const raw = e.target.value;
            let sliced = raw;
            if (raw && raw.length > 4) {
              sliced = raw.slice(0, 4);
            }
            handleChange('Altura', sliced === '' ? undefined : parseFloat(sliced));
             }} className="w-full h-10 px-3 rounded-md border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-blue/50" max={9999} min={0} step={1} onKeyDown={(e) => { if(['e','E','+','-','.'].includes(e.key)) e.preventDefault(); }} />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700 leading-tight break-words">Distancia Ejes</label>
                <input type={'number'} disabled={readonly} value={(formData['DistanciaEjes'] as string | number) || ''} onChange={(e) => { handleChange('DistanciaEjes', e.target.value === '' ? undefined : parseFloat(e.target.value)); }} className="w-full h-10 px-3 rounded-md border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-blue/50" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700 leading-tight break-words">Peso Orden Marcha</label>
                <input type={'number'} disabled={readonly} value={(formData['PesoOrdenMarcha'] as string | number) || ''} onChange={(e) => { handleChange('PesoOrdenMarcha', e.target.value === '' ? undefined : parseFloat(e.target.value)); }} className="w-full h-10 px-3 rounded-md border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-blue/50" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700 leading-tight break-words">Kg Por H P</label>
                <input type={'number'} disabled={readonly} value={(formData['KgPorHP'] as string | number) || ''} onChange={(e) => { handleChange('KgPorHP', e.target.value === '' ? undefined : parseFloat(e.target.value)); }} className="w-full h-10 px-3 rounded-md border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-blue/50" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700 leading-tight break-words">Neumaticos</label>
                <input type={'text'} disabled={readonly} value={(formData['Neumaticos'] as string | number) || ''} onChange={(e) => { handleChange('Neumaticos', e.target.value); }} className="w-full h-10 px-3 rounded-md border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-blue/50" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700 leading-tight break-words">Llantas Aleacion</label>
                <input type="checkbox" disabled={readonly} checked={(formData['LlantasAleacion'] as boolean) || false} onChange={(e) => handleChange('LlantasAleacion', e.target.checked)} className="w-4 h-4 rounded border-slate-300 text-brand-blue" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700 leading-tight break-words">Diametro Llantas</label>
                <input type={'number'} disabled={readonly} value={(formData['DiametroLlantas'] as string | number) || ''} onChange={(e) => { handleChange('DiametroLlantas', e.target.value === '' ? undefined : parseFloat(e.target.value)); }} className="w-full h-10 px-3 rounded-md border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-blue/50" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700 leading-tight break-words">Numero Puertas</label>
                <input type={'number'} disabled={readonly} value={(formData['NumeroPuertas'] as string | number) || ''} onChange={(e) => { handleChange('NumeroPuertas', e.target.value === '' ? undefined : parseFloat(e.target.value)); }} className="w-full h-10 px-3 rounded-md border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-blue/50" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700 leading-tight break-words">Tiempo Carga</label>
                <input type={'text'} disabled={readonly} value={(formData['TiempoCarga'] as string | number) || ''} onChange={(e) => { handleChange('TiempoCarga', e.target.value); }} className="w-full h-10 px-3 rounded-md border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-blue/50" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700 leading-tight break-words">Cargador Smartphone Induccion</label>
                <input type="checkbox" disabled={readonly} checked={(formData['CargadorSmartphoneInduccion'] as boolean) || false} onChange={(e) => handleChange('CargadorSmartphoneInduccion', e.target.checked)} className="w-4 h-4 rounded border-slate-300 text-brand-blue" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700 leading-tight break-words">Numero Asientos</label>
                <input type={'number'} disabled={readonly} value={(formData['NumeroAsientos'] as string | number) || ''} onChange={(e) => { handleChange('NumeroAsientos', e.target.value === '' ? undefined : parseFloat(e.target.value)); }} className="w-full h-10 px-3 rounded-md border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-blue/50" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700 leading-tight break-words">asientos rango 2 y 3</label>
                <select disabled={readonly} value={(formData['AsientosRango2y3'] as string | number) || ''} onChange={(e) => { handleChange('AsientosRango2y3', e.target.value); }} className="w-full h-10 px-3 rounded-md border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-blue/50 bg-white">
                  <option value="">Seleccionar...</option>
                  <option value="Si">Si</option>
                  <option value="No">No</option>
                </select>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700 leading-tight break-words">Asientos Masajeador</label>
                <input type={'number'} disabled={readonly} value={(formData['AsientosMasajeador'] as string | number) || ''} onChange={(e) => { handleChange('AsientosMasajeador', e.target.value === '' ? undefined : parseFloat(e.target.value)); }} className="w-full h-10 px-3 rounded-md border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-blue/50" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700 leading-tight break-words">Tercera Fila Asientos Electricos</label>
                <input type="checkbox" disabled={readonly} checked={(formData['TerceraFilaAsientosElectricos'] as boolean) || false} onChange={(e) => handleChange('TerceraFilaAsientosElectricos', e.target.checked)} className="w-4 h-4 rounded border-slate-300 text-brand-blue" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700 leading-tight break-words">Tipo Altura Asiento Delantero</label>
                <input type={'text'} disabled={readonly} value={(formData['TipoAlturaAsientoDelantero'] as string | number) || ''} onChange={(e) => { handleChange('TipoAlturaAsientoDelantero', e.target.value); }} className="w-full h-10 px-3 rounded-md border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-blue/50" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700 leading-tight break-words">Capacidad Baul</label>
                <input type={'number'} disabled={readonly} value={(formData['CapacidadBaul'] as string | number) || ''} onChange={(e) => { handleChange('CapacidadBaul', e.target.value === '' ? undefined : parseFloat(e.target.value)); }} className="w-full h-10 px-3 rounded-md border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-blue/50" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700 leading-tight break-words">Capacidad Tanque Combustible</label>
                <input type={'number'} disabled={readonly} value={(formData['CapacidadTanqueCombustible'] as string | number) || ''} onChange={(e) => { handleChange('CapacidadTanqueCombustible', e.target.value === '' ? undefined : parseFloat(e.target.value)); }} className="w-full h-10 px-3 rounded-md border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-blue/50" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700 leading-tight break-words">Num Puertas Laterales</label>
                <input type={'number'} disabled={readonly} value={(formData['NumPuertasLaterales'] as string | number) || ''} onChange={(e) => { handleChange('NumPuertasLaterales', e.target.value === '' ? undefined : parseFloat(e.target.value)); }} className="w-full h-10 px-3 rounded-md border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-blue/50" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700 leading-tight break-words">Carga Util_kg</label>
                <input type={'number'} disabled={readonly} value={(formData['CargaUtil_kg'] as string | number) || ''} onChange={(e) => { handleChange('CargaUtil_kg', e.target.value === '' ? undefined : parseFloat(e.target.value)); }} className="w-full h-10 px-3 rounded-md border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-blue/50" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700 leading-tight break-words">Volumen Util_m3</label>
                <input type={'number'} disabled={readonly} value={(formData['VolumenUtil_m3'] as string | number) || ''} onChange={(e) => { handleChange('VolumenUtil_m3', e.target.value === '' ? undefined : parseFloat(e.target.value)); }} className="w-full h-10 px-3 rounded-md border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-blue/50" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700 leading-tight break-words">Tipo Altura U L</label>
                <input type={'text'} disabled={readonly} value={(formData['TipoAlturaUL'] as string | number) || ''} onChange={(e) => { handleChange('TipoAlturaUL', e.target.value); }} className="w-full h-10 px-3 rounded-md border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-blue/50" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700 leading-tight break-words">Capacidad Carga Camiones</label>
                <input type={'text'} disabled={readonly} value={(formData['CapacidadCargaCamiones'] as string | number) || ''} onChange={(e) => { handleChange('CapacidadCargaCamiones', e.target.value); }} className="w-full h-10 px-3 rounded-md border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-blue/50" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700 leading-tight break-words">Carga Electrica Wireless</label>
                <input type="checkbox" disabled={readonly} checked={(formData['CargaElectricaWireless'] as boolean) || false} onChange={(e) => handleChange('CargaElectricaWireless', e.target.checked)} className="w-4 h-4 rounded border-slate-300 text-brand-blue" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700 leading-tight break-words">Carga Electrica Induccion</label>
                <input type="checkbox" disabled={readonly} checked={(formData['CargaElectricaInduccion'] as boolean) || false} onChange={(e) => handleChange('CargaElectricaInduccion', e.target.checked)} className="w-4 h-4 rounded border-slate-300 text-brand-blue" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700 leading-tight break-words">Asientos deportivos</label>
                <input type="checkbox" disabled={readonly} checked={(formData['AsientosDeportivos'] as boolean) || false} onChange={(e) => handleChange('AsientosDeportivos', e.target.checked)} className="w-4 h-4 rounded border-slate-300 text-brand-blue" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700 leading-tight break-words">Dist. Ejes</label>
                <input type={'number'} disabled={readonly} value={(formData['DistEjes'] as string | number) || ''} onChange={(e) => { 
            const raw = e.target.value;
            let sliced = raw;
            if (raw && raw.length > 4) {
              sliced = raw.slice(0, 4);
            }
            handleChange('DistEjes', sliced === '' ? undefined : parseFloat(sliced));
             }} className="w-full h-10 px-3 rounded-md border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-blue/50" max={9999} min={0} step={1} onKeyDown={(e) => { if(['e','E','+','-','.'].includes(e.key)) e.preventDefault(); }} />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700 leading-tight break-words">Peso en orden de marcha</label>
                <input type={'number'} disabled={readonly} value={(formData['Pesoenordendemarcha'] as string | number) || ''} onChange={(e) => { 
            const raw = e.target.value;
            let sliced = raw;
            if (raw && raw.length > 4) {
              sliced = raw.slice(0, 4);
            }
            handleChange('Pesoenordendemarcha', sliced === '' ? undefined : parseFloat(sliced));
             }} className="w-full h-10 px-3 rounded-md border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-blue/50" max={9999} min={0} step={1} onKeyDown={(e) => { if(['e','E','+','-','.'].includes(e.key)) e.preventDefault(); }} />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700 leading-tight break-words">kg/hp</label>
                <input type={'text'} disabled={readonly} value={(formData['kghp'] as string | number) || ''} onChange={(e) => { handleChange('kghp', e.target.value); }} className="w-full h-10 px-3 rounded-md border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-blue/50" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700 leading-tight break-words">Llantas de aleación</label>
                <input type="checkbox" disabled={readonly} checked={(formData['Llantasdealeacin'] as boolean) || false} onChange={(e) => handleChange('Llantasdealeacin', e.target.checked)} className="w-4 h-4 rounded border-slate-300 text-brand-blue" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700 leading-tight break-words">Diámetro llantas</label>
                <input type={'number'} disabled={readonly} value={(formData['Dimetrollantas'] as string | number) || ''} onChange={(e) => { 
            const raw = e.target.value;
            let sliced = raw;
            if (raw && raw.length > 2) {
              sliced = raw.slice(0, 2);
            }
            handleChange('Dimetrollantas', sliced === '' ? undefined : parseFloat(sliced));
             }} className="w-full h-10 px-3 rounded-md border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-blue/50" max={99} min={0} step={1} onKeyDown={(e) => { if(['e','E','+','-','.'].includes(e.key)) e.preventDefault(); }} />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700 leading-tight break-words">N° de puertas</label>
                <input type={'number'} disabled={readonly} value={(formData['Ndepuertas'] as string | number) || ''} onChange={(e) => { handleChange('Ndepuertas', e.target.value === '' ? undefined : parseFloat(e.target.value)); }} className="w-full h-10 px-3 rounded-md border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-blue/50" step={1} onKeyDown={(e) => { if(['e','E','+','-','.'].includes(e.key)) e.preventDefault(); }} />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700 leading-tight break-words">Cargador Smartphone con inducción</label>
                <input type="checkbox" disabled={readonly} checked={(formData['CargadorSmartphoneconinduccin'] as boolean) || false} onChange={(e) => handleChange('CargadorSmartphoneconinduccin', e.target.checked)} className="w-4 h-4 rounded border-slate-300 text-brand-blue" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700 leading-tight break-words">Número de asientos</label>
                <input type={'number'} disabled={readonly} value={(formData['Nmerodeasientos'] as string | number) || ''} onChange={(e) => { handleChange('Nmerodeasientos', e.target.value === '' ? undefined : parseFloat(e.target.value)); }} className="w-full h-10 px-3 rounded-md border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-blue/50" step={1} onKeyDown={(e) => { if(['e','E','+','-','.'].includes(e.key)) e.preventDefault(); }} />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700 leading-tight break-words">N° Puertas Lat.</label>
                <select disabled={readonly} value={(formData['NPuertasLat'] as string | number) || ''} onChange={(e) => { handleChange('NPuertasLat', e.target.value); }} className="w-full h-10 px-3 rounded-md border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-blue/50 bg-white">
                  <option value="">Seleccionar...</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                </select>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700 leading-tight break-words">Carga útil (Kg)</label>
                <input type={'number'} disabled={readonly} value={(formData['CargatilKg'] as string | number) || ''} onChange={(e) => { handleChange('CargatilKg', e.target.value === '' ? undefined : parseFloat(e.target.value)); }} className="w-full h-10 px-3 rounded-md border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-blue/50" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700 leading-tight break-words">Volumen útil (m3)</label>
                <input type={'number'} disabled={readonly} value={(formData['Volumentilm3'] as string | number) || ''} onChange={(e) => { handleChange('Volumentilm3', e.target.value === '' ? undefined : parseFloat(e.target.value)); }} className="w-full h-10 px-3 rounded-md border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-blue/50" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700 leading-tight break-words">Asientos con masajeador (número)</label>
                <input type={'number'} disabled={readonly} value={(formData['Asientosconmasajeadornmero'] as string | number) || ''} onChange={(e) => { handleChange('Asientosconmasajeadornmero', e.target.value === '' ? undefined : parseFloat(e.target.value)); }} className="w-full h-10 px-3 rounded-md border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-blue/50" step={1} onKeyDown={(e) => { if(['e','E','+','-','.'].includes(e.key)) e.preventDefault(); }} />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700 leading-tight break-words">C_3ra Filadeasientoselctricos</label>
                <input type="checkbox" disabled={readonly} checked={(formData['C_3raFiladeasientoselctricos'] as boolean) || false} onChange={(e) => handleChange('C_3raFiladeasientoselctricos', e.target.checked)} className="w-4 h-4 rounded border-slate-300 text-brand-blue" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700 leading-tight break-words">Carga electrica por wireless</label>
                <input type="checkbox" disabled={readonly} checked={(formData['Cargaelectricaporwireless'] as boolean) || false} onChange={(e) => handleChange('Cargaelectricaporwireless', e.target.checked)} className="w-4 h-4 rounded border-slate-300 text-brand-blue" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700 leading-tight break-words">Carga electrica por induccion</label>
                <input type="checkbox" disabled={readonly} checked={(formData['Cargaelectricaporinduccion'] as boolean) || false} onChange={(e) => handleChange('Cargaelectricaporinduccion', e.target.checked)} className="w-4 h-4 rounded border-slate-300 text-brand-blue" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700 leading-tight break-words">Precio a fecha de carga</label>
                <input type={'number'} disabled={readonly} value={(formData['Precioafechadecarga'] as string | number) || ''} onChange={(e) => { handleChange('Precioafechadecarga', e.target.value === '' ? undefined : parseFloat(e.target.value)); }} className="w-full h-10 px-3 rounded-md border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-blue/50" step={1} onKeyDown={(e) => { if(['e','E','+','-','.'].includes(e.key)) e.preventDefault(); }} />
              </div>
            </div>
          </CardContent>
        </div>
      </Card>
      <Card className="border shadow-sm">
        <div 
          className="flex justify-between items-center p-4 cursor-pointer hover:bg-slate-50 transition-colors"
          onClick={() => toggleSeccion('Mecanica')}
        >
          <h3 className="text-lg font-semibold text-slate-800">Mecanica</h3>
          {seccionesAbiertas['Mecanica'] ? (
            <ChevronUp className="h-5 w-5 text-slate-500" />
          ) : (
            <ChevronDown className="h-5 w-5 text-slate-500" />
          )}
        </div>
        
        <div className={seccionesAbiertas['Mecanica'] ? 'block' : 'hidden'}>
          <CardContent className="pt-0 pb-5">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 px-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700 leading-tight break-words">Cilindros</label>
                <select disabled={readonly} value={(formData['Cilindros'] as string | number) || ''} onChange={(e) => { 
            const raw = e.target.value;
            let sliced = raw;
            if (raw && raw.length > 2) {
              sliced = raw.slice(0, 2);
            }
            handleChange('Cilindros', sliced === '' ? undefined : parseFloat(sliced));
             }} className="w-full h-10 px-3 rounded-md border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-blue/50 bg-white" max={99} min={0} step={1}>
                  <option value="">Seleccionar...</option>
                  <option value="N/A">N/A</option>
                </select>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700 leading-tight break-words">Valvulas</label>
                <input type={'number'} disabled={readonly} value={(formData['Valvulas'] as string | number) || ''} onChange={(e) => { handleChange('Valvulas', e.target.value === '' ? undefined : parseFloat(e.target.value)); }} className="w-full h-10 px-3 rounded-md border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-blue/50" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700 leading-tight break-words">Inyeccion</label>
                <input type={'text'} disabled={readonly} value={(formData['Inyeccion'] as string | number) || ''} onChange={(e) => { handleChange('Inyeccion', e.target.value); }} className="w-full h-10 px-3 rounded-md border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-blue/50" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700 leading-tight break-words">Traccion</label>
                <input type={'text'} disabled={readonly} value={(formData['Traccion'] as string | number) || ''} onChange={(e) => { handleChange('Traccion', e.target.value); }} className="w-full h-10 px-3 rounded-md border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-blue/50" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700 leading-tight break-words">Suspension</label>
                <input type={'text'} disabled={readonly} value={(formData['Suspension'] as string | number) || ''} onChange={(e) => { handleChange('Suspension', e.target.value); }} className="w-full h-10 px-3 rounded-md border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-blue/50" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700 leading-tight break-words">Caja</label>
                <select disabled={readonly} value={(formData['Caja'] as string | number) || ''} onChange={(e) => { handleChange('Caja', e.target.value); }} className="w-full h-10 px-3 rounded-md border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-blue/50 bg-white">
                  <option value="">Seleccionar...</option>
                  <option value="Automática">Automática</option>
                  <option value="Manual">Manual</option>
                </select>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700 leading-tight break-words">Marchas / velocidades</label>
                <input type={'text'} disabled={readonly} value={(formData['MarchasVelocidades'] as string | number) || ''} onChange={(e) => { handleChange('MarchasVelocidades', e.target.value); }} className="w-full h-10 px-3 rounded-md border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-blue/50" step={1} onKeyDown={(e) => { if(['e','E','+','-','.'].includes(e.key)) e.preventDefault(); }} />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700 leading-tight break-words">Turbo</label>
                <input type="checkbox" disabled={readonly} checked={(formData['Turbo'] as boolean) || false} onChange={(e) => handleChange('Turbo', e.target.checked)} className="w-4 h-4 rounded border-slate-300 text-brand-blue" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700 leading-tight break-words">Aceite</label>
                <select disabled={readonly} value={(formData['Aceite'] as string | number) || ''} onChange={(e) => { handleChange('Aceite', e.target.value); }} className="w-full h-10 px-3 rounded-md border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-blue/50 bg-white">
                  <option value="">Seleccionar...</option>
                  <option value="Dejar para escribir">Dejar para escribir</option>
                </select>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700 leading-tight break-words">Norma</label>
                <input type={'text'} disabled={readonly} value={(formData['Norma'] as string | number) || ''} onChange={(e) => { handleChange('Norma', e.target.value); }} className="w-full h-10 px-3 rounded-md border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-blue/50" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700 leading-tight break-words">Start Stop</label>
                <input type="checkbox" disabled={readonly} checked={(formData['StartStop'] as boolean) || false} onChange={(e) => handleChange('StartStop', e.target.checked)} className="w-4 h-4 rounded border-slate-300 text-brand-blue" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700 leading-tight break-words">CO2 (g/Km)</label>
                <input type={'number'} disabled={readonly} value={(formData['CO2_g_km'] as string | number) || ''} onChange={(e) => { handleChange('CO2_g_km', e.target.value === '' ? undefined : parseFloat(e.target.value)); }} className="w-full h-10 px-3 rounded-md border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-blue/50" step={1} onKeyDown={(e) => { if(['e','E','+','-','.'].includes(e.key)) e.preventDefault(); }} />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700 leading-tight break-words">Consumo Ruta</label>
                <input type={'number'} disabled={readonly} value={(formData['ConsumoRuta'] as string | number) || ''} onChange={(e) => { handleChange('ConsumoRuta', e.target.value === '' ? undefined : parseFloat(e.target.value)); }} className="w-full h-10 px-3 rounded-md border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-blue/50" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700 leading-tight break-words">Consumo Urbano</label>
                <input type={'number'} disabled={readonly} value={(formData['ConsumoUrbano'] as string | number) || ''} onChange={(e) => { handleChange('ConsumoUrbano', e.target.value === '' ? undefined : parseFloat(e.target.value)); }} className="w-full h-10 px-3 rounded-md border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-blue/50" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700 leading-tight break-words">Consumo Mixto</label>
                <input type={'number'} disabled={readonly} value={(formData['ConsumoMixto'] as string | number) || ''} onChange={(e) => { handleChange('ConsumoMixto', e.target.value === '' ? undefined : parseFloat(e.target.value)); }} className="w-full h-10 px-3 rounded-md border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-blue/50" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700 leading-tight break-words">Par Motor Torque</label>
                <input type={'number'} disabled={readonly} value={(formData['ParMotorTorque'] as string | number) || ''} onChange={(e) => { handleChange('ParMotorTorque', e.target.value === '' ? undefined : parseFloat(e.target.value)); }} className="w-full h-10 px-3 rounded-md border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-blue/50" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700 leading-tight break-words">DISCOS FRENOS</label>
                <select disabled={readonly} value={(formData['DiscosFrenos'] as string | number) || ''} onChange={(e) => { handleChange('DiscosFrenos', e.target.value); }} className="w-full h-10 px-3 rounded-md border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-blue/50 bg-white">
                  <option value="">Seleccionar...</option>
                  <option value="2">2</option>
                  <option value="4">4</option>
                </select>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700 leading-tight break-words">Freno Estacionamiento Electrico</label>
                <input type="checkbox" disabled={readonly} checked={(formData['FrenoEstacionamientoElectrico'] as boolean) || false} onChange={(e) => handleChange('FrenoEstacionamientoElectrico', e.target.checked)} className="w-4 h-4 rounded border-slate-300 text-brand-blue" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700 leading-tight break-words">Control Traccion</label>
                <input type="checkbox" disabled={readonly} checked={(formData['ControlTraccion'] as boolean) || false} onChange={(e) => handleChange('ControlTraccion', e.target.checked)} className="w-4 h-4 rounded border-slate-300 text-brand-blue" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700 leading-tight break-words">Protector CAJA</label>
                <input type="checkbox" disabled={readonly} checked={(formData['ProtectorCaja'] as boolean) || false} onChange={(e) => handleChange('ProtectorCaja', e.target.checked)} className="w-4 h-4 rounded border-slate-300 text-brand-blue" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700 leading-tight break-words">Freno Peatones</label>
                <input type="checkbox" disabled={readonly} checked={(formData['FrenoPeatones'] as boolean) || false} onChange={(e) => handleChange('FrenoPeatones', e.target.checked)} className="w-4 h-4 rounded border-slate-300 text-brand-blue" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700 leading-tight break-words">Aceleracion BEV 0 a 100</label>
                <input type={'number'} disabled={readonly} value={(formData['AceleracionBEV_0a100'] as string | number) || ''} onChange={(e) => { handleChange('AceleracionBEV_0a100', e.target.value === '' ? undefined : parseFloat(e.target.value)); }} className="w-full h-10 px-3 rounded-md border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-blue/50" step="any" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700 leading-tight break-words">Chassis Drive Select</label>
                <input type="checkbox" disabled={readonly} checked={(formData['ChassisDriveSelect'] as boolean) || false} onChange={(e) => handleChange('ChassisDriveSelect', e.target.checked)} className="w-4 h-4 rounded border-slate-300 text-brand-blue" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700 leading-tight break-words">Chassis Sport Suspension</label>
                <input type="checkbox" disabled={readonly} checked={(formData['ChassisSportSuspension'] as boolean) || false} onChange={(e) => handleChange('ChassisSportSuspension', e.target.checked)} className="w-4 h-4 rounded border-slate-300 text-brand-blue" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700 leading-tight break-words">Consumo ruta (l/100 km)</label>
                <input type={'number'} disabled={readonly} value={(formData['Consumorutal100km'] as string | number) || ''} onChange={(e) => { handleChange('Consumorutal100km', e.target.value === '' ? undefined : parseFloat(e.target.value)); }} className="w-full h-10 px-3 rounded-md border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-blue/50" step="any" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700 leading-tight break-words">Consumo urbano (l/100 km)</label>
                <input type={'number'} disabled={readonly} value={(formData['Consumourbanol100km'] as string | number) || ''} onChange={(e) => { handleChange('Consumourbanol100km', e.target.value === '' ? undefined : parseFloat(e.target.value)); }} className="w-full h-10 px-3 rounded-md border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-blue/50" step="any" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700 leading-tight break-words">Consumo mixto (l/100 km)</label>
                <input type={'number'} disabled={readonly} value={(formData['Consumomixtol100km'] as string | number) || ''} onChange={(e) => { handleChange('Consumomixtol100km', e.target.value === '' ? undefined : parseFloat(e.target.value)); }} className="w-full h-10 px-3 rounded-md border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-blue/50" step="any" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700 leading-tight break-words">Par del Motor - torque (Nm)</label>
                <input type={'number'} disabled={readonly} value={(formData['PardelMotortorqueNm'] as string | number) || ''} onChange={(e) => { handleChange('PardelMotortorqueNm', e.target.value === '' ? undefined : parseFloat(e.target.value)); }} className="w-full h-10 px-3 rounded-md border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-blue/50" step={1} onKeyDown={(e) => { if(['e','E','+','-','.'].includes(e.key)) e.preventDefault(); }} />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700 leading-tight break-words">Freno Estacionamento Electrico (EPB)</label>
                <input type="checkbox" disabled={readonly} checked={(formData['FrenoEstacionamentoElectricoEPB'] as boolean) || false} onChange={(e) => handleChange('FrenoEstacionamentoElectricoEPB', e.target.checked)} className="w-4 h-4 rounded border-slate-300 text-brand-blue" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700 leading-tight break-words">Autonomía del motor eléctrico (BEV y PHEV)</label>
                <input type={'number'} disabled={readonly} value={(formData['AutonomadelmotorelctricoBEVyPHEV'] as string | number) || ''} onChange={(e) => { handleChange('AutonomadelmotorelctricoBEVyPHEV', e.target.value === '' ? undefined : parseFloat(e.target.value)); }} className="w-full h-10 px-3 rounded-md border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-blue/50" step={1} onKeyDown={(e) => { if(['e','E','+','-','.'].includes(e.key)) e.preventDefault(); }} />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700 leading-tight break-words">Freno de peatones</label>
                <input type="checkbox" disabled={readonly} checked={(formData['Frenodepeatones'] as boolean) || false} onChange={(e) => handleChange('Frenodepeatones', e.target.checked)} className="w-4 h-4 rounded border-slate-300 text-brand-blue" />
              </div>
            </div>
          </CardContent>
        </div>
      </Card>
      <Card className="border shadow-sm">
        <div 
          className="flex justify-between items-center p-4 cursor-pointer hover:bg-slate-50 transition-colors"
          onClick={() => toggleSeccion('Equipamiento')}
        >
          <h3 className="text-lg font-semibold text-slate-800">Equipamiento</h3>
          {seccionesAbiertas['Equipamiento'] ? (
            <ChevronUp className="h-5 w-5 text-slate-500" />
          ) : (
            <ChevronDown className="h-5 w-5 text-slate-500" />
          )}
        </div>
        
        <div className={seccionesAbiertas['Equipamiento'] ? 'block' : 'hidden'}>
          <CardContent className="pt-0 pb-5">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 px-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700 leading-tight break-words">T P M S</label>
                <input type="checkbox" disabled={readonly} checked={(formData['TPMS'] as boolean) || false} onChange={(e) => handleChange('TPMS', e.target.checked)} className="w-4 h-4 rounded border-slate-300 text-brand-blue" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700 leading-tight break-words">Kit Inflable AntiPinchazo</label>
                <input type="checkbox" disabled={readonly} checked={(formData['KitInflableAntiPinchazo'] as boolean) || false} onChange={(e) => handleChange('KitInflableAntiPinchazo', e.target.checked)} className="w-4 h-4 rounded border-slate-300 text-brand-blue" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700 leading-tight break-words">Rueda Aux Homogenea</label>
                <input type="checkbox" disabled={readonly} checked={(formData['RuedaAuxHomogenea'] as boolean) || false} onChange={(e) => handleChange('RuedaAuxHomogenea', e.target.checked)} className="w-4 h-4 rounded border-slate-300 text-brand-blue" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700 leading-tight break-words">Garantia Anios</label>
                <input type={'number'} disabled={readonly} value={(formData['GarantiaAnios'] as string | number) || ''} onChange={(e) => { handleChange('GarantiaAnios', e.target.value === '' ? undefined : parseFloat(e.target.value)); }} className="w-full h-10 px-3 rounded-md border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-blue/50" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700 leading-tight break-words">Garantia Km</label>
                <input type={'number'} disabled={readonly} value={(formData['GarantiaKm'] as string | number) || ''} onChange={(e) => { handleChange('GarantiaKm', e.target.value === '' ? undefined : parseFloat(e.target.value)); }} className="w-full h-10 px-3 rounded-md border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-blue/50" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700 leading-tight break-words">Garantias Diferenciales</label>
                <input type={'text'} disabled={readonly} value={(formData['GarantiasDiferenciales'] as string | number) || ''} onChange={(e) => { handleChange('GarantiasDiferenciales', e.target.value); }} className="w-full h-10 px-3 rounded-md border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-blue/50" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700 leading-tight break-words">Autonomia Max Range</label>
                <input type={'number'} disabled={readonly} value={(formData['AutonomiaMaxRange'] as string | number) || ''} onChange={(e) => { handleChange('AutonomiaMaxRange', e.target.value === '' ? undefined : parseFloat(e.target.value)); }} className="w-full h-10 px-3 rounded-md border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-blue/50" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700 leading-tight break-words">Otros Datos</label>
                <input type={'text'} disabled={readonly} value={(formData['OtrosDatos'] as string | number) || ''} onChange={(e) => { handleChange('OtrosDatos', e.target.value); }} className="w-full h-10 px-3 rounded-md border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-blue/50" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700 leading-tight break-words">Codigo Ficha Tecnica</label>
                <input type={'text'} disabled={readonly} value={(formData['CodigoFichaTecnica'] as string | number) || ''} onChange={(e) => { handleChange('CodigoFichaTecnica', e.target.value); }} className="w-full h-10 px-3 rounded-md border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-blue/50" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700 leading-tight break-words">Sistema Climatizacion</label>
                <input type={'text'} disabled={readonly} value={(formData['SistemaClimatizacion'] as string | number) || ''} onChange={(e) => { handleChange('SistemaClimatizacion', e.target.value); }} className="w-full h-10 px-3 rounded-md border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-blue/50" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700 leading-tight break-words">Direccion</label>
                <input type={'text'} disabled={readonly} value={(formData['Direccion'] as string | number) || ''} onChange={(e) => { handleChange('Direccion', e.target.value); }} className="w-full h-10 px-3 rounded-md border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-blue/50" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700 leading-tight break-words">Tipo Bloqueo</label>
                <input type={'text'} disabled={readonly} value={(formData['TipoBloqueo'] as string | number) || ''} onChange={(e) => { handleChange('TipoBloqueo', e.target.value); }} className="w-full h-10 px-3 rounded-md border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-blue/50" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700 leading-tight break-words">Keyless Smart Key</label>
                <input type="checkbox" disabled={readonly} checked={(formData['KeylessSmartKey'] as boolean) || false} onChange={(e) => handleChange('KeylessSmartKey', e.target.checked)} className="w-4 h-4 rounded border-slate-300 text-brand-blue" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700 leading-tight break-words">Levanta vidrios</label>
                <select disabled={readonly} value={(formData['LevantaVidrios'] as string | number) || ''} onChange={(e) => { handleChange('LevantaVidrios', e.target.value); }} className="w-full h-10 px-3 rounded-md border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-blue/50 bg-white">
                  <option value="">Seleccionar...</option>
                  <option value="Manual">Manual</option>
                  <option value="Eléctricos x 2">Eléctricos x 2</option>
                  <option value="Eléctricos x 4">Eléctricos x 4</option>
                  <option value="Eléctricos x 3">Eléctricos x 3</option>
                </select>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700 leading-tight break-words">Espejos Electricos</label>
                <input type="checkbox" disabled={readonly} checked={(formData['EspejosElectricos'] as boolean) || false} onChange={(e) => handleChange('EspejosElectricos', e.target.checked)} className="w-4 h-4 rounded border-slate-300 text-brand-blue" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700 leading-tight break-words">Espejo interior electrocromado</label>
                <input type="checkbox" disabled={readonly} checked={(formData['EspejoInteriorElectrocromado'] as boolean) || false} onChange={(e) => handleChange('EspejoInteriorElectrocromado', e.target.checked)} className="w-4 h-4 rounded border-slate-300 text-brand-blue" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700 leading-tight break-words">Espejos abatibles electricamente</label>
                <input type="checkbox" disabled={readonly} checked={(formData['EspejosAbatiblesElectricamente'] as boolean) || false} onChange={(e) => handleChange('EspejosAbatiblesElectricamente', e.target.checked)} className="w-4 h-4 rounded border-slate-300 text-brand-blue" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700 leading-tight break-words">Tapizado</label>
                <select disabled={readonly} value={(formData['Tapizado'] as string | number) || ''} onChange={(e) => { handleChange('Tapizado', e.target.value); }} className="w-full h-10 px-3 rounded-md border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-blue/50 bg-white">
                  <option value="">Seleccionar...</option>
                  <option value="Textil">Textil</option>
                  <option value="Cuero">Cuero</option>
                  <option value="Simil cuero (CUIR)">Simil cuero (CUIR)</option>
                  <option value="Mixto (tela y  simil cuero)">Mixto (tela y  simil cuero)</option>
                  <option value="Mixto (tela y  cuero)">Mixto (tela y  cuero)</option>
                  <option value="Alcantara">Alcantara</option>
                </select>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700 leading-tight break-words">Volante Revestido Cuero</label>
                <input type="checkbox" disabled={readonly} checked={(formData['VolanteRevestidoCuero'] as boolean) || false} onChange={(e) => handleChange('VolanteRevestidoCuero', e.target.checked)} className="w-4 h-4 rounded border-slate-300 text-brand-blue" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700 leading-tight break-words">Tabler Digital</label>
                <input type="checkbox" disabled={readonly} checked={(formData['TablerDigital'] as boolean) || false} onChange={(e) => handleChange('TablerDigital', e.target.checked)} className="w-4 h-4 rounded border-slate-300 text-brand-blue" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700 leading-tight break-words">Computadora</label>
                <input type="checkbox" disabled={readonly} checked={(formData['Computadora'] as boolean) || false} onChange={(e) => handleChange('Computadora', e.target.checked)} className="w-4 h-4 rounded border-slate-300 text-brand-blue" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700 leading-tight break-words">GPS</label>
                <input type="checkbox" disabled={readonly} checked={(formData['GPS'] as boolean) || false} onChange={(e) => handleChange('GPS', e.target.checked)} className="w-4 h-4 rounded border-slate-300 text-brand-blue" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700 leading-tight break-words">Velocidad Crucero</label>
                <input type="checkbox" disabled={readonly} checked={(formData['VelocidadCrucero'] as boolean) || false} onChange={(e) => handleChange('VelocidadCrucero', e.target.checked)} className="w-4 h-4 rounded border-slate-300 text-brand-blue" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700 leading-tight break-words">Inmovilizador</label>
                <input type="checkbox" disabled={readonly} checked={(formData['Inmovilizador'] as boolean) || false} onChange={(e) => handleChange('Inmovilizador', e.target.checked)} className="w-4 h-4 rounded border-slate-300 text-brand-blue" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700 leading-tight break-words">Alarma</label>
                <input type="checkbox" disabled={readonly} checked={(formData['Alarma'] as boolean) || false} onChange={(e) => handleChange('Alarma', e.target.checked)} className="w-4 h-4 rounded border-slate-300 text-brand-blue" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700 leading-tight break-words">ABAG</label>
                <input type="checkbox" disabled={readonly} checked={(formData['ABAG'] as boolean) || false} onChange={(e) => handleChange('ABAG', e.target.checked)} className="w-4 h-4 rounded border-slate-300 text-brand-blue" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700 leading-tight break-words">S R I</label>
                <input type="checkbox" disabled={readonly} checked={(formData['SRI'] as boolean) || false} onChange={(e) => handleChange('SRI', e.target.checked)} className="w-4 h-4 rounded border-slate-300 text-brand-blue" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700 leading-tight break-words">ABS</label>
                <input type="checkbox" disabled={readonly} checked={(formData['ABS'] as boolean) || false} onChange={(e) => handleChange('ABS', e.target.checked)} className="w-4 h-4 rounded border-slate-300 text-brand-blue" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700 leading-tight break-words">E B D_ E B V_ R E F</label>
                <input type="checkbox" disabled={readonly} checked={(formData['EBD_EBV_REF'] as boolean) || false} onChange={(e) => handleChange('EBD_EBV_REF', e.target.checked)} className="w-4 h-4 rounded border-slate-300 text-brand-blue" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700 leading-tight break-words">ESP Control estabilidad</label>
                <input type="checkbox" disabled={readonly} checked={(formData['ESP_ControlEstabilidad'] as boolean) || false} onChange={(e) => handleChange('ESP_ControlEstabilidad', e.target.checked)} className="w-4 h-4 rounded border-slate-300 text-brand-blue" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700 leading-tight break-words">Asist. frenado detector distancia</label>
                <input type="checkbox" disabled={readonly} checked={(formData['AsistFrenadoDetectorDistancia'] as boolean) || false} onChange={(e) => handleChange('AsistFrenadoDetectorDistancia', e.target.checked)} className="w-4 h-4 rounded border-slate-300 text-brand-blue" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700 leading-tight break-words">Asist. Pendiente</label>
                <input type="checkbox" disabled={readonly} checked={(formData['AsistPendiente'] as boolean) || false} onChange={(e) => handleChange('AsistPendiente', e.target.checked)} className="w-4 h-4 rounded border-slate-300 text-brand-blue" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700 leading-tight break-words">Detector Cambio Fila</label>
                <input type="checkbox" disabled={readonly} checked={(formData['DetectorCambioFila'] as boolean) || false} onChange={(e) => handleChange('DetectorCambioFila', e.target.checked)} className="w-4 h-4 rounded border-slate-300 text-brand-blue" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700 leading-tight break-words">Detector Punto Ciego</label>
                <input type="checkbox" disabled={readonly} checked={(formData['DetectorPuntoCiego'] as boolean) || false} onChange={(e) => handleChange('DetectorPuntoCiego', e.target.checked)} className="w-4 h-4 rounded border-slate-300 text-brand-blue" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700 leading-tight break-words">Traffic Sign recognition</label>
                <input type="checkbox" disabled={readonly} checked={(formData['TrafficSignRecognition'] as boolean) || false} onChange={(e) => handleChange('TrafficSignRecognition', e.target.checked)} className="w-4 h-4 rounded border-slate-300 text-brand-blue" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700 leading-tight break-words">Driver attention control</label>
                <input type="checkbox" disabled={readonly} checked={(formData['DriverAttentionControl'] as boolean) || false} onChange={(e) => handleChange('DriverAttentionControl', e.target.checked)} className="w-4 h-4 rounded border-slate-300 text-brand-blue" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700 leading-tight break-words">Detector lluvia</label>
                <input type="checkbox" disabled={readonly} checked={(formData['DetectorLluvia'] as boolean) || false} onChange={(e) => handleChange('DetectorLluvia', e.target.checked)} className="w-4 h-4 rounded border-slate-300 text-brand-blue" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700 leading-tight break-words">Grip Control</label>
                <input type="checkbox" disabled={readonly} checked={(formData['GripControl'] as boolean) || false} onChange={(e) => handleChange('GripControl', e.target.checked)} className="w-4 h-4 rounded border-slate-300 text-brand-blue" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700 leading-tight break-words">Limitador Velocidad</label>
                <input type="checkbox" disabled={readonly} checked={(formData['LimitadorVelocidad'] as boolean) || false} onChange={(e) => handleChange('LimitadorVelocidad', e.target.checked)} className="w-4 h-4 rounded border-slate-300 text-brand-blue" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700 leading-tight break-words">Asist. Descenso (HDC)</label>
                <input type="checkbox" disabled={readonly} checked={(formData['AsistDescensoHDC'] as boolean) || false} onChange={(e) => handleChange('AsistDescensoHDC', e.target.checked)} className="w-4 h-4 rounded border-slate-300 text-brand-blue" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700 leading-tight break-words">Paddle Shift</label>
                <input type="checkbox" disabled={readonly} checked={(formData['PaddleShift'] as boolean) || false} onChange={(e) => handleChange('PaddleShift', e.target.checked)} className="w-4 h-4 rounded border-slate-300 text-brand-blue" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700 leading-tight break-words">Comando Audio Volante</label>
                <input type="checkbox" disabled={readonly} checked={(formData['ComandoAudioVolante'] as boolean) || false} onChange={(e) => handleChange('ComandoAudioVolante', e.target.checked)} className="w-4 h-4 rounded border-slate-300 text-brand-blue" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700 leading-tight break-words">CD</label>
                <input type="checkbox" disabled={readonly} checked={(formData['CD'] as boolean) || false} onChange={(e) => handleChange('CD', e.target.checked)} className="w-4 h-4 rounded border-slate-300 text-brand-blue" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700 leading-tight break-words">MP3</label>
                <input type="checkbox" disabled={readonly} checked={(formData['MP3'] as boolean) || false} onChange={(e) => handleChange('MP3', e.target.checked)} className="w-4 h-4 rounded border-slate-300 text-brand-blue" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700 leading-tight break-words">USB</label>
                <input type="checkbox" disabled={readonly} checked={(formData['USB'] as boolean) || false} onChange={(e) => handleChange('USB', e.target.checked)} className="w-4 h-4 rounded border-slate-300 text-brand-blue" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700 leading-tight break-words">Bluetooth</label>
                <input type="checkbox" disabled={readonly} checked={(formData['Bluetooth'] as boolean) || false} onChange={(e) => handleChange('Bluetooth', e.target.checked)} className="w-4 h-4 rounded border-slate-300 text-brand-blue" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700 leading-tight break-words">DVD</label>
                <input type="checkbox" disabled={readonly} checked={(formData['DVD'] as boolean) || false} onChange={(e) => handleChange('DVD', e.target.checked)} className="w-4 h-4 rounded border-slate-300 text-brand-blue" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700 leading-tight break-words">Mirror Screen</label>
                <input type="checkbox" disabled={readonly} checked={(formData['MirrorScreen'] as boolean) || false} onChange={(e) => handleChange('MirrorScreen', e.target.checked)} className="w-4 h-4 rounded border-slate-300 text-brand-blue" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700 leading-tight break-words">Sistema Multimedia</label>
                <input type="text" list="SistemaMultimedia_list" disabled={readonly} value={(formData['SistemaMultimedia'] as string | number) || ''} onChange={(e) => { handleChange('SistemaMultimedia', e.target.value); }} className="w-full h-10 px-3 rounded-md border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-blue/50" />
                <datalist id="SistemaMultimedia_list">
                  <option value="Composition Media" />
                  <option value="Full Link" />
                  <option value="Media Nav" />
                  <option value="Media Sistem" />
                  <option value="Mirror Link" />
                  <option value="Touch Infotainment" />
                  <option value="Nissan door-to-door" />
                  <option value="R-Link Evolution" />
                </datalist>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700 leading-tight break-words">Pantalla Multimedia Pulgadas</label>
                <input type={'number'} disabled={readonly} value={(formData['PantallaMultimediaPulgadas'] as string | number) || ''} onChange={(e) => { handleChange('PantallaMultimediaPulgadas', e.target.value === '' ? undefined : parseFloat(e.target.value)); }} className="w-full h-10 px-3 rounded-md border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-blue/50" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700 leading-tight break-words">Pantalla Tactil</label>
                <input type="checkbox" disabled={readonly} checked={(formData['PantallaTactil'] as boolean) || false} onChange={(e) => handleChange('PantallaTactil', e.target.checked)} className="w-4 h-4 rounded border-slate-300 text-brand-blue" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700 leading-tight break-words">Kit Hi Fi</label>
                <input type={'text'} disabled={readonly} value={(formData['KitHiFi'] as string | number) || ''} onChange={(e) => { handleChange('KitHiFi', e.target.value); }} className="w-full h-10 px-3 rounded-md border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-blue/50" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700 leading-tight break-words">Radio</label>
                <input type="checkbox" disabled={readonly} checked={(formData['Radio'] as boolean) || false} onChange={(e) => handleChange('Radio', e.target.checked)} className="w-4 h-4 rounded border-slate-300 text-brand-blue" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700 leading-tight break-words">Asiento Electrico Calef Masaje</label>
                <input type="checkbox" disabled={readonly} checked={(formData['AsientoElectricoCalefMasaje'] as boolean) || false} onChange={(e) => handleChange('AsientoElectricoCalefMasaje', e.target.checked)} className="w-4 h-4 rounded border-slate-300 text-brand-blue" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700 leading-tight break-words">Asiento2 Mas1</label>
                <input type="checkbox" disabled={readonly} checked={(formData['Asiento2Mas1'] as boolean) || false} onChange={(e) => handleChange('Asiento2Mas1', e.target.checked)} className="w-4 h-4 rounded border-slate-300 text-brand-blue" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700 leading-tight break-words">Butaca Electrica</label>
                <input type="checkbox" disabled={readonly} checked={(formData['ButacaElectrica'] as boolean) || false} onChange={(e) => handleChange('ButacaElectrica', e.target.checked)} className="w-4 h-4 rounded border-slate-300 text-brand-blue" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700 leading-tight break-words">Asiento ventilado</label>
                <input type="checkbox" disabled={readonly} checked={(formData['AsientoVentilado'] as boolean) || false} onChange={(e) => handleChange('AsientoVentilado', e.target.checked)} className="w-4 h-4 rounded border-slate-300 text-brand-blue" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700 leading-tight break-words">Apoyabrazos Delantero</label>
                <input type="checkbox" disabled={readonly} checked={(formData['ApoyabrazosDelantero'] as boolean) || false} onChange={(e) => handleChange('ApoyabrazosDelantero', e.target.checked)} className="w-4 h-4 rounded border-slate-300 text-brand-blue" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700 leading-tight break-words">Apoyabrazos Central Trasero</label>
                <input type="checkbox" disabled={readonly} checked={(formData['ApoyabrazosCentralTrasero'] as boolean) || false} onChange={(e) => handleChange('ApoyabrazosCentralTrasero', e.target.checked)} className="w-4 h-4 rounded border-slate-300 text-brand-blue" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700 leading-tight break-words">Soporte Muslo Delantero</label>
                <input type="checkbox" disabled={readonly} checked={(formData['SoporteMusloDelantero'] as boolean) || false} onChange={(e) => handleChange('SoporteMusloDelantero', e.target.checked)} className="w-4 h-4 rounded border-slate-300 text-brand-blue" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700 leading-tight break-words">Asiento Trasero Ajuste Electrico</label>
                <input type="checkbox" disabled={readonly} checked={(formData['AsientoTraseroAjusteElectrico'] as boolean) || false} onChange={(e) => handleChange('AsientoTraseroAjusteElectrico', e.target.checked)} className="w-4 h-4 rounded border-slate-300 text-brand-blue" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700 leading-tight break-words">Seat adjustment, memory (Driver)</label>
                <input type="checkbox" disabled={readonly} checked={(formData['SeatAdjustmentMemoryDriver'] as boolean) || false} onChange={(e) => handleChange('SeatAdjustmentMemoryDriver', e.target.checked)} className="w-4 h-4 rounded border-slate-300 text-brand-blue" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700 leading-tight break-words">Seat adjustment, memory (Co-Driver)</label>
                <input type="checkbox" disabled={readonly} checked={(formData['SeatAdjustmentMemoryCoDriver'] as boolean) || false} onChange={(e) => handleChange('SeatAdjustmentMemoryCoDriver', e.target.checked)} className="w-4 h-4 rounded border-slate-300 text-brand-blue" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700 leading-tight break-words">Lumbar Adjustment Front Driver</label>
                <input type="checkbox" disabled={readonly} checked={(formData['LumbarAdjustmentFrontDriver'] as boolean) || false} onChange={(e) => handleChange('LumbarAdjustmentFrontDriver', e.target.checked)} className="w-4 h-4 rounded border-slate-300 text-brand-blue" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700 leading-tight break-words">Lumbar Adjustment Front Co Driver</label>
                <input type="checkbox" disabled={readonly} checked={(formData['LumbarAdjustmentFrontCoDriver'] as boolean) || false} onChange={(e) => handleChange('LumbarAdjustmentFrontCoDriver', e.target.checked)} className="w-4 h-4 rounded border-slate-300 text-brand-blue" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700 leading-tight break-words">Seat heating, rear</label>
                <input type="checkbox" disabled={readonly} checked={(formData['SeatHeatingRear'] as boolean) || false} onChange={(e) => handleChange('SeatHeatingRear', e.target.checked)} className="w-4 h-4 rounded border-slate-300 text-brand-blue" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700 leading-tight break-words">Techo</label>
                <select disabled={readonly} value={(formData['Techo'] as string | number) || ''} onChange={(e) => { handleChange('Techo', e.target.value); }} className="w-full h-10 px-3 rounded-md border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-blue/50 bg-white">
                  <option value="">Seleccionar...</option>
                  <option value="Techo Panorámico">Techo Panorámico</option>
                  <option value="Techo corredizo manual">Techo corredizo manual</option>
                  <option value="Techo corredizo eléctrico">Techo corredizo eléctrico</option>
                  <option value="Lona plegable">Lona plegable</option>
                  <option value="Rígido / Lona plegable">Rígido / Lona plegable</option>
                  <option value="No">No</option>
                </select>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700 leading-tight break-words">Techo Bi-tono</label>
                <input type="checkbox" disabled={readonly} checked={(formData['TechoBiTono'] as boolean) || false} onChange={(e) => handleChange('TechoBiTono', e.target.checked)} className="w-4 h-4 rounded border-slate-300 text-brand-blue" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700 leading-tight break-words">Barras Techo</label>
                <input type="checkbox" disabled={readonly} checked={(formData['BarrasTecho'] as boolean) || false} onChange={(e) => handleChange('BarrasTecho', e.target.checked)} className="w-4 h-4 rounded border-slate-300 text-brand-blue" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700 leading-tight break-words">Numero Techos Que Se Abren</label>
                <input type={'number'} disabled={readonly} value={(formData['NumeroTechosQueSeAbren'] as string | number) || ''} onChange={(e) => { handleChange('NumeroTechosQueSeAbren', e.target.value === '' ? undefined : parseFloat(e.target.value)); }} className="w-full h-10 px-3 rounded-md border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-blue/50" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700 leading-tight break-words">Sensor estacionamiento</label>
                <select disabled={readonly} value={(formData['SensorEstacionamiento'] as string | number) || ''} onChange={(e) => { handleChange('SensorEstacionamiento', e.target.value); }} className="w-full h-10 px-3 rounded-md border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-blue/50 bg-white">
                  <option value="">Seleccionar...</option>
                  <option value="Trasero">Trasero</option>
                  <option value="Trasero y delantero">Trasero y delantero</option>
                  <option value="No">No</option>
                </select>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700 leading-tight break-words">Camara</label>
                <input type={'text'} disabled={readonly} value={(formData['Camara'] as string | number) || ''} onChange={(e) => { handleChange('Camara', e.target.value); }} className="w-full h-10 px-3 rounded-md border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-blue/50" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700 leading-tight break-words">Sistema Automatico Estacionamiento</label>
                <input type="checkbox" disabled={readonly} checked={(formData['SistemaAutomaticoEstacionamiento'] as boolean) || false} onChange={(e) => handleChange('SistemaAutomaticoEstacionamiento', e.target.checked)} className="w-4 h-4 rounded border-slate-300 text-brand-blue" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700 leading-tight break-words">Faros Neblina</label>
                <input type="checkbox" disabled={readonly} checked={(formData['FarosNeblina'] as boolean) || false} onChange={(e) => handleChange('FarosNeblina', e.target.checked)} className="w-4 h-4 rounded border-slate-300 text-brand-blue" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700 leading-tight break-words">Faros direccionales</label>
                <input type="checkbox" disabled={readonly} checked={(formData['FarosDireccionales'] as boolean) || false} onChange={(e) => handleChange('FarosDireccionales', e.target.checked)} className="w-4 h-4 rounded border-slate-300 text-brand-blue" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700 leading-tight break-words">Faros full LED</label>
                <input type="checkbox" disabled={readonly} checked={(formData['FarosFullLED'] as boolean) || false} onChange={(e) => handleChange('FarosFullLED', e.target.checked)} className="w-4 h-4 rounded border-slate-300 text-brand-blue" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700 leading-tight break-words">Faros Halogenos D R L_ L E D</label>
                <input type="checkbox" disabled={readonly} checked={(formData['FarosHalogenosDRL_LED'] as boolean) || false} onChange={(e) => handleChange('FarosHalogenosDRL_LED', e.target.checked)} className="w-4 h-4 rounded border-slate-300 text-brand-blue" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700 leading-tight break-words">Faros Xenon Limpiadores</label>
                <input type="checkbox" disabled={readonly} checked={(formData['FarosXenonLimpiadores'] as boolean) || false} onChange={(e) => handleChange('FarosXenonLimpiadores', e.target.checked)} className="w-4 h-4 rounded border-slate-300 text-brand-blue" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700 leading-tight break-words">Pack Visibilidad</label>
                <input type="checkbox" disabled={readonly} checked={(formData['PackVisibilidad'] as boolean) || false} onChange={(e) => handleChange('PackVisibilidad', e.target.checked)} className="w-4 h-4 rounded border-slate-300 text-brand-blue" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700 leading-tight break-words">Paso Luces Cruz Ruta Automatica</label>
                <input type="checkbox" disabled={readonly} checked={(formData['PasoLucesCruzRutaAutomatica'] as boolean) || false} onChange={(e) => handleChange('PasoLucesCruzRutaAutomatica', e.target.checked)} className="w-4 h-4 rounded border-slate-300 text-brand-blue" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700 leading-tight break-words">Vision Nocturna</label>
                <input type="checkbox" disabled={readonly} checked={(formData['VisionNocturna'] as boolean) || false} onChange={(e) => handleChange('VisionNocturna', e.target.checked)} className="w-4 h-4 rounded border-slate-300 text-brand-blue" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700 leading-tight break-words">Faros Matrix</label>
                <input type="checkbox" disabled={readonly} checked={(formData['FarosMatrix'] as boolean) || false} onChange={(e) => handleChange('FarosMatrix', e.target.checked)} className="w-4 h-4 rounded border-slate-300 text-brand-blue" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700 leading-tight break-words">Luces traseras led</label>
                <input type="checkbox" disabled={readonly} checked={(formData['LucesTraserasLED'] as boolean) || false} onChange={(e) => handleChange('LucesTraserasLED', e.target.checked)} className="w-4 h-4 rounded border-slate-300 text-brand-blue" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700 leading-tight break-words">Luces Traseras O L E D</label>
                <input type="checkbox" disabled={readonly} checked={(formData['LucesTraserasOLED'] as boolean) || false} onChange={(e) => handleChange('LucesTraserasOLED', e.target.checked)} className="w-4 h-4 rounded border-slate-300 text-brand-blue" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700 leading-tight break-words">Maletera Apertura Electrica</label>
                <input type="checkbox" disabled={readonly} checked={(formData['MaleteraAperturaElectrica'] as boolean) || false} onChange={(e) => handleChange('MaleteraAperturaElectrica', e.target.checked)} className="w-4 h-4 rounded border-slate-300 text-brand-blue" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700 leading-tight break-words">Particion Cabina</label>
                <input type="checkbox" disabled={readonly} checked={(formData['ParticionCabina'] as boolean) || false} onChange={(e) => handleChange('ParticionCabina', e.target.checked)} className="w-4 h-4 rounded border-slate-300 text-brand-blue" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700 leading-tight break-words">Puerta Lateral Electrica</label>
                <input type="checkbox" disabled={readonly} checked={(formData['PuertaLateralElectrica'] as boolean) || false} onChange={(e) => handleChange('PuertaLateralElectrica', e.target.checked)} className="w-4 h-4 rounded border-slate-300 text-brand-blue" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700 leading-tight break-words">Alerta Trafico Cruzado Trasero</label>
                <input type="checkbox" disabled={readonly} checked={(formData['AlertaTraficoCruzadoTrasero'] as boolean) || false} onChange={(e) => handleChange('AlertaTraficoCruzadoTrasero', e.target.checked)} className="w-4 h-4 rounded border-slate-300 text-brand-blue" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700 leading-tight break-words">Alerta Trafico Cruzado Frontal</label>
                <input type="checkbox" disabled={readonly} checked={(formData['AlertaTraficoCruzadoFrontal'] as boolean) || false} onChange={(e) => handleChange('AlertaTraficoCruzadoFrontal', e.target.checked)} className="w-4 h-4 rounded border-slate-300 text-brand-blue" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700 leading-tight break-words">Frenado Multicolision</label>
                <input type="checkbox" disabled={readonly} checked={(formData['FrenadoMulticolision'] as boolean) || false} onChange={(e) => handleChange('FrenadoMulticolision', e.target.checked)} className="w-4 h-4 rounded border-slate-300 text-brand-blue" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700 leading-tight break-words">Head-Up Display</label>
                <input type="checkbox" disabled={readonly} checked={(formData['HeadUpDisplay'] as boolean) || false} onChange={(e) => handleChange('HeadUpDisplay', e.target.checked)} className="w-4 h-4 rounded border-slate-300 text-brand-blue" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700 leading-tight break-words">City Stop</label>
                <input type="checkbox" disabled={readonly} checked={(formData['CityStop'] as boolean) || false} onChange={(e) => handleChange('CityStop', e.target.checked)} className="w-4 h-4 rounded border-slate-300 text-brand-blue" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700 leading-tight break-words">Bloque Diferencial Terreno</label>
                <select disabled={readonly} value={(formData['BloqueDiferencialTerreno'] as string | number) || ''} onChange={(e) => { handleChange('BloqueDiferencialTerreno', e.target.value); }} className="w-full h-10 px-3 rounded-md border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-blue/50 bg-white">
                  <option value="">Seleccionar...</option>
                  <option value="Si">Si</option>
                  <option value="No">No</option>
                </select>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700 leading-tight break-words">Desempaniador Electrico</label>
                <input type="checkbox" disabled={readonly} checked={(formData['DesempaniadorElectrico'] as boolean) || false} onChange={(e) => handleChange('DesempaniadorElectrico', e.target.checked)} className="w-4 h-4 rounded border-slate-300 text-brand-blue" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700 leading-tight break-words">Iluminacion Ambiental</label>
                <input type="checkbox" disabled={readonly} checked={(formData['IluminacionAmbiental'] as boolean) || false} onChange={(e) => handleChange('IluminacionAmbiental', e.target.checked)} className="w-4 h-4 rounded border-slate-300 text-brand-blue" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700 leading-tight break-words">Limpia Lava Parabrisas Trasero</label>
                <input type="checkbox" disabled={readonly} checked={(formData['LimpiaLavaParabrisasTrasero'] as boolean) || false} onChange={(e) => handleChange('LimpiaLavaParabrisasTrasero', e.target.checked)} className="w-4 h-4 rounded border-slate-300 text-brand-blue" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700 leading-tight break-words">Black Wheel Frame</label>
                <input type="checkbox" disabled={readonly} checked={(formData['BlackWheelFrame'] as boolean) || false} onChange={(e) => handleChange('BlackWheelFrame', e.target.checked)} className="w-4 h-4 rounded border-slate-300 text-brand-blue" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700 leading-tight break-words">Volante Multifuncion</label>
                <input type="checkbox" disabled={readonly} checked={(formData['VolanteMultifuncion'] as boolean) || false} onChange={(e) => handleChange('VolanteMultifuncion', e.target.checked)} className="w-4 h-4 rounded border-slate-300 text-brand-blue" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700 leading-tight break-words">Tabler Digital3 D</label>
                <input type="checkbox" disabled={readonly} checked={(formData['TablerDigital3D'] as boolean) || false} onChange={(e) => handleChange('TablerDigital3D', e.target.checked)} className="w-4 h-4 rounded border-slate-300 text-brand-blue" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700 leading-tight break-words">Acceleration ICE</label>
                <input type={'number'} disabled={readonly} value={(formData['AccelerationICE'] as string | number) || ''} onChange={(e) => { handleChange('AccelerationICE', e.target.value === '' ? undefined : parseFloat(e.target.value)); }} className="w-full h-10 px-3 rounded-md border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-blue/50" step="any" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700 leading-tight break-words">Cable electrico tipo 3 incluido</label>
                <input type="checkbox" disabled={readonly} checked={(formData['CableElectricoTipo3Incluido'] as boolean) || false} onChange={(e) => handleChange('CableElectricoTipo3Incluido', e.target.checked)} className="w-4 h-4 rounded border-slate-300 text-brand-blue" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700 leading-tight break-words">Direccion Cuatro Ruedas</label>
                <input type="checkbox" disabled={readonly} checked={(formData['DireccionCuatroRuedas'] as boolean) || false} onChange={(e) => handleChange('DireccionCuatroRuedas', e.target.checked)} className="w-4 h-4 rounded border-slate-300 text-brand-blue" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700 leading-tight break-words">Luces Laser</label>
                <input type="checkbox" disabled={readonly} checked={(formData['LucesLaser'] as boolean) || false} onChange={(e) => handleChange('LucesLaser', e.target.checked)} className="w-4 h-4 rounded border-slate-300 text-brand-blue" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700 leading-tight break-words">Dashboard display configurable</label>
                <input type="checkbox" disabled={readonly} checked={(formData['DashboardDisplayConfigurable'] as boolean) || false} onChange={(e) => handleChange('DashboardDisplayConfigurable', e.target.checked)} className="w-4 h-4 rounded border-slate-300 text-brand-blue" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700 leading-tight break-words">Wireless Smartphone integration</label>
                <input type="checkbox" disabled={readonly} checked={(formData['WirelessSmartphoneIntegration'] as boolean) || false} onChange={(e) => handleChange('WirelessSmartphoneIntegration', e.target.checked)} className="w-4 h-4 rounded border-slate-300 text-brand-blue" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700 leading-tight break-words">Mobile phone Antenna</label>
                <input type="checkbox" disabled={readonly} checked={(formData['MobilePhoneAntenna'] as boolean) || false} onChange={(e) => handleChange('MobilePhoneAntenna', e.target.checked)} className="w-4 h-4 rounded border-slate-300 text-brand-blue" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700 leading-tight break-words">Deflector Viento</label>
                <input type="checkbox" disabled={readonly} checked={(formData['DeflectorViento'] as boolean) || false} onChange={(e) => handleChange('DeflectorViento', e.target.checked)} className="w-4 h-4 rounded border-slate-300 text-brand-blue" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700 leading-tight break-words">TIPO2 - Carrocería</label>
                <input type="text" list="TIPO2Carrocera_list" disabled={readonly} value={(formData['TIPO2Carrocera'] as string | number) || ''} onChange={(e) => { handleChange('TIPO2Carrocera', e.target.value); }} className="w-full h-10 px-3 rounded-md border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-blue/50" />
                <datalist id="TIPO2Carrocera_list">
                  <option value="BOX" />
                  <option value="Cab. Extendida" />
                  <option value="Cabrio" />
                  <option value="CAMION" />
                  <option value="Chasis Cab." />
                  <option value="City Car" />
                  <option value="Coupé " />
                  <option value="DC" />
                  <option value="FURGON" />
                  <option value="Hatch" />
                  <option value="Minibus" />
                  <option value="Omnibus" />
                  <option value="PUP" />
                  <option value="Rural" />
                  <option value="Sedán" />
                  <option value="SUV" />
                </datalist>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700 leading-tight break-words">ORIGEN</label>
                <input type={'text'} disabled={readonly} value={(formData['ORIGEN'] as string | number) || ''} onChange={(e) => { handleChange('ORIGEN', e.target.value.replace(/[^A-Za-z]/g, '').toUpperCase()); }} className="w-full h-10 px-3 rounded-md border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-blue/50" maxLength={3} pattern="^[A-Z]*$" title="2 ó 3 letras en mayúsculas" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700 leading-tight break-words">COMBUSTIBLE</label>
                <select disabled={readonly} value={(formData['COMBUSTIBLE'] as string | number) || ''} onChange={(e) => { handleChange('COMBUSTIBLE', e.target.value); }} className="w-full h-10 px-3 rounded-md border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-blue/50 bg-white">
                  <option value="">Seleccionar...</option>
                  <option value="DIESEL">DIESEL</option>
                  <option value="ELECTRICO">ELECTRICO</option>
                  <option value="NAFTA">NAFTA</option>
                </select>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700 leading-tight break-words">Neumáticos</label>
                <input type={'number'} disabled={readonly} value={(formData['Neumticos'] as string | number) || ''} onChange={(e) => { handleChange('Neumticos', e.target.value === '' ? undefined : parseFloat(e.target.value)); }} className="w-full h-10 px-3 rounded-md border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-blue/50" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700 leading-tight break-words">TPMS Monitoreo presión de neumáticos</label>
                <input type="checkbox" disabled={readonly} checked={(formData['TPMSMonitoreopresindeneumticos'] as boolean) || false} onChange={(e) => handleChange('TPMSMonitoreopresindeneumticos', e.target.checked)} className="w-4 h-4 rounded border-slate-300 text-brand-blue" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700 leading-tight break-words">Rueda aux. homogeneo</label>
                <input type="checkbox" disabled={readonly} checked={(formData['Ruedaauxhomogeneo'] as boolean) || false} onChange={(e) => handleChange('Ruedaauxhomogeneo', e.target.checked)} className="w-4 h-4 rounded border-slate-300 text-brand-blue" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700 leading-tight break-words">Válvulas</label>
                <select disabled={readonly} value={(formData['Vlvulas'] as string | number) || ''} onChange={(e) => { 
            const raw = e.target.value;
            let sliced = raw;
            if (raw && raw.length > 2) {
              sliced = raw.slice(0, 2);
            }
            handleChange('Vlvulas', sliced === '' ? undefined : parseFloat(sliced));
             }} className="w-full h-10 px-3 rounded-md border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-blue/50 bg-white" max={99} min={0} step={1}>
                  <option value="">Seleccionar...</option>
                  <option value="N/A">N/A</option>
                </select>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700 leading-tight break-words">HP - CV</label>
                <input type={'number'} disabled={readonly} value={(formData['HPCV'] as string | number) || ''} onChange={(e) => { 
            const raw = e.target.value;
            let sliced = raw;
            if (raw && raw.length > 4) {
              sliced = raw.slice(0, 4);
            }
            handleChange('HPCV', sliced === '' ? undefined : parseFloat(sliced));
             }} className="w-full h-10 px-3 rounded-md border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-blue/50" max={9999} min={0} step={1} onKeyDown={(e) => { if(['e','E','+','-','.'].includes(e.key)) e.preventDefault(); }} />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700 leading-tight break-words">Iny.</label>
                <select disabled={readonly} value={(formData['Iny'] as string | number) || ''} onChange={(e) => { handleChange('Iny', e.target.value); }} className="w-full h-10 px-3 rounded-md border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-blue/50 bg-white">
                  <option value="">Seleccionar...</option>
                  <option value="Directa">Directa</option>
                  <option value="Common Rail ">Common Rail </option>
                  <option value="Electrónica">Electrónica</option>
                  <option value="Multipunto">Multipunto</option>
                  <option value="N/A">N/A</option>
                </select>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700 leading-tight break-words">Tracción</label>
                <select disabled={readonly} value={(formData['Traccin'] as string | number) || ''} onChange={(e) => { handleChange('Traccin', e.target.value); }} className="w-full h-10 px-3 rounded-md border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-blue/50 bg-white">
                  <option value="">Seleccionar...</option>
                  <option value="4x2">4x2</option>
                  <option value="4x4">4x4</option>
                </select>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700 leading-tight break-words">Suspensión</label>
                <input type="text" list="Suspensin_list" disabled={readonly} value={(formData['Suspensin'] as string | number) || ''} onChange={(e) => { handleChange('Suspensin', e.target.value); }} className="w-full h-10 px-3 rounded-md border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-blue/50" />
                <datalist id="Suspensin_list">
                  <option value="McPherson /Multilink" />
                  <option value="Independiente" />
                  <option value="Independiente/barra de torsión" />
                  <option value="McPherson/barra estabilizadora" />
                  <option value="Neumática" />
                </datalist>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700 leading-tight break-words">Garantía en años</label>
                <input type={'number'} disabled={readonly} value={(formData['Garantaenaos'] as string | number) || ''} onChange={(e) => { handleChange('Garantaenaos', e.target.value === '' ? undefined : parseFloat(e.target.value)); }} className="w-full h-10 px-3 rounded-md border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-blue/50" step={1} onKeyDown={(e) => { if(['e','E','+','-','.'].includes(e.key)) e.preventDefault(); }} />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700 leading-tight break-words">Garantía en Km</label>
                <input type={'number'} disabled={readonly} value={(formData['GarantaenKm'] as string | number) || ''} onChange={(e) => { handleChange('GarantaenKm', e.target.value === '' ? undefined : parseFloat(e.target.value)); }} className="w-full h-10 px-3 rounded-md border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-blue/50" step={1} onKeyDown={(e) => { if(['e','E','+','-','.'].includes(e.key)) e.preventDefault(); }} />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700 leading-tight break-words">Garantías diferenciales</label>
                <input type="checkbox" disabled={readonly} checked={(formData['Garantasdiferenciales'] as boolean) || false} onChange={(e) => handleChange('Garantasdiferenciales', e.target.checked)} className="w-4 h-4 rounded border-slate-300 text-brand-blue" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700 leading-tight break-words">Garantía cap. Bat.</label>
                <select disabled={readonly} value={(formData['GarantacapBat'] as string | number) || ''} onChange={(e) => { handleChange('GarantacapBat', e.target.value === '' ? undefined : parseFloat(e.target.value)); }} className="w-full h-10 px-3 rounded-md border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-blue/50 bg-white">
                  <option value="">Seleccionar...</option>
                  <option value="N/A">N/A</option>
                </select>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700 leading-tight break-words">Tecnología Bat. (materiales)</label>
                <select disabled={readonly} value={(formData['TecnologaBatmateriales'] as string | number) || ''} onChange={(e) => { handleChange('TecnologaBatmateriales', e.target.value); }} className="w-full h-10 px-3 rounded-md border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-blue/50 bg-white">
                  <option value="">Seleccionar...</option>
                  <option value="Ion litio">Ion litio</option>
                  <option value="LFP (litio-ferro-fosfato)">LFP (litio-ferro-fosfato)</option>
                  <option value="NCM (níquel-cobalto-manganeso)">NCM (níquel-cobalto-manganeso)</option>
                  <option value="Plomo">Plomo</option>
                  <option value="Gel">Gel</option>
                  <option value="N/A">N/A</option>
                </select>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700 leading-tight break-words">Sistema de climatización</label>
                <select disabled={readonly} value={(formData['Sistemadeclimatizacin'] as string | number) || ''} onChange={(e) => { handleChange('Sistemadeclimatizacin', e.target.value); }} className="w-full h-10 px-3 rounded-md border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-blue/50 bg-white">
                  <option value="">Seleccionar...</option>
                  <option value="No">No</option>
                  <option value="Aire acondicionado">Aire acondicionado</option>
                  <option value="Aire acondicionado con salida trasera">Aire acondicionado con salida trasera</option>
                  <option value="Climatizador">Climatizador</option>
                  <option value="Climatizador con salida trasera">Climatizador con salida trasera</option>
                  <option value="Climatizador bi zona">Climatizador bi zona</option>
                  <option value="Climatizador bi zona con salida trasera">Climatizador bi zona con salida trasera</option>
                  <option value="Climatizador tri zona ">Climatizador tri zona </option>
                </select>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700 leading-tight break-words">Dirección</label>
                <select disabled={readonly} value={(formData['Direccin'] as string | number) || ''} onChange={(e) => { handleChange('Direccin', e.target.value); }} className="w-full h-10 px-3 rounded-md border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-blue/50 bg-white">
                  <option value="">Seleccionar...</option>
                  <option value="Dirección Asistida">Dirección Asistida</option>
                  <option value="Dirección electroasistida">Dirección electroasistida</option>
                </select>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700 leading-tight break-words">Tipo de bloqueo</label>
                <select disabled={readonly} value={(formData['Tipodebloqueo'] as string | number) || ''} onChange={(e) => { handleChange('Tipodebloqueo', e.target.value); }} className="w-full h-10 px-3 rounded-md border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-blue/50 bg-white">
                  <option value="">Seleccionar...</option>
                  <option value="Bloqueo central">Bloqueo central</option>
                  <option value="Bloqueo a distancia">Bloqueo a distancia</option>
                  <option value="Bloqueo con Smartphone">Bloqueo con Smartphone</option>
                  <option value="No">No</option>
                </select>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700 leading-tight break-words">Keyless o Smart key</label>
                <input type="checkbox" disabled={readonly} checked={(formData['KeylessoSmartkey'] as boolean) || false} onChange={(e) => handleChange('KeylessoSmartkey', e.target.checked)} className="w-4 h-4 rounded border-slate-300 text-brand-blue" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700 leading-tight break-words">Espejos eléct.</label>
                <input type="checkbox" disabled={readonly} checked={(formData['Espejoselct'] as boolean) || false} onChange={(e) => handleChange('Espejoselct', e.target.checked)} className="w-4 h-4 rounded border-slate-300 text-brand-blue" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700 leading-tight break-words">Volante revestido en Cuero</label>
                <input type="checkbox" disabled={readonly} checked={(formData['VolanterevestidoenCuero'] as boolean) || false} onChange={(e) => handleChange('VolanterevestidoenCuero', e.target.checked)} className="w-4 h-4 rounded border-slate-300 text-brand-blue" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700 leading-tight break-words">Tablero digital</label>
                <input type="checkbox" disabled={readonly} checked={(formData['Tablerodigital'] as boolean) || false} onChange={(e) => handleChange('Tablerodigital', e.target.checked)} className="w-4 h-4 rounded border-slate-300 text-brand-blue" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700 leading-tight break-words">Vel crucero</label>
                <input type="checkbox" disabled={readonly} checked={(formData['Velcrucero'] as boolean) || false} onChange={(e) => handleChange('Velcrucero', e.target.checked)} className="w-4 h-4 rounded border-slate-300 text-brand-blue" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700 leading-tight break-words">Inmobilizador</label>
                <input type="checkbox" disabled={readonly} checked={(formData['Inmobilizador'] as boolean) || false} onChange={(e) => handleChange('Inmobilizador', e.target.checked)} className="w-4 h-4 rounded border-slate-300 text-brand-blue" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700 leading-tight break-words">SRI (Sistema de retención infantil)</label>
                <select disabled={readonly} value={(formData['SRISistemaderetencininfantil'] as string | number) || ''} onChange={(e) => { handleChange('SRISistemaderetencininfantil', e.target.value); }} className="w-full h-10 px-3 rounded-md border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-blue/50 bg-white">
                  <option value="">Seleccionar...</option>
                  <option value="No">No</option>
                  <option value="ISOFIX">ISOFIX</option>
                  <option value="LATCH">LATCH</option>
                  <option value="ISOFIX Y TOP TETHER">ISOFIX Y TOP TETHER</option>
                  <option value="ISOFIX Y LATCH">ISOFIX Y LATCH</option>
                </select>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700 leading-tight break-words">EBD-EBV-REF (Distribución elect. de frenada)</label>
                <input type="checkbox" disabled={readonly} checked={(formData['EBDEBVREFDistribucinelectdefrenada'] as boolean) || false} onChange={(e) => handleChange('EBDEBVREFDistribucinelectdefrenada', e.target.checked)} className="w-4 h-4 rounded border-slate-300 text-brand-blue" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700 leading-tight break-words">Control tracción</label>
                <input type="checkbox" disabled={readonly} checked={(formData['Controltraccin'] as boolean) || false} onChange={(e) => handleChange('Controltraccin', e.target.checked)} className="w-4 h-4 rounded border-slate-300 text-brand-blue" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700 leading-tight break-words">Det. cambio de fila</label>
                <input type="checkbox" disabled={readonly} checked={(formData['Detcambiodefila'] as boolean) || false} onChange={(e) => handleChange('Detcambiodefila', e.target.checked)} className="w-4 h-4 rounded border-slate-300 text-brand-blue" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700 leading-tight break-words">Det. punto ciego</label>
                <input type="checkbox" disabled={readonly} checked={(formData['Detpuntociego'] as boolean) || false} onChange={(e) => handleChange('Detpuntociego', e.target.checked)} className="w-4 h-4 rounded border-slate-300 text-brand-blue" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700 leading-tight break-words">Comando audio en volante</label>
                <input type="checkbox" disabled={readonly} checked={(formData['Comandoaudioenvolante'] as boolean) || false} onChange={(e) => handleChange('Comandoaudioenvolante', e.target.checked)} className="w-4 h-4 rounded border-slate-300 text-brand-blue" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700 leading-tight break-words">Mirror Screen - Smartphone Display</label>
                <input type="checkbox" disabled={readonly} checked={(formData['MirrorScreenSmartphoneDisplay'] as boolean) || false} onChange={(e) => handleChange('MirrorScreenSmartphoneDisplay', e.target.checked)} className="w-4 h-4 rounded border-slate-300 text-brand-blue" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700 leading-tight break-words">Sist. Multimedia</label>
                <select disabled={readonly} value={(formData['SistMultimedia'] as string | number) || ''} onChange={(e) => { handleChange('SistMultimedia', e.target.value); }} className="w-full h-10 px-3 rounded-md border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-blue/50 bg-white">
                  <option value="">Seleccionar...</option>
                  <option value="Depende de cada marca y modelo. Capaz mejor dejar para que se escriba">Depende de cada marca y modelo. Capaz mejor dejar para que se escriba</option>
                  <option value="Composition Media">Composition Media</option>
                  <option value="Full Link">Full Link</option>
                  <option value="Media Nav">Media Nav</option>
                  <option value="Media Sistem">Media Sistem</option>
                  <option value="Mirror Link">Mirror Link</option>
                  <option value="Composition Media">Composition Media</option>
                  <option value="Touch Infotainment">Touch Infotainment</option>
                  <option value="Nissan door-to-door">Nissan door-to-door</option>
                  <option value="R-Link Evolution">R-Link Evolution</option>
                </select>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700 leading-tight break-words">Pant. Multimedia (")</label>
                <input type={'number'} disabled={readonly} value={(formData['PantMultimedia'] as string | number) || ''} onChange={(e) => { handleChange('PantMultimedia', e.target.value === '' ? undefined : parseFloat(e.target.value)); }} className="w-full h-10 px-3 rounded-md border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-blue/50" step="any" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700 leading-tight break-words">Kit Hi Fi (Bose/JBL/Focal)</label>
                <input type="checkbox" disabled={readonly} checked={(formData['KitHiFiBoseJBLFocal'] as boolean) || false} onChange={(e) => handleChange('KitHiFiBoseJBLFocal', e.target.checked)} className="w-4 h-4 rounded border-slate-300 text-brand-blue" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700 leading-tight break-words">Asiento elect. + Calef. + Masaje</label>
                <input type="checkbox" disabled={readonly} checked={(formData['AsientoelectCalefMasaje'] as boolean) || false} onChange={(e) => handleChange('AsientoelectCalefMasaje', e.target.checked)} className="w-4 h-4 rounded border-slate-300 text-brand-blue" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700 leading-tight break-words">asiento 2+1</label>
                <input type="checkbox" disabled={readonly} checked={(formData['asiento21'] as boolean) || false} onChange={(e) => handleChange('asiento21', e.target.checked)} className="w-4 h-4 rounded border-slate-300 text-brand-blue" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700 leading-tight break-words">But. Electr.</label>
                <select disabled={readonly} value={(formData['ButElectr'] as string | number) || ''} onChange={(e) => { handleChange('ButElectr', e.target.value === '' ? undefined : parseFloat(e.target.value)); }} className="w-full h-10 px-3 rounded-md border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-blue/50 bg-white">
                  <option value="">Seleccionar...</option>
                  <option value="No">No</option>
                </select>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700 leading-tight break-words">Barras de techo</label>
                <input type="checkbox" disabled={readonly} checked={(formData['Barrasdetecho'] as boolean) || false} onChange={(e) => handleChange('Barrasdetecho', e.target.checked)} className="w-4 h-4 rounded border-slate-300 text-brand-blue" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700 leading-tight break-words">Cámara</label>
                <select disabled={readonly} value={(formData['Cmara'] as string | number) || ''} onChange={(e) => { handleChange('Cmara', e.target.value); }} className="w-full h-10 px-3 rounded-md border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-blue/50 bg-white">
                  <option value="">Seleccionar...</option>
                  <option value="Trasera">Trasera</option>
                  <option value="Trasera y delantera">Trasera y delantera</option>
                  <option value="Trasera y lateral">Trasera y lateral</option>
                  <option value="360°">360°</option>
                  <option value="No">No</option>
                  <option value="540°">540°</option>
                </select>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700 leading-tight break-words">Sist. automático de estacionamento</label>
                <input type="checkbox" disabled={readonly} checked={(formData['Sistautomticodeestacionamento'] as boolean) || false} onChange={(e) => handleChange('Sistautomticodeestacionamento', e.target.checked)} className="w-4 h-4 rounded border-slate-300 text-brand-blue" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700 leading-tight break-words">Faros de neblina</label>
                <input type="checkbox" disabled={readonly} checked={(formData['Farosdeneblina'] as boolean) || false} onChange={(e) => handleChange('Farosdeneblina', e.target.checked)} className="w-4 h-4 rounded border-slate-300 text-brand-blue" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700 leading-tight break-words">Faros halógenos + DRL LED (Diurnas)</label>
                <input type="checkbox" disabled={readonly} checked={(formData['FaroshalgenosDRLLEDDiurnas'] as boolean) || false} onChange={(e) => handleChange('FaroshalgenosDRLLEDDiurnas', e.target.checked)} className="w-4 h-4 rounded border-slate-300 text-brand-blue" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700 leading-tight break-words">Faros xenon + Limpadores</label>
                <input type="checkbox" disabled={readonly} checked={(formData['FarosxenonLimpadores'] as boolean) || false} onChange={(e) => handleChange('FarosxenonLimpadores', e.target.checked)} className="w-4 h-4 rounded border-slate-300 text-brand-blue" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700 leading-tight break-words">Pack Visibilidad - Encendido auto faros</label>
                <input type="checkbox" disabled={readonly} checked={(formData['PackVisibilidadEncendidoautofaros'] as boolean) || false} onChange={(e) => handleChange('PackVisibilidadEncendidoautofaros', e.target.checked)} className="w-4 h-4 rounded border-slate-300 text-brand-blue" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700 leading-tight break-words">Paso de luces Cruz / ruta automática</label>
                <input type="checkbox" disabled={readonly} checked={(formData['PasodelucesCruzrutaautomtica'] as boolean) || false} onChange={(e) => handleChange('PasodelucesCruzrutaautomtica', e.target.checked)} className="w-4 h-4 rounded border-slate-300 text-brand-blue" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700 leading-tight break-words">Visión nocturna</label>
                <input type="checkbox" disabled={readonly} checked={(formData['Visinnocturna'] as boolean) || false} onChange={(e) => handleChange('Visinnocturna', e.target.checked)} className="w-4 h-4 rounded border-slate-300 text-brand-blue" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700 leading-tight break-words">Maletera apertura eléctrica</label>
                <select disabled={readonly} value={(formData['Maleteraaperturaelctrica'] as string | number) || ''} onChange={(e) => { handleChange('Maleteraaperturaelctrica', e.target.value); }} className="w-full h-10 px-3 rounded-md border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-blue/50 bg-white">
                  <option value="">Seleccionar...</option>
                  <option value="Motorizada">Motorizada</option>
                  <option value="Foot-control">Foot-control</option>
                  <option value="No">No</option>
                </select>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700 leading-tight break-words">Cap. Baúl</label>
                <input type={'number'} disabled={readonly} value={(formData['CapBal'] as string | number) || ''} onChange={(e) => { handleChange('CapBal', e.target.value === '' ? undefined : parseFloat(e.target.value)); }} className="w-full h-10 px-3 rounded-md border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-blue/50" step={1} onKeyDown={(e) => { if(['e','E','+','-','.'].includes(e.key)) e.preventDefault(); }} />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700 leading-tight break-words">Cap. Tanque combustible</label>
                <input type={'number'} disabled={readonly} value={(formData['CapTanquecombustible'] as string | number) || ''} onChange={(e) => { handleChange('CapTanquecombustible', e.target.value === '' ? undefined : parseFloat(e.target.value)); }} className="w-full h-10 px-3 rounded-md border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-blue/50" step={1} onKeyDown={(e) => { if(['e','E','+','-','.'].includes(e.key)) e.preventDefault(); }} />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700 leading-tight break-words">Partición de cabina</label>
                <select disabled={readonly} value={(formData['Particindecabina'] as string | number) || ''} onChange={(e) => { handleChange('Particindecabina', e.target.value); }} className="w-full h-10 px-3 rounded-md border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-blue/50 bg-white">
                  <option value="">Seleccionar...</option>
                  <option value="Si">Si</option>
                  <option value="VER YANI">VER YANI</option>
                </select>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700 leading-tight break-words">Puerta lat. Eléctrica</label>
                <select disabled={readonly} value={(formData['PuertalatElctrica'] as string | number) || ''} onChange={(e) => { handleChange('PuertalatElctrica', e.target.value); }} className="w-full h-10 px-3 rounded-md border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-blue/50 bg-white">
                  <option value="">Seleccionar...</option>
                  <option value="Si">Si</option>
                </select>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700 leading-tight break-words">limitador de velocidad</label>
                <input type="checkbox" disabled={readonly} checked={(formData['limitadordevelocidad'] as boolean) || false} onChange={(e) => handleChange('limitadordevelocidad', e.target.checked)} className="w-4 h-4 rounded border-slate-300 text-brand-blue" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700 leading-tight break-words">Alerta de tráfico cruzado trasero</label>
                <input type="checkbox" disabled={readonly} checked={(formData['Alertadetrficocruzadotrasero'] as boolean) || false} onChange={(e) => handleChange('Alertadetrficocruzadotrasero', e.target.checked)} className="w-4 h-4 rounded border-slate-300 text-brand-blue" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700 leading-tight break-words">Alerta de tráfico cruzado frontal</label>
                <input type="checkbox" disabled={readonly} checked={(formData['Alertadetrficocruzadofrontal'] as boolean) || false} onChange={(e) => handleChange('Alertadetrficocruzadofrontal', e.target.checked)} className="w-4 h-4 rounded border-slate-300 text-brand-blue" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700 leading-tight break-words">Frenado multicolisión</label>
                <input type="checkbox" disabled={readonly} checked={(formData['Frenadomulticolisin'] as boolean) || false} onChange={(e) => handleChange('Frenadomulticolisin', e.target.checked)} className="w-4 h-4 rounded border-slate-300 text-brand-blue" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700 leading-tight break-words">Apoyabrazo delantero</label>
                <input type="checkbox" disabled={readonly} checked={(formData['Apoyabrazodelantero'] as boolean) || false} onChange={(e) => handleChange('Apoyabrazodelantero', e.target.checked)} className="w-4 h-4 rounded border-slate-300 text-brand-blue" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700 leading-tight break-words">Bloqueo diferencial por terreno</label>
                <input type="checkbox" disabled={readonly} checked={(formData['Bloqueodiferencialporterreno'] as boolean) || false} onChange={(e) => handleChange('Bloqueodiferencialporterreno', e.target.checked)} className="w-4 h-4 rounded border-slate-300 text-brand-blue" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700 leading-tight break-words">Número de techos que se abren</label>
                <input type={'number'} disabled={readonly} value={(formData['Nmerodetechosqueseabren'] as string | number) || ''} onChange={(e) => { handleChange('Nmerodetechosqueseabren', e.target.value === '' ? undefined : parseFloat(e.target.value)); }} className="w-full h-10 px-3 rounded-md border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-blue/50" step={1} onKeyDown={(e) => { if(['e','E','+','-','.'].includes(e.key)) e.preventDefault(); }} />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700 leading-tight break-words">Desempañador eléctrico</label>
                <input type="checkbox" disabled={readonly} checked={(formData['Desempaadorelctrico'] as boolean) || false} onChange={(e) => handleChange('Desempaadorelctrico', e.target.checked)} className="w-4 h-4 rounded border-slate-300 text-brand-blue" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700 leading-tight break-words">Iluminación ambiental</label>
                <input type="checkbox" disabled={readonly} checked={(formData['Iluminacinambiental'] as boolean) || false} onChange={(e) => handleChange('Iluminacinambiental', e.target.checked)} className="w-4 h-4 rounded border-slate-300 text-brand-blue" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700 leading-tight break-words">Limpia-lava parabrisas trasero eléct.</label>
                <input type="checkbox" disabled={readonly} checked={(formData['Limpialavaparabrisastraseroelct'] as boolean) || false} onChange={(e) => handleChange('Limpialavaparabrisastraseroelct', e.target.checked)} className="w-4 h-4 rounded border-slate-300 text-brand-blue" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700 leading-tight break-words">Apoyabrazo central de asiento trasero</label>
                <input type="checkbox" disabled={readonly} checked={(formData['Apoyabrazocentraldeasientotrasero'] as boolean) || false} onChange={(e) => handleChange('Apoyabrazocentraldeasientotrasero', e.target.checked)} className="w-4 h-4 rounded border-slate-300 text-brand-blue" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700 leading-tight break-words">Soporte para muslo delantero</label>
                <input type="checkbox" disabled={readonly} checked={(formData['Soporteparamuslodelantero'] as boolean) || false} onChange={(e) => handleChange('Soporteparamuslodelantero', e.target.checked)} className="w-4 h-4 rounded border-slate-300 text-brand-blue" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700 leading-tight break-words">Asiento trasero con ajuste eléctrico</label>
                <input type="checkbox" disabled={readonly} checked={(formData['Asientotraseroconajusteelctrico'] as boolean) || false} onChange={(e) => handleChange('Asientotraseroconajusteelctrico', e.target.checked)} className="w-4 h-4 rounded border-slate-300 text-brand-blue" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700 leading-tight break-words">Volante multifunción</label>
                <input type="checkbox" disabled={readonly} checked={(formData['Volantemultifuncin'] as boolean) || false} onChange={(e) => handleChange('Volantemultifuncin', e.target.checked)} className="w-4 h-4 rounded border-slate-300 text-brand-blue" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700 leading-tight break-words">Tablero digital 3D</label>
                <input type="checkbox" disabled={readonly} checked={(formData['Tablerodigital3D'] as boolean) || false} onChange={(e) => handleChange('Tablerodigital3D', e.target.checked)} className="w-4 h-4 rounded border-slate-300 text-brand-blue" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700 leading-tight break-words">Direccion en las cuatro ruedas</label>
                <input type="checkbox" disabled={readonly} checked={(formData['Direccionenlascuatroruedas'] as boolean) || false} onChange={(e) => handleChange('Direccionenlascuatroruedas', e.target.checked)} className="w-4 h-4 rounded border-slate-300 text-brand-blue" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700 leading-tight break-words">Luces tras. OLED</label>
                <input type="checkbox" disabled={readonly} checked={(formData['LucestrasOLED'] as boolean) || false} onChange={(e) => handleChange('LucestrasOLED', e.target.checked)} className="w-4 h-4 rounded border-slate-300 text-brand-blue" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700 leading-tight break-words">Deflector de viento</label>
                <input type="checkbox" disabled={readonly} checked={(formData['Deflectordeviento'] as boolean) || false} onChange={(e) => handleChange('Deflectordeviento', e.target.checked)} className="w-4 h-4 rounded border-slate-300 text-brand-blue" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700 leading-tight break-words">Lumbar, Lumbar adjustment front (Driver)</label>
                <input type="checkbox" disabled={readonly} checked={(formData['LumbarLumbaradjustmentfrontDriver'] as boolean) || false} onChange={(e) => handleChange('LumbarLumbaradjustmentfrontDriver', e.target.checked)} className="w-4 h-4 rounded border-slate-300 text-brand-blue" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700 leading-tight break-words">Lumbar, Lumbar adjustment front (Co-Driver)</label>
                <input type="checkbox" disabled={readonly} checked={(formData['LumbarLumbaradjustmentfrontCoDriver'] as boolean) || false} onChange={(e) => handleChange('LumbarLumbaradjustmentfrontCoDriver', e.target.checked)} className="w-4 h-4 rounded border-slate-300 text-brand-blue" />
              </div>

              <div className="col-span-full border-t pt-4 mt-2">
                <div className="flex items-center justify-between mb-4">
                  <span className="font-semibold text-slate-800 text-lg">Vehiculo Eléctrico o Híbrido</span>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="radio" name="is_electrico_toggle" checked={isElectrico} onChange={() => setIsElectrico(true)} disabled={readonly} className="text-brand-blue ring-brand-blue" />
                      <span className="text-base font-medium">Sí</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="radio" name="is_electrico_toggle" checked={!isElectrico} onChange={() => { setIsElectrico(false); ['TipoVehiculoElectrico','TipodeVehiculoElectricoHibrido','EPedal','CapacidadTanqueHidrogeno','CapTanqueHidrgeno','AutonomiaMaxRange','AutonomaMaxRangeenkilometros','CicloNorma','PotenciaMotor','PotenciamotorKW','CapacidadOperativaBateria','CapoperativabatBatterycapacityKwh','PotenciaCargaMax','PotenciadecargaPotMxKWenCA','TiposConectores','Tiposdeconectores','GarantiaCapBat','TecnologiaBat'].forEach(f => handleChange(f as any, undefined)); }} disabled={readonly} className="text-brand-blue ring-brand-blue" />
                      <span className="text-base font-medium">No</span>
                    </label>
                  </div>
                </div>
                {isElectrico && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-4 bg-slate-50 rounded-lg border border-slate-200">
                    <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700 leading-tight break-words">Tipo Vehiculo Electrico</label>
                <input type={'text'} disabled={readonly} value={(formData['TipoVehiculoElectrico'] as string | number) || ''} onChange={(e) => { handleChange('TipoVehiculoElectrico', e.target.value); }} className="w-full h-10 px-3 rounded-md border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-blue/50" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700 leading-tight break-words">E-Pedal</label>
                <input type="checkbox" disabled={readonly} checked={(formData['EPedal'] as boolean) || false} onChange={(e) => handleChange('EPedal', e.target.checked)} className="w-4 h-4 rounded border-slate-300 text-brand-blue" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700 leading-tight break-words">Capacidad Tanque Hidrogeno</label>
                <input type={'number'} disabled={readonly} value={(formData['CapacidadTanqueHidrogeno'] as string | number) || ''} onChange={(e) => { handleChange('CapacidadTanqueHidrogeno', e.target.value === '' ? undefined : parseFloat(e.target.value)); }} className="w-full h-10 px-3 rounded-md border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-blue/50" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700 leading-tight break-words">Ciclo/norma</label>
                <input type="text" list="CicloNorma_list" disabled={readonly} value={(formData['CicloNorma'] as string | number) || ''} onChange={(e) => { handleChange('CicloNorma', e.target.value); }} className="w-full h-10 px-3 rounded-md border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-blue/50" />
                <datalist id="CicloNorma_list">
                  <option value="NEDC" />
                  <option value="WLTP" />
                  <option value="N/A" />
                </datalist>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700 leading-tight break-words">Potencia Motor</label>
                <input type={'number'} disabled={readonly} value={(formData['PotenciaMotor'] as string | number) || ''} onChange={(e) => { handleChange('PotenciaMotor', e.target.value === '' ? undefined : parseFloat(e.target.value)); }} className="w-full h-10 px-3 rounded-md border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-blue/50" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700 leading-tight break-words">Capacidad Operativa Bateria</label>
                <input type={'number'} disabled={readonly} value={(formData['CapacidadOperativaBateria'] as string | number) || ''} onChange={(e) => { handleChange('CapacidadOperativaBateria', e.target.value === '' ? undefined : parseFloat(e.target.value)); }} className="w-full h-10 px-3 rounded-md border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-blue/50" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700 leading-tight break-words">Potencia Carga Max</label>
                <input type={'number'} disabled={readonly} value={(formData['PotenciaCargaMax'] as string | number) || ''} onChange={(e) => { handleChange('PotenciaCargaMax', e.target.value === '' ? undefined : parseFloat(e.target.value)); }} className="w-full h-10 px-3 rounded-md border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-blue/50" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700 leading-tight break-words">Tipos Conectores</label>
                <input type={'text'} disabled={readonly} value={(formData['TiposConectores'] as string | number) || ''} onChange={(e) => { handleChange('TiposConectores', e.target.value); }} className="w-full h-10 px-3 rounded-md border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-blue/50" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700 leading-tight break-words">Garantia Cap Bat</label>
                <input type={'text'} disabled={readonly} value={(formData['GarantiaCapBat'] as string | number) || ''} onChange={(e) => { handleChange('GarantiaCapBat', e.target.value); }} className="w-full h-10 px-3 rounded-md border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-blue/50" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700 leading-tight break-words">Tecnologia Bat</label>
                <input type={'text'} disabled={readonly} value={(formData['TecnologiaBat'] as string | number) || ''} onChange={(e) => { handleChange('TecnologiaBat', e.target.value); }} className="w-full h-10 px-3 rounded-md border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-blue/50" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700 leading-tight break-words">Tipo de Vehiculo Electrico / Hibrido</label>
                <select disabled={readonly} value={(formData['TipodeVehiculoElectricoHibrido'] as string | number) || ''} onChange={(e) => { handleChange('TipodeVehiculoElectricoHibrido', e.target.value); }} className="w-full h-10 px-3 rounded-md border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-blue/50 bg-white">
                  <option value="">Seleccionar...</option>
                  <option value="BEV">BEV</option>
                  <option value="EREV">EREV</option>
                  <option value="HEV">HEV</option>
                  <option value="MHEV">MHEV</option>
                  <option value="PHEV">PHEV</option>
                  <option value="N/A">N/A</option>
                </select>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700 leading-tight break-words">Cap. Tanque Hidrógeno</label>
                <input type="checkbox" disabled={readonly} checked={(formData['CapTanqueHidrgeno'] as boolean) || false} onChange={(e) => handleChange('CapTanqueHidrgeno', e.target.checked)} className="w-4 h-4 rounded border-slate-300 text-brand-blue" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700 leading-tight break-words">Autonomía / Max. Range en kilometros</label>
                <select disabled={readonly} value={(formData['AutonomaMaxRangeenkilometros'] as string | number) || ''} onChange={(e) => { handleChange('AutonomaMaxRangeenkilometros', e.target.value === '' ? undefined : parseFloat(e.target.value)); }} className="w-full h-10 px-3 rounded-md border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-blue/50 bg-white" step={1}>
                  <option value="">Seleccionar...</option>
                  <option value="N/A">N/A</option>
                </select>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700 leading-tight break-words">Potencia motor (KW)</label>
                <select disabled={readonly} value={(formData['PotenciamotorKW'] as string | number) || ''} onChange={(e) => { handleChange('PotenciamotorKW', e.target.value === '' ? undefined : parseFloat(e.target.value)); }} className="w-full h-10 px-3 rounded-md border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-blue/50 bg-white" step="any">
                  <option value="">Seleccionar...</option>
                  <option value="N/A">N/A</option>
                </select>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700 leading-tight break-words">Cap. operativa bat. / Battery capacity (Kwh)</label>
                <select disabled={readonly} value={(formData['CapoperativabatBatterycapacityKwh'] as string | number) || ''} onChange={(e) => { handleChange('CapoperativabatBatterycapacityKwh', e.target.value === '' ? undefined : parseFloat(e.target.value)); }} className="w-full h-10 px-3 rounded-md border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-blue/50 bg-white" step="any">
                  <option value="">Seleccionar...</option>
                  <option value="N/A">N/A</option>
                </select>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700 leading-tight break-words">Potencia de carga- Pot. Máx (KW en CA)</label>
                <select disabled={readonly} value={(formData['PotenciadecargaPotMxKWenCA'] as string | number) || ''} onChange={(e) => { handleChange('PotenciadecargaPotMxKWenCA', e.target.value === '' ? undefined : parseFloat(e.target.value)); }} className="w-full h-10 px-3 rounded-md border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-blue/50 bg-white" step="any">
                  <option value="">Seleccionar...</option>
                  <option value="N/A">N/A</option>
                </select>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700 leading-tight break-words">Tipos de conectores</label>
                <input type="text" list="Tiposdeconectores_list" disabled={readonly} value={(formData['Tiposdeconectores'] as string | number) || ''} onChange={(e) => { handleChange('Tiposdeconectores', e.target.value); }} className="w-full h-10 px-3 rounded-md border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-blue/50" />
                <datalist id="Tiposdeconectores_list">
                  <option value="Tipo 2" />
                  <option value="CCS2" />
                  <option value="N/A" />
                </datalist>
              </div>

                  </div>
                )}
              </div>
                  </div>
          </CardContent>
        </div>
      </Card>

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
