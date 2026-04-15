const fs = require('fs');
const file = 'c:/Users/Administrador/Documents/GitHub/Base-De-Datos-Autodata/frontend/src/components/modelos/FormularioEquipamiento.tsx';
let content = fs.readFileSync(file, 'utf-8');

content = content.replace(
  /return \(\n    <form className="space-y-6"/,
  `
  try {
    // testing eval
    return (
      <form className="space-y-6"`
);

content = content.replace(
  /    <\/form>\n  \);\n\};\n/,
  `    </form>
    );
  } catch (error) {
    console.error("FORMULARIO EQUIPAMIENTO CRASH:", error);
    return <div className="text-red-500">Error: {String(error)}</div>;
  }
};
`
);

fs.writeFileSync(file, content);
