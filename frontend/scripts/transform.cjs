const fs = require('fs');

let gen = fs.readFileSync('c:/Users/Administrador/Documents/GitHub/Base-De-Datos-Autodata/frontend/scripts/generate-form-equipamiento.cjs', 'utf-8');

gen = gen.replace(
  /if \(rulesStr\.includes\('con decimales'\)\) \{[\s\S]*?result\.extraOnKeyDown = true;\n  \}/,
  `if (rulesStr.includes('con decimales') || rulesStr.includes('dos decimales')) {
    result.props.step = 'any';
  } else if (rulesStr.includes('sin decimales') || rulesStr.includes('cuatro cifras') || rulesStr.includes('dos cifras') || normField.includes('pardelmotor')) {
    result.props.step = 1;
    result.extraOnKeyDown = true;
  } else if (result.inputType === 'number') {
    result.props.step = 'any';
  }`
);

gen = gen.replace(
  /if \(\!matchingKey\) return result;/,
  `
  if (normField.includes('sistemamultimedia') || normField.includes('sistmultimedia')) {
      result.inputType = 'datalist';
      result.options = ['Composition Media', 'Full Link', 'Media Nav', 'Media Sistem', 'Mirror Link', 'Touch Infotainment', 'Nissan door-to-door', 'R-Link Evolution'];
  }
  if (normField.includes('maleteraapertura')) {
      result.inputType = 'select';
      result.options = ['Motorizada', 'Foot-control', 'No'];
  }
  if (normField.includes('bloqueodiferencialporterreno') || normField.includes('bloquediferencialterreno') || normField.includes('bloqueodiferencialpor') || normField.includes('bloquediferencial')) {
      result.inputType = 'select';
      result.options = ['Si', 'No'];
  }
  if (normField.includes('pardelmotor')) {
      result.props.step = 1;
      result.extraOnKeyDown = true;
  }
  
  if (!matchingKey) return result;
  `
);

const electricFieldsList = [
    'tipovehiculoelectrico', 'tipodevehiculoelectrico', 'epedal', 'capacidadtanquehidrogeno', 'captanquehidrgeno',
    'autonomamaxrange', 'autonomamaxrangeenkilometros', 'ciclonorma', 'potenciamotor', 'potenciamotorkw',
    'capacidadoperativabateria', 'capoperativabat', 'potenciacargamax', 'potenciadecargapotmxkwenca',
    'tiposconectores', 'tiposdeconectores', 'garantiacapbat', 'tecnologiabat'
];

gen = gen.replace(
  /const categorizer = \(field\) => \{[\s\S]*?return 'Equipamiento';\n\};/,
  `
const categorizer = (field) => {
  const name = field.name.toLowerCase();
  if (${JSON.stringify(electricFieldsList)}.some(k => name.includes(k))) return 'Electrico_Fields';

  if (['largo', 'ancho', 'altura', 'peso', 'ejes', 'puertas', 'asientos', 'kg', 'capacidad', 'volumen', 'carga', 'neumaticos', 'llantas', 'diametro', 'despeje'].some(k => name.includes(k))) return 'Dimensiones';
  if (['cilindros', 'valvulas', 'inyeccion', 'traccion', 'suspension', 'caja', 'marchas', 'turbo', 'aceite', 'norma', 'startstop', 'motor', 'bateria', 'epedal', 'consumo', 'co2', 'aceleracion', 'chassis', 'freno'].some(k => name.includes(k))) return 'Mecanica';
  return 'Equipamiento';
};`
);

gen = gen.replace(/const categorizedFields = \{ Dimensiones: \[\], 'Mecanica': \[\], Equipamiento: \[\] \};/, 
  `const categorizedFields = { Dimensiones: [], 'Mecanica': [], Equipamiento: [], Electrico_Fields: [] };`);

gen = gen.replace(
  /Equipamiento: false\n    \}\);/,
  `Equipamiento: false\n    });\n\n  const isElectricoInitial = ['TipoVehiculoElectrico','TipodeVehiculoElectricoHibrido','EPedal','CapacidadTanqueHidrogeno','CapTanqueHidrgeno','AutonomiaMaxRange','AutonomaMaxRangeenkilometros','CicloNorma','PotenciaMotor','PotenciamotorKW','CapacidadOperativaBateria','CapoperativabatBatterycapacityKwh','PotenciaCargaMax','PotenciadecargaPotMxKWenCA','TiposConectores','Tiposdeconectores','GarantiaCapBat','TecnologiaBat'].some(f => equipamiento[f as keyof EquipamientoModelo] != null && equipamiento[f as keyof EquipamientoModelo] !== '' && equipamiento[f as keyof EquipamientoModelo] !== false);\n  const [isElectrico, setIsElectrico] = useState<boolean>(isElectricoInitial);`
);

gen = gen.replace(
  /Object\.keys\(categorizedFields\)\.forEach\(category => \{/,
  `Object.keys(categorizedFields).filter(c => c !== 'Electrico_Fields').forEach(category => {`
);

gen = gen.replace(
  /reactContent \+= \`            <\/div>\n          <\/CardContent>\n        <\/div>\n      <\/Card>\\n\`;/g,
  `
  if (category === 'Equipamiento' && categorizedFields['Electrico_Fields'] && categorizedFields['Electrico_Fields'].length) {
      reactContent += \`
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
      \`;
      
      categorizedFields['Electrico_Fields'].forEach(f => {
        const c = getFieldOptionsAndProps(f.name);
        let propsObj = {...c.props};
        let extraPropsStr = '';
        Object.keys(propsObj).forEach(k => {
          let val = propsObj[k];
          if (typeof val === 'string') extraPropsStr += \` \${k}="\${val}"\`;
          else extraPropsStr += \` \${k}={\${val}}\`;
        });
        
        let onKeyDownCode = '';
        if (c.extraOnKeyDown) {
            onKeyDownCode = \` onKeyDown={(e) => { if(['e','E','+','-','.'].includes(e.key)) e.preventDefault(); }}\`;
        }

        let onChangeCode = \`handleChange('\${f.name}', e.target.value);\`;

        if (f.type === 'number' || c.inputType === 'number') {
            if (c.maxLengthToSlice) {
                onChangeCode = \`
                const raw = e.target.value;
                let sliced = raw;
                if (raw && raw.length > \${c.maxLengthToSlice}) {
                  sliced = raw.slice(0, \${c.maxLengthToSlice});
                }
                handleChange('\${f.name}', sliced === '' ? undefined : parseFloat(sliced));
                \`;
            } else {
                onChangeCode = \`handleChange('\${f.name}', e.target.value === '' ? undefined : parseFloat(e.target.value));\`;
            }
        } 
        
        if (c.props.pattern === "^[A-Z]*$") {
            onChangeCode = \`handleChange('\${f.name}', e.target.value.replace(/[^A-Za-z]/g, '').toUpperCase());\`;
        }

        reactContent += \`              <div className="flex flex-col gap-1.5">\\n\`;
        reactContent += \`                <label className="text-sm font-medium text-slate-700 leading-tight break-words">\${c.label || f.name.replace(/([A-Z])/g, ' $1').trim()}</label>\\n\`;
        if (f.type === 'boolean') {
            reactContent += \`                <input type="checkbox" disabled={readonly} checked={(formData['\${f.name}'] as boolean) || false} onChange={(e) => handleChange('\${f.name}', e.target.checked)} className="w-4 h-4 rounded border-slate-300 text-brand-blue" />\\n\`;
        } else if (c.inputType === 'select') {
            reactContent += \`                <select disabled={readonly} value={(formData['\${f.name}'] as string | number) || ''} onChange={(e) => { \${onChangeCode} }} className="w-full h-10 px-3 rounded-md border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-blue/50 bg-white"\${extraPropsStr}>\\n\`;
            reactContent += \`                  <option value="">Seleccionar...</option>\\n\`;
            c.options.forEach(opt => {
                reactContent += \`                  <option value="\${opt}">\${opt}</option>\\n\`;
            });
            reactContent += \`                </select>\\n\`;
        } else if (c.inputType === 'datalist') {
            reactContent += \`                <input type="text" list="\${f.name}_list" disabled={readonly} value={(formData['\${f.name}'] as string | number) || ''} onChange={(e) => { \${onChangeCode} }} className="w-full h-10 px-3 rounded-md border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-blue/50"\${extraPropsStr}\${onKeyDownCode} />\\n\`;
            reactContent += \`                <datalist id="\${f.name}_list">\\n\`;
            c.options.forEach(opt => {
                reactContent += \`                  <option value="\${opt}" />\\n\`;
            });
            reactContent += \`                </datalist>\\n\`;
        } else {
            reactContent += \`                <input type={'\${c.inputType === 'number' || f.type === 'number' ? 'number' : 'text'}'} disabled={readonly} value={(formData['\${f.name}'] as string | number) || ''} onChange={(e) => { \${onChangeCode} }} className="w-full h-10 px-3 rounded-md border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-blue/50"\${extraPropsStr}\${onKeyDownCode} />\\n\`;
        }
        
        reactContent += \`              </div>\\n\`;
      });
      
      reactContent += \`
                  </div>
                )}
              </div>
      \`;
  }
  reactContent += \`            </div>\\n          </CardContent>\\n        </div>\\n      </Card>\\n\`;
`
);

fs.writeFileSync('c:/Users/Administrador/Documents/GitHub/Base-De-Datos-Autodata/frontend/scripts/generate-form-equipamiento-updated.cjs', gen);
