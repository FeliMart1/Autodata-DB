const fs = require('fs');
let c = fs.readFileSync('frontend/scripts/generate-form-equipamiento-updated.cjs', 'utf-8');
let s = c.indexOf("  if (category === 'Equipamiento' &&");
if (s > -1) {
  let e2 = c.indexOf("});", s);
  if (e2 > -1) {
    let newC = c.slice(0, s) + "  reactContent += `            </div>\n          </CardContent>\n        </div>\n      </Card>\n`;\n" + c.slice(e2);
    fs.writeFileSync('frontend/scripts/generate-form-equipamiento-updated.cjs', newC);
    console.log("success");
  }
}