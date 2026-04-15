const fs = require('fs');

let content = fs.readFileSync('frontend/scripts/generate-form-equipamiento-updated.cjs', 'utf-8');

// Replace Electrico_Fields with Electricos
content = content.replace(/Electrico_Fields/g, 'Electricos');

// Reorder categorizedFields
content = content.replace(
  "const categorizedFields = { Dimensiones: [], 'Mecanica': [], Equipamiento: [], Electricos: [] };",
  "const categorizedFields = { Electricos: [], Dimensiones: [], 'Mecanica': [], Equipamiento: [] };"
);

// Ensure Electricos gets an initial state
content = content.replace(
  "    Dimensiones: true,\r\n    Mecanica: false,\r\n    Equipamiento: false",
  "    Electricos: true,\n    Dimensiones: false,\n    Mecanica: false,\n    Equipamiento: false"
);

// Allow iteration over Electricos
content = content.replace(
  "Object.keys(categorizedFields).filter(c => c !== 'Electricos').forEach(category => {",
  "Object.keys(categorizedFields).forEach(category => {"
);

fs.writeFileSync('frontend/scripts/generate-form-equipamiento-updated.cjs', content);
console.log('Done replacement');
