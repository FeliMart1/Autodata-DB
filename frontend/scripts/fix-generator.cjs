const fs = require('fs');
const file = 'c:/Users/Administrador/Documents/GitHub/Base-De-Datos-Autodata/frontend/scripts/generate-form-equipamiento-updated.cjs';
let content = fs.readFileSync(file, 'utf-8');

content = content.replace(
    /equipamiento\[f as keyof EquipamientoModelo\]/g,
    `(equipamiento || {})[f as keyof EquipamientoModelo]`
);

// wait the previous output showed:
// some((f) => equipamiento[f] != null && equipamiento[f] !== '' && equipamiento[f] !== false);
// Let's just blindly replace `equipamiento[f` with `(equipamiento || {})[f`
content = content.replace(
    /equipamiento\[f/g,
    `(equipamiento || {})[f`
);

fs.writeFileSync(file, content);
