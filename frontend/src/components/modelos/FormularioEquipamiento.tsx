import React from 'react';
import { EquipamientoModelo } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@components/ui/Card';
import { ChevronDown, ChevronUp, Save } from 'lucide-react';
import { Button } from '@components/ui/Button';
import { useState, useEffect } from 'react';

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

  const isElectricoInitial = ['TipoVehiculoElectrico','TipodeVehiculoElectricoHibrido','EPedal','CapacidadTanqueHidrogeno','CapTanqueHidrgeno','AutonomiaMaxRange','AutonomaMaxRangeenkilometros','CicloNorma','PotenciaMotor','PotenciamotorKW','CapacidadOperativaBateria','CapoperativabatBatterycapacityKwh','PotenciaCargaMax','PotenciadecargaPotMxKWenCA','TiposConectores','Tiposdeconectores','GarantiaCapBat','TecnologiaBat'].some((f) => (equipamiento as any)[f] != null && (equipamiento as any)[f] !== '' && (equipamiento as any)[f] !== false);
  const [isElectrico, setIsElectrico] = useState(isElectricoInitial);

  useEffect(() => {
    setFormData(equipamiento || {});
    const isElec = ['TipoVehiculoElectrico','TipodeVehiculoElectricoHibrido','EPedal','CapacidadTanqueHidrogeno','CapTanqueHidrgeno','AutonomiaMaxRange','AutonomaMaxRangeenkilometros','CicloNorma','PotenciaMotor','PotenciamotorKW','CapacidadOperativaBateria','CapoperativabatBatterycapacityKwh','PotenciaCargaMax','PotenciadecargaPotMxKWenCA','TiposConectores','Tiposdeconectores','GarantiaCapBat','TecnologiaBat'].some((f) => (equipamiento as any)[f] != null && (equipamiento as any)[f] !== '' && (equipamiento as any)[f] !== false);
    setIsElectrico(isElec);
  }, [equipamiento]);

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
          onClick={() => toggleSeccion('Electricos')}
        >
          <h3 className="text-lg font-semibold text-slate-800">Electricos</h3>
          {seccionesAbiertas['Electricos'] ? (
            <ChevronUp className="h-5 w-5 text-slate-500" />
          ) : (
            <ChevronDown className="h-5 w-5 text-slate-500" />
          )}
        </div>
        
        <div className={seccionesAbiertas['Electricos'] ? 'block' : 'hidden'}>
          <CardContent className="pt-0 pb-5">
            {'Electricos' === 'Electricos' && (
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
            <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 px-4 ${'Electricos' === 'Electricos' && !isElectrico ? 'hidden' : 'pt-4'}`}>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700 leading-tight break-words">E-Pedal</label>
                <select disabled={readonly} value={formData['EPedal'] === true ? 'Si' : (formData['EPedal'] === false ? 'No' : formData['EPedal'] === 'N/A' ? 'N/A' : '')} onChange={(e) => {
                  const val = e.target.value;
                  handleChange('EPedal', val === 'Si' ? true : (val === 'No' ? false : (val === 'N/A' ? 'N/A' : undefined)));
                }} className="w-full h-10 px-3 rounded-md border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-blue/50 bg-white">
                  <option value="">Seleccionar...</option>
                  <option value="Si">Si</option>
                  <option value="No">No</option>
                  <option value="N/A">N/A</option>
                </select>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700 leading-tight break-words">Cap. Tanque Hidrógeno</label>
                <input type="text" list="na_list" disabled={readonly} value={formData['CapacidadTanqueHidrogeno'] ?? ''} onChange={(e) => { 
                  let val: any = e.target.value;
                  if (val !== 'N/A' && val !== '') val = val.replace(/[^0-9]/g, '');
                  handleChange('CapacidadTanqueHidrogeno', val === '' ? undefined : val); 
                }} className="w-full h-10 px-3 rounded-md border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-blue/50" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700 leading-tight break-words">Autonomía / Max. Range en kilometros</label>
                <input type="text" list="na_list" disabled={readonly} value={formData['AutonomiaMaxRange'] ?? ''} onChange={(e) => { 
                  let val: any = e.target.value;
                  if (val !== 'N/A' && val !== '') val = val.replace(/[^0-9]/g, '');
                  handleChange('AutonomiaMaxRange', val === '' ? undefined : val); 
                }} className="w-full h-10 px-3 rounded-md border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-blue/50" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700 leading-tight break-words">Ciclo/norma</label>
                <input type="text" list="CicloNorma_list" disabled={readonly} value={formData['CicloNorma'] ?? ''} onChange={(e) => { handleChange('CicloNorma', e.target.value); }} className="w-full h-10 px-3 rounded-md border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-blue/50" />
                <datalist id="CicloNorma_list">
                  <option value="NEDC" />
                  <option value="WLTP" />
                  <option value="N/A" />
                </datalist>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700 leading-tight break-words">Potencia motor (KW)</label>
                <input type="text" list="na_list" disabled={readonly} value={formData['PotenciaMotor'] ?? ''} onChange={(e) => { 
                  let val: any = e.target.value;
                  if (val !== 'N/A' && val !== '') {
                    val = val.replace(/,/g, '.').replace(/[^0-9.]/g, '');
                  }
                  handleChange('PotenciaMotor', val === '' ? undefined : val); 
                }} className="w-full h-10 px-3 rounded-md border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-blue/50" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700 leading-tight break-words">Cap. operativa bat. / Battery capacity (Kwh)</label>
                <input type="text" list="na_list" disabled={readonly} value={formData['CapacidadOperativaBateria'] ?? ''} onChange={(e) => { 
                  let val: any = e.target.value;
                  if (val !== 'N/A' && val !== '') {
                    val = val.replace(/,/g, '.').replace(/[^0-9.]/g, '');
                  }
                  handleChange('CapacidadOperativaBateria', val === '' ? undefined : val); 
                }} className="w-full h-10 px-3 rounded-md border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-blue/50" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700 leading-tight break-words">Potencia de carga- Pot. Máx (KW en CA)</label>
                <input type="text" list="na_list" disabled={readonly} value={formData['PotenciaCargaMax'] ?? ''} onChange={(e) => { 
                  let val: any = e.target.value;
                  if (val !== 'N/A' && val !== '') {
                    val = val.replace(/,/g, '.').replace(/[^0-9.]/g, '');
                  }
                  handleChange('PotenciaCargaMax', val === '' ? undefined : val); 
                }} className="w-full h-10 px-3 rounded-md border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-blue/50" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700 leading-tight break-words">Tipos de conectores</label>
                <input type="text" list="Tiposdeconectores_list" disabled={readonly} value={formData['TiposConectores'] ?? ''} onChange={(e) => { handleChange('TiposConectores', e.target.value); }} className="w-full h-10 px-3 rounded-md border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-blue/50" />
                <datalist id="Tiposdeconectores_list">
                  <option value="Tipo 2" />
                  <option value="CCS2" />
                  <option value="N/A" />
                </datalist>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700 leading-tight break-words">Garantía cap. Bat.</label>
                <input type="text" list="na_list" disabled={readonly} value={formData['GarantiaCapBat'] ?? ''} onChange={(e) => { handleChange('GarantiaCapBat', e.target.value); }} className="w-full h-10 px-3 rounded-md border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-blue/50" placeholder="Ej: 8/150.000" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700 leading-tight break-words">Tecnología Bat. (materiales)</label>
                <select disabled={readonly} value={formData['TecnologiaBat'] ?? ''} onChange={(e) => { handleChange('TecnologiaBat', e.target.value); }} className="w-full h-10 px-3 rounded-md border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-blue/50 bg-white">
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
                <label className="text-sm font-medium text-slate-700 leading-tight break-words">Tiempo de carga</label>
                <input type="text" list="na_list" disabled={readonly} value={formData['TiempoCarga'] ?? ''} onChange={(e) => { 
                  let val: any = e.target.value;
                  if (val !== 'N/A' && val !== '') {
                    val = val.replace(/,/g, '.').replace(/[^0-9.]/g, '');
                  }
                  handleChange('TiempoCarga', val === '' ? undefined : val); 
                }} className="w-full h-10 px-3 rounded-md border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-blue/50" />
              </div>
              
              {/* Datalist global for N/A option */}
              <datalist id="na_list">
                <option value="N/A" />
              </datalist>
            </div>
          </CardContent>
        </div>
      </Card>
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
            <div className={'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 px-4 pt-4'}>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700 leading-tight break-words">Largo</label>
                <input type={'number'} disabled={readonly} value={(formData['Largo'] as string | number) || ''} onChange={(e) => { handleChange('Largo', e.target.value === '' ? undefined : parseFloat(e.target.value)); }} className="w-full h-10 px-3 rounded-md border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-blue/50" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700 leading-tight break-words">Ancho</label>
                <input type={'number'} disabled={readonly} value={(formData['Ancho'] as string | number) || ''} onChange={(e) => { handleChange('Ancho', e.target.value === '' ? undefined : parseFloat(e.target.value)); }} className="w-full h-10 px-3 rounded-md border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-blue/50" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700 leading-tight break-words">Altura</label>
                <input type={'number'} disabled={readonly} value={(formData['Altura'] as string | number) || ''} onChange={(e) => { handleChange('Altura', e.target.value === '' ? undefined : parseFloat(e.target.value)); }} className="w-full h-10 px-3 rounded-md border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-blue/50" />
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
                <label className="text-sm font-medium text-slate-700 leading-tight break-words">Llantas de aleación</label>
                <input type="checkbox" disabled={readonly} checked={(formData['LlantasAleacion'] as boolean) || false} onChange={(e) => handleChange('LlantasAleacion', e.target.checked)} className="w-4 h-4 rounded border-slate-300 text-brand-blue" />
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
                <label className="text-sm font-medium text-slate-700 leading-tight break-words">TPMS</label>
                <input type="checkbox" disabled={readonly} checked={(formData['TPMS'] as boolean) || false} onChange={(e) => handleChange('TPMS', e.target.checked)} className="w-4 h-4 rounded border-slate-300 text-brand-blue" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700 leading-tight break-words">Kit Inflable AntiPinchazo</label>
                <input type="checkbox" disabled={readonly} checked={(formData['KitInflableAntiPinchazo'] as boolean) || false} onChange={(e) => handleChange('KitInflableAntiPinchazo', e.target.checked)} className="w-4 h-4 rounded border-slate-300 text-brand-blue" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700 leading-tight break-words">Partición de cabina</label>
                <input type="checkbox" disabled={readonly} checked={(formData['ParticionCabina'] as boolean) || false} onChange={(e) => handleChange('ParticionCabina', e.target.checked)} className="w-4 h-4 rounded border-slate-300 text-brand-blue" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700 leading-tight break-words">Puerta lat. Eléctrica</label>
                <input type="checkbox" disabled={readonly} checked={(formData['PuertaLateralElectrica'] as boolean) || false} onChange={(e) => handleChange('PuertaLateralElectrica', e.target.checked)} className="w-4 h-4 rounded border-slate-300 text-brand-blue" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700 leading-tight break-words">Rueda aux. homogeneo</label>
                <select disabled={readonly} value={(formData['RuedaAuxHomogenea'] as any) || ''} onChange={(e) => { handleChange('RuedaAuxHomogenea', e.target.value); }} className="w-full h-10 px-3 rounded-md border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-blue/50 bg-white">
                  <option value="">Seleccionar...</option>
                  <option value="SI">SI</option>
                  <option value="NO">NO</option>
                  <option value="No tiene">No tiene</option>
                </select>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700 leading-tight break-words">Neumaticos</label>
                <input type="text" disabled={readonly} value={(formData['Neumaticos'] as string) || ''} onChange={(e) => { handleChange('Neumaticos', e.target.value); }} className="w-full h-10 px-3 rounded-md border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-blue/50" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700 leading-tight break-words">Diámetro llantas</label>
                <input type={'number'} disabled={readonly} value={(formData['DiametroLlantas'] as string | number) || ''} onChange={(e) => { 
            const raw = e.target.value;
            let sliced = raw;
            if (raw && raw.length > 2) {
              sliced = raw.slice(0, 2);
            }
            handleChange('DiametroLlantas', sliced === '' ? undefined : parseFloat(sliced));
             }} className="w-full h-10 px-3 rounded-md border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-blue/50" max={99} min={0} step={1} onKeyDown={(e) => { if(['e','E','+','-','.'].includes(e.key)) e.preventDefault(); }} />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700 leading-tight break-words">N° Puertas Lat.</label>
                <select disabled={readonly} value={(formData['NumeroPuertas'] as string | number) || ''} onChange={(e) => { handleChange('NumeroPuertas', e.target.value === '' ? undefined : parseInt(e.target.value)); }} className="w-full h-10 px-3 rounded-md border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-blue/50 bg-white">
                  <option value="">Seleccionar...</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                </select>
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 px-4 pt-4">
              {/* === NUEVOS CAMPOS MECANICA === */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700 leading-tight break-words">Inyección</label>
                <select disabled={readonly} value={(formData['Inyeccion'] as string | number) || ''} onChange={(e) => { handleChange('Inyeccion', e.target.value); }} className="w-full h-10 px-3 rounded-md border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-blue/50 bg-white">
                  <option value="">Seleccionar...</option>
                  <option value="Directa">Directa</option>
                  <option value="Common Rail">Common Rail</option>
                  <option value="Electrónica">Electrónica</option>
                  <option value="Multipunto">Multipunto</option>
                  <option value="N/A">N/A</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700 leading-tight break-words">Tracción</label>
                <select disabled={readonly} value={(formData['Traccion'] as string | number) || ''} onChange={(e) => { handleChange('Traccion', e.target.value); }} className="w-full h-10 px-3 rounded-md border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-blue/50 bg-white">
                  <option value="">Seleccionar...</option>
                  <option value="4x2">4x2</option>
                  <option value="4x4">4x4</option>
                  <option value="AWD">AWD</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700 leading-tight break-words">Suspensión</label>
                <input type="text" list="Suspension_list" disabled={readonly} value={(formData['Suspension'] as string | number) || ''} onChange={(e) => { handleChange('Suspension', e.target.value); }} className="w-full h-10 px-3 rounded-md border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-blue/50" />
                <datalist id="Suspension_list">
                  <option value="McPherson /Multilink" />
                  <option value="Independiente" />
                  <option value="Independiente/barra de torsión" />
                  <option value="McPherson/barra estabilizadora" />
                  <option value="Neumática" />
                </datalist>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700 leading-tight break-words">Tipo caja Aut.</label>
                <select disabled={readonly} value={(formData['TipoCajaAut'] as string | number) || ''} onChange={(e) => { handleChange('TipoCajaAut', e.target.value); }} className="w-full h-10 px-3 rounded-md border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-blue/50 bg-white">
                  <option value="">Seleccionar...</option>
                  <option value="Automática">Automática</option>
                  <option value="Manual">Manual</option>
                  <option value="No">No</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700 leading-tight break-words">Marchas / velocidades</label>
                <input type={'number'} disabled={readonly} value={(formData['MarchasVelocidades'] as string | number) || ''} onChange={(e) => { handleChange('MarchasVelocidades', e.target.value === '' ? undefined : parseFloat(e.target.value)); }} className="w-full h-10 px-3 rounded-md border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-blue/50" step={1} onKeyDown={(e) => { if(['e','E','+','-','.'].includes(e.key)) e.preventDefault(); }} />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700 leading-tight break-words">Turbo</label>
                <input type="checkbox" disabled={readonly} checked={(formData['Turbo'] as boolean) || false} onChange={(e) => handleChange('Turbo', e.target.checked)} className="w-4 h-4 rounded border-slate-300 text-brand-blue" />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700 leading-tight break-words">Par del Motor - torque (Nm)</label>
                <input type={'number'} disabled={readonly} value={(formData['PardelMotortorqueNm'] as string | number) || ''} onChange={(e) => { handleChange('PardelMotortorqueNm', e.target.value === '' ? undefined : parseFloat(e.target.value)); }} className="w-full h-10 px-3 rounded-md border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-blue/50" step={1} onKeyDown={(e) => { if(['e','E','+','-','.'].includes(e.key)) e.preventDefault(); }} />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700 leading-tight break-words">Aceite</label>
                <input type={'text'} disabled={readonly} value={(formData['Aceite'] as string | number) || ''} onChange={(e) => { handleChange('Aceite', e.target.value); }} className="w-full h-10 px-3 rounded-md border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-blue/50" />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700 leading-tight break-words">Norma</label>
                <input type={'text'} disabled={readonly} value={(formData['Norma'] as string | number) || ''} onChange={(e) => { handleChange('Norma', e.target.value); }} className="w-full h-10 px-3 rounded-md border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-blue/50" />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700 leading-tight break-words">CO2 (g/Km)</label>
                <input type={'number'} disabled={readonly} value={(formData['CO2_g_km'] as string | number) || ''} onChange={(e) => { handleChange('CO2_g_km', e.target.value === '' ? undefined : parseFloat(e.target.value)); }} className="w-full h-10 px-3 rounded-md border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-blue/50" step={1} onKeyDown={(e) => { if(['e','E','+','-','.'].includes(e.key)) e.preventDefault(); }} />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700 leading-tight break-words">Consumo ruta (l/100 km)</label>
                <input type={'number'} disabled={readonly} value={(formData['Consumorutal100km'] as string | number) || ''} onChange={(e) => { handleChange('Consumorutal100km', e.target.value === '' ? undefined : parseFloat(e.target.value)); }} className="w-full h-10 px-3 rounded-md border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-blue/50" step={0.01} />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700 leading-tight break-words">Consumo urbano (l/100 km)</label>
                <input type={'number'} disabled={readonly} value={(formData['Consumourbanol100km'] as string | number) || ''} onChange={(e) => { handleChange('Consumourbanol100km', e.target.value === '' ? undefined : parseFloat(e.target.value)); }} className="w-full h-10 px-3 rounded-md border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-blue/50" step={0.01} />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700 leading-tight break-words">Consumo mixto (l/100 km)</label>
                <input type={'number'} disabled={readonly} value={(formData['Consumomixtol100km'] as string | number) || ''} onChange={(e) => { handleChange('Consumomixtol100km', e.target.value === '' ? undefined : parseFloat(e.target.value)); }} className="w-full h-10 px-3 rounded-md border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-blue/50" step={0.01} />
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 px-4 pt-4">
              {/* === NUEVOS CAMPOS EQUIPAMIENTO === */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700 leading-tight break-words">Sistema de climatización</label>
                <select disabled={readonly} value={(formData['Sistemadeclimatizacion'] as string | number) || ''} onChange={(e) => { handleChange('Sistemadeclimatizacion', e.target.value); }} className="w-full h-10 px-3 rounded-md border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-blue/50 bg-white">
                  <option value="">Seleccionar...</option>
                  <option value="No">No</option>
                  <option value="Aire acondicionado">Aire acondicionado</option>
                  <option value="Aire acondicionado con salida trasera">Aire acondicionado con salida trasera</option>
                  <option value="Climatizador">Climatizador</option>
                  <option value="Climatizador con salida trasera">Climatizador con salida trasera</option>
                  <option value="Climatizador bi zona">Climatizador bi zona</option>
                  <option value="Climatizador bi zona con salida trasera">Climatizador bi zona con salida trasera</option>
                  <option value="Climatizador tri zona">Climatizador tri zona</option>
                </select>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700 leading-tight break-words">Dirección</label>
                <select disabled={readonly} value={(formData['Direccion'] as string | number) || ''} onChange={(e) => { handleChange('Direccion', e.target.value); }} className="w-full h-10 px-3 rounded-md border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-blue/50 bg-white">
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
                <label className="text-sm font-medium text-slate-700 leading-tight break-words">Levanta vidrios</label>
                <select disabled={readonly} value={(formData['Levantavidrios'] as string | number) || ''} onChange={(e) => { handleChange('Levantavidrios', e.target.value); }} className="w-full h-10 px-3 rounded-md border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-blue/50 bg-white">
                  <option value="">Seleccionar...</option>
                  <option value="Manual">Manual</option>
                  <option value="Eléctricos x 2">Eléctricos x 2</option>
                  <option value="Eléctricos x 4">Eléctricos x 4</option>
                  <option value="Eléctricos x 3">Eléctricos x 3</option>
                </select>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700 leading-tight break-words">Espejos eléct.</label>
                <input type="checkbox" disabled={readonly} checked={(formData['Espejoselect'] as boolean) || false} onChange={(e) => handleChange('Espejoselect', e.target.checked)} className="w-4 h-4 rounded border-slate-300 text-brand-blue" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700 leading-tight break-words">Espejo interior electrocromado</label>
                <input type="checkbox" disabled={readonly} checked={(formData['Espejointeriorelectrocromado'] as boolean) || false} onChange={(e) => handleChange('Espejointeriorelectrocromado', e.target.checked)} className="w-4 h-4 rounded border-slate-300 text-brand-blue" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700 leading-tight break-words">Espejos abatibles electricamente</label>
                <input type="checkbox" disabled={readonly} checked={(formData['Espejosabatibleselectricamente'] as boolean) || false} onChange={(e) => handleChange('Espejosabatibleselectricamente', e.target.checked)} className="w-4 h-4 rounded border-slate-300 text-brand-blue" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700 leading-tight break-words">Tapizado </label>
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
                <label className="text-sm font-medium text-slate-700 leading-tight break-words">Volante revestido en Cuero</label>
                <input type="checkbox" disabled={readonly} checked={(formData['VolanterevestidoenCuero'] as boolean) || false} onChange={(e) => handleChange('VolanterevestidoenCuero', e.target.checked)} className="w-4 h-4 rounded border-slate-300 text-brand-blue" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700 leading-tight break-words">Tablero digital</label>
                <input type="checkbox" disabled={readonly} checked={(formData['Tablerodigital'] as boolean) || false} onChange={(e) => handleChange('Tablerodigital', e.target.checked)} className="w-4 h-4 rounded border-slate-300 text-brand-blue" />
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
                <label className="text-sm font-medium text-slate-700 leading-tight break-words">Vel crucero</label>
                <select disabled={readonly} value={(formData['Velcrucero'] as unknown as string | number) || ''} onChange={(e) => { handleChange('Velcrucero', e.target.value); }} className="w-full h-10 px-3 rounded-md border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-blue/50 bg-white">
                  <option value="">Seleccionar...</option>
                  <option value="Si">Si</option>
                  <option value="No">No</option>
                  <option value="Adaptativo">Adaptativo</option>
                </select>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700 leading-tight break-words">Inmobilizador</label>
                <input type="checkbox" disabled={readonly} checked={(formData['Inmobilizador'] as boolean) || false} onChange={(e) => handleChange('Inmobilizador', e.target.checked)} className="w-4 h-4 rounded border-slate-300 text-brand-blue" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700 leading-tight break-words">Alarma</label>
                <input type="checkbox" disabled={readonly} checked={(formData['Alarma'] as boolean) || false} onChange={(e) => handleChange('Alarma', e.target.checked)} className="w-4 h-4 rounded border-slate-300 text-brand-blue" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700 leading-tight break-words">ABAG</label>
                <select disabled={readonly} value={(formData['ABAG'] as unknown as string | number) || ''} onChange={(e) => { handleChange('ABAG', e.target.value); }} className="w-full h-10 px-3 rounded-md border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-blue/50 bg-white">
                  <option value="">Seleccionar...</option>
                  <option value="2">2</option>
                  <option value="4">4</option>
                  <option value="6">6</option>
                  <option value="7">7</option>
                  <option value="8">8</option>
                  <option value="10">10</option>
                  <option value="12">12</option>
                  <option value="No">No</option>
                </select>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700 leading-tight break-words">SRI (Sistema de retención infantil)</label>
                <select disabled={readonly} value={(formData['SRISistemaderetencioninfantil'] as string | number) || ''} onChange={(e) => { handleChange('SRISistemaderetencioninfantil', e.target.value); }} className="w-full h-10 px-3 rounded-md border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-blue/50 bg-white">
                  <option value="">Seleccionar...</option>
                  <option value="No">No</option>
                  <option value="ISOFIX">ISOFIX</option>
                  <option value="LATCH">LATCH</option>
                  <option value="ISOFIX Y TOP TETHER">ISOFIX Y TOP TETHER</option>
                  <option value="ISOFIX Y LATCH">ISOFIX Y LATCH</option>
                </select>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700 leading-tight break-words">ABS</label>
                <input type="checkbox" disabled={readonly} checked={(formData['ABS'] as boolean) || false} onChange={(e) => handleChange('ABS', e.target.checked)} className="w-4 h-4 rounded border-slate-300 text-brand-blue" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700 leading-tight break-words">EBD-EBV-REF (Distribución elect. de frenada)</label>
                <input type="checkbox" disabled={readonly} checked={(formData['EBDEBVREFDistribucionelectdefrenada'] as boolean) || false} onChange={(e) => handleChange('EBDEBVREFDistribucionelectdefrenada', e.target.checked)} className="w-4 h-4 rounded border-slate-300 text-brand-blue" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700 leading-tight break-words">DISCOS FRENOS</label>
                <select disabled={readonly} value={(formData['DISCOSFRENOS'] as string | number) || ''} onChange={(e) => { handleChange('DISCOSFRENOS', e.target.value); }} className="w-full h-10 px-3 rounded-md border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-blue/50 bg-white">
                  <option value="">Seleccionar...</option>
                  <option value="2">2</option>
                  <option value="4">4</option>
                </select>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700 leading-tight break-words">Freno Estacionamento Electrico (EPB)</label>
                <input type="checkbox" disabled={readonly} checked={(formData['FrenoEstacionamentoElectricoEPB'] as boolean) || false} onChange={(e) => handleChange('FrenoEstacionamentoElectricoEPB', e.target.checked)} className="w-4 h-4 rounded border-slate-300 text-brand-blue" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700 leading-tight break-words">ESP Control estabilidad</label>
                <input type="checkbox" disabled={readonly} checked={(formData['ESPControlestabilidad'] as boolean) || false} onChange={(e) => handleChange('ESPControlestabilidad', e.target.checked)} className="w-4 h-4 rounded border-slate-300 text-brand-blue" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700 leading-tight break-words">Control tracción</label>
                <input type="checkbox" disabled={readonly} checked={(formData['Controltraccion'] as boolean) || false} onChange={(e) => handleChange('Controltraccion', e.target.checked)} className="w-4 h-4 rounded border-slate-300 text-brand-blue" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700 leading-tight break-words">Asist. frenado detector distancia</label>
                <input type="checkbox" disabled={readonly} checked={(formData['Asistfrenadodetectordistancia'] as boolean) || false} onChange={(e) => handleChange('Asistfrenadodetectordistancia', e.target.checked)} className="w-4 h-4 rounded border-slate-300 text-brand-blue" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700 leading-tight break-words">Asist. Pendiente</label>
                <input type="checkbox" disabled={readonly} checked={(formData['AsistPendiente'] as boolean) || false} onChange={(e) => handleChange('AsistPendiente', e.target.checked)} className="w-4 h-4 rounded border-slate-300 text-brand-blue" />
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
                <label className="text-sm font-medium text-slate-700 leading-tight break-words">Traffic Sign recognition</label>
                <input type="checkbox" disabled={readonly} checked={(formData['TrafficSignrecognition'] as boolean) || false} onChange={(e) => handleChange('TrafficSignrecognition', e.target.checked)} className="w-4 h-4 rounded border-slate-300 text-brand-blue" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700 leading-tight break-words">Driver attention control</label>
                <input type="checkbox" disabled={readonly} checked={(formData['Driverattentioncontrol'] as boolean) || false} onChange={(e) => handleChange('Driverattentioncontrol', e.target.checked)} className="w-4 h-4 rounded border-slate-300 text-brand-blue" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700 leading-tight break-words">Detector   lluvia</label>
                <input type="checkbox" disabled={readonly} checked={(formData['Detectorlluvia'] as boolean) || false} onChange={(e) => handleChange('Detectorlluvia', e.target.checked)} className="w-4 h-4 rounded border-slate-300 text-brand-blue" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700 leading-tight break-words">Grip Control</label>
                <input type="checkbox" disabled={readonly} checked={(formData['GripControl'] as boolean) || false} onChange={(e) => handleChange('GripControl', e.target.checked)} className="w-4 h-4 rounded border-slate-300 text-brand-blue" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700 leading-tight break-words">Comando audio en volante</label>
                <input type="checkbox" disabled={readonly} checked={(formData['Comandoaudioenvolante'] as boolean) || false} onChange={(e) => handleChange('Comandoaudioenvolante', e.target.checked)} className="w-4 h-4 rounded border-slate-300 text-brand-blue" />
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
                <label className="text-sm font-medium text-slate-700 leading-tight break-words">Mirror Screen - Smartphone Display          </label>
                <input type="checkbox" disabled={readonly} checked={(formData['MirrorScreenSmartphoneDisplay'] as boolean) || false} onChange={(e) => handleChange('MirrorScreenSmartphoneDisplay', e.target.checked)} className="w-4 h-4 rounded border-slate-300 text-brand-blue" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700 leading-tight break-words">Sist. Multimedia</label>
                <input type="text" list="SistMultimedia_list" disabled={readonly} value={(formData['SistMultimedia'] as string | number) || ''} onChange={(e) => { handleChange('SistMultimedia', e.target.value); }} className="w-full h-10 px-3 rounded-md border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-blue/50" />
                <datalist id="SistMultimedia_list">
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
                <label className="text-sm font-medium text-slate-700 leading-tight break-words">Pant. Multimedia (")</label>
                <input type={'number'} disabled={readonly} value={(formData['PantMultimedia'] as string | number) || ''} onChange={(e) => { handleChange('PantMultimedia', e.target.value === '' ? undefined : parseFloat(e.target.value)); }} className="w-full h-10 px-3 rounded-md border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-blue/50" step={0.01} onKeyDown={(e) => { if(['e','E','+','-','.'].includes(e.key)) e.preventDefault(); }} />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700 leading-tight break-words">Pantalla Tactil</label>
                <input type="checkbox" disabled={readonly} checked={(formData['PantallaTactil'] as boolean) || false} onChange={(e) => handleChange('PantallaTactil', e.target.checked)} className="w-4 h-4 rounded border-slate-300 text-brand-blue" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700 leading-tight break-words">Cargador Smartphone con inducción</label>
                <input type="checkbox" disabled={readonly} checked={(formData['CargadorSmartphoneconinduccion'] as boolean) || false} onChange={(e) => handleChange('CargadorSmartphoneconinduccion', e.target.checked)} className="w-4 h-4 rounded border-slate-300 text-brand-blue" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700 leading-tight break-words">Kit Hi Fi (Bose/JBL/Focal)</label>
                <input type="checkbox" disabled={readonly} checked={(formData['KitHiFiBoseJBLFocal'] as boolean) || false} onChange={(e) => handleChange('KitHiFiBoseJBLFocal', e.target.checked)} className="w-4 h-4 rounded border-slate-300 text-brand-blue" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700 leading-tight break-words">Asiento elect. + Calef. + Masaje</label>
                <select disabled={readonly} value={(formData['AsientoelectCalefMasaje'] as unknown as string | number) || ''} onChange={(e) => { handleChange('AsientoelectCalefMasaje', e.target.value); }} className="w-full h-10 px-3 rounded-md border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-blue/50 bg-white">
                  <option value="">Seleccionar...</option>
                  <option value="Si">Si</option>
                  <option value="No">No</option>
                  <option value="Eléct. + Calef.">Eléct. + Calef.</option>
                  <option value="Eléct. + Masaje">Eléct. + Masaje</option>
                </select>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700 leading-tight break-words">asientos rango 2 y 3</label>
                <input type="checkbox" disabled={readonly} checked={(formData['asientosrango2y3'] as boolean) || false} onChange={(e) => handleChange('asientosrango2y3', e.target.checked)} className="w-4 h-4 rounded border-slate-300 text-brand-blue" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700 leading-tight break-words">asiento 2+1</label>
                <input type="checkbox" disabled={readonly} checked={(formData['asiento21'] as boolean) || false} onChange={(e) => handleChange('asiento21', e.target.checked)} className="w-4 h-4 rounded border-slate-300 text-brand-blue" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700 leading-tight break-words">But. Electr.</label>
                <input type={'number'} disabled={readonly} value={(formData['ButElectr'] as string | number) || ''} onChange={(e) => { handleChange('ButElectr', e.target.value === '' ? undefined : parseFloat(e.target.value)); }} className="w-full h-10 px-3 rounded-md border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-blue/50" step={1} onKeyDown={(e) => { if(['e','E','+','-','.'].includes(e.key)) e.preventDefault(); }} />
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
                <input type="checkbox" disabled={readonly} checked={(formData['TechoBitono'] as boolean) || false} onChange={(e) => handleChange('TechoBitono', e.target.checked)} className="w-4 h-4 rounded border-slate-300 text-brand-blue" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700 leading-tight break-words">Barras de techo</label>
                <input type="checkbox" disabled={readonly} checked={(formData['Barrasdetecho'] as boolean) || false} onChange={(e) => handleChange('Barrasdetecho', e.target.checked)} className="w-4 h-4 rounded border-slate-300 text-brand-blue" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700 leading-tight break-words">Sensor estacionamiento</label>
                <select disabled={readonly} value={(formData['Sensorestacionamiento'] as string | number) || ''} onChange={(e) => { handleChange('Sensorestacionamiento', e.target.value); }} className="w-full h-10 px-3 rounded-md border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-blue/50 bg-white">
                  <option value="">Seleccionar...</option>
                  <option value="Trasero">Trasero</option>
                  <option value="Trasero y delantero">Trasero y delantero</option>
                  <option value="No">No</option>
                </select>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700 leading-tight break-words">Cámara</label>
                <select disabled={readonly} value={(formData['Camara'] as string | number) || ''} onChange={(e) => { handleChange('Camara', e.target.value); }} className="w-full h-10 px-3 rounded-md border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-blue/50 bg-white">
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
                <input type="checkbox" disabled={readonly} checked={(formData['Sistautomaticodeestacionamento'] as boolean) || false} onChange={(e) => handleChange('Sistautomaticodeestacionamento', e.target.checked)} className="w-4 h-4 rounded border-slate-300 text-brand-blue" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700 leading-tight break-words">Faros de neblina</label>
                <input type="checkbox" disabled={readonly} checked={(formData['Farosdeneblina'] as boolean) || false} onChange={(e) => handleChange('Farosdeneblina', e.target.checked)} className="w-4 h-4 rounded border-slate-300 text-brand-blue" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700 leading-tight break-words">Faros direccionales</label>
                <input type="checkbox" disabled={readonly} checked={(formData['Farosdireccionales'] as boolean) || false} onChange={(e) => handleChange('Farosdireccionales', e.target.checked)} className="w-4 h-4 rounded border-slate-300 text-brand-blue" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700 leading-tight break-words">Faros full LED    </label>
                <input type="checkbox" disabled={readonly} checked={(formData['FarosfullLED'] as boolean) || false} onChange={(e) => handleChange('FarosfullLED', e.target.checked)} className="w-4 h-4 rounded border-slate-300 text-brand-blue" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700 leading-tight break-words">Faros halógenos  + DRL LED (Diurnas)</label>
                <input type="checkbox" disabled={readonly} checked={(formData['FaroshalogenosDRLLEDDiurnas'] as boolean) || false} onChange={(e) => handleChange('FaroshalogenosDRLLEDDiurnas', e.target.checked)} className="w-4 h-4 rounded border-slate-300 text-brand-blue" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700 leading-tight break-words">Faros xenon + Limpadores</label>
                <input type="checkbox" disabled={readonly} checked={(formData['FarosxenonLimpadores'] as boolean) || false} onChange={(e) => handleChange('FarosxenonLimpadores', e.target.checked)} className="w-4 h-4 rounded border-slate-300 text-brand-blue" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700 leading-tight break-words">Pack Visibilidad - Encendido auto faros </label>
                <input type="checkbox" disabled={readonly} checked={(formData['PackVisibilidadEncendidoautofaros'] as boolean) || false} onChange={(e) => handleChange('PackVisibilidadEncendidoautofaros', e.target.checked)} className="w-4 h-4 rounded border-slate-300 text-brand-blue" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700 leading-tight break-words">Paso de luces Cruz / ruta automática</label>
                <input type="checkbox" disabled={readonly} checked={(formData['PasodelucesCruzrutaautomatica'] as boolean) || false} onChange={(e) => handleChange('PasodelucesCruzrutaautomatica', e.target.checked)} className="w-4 h-4 rounded border-slate-300 text-brand-blue" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700 leading-tight break-words">Visión nocturna</label>
                <input type="checkbox" disabled={readonly} checked={(formData['Visionnocturna'] as boolean) || false} onChange={(e) => handleChange('Visionnocturna', e.target.checked)} className="w-4 h-4 rounded border-slate-300 text-brand-blue" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700 leading-tight break-words">Maletera apertura eléctrica</label>
                <select disabled={readonly} value={(formData['Maleteraaperturaelectrica'] as string | number) || ''} onChange={(e) => { handleChange('Maleteraaperturaelectrica', e.target.value); }} className="w-full h-10 px-3 rounded-md border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-blue/50 bg-white">
                  <option value="">Seleccionar...</option>
                  <option value="Motorizada">Motorizada</option>
                  <option value="Foot-control">Foot-control</option>
                  <option value="No">No</option>
                </select>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700 leading-tight break-words">Protector CAJA</label>
                <input type="checkbox" disabled={readonly} checked={(formData['ProtectorCAJA'] as boolean) || false} onChange={(e) => handleChange('ProtectorCAJA', e.target.checked)} className="w-4 h-4 rounded border-slate-300 text-brand-blue" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700 leading-tight break-words">Start Stop</label>
                <input type="checkbox" disabled={readonly} checked={(formData['StartStop'] as boolean) || false} onChange={(e) => handleChange('StartStop', e.target.checked)} className="w-4 h-4 rounded border-slate-300 text-brand-blue" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700 leading-tight break-words">limitador de velocidad</label>
                <input type="checkbox" disabled={readonly} checked={(formData['limitadordevelocidad'] as boolean) || false} onChange={(e) => handleChange('limitadordevelocidad', e.target.checked)} className="w-4 h-4 rounded border-slate-300 text-brand-blue" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700 leading-tight break-words">Alerta de tráfico cruzado trasero</label>
                <input type="checkbox" disabled={readonly} checked={(formData['Alertadetraficocruzadotrasero'] as boolean) || false} onChange={(e) => handleChange('Alertadetraficocruzadotrasero', e.target.checked)} className="w-4 h-4 rounded border-slate-300 text-brand-blue" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700 leading-tight break-words">Alerta de tráfico cruzado frontal</label>
                <input type="checkbox" disabled={readonly} checked={(formData['Alertadetraficocruzadofrontal'] as boolean) || false} onChange={(e) => handleChange('Alertadetraficocruzadofrontal', e.target.checked)} className="w-4 h-4 rounded border-slate-300 text-brand-blue" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700 leading-tight break-words">Frenado multicolisión</label>
                <input type="checkbox" disabled={readonly} checked={(formData['Frenadomulticolision'] as boolean) || false} onChange={(e) => handleChange('Frenadomulticolision', e.target.checked)} className="w-4 h-4 rounded border-slate-300 text-brand-blue" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700 leading-tight break-words">Head-Up Display</label>
                <input type="checkbox" disabled={readonly} checked={(formData['HeadUpDisplay'] as boolean) || false} onChange={(e) => handleChange('HeadUpDisplay', e.target.checked)} className="w-4 h-4 rounded border-slate-300 text-brand-blue" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700 leading-tight break-words">Radio</label>
                <input type="checkbox" disabled={readonly} checked={(formData['Radio'] as boolean) || false} onChange={(e) => handleChange('Radio', e.target.checked)} className="w-4 h-4 rounded border-slate-300 text-brand-blue" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700 leading-tight break-words">Asist. Descenso
(HDC)</label>
                <input type="checkbox" disabled={readonly} checked={(formData['AsistDescensoHDC'] as boolean) || false} onChange={(e) => handleChange('AsistDescensoHDC', e.target.checked)} className="w-4 h-4 rounded border-slate-300 text-brand-blue" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700 leading-tight break-words">Paddle Shift</label>
                <input type="checkbox" disabled={readonly} checked={(formData['PaddleShift'] as boolean) || false} onChange={(e) => handleChange('PaddleShift', e.target.checked)} className="w-4 h-4 rounded border-slate-300 text-brand-blue" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700 leading-tight break-words">Apoyabrazo delantero</label>
                <input type="checkbox" disabled={readonly} checked={(formData['Apoyabrazodelantero'] as boolean) || false} onChange={(e) => handleChange('Apoyabrazodelantero', e.target.checked)} className="w-4 h-4 rounded border-slate-300 text-brand-blue" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700 leading-tight break-words">Faros Matrix</label>
                <input type="checkbox" disabled={readonly} checked={(formData['FarosMatrix'] as boolean) || false} onChange={(e) => handleChange('FarosMatrix', e.target.checked)} className="w-4 h-4 rounded border-slate-300 text-brand-blue" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700 leading-tight break-words">Luces traseras led</label>
                <input type="checkbox" disabled={readonly} checked={(formData['Lucestraserasled'] as boolean) || false} onChange={(e) => handleChange('Lucestraserasled', e.target.checked)} className="w-4 h-4 rounded border-slate-300 text-brand-blue" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700 leading-tight break-words">Bloqueo diferencial por terreno</label>
                <input type="checkbox" disabled={readonly} checked={(formData['Bloqueodiferencialporterreno'] as boolean) || false} onChange={(e) => handleChange('Bloqueodiferencialporterreno', e.target.checked)} className="w-4 h-4 rounded border-slate-300 text-brand-blue" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700 leading-tight break-words">Número de techos que se abren</label>
                <input type={'number'} disabled={readonly} value={(formData['Numerodetechosqueseabren'] as string | number) || ''} onChange={(e) => { handleChange('Numerodetechosqueseabren', e.target.value === '' ? undefined : parseFloat(e.target.value)); }} className="w-full h-10 px-3 rounded-md border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-blue/50" step={0.01} onKeyDown={(e) => { if(['e','E','+','-','.'].includes(e.key)) e.preventDefault(); }} />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700 leading-tight break-words">Asiento ventilado</label>
                <input type="checkbox" disabled={readonly} checked={(formData['Asientoventilado'] as boolean) || false} onChange={(e) => handleChange('Asientoventilado', e.target.checked)} className="w-4 h-4 rounded border-slate-300 text-brand-blue" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700 leading-tight break-words">Asientos con masajeador (número)</label>
                <input type={'number'} disabled={readonly} value={(formData['Asientosconmasajeadornumero'] as string | number) || ''} onChange={(e) => { handleChange('Asientosconmasajeadornumero', e.target.value === '' ? undefined : parseFloat(e.target.value)); }} className="w-full h-10 px-3 rounded-md border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-blue/50" step={0.01} onKeyDown={(e) => { if(['e','E','+','-','.'].includes(e.key)) e.preventDefault(); }} />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700 leading-tight break-words">Autonomía del motor eléctrico (BEV y PHEV)</label>
                <input type={'number'} disabled={readonly} value={(formData['AutonomiadelmotorelectricoBEVyPHEV'] as string | number) || ''} onChange={(e) => { handleChange('AutonomiadelmotorelectricoBEVyPHEV', e.target.value === '' ? undefined : parseFloat(e.target.value)); }} className="w-full h-10 px-3 rounded-md border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-blue/50" step={0.01} onKeyDown={(e) => { if(['e','E','+','-','.'].includes(e.key)) e.preventDefault(); }} />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700 leading-tight break-words">City Stop</label>
                <input type="checkbox" disabled={readonly} checked={(formData['CityStop'] as boolean) || false} onChange={(e) => handleChange('CityStop', e.target.checked)} className="w-4 h-4 rounded border-slate-300 text-brand-blue" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700 leading-tight break-words">Freno de peatones</label>
                <input type="checkbox" disabled={readonly} checked={(formData['Frenodepeatones'] as boolean) || false} onChange={(e) => handleChange('Frenodepeatones', e.target.checked)} className="w-4 h-4 rounded border-slate-300 text-brand-blue" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700 leading-tight break-words">Desempañador eléctrico</label>
                <input type="checkbox" disabled={readonly} checked={(formData['Desempanadorelectrico'] as boolean) || false} onChange={(e) => handleChange('Desempanadorelectrico', e.target.checked)} className="w-4 h-4 rounded border-slate-300 text-brand-blue" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700 leading-tight break-words">Iluminación ambiental</label>
                <input type="checkbox" disabled={readonly} checked={(formData['Iluminacionambiental'] as boolean) || false} onChange={(e) => handleChange('Iluminacionambiental', e.target.checked)} className="w-4 h-4 rounded border-slate-300 text-brand-blue" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700 leading-tight break-words">Limpia-lava parabrisas trasero eléct.</label>
                <input type="checkbox" disabled={readonly} checked={(formData['Limpialavaparabrisastraseroelect'] as boolean) || false} onChange={(e) => handleChange('Limpialavaparabrisastraseroelect', e.target.checked)} className="w-4 h-4 rounded border-slate-300 text-brand-blue" />
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
                <input type="checkbox" disabled={readonly} checked={(formData['Asientotraseroconajusteelectrico'] as boolean) || false} onChange={(e) => handleChange('Asientotraseroconajusteelectrico', e.target.checked)} className="w-4 h-4 rounded border-slate-300 text-brand-blue" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700 leading-tight break-words">3ra. Fila de asientos eléctricos</label>
                <input type="checkbox" disabled={readonly} checked={(formData['3raFiladeasientoselectricos'] as boolean) || false} onChange={(e) => handleChange('3raFiladeasientoselectricos', e.target.checked)} className="w-4 h-4 rounded border-slate-300 text-brand-blue" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700 leading-tight break-words">Volante multifunción</label>
                <input type="checkbox" disabled={readonly} checked={(formData['Volantemultifuncion'] as boolean) || false} onChange={(e) => handleChange('Volantemultifuncion', e.target.checked)} className="w-4 h-4 rounded border-slate-300 text-brand-blue" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700 leading-tight break-words">Tablero digital 3D</label>
                <input type="checkbox" disabled={readonly} checked={(formData['Tablerodigital3D'] as boolean) || false} onChange={(e) => handleChange('Tablerodigital3D', e.target.checked)} className="w-4 h-4 rounded border-slate-300 text-brand-blue" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700 leading-tight break-words">Aceleracion BEV       0 a 100</label>
                <input type={'number'} disabled={readonly} value={(formData['AceleracionBEV0a100'] as string | number) || ''} onChange={(e) => { handleChange('AceleracionBEV0a100', e.target.value === '' ? undefined : parseFloat(e.target.value)); }} className="w-full h-10 px-3 rounded-md border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-blue/50" step={0.01} onKeyDown={(e) => { if(['e','E','+','-','.'].includes(e.key)) e.preventDefault(); }} />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700 leading-tight break-words">Acceleration ICE</label>
                <input type={'number'} disabled={readonly} value={(formData['AccelerationICE'] as string | number) || ''} onChange={(e) => { handleChange('AccelerationICE', e.target.value === '' ? undefined : parseFloat(e.target.value)); }} className="w-full h-10 px-3 rounded-md border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-blue/50" step={0.01} onKeyDown={(e) => { if(['e','E','+','-','.'].includes(e.key)) e.preventDefault(); }} />
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
                <label className="text-sm font-medium text-slate-700 leading-tight break-words">Cable electrico tipo 3 incluido</label>
                <input type="checkbox" disabled={readonly} checked={(formData['Cableelectricotipo3incluido'] as boolean) || false} onChange={(e) => handleChange('Cableelectricotipo3incluido', e.target.checked)} className="w-4 h-4 rounded border-slate-300 text-brand-blue" />
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
                <label className="text-sm font-medium text-slate-700 leading-tight break-words">Direccion en las cuatro ruedas</label>
                <input type="checkbox" disabled={readonly} checked={(formData['Direccionenlascuatroruedas'] as boolean) || false} onChange={(e) => handleChange('Direccionenlascuatroruedas', e.target.checked)} className="w-4 h-4 rounded border-slate-300 text-brand-blue" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700 leading-tight break-words">Luces Laser</label>
                <input type="checkbox" disabled={readonly} checked={(formData['LucesLaser'] as boolean) || false} onChange={(e) => handleChange('LucesLaser', e.target.checked)} className="w-4 h-4 rounded border-slate-300 text-brand-blue" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700 leading-tight break-words">Luces tras. OLED</label>
                <input type="checkbox" disabled={readonly} checked={(formData['LucestrasOLED'] as boolean) || false} onChange={(e) => handleChange('LucestrasOLED', e.target.checked)} className="w-4 h-4 rounded border-slate-300 text-brand-blue" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700 leading-tight break-words">Dashboard display configurable</label>
                <input type="checkbox" disabled={readonly} checked={(formData['Dashboarddisplayconfigurable'] as boolean) || false} onChange={(e) => handleChange('Dashboarddisplayconfigurable', e.target.checked)} className="w-4 h-4 rounded border-slate-300 text-brand-blue" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700 leading-tight break-words">Wireless Smartphone integration</label>
                <input type="checkbox" disabled={readonly} checked={(formData['WirelessSmartphoneintegration'] as boolean) || false} onChange={(e) => handleChange('WirelessSmartphoneintegration', e.target.checked)} className="w-4 h-4 rounded border-slate-300 text-brand-blue" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700 leading-tight break-words">Mobile phone Antenna</label>
                <input type="checkbox" disabled={readonly} checked={(formData['MobilephoneAntenna'] as boolean) || false} onChange={(e) => handleChange('MobilephoneAntenna', e.target.checked)} className="w-4 h-4 rounded border-slate-300 text-brand-blue" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700 leading-tight break-words">Deflector de viento</label>
                <input type="checkbox" disabled={readonly} checked={(formData['Deflectordeviento'] as boolean) || false} onChange={(e) => handleChange('Deflectordeviento', e.target.checked)} className="w-4 h-4 rounded border-slate-300 text-brand-blue" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700 leading-tight break-words">Asientos deportivos</label>
                <input type="checkbox" disabled={readonly} checked={(formData['Asientosdeportivos'] as boolean) || false} onChange={(e) => handleChange('Asientosdeportivos', e.target.checked)} className="w-4 h-4 rounded border-slate-300 text-brand-blue" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700 leading-tight break-words">Seat adjustment, memory (Driver)</label>
                <input type="checkbox" disabled={readonly} checked={(formData['SeatadjustmentmemoryDriver'] as boolean) || false} onChange={(e) => handleChange('SeatadjustmentmemoryDriver', e.target.checked)} className="w-4 h-4 rounded border-slate-300 text-brand-blue" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700 leading-tight break-words">Seat adjustment, memory (Co-Driver)</label>
                <input type="checkbox" disabled={readonly} checked={(formData['SeatadjustmentmemoryCoDriver'] as boolean) || false} onChange={(e) => handleChange('SeatadjustmentmemoryCoDriver', e.target.checked)} className="w-4 h-4 rounded border-slate-300 text-brand-blue" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700 leading-tight break-words">Lumbar, Lumbar adjustment front (Driver)</label>
                <input type="checkbox" disabled={readonly} checked={(formData['LumbarLumbaradjustmentfrontDriver'] as boolean) || false} onChange={(e) => handleChange('LumbarLumbaradjustmentfrontDriver', e.target.checked)} className="w-4 h-4 rounded border-slate-300 text-brand-blue" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700 leading-tight break-words">Lumbar, Lumbar adjustment front (Co-Driver)</label>
                <input type="checkbox" disabled={readonly} checked={(formData['LumbarLumbaradjustmentfrontCoDriver'] as boolean) || false} onChange={(e) => handleChange('LumbarLumbaradjustmentfrontCoDriver', e.target.checked)} className="w-4 h-4 rounded border-slate-300 text-brand-blue" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700 leading-tight break-words">Seat heating, rear</label>
                <input type="checkbox" disabled={readonly} checked={(formData['Seatheatingrear'] as boolean) || false} onChange={(e) => handleChange('Seatheatingrear', e.target.checked)} className="w-4 h-4 rounded border-slate-300 text-brand-blue" />
              </div>
            </div>
          </CardContent>
        </div>
      </Card>

      {!readonly && (
        <div className="flex justify-end gap-3 pt-6 border-t mt-8">
          <Button 
            type="button" 
            variant="outline" 
            onClick={onCancel || (() => window.history.back())}
          >
            Cancelar
          </Button>

          {onSave && (
            <Button 
              type="button" 
              variant="secondary" 
              onClick={() => handleAction('save')}
            >
              <Save className="h-4 w-4 mr-2" />
              Guardar Progreso
            </Button>
          )}

          {onSendRevision && (
            <Button 
              type="submit" 
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Save className="h-4 w-4 mr-2" />
              Enviar a Revisión
            </Button>
          )}
        </div>
      )}
    </form>
  );
};
