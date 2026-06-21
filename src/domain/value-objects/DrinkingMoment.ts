// Moment de consommation idéal d'une bouteille.
// Référentiel sommelier standard (WSET, Guide Hachette, Le Figaro Vin) :
// du plus léger/vif (apéritif) au plus riche/sucré (dessert).

export enum DrinkingMoment {
  Aperitif = 'aperitif',
  Entree = 'entree',
  Plat = 'plat',
  Fromage = 'fromage',
  Dessert = 'dessert',
}

export const DRINKING_MOMENT_LABELS: Record<DrinkingMoment, string> = {
  [DrinkingMoment.Aperitif]: 'Apéritif',
  [DrinkingMoment.Entree]: 'Entrée',
  [DrinkingMoment.Plat]: 'Plat',
  [DrinkingMoment.Fromage]: 'Fromage',
  [DrinkingMoment.Dessert]: 'Dessert',
}

// Icônes MDI associées (couche présentation, gardées ici pour cohérence).
export const DRINKING_MOMENT_ICONS: Record<DrinkingMoment, string> = {
  [DrinkingMoment.Aperitif]: 'mdi-glass-cocktail',
  [DrinkingMoment.Entree]: 'mdi-bowl-mix',
  [DrinkingMoment.Plat]: 'mdi-silverware-fork-knife',
  [DrinkingMoment.Fromage]: 'mdi-cheese',
  [DrinkingMoment.Dessert]: 'mdi-cupcake',
}

// Ordre canonique pour l'affichage.
export const DRINKING_MOMENT_ORDER: DrinkingMoment[] = [
  DrinkingMoment.Aperitif,
  DrinkingMoment.Entree,
  DrinkingMoment.Plat,
  DrinkingMoment.Fromage,
  DrinkingMoment.Dessert,
]
