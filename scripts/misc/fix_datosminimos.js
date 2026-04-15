const fs = require('fs');
const p = 'frontend/src/components/modelos/FormularioDatosMinimos.tsx';
let txt = fs.readFileSync(p, 'utf-8');

txt = txt.replace(
  /<input\s+type="number"\s+value=\{formData.Cilindros/g,
  `<input\n                  type="number"\n                  onKeyDown={(e) => { if(['e','E','+','-','.'].includes(e.key)) e.preventDefault(); }}\n                  value={formData.Cilindros`
);

txt = txt.replace(
  /<input\s+type="number"\s+value=\{formData.Valvulas/g,
  `<input\n                  type="number"\n                  onKeyDown={(e) => { if(['e','E','+','-','.'].includes(e.key)) e.preventDefault(); }}\n                  value={formData.Valvulas`
);

txt = txt.replace(
  /<input\s+type="number"\s+value=\{formData.CC/g,
  `<input\n                  type="number"\n                  onKeyDown={(e) => { if(['e','E','+','-','.'].includes(e.key)) e.preventDefault(); }}\n                  value={formData.CC`
);

txt = txt.replace(
  /<input\s+type="number"\s+value=\{formData.HP/g,
  `<input\n                  type="number"\n                  onKeyDown={(e) => { if(['e','E','+','-','.'].includes(e.key)) e.preventDefault(); }}\n                  value={formData.HP`
);

txt = txt.replace(
  /<input\s+type="number"\s+value=\{formData.Puertas/g,
  `<input\n                  type="number"\n                  onKeyDown={(e) => { if(['e','E','+','-','.'].includes(e.key)) e.preventDefault(); }}\n                  value={formData.Puertas`
);

txt = txt.replace(
  /<input\s+type="number"\s+value=\{formData.Asientos/g,
  `<input\n                  type="number"\n                  onKeyDown={(e) => { if(['e','E','+','-','.'].includes(e.key)) e.preventDefault(); }}\n                  value={formData.Asientos`
);

txt = txt.replace(
  /placeholder="Ej: BEV, PHEV, HEV"\s*\/>/g,
  `placeholder="Ej: BEV, PHEV, HEV"\n                  list="tipoVehiculoElectrico"\n                />\n                <datalist id="tipoVehiculoElectrico">\n                  <option value="BEV" />\n                  <option value="HEV" />\n                  <option value="PHEV" />\n                  <option value="MHEV" />\n                  <option value="EREV" />\n                  <option value="FCEV" />\n                </datalist>`
);

txt = txt.replace(
  /placeholder="Ej: 6AT, CVT, 7DCT, Manual"\s*\/>/g,
  `placeholder="Ej: CVT"\n                  list="tiposCajaAut"\n                />\n                <datalist id="tiposCajaAut">\n                  <option value="N/A" />\n                  <option value="DCT" />\n                  <option value="DHT" />\n                  <option value="CVT" />\n                  <option value="e-CVT" />\n                  <option value="Convertidor de par" />\n                  <option value="AMT" />\n                </datalist>`
);

fs.writeFileSync(p, txt);
console.log('Fixed FormularioDatosMinimos.tsx');