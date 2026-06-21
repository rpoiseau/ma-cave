// Profils aromatiques et accords mets par cépage.
//
// Sources reconnues : Jancis Robinson & al. « Wine Grapes » (Allen Lane, 2012),
// référentiel WSET (Wine & Spirit Education Trust), Guide Hachette des Vins,
// fiches cépages de l'INAO et des interprofessions (CIVB, BIVB, Inter-Rhône).
//
// Le profil aromatique décrit les marqueurs typiques jeunes du cépage ; les
// accords listent les familles de plats classiquement recommandées. Ces données
// sont volontairement génériques (niveau cépage) : elles fournissent un socle
// fiable pour toute bouteille, que l'appellation soit enrichie ou non.

export interface GrapeProfile {
  aromas: string[]
  foodPairings: string[]
}

// Les clés sont normalisées (minuscules, sans accents) — voir normalizeGrape().
export const GRAPE_PROFILES: Record<string, GrapeProfile> = {
  // ─── Rouges ──────────────────────────────────────────────────────────────
  'cabernet sauvignon': {
    aromas: ['Cassis', 'Cèdre', 'Poivron', 'Graphite', 'Tabac'],
    foodPairings: ['Agneau', 'Bœuf grillé', 'Gibier à plume', 'Fromages affinés'],
  },
  'cabernet franc': {
    aromas: ['Framboise', 'Poivron', 'Violette', 'Mine de crayon'],
    foodPairings: ['Volaille rôtie', 'Charcuterie', 'Bœuf', 'Fromages de chèvre'],
  },
  merlot: {
    aromas: ['Prune', 'Cerise noire', 'Chocolat', 'Truffe'],
    foodPairings: ['Magret de canard', 'Bœuf braisé', 'Champignons', 'Fromages doux'],
  },
  'pinot noir': {
    aromas: ['Cerise', 'Fraise', 'Sous-bois', 'Champignon', 'Épices douces'],
    foodPairings: ['Volaille', 'Canard', 'Saumon', 'Champignons', 'Fromages affinés'],
  },
  syrah: {
    aromas: ['Mûre', 'Poivre noir', 'Violette', 'Olive noire', 'Lard fumé'],
    foodPairings: ['Gibier', 'Agneau aux herbes', 'Viandes grillées', 'Plats épicés'],
  },
  shiraz: {
    aromas: ['Mûre confite', 'Réglisse', 'Poivre', 'Chocolat'],
    foodPairings: ['Barbecue', 'Bœuf', 'Gibier', 'Fromages relevés'],
  },
  grenache: {
    aromas: ['Fraise écrasée', 'Garrigue', 'Cuir', 'Épices'],
    foodPairings: ['Daube', 'Agneau', 'Plats mijotés', 'Ratatouille'],
  },
  mourvedre: {
    aromas: ['Mûre', 'Garrigue', 'Cuir', 'Poivre', 'Gibier'],
    foodPairings: ['Gibier', 'Daube provençale', 'Sanglier', 'Viandes en sauce'],
  },
  nebbiolo: {
    aromas: ['Rose', 'Goudron', 'Cerise', 'Truffe', 'Réglisse'],
    foodPairings: ['Risotto à la truffe', 'Gibier', 'Viandes braisées', 'Fromages affinés'],
  },
  sangiovese: {
    aromas: ['Cerise', 'Tomate séchée', 'Cuir', 'Herbes', 'Thé'],
    foodPairings: ['Pâtes à la tomate', 'Charcuterie', 'Viandes grillées', 'Pizza'],
  },
  tempranillo: {
    aromas: ['Cerise', 'Cuir', 'Vanille', 'Tabac', 'Figue'],
    foodPairings: ['Tapas', 'Agneau rôti', 'Charcuterie ibérique', 'Fromages de brebis'],
  },
  malbec: {
    aromas: ['Prune', 'Mûre', 'Violette', 'Cacao'],
    foodPairings: ['Bœuf grillé', 'Empanadas', 'Viandes rouges', 'Plats épicés'],
  },
  gamay: {
    aromas: ['Banane', 'Fraise', 'Framboise', 'Bonbon anglais'],
    foodPairings: ['Charcuterie', 'Volaille', 'Plats conviviaux', 'Fromages frais'],
  },
  tannat: {
    aromas: ['Mûre', 'Réglisse', 'Cuir', 'Café'],
    foodPairings: ['Cassoulet', 'Magret', 'Gibier', 'Viandes en sauce'],
  },
  'nielluccio': {
    aromas: ['Cerise', 'Maquis', 'Épices', 'Réglisse'],
    foodPairings: ['Charcuterie corse', 'Sanglier', 'Fromages de brebis'],
  },
  'cinsault': {
    aromas: ['Fraise', 'Pêche', 'Fleurs', 'Épices douces'],
    foodPairings: ['Salades', 'Grillades légères', 'Cuisine méditerranéenne'],
  },
  carignan: {
    aromas: ['Fruits noirs', 'Garrigue', 'Réglisse', 'Épices'],
    foodPairings: ['Viandes grillées', 'Plats mijotés', 'Fromages relevés'],
  },
  zinfandel: {
    aromas: ['Confiture de mûre', 'Poivre', 'Réglisse', 'Épices'],
    foodPairings: ['Barbecue', 'Burgers', 'Plats épicés', 'Viandes fumées'],
  },
  // ─── Blancs ──────────────────────────────────────────────────────────────
  chardonnay: {
    aromas: ['Agrumes', 'Pomme', 'Beurre', 'Noisette', 'Vanille'],
    foodPairings: ['Poisson en sauce', 'Volaille à la crème', 'Fruits de mer', 'Fromages doux'],
  },
  'sauvignon blanc': {
    aromas: ['Agrumes', 'Buis', 'Fruit de la passion', 'Herbe coupée'],
    foodPairings: ['Fruits de mer', 'Chèvre frais', 'Poisson grillé', 'Salades'],
  },
  riesling: {
    aromas: ['Citron vert', 'Pomme verte', 'Pierre à fusil', 'Fleurs blanches'],
    foodPairings: ['Choucroute', 'Cuisine asiatique', 'Poisson', 'Fruits de mer'],
  },
  chenin: {
    aromas: ['Coing', 'Miel', 'Pomme', 'Acacia', 'Pierre mouillée'],
    foodPairings: ['Poisson', 'Volaille à la crème', 'Fromages de chèvre', 'Apéritif'],
  },
  'chenin blanc': {
    aromas: ['Coing', 'Miel', 'Pomme', 'Acacia', 'Pierre mouillée'],
    foodPairings: ['Poisson', 'Volaille à la crème', 'Fromages de chèvre', 'Apéritif'],
  },
  viognier: {
    aromas: ['Abricot', 'Pêche', 'Fleurs blanches', 'Miel'],
    foodPairings: ['Cuisine épicée', 'Volaille', 'Poisson gras', 'Cuisine thaï'],
  },
  gewurztraminer: {
    aromas: ['Litchi', 'Rose', 'Épices', 'Pamplemousse'],
    foodPairings: ['Cuisine asiatique', 'Munster', 'Foie gras', 'Plats épicés'],
  },
  'pinot gris': {
    aromas: ['Poire', 'Fruits secs', 'Miel', 'Fumée'],
    foodPairings: ['Volaille', 'Poisson en sauce', 'Tarte flambée', 'Foie gras'],
  },
  muscat: {
    aromas: ['Raisin frais', 'Fleur d\'oranger', 'Rose', 'Agrumes'],
    foodPairings: ['Apéritif', 'Asperges', 'Desserts aux fruits', 'Cuisine épicée'],
  },
  semillon: {
    aromas: ['Cire d\'abeille', 'Miel', 'Agrumes confits', 'Lanoline'],
    foodPairings: ['Foie gras', 'Poisson en sauce', 'Roquefort', 'Volaille'],
  },
  marsanne: {
    aromas: ['Abricot', 'Amande', 'Miel', 'Chèvrefeuille'],
    foodPairings: ['Poisson gras', 'Volaille', 'Cuisine crémeuse'],
  },
  roussanne: {
    aromas: ['Poire', 'Aubépine', 'Miel', 'Herbes'],
    foodPairings: ['Volaille', 'Poisson', 'Fromages à pâte molle'],
  },
  'melon de bourgogne': {
    aromas: ['Citron', 'Iode', 'Pomme verte', 'Embruns'],
    foodPairings: ['Huîtres', 'Coquillages', 'Fruits de mer', 'Poisson grillé'],
  },
  aligote: {
    aromas: ['Citron', 'Pomme verte', 'Fleurs', 'Noisette'],
    foodPairings: ['Escargots', 'Fruits de mer', 'Apéritif', 'Chèvre frais'],
  },
  vermentino: {
    aromas: ['Agrumes', 'Amande', 'Fenouil', 'Embruns'],
    foodPairings: ['Poisson grillé', 'Fruits de mer', 'Cuisine méditerranéenne'],
  },
  albarino: {
    aromas: ['Pêche', 'Citron', 'Salinité', 'Fleurs blanches'],
    foodPairings: ['Fruits de mer', 'Poulpe', 'Poisson grillé', 'Sushi'],
  },
  verdejo: {
    aromas: ['Fruits à noyau', 'Fenouil', 'Agrumes', 'Herbe'],
    foodPairings: ['Tapas', 'Poisson', 'Fruits de mer'],
  },
  'gruner veltliner': {
    aromas: ['Poivre blanc', 'Citron', 'Pomme', 'Petits pois'],
    foodPairings: ['Asperges', 'Poisson', 'Schnitzel', 'Cuisine végétale'],
  },
  garganega: {
    aromas: ['Amande', 'Fleurs blanches', 'Poire', 'Pierre'],
    foodPairings: ['Risotto', 'Poisson', 'Fruits de mer'],
  },
  glera: {
    aromas: ['Pomme verte', 'Poire', 'Fleurs blanches', 'Agrumes'],
    foodPairings: ['Apéritif', 'Antipasti', 'Fruits de mer', 'Brunch'],
  },
}

const NORMALIZE_REGEX = /[̀-ͯ]/g

export function normalizeGrape(name: string): string {
  return name
    .normalize('NFD')
    .replace(NORMALIZE_REGEX, '')
    .toLowerCase()
    .trim()
}

export function getGrapeProfile(name: string): GrapeProfile | undefined {
  return GRAPE_PROFILES[normalizeGrape(name)]
}
