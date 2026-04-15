const fs = require('fs');
let c = fs.readFileSync('C:/Users/Administrador/Documents/GitHub/Base-De-Datos-Autodata/frontend/scripts/generate-form-equipamiento-updated.cjs', 'utf-8');

c = c.replace(/\{\\'\\\\$\\{category\\}\\\' === \\'Electricos\\' && \\(/g, "\\\\)/g, "\ : ''}");

fs.writeFileSync('C:/Users/Administrador/Documents/GitHub/Base-De-Datos-Autodata/frontend/scripts/generate-form-equipamiento-updated.cjs', c, 'utf-8');
