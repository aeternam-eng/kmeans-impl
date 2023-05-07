import fs from 'fs';

const municipios = fs.readFileSync('./municipios.json');
const json = JSON.parse(municipios);
const municipiosmg = json.filter(m => m.codigo_uf === 31);

console.log(`Salvando ${municipiosmg.length} municipios de MG`);
fs.writeFileSync('./municipiosmg.json', JSON.stringify(municipiosmg, undefined, 2));
