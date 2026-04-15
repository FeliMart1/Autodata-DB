const fs = require('fs');
let gen = fs.readFileSync('c:/Users/Administrador/Documents/GitHub/Base-De-Datos-Autodata/frontend/scripts/generate-form-equipamiento-updated.cjs', 'utf-8');
console.log(gen.includes('Equipamiento: false'));

gen = gen.replace(
  /Equipamiento: false[\s\n\r]*\}\);/g,
  `Equipamiento: false
    });

  const isElectricoInitial = ['TipoVehiculoElectrico','TipodeVehiculoElectricoHibrido','EPedal','CapacidadTanqueHidrogeno','CapTanqueHidrgeno','AutonomiaMaxRange','AutonomaMaxRangeenkilometros','CicloNorma','PotenciaMotor','PotenciamotorKW','CapacidadOperativaBateria','CapoperativabatBatterycapacityKwh','PotenciaCargaMax','PotenciadecargaPotMxKWenCA','TiposConectores','Tiposdeconectores','GarantiaCapBat','TecnologiaBat'].some((f) => equipamiento[f] != null && equipamiento[f] !== '' && equipamiento[f] !== false);
  const [isElectrico, setIsElectrico] = useState(isElectricoInitial);`
);

console.log(gen.includes('isElectricoInitial'));

fs.writeFileSync('c:/Users/Administrador/Documents/GitHub/Base-De-Datos-Autodata/frontend/scripts/generate-form-equipamiento-updated.cjs', gen);
