// One-shot: éclate les appellations multicolores ajoutées (audit INAO) en un
// profil par couleur, conformément à la règle (cf. CLAUDE.md, section appellations).
// Retire l'entrée mono-couleur (base + enrichment) et insère une variante par
// couleur. Garde estimée à affiner. Run: node scripts/split-multicolor.mjs
import fs from 'node:fs'

const FILE = 'src/domain/value-objects/appellations.ts'
const C = { red: 'Red', white: 'White', rose: 'Rose', spark: 'Sparkling', sweet: 'Sweet' }
const SUF = { red: 'rouge', white: 'blanc', rose: 'rose', spark: 'petillant', sweet: 'liquoreux' }
const LBL = { red: 'Rouge', white: 'Blanc', rose: 'Rosé', spark: 'Pétillant', sweet: 'Liquoreux' }

// oldId -> { name, region, variants: [color, grapes[], min, max, style, inv] }
const SPLITS = {
  'cheverny': { name: 'Cheverny', region: 'Loire', variants: [
    ['white', ['Sauvignon Blanc', 'Chardonnay'], 2, 5, 'Blanc vif et aromatique du Blésois', 'low'],
    ['red', ['Pinot Noir', 'Gamay'], 2, 6, 'Rouge léger sur Pinot Noir et Gamay', 'low'],
    ['rose', ['Pinot Noir', 'Gamay'], 1, 2, 'Rosé sec à boire jeune', 'low'],
  ] },
  'bugey': { name: 'Bugey', region: 'Bugey', variants: [
    ['spark', ['Gamay', 'Chardonnay', 'Mondeuse', 'Altesse'], 1, 3, 'Effervescent du Bugey (dont Cerdon)', 'low'],
    ['white', ['Chardonnay', 'Altesse', 'Jacquère'], 2, 5, 'Blanc alpin frais', 'low'],
    ['red', ['Gamay', 'Mondeuse', 'Pinot Noir'], 2, 5, 'Rouge léger du Bugey', 'low'],
  ] },
  'montravel': { name: 'Montravel', region: 'Sud-Ouest', variants: [
    ['white', ['Sauvignon Blanc', 'Sémillon', 'Muscadelle'], 2, 6, 'Blanc sec du Bergeracois', 'low'],
    ['red', ['Merlot', 'Cabernet Sauvignon', 'Cabernet Franc'], 3, 8, 'Rouge structuré du Bergeracois', 'low'],
  ] },
  'valencay': { name: 'Valençay', region: 'Loire', variants: [
    ['white', ['Sauvignon Blanc'], 2, 5, 'Blanc vif du Berry', 'low'],
    ['red', ['Gamay', 'Pinot Noir', 'Cot'], 2, 5, 'Rouge léger du Berry', 'low'],
    ['rose', ['Gamay', 'Pinot Noir'], 1, 2, 'Rosé sec du Berry', 'low'],
  ] },
  'saint-pourcain': { name: 'Saint-Pourçain', region: 'Loire', variants: [
    ['red', ['Gamay', 'Pinot Noir'], 2, 5, 'Rouge du Bourbonnais', 'low'],
    ['white', ['Tressallier', 'Chardonnay', 'Sauvignon Blanc'], 2, 5, 'Blanc sur Tressallier', 'low'],
  ] },
  'coteaux-du-loir': { name: 'Coteaux du Loir', region: 'Loire', variants: [
    ['red', ["Pineau d'Aunis"], 3, 8, 'Rouge poivré du Loir', 'low'],
    ['white', ['Chenin Blanc'], 3, 8, 'Blanc de Chenin du Loir', 'low'],
  ] },
  'chatillon-en-diois': { name: 'Châtillon-en-Diois', region: 'Rhône', variants: [
    ['red', ['Gamay', 'Pinot Noir', 'Syrah'], 2, 5, 'Rouge alpin léger du Diois', 'low'],
    ['white', ['Aligoté', 'Chardonnay'], 2, 5, 'Blanc frais du Diois', 'low'],
  ] },
  'cotes-d-auvergne': { name: "Côtes d'Auvergne", region: 'Loire', variants: [
    ['red', ['Gamay', 'Pinot Noir'], 2, 5, 'Rouge volcanique d’Auvergne', 'low'],
    ['white', ['Chardonnay'], 2, 4, 'Blanc volcanique d’Auvergne', 'low'],
  ] },
  'tursan': { name: 'Tursan', region: 'Sud-Ouest', variants: [
    ['red', ['Tannat', 'Cabernet Franc'], 2, 6, 'Rouge des Landes sur Tannat', 'low'],
    ['white', ['Baroque'], 2, 5, 'Blanc landais sur cépage Baroque', 'low'],
  ] },
  'bearn': { name: 'Béarn', region: 'Sud-Ouest', variants: [
    ['red', ['Tannat', 'Cabernet Franc', 'Cabernet Sauvignon'], 2, 6, 'Rouge béarnais sur Tannat', 'low'],
    ['rose', ['Tannat', 'Cabernet Franc'], 1, 3, 'Rosé béarnais', 'low'],
  ] },
  'entraygues-le-fel': { name: 'Entraygues - Le Fel', region: 'Sud-Ouest', variants: [
    ['white', ['Chenin Blanc'], 2, 5, 'Blanc de schiste de l’Aveyron', 'low'],
    ['red', ['Fer Servadou', 'Cabernet Franc'], 2, 5, 'Rouge de schiste de l’Aveyron', 'low'],
  ] },
  'estaing': { name: 'Estaing', region: 'Sud-Ouest', variants: [
    ['red', ['Fer Servadou', 'Gamay'], 2, 5, 'Petit rouge de l’Aveyron', 'low'],
    ['white', ['Chenin Blanc', 'Mauzac'], 2, 5, 'Petit blanc de l’Aveyron', 'low'],
  ] },
  'fiefs-vendeens': { name: 'Fiefs Vendéens', region: 'Loire', variants: [
    ['red', ['Pinot Noir', 'Gamay', 'Cabernet Franc'], 1, 4, 'Rouge côtier de Vendée', 'low'],
    ['white', ['Chenin Blanc', 'Chardonnay'], 1, 3, 'Blanc côtier de Vendée', 'low'],
  ] },
  'coteaux-d-ancenis': { name: "Coteaux d'Ancenis", region: 'Loire', variants: [
    ['red', ['Gamay'], 1, 4, 'Rouge léger du pays nantais', 'low'],
    ['white', ['Pinot Gris', 'Chenin Blanc'], 1, 4, 'Blanc (dont Malvoisie) du pays nantais', 'low'],
  ] },
  'brulhois': { name: 'Brulhois', region: 'Sud-Ouest', variants: [
    ['red', ['Tannat', 'Cabernet Franc', 'Cot'], 2, 6, 'Rouge sombre du Brulhois', 'low'],
    ['rose', ['Tannat', 'Cabernet Franc'], 1, 3, 'Rosé du Brulhois', 'low'],
  ] },
  'cotes-de-millau': { name: 'Côtes de Millau', region: 'Sud-Ouest', variants: [
    ['red', ['Gamay', 'Syrah'], 2, 5, 'Rouge des gorges du Tarn', 'low'],
    ['white', ['Chenin Blanc', 'Mauzac'], 1, 4, 'Blanc des gorges du Tarn', 'low'],
  ] },
  'duche-d-uzes': { name: "Duché d'Uzès", region: 'Rhône Sud', variants: [
    ['red', ['Grenache', 'Syrah'], 2, 6, 'Rouge méridional du Gard', 'low'],
    ['white', ['Viognier', 'Grenache Blanc'], 1, 4, 'Blanc méridional du Gard', 'low'],
    ['rose', ['Grenache', 'Syrah'], 1, 3, 'Rosé méridional du Gard', 'low'],
  ] },
  'orleans': { name: 'Orléans', region: 'Loire', variants: [
    ['white', ['Chardonnay', 'Pinot Gris'], 2, 5, 'Blanc des bords de Loire', 'low'],
    ['red', ['Pinot Noir', 'Pinot Meunier'], 2, 5, 'Rouge léger du Loiret', 'low'],
    ['rose', ['Pinot Meunier', 'Pinot Noir'], 1, 2, 'Rosé du Loiret', 'low'],
  ] },
  'coteaux-du-giennois': { name: 'Coteaux du Giennois', region: 'Loire', variants: [
    ['white', ['Sauvignon Blanc'], 2, 5, 'Blanc vif voisin de Pouilly-Fumé', 'low'],
    ['red', ['Pinot Noir', 'Gamay'], 2, 5, 'Rouge léger du Giennois', 'low'],
  ] },
  'haut-poitou': { name: 'Haut-Poitou', region: 'Loire', variants: [
    ['white', ['Sauvignon Blanc'], 1, 4, 'Blanc vif du Poitou', 'low'],
    ['red', ['Cabernet Franc', 'Gamay'], 2, 5, 'Rouge léger du Poitou', 'low'],
  ] },
  'moselle': { name: 'Moselle', region: 'Lorraine', variants: [
    ['white', ['Auxerrois', 'Pinot Gris', 'Pinot Blanc'], 1, 4, 'Blanc frais de la vallée de la Moselle', 'low'],
    ['red', ['Pinot Noir'], 2, 5, 'Rouge léger de Moselle', 'low'],
  ] },
  'coteaux-du-vendomois': { name: 'Coteaux du Vendômois', region: 'Loire', variants: [
    ['red', ["Pineau d'Aunis"], 2, 5, 'Rouge poivré du Vendômois', 'low'],
    ['white', ['Chenin Blanc', 'Chardonnay'], 2, 5, 'Blanc du Vendômois', 'low'],
  ] },
  'coteaux-d-aix-en-provence': { name: "Coteaux d'Aix-en-Provence", region: 'Provence', variants: [
    ['rose', ['Grenache', 'Cinsault', 'Syrah'], 1, 3, 'Rosé provençal frais et fruité', 'low'],
    ['red', ['Grenache', 'Syrah', 'Cabernet Sauvignon'], 3, 8, 'Rouge provençal de garde', 'low'],
  ] },
}

const esc = (s) => s.replace(/'/g, "\\'")
let src = fs.readFileSync(FILE, 'utf8')
const removed = []
const baseAdds = []
const enrichAdds = []

for (const [oldId, def] of Object.entries(SPLITS)) {
  // retire la ligne de base et la ligne d'enrichissement de l'ancienne entrée
  const baseRe = new RegExp(`^.*\\{ id: '${oldId}',.*$\\n`, 'm')
  const enrRe = new RegExp(`^.*'${oldId}': \\{.*$\\n`, 'm')
  if (!baseRe.test(src) || !enrRe.test(src)) { console.warn('!! introuvable:', oldId); continue }
  src = src.replace(baseRe, '').replace(enrRe, '')
  removed.push(oldId)
  for (const [color, grapes, min, max, style, inv] of def.variants) {
    const id = `${oldId}-${SUF[color]}`
    const name = `${def.name} ${LBL[color]}`
    baseAdds.push(`  { id: '${id}', name: '${esc(name)}', country: 'France', region: '${esc(def.region)}', color: WineColor.${C[color]}, minYears: ${min}, maxYears: ${max} },`)
    const g = grapes.map((x) => `'${esc(x)}'`).join(', ')
    enrichAdds.push(`  '${id}': { grapes: [${g}], style: '${esc(style)}', investmentPotential: '${inv}' },`)
  }
}

// réinjection aux mêmes points
const arrClose = src.indexOf('\n]', src.indexOf('APPELLATION_PROFILES'))
src = src.slice(0, arrClose + 1) + `  // === appellations multicolores éclatées par couleur (règle CLAUDE.md) ===\n${baseAdds.join('\n')}\n` + src.slice(arrClose + 1)
const enrStart = src.indexOf('const APPELLATION_ENRICHMENT')
const enrClose = src.indexOf('\n}', enrStart)
src = src.slice(0, enrClose + 1) + `  // === enrichissement des variantes multicolores ===\n${enrichAdds.join('\n')}\n` + src.slice(enrClose + 1)

fs.writeFileSync(FILE, src)
console.log(`Éclatées: ${removed.length} appellations -> ${baseAdds.length} profils couleur`)
