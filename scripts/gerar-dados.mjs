// Gera os arquivos de dados de Foz do Iguaçu usados pelo app (pontos de apoio e etiquetas de iluminação),
// a partir da Overpass. Rodar de vez em quando: `node scripts/gerar-dados.mjs`. O app nunca consulta a Overpass.
import { writeFileSync } from 'node:fs';

const UA = 'SAFEWAY-dados/0.1 (projeto social educativo; https://github.com/kakaneto/safeway)';
const INSTANCIAS = [
  'https://overpass-api.de/api/interpreter',
  'https://overpass.private.coffee/api/interpreter',
  'https://maps.mail.ru/osm/tools/overpass/api/interpreter',
];
const AREA_FOZ = 3600297473; // relação 297473 do OpenStreetMap

async function consultar(consulta) {
  for (const url of INSTANCIAS) {
    try {
      const r = await fetch(url, {
        method: 'POST',
        headers: { 'User-Agent': UA, 'Content-Type': 'application/x-www-form-urlencoded' },
        body: 'data=' + encodeURIComponent(consulta),
        signal: AbortSignal.timeout(240000),
      });
      if (r.ok) return await r.json();
      console.log(`${new URL(url).host}: HTTP ${r.status}`);
    } catch (e) {
      console.log(`${new URL(url).host}: ${e.message}`);
    }
    await new Promise((r) => setTimeout(r, 5000));
  }
  throw new Error('nenhuma instância da Overpass respondeu');
}

function categoria(t) {
  if (t.amenity === 'police') return 'policia';
  if (t.amenity === 'fire_station') return 'bombeiros';
  if (t.amenity === 'hospital') return 'hospital';
  if (['clinic', 'doctors'].includes(t.amenity) || t.healthcare) return 'saude';
  if (t.amenity === 'pharmacy') return 'farmacia';
  if (['social_facility', 'community_centre'].includes(t.amenity) || t.office === 'government')
    return 'assistencia';
  if (t.amenity === 'library') return 'biblioteca';
  return null;
}

let falhas = 0;
try {
  const apoio = await consultar(`[out:json][timeout:180];
area(id:${AREA_FOZ})->.foz;
(
  nwr(area.foz)["amenity"~"^(police|fire_station|hospital|clinic|doctors|pharmacy|social_facility|community_centre|library)$"];
  nwr(area.foz)["healthcare"];
  nwr(area.foz)["office"="government"];
);
out tags center;`);
  const pontos = apoio.elements
    .map((e) => {
      const t = e.tags || {};
      const tipo = categoria(t);
      const lat = e.lat ?? e.center?.lat;
      const lon = e.lon ?? e.center?.lon;
      if (!tipo || lat == null || !t.name) return null;
      return {
        id: `${e.type}/${e.id}`,
        tipo,
        nome: t.name,
        lat: +lat.toFixed(6),
        lon: +lon.toFixed(6),
        ...(t.opening_hours ? { horario: t.opening_hours } : {}),
        ...(t.phone || t['contact:phone'] ? { telefone: t.phone || t['contact:phone'] } : {}),
      };
    })
    .filter(Boolean);
  writeFileSync(
    'public/dados/pontos-de-apoio-osm.json',
    JSON.stringify({
      fonte: 'OpenStreetMap (© OpenStreetMap contributors, ODbL)',
      dadosDe: apoio.osm3s?.timestamp_osm_base,
      pontos,
    }) + '\n',
  );
  console.log(
    `pontos de apoio: ${pontos.length} (dados do OSM de ${apoio.osm3s?.timestamp_osm_base})`,
  );
} catch (erro) {
  falhas++;
  console.log(`pontos de apoio: FALHOU (${erro.message}); o arquivo anterior foi mantido`);
}

try {
  const luz = await consultar(`[out:json][timeout:180];
area(id:${AREA_FOZ})->.foz;
way(area.foz)["highway"]["lit"];
out tags;`);
  const vias = Object.fromEntries(luz.elements.map((e) => [e.id, e.tags.lit]));
  writeFileSync(
    'public/dados/iluminacao-foz.json',
    JSON.stringify({
      fonte: 'OpenStreetMap (© OpenStreetMap contributors, ODbL)',
      dadosDe: luz.osm3s?.timestamp_osm_base,
      vias,
    }) + '\n',
  );
  console.log(`vias com etiqueta lit: ${Object.keys(vias).length}`);
} catch (erro) {
  falhas++;
  console.log(`iluminação: FALHOU (${erro.message}); o arquivo anterior foi mantido`);
}
process.exitCode = falhas ? 1 : 0;
