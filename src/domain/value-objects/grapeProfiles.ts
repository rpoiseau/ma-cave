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
//
// Couverture : cépages internationaux + cépages régionaux français (Savoie,
// Jura, Sud-Ouest, Languedoc-Roussillon, Alsace, Corse) afin qu'aucune
// appellation française ne retombe sur le seul fallback par couleur.

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
  // ─── Cépages régionaux français (Savoie, Jura, Sud-Ouest, Languedoc, Alsace, Corse) ──
  // Savoie
  jacquere: {
    aromas: ['Agrumes', 'Fleurs blanches', 'Pomme verte', 'Pierre à fusil'],
    foodPairings: ['Fondue savoyarde', 'Raclette', 'Poisson de lac', 'Fruits de mer'],
  },
  altesse: {
    aromas: ['Noisette', 'Miel', 'Agrumes confits', 'Amande', 'Fruits secs'],
    foodPairings: ['Poisson de lac', 'Volaille à la crème', 'Fromages de Savoie', 'Foie gras'],
  },
  mondeuse: {
    aromas: ['Mûre', 'Cassis', 'Poivre', 'Violette', 'Herbes'],
    foodPairings: ['Charcuterie de Savoie', 'Diots', 'Gibier', 'Viandes grillées'],
  },
  // Jura
  savagnin: {
    aromas: ['Noix', 'Curry', 'Pomme verte', 'Épices', 'Amande grillée'],
    foodPairings: ['Comté', 'Coq au vin jaune', 'Morilles', 'Volaille à la crème'],
  },
  poulsard: {
    aromas: ['Fraise', 'Groseille', 'Sous-bois', 'Épices douces'],
    foodPairings: ['Charcuterie', 'Volaille', 'Poisson', 'Cuisine légère'],
  },
  ploussard: {
    aromas: ['Fraise', 'Groseille', 'Sous-bois', 'Épices douces'],
    foodPairings: ['Charcuterie', 'Volaille', 'Poisson', 'Cuisine légère'],
  },
  trousseau: {
    aromas: ['Fruits rouges', 'Poivre', 'Cuir', 'Sous-bois'],
    foodPairings: ['Gibier à plume', 'Viandes blanches', 'Charcuterie', 'Fromages affinés'],
  },
  // Sud-Ouest
  'petit manseng': {
    aromas: ['Ananas', 'Mangue', 'Fruit de la passion', 'Miel', 'Agrumes confits'],
    foodPairings: ['Foie gras', 'Desserts exotiques', 'Fromages bleus', 'Apéritif'],
  },
  'gros manseng': {
    aromas: ['Agrumes', 'Fruits exotiques', 'Pamplemousse', 'Épices'],
    foodPairings: ['Poisson', 'Volaille', 'Cuisine épicée', 'Apéritif'],
  },
  arrufiac: {
    aromas: ['Agrumes', 'Fleurs blanches', 'Fruits à noyau'],
    foodPairings: ['Apéritif', 'Poisson', 'Fruits de mer'],
  },
  negrette: {
    aromas: ['Violette', 'Framboise', 'Réglisse', 'Poivre'],
    foodPairings: ['Charcuterie', 'Grillades', 'Cassoulet', 'Volaille'],
  },
  'fer servadou': {
    aromas: ['Cassis', 'Poivron', 'Framboise', 'Épices'],
    foodPairings: ['Charcuterie', 'Aligot', 'Viandes grillées', 'Fromages de brebis'],
  },
  braucol: {
    aromas: ['Cassis', 'Poivron', 'Framboise', 'Épices'],
    foodPairings: ['Charcuterie', 'Aligot', 'Viandes grillées', 'Fromages de brebis'],
  },
  duras: {
    aromas: ['Poivre', 'Fruits rouges', 'Épices', 'Réglisse'],
    foodPairings: ['Charcuterie', 'Grillades', 'Plats du terroir'],
  },
  // Languedoc-Roussillon / Rhône (blancs)
  piquepoul: {
    aromas: ['Citron', 'Iode', 'Fleurs blanches', 'Pomme verte'],
    foodPairings: ['Huîtres', 'Coquillages', 'Poisson grillé', 'Fruits de mer'],
  },
  clairette: {
    aromas: ['Fenouil', 'Fleurs blanches', 'Pomme', 'Amande'],
    foodPairings: ['Apéritif', 'Poisson grillé', 'Cuisine méditerranéenne'],
  },
  'grenache blanc': {
    aromas: ['Fenouil', 'Poire', 'Fleurs blanches', 'Fruits à noyau'],
    foodPairings: ['Poisson', 'Volaille', 'Cuisine méditerranéenne', 'Fruits de mer'],
  },
  macabeu: {
    aromas: ['Pomme', 'Fleurs blanches', 'Fruits secs', 'Miel'],
    foodPairings: ['Apéritif', 'Poisson', 'Tapas', 'Fruits de mer'],
  },
  mauzac: {
    aromas: ['Pomme mûre', 'Poire', 'Fruits secs', 'Miel'],
    foodPairings: ['Apéritif', 'Tarte aux pommes', 'Fruits de mer'],
  },
  'ugni blanc': {
    aromas: ['Citron', 'Fleurs blanches', 'Pomme verte'],
    foodPairings: ['Apéritif', 'Fruits de mer', 'Poisson grillé'],
  },
  // Alsace / Champagne
  'pinot blanc': {
    aromas: ['Pomme', 'Poire', 'Fleurs blanches', 'Amande'],
    foodPairings: ['Apéritif', 'Tarte flambée', 'Charcuterie', 'Poisson'],
  },
  auxerrois: {
    aromas: ['Poire', 'Fruits blancs', 'Fleurs', 'Miel'],
    foodPairings: ['Apéritif', 'Tartes salées', 'Fromages doux', 'Charcuterie'],
  },
  sylvaner: {
    aromas: ['Pomme verte', 'Agrumes', 'Herbes', 'Notes minérales'],
    foodPairings: ['Fruits de mer', 'Charcuterie', 'Asperges', 'Poisson'],
  },
  'pinot meunier': {
    aromas: ['Pomme', 'Fruits rouges', 'Brioche', 'Fleurs'],
    foodPairings: ['Apéritif', 'Volaille', 'Charcuterie fine'],
  },
  muscadelle: {
    aromas: ['Fleurs', 'Raisin frais', 'Musc', 'Fruits frais'],
    foodPairings: ['Apéritif', 'Salades', 'Poisson'],
  },
  // Corse / Bourgogne / Loire
  sciaccarello: {
    aromas: ['Poivre', 'Fruits rouges', 'Maquis', 'Épices'],
    foodPairings: ['Charcuterie corse', 'Viandes grillées', 'Fromages de brebis'],
  },
  cesar: {
    aromas: ['Fruits noirs', 'Épices', 'Réglisse', 'Cuir'],
    foodPairings: ['Viandes en sauce', 'Gibier', 'Fromages affinés'],
  },
  // Côt = Malbec en Loire/Touraine ; Cabernet = mention générique (Fronton, Duras)
  'cot': {
    aromas: ['Prune', 'Mûre', 'Violette', 'Cacao'],
    foodPairings: ['Charcuterie', 'Viandes rouges', 'Grillades', 'Plats mijotés'],
  },
  cabernet: {
    aromas: ['Cassis', 'Poivron', 'Framboise', 'Cèdre'],
    foodPairings: ['Viandes rouges', 'Grillades', 'Volaille rôtie', 'Fromages affinés'],
  },
  romorantin: {
    aromas: ['Agrumes', 'Pomme verte', 'Miel', 'Notes minérales'],
    foodPairings: ['Poisson', 'Fruits de mer', 'Chèvre', 'Apéritif'],
  },
  bourboulenc: {
    aromas: ['Agrumes', 'Fleurs blanches', 'Iode', 'Fenouil'],
    foodPairings: ['Poisson grillé', 'Fruits de mer', 'Cuisine méditerranéenne'],
  },
  molette: {
    aromas: ['Fleurs blanches', 'Agrumes', 'Pomme'],
    foodPairings: ['Apéritif', 'Poisson de lac', 'Fruits de mer'],
  },
  abouriou: {
    aromas: ['Fruits rouges', 'Épices', 'Réglisse'],
    foodPairings: ['Charcuterie', 'Grillades', 'Plats du terroir'],
  },
  braquet: {
    aromas: ['Fleurs', 'Fruits rouges', 'Épices', 'Poivre'],
    foodPairings: ['Cuisine niçoise', 'Charcuterie', 'Volaille'],
  },
  'folle noire': {
    aromas: ['Fruits noirs', 'Garrigue', 'Poivre', 'Réglisse'],
    foodPairings: ['Viandes grillées', 'Daube', 'Gibier'],
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
