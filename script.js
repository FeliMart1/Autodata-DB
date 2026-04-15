const fs = require('fs');
let content = fs.readFileSync('frontend/scripts/generate-form-equipamiento-updated.cjs', 'utf-8');

const target1 = \        <div className={seccionesAbiertas['\\\'] ? 'block' : 'hidden'}>
          <CardContent className="pt-0 pb-5">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 px-4">\;

const replace1 = \        <div className={seccionesAbiertas['\\\'] ? 'block' : 'hidden'}>
          <CardContent className="pt-0 pb-5">
            {category === 'Electricos' && (
              <div className="px-4 pb-4 mt-4 border-b">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-800 text-lg">¿Es un vehículo eléctrico o híbrido?</span>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="radio" name="is_electrico_toggle" checked={isElectrico} onChange={() => setIsElectrico(true)} disabled={readonly} className="text-brand-blue ring-brand-blue" />
                      <span className="text-base font-medium">Sí</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="radio" name="is_electrico_toggle" checked={!isElectrico} onChange={() => { setIsElectrico(false); ['TipoVehiculoElectrico','TipodeVehiculoElectricoHibrido','EPedal','CapacidadTanqueHidrogeno','CapTanqueHidrgeno','AutonomiaMaxRange','AutonomaMaxRangeenkilometros','CicloNorma','PotenciaMotor','PotenciamotorKW','CapacidadOperativaBateria','CapoperativabatBatterycapacityKwh','PotenciaCargaMax','PotenciadecargaPotMxKWenCA','TiposConectores','Tiposdeconectores','GarantiaCapBat','TecnologiaBat'].forEach(f => handleChange(f, undefined)); }} disabled={readonly} className="text-brand-blue ring-brand-blue" />
                      <span className="text-base font-medium">No</span>
                    </label>
                  </div>
                </div>
              </div>
            )}
            <div className={\\\grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 px-4 \\\\\\}>\;

content = content.replace(target1, replace1);

const spliceStart = content.indexOf("if (category === 'Equipamiento' && categorizedFields['Electricos']");
if (spliceStart > -1) {
  const spliceEnd = content.indexOf("reactContent += \    </form>\\n  );\\n};\\n\;", spliceStart);
  if (spliceEnd > -1) {
     content = content.substring(0, spliceStart) + content.substring(spliceEnd);
  }
}

fs.writeFileSync('frontend/scripts/generate-form-equipamiento-updated.cjs', content);
console.log('Script updated');
