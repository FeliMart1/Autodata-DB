require('@babel/register')({
  presets: ['@babel/preset-env', '@babel/preset-react', '@babel/preset-typescript'],
  extensions: ['.ts', '.tsx']
});
const React = require('react');
const ReactDOMServer = require('react-dom/server');
const fs = require('fs');

const equipamientoCode = fs.readFileSync('c:/Users/Administrador/Documents/GitHub/Base-De-Datos-Autodata/frontend/src/components/modelos/FormularioEquipamiento.tsx', 'utf-8');
const ReactScript = require('c:/Users/Administrador/Documents/GitHub/Base-De-Datos-Autodata/frontend/src/components/modelos/FormularioEquipamiento.tsx');

try {
  let e = ReactScript.FormularioEquipamiento({ equipamiento: {} });
  let text = ReactDOMServer.renderToString(e);
  console.log("Rendered OK", text.substring(0, 20));
} catch (err) {
  console.log("CRASH:", err);
}
