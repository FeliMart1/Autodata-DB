const fs = require('fs');
let code = fs.readFileSync('src/components/modelos/FormularioEquipamiento.tsx', 'utf8');

[
  "{'Mecanica' === 'Mecanica' && (",
  "{'Equipamiento' === 'Equipamiento' && ("
].forEach(target => {
  const start = code.indexOf(target);
  if (start !== -1) {
    // Find the end of this block by finding the next `)}` that matches the open
    // Since it's exactly 18 lines down roughly, let's just find the closing tags:
    let end = code.indexOf(')}', start);
    
    // Actually the block is exactly this:
    /*
            {'Mecanica' === 'Mecanica' && (
              <div ...>
                ...
              </div>
            )}
    */
    // There are multiple `)}` inside onChange potentially. 
    // The safest is to use a specific string that ends the block:
    const closeStr = "</div>\n            )}";
    end = code.indexOf(closeStr, start) + closeStr.length;
    
    if (end > start + 100) {
      code = code.substring(0, start).trimEnd() + '\n' + code.substring(end).trimStart();
    }
  } else {
    console.log("NOT FOUND:", target);
  }
});

fs.writeFileSync('src/components/modelos/FormularioEquipamiento.tsx', code, 'utf8');
