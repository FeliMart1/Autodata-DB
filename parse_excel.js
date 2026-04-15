// read json
const fs = require('fs');
const data = JSON.parse(fs.readFileSync('config_vehiculos.json'));

const headers = data[0];
const config = {};

headers.forEach((header, index) => {
    if (!header) return;
    config[header] = [];
    for (let i = 1; i < data.length; i++) {
        const val = data[i][index];
        if (val !== undefined && val !== null && val !== '') {
            config[header].push(val);
        }
    }
});

fs.writeFileSync('config_parsed.json', JSON.stringify(config, null, 2));
console.log('Parsed');