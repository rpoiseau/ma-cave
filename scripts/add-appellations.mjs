// One-shot generator: injects the AOC/AOP viticoles missing from appellations.ts
// (audit INAO 2025-12-31, cf. docs/audit-appellations-inao.md).
//
// Garde windows (min/max) are CURATED ESTIMATES to refine by hand (Guide Hachette,
// Decanter) — no open source provides them. Region/color/grapes follow the INAO
// cahiers des charges + Jancis Robinson Oxford Companion. Run:
//   node scripts/add-appellations.mjs
import fs from 'node:fs'

const FILE = 'src/domain/value-objects/appellations.ts'

// color code -> WineColor enum member
const C = { red: 'Red', white: 'White', rose: 'Rose', spark: 'Sparkling', sweet: 'Sweet' }

// [name, region, color, min, max, grapes[], style, investment]
const WINES = [
  // --- LANGUEDOC / ROUSSILLON ---
  ['Grand Roussillon', 'Roussillon', 'sweet', 5, 15, ['Grenache', 'Macabeu', 'Muscat'], 'Vin doux naturel du Roussillon', 'low'],
  ['Muscat de Saint-Jean-de-Minervois', 'Languedoc', 'sweet', 1, 4, ['Muscat à petits grains'], 'Muscat doux naturel, floral et frais', 'low'],
  ['Malepère', 'Languedoc', 'red', 3, 8, ['Merlot', 'Cabernet Franc', 'Cot'], 'Rouge de transition océanique/méditerranéen', 'low'],
  ['Boutenac', 'Languedoc', 'red', 5, 12, ['Carignan', 'Grenache', 'Syrah', 'Mourvèdre'], 'Cru du Corbières sur Carignan de vieilles vignes', 'moderate'],
  ['Clairette du Languedoc', 'Languedoc', 'white', 2, 5, ['Clairette'], 'Blanc sec de cépage Clairette', 'low'],
  ['Sable de Camargue', 'Languedoc', 'rose', 1, 2, ['Grenache', 'Cinsault'], 'Gris de sable à boire jeune', 'low'],
  ['Muscat de Mireval', 'Languedoc', 'sweet', 1, 4, ['Muscat à petits grains'], 'Muscat doux naturel méditerranéen', 'low'],
  ['Muscat de Lunel', 'Languedoc', 'sweet', 1, 4, ['Muscat à petits grains'], 'Muscat doux naturel, fruits confits', 'low'],
  ['Clairette de Bellegarde', 'Languedoc', 'white', 1, 3, ['Clairette'], 'Blanc sec de Clairette, à boire jeune', 'low'],
  // --- RHÔNE / DIOIS ---
  ['Côtes du Vivarais', 'Rhône Sud', 'red', 2, 5, ['Grenache', 'Syrah'], 'Rouge léger des contreforts ardéchois', 'low'],
  ['Grignan-les-Adhémar', 'Rhône Sud', 'red', 2, 6, ['Grenache', 'Syrah'], 'Rouge épicé de la Drôme provençale', 'low'],
  ['Coteaux de Die', 'Rhône', 'white', 1, 3, ['Clairette'], 'Blanc tranquille de Clairette du Diois', 'low'],
  ['Châtillon-en-Diois', 'Rhône', 'red', 2, 5, ['Gamay', 'Pinot Noir'], 'Rouge alpin léger du Diois', 'low'],
  ['Crémant de Die', 'Rhône', 'spark', 1, 3, ['Clairette', 'Aligoté', 'Muscat'], 'Effervescent méthode traditionnelle du Diois', 'low'],
  ['Beaumes de Venise', 'Rhône Sud', 'red', 3, 8, ['Grenache', 'Syrah'], 'Rouge corsé du sud du Vaucluse', 'moderate'],
  ["Duché d'Uzès", 'Rhône Sud', 'red', 2, 6, ['Grenache', 'Syrah'], 'Rouge méridional du Gard', 'low'],
  // --- PROVENCE ---
  ['Pierrevert', 'Provence', 'rose', 1, 3, ['Grenache', 'Syrah', 'Cinsault'], 'Rosé/rouge d’altitude des Alpes-de-Haute-Provence', 'low'],
  ["Coteaux d'Aix-en-Provence", 'Provence', 'rose', 1, 3, ['Grenache', 'Syrah', 'Cinsault', 'Cabernet Sauvignon'], 'Rosé provençal frais et fruité', 'low'],
  // --- BORDEAUX / BERGERAC ---
  ['Saint-Georges-Saint-Emilion', 'Bordeaux', 'red', 5, 12, ['Merlot', 'Cabernet Franc'], 'Satellite de Saint-Émilion, charnu', 'moderate'],
  ['Lussac Saint-Emilion', 'Bordeaux', 'red', 4, 10, ['Merlot', 'Cabernet Franc'], 'Satellite de Saint-Émilion sur Merlot', 'low'],
  ['Puisseguin Saint-Emilion', 'Bordeaux', 'red', 4, 10, ['Merlot', 'Cabernet Franc'], 'Satellite de Saint-Émilion, rond', 'low'],
  ['Montravel', 'Sud-Ouest', 'white', 2, 6, ['Sauvignon Blanc', 'Sémillon', 'Muscadelle'], 'Blanc sec du Bergeracois', 'low'],
  ['Haut-Montravel', 'Sud-Ouest', 'sweet', 3, 10, ['Sémillon', 'Sauvignon Blanc'], 'Liquoreux du Bergeracois', 'low'],
  ['Côtes de Montravel', 'Sud-Ouest', 'sweet', 2, 6, ['Sémillon', 'Sauvignon Blanc'], 'Moelleux du Bergeracois', 'low'],
  ['Côtes de Bergerac', 'Sud-Ouest', 'red', 3, 8, ['Merlot', 'Cabernet Sauvignon', 'Cabernet Franc'], 'Rouge structuré du Bergeracois', 'low'],
  ['Premières Côtes de Bordeaux', 'Bordeaux', 'sweet', 3, 8, ['Sémillon', 'Sauvignon Blanc'], 'Blanc moelleux de la rive droite', 'low'],
  ['Côtes de Bordeaux', 'Bordeaux', 'red', 3, 8, ['Merlot', 'Cabernet Sauvignon'], 'Rouge d’assemblage bordelais souple', 'low'],
  ['Côtes de Bordeaux-Saint-Macaire', 'Bordeaux', 'sweet', 2, 6, ['Sémillon', 'Sauvignon Blanc', 'Muscadelle'], 'Blanc moelleux confidentiel', 'low'],
  ['Cérons', 'Bordeaux', 'sweet', 5, 15, ['Sémillon', 'Sauvignon Blanc'], 'Liquoreux voisin de Sauternes', 'moderate'],
  ['Graves de Vayres', 'Bordeaux', 'red', 2, 6, ['Merlot', 'Cabernet Franc'], 'Rouge souple de l’Entre-deux-Mers', 'low'],
  ['Graves supérieures', 'Bordeaux', 'sweet', 3, 10, ['Sémillon', 'Sauvignon Blanc'], 'Blanc moelleux des Graves', 'low'],
  ['Corrèze', 'Sud-Ouest', 'red', 2, 6, ['Cabernet Franc', 'Merlot', 'Gamay'], 'Rouge de coteaux corréziens', 'low'],
  ['Rosette', 'Sud-Ouest', 'sweet', 2, 6, ['Sémillon', 'Sauvignon Blanc'], 'Moelleux léger du Bergeracois', 'low'],
  // --- BOURGOGNE : grands crus & autres ---
  ['Saint-Bris', 'Bourgogne', 'white', 2, 5, ['Sauvignon Blanc'], 'Unique Sauvignon AOC de Bourgogne', 'low'],
  ['Bienvenues-Bâtard-Montrachet', 'Bourgogne', 'white', 8, 25, ['Chardonnay'], 'Grand cru blanc voisin du Montrachet', 'excellent'],
  ['Criots-Bâtard-Montrachet', 'Bourgogne', 'white', 8, 25, ['Chardonnay'], 'Plus petit grand cru blanc de la Côte', 'excellent'],
  ['Vougeot', 'Bourgogne', 'red', 5, 12, ['Pinot Noir'], 'Village de la Côte de Nuits (hors Clos)', 'moderate'],
  ['Côte de Beaune-Villages', 'Bourgogne', 'red', 4, 10, ['Pinot Noir'], 'Assemblage de villages de la Côte de Beaune', 'low'],
  ['Côte de Beaune', 'Bourgogne', 'red', 4, 10, ['Pinot Noir'], 'Pinot Noir des hauts de Beaune', 'low'],
  ['Clos Saint-Denis', 'Bourgogne', 'red', 10, 25, ['Pinot Noir'], 'Grand cru fin de Morey-Saint-Denis', 'excellent'],
  ['Blagny', 'Bourgogne', 'red', 5, 12, ['Pinot Noir'], 'Rouge de hauteur entre Meursault et Puligny', 'moderate'],
  ['Charlemagne', 'Bourgogne', 'white', 8, 25, ['Chardonnay'], 'Grand cru blanc (rare) du Cortonnais', 'excellent'],
  ['Chapelle-Chambertin', 'Bourgogne', 'red', 10, 25, ['Pinot Noir'], 'Grand cru floral de Gevrey', 'excellent'],
  ['Griotte-Chambertin', 'Bourgogne', 'red', 10, 25, ['Pinot Noir'], 'Grand cru de Gevrey aux notes de cerise', 'excellent'],
  ['Latricières-Chambertin', 'Bourgogne', 'red', 10, 25, ['Pinot Noir'], 'Grand cru racé de Gevrey', 'excellent'],
  ['Mazoyères-Chambertin', 'Bourgogne', 'red', 10, 25, ['Pinot Noir'], 'Grand cru de Gevrey (souvent vendu en Charmes)', 'excellent'],
  ['Ruchottes-Chambertin', 'Bourgogne', 'red', 10, 25, ['Pinot Noir'], 'Petit grand cru minéral de Gevrey', 'excellent'],
  ['La Romanée', 'Bourgogne', 'red', 12, 30, ['Pinot Noir'], 'Plus petit grand cru de France (Vosne)', 'excellent'],
  ['La Grande Rue', 'Bourgogne', 'red', 12, 30, ['Pinot Noir'], 'Grand cru en monopole de Vosne-Romanée', 'excellent'],
  ['Bourgogne Passe-tout-grains', 'Bourgogne', 'red', 2, 5, ['Gamay', 'Pinot Noir'], 'Assemblage Gamay-Pinot à boire jeune', 'low'],
  ['Vézelay', 'Bourgogne', 'white', 2, 6, ['Chardonnay'], 'Chardonnay vif de l’Yonne', 'low'],
  ['Coteaux Bourguignons', 'Bourgogne', 'red', 1, 4, ['Gamay', 'Pinot Noir'], 'Rouge régional d’entrée de gamme', 'low'],
  ['Pouilly-Loché', 'Bourgogne', 'white', 2, 6, ['Chardonnay'], 'Chardonnay du Mâconnais voisin de Fuissé', 'low'],
  ['Pouilly-Vinzelles', 'Bourgogne', 'white', 3, 8, ['Chardonnay'], 'Chardonnay ample du Mâconnais', 'low'],
  // --- JURA ---
  ["L'Etoile", 'Jura', 'white', 5, 15, ['Chardonnay', 'Savagnin'], 'Blancs du Jura, parfois oxydatifs', 'moderate'],
  // --- LOIRE ---
  ['Touraine Noble Joué', 'Loire', 'rose', 1, 3, ['Pinot Meunier', 'Pinot Gris', 'Pinot Noir'], 'Gris de Touraine historique', 'low'],
  ['Coteaux du Vendômois', 'Loire', 'red', 2, 5, ["Pineau d'Aunis"], 'Rouge poivré du Loir-et-Cher', 'low'],
  ['Orléans', 'Loire', 'white', 2, 5, ['Chardonnay', 'Pinot Meunier'], 'Vin léger des bords de Loire', 'low'],
  ['Orléans-Cléry', 'Loire', 'red', 2, 6, ['Cabernet Franc'], 'Rouge confidentiel du Loiret', 'low'],
  ['Coteaux du Giennois', 'Loire', 'white', 2, 5, ['Sauvignon Blanc', 'Gamay'], 'Blanc vif voisin de Pouilly-Fumé', 'low'],
  ['Coteaux du Loir', 'Loire', 'red', 3, 8, ["Pineau d'Aunis", 'Chenin Blanc'], 'Rouge/blanc du Loir', 'low'],
  ['Pouilly-sur-Loire', 'Loire', 'white', 1, 3, ['Chasselas'], 'Blanc léger de Chasselas', 'low'],
  ['Valençay', 'Loire', 'white', 2, 5, ['Sauvignon Blanc', 'Gamay'], 'Blanc/rouge du Berry', 'low'],
  ['Cheverny', 'Loire', 'white', 2, 5, ['Sauvignon Blanc', 'Chardonnay', 'Gamay', 'Pinot Noir'], 'Blanc et rouge frais du Blésois', 'low'],
  ['Châteaumeillant', 'Loire', 'red', 2, 5, ['Gamay', 'Pinot Noir'], 'Rouge et gris du Berry', 'low'],
  ['Coulée de Serrant', 'Loire', 'white', 8, 25, ['Chenin Blanc'], 'Monopole mythique de Savennières (biodynamie)', 'good'],
  ['Haut-Poitou', 'Loire', 'white', 1, 4, ['Sauvignon Blanc'], 'Blanc vif du Poitou', 'low'],
  ['Muscadet Coteaux de la Loire', 'Loire', 'white', 1, 4, ['Melon de Bourgogne'], 'Muscadet de sous-région ligérienne', 'low'],
  ['Anjou Brissac', 'Loire', 'red', 3, 8, ['Cabernet Franc', 'Cabernet Sauvignon'], 'Rouge d’Anjou de garde', 'low'],
  ['Fiefs Vendéens', 'Loire', 'red', 1, 4, ['Pinot Noir', 'Gamay', 'Cabernet Franc'], 'Rouges et blancs côtiers de Vendée', 'low'],
  ["Cabernet d'Anjou", 'Loire', 'rose', 1, 3, ['Cabernet Franc', 'Cabernet Sauvignon'], 'Rosé demi-sec d’Anjou', 'low'],
  ["Rosé d'Anjou", 'Loire', 'rose', 1, 2, ['Grolleau', 'Gamay'], 'Rosé tendre d’Anjou', 'low'],
  ['Anjou-Coteaux de la Loire', 'Loire', 'sweet', 5, 15, ['Chenin Blanc'], 'Moelleux de Chenin sur la Loire', 'low'],
  ["Coteaux de l'Aubance", 'Loire', 'sweet', 5, 15, ['Chenin Blanc'], 'Moelleux fin de l’Aubance', 'moderate'],
  ['Coteaux de Saumur', 'Loire', 'sweet', 5, 12, ['Chenin Blanc'], 'Moelleux confidentiel du Saumurois', 'low'],
  ['Rosé de Loire', 'Loire', 'rose', 1, 2, ['Cabernet Franc', 'Grolleau', 'Gamay'], 'Rosé sec ligérien', 'low'],
  ["Coteaux d'Ancenis", 'Loire', 'red', 1, 4, ['Gamay'], 'Rouges et blancs du pays nantais', 'low'],
  ['Muscadet Côtes de Grandlieu', 'Loire', 'white', 1, 4, ['Melon de Bourgogne'], 'Muscadet du lac de Grand-Lieu', 'low'],
  ['Gros Plant du Pays Nantais', 'Loire', 'white', 1, 3, ['Folle Blanche'], 'Blanc acidulé du pays nantais', 'low'],
  ['Côtes du Forez', 'Loire', 'red', 1, 4, ['Gamay'], 'Gamay volcanique du Forez', 'low'],
  ['Côte roannaise', 'Loire', 'red', 1, 4, ['Gamay'], 'Gamay de la Loire roannaise', 'low'],
  ["Côtes d'Auvergne", 'Loire', 'red', 2, 5, ['Gamay', 'Pinot Noir'], 'Rouge volcanique d’Auvergne', 'low'],
  ['Saint-Pourçain', 'Loire', 'red', 2, 5, ['Gamay', 'Pinot Noir'], 'Rouges et blancs du Bourbonnais', 'low'],
  // --- SUD-OUEST ---
  ['Floc de Gascogne', 'Sud-Ouest', 'sweet', 1, 3, ['Colombard', 'Ugni Blanc', 'Gros Manseng'], 'Mistelle gasconne (jus + Armagnac)', 'low'],
  ['Tursan', 'Sud-Ouest', 'red', 2, 6, ['Tannat', 'Cabernet Franc', 'Baroque'], 'Rouge et blanc des Landes', 'low'],
  ['Béarn', 'Sud-Ouest', 'red', 2, 6, ['Tannat', 'Cabernet Franc', 'Cabernet Sauvignon'], 'Rouge béarnais sur Tannat', 'low'],
  ['Entraygues - Le Fel', 'Sud-Ouest', 'white', 2, 5, ['Chenin Blanc', 'Fer Servadou'], 'Vins de schiste de l’Aveyron', 'low'],
  ['Estaing', 'Sud-Ouest', 'red', 2, 5, ['Fer Servadou', 'Gamay'], 'Petits vins de l’Aveyron', 'low'],
  ['Saint-Sardos', 'Sud-Ouest', 'red', 2, 6, ['Syrah', 'Tannat'], 'Rouge du Tarn-et-Garonne', 'low'],
  ['Côtes de Millau', 'Sud-Ouest', 'red', 2, 5, ['Gamay', 'Syrah'], 'Rouge des gorges du Tarn', 'low'],
  ['Gaillac premières côtes', 'Sud-Ouest', 'white', 2, 6, ['Mauzac', "Len de l'El"], 'Blanc sec de coteaux gaillacois', 'low'],
  ['Brulhois', 'Sud-Ouest', 'red', 2, 6, ['Tannat', 'Cabernet Franc', 'Cot'], 'Rouge sombre du Brulhois', 'low'],
  ['Coteaux du Quercy', 'Sud-Ouest', 'red', 3, 8, ['Cabernet Franc', 'Cot', 'Merlot'], 'Rouge structuré du Quercy', 'low'],
  // --- EST (Lorraine, Bugey, Charentes) ---
  ['Moselle', 'Lorraine', 'white', 1, 4, ['Auxerrois', 'Pinot Gris', 'Pinot Noir'], 'Vins frais de la vallée de la Moselle', 'low'],
  ['Côtes de Toul', 'Lorraine', 'rose', 1, 3, ['Gamay', 'Pinot Noir', 'Auxerrois'], 'Gris de Toul lorrain', 'low'],
  ['Bugey', 'Bugey', 'spark', 1, 4, ['Gamay', 'Chardonnay', 'Mondeuse', 'Altesse'], 'Effervescents et tranquilles du Bugey', 'low'],
  ['Roussette du Bugey', 'Bugey', 'white', 2, 5, ['Altesse'], 'Blanc d’Altesse du Bugey', 'low'],
  ['Coteaux du Lyonnais', 'Beaujolais', 'red', 1, 4, ['Gamay'], 'Gamay des coteaux lyonnais', 'low'],
  ['Pineau des Charentes', 'Charentes', 'sweet', 1, 5, ['Ugni Blanc', 'Colombard', 'Merlot'], 'Mistelle charentaise (jus + Cognac)', 'low'],
  // --- ALSACE ---
  ["Crémant d'Alsace", 'Alsace', 'spark', 1, 3, ['Pinot Blanc', 'Auxerrois', 'Riesling', 'Pinot Gris'], 'Effervescent méthode traditionnelle d’Alsace', 'moderate'],
]

// Alsace Grands Crus (51 lieux-dits) — cépages nobles communs, garde 4-15 ans.
const ALSACE_GC = [
  'Altenberg de Bergbieten', 'Altenberg de Bergheim', 'Altenberg de Wolxheim', 'Brand', 'Bruderthal',
  'Eichberg', 'Engelberg', 'Florimont', 'Frankstein', 'Froehn', 'Furstentum', 'Geisberg', 'Gloeckelberg',
  'Goldert', 'Hatschbourg', 'Hengst', 'Kaefferkopf', 'Kanzlerberg', 'Kastelberg', 'Kessler',
  'Kirchberg de Barr', 'Kirchberg de Ribeauvillé', 'Kitterlé', 'Mambourg', 'Mandelberg', 'Marckrain',
  'Moenchberg', 'Muenchberg', 'Ollwiller', 'Osterberg', 'Pfersigberg', 'Pfingstberg', 'Praelatenberg',
  'Rangen', 'Rosacker', 'Saering', 'Schlossberg', 'Schoenenbourg', 'Sommerberg', 'Sonnenglanz',
  'Spiegel', 'Sporen', 'Steinert', 'Steingrubler', 'Steinklotz', 'Vorbourg', 'Wiebelsberg',
  'Wineck-Schlossberg', 'Winzenberg', 'Zinnkoepfle', 'Zotzenberg',
]
// Les plus réputés (cote secondaire confirmée) -> investment 'good'
const GC_GOOD = new Set(['Rangen', 'Schlossberg', 'Brand', 'Hengst', 'Geisberg', 'Schoenenbourg', 'Kessler', 'Sommerberg'])

const slug = (s) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
  .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')

const esc = (s) => s.replace(/'/g, "\\'")

// --- read & guard against duplicate ids ---
let src = fs.readFileSync(FILE, 'utf8')
const existingIds = new Set([...src.matchAll(/\{ id: '([^']+)'/g)].map((m) => m[1]))

const baseLines = []
const enrichLines = []
let skipped = []

const add = (id, name, region, colorCode, min, max, grapes, style, inv) => {
  if (existingIds.has(id)) { skipped.push(id); return }
  existingIds.add(id)
  baseLines.push(`  { id: '${id}', name: '${esc(name)}', country: 'France', region: '${esc(region)}', color: WineColor.${C[colorCode]}, minYears: ${min}, maxYears: ${max} },`)
  const g = grapes.map((x) => `'${esc(x)}'`).join(', ')
  enrichLines.push(`  '${id}': { grapes: [${g}], style: '${esc(style)}', investmentPotential: '${inv}' },`)
}

for (const [name, region, color, min, max, grapes, style, inv] of WINES) {
  add(slug(name), name, region, color, min, max, grapes, style, inv)
}
for (const lieu of ALSACE_GC) {
  const inv = GC_GOOD.has(lieu) ? 'good' : 'moderate'
  add(
    'alsace-gc-' + slug(lieu),
    `Alsace Grand Cru ${lieu}`,
    'Alsace', 'white', 4, 15,
    ['Riesling', 'Gewurztraminer', 'Pinot Gris', 'Muscat'],
    `Grand cru d'Alsace — lieu-dit ${lieu}`,
    inv,
  )
}

// --- inject base profiles: before the closing `]` of APPELLATION_PROFILES ---
const arrClose = src.indexOf('\n]', src.indexOf('APPELLATION_PROFILES'))
const baseBlock = `  // === AOC/AOP viticoles ajoutées via audit INAO 2025-12-31 (cf. docs/audit-appellations-inao.md) — garde estimée à affiner ===\n${baseLines.join('\n')}\n`
src = src.slice(0, arrClose + 1) + baseBlock + src.slice(arrClose + 1)

// --- inject enrichment: before the closing `}` that ends APPELLATION_ENRICHMENT ---
const enrStart = src.indexOf('const APPELLATION_ENRICHMENT')
const enrClose = src.indexOf('\n}', enrStart)
const enrBlock = `  // === enrichissement des appellations ajoutées (audit INAO) ===\n${enrichLines.join('\n')}\n`
src = src.slice(0, enrClose + 1) + enrBlock + src.slice(enrClose + 1)

fs.writeFileSync(FILE, src)
console.log(`Ajoutés: ${baseLines.length} profils + ${enrichLines.length} enrichissements`)
if (skipped.length) console.log(`Ignorés (id déjà présent): ${skipped.join(', ')}`)
