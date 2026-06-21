import { WineColor } from './WineColor'

export type InvestmentPotential = 'excellent' | 'good' | 'moderate' | 'low'

export interface AppellationProfile {
  id: string
  name: string
  country: string
  region: string
  color: WineColor
  minYears: number
  maxYears: number
  // Enrichment
  grapes?: string[]
  style?: string
  aromas?: string[]
  foodPairings?: string[]
  servingTemp?: string
  investmentPotential?: InvestmentPotential
  investmentNotes?: string
  // Prix marché indicatif par bouteille (€) pour un millésime récent en bonne année.
  // Médiane des fourchettes observées sur Wine-Searcher / iDealwine. Sert de base à
  // l'estimation locale de la cote (LocalPriceEstimateService) — aucune API requise.
  marketPriceEur?: { min: number; max: number }
}

export const APPELLATION_PROFILES: AppellationProfile[] = [
  // BORDEAUX — Rouge
  { id: 'bordeaux-rouge', name: 'Bordeaux', country: 'France', region: 'Bordeaux', color: WineColor.Red, minYears: 3, maxYears: 8 },
  { id: 'bordeaux-superieur', name: 'Bordeaux Supérieur', country: 'France', region: 'Bordeaux', color: WineColor.Red, minYears: 4, maxYears: 10 },
  { id: 'medoc', name: 'Médoc', country: 'France', region: 'Bordeaux', color: WineColor.Red, minYears: 5, maxYears: 12 },
  { id: 'haut-medoc', name: 'Haut-Médoc', country: 'France', region: 'Bordeaux', color: WineColor.Red, minYears: 5, maxYears: 15 },
  // Saint-Estèphe : appellation la plus tannique du Médoc, longévité confirmée (Guide Hachette, Decanter)
  { id: 'saint-estephe', name: 'Saint-Estèphe', country: 'France', region: 'Bordeaux', color: WineColor.Red, minYears: 8, maxYears: 25 },
  // Pauillac : les premiers crus (Latour, Lafite, Mouton) tiennent 30 ans et plus (Wine Spectator vintage charts)
  { id: 'pauillac', name: 'Pauillac', country: 'France', region: 'Bordeaux', color: WineColor.Red, minYears: 10, maxYears: 30 },
  { id: 'saint-julien', name: 'Saint-Julien', country: 'France', region: 'Bordeaux', color: WineColor.Red, minYears: 7, maxYears: 20 },
  // Margaux : grands crus classés atteignent leur apogée après 8 ans, peuvent tenir 25 ans
  { id: 'margaux', name: 'Margaux', country: 'France', region: 'Bordeaux', color: WineColor.Red, minYears: 8, maxYears: 25 },
  { id: 'listrac-medoc', name: 'Listrac-Médoc', country: 'France', region: 'Bordeaux', color: WineColor.Red, minYears: 5, maxYears: 15 },
  { id: 'moulis', name: 'Moulis-en-Médoc', country: 'France', region: 'Bordeaux', color: WineColor.Red, minYears: 5, maxYears: 15 },
  // Pessac-Léognan : Haut-Brion et Pape Clément tiennent facilement 25 ans
  { id: 'pessac-leognan-rouge', name: 'Pessac-Léognan', country: 'France', region: 'Bordeaux', color: WineColor.Red, minYears: 8, maxYears: 25 },
  { id: 'graves-rouge', name: 'Graves', country: 'France', region: 'Bordeaux', color: WineColor.Red, minYears: 5, maxYears: 15 },
  { id: 'saint-emilion', name: 'Saint-Émilion', country: 'France', region: 'Bordeaux', color: WineColor.Red, minYears: 5, maxYears: 15 },
  { id: 'saint-emilion-gc', name: 'Saint-Émilion Grand Cru', country: 'France', region: 'Bordeaux', color: WineColor.Red, minYears: 7, maxYears: 20 },
  // Pomerol : Merlot prédominant mais Petrus et Lafleur atteignent facilement 20 ans (CIVB)
  { id: 'pomerol', name: 'Pomerol', country: 'France', region: 'Bordeaux', color: WineColor.Red, minYears: 8, maxYears: 20 },
  { id: 'fronsac', name: 'Fronsac', country: 'France', region: 'Bordeaux', color: WineColor.Red, minYears: 4, maxYears: 12 },
  { id: 'canon-fronsac', name: 'Canon-Fronsac', country: 'France', region: 'Bordeaux', color: WineColor.Red, minYears: 5, maxYears: 15 },
  // BORDEAUX — Blanc / Liquoreux
  { id: 'bordeaux-blanc', name: 'Bordeaux Blanc', country: 'France', region: 'Bordeaux', color: WineColor.White, minYears: 1, maxYears: 5 },
  { id: 'entre-deux-mers', name: 'Entre-Deux-Mers', country: 'France', region: 'Bordeaux', color: WineColor.White, minYears: 1, maxYears: 4 },
  { id: 'pessac-leognan-blanc', name: 'Pessac-Léognan Blanc', country: 'France', region: 'Bordeaux', color: WineColor.White, minYears: 5, maxYears: 15 },
  { id: 'graves-blanc', name: 'Graves Blanc', country: 'France', region: 'Bordeaux', color: WineColor.White, minYears: 3, maxYears: 10 },
  { id: 'sauternes', name: 'Sauternes', country: 'France', region: 'Bordeaux', color: WineColor.Sweet, minYears: 10, maxYears: 30 },
  { id: 'barsac', name: 'Barsac', country: 'France', region: 'Bordeaux', color: WineColor.Sweet, minYears: 8, maxYears: 25 },
  // BOURGOGNE — Rouge
  { id: 'bourgogne-rouge', name: 'Bourgogne', country: 'France', region: 'Bourgogne', color: WineColor.Red, minYears: 3, maxYears: 8 },
  { id: 'cote-de-nuits-villages', name: 'Côte de Nuits-Villages', country: 'France', region: 'Bourgogne', color: WineColor.Red, minYears: 4, maxYears: 10 },
  { id: 'nuits-saint-georges', name: 'Nuits-Saint-Georges', country: 'France', region: 'Bourgogne', color: WineColor.Red, minYears: 6, maxYears: 15 },
  { id: 'gevrey-chambertin', name: 'Gevrey-Chambertin', country: 'France', region: 'Bourgogne', color: WineColor.Red, minYears: 7, maxYears: 20 },
  // Chambertin Grand Cru : parmi les plus grands Bourgognes rouges, longévité 20-30 ans (BIVB, Jancis Robinson)
  { id: 'chambertin', name: 'Chambertin', country: 'France', region: 'Bourgogne', color: WineColor.Red, minYears: 12, maxYears: 30 },
  { id: 'chambertin-clos-de-beze', name: 'Chambertin Clos-de-Bèze', country: 'France', region: 'Bourgogne', color: WineColor.Red, minYears: 12, maxYears: 30 },
  { id: 'chambolle-musigny', name: 'Chambolle-Musigny', country: 'France', region: 'Bourgogne', color: WineColor.Red, minYears: 6, maxYears: 15 },
  // Musigny Grand Cru : le plus élégant des grands crus de Côte de Nuits, 10-25 ans (Jancis Robinson OCW)
  { id: 'musigny', name: 'Musigny', country: 'France', region: 'Bourgogne', color: WineColor.Red, minYears: 10, maxYears: 25 },
  // Bonnes-Mares Grand Cru : plus structuré que Musigny, garde 10-25 ans (BIVB)
  { id: 'bonnes-mares', name: 'Bonnes-Mares', country: 'France', region: 'Bourgogne', color: WineColor.Red, minYears: 10, maxYears: 25 },
  { id: 'vosne-romanee', name: 'Vosne-Romanée', country: 'France', region: 'Bourgogne', color: WineColor.Red, minYears: 7, maxYears: 20 },
  { id: 'morey-saint-denis', name: 'Morey-Saint-Denis', country: 'France', region: 'Bourgogne', color: WineColor.Red, minYears: 6, maxYears: 15 },
  // Clos de Vougeot Grand Cru : 97 ha de grand cru, longévité confirmée à 25 ans (BIVB)
  { id: 'clos-de-vougeot', name: 'Clos de Vougeot', country: 'France', region: 'Bourgogne', color: WineColor.Red, minYears: 10, maxYears: 25 },
  { id: 'echezeaux', name: 'Échézeaux', country: 'France', region: 'Bourgogne', color: WineColor.Red, minYears: 8, maxYears: 20 },
  { id: 'grands-echezeaux', name: 'Grands-Échezeaux', country: 'France', region: 'Bourgogne', color: WineColor.Red, minYears: 10, maxYears: 25 },
  { id: 'pommard', name: 'Pommard', country: 'France', region: 'Bourgogne', color: WineColor.Red, minYears: 6, maxYears: 15 },
  { id: 'volnay', name: 'Volnay', country: 'France', region: 'Bourgogne', color: WineColor.Red, minYears: 5, maxYears: 12 },
  { id: 'beaune', name: 'Beaune', country: 'France', region: 'Bourgogne', color: WineColor.Red, minYears: 5, maxYears: 12 },
  { id: 'aloxe-corton', name: 'Aloxe-Corton', country: 'France', region: 'Bourgogne', color: WineColor.Red, minYears: 7, maxYears: 18 },
  // Corton Grand Cru rouge : unique grand cru rouge de la Côte de Beaune, 10-25 ans (BIVB)
  { id: 'corton-rouge', name: 'Corton (Grand Cru)', country: 'France', region: 'Bourgogne', color: WineColor.Red, minYears: 10, maxYears: 25 },
  { id: 'savigny-les-beaune', name: 'Savigny-lès-Beaune', country: 'France', region: 'Bourgogne', color: WineColor.Red, minYears: 5, maxYears: 12 },
  { id: 'marsannay', name: 'Marsannay', country: 'France', region: 'Bourgogne', color: WineColor.Red, minYears: 4, maxYears: 10 },
  { id: 'fixin', name: 'Fixin', country: 'France', region: 'Bourgogne', color: WineColor.Red, minYears: 5, maxYears: 12 },
  { id: 'santenay', name: 'Santenay', country: 'France', region: 'Bourgogne', color: WineColor.Red, minYears: 5, maxYears: 12 },
  { id: 'maranges', name: 'Maranges', country: 'France', region: 'Bourgogne', color: WineColor.Red, minYears: 4, maxYears: 10 },
  // BOURGOGNE — Blanc
  { id: 'bourgogne-blanc', name: 'Bourgogne Blanc', country: 'France', region: 'Bourgogne', color: WineColor.White, minYears: 2, maxYears: 6 },
  { id: 'chablis', name: 'Chablis', country: 'France', region: 'Bourgogne', color: WineColor.White, minYears: 3, maxYears: 8 },
  { id: 'chablis-premier-cru', name: 'Chablis Premier Cru', country: 'France', region: 'Bourgogne', color: WineColor.White, minYears: 4, maxYears: 12 },
  { id: 'chablis-grand-cru', name: 'Chablis Grand Cru', country: 'France', region: 'Bourgogne', color: WineColor.White, minYears: 6, maxYears: 20 },
  { id: 'meursault', name: 'Meursault', country: 'France', region: 'Bourgogne', color: WineColor.White, minYears: 5, maxYears: 15 },
  { id: 'puligny-montrachet', name: 'Puligny-Montrachet', country: 'France', region: 'Bourgogne', color: WineColor.White, minYears: 6, maxYears: 18 },
  { id: 'chassagne-montrachet', name: 'Chassagne-Montrachet', country: 'France', region: 'Bourgogne', color: WineColor.White, minYears: 5, maxYears: 15 },
  // Montrachet Grand Cru : plus grand blanc de Bourgogne, 10-30 ans (Jancis Robinson OCW, BIVB)
  { id: 'montrachet', name: 'Montrachet', country: 'France', region: 'Bourgogne', color: WineColor.White, minYears: 10, maxYears: 30 },
  { id: 'batard-montrachet', name: 'Bâtard-Montrachet', country: 'France', region: 'Bourgogne', color: WineColor.White, minYears: 8, maxYears: 25 },
  { id: 'chevalier-montrachet', name: 'Chevalier-Montrachet', country: 'France', region: 'Bourgogne', color: WineColor.White, minYears: 8, maxYears: 25 },
  // Corton-Charlemagne : comparable au Montrachet en longévité, 8-25 ans (BIVB, Decanter)
  { id: 'corton-charlemagne', name: 'Corton-Charlemagne', country: 'France', region: 'Bourgogne', color: WineColor.White, minYears: 8, maxYears: 25 },
  { id: 'macon', name: 'Mâcon', country: 'France', region: 'Bourgogne', color: WineColor.White, minYears: 2, maxYears: 5 },
  { id: 'macon-villages', name: 'Mâcon-Villages', country: 'France', region: 'Bourgogne', color: WineColor.White, minYears: 2, maxYears: 5 },
  { id: 'pouilly-fuisse', name: 'Pouilly-Fuissé', country: 'France', region: 'Bourgogne', color: WineColor.White, minYears: 3, maxYears: 8 },
  { id: 'saint-veran', name: 'Saint-Véran', country: 'France', region: 'Bourgogne', color: WineColor.White, minYears: 2, maxYears: 6 },
  { id: 'vire-clesse', name: 'Viré-Clessé', country: 'France', region: 'Bourgogne', color: WineColor.White, minYears: 3, maxYears: 8 },
  // BOURGOGNE — Côte Chalonnaise
  { id: 'mercurey-rouge', name: 'Mercurey', country: 'France', region: 'Bourgogne', color: WineColor.Red, minYears: 4, maxYears: 10 },
  { id: 'mercurey-blanc', name: 'Mercurey Blanc', country: 'France', region: 'Bourgogne', color: WineColor.White, minYears: 3, maxYears: 8 },
  { id: 'givry-rouge', name: 'Givry', country: 'France', region: 'Bourgogne', color: WineColor.Red, minYears: 4, maxYears: 10 },
  { id: 'givry-blanc', name: 'Givry Blanc', country: 'France', region: 'Bourgogne', color: WineColor.White, minYears: 3, maxYears: 7 },
  { id: 'rully-rouge', name: 'Rully Rouge', country: 'France', region: 'Bourgogne', color: WineColor.Red, minYears: 3, maxYears: 8 },
  { id: 'rully-blanc', name: 'Rully Blanc', country: 'France', region: 'Bourgogne', color: WineColor.White, minYears: 3, maxYears: 8 },
  { id: 'montagny', name: 'Montagny', country: 'France', region: 'Bourgogne', color: WineColor.White, minYears: 2, maxYears: 7 },
  // Bouzeron : seule AOC dédiée à l'Aligoté, produite par Aubert de Villaine (BIVB)
  { id: 'bouzeron', name: 'Bouzeron', country: 'France', region: 'Bourgogne', color: WineColor.White, minYears: 2, maxYears: 5 },
  { id: 'bourgogne-aligote', name: 'Bourgogne Aligoté', country: 'France', region: 'Bourgogne', color: WineColor.White, minYears: 1, maxYears: 4 },
  { id: 'irancy', name: 'Irancy', country: 'France', region: 'Bourgogne', color: WineColor.Red, minYears: 4, maxYears: 10 },
  // SAVOIE
  { id: 'vin-de-savoie', name: 'Vin de Savoie', country: 'France', region: 'Savoie', color: WineColor.White, minYears: 1, maxYears: 4 },
  { id: 'vin-de-savoie-rouge', name: 'Vin de Savoie Rouge', country: 'France', region: 'Savoie', color: WineColor.Red, minYears: 2, maxYears: 5 },
  { id: 'roussette-de-savoie', name: 'Roussette de Savoie', country: 'France', region: 'Savoie', color: WineColor.White, minYears: 3, maxYears: 8 },
  // Chignin-Bergeron : Roussanne de Savoie, belle finesse et aptitude à la garde (CIVS)
  { id: 'chignin-bergeron', name: 'Chignin-Bergeron', country: 'France', region: 'Savoie', color: WineColor.White, minYears: 3, maxYears: 8 },
  // Mondeuse : cépage rouge savoyard à la tannicité marquée, comparable à la Syrah (Guide Hachette)
  { id: 'mondeuse', name: 'Mondeuse', country: 'France', region: 'Savoie', color: WineColor.Red, minYears: 4, maxYears: 10 },
  // BEAUJOLAIS
  { id: 'beaujolais', name: 'Beaujolais', country: 'France', region: 'Beaujolais', color: WineColor.Red, minYears: 1, maxYears: 3 },
  { id: 'beaujolais-villages', name: 'Beaujolais-Villages', country: 'France', region: 'Beaujolais', color: WineColor.Red, minYears: 1, maxYears: 4 },
  { id: 'morgon', name: 'Morgon', country: 'France', region: 'Beaujolais', color: WineColor.Red, minYears: 3, maxYears: 10 },
  { id: 'moulin-a-vent', name: 'Moulin-à-Vent', country: 'France', region: 'Beaujolais', color: WineColor.Red, minYears: 4, maxYears: 12 },
  { id: 'fleurie', name: 'Fleurie', country: 'France', region: 'Beaujolais', color: WineColor.Red, minYears: 2, maxYears: 6 },
  { id: 'brouilly', name: 'Brouilly', country: 'France', region: 'Beaujolais', color: WineColor.Red, minYears: 1, maxYears: 5 },
  { id: 'cote-de-brouilly', name: 'Côte de Brouilly', country: 'France', region: 'Beaujolais', color: WineColor.Red, minYears: 2, maxYears: 6 },
  { id: 'chiroubles', name: 'Chiroubles', country: 'France', region: 'Beaujolais', color: WineColor.Red, minYears: 1, maxYears: 4 },
  { id: 'julienas', name: 'Juliénas', country: 'France', region: 'Beaujolais', color: WineColor.Red, minYears: 2, maxYears: 8 },
  { id: 'chenas', name: 'Chénas', country: 'France', region: 'Beaujolais', color: WineColor.Red, minYears: 3, maxYears: 8 },
  { id: 'regnie', name: 'Régnié', country: 'France', region: 'Beaujolais', color: WineColor.Red, minYears: 1, maxYears: 4 },
  { id: 'saint-amour', name: 'Saint-Amour', country: 'France', region: 'Beaujolais', color: WineColor.Red, minYears: 2, maxYears: 6 },
  // JURA
  // Vin Jaune / Château-Chalon : élevé 6 ans et 3 mois sous voile obligatoire ; potentiel de garde exceptionnel,
  // jusqu'à 50 ans et au-delà (INAO, iDealwine — un Château-Chalon 1895 encore jugé exceptionnel au XXIe siècle)
  { id: 'chateau-chalon', name: 'Château-Chalon (Vin Jaune)', country: 'France', region: 'Jura', color: WineColor.White, minYears: 10, maxYears: 50 },
  { id: 'arbois-rouge', name: 'Arbois Rouge', country: 'France', region: 'Jura', color: WineColor.Red, minYears: 3, maxYears: 10 },
  { id: 'cotes-du-jura', name: 'Côtes du Jura', country: 'France', region: 'Jura', color: WineColor.Red, minYears: 3, maxYears: 8 },
  { id: 'cotes-du-jura-blanc', name: 'Côtes du Jura Blanc', country: 'France', region: 'Jura', color: WineColor.White, minYears: 3, maxYears: 8 },
  { id: 'cremant-jura', name: 'Crémant du Jura', country: 'France', region: 'Jura', color: WineColor.Sparkling, minYears: 1, maxYears: 3 },
  // RHÔNE NORD
  // Côte-Rôtie : "s'ouvre idéalement après 8-12 ans, peut se garder 30 ans" (Les Passionnés du Vin)
  { id: 'cote-rotie', name: 'Côte-Rôtie', country: 'France', region: 'Rhône Nord', color: WineColor.Red, minYears: 8, maxYears: 25 },
  // Hermitage Rouge : "peut vieillir 20 à 30 ans dans les grandes années" (Les Passionnés du Vin, Jancis Robinson)
  { id: 'hermitage-rouge', name: 'Hermitage Rouge', country: 'France', region: 'Rhône Nord', color: WineColor.Red, minYears: 10, maxYears: 30 },
  { id: 'crozes-hermitage-rouge', name: 'Crozes-Hermitage', country: 'France', region: 'Rhône Nord', color: WineColor.Red, minYears: 4, maxYears: 10 },
  // Cornas : "minimum une quinzaine d'années", apogée vers 12 ans (Wineandbee, Les Passionnés du Vin)
  { id: 'cornas', name: 'Cornas', country: 'France', region: 'Rhône Nord', color: WineColor.Red, minYears: 8, maxYears: 20 },
  { id: 'saint-joseph-rouge', name: 'Saint-Joseph', country: 'France', region: 'Rhône Nord', color: WineColor.Red, minYears: 4, maxYears: 12 },
  { id: 'saint-joseph-blanc', name: 'Saint-Joseph Blanc', country: 'France', region: 'Rhône Nord', color: WineColor.White, minYears: 3, maxYears: 8 },
  { id: 'condrieu', name: 'Condrieu', country: 'France', region: 'Rhône Nord', color: WineColor.White, minYears: 2, maxYears: 6 },
  { id: 'hermitage-blanc', name: 'Hermitage Blanc', country: 'France', region: 'Rhône Nord', color: WineColor.White, minYears: 5, maxYears: 15 },
  { id: 'crozes-hermitage-blanc', name: 'Crozes-Hermitage Blanc', country: 'France', region: 'Rhône Nord', color: WineColor.White, minYears: 2, maxYears: 8 },
  // RHÔNE SUD
  // Châteauneuf-du-Pape : "10 à 20 ans selon le millésime" (Wikeeps, Les caves directes)
  { id: 'chateauneuf-du-pape', name: 'Châteauneuf-du-Pape', country: 'France', region: 'Rhône Sud', color: WineColor.Red, minYears: 8, maxYears: 20 },
  // CdP Blanc : Roussanne et Grenache blanc, tient 10-15 ans pour les meilleures cuvées
  { id: 'chateauneuf-du-pape-blanc', name: 'Châteauneuf-du-Pape Blanc', country: 'France', region: 'Rhône Sud', color: WineColor.White, minYears: 5, maxYears: 15 },
  { id: 'gigondas', name: 'Gigondas', country: 'France', region: 'Rhône Sud', color: WineColor.Red, minYears: 4, maxYears: 12 },
  { id: 'vacqueyras', name: 'Vacqueyras', country: 'France', region: 'Rhône Sud', color: WineColor.Red, minYears: 3, maxYears: 10 },
  { id: 'cotes-du-rhone-rouge', name: 'Côtes du Rhône', country: 'France', region: 'Rhône', color: WineColor.Red, minYears: 2, maxYears: 6 },
  { id: 'cotes-du-rhone-villages', name: 'Côtes du Rhône Villages', country: 'France', region: 'Rhône', color: WineColor.Red, minYears: 3, maxYears: 8 },
  { id: 'lirac', name: 'Lirac', country: 'France', region: 'Rhône Sud', color: WineColor.Red, minYears: 3, maxYears: 10 },
  { id: 'tavel', name: 'Tavel', country: 'France', region: 'Rhône Sud', color: WineColor.Rose, minYears: 1, maxYears: 5 },
  { id: 'rasteau', name: 'Rasteau', country: 'France', region: 'Rhône Sud', color: WineColor.Red, minYears: 4, maxYears: 12 },
  { id: 'muscat-beaumes-de-venise', name: 'Muscat de Beaumes-de-Venise', country: 'France', region: 'Rhône Sud', color: WineColor.Sweet, minYears: 2, maxYears: 8 },
  // LOIRE
  { id: 'muscadet', name: 'Muscadet', country: 'France', region: 'Loire', color: WineColor.White, minYears: 1, maxYears: 5 },
  { id: 'muscadet-sevre-maine', name: 'Muscadet Sèvre et Maine', country: 'France', region: 'Loire', color: WineColor.White, minYears: 2, maxYears: 7 },
  { id: 'sancerre-blanc', name: 'Sancerre', country: 'France', region: 'Loire', color: WineColor.White, minYears: 3, maxYears: 8 },
  { id: 'sancerre-rouge', name: 'Sancerre Rouge', country: 'France', region: 'Loire', color: WineColor.Red, minYears: 3, maxYears: 8 },
  { id: 'pouilly-fume', name: 'Pouilly-Fumé', country: 'France', region: 'Loire', color: WineColor.White, minYears: 3, maxYears: 8 },
  // Vouvray Sec : Chenin Blanc, capacité de garde exceptionnelle, jusqu'à 20-30 ans (Guide Hachette)
  { id: 'vouvray-sec', name: 'Vouvray Sec', country: 'France', region: 'Loire', color: WineColor.White, minYears: 5, maxYears: 20 },
  { id: 'vouvray-moelleux', name: 'Vouvray Moelleux', country: 'France', region: 'Loire', color: WineColor.Sweet, minYears: 10, maxYears: 30 },
  { id: 'chinon', name: 'Chinon', country: 'France', region: 'Loire', color: WineColor.Red, minYears: 4, maxYears: 12 },
  { id: 'bourgueil', name: 'Bourgueil', country: 'France', region: 'Loire', color: WineColor.Red, minYears: 4, maxYears: 10 },
  { id: 'saint-nicolas-de-bourgueil', name: 'Saint-Nicolas-de-Bourgueil', country: 'France', region: 'Loire', color: WineColor.Red, minYears: 3, maxYears: 8 },
  { id: 'anjou-rouge', name: 'Anjou Rouge', country: 'France', region: 'Loire', color: WineColor.Red, minYears: 3, maxYears: 8 },
  { id: 'anjou-blanc', name: 'Anjou Blanc', country: 'France', region: 'Loire', color: WineColor.White, minYears: 2, maxYears: 6 },
  // Savennières : Chenin Blanc sec de garde, nécessite 5-7 ans avant de s'ouvrir (Guide Hachette, iDealwine)
  { id: 'savennieres', name: 'Savennières', country: 'France', region: 'Loire', color: WineColor.White, minYears: 5, maxYears: 20 },
  { id: 'coteaux-du-layon', name: 'Coteaux du Layon', country: 'France', region: 'Loire', color: WineColor.Sweet, minYears: 8, maxYears: 25 },
  { id: 'quarts-de-chaume', name: 'Quarts de Chaume', country: 'France', region: 'Loire', color: WineColor.Sweet, minYears: 10, maxYears: 30 },
  { id: 'bonnezeaux', name: 'Bonnezeaux', country: 'France', region: 'Loire', color: WineColor.Sweet, minYears: 10, maxYears: 30 },
  // Saumur-Champigny : Cabernet Franc sur tuffeau, 4-10 ans pour les meilleures cuvées (Guide Hachette)
  { id: 'saumur-champigny', name: 'Saumur-Champigny', country: 'France', region: 'Loire', color: WineColor.Red, minYears: 4, maxYears: 10 },
  { id: 'saumur-blanc', name: 'Saumur Blanc', country: 'France', region: 'Loire', color: WineColor.White, minYears: 2, maxYears: 6 },
  // Montlouis-sur-Loire : Chenin Blanc sur silex, concurrent du Vouvray, potentiel comparable (iDealwine)
  { id: 'montlouis-sec', name: 'Montlouis-sur-Loire Sec', country: 'France', region: 'Loire', color: WineColor.White, minYears: 4, maxYears: 15 },
  { id: 'montlouis-moelleux', name: 'Montlouis-sur-Loire Moelleux', country: 'France', region: 'Loire', color: WineColor.Sweet, minYears: 8, maxYears: 25 },
  { id: 'menetou-salon-blanc', name: 'Ménetou-Salon Blanc', country: 'France', region: 'Loire', color: WineColor.White, minYears: 2, maxYears: 5 },
  { id: 'menetou-salon-rouge', name: 'Ménetou-Salon Rouge', country: 'France', region: 'Loire', color: WineColor.Red, minYears: 3, maxYears: 6 },
  // Anjou-Villages : Cabernet Franc et Sauvignon, appellation de rouge plus structurée (CIVL)
  { id: 'anjou-villages', name: 'Anjou-Villages', country: 'France', region: 'Loire', color: WineColor.Red, minYears: 4, maxYears: 10 },
  { id: 'touraine-rouge', name: 'Touraine Rouge', country: 'France', region: 'Loire', color: WineColor.Red, minYears: 2, maxYears: 5 },
  // ALSACE
  { id: 'alsace-riesling', name: "Riesling d'Alsace", country: 'France', region: 'Alsace', color: WineColor.White, minYears: 4, maxYears: 15 },
  { id: 'alsace-gewurztraminer', name: "Gewurztraminer d'Alsace", country: 'France', region: 'Alsace', color: WineColor.White, minYears: 3, maxYears: 10 },
  { id: 'alsace-pinot-gris', name: "Pinot Gris d'Alsace", country: 'France', region: 'Alsace', color: WineColor.White, minYears: 4, maxYears: 12 },
  { id: 'alsace-pinot-noir', name: "Pinot Noir d'Alsace", country: 'France', region: 'Alsace', color: WineColor.Red, minYears: 3, maxYears: 8 },
  { id: 'alsace-muscat', name: "Muscat d'Alsace", country: 'France', region: 'Alsace', color: WineColor.White, minYears: 2, maxYears: 5 },
  { id: 'alsace-sylvaner', name: "Sylvaner d'Alsace", country: 'France', region: 'Alsace', color: WineColor.White, minYears: 2, maxYears: 5 },
  { id: 'alsace-pinot-blanc', name: "Pinot Blanc d'Alsace", country: 'France', region: 'Alsace', color: WineColor.White, minYears: 2, maxYears: 5 },
  { id: 'alsace-grand-cru', name: 'Alsace Grand Cru', country: 'France', region: 'Alsace', color: WineColor.White, minYears: 5, maxYears: 20 },
  { id: 'alsace-vt-riesling', name: 'Riesling Vendanges Tardives', country: 'France', region: 'Alsace', color: WineColor.Sweet, minYears: 10, maxYears: 30 },
  { id: 'alsace-sgn', name: 'Sélection de Grains Nobles', country: 'France', region: 'Alsace', color: WineColor.Sweet, minYears: 15, maxYears: 40 },
  // CHAMPAGNE
  { id: 'champagne', name: 'Champagne', country: 'France', region: 'Champagne', color: WineColor.Sparkling, minYears: 2, maxYears: 5 },
  { id: 'champagne-millesime', name: 'Champagne Millésimé', country: 'France', region: 'Champagne', color: WineColor.Sparkling, minYears: 5, maxYears: 15 },
  { id: 'champagne-blanc-de-blancs', name: 'Champagne Blanc de Blancs', country: 'France', region: 'Champagne', color: WineColor.Sparkling, minYears: 3, maxYears: 10 },
  { id: 'champagne-blanc-de-noirs', name: 'Champagne Blanc de Noirs', country: 'France', region: 'Champagne', color: WineColor.Sparkling, minYears: 3, maxYears: 8 },
  { id: 'champagne-rose', name: 'Champagne Rosé', country: 'France', region: 'Champagne', color: WineColor.Sparkling, minYears: 3, maxYears: 8 },
  { id: 'cremant-alsace', name: "Crémant d'Alsace", country: 'France', region: 'Alsace', color: WineColor.Sparkling, minYears: 1, maxYears: 3 },
  { id: 'cremant-bourgogne', name: 'Crémant de Bourgogne', country: 'France', region: 'Bourgogne', color: WineColor.Sparkling, minYears: 1, maxYears: 3 },
  { id: 'cremant-loire', name: 'Crémant de Loire', country: 'France', region: 'Loire', color: WineColor.Sparkling, minYears: 1, maxYears: 3 },
  // LANGUEDOC-ROUSSILLON
  { id: 'corbieres', name: 'Corbières', country: 'France', region: 'Languedoc', color: WineColor.Red, minYears: 3, maxYears: 8 },
  { id: 'minervois', name: 'Minervois', country: 'France', region: 'Languedoc', color: WineColor.Red, minYears: 3, maxYears: 8 },
  { id: 'faugeres', name: 'Faugères', country: 'France', region: 'Languedoc', color: WineColor.Red, minYears: 4, maxYears: 10 },
  { id: 'saint-chinian', name: 'Saint-Chinian', country: 'France', region: 'Languedoc', color: WineColor.Red, minYears: 3, maxYears: 8 },
  { id: 'pic-saint-loup', name: 'Pic Saint-Loup', country: 'France', region: 'Languedoc', color: WineColor.Red, minYears: 4, maxYears: 10 },
  { id: 'cotes-du-roussillon', name: 'Côtes du Roussillon', country: 'France', region: 'Roussillon', color: WineColor.Red, minYears: 3, maxYears: 8 },
  { id: 'banyuls', name: 'Banyuls', country: 'France', region: 'Roussillon', color: WineColor.Sweet, minYears: 10, maxYears: 30 },
  { id: 'maury', name: 'Maury', country: 'France', region: 'Roussillon', color: WineColor.Sweet, minYears: 10, maxYears: 25 },
  { id: 'rivesaltes', name: 'Rivesaltes', country: 'France', region: 'Roussillon', color: WineColor.Sweet, minYears: 8, maxYears: 20 },
  // Picpoul de Pinet : vin blanc frais à boire jeune, acidité vive (CIVL)
  { id: 'picpoul-de-pinet', name: 'Picpoul de Pinet', country: 'France', region: 'Languedoc', color: WineColor.White, minYears: 1, maxYears: 3 },
  // Fitou : première AOC rouge du Languedoc, Carignan + Grenache, structuré (Guide Hachette)
  { id: 'fitou', name: 'Fitou', country: 'France', region: 'Languedoc', color: WineColor.Red, minYears: 4, maxYears: 10 },
  // Terrasses du Larzac : montées à 400-700m, vins frais et complexes, 5-12 ans (Decanter)
  { id: 'terrasses-du-larzac', name: 'Terrasses du Larzac', country: 'France', region: 'Languedoc', color: WineColor.Red, minYears: 5, maxYears: 12 },
  { id: 'blanquette-de-limoux', name: 'Blanquette de Limoux', country: 'France', region: 'Languedoc', color: WineColor.Sparkling, minYears: 2, maxYears: 5 },
  { id: 'cremant-de-limoux', name: 'Crémant de Limoux', country: 'France', region: 'Languedoc', color: WineColor.Sparkling, minYears: 1, maxYears: 4 },
  // Collioure : appellation rouge du Roussillon (Banyuls sec), grenache dominant, 4-10 ans (CIVR)
  { id: 'collioure', name: 'Collioure', country: 'France', region: 'Roussillon', color: WineColor.Red, minYears: 4, maxYears: 10 },
  // SUD-OUEST
  // Madiran : Tannat à la tannicité extrême, nécessite minimum 8 ans (La Cave Éclairée, iDealwine)
  { id: 'madiran', name: 'Madiran', country: 'France', region: 'Sud-Ouest', color: WineColor.Red, minYears: 8, maxYears: 20 },
  { id: 'cahors', name: 'Cahors', country: 'France', region: 'Sud-Ouest', color: WineColor.Red, minYears: 5, maxYears: 15 },
  { id: 'bergerac-rouge', name: 'Bergerac Rouge', country: 'France', region: 'Sud-Ouest', color: WineColor.Red, minYears: 3, maxYears: 8 },
  { id: 'monbazillac', name: 'Monbazillac', country: 'France', region: 'Sud-Ouest', color: WineColor.Sweet, minYears: 8, maxYears: 20 },
  { id: 'gaillac-rouge', name: 'Gaillac Rouge', country: 'France', region: 'Sud-Ouest', color: WineColor.Red, minYears: 3, maxYears: 8 },
  { id: 'jurancon-sec', name: 'Jurançon Sec', country: 'France', region: 'Sud-Ouest', color: WineColor.White, minYears: 3, maxYears: 8 },
  { id: 'jurancon', name: 'Jurançon', country: 'France', region: 'Sud-Ouest', color: WineColor.Sweet, minYears: 8, maxYears: 20 },
  // Fronton : Négrette, cépage unique de la région toulousaine (CIVSO)
  { id: 'fronton', name: 'Fronton', country: 'France', region: 'Sud-Ouest', color: WineColor.Red, minYears: 3, maxYears: 8 },
  // Marcillac : Fer Servadou (Mansoi) des plateaux de l'Aveyron, structure tannique (Guide Hachette)
  { id: 'marcillac', name: 'Marcillac', country: 'France', region: 'Sud-Ouest', color: WineColor.Red, minYears: 3, maxYears: 8 },
  // Irouléguy : Cabernets + Tannat du Pays Basque, terroir montagneux, 4-10 ans (CIVSO)
  { id: 'irouleguy', name: 'Irouléguy', country: 'France', region: 'Sud-Ouest', color: WineColor.Red, minYears: 4, maxYears: 10 },
  // Pécharmant : meilleure appellation rouge du Bergeracois, Merlot + Cabernets, 4-10 ans (iDealwine)
  { id: 'pecharmant', name: 'Pécharmant', country: 'France', region: 'Sud-Ouest', color: WineColor.Red, minYears: 4, maxYears: 10 },
  { id: 'cotes-de-duras', name: 'Côtes de Duras', country: 'France', region: 'Sud-Ouest', color: WineColor.Red, minYears: 2, maxYears: 6 },
  // Pacherenc du Vic-Bilh : blanc sec ou moelleux du Madiran, Arrufiac + Gros Manseng (CIVSO)
  { id: 'pacherenc-sec', name: 'Pacherenc du Vic-Bilh Sec', country: 'France', region: 'Sud-Ouest', color: WineColor.White, minYears: 3, maxYears: 8 },
  // PROVENCE / CORSE
  { id: 'bandol-rouge', name: 'Bandol', country: 'France', region: 'Provence', color: WineColor.Red, minYears: 5, maxYears: 15 },
  { id: 'bandol-rose', name: 'Bandol Rosé', country: 'France', region: 'Provence', color: WineColor.Rose, minYears: 2, maxYears: 6 },
  { id: 'cassis-blanc', name: 'Cassis Blanc', country: 'France', region: 'Provence', color: WineColor.White, minYears: 2, maxYears: 6 },
  { id: 'cotes-de-provence-rose', name: 'Côtes de Provence Rosé', country: 'France', region: 'Provence', color: WineColor.Rose, minYears: 1, maxYears: 3 },
  { id: 'cotes-de-provence-rouge', name: 'Côtes de Provence Rouge', country: 'France', region: 'Provence', color: WineColor.Red, minYears: 3, maxYears: 8 },
  { id: 'les-baux-de-provence', name: 'Les Baux-de-Provence', country: 'France', region: 'Provence', color: WineColor.Red, minYears: 4, maxYears: 10 },
  { id: 'palette', name: 'Palette', country: 'France', region: 'Provence', color: WineColor.Red, minYears: 5, maxYears: 15 },
  { id: 'coteaux-aix-rouge', name: "Coteaux d'Aix-en-Provence", country: 'France', region: 'Provence', color: WineColor.Red, minYears: 3, maxYears: 8 },
  { id: 'coteaux-aix-rose', name: "Coteaux d'Aix-en-Provence Rosé", country: 'France', region: 'Provence', color: WineColor.Rose, minYears: 1, maxYears: 3 },
  { id: 'coteaux-varois-rouge', name: 'Coteaux Varois en Provence Rouge', country: 'France', region: 'Provence', color: WineColor.Red, minYears: 3, maxYears: 8 },
  { id: 'coteaux-varois-rose', name: 'Coteaux Varois en Provence Rosé', country: 'France', region: 'Provence', color: WineColor.Rose, minYears: 1, maxYears: 3 },
  // Patrimonio : Nielluccio (Sangiovese corse), appellation de référence en Corse, 5-12 ans (CIVAM)
  { id: 'patrimonio-rouge', name: 'Patrimonio Rouge', country: 'France', region: 'Corse', color: WineColor.Red, minYears: 5, maxYears: 12 },
  { id: 'patrimonio-blanc', name: 'Patrimonio Blanc', country: 'France', region: 'Corse', color: WineColor.White, minYears: 3, maxYears: 8 },
  { id: 'ajaccio-rouge', name: 'Ajaccio Rouge', country: 'France', region: 'Corse', color: WineColor.Red, minYears: 4, maxYears: 10 },
  // ITALIE
  // Barolo : "mieux bu à 10 ans, peut se garder 30 ans et plus" (italian-wine-info.com, DOCG réglementation)
  { id: 'barolo', name: 'Barolo', country: 'Italie', region: 'Piémont', color: WineColor.Red, minYears: 10, maxYears: 30 },
  // Barbaresco : proche du Barolo mais légèrement plus accessible, DOCG 2 ans min (1 en fût)
  { id: 'barbaresco', name: 'Barbaresco', country: 'Italie', region: 'Piémont', color: WineColor.Red, minYears: 8, maxYears: 20 },
  // Brunello : DOCG impose 5 ans avant commercialisation ; grands millésimes tiennent 40+ ans
  { id: 'brunello-di-montalcino', name: 'Brunello di Montalcino', country: 'Italie', region: 'Toscane', color: WineColor.Red, minYears: 10, maxYears: 40 },
  // Brunello Riserva : 6 ans minimum avant commercialisation + 6-10 ans supplémentaires facilement (Big Hammer Wines)
  { id: 'brunello-riserva', name: 'Brunello di Montalcino Riserva', country: 'Italie', region: 'Toscane', color: WineColor.Red, minYears: 15, maxYears: 40 },
  { id: 'chianti-classico', name: 'Chianti Classico', country: 'Italie', region: 'Toscane', color: WineColor.Red, minYears: 5, maxYears: 15 },
  // Chianti Classico Riserva : 24 mois d'élevage obligatoire, tient 6-15 ans (Wine Enthusiast, Decanter)
  { id: 'chianti-classico-riserva', name: 'Chianti Classico Riserva', country: 'Italie', region: 'Toscane', color: WineColor.Red, minYears: 6, maxYears: 15 },
  // Gran Selezione : 30 mois d'élevage, sélection parcellaire, 8-20 ans (Wine Spectator)
  { id: 'chianti-classico-gran-selezione', name: 'Chianti Classico Gran Selezione', country: 'Italie', region: 'Toscane', color: WineColor.Red, minYears: 8, maxYears: 20 },
  { id: 'vino-nobile', name: 'Vino Nobile di Montepulciano', country: 'Italie', region: 'Toscane', color: WineColor.Red, minYears: 6, maxYears: 18 },
  // Amarone : vino da meditazione, séchage des raisins (appassimento), 10-25 ans (Big Hammer Wines, Vintec Club)
  { id: 'amarone', name: 'Amarone della Valpolicella', country: 'Italie', region: 'Vénétie', color: WineColor.Red, minYears: 10, maxYears: 25 },
  { id: 'ripasso', name: 'Valpolicella Ripasso', country: 'Italie', region: 'Vénétie', color: WineColor.Red, minYears: 4, maxYears: 10 },
  { id: 'bolgheri', name: 'Bolgheri Rosso', country: 'Italie', region: 'Toscane', color: WineColor.Red, minYears: 5, maxYears: 15 },
  { id: 'montepulciano-dabruzzo', name: "Montepulciano d'Abruzzo", country: 'Italie', region: 'Abruzzes', color: WineColor.Red, minYears: 3, maxYears: 8 },
  { id: 'primitivo', name: 'Primitivo di Manduria', country: 'Italie', region: 'Pouilles', color: WineColor.Red, minYears: 3, maxYears: 10 },
  // Taurasi : "Barolo du Sud", Aglianico ; min 8 ans de la vendange, optimal 10-20 ans (DOCG, Wine Enthusiast)
  { id: 'taurasi', name: 'Taurasi', country: 'Italie', region: 'Campanie', color: WineColor.Red, minYears: 8, maxYears: 20 },
  // Etna Rosso : Nerello Mascalese, complexité croissante sur 5-15 ans (Decanter, Wine Spectator)
  { id: 'etna-rosso', name: 'Etna Rosso', country: 'Italie', region: 'Sicile', color: WineColor.Red, minYears: 5, maxYears: 15 },
  // Sagrantino : cépage le plus tannique d'Italie, nécessite 8-10 ans minimum (Italian Wine Central)
  { id: 'sagrantino', name: 'Sagrantino di Montefalco', country: 'Italie', region: 'Ombrie', color: WineColor.Red, minYears: 8, maxYears: 20 },
  { id: 'nero-davola', name: "Nero d'Avola", country: 'Italie', region: 'Sicile', color: WineColor.Red, minYears: 3, maxYears: 10 },
  // Fiano di Avellino : blanc de garde de Campanie, 10 ans de potentiel (Big Hammer Wines)
  { id: 'fiano-di-avellino', name: 'Fiano di Avellino', country: 'Italie', region: 'Campanie', color: WineColor.White, minYears: 3, maxYears: 10 },
  // Valpolicella : entrée de gamme Vénétie, à boire jeune (Gambero Rosso)
  { id: 'valpolicella', name: 'Valpolicella', country: 'Italie', region: 'Vénétie', color: WineColor.Red, minYears: 2, maxYears: 6 },
  // Soave Classico : Garganega sur basalte, potentiel de garde méconnu, 3-7 ans (Wine Enthusiast)
  { id: 'soave-classico', name: 'Soave Classico', country: 'Italie', region: 'Vénétie', color: WineColor.White, minYears: 3, maxYears: 7 },
  // Lugana : Turbiana (Trebbiano di Lugana) sur le Lac de Garde, blanc de garde 3-8 ans (Decanter)
  { id: 'lugana', name: 'Lugana', country: 'Italie', region: 'Lombardie', color: WineColor.White, minYears: 3, maxYears: 8 },
  // Barolo Riserva : 62 mois d'élevage minimum (18 en fût), tient 15-35 ans (Consortium Barolo)
  { id: 'barolo-riserva', name: 'Barolo Riserva', country: 'Italie', region: 'Piémont', color: WineColor.Red, minYears: 15, maxYears: 35 },
  // Morellino di Scansano : Sangiovese de la Maremme toscane, accessible, 4-10 ans (Gambero Rosso)
  { id: 'morellino-di-scansano', name: 'Morellino di Scansano', country: 'Italie', region: 'Toscane', color: WineColor.Red, minYears: 4, maxYears: 10 },
  { id: 'vernaccia-di-san-gimignano', name: 'Vernaccia di San Gimignano', country: 'Italie', region: 'Toscane', color: WineColor.White, minYears: 2, maxYears: 5 },
  { id: 'greco-di-tufo', name: 'Greco di Tufo', country: 'Italie', region: 'Campanie', color: WineColor.White, minYears: 3, maxYears: 8 },
  // Franciacorta : méthode traditionnelle de Lombardie, DOCG, 3-8 ans (Consortium Franciacorta)
  { id: 'franciacorta', name: 'Franciacorta', country: 'Italie', region: 'Lombardie', color: WineColor.Sparkling, minYears: 3, maxYears: 8 },
  { id: 'prosecco', name: 'Prosecco', country: 'Italie', region: 'Vénétie', color: WineColor.Sparkling, minYears: 1, maxYears: 3 },
  // Cannonau di Sardegna : Grenache sarde, vins riches, 4-10 ans (Consorzio Vini di Sardegna)
  { id: 'cannonau-di-sardegna', name: 'Cannonau di Sardegna', country: 'Italie', region: 'Sardaigne', color: WineColor.Red, minYears: 4, maxYears: 10 },
  { id: 'vermentino-di-sardegna', name: 'Vermentino di Sardegna', country: 'Italie', region: 'Sardaigne', color: WineColor.White, minYears: 1, maxYears: 4 },
  { id: 'bardolino', name: 'Bardolino', country: 'Italie', region: 'Vénétie', color: WineColor.Red, minYears: 1, maxYears: 4 },
  { id: 'verdicchio-dei-castelli-di-jesi', name: 'Verdicchio dei Castelli di Jesi', country: 'Italie', region: 'Marches', color: WineColor.White, minYears: 2, maxYears: 6 },
  // ESPAGNE
  { id: 'rioja-crianza', name: 'Rioja Crianza', country: 'Espagne', region: 'Rioja', color: WineColor.Red, minYears: 4, maxYears: 10 },
  { id: 'rioja-reserva', name: 'Rioja Reserva', country: 'Espagne', region: 'Rioja', color: WineColor.Red, minYears: 6, maxYears: 15 },
  { id: 'rioja-gran-reserva', name: 'Rioja Gran Reserva', country: 'Espagne', region: 'Rioja', color: WineColor.Red, minYears: 10, maxYears: 25 },
  { id: 'ribera-del-duero', name: 'Ribera del Duero', country: 'Espagne', region: 'Castille', color: WineColor.Red, minYears: 5, maxYears: 15 },
  { id: 'priorat', name: 'Priorat', country: 'Espagne', region: 'Catalogne', color: WineColor.Red, minYears: 5, maxYears: 15 },
  // Toro : Tinta de Toro (Tempranillo local), vins très concentrés, 5-15 ans (Decanter)
  { id: 'toro', name: 'Toro', country: 'Espagne', region: 'Castille', color: WineColor.Red, minYears: 5, maxYears: 15 },
  { id: 'rias-baixas', name: 'Rías Baixas', country: 'Espagne', region: 'Galice', color: WineColor.White, minYears: 2, maxYears: 5 },
  { id: 'cava', name: 'Cava', country: 'Espagne', region: 'Catalogne', color: WineColor.Sparkling, minYears: 1, maxYears: 4 },
  // Rueda : Verdejo blanc frais de Castille, à boire jeune (CRDO Rueda)
  { id: 'rueda', name: 'Rueda', country: 'Espagne', region: 'Castille', color: WineColor.White, minYears: 1, maxYears: 4 },
  // Bierzo : Mencía sur ardoises galiciennes, style élégant proche du Pinot Noir, 4-10 ans (Decanter)
  { id: 'bierzo', name: 'Bierzo', country: 'Espagne', region: 'Castille-León', color: WineColor.Red, minYears: 4, maxYears: 10 },
  // Txakoli : blanc acide et perlant du Pays Basque espagnol, à boire très jeune (CRDO Getariako Txakolina)
  { id: 'txakoli', name: 'Txakoli', country: 'Espagne', region: 'Pays Basque', color: WineColor.White, minYears: 1, maxYears: 3 },
  { id: 'penedes-rouge', name: 'Penedès Rouge', country: 'Espagne', region: 'Catalogne', color: WineColor.Red, minYears: 3, maxYears: 8 },
  // PORTUGAL
  // Porto Vintage : "10-30 ans, les très grands millésimes bien au-delà" (Wine & Spirit Education Trust)
  { id: 'porto-vintage', name: 'Porto Vintage', country: 'Portugal', region: 'Douro', color: WineColor.Sweet, minYears: 10, maxYears: 30 },
  // Porto LBV : embouteillé après 4-6 ans en fût, à boire dans les 5-15 ans suivants (IVDP)
  { id: 'porto-lbv', name: 'Porto Late Bottled Vintage', country: 'Portugal', region: 'Douro', color: WineColor.Sweet, minYears: 5, maxYears: 15 },
  { id: 'douro-rouge', name: 'Douro Rouge', country: 'Portugal', region: 'Douro', color: WineColor.Red, minYears: 5, maxYears: 15 },
  // Dão : Touriga Nacional dominant, vins frais et structurés, 5-12 ans (Wine Enthusiast)
  { id: 'dao-rouge', name: 'Dão Rouge', country: 'Portugal', region: 'Dão', color: WineColor.Red, minYears: 5, maxYears: 12 },
  // Bairrada : Baga très tannique, comparable au Barolo en structure, 5-15 ans (Jancis Robinson)
  { id: 'bairrada', name: 'Bairrada Rouge', country: 'Portugal', region: 'Bairrada', color: WineColor.Red, minYears: 5, maxYears: 15 },
  { id: 'alentejo', name: 'Alentejo', country: 'Portugal', region: 'Alentejo', color: WineColor.Red, minYears: 3, maxYears: 8 },
  { id: 'vinho-verde', name: 'Vinho Verde', country: 'Portugal', region: 'Minho', color: WineColor.White, minYears: 1, maxYears: 3 },
  // Porto Tawny : vieilli en fût, oxydation contrôlée, indicatif d'âge 10/20/30/40 ans (IVDP)
  { id: 'porto-tawny', name: 'Porto Tawny', country: 'Portugal', region: 'Douro', color: WineColor.Sweet, minYears: 5, maxYears: 20 },
  // Porto Blanc : Malvasia + Gouveio, sec ou demi-sec, à boire dans les 3-10 ans (IVDP)
  { id: 'porto-blanc', name: 'Porto Blanc', country: 'Portugal', region: 'Douro', color: WineColor.Sweet, minYears: 3, maxYears: 10 },
  // Vinho Verde Tinto : rouge légèrement perlant du Minho, à boire très jeune (CVRVV)
  { id: 'vinho-verde-rouge', name: 'Vinho Verde Rouge', country: 'Portugal', region: 'Minho', color: WineColor.Red, minYears: 1, maxYears: 3 },
  // ALLEMAGNE
  // Riesling Kabinett : demi-sec léger, commence à s'épanouir dès 3 ans, potentiel 12 ans (Jancis Robinson OCW)
  { id: 'riesling-kabinett', name: 'Riesling Kabinett', country: 'Allemagne', region: 'Moselle / Rhin', color: WineColor.White, minYears: 3, maxYears: 12 },
  { id: 'riesling-spatlese', name: 'Riesling Spätlese', country: 'Allemagne', region: 'Moselle / Rhin', color: WineColor.White, minYears: 5, maxYears: 15 },
  { id: 'riesling-auslese', name: 'Riesling Auslese', country: 'Allemagne', region: 'Moselle / Rhin', color: WineColor.Sweet, minYears: 10, maxYears: 25 },
  // Eiswein : raisin gelé, concentration extrême, longévité 15-40 ans (VDP, Jancis Robinson)
  { id: 'riesling-eiswein', name: 'Riesling Eiswein', country: 'Allemagne', region: 'Moselle / Rhin', color: WineColor.Sweet, minYears: 15, maxYears: 40 },
  { id: 'riesling-tba', name: 'Riesling Trockenbeerenauslese', country: 'Allemagne', region: 'Moselle / Rhin', color: WineColor.Sweet, minYears: 15, maxYears: 40 },
  // AUTRICHE
  { id: 'gruner-veltliner', name: 'Grüner Veltliner', country: 'Autriche', region: 'Basse-Autriche', color: WineColor.White, minYears: 3, maxYears: 10 },
  // Riesling Smaragd (Wachau) : classification Smaragd = raisins les plus mûrs, longévité 5-15 ans (ÖWM)
  { id: 'riesling-smaragd', name: 'Riesling Smaragd (Wachau)', country: 'Autriche', region: 'Wachau', color: WineColor.White, minYears: 5, maxYears: 15 },
  // Blaufränkisch : cépage phare de Burgenland, structure tannique, 4-12 ans (ÖWM, Jancis Robinson)
  { id: 'blaufrankisch', name: 'Blaufränkisch', country: 'Autriche', region: 'Burgenland', color: WineColor.Red, minYears: 4, maxYears: 12 },
  // ÉTATS-UNIS
  { id: 'napa-cabernet', name: 'Napa Valley Cabernet Sauvignon', country: 'États-Unis', region: 'Californie', color: WineColor.Red, minYears: 5, maxYears: 20 },
  { id: 'sonoma-pinot-noir', name: 'Sonoma Pinot Noir', country: 'États-Unis', region: 'Californie', color: WineColor.Red, minYears: 3, maxYears: 10 },
  // AUSTRALIE
  { id: 'barossa-shiraz', name: 'Barossa Valley Shiraz', country: 'Australie', region: 'Barossa Valley', color: WineColor.Red, minYears: 5, maxYears: 15 },
  { id: 'coonawarra-cabernet', name: 'Coonawarra Cabernet Sauvignon', country: 'Australie', region: 'Coonawarra', color: WineColor.Red, minYears: 5, maxYears: 15 },
  // NOUVELLE-ZÉLANDE
  { id: 'marlborough-sauvignon', name: 'Marlborough Sauvignon Blanc', country: 'Nouvelle-Zélande', region: 'Marlborough', color: WineColor.White, minYears: 1, maxYears: 4 },
  { id: 'central-otago-pinot', name: 'Central Otago Pinot Noir', country: 'Nouvelle-Zélande', region: 'Central Otago', color: WineColor.Red, minYears: 4, maxYears: 10 },
  // ARGENTINE
  { id: 'mendoza-malbec', name: 'Mendoza Malbec', country: 'Argentine', region: 'Mendoza', color: WineColor.Red, minYears: 3, maxYears: 12 },
  // CHILI
  { id: 'maipo-cabernet', name: 'Maipo Valley Cabernet Sauvignon', country: 'Chili', region: 'Maipo Valley', color: WineColor.Red, minYears: 4, maxYears: 12 },
  // AFRIQUE DU SUD
  { id: 'stellenbosch', name: 'Stellenbosch Rouge', country: 'Afrique du Sud', region: 'Stellenbosch', color: WineColor.Red, minYears: 4, maxYears: 12 },
]

// ─────────────────────────────────────────────────────────────────────────────
// ENRICHISSEMENT DES APPELLATIONS MAJEURES
//
// Cépages, style, potentiel de revente et accords iconiques, fusionnés dans
// APPELLATION_PROFILES à l'initialisation. Les arômes/accords génériques sont
// dérivés des cépages (voir grapeProfiles.ts) ; on ne précise ici que les
// surcharges iconiques (ex. Sauternes → foie gras, Chablis → huîtres).
//
// Potentiel de revente d'après le marché secondaire reconnu (Liv-ex, iDealwine,
// Wine-Searcher) : 'excellent' = vins de spéculation établis ; 'good' = cote
// solide et liquide ; 'moderate' = revente possible mais marché étroit ;
// 'low' = vin de consommation.
// ─────────────────────────────────────────────────────────────────────────────

const APPELLATION_ENRICHMENT: Record<string, Partial<AppellationProfile>> = {
  // ─── BORDEAUX ───────────────────────────────────────────────────────────────
  'bordeaux-rouge': { grapes: ['Merlot', 'Cabernet Sauvignon', 'Cabernet Franc'], style: 'Rouge de Bordeaux souple et fruité', investmentPotential: 'low', investmentNotes: 'Vin de consommation — pas de revente.' },
  'bordeaux-superieur': { grapes: ['Merlot', 'Cabernet Sauvignon'], style: 'Rouge un peu plus concentré et structuré', investmentPotential: 'low' },
  'medoc': { grapes: ['Cabernet Sauvignon', 'Merlot'], style: 'Rouge tannique du Médoc', investmentPotential: 'moderate', investmentNotes: 'Crus bourgeois recherchés ; cote modeste hors grands châteaux.' },
  'haut-medoc': { grapes: ['Cabernet Sauvignon', 'Merlot', 'Cabernet Franc'], style: 'Rouge de garde structuré', investmentPotential: 'moderate' },
  'saint-estephe': { grapes: ['Cabernet Sauvignon', 'Merlot'], style: 'Rouge puissant et tannique de longue garde', investmentPotential: 'good', investmentNotes: 'Cos d\'Estournel, Montrose : forte demande sur le marché secondaire.' },
  'pauillac': { grapes: ['Cabernet Sauvignon', 'Merlot', 'Cabernet Franc'], style: 'Rouge de grande garde, archétype du Médoc', investmentPotential: 'excellent', investmentNotes: 'Latour, Lafite, Mouton : valeurs spéculatives majeures (Liv-ex).' },
  'saint-julien': { grapes: ['Cabernet Sauvignon', 'Merlot'], style: 'Rouge classique, équilibre et finesse', investmentPotential: 'good', investmentNotes: 'Léoville-Las-Cases, Ducru-Beaucaillou : cote très liquide.' },
  'margaux': { grapes: ['Cabernet Sauvignon', 'Merlot'], style: 'Rouge élégant et parfumé', investmentPotential: 'excellent', investmentNotes: 'Château Margaux : valeur d\'investissement de référence.' },
  'listrac-medoc': { grapes: ['Merlot', 'Cabernet Sauvignon'], style: 'Rouge robuste du Médoc', investmentPotential: 'low' },
  'moulis': { grapes: ['Cabernet Sauvignon', 'Merlot'], style: 'Rouge structuré et abordable', investmentPotential: 'low' },
  'pessac-leognan-rouge': { grapes: ['Cabernet Sauvignon', 'Merlot'], style: 'Rouge de Graves, notes fumées', investmentPotential: 'excellent', investmentNotes: 'Haut-Brion, La Mission, Pape Clément : très recherchés.' },
  'graves-rouge': { grapes: ['Cabernet Sauvignon', 'Merlot'], style: 'Rouge de Graves, terreux et fumé', investmentPotential: 'low' },
  'saint-emilion': { grapes: ['Merlot', 'Cabernet Franc'], style: 'Rouge à dominante Merlot, rond', investmentPotential: 'moderate' },
  'saint-emilion-gc': { grapes: ['Merlot', 'Cabernet Franc'], style: 'Rouge de garde sur Merlot et Cabernet Franc', investmentPotential: 'good', investmentNotes: 'Premiers Grands Crus Classés (Ausone, Cheval Blanc, Pavie) : cote élevée.' },
  'pomerol': { grapes: ['Merlot', 'Cabernet Franc'], style: 'Rouge velouté et opulent sur Merlot', investmentPotential: 'excellent', investmentNotes: 'Petrus, Le Pin, Lafleur : parmi les vins les plus chers au monde.' },
  'fronsac': { grapes: ['Merlot', 'Cabernet Franc'], style: 'Rouge charnu, bon rapport qualité-prix', investmentPotential: 'low' },
  'canon-fronsac': { grapes: ['Merlot', 'Cabernet Franc'], style: 'Rouge structuré et minéral', investmentPotential: 'low' },
  'bordeaux-blanc': { grapes: ['Sauvignon Blanc', 'Sémillon'], style: 'Blanc sec vif et aromatique', investmentPotential: 'low' },
  'entre-deux-mers': { grapes: ['Sauvignon Blanc', 'Sémillon', 'Muscadelle'], style: 'Blanc sec frais à boire jeune', investmentPotential: 'low' },
  'pessac-leognan-blanc': { grapes: ['Sauvignon Blanc', 'Sémillon'], style: 'Blanc sec de garde, complexe et boisé', investmentPotential: 'good', investmentNotes: 'Les grands blancs (Haut-Brion Blanc, Smith Haut Lafitte) ont une vraie cote.' },
  'graves-blanc': { grapes: ['Sémillon', 'Sauvignon Blanc'], style: 'Blanc sec, fruits et fraîcheur', investmentPotential: 'low' },
  'sauternes': { grapes: ['Sémillon', 'Sauvignon Blanc', 'Muscadelle'], style: 'Liquoreux botrytisé d\'exception', aromas: ['Abricot confit', 'Miel', 'Safran', 'Écorce d\'orange', 'Cire'], foodPairings: ['Foie gras', 'Roquefort', 'Desserts aux fruits jaunes', 'Cuisine épicée'], investmentPotential: 'excellent', investmentNotes: 'Château d\'Yquem : grand vin de garde et d\'investissement.' },
  'barsac': { grapes: ['Sémillon', 'Sauvignon Blanc'], style: 'Liquoreux botrytisé, plus vif que Sauternes', foodPairings: ['Foie gras', 'Roquefort', 'Tarte aux fruits'], investmentPotential: 'good' },

  // ─── BOURGOGNE ───────────────────────────────────────────────────────────────
  'bourgogne-rouge': { grapes: ['Pinot Noir'], style: 'Pinot Noir souple et fruité', investmentPotential: 'low' },
  'cote-de-nuits-villages': { grapes: ['Pinot Noir'], style: 'Pinot Noir structuré de la Côte de Nuits', investmentPotential: 'moderate' },
  'nuits-saint-georges': { grapes: ['Pinot Noir'], style: 'Pinot Noir charpenté et terrien', investmentPotential: 'good' },
  'gevrey-chambertin': { grapes: ['Pinot Noir'], style: 'Pinot Noir puissant et profond', investmentPotential: 'good', investmentNotes: 'Forte demande, surtout sur les 1ers crus et domaines réputés.' },
  'chambertin': { grapes: ['Pinot Noir'], style: 'Grand cru racé et complet', investmentPotential: 'excellent', investmentNotes: 'Grand cru de tout premier plan (Rousseau, Leroy).' },
  'chambertin-clos-de-beze': { grapes: ['Pinot Noir'], style: 'Grand cru d\'une grande finesse', investmentPotential: 'excellent' },
  'chambolle-musigny': { grapes: ['Pinot Noir'], style: 'Pinot Noir floral et soyeux', investmentPotential: 'good' },
  'musigny': { grapes: ['Pinot Noir'], style: 'Grand cru d\'une élégance suprême', investmentPotential: 'excellent', investmentNotes: 'Musigny de Vogüé / Leroy : extrêmement recherché.' },
  'bonnes-mares': { grapes: ['Pinot Noir'], style: 'Grand cru structuré et profond', investmentPotential: 'excellent' },
  'vosne-romanee': { grapes: ['Pinot Noir'], style: 'Pinot Noir d\'une richesse exemplaire', investmentPotential: 'excellent', investmentNotes: 'Berceau de la Romanée-Conti : cote parmi les plus hautes au monde.' },
  'morey-saint-denis': { grapes: ['Pinot Noir'], style: 'Pinot Noir équilibré entre puissance et finesse', investmentPotential: 'good' },
  'clos-de-vougeot': { grapes: ['Pinot Noir'], style: 'Grand cru ample et tannique', investmentPotential: 'excellent' },
  'echezeaux': { grapes: ['Pinot Noir'], style: 'Grand cru fin et parfumé', investmentPotential: 'excellent' },
  'grands-echezeaux': { grapes: ['Pinot Noir'], style: 'Grand cru profond et racé', investmentPotential: 'excellent' },
  'pommard': { grapes: ['Pinot Noir'], style: 'Pinot Noir robuste et tannique', investmentPotential: 'moderate' },
  'volnay': { grapes: ['Pinot Noir'], style: 'Pinot Noir délicat et floral', investmentPotential: 'good' },
  'beaune': { grapes: ['Pinot Noir'], style: 'Pinot Noir souple et accessible', investmentPotential: 'moderate' },
  'aloxe-corton': { grapes: ['Pinot Noir'], style: 'Pinot Noir corsé du nord de la Côte de Beaune', investmentPotential: 'moderate' },
  'corton-rouge': { grapes: ['Pinot Noir'], style: 'Seul grand cru rouge de la Côte de Beaune', investmentPotential: 'excellent' },
  'savigny-les-beaune': { grapes: ['Pinot Noir'], style: 'Pinot Noir frais et digeste', investmentPotential: 'low' },
  'marsannay': { grapes: ['Pinot Noir'], style: 'Pinot Noir d\'entrée de Côte de Nuits', investmentPotential: 'low' },
  'fixin': { grapes: ['Pinot Noir'], style: 'Pinot Noir rustique et solide', investmentPotential: 'low' },
  'santenay': { grapes: ['Pinot Noir'], style: 'Pinot Noir terrien et fruité', investmentPotential: 'low' },
  'maranges': { grapes: ['Pinot Noir'], style: 'Pinot Noir corsé et abordable', investmentPotential: 'low' },
  'bourgogne-blanc': { grapes: ['Chardonnay'], style: 'Chardonnay vif et fruité', investmentPotential: 'low' },
  'chablis': { grapes: ['Chardonnay'], style: 'Chardonnay minéral et tendu, non boisé', aromas: ['Citron', 'Pomme verte', 'Pierre à fusil', 'Iode'], foodPairings: ['Huîtres', 'Fruits de mer', 'Poisson grillé', 'Chèvre frais'], investmentPotential: 'moderate' },
  'chablis-premier-cru': { grapes: ['Chardonnay'], style: 'Chablis plus riche et complexe', foodPairings: ['Fruits de mer', 'Poisson en sauce', 'Volaille'], investmentPotential: 'moderate' },
  'chablis-grand-cru': { grapes: ['Chardonnay'], style: 'Chablis de grande garde, profond et minéral', foodPairings: ['Homard', 'Poisson noble', 'Volaille à la crème'], investmentPotential: 'good' },
  'meursault': { grapes: ['Chardonnay'], style: 'Chardonnay ample, beurré et noiseté', investmentPotential: 'good' },
  'puligny-montrachet': { grapes: ['Chardonnay'], style: 'Chardonnay ciselé, floral et minéral', investmentPotential: 'good' },
  'chassagne-montrachet': { grapes: ['Chardonnay'], style: 'Chardonnay riche et équilibré', investmentPotential: 'good' },
  'montrachet': { grapes: ['Chardonnay'], style: 'Le plus grand blanc sec de Bourgogne', investmentPotential: 'excellent', investmentNotes: 'Montrachet (DRC, Leflaive) : sommet des blancs d\'investissement.' },
  'batard-montrachet': { grapes: ['Chardonnay'], style: 'Grand cru opulent et puissant', investmentPotential: 'excellent' },
  'chevalier-montrachet': { grapes: ['Chardonnay'], style: 'Grand cru tout en finesse minérale', investmentPotential: 'excellent' },
  'corton-charlemagne': { grapes: ['Chardonnay'], style: 'Grand cru blanc puissant de grande garde', investmentPotential: 'excellent' },
  'macon': { grapes: ['Chardonnay'], style: 'Chardonnay simple et fruité', investmentPotential: 'low' },
  'macon-villages': { grapes: ['Chardonnay'], style: 'Chardonnay généreux du Mâconnais', investmentPotential: 'low' },
  'pouilly-fuisse': { grapes: ['Chardonnay'], style: 'Chardonnay riche et minéral du Mâconnais', investmentPotential: 'moderate' },
  'saint-veran': { grapes: ['Chardonnay'], style: 'Chardonnay fin et frais', investmentPotential: 'low' },
  'vire-clesse': { grapes: ['Chardonnay'], style: 'Chardonnay rond et floral', investmentPotential: 'low' },
  'mercurey-rouge': { grapes: ['Pinot Noir'], style: 'Pinot Noir charnu de la Côte Chalonnaise', investmentPotential: 'low' },
  'mercurey-blanc': { grapes: ['Chardonnay'], style: 'Chardonnay vif et fruité', investmentPotential: 'low' },
  'givry-rouge': { grapes: ['Pinot Noir'], style: 'Pinot Noir épicé et souple', investmentPotential: 'low' },
  'givry-blanc': { grapes: ['Chardonnay'], style: 'Chardonnay frais', investmentPotential: 'low' },
  'rully-rouge': { grapes: ['Pinot Noir'], style: 'Pinot Noir léger et fruité', investmentPotential: 'low' },
  'rully-blanc': { grapes: ['Chardonnay'], style: 'Chardonnay vif, base de Crémant', investmentPotential: 'low' },
  'montagny': { grapes: ['Chardonnay'], style: 'Chardonnay tendu et minéral', investmentPotential: 'low' },
  'bouzeron': { grapes: ['Aligoté'], style: 'Aligoté d\'exception, vif et floral', investmentPotential: 'low' },
  'bourgogne-aligote': { grapes: ['Aligoté'], style: 'Blanc vif et citronné, idéal apéritif', investmentPotential: 'low' },
  'irancy': { grapes: ['Pinot Noir', 'César'], style: 'Pinot Noir frais de l\'Yonne', investmentPotential: 'low' },

  // ─── SAVOIE ───────────────────────────────────────────────────────────────
  'vin-de-savoie': { grapes: ['Jacquère'], style: 'Blanc alpin léger et vif', investmentPotential: 'low' },
  'vin-de-savoie-rouge': { grapes: ['Mondeuse', 'Gamay'], style: 'Rouge alpin frais et poivré', investmentPotential: 'low' },
  'roussette-de-savoie': { grapes: ['Altesse'], style: 'Blanc plus riche et aromatique', investmentPotential: 'low' },
  'chignin-bergeron': { grapes: ['Roussanne'], style: 'Blanc savoyard ample et floral', investmentPotential: 'low' },
  'mondeuse': { grapes: ['Mondeuse'], style: 'Rouge poivré et tannique, proche de la Syrah', investmentPotential: 'low' },

  // ─── BEAUJOLAIS ───────────────────────────────────────────────────────────────
  'beaujolais': { grapes: ['Gamay'], style: 'Rouge léger et gouleyant', investmentPotential: 'low' },
  'beaujolais-villages': { grapes: ['Gamay'], style: 'Gamay plus structuré et fruité', investmentPotential: 'low' },
  'morgon': { grapes: ['Gamay'], style: 'Cru du Beaujolais charnu, apte à la garde', investmentPotential: 'low' },
  'moulin-a-vent': { grapes: ['Gamay'], style: 'Le cru le plus structuré du Beaujolais', investmentPotential: 'moderate', investmentNotes: 'Les meilleures cuvées vieillissent comme un Bourgogne.' },
  'fleurie': { grapes: ['Gamay'], style: 'Cru floral et soyeux', investmentPotential: 'low' },
  'brouilly': { grapes: ['Gamay'], style: 'Cru fruité et rond', investmentPotential: 'low' },
  'cote-de-brouilly': { grapes: ['Gamay'], style: 'Cru plus minéral et concentré', investmentPotential: 'low' },
  'chiroubles': { grapes: ['Gamay'], style: 'Cru léger et parfumé', investmentPotential: 'low' },
  'julienas': { grapes: ['Gamay'], style: 'Cru corsé et épicé', investmentPotential: 'low' },
  'chenas': { grapes: ['Gamay'], style: 'Cru charpenté et boisé', investmentPotential: 'low' },
  'regnie': { grapes: ['Gamay'], style: 'Cru tendre et fruité', investmentPotential: 'low' },
  'saint-amour': { grapes: ['Gamay'], style: 'Cru délicat et fruité', investmentPotential: 'low' },

  // ─── JURA ───────────────────────────────────────────────────────────────
  'chateau-chalon': { grapes: ['Savagnin'], style: 'Vin jaune sous voile, noix et curry, garde quasi illimitée', aromas: ['Noix', 'Curry', 'Pomme verte', 'Amande grillée'], foodPairings: ['Coq au vin jaune', 'Comté', 'Morilles', 'Volaille à la crème'], investmentPotential: 'good', investmentNotes: 'Rareté et longévité exceptionnelles ; cote en hausse (iDealwine).' },
  'arbois-rouge': { grapes: ['Poulsard', 'Trousseau', 'Pinot Noir'], style: 'Rouge léger et original du Jura', investmentPotential: 'low' },
  'cotes-du-jura': { grapes: ['Poulsard', 'Trousseau', 'Pinot Noir'], style: 'Rouge jurassien léger', investmentPotential: 'low' },
  'cotes-du-jura-blanc': { grapes: ['Chardonnay', 'Savagnin'], style: 'Blanc ouillé ou typé, parfois sous voile', investmentPotential: 'low' },
  'cremant-jura': { grapes: ['Chardonnay', 'Pinot Noir'], style: 'Effervescent fin et fruité', investmentPotential: 'low' },

  // ─── RHÔNE NORD ───────────────────────────────────────────────────────────────
  'cote-rotie': { grapes: ['Syrah', 'Viognier'], style: 'Syrah racée, florale et fumée', investmentPotential: 'excellent', investmentNotes: 'Guigal La Mouline/La Turque/La Landonne : cuvées de collection.' },
  'hermitage-rouge': { grapes: ['Syrah'], style: 'Syrah majestueuse de très longue garde', investmentPotential: 'excellent', investmentNotes: 'Chave, Jaboulet La Chapelle : grands vins d\'investissement.' },
  'crozes-hermitage-rouge': { grapes: ['Syrah'], style: 'Syrah accessible et fruitée', investmentPotential: 'low' },
  'cornas': { grapes: ['Syrah'], style: 'Syrah sauvage, dense et tannique', investmentPotential: 'good', investmentNotes: 'Clape, Allemand : forte hausse de cote.' },
  'saint-joseph-rouge': { grapes: ['Syrah'], style: 'Syrah élégante et poivrée', investmentPotential: 'moderate' },
  'saint-joseph-blanc': { grapes: ['Marsanne', 'Roussanne'], style: 'Blanc ample et floral', investmentPotential: 'low' },
  'condrieu': { grapes: ['Viognier'], style: 'Viognier opulent, abricot et fleurs', investmentPotential: 'moderate' },
  'hermitage-blanc': { grapes: ['Marsanne', 'Roussanne'], style: 'Blanc puissant de très grande garde', investmentPotential: 'good' },
  'crozes-hermitage-blanc': { grapes: ['Marsanne', 'Roussanne'], style: 'Blanc rond et frais', investmentPotential: 'low' },

  // ─── RHÔNE SUD ───────────────────────────────────────────────────────────────
  'chateauneuf-du-pape': { grapes: ['Grenache', 'Syrah', 'Mourvèdre'], style: 'Rouge solaire, riche et épicé', investmentPotential: 'good', investmentNotes: 'Rayas, Beaucastel, Pégaü : cuvées très recherchées.' },
  'chateauneuf-du-pape-blanc': { grapes: ['Grenache Blanc', 'Roussanne', 'Clairette'], style: 'Blanc gras et aromatique', investmentPotential: 'moderate' },
  'gigondas': { grapes: ['Grenache', 'Syrah', 'Mourvèdre'], style: 'Rouge généreux et charpenté', investmentPotential: 'moderate' },
  'vacqueyras': { grapes: ['Grenache', 'Syrah', 'Mourvèdre'], style: 'Rouge épicé et chaleureux', investmentPotential: 'low' },
  'cotes-du-rhone-rouge': { grapes: ['Grenache', 'Syrah', 'Carignan'], style: 'Rouge fruité et convivial', investmentPotential: 'low' },
  'cotes-du-rhone-villages': { grapes: ['Grenache', 'Syrah', 'Mourvèdre'], style: 'Rouge plus structuré et épicé', investmentPotential: 'low' },
  'lirac': { grapes: ['Grenache', 'Syrah', 'Mourvèdre'], style: 'Rouge méridional équilibré', investmentPotential: 'low' },
  'tavel': { grapes: ['Grenache', 'Cinsault'], style: 'Rosé corsé de gastronomie', investmentPotential: 'low' },
  'rasteau': { grapes: ['Grenache', 'Syrah', 'Mourvèdre'], style: 'Rouge puissant et chaleureux', investmentPotential: 'low' },
  'muscat-beaumes-de-venise': { grapes: ['Muscat'], style: 'Vin doux naturel, raisin frais et fleurs', aromas: ['Raisin muscaté', 'Fleur d\'oranger', 'Pêche', 'Miel'], foodPairings: ['Desserts aux fruits', 'Tarte aux abricots', 'Melon', 'Apéritif'], investmentPotential: 'low' },

  // ─── LOIRE ───────────────────────────────────────────────────────────────
  'muscadet': { grapes: ['Melon de Bourgogne'], style: 'Blanc sec iodé, parfait sur les coquillages', foodPairings: ['Huîtres', 'Coquillages', 'Fruits de mer'], investmentPotential: 'low' },
  'muscadet-sevre-maine': { grapes: ['Melon de Bourgogne'], style: 'Muscadet sur lie, plus riche et minéral', foodPairings: ['Huîtres', 'Crustacés', 'Poisson grillé'], investmentPotential: 'low' },
  'sancerre-blanc': { grapes: ['Sauvignon Blanc'], style: 'Sauvignon ciselé, agrumes et minéralité', foodPairings: ['Crottin de Chavignol', 'Fruits de mer', 'Poisson', 'Asperges'], investmentPotential: 'low' },
  'sancerre-rouge': { grapes: ['Pinot Noir'], style: 'Pinot Noir léger et fruité', investmentPotential: 'low' },
  'pouilly-fume': { grapes: ['Sauvignon Blanc'], style: 'Sauvignon fumé et minéral', foodPairings: ['Poisson', 'Fruits de mer', 'Chèvre'], investmentPotential: 'low' },
  'vouvray-sec': { grapes: ['Chenin Blanc'], style: 'Chenin sec de grande garde', investmentPotential: 'moderate' },
  'vouvray-moelleux': { grapes: ['Chenin Blanc'], style: 'Chenin moelleux d\'une longévité remarquable', aromas: ['Coing', 'Miel', 'Abricot', 'Cire', 'Camomille'], foodPairings: ['Foie gras', 'Desserts aux fruits', 'Tarte Tatin', 'Apéritif'], investmentPotential: 'good', investmentNotes: 'Huet, Foreau : grands moelleux de garde recherchés.' },
  'chinon': { grapes: ['Cabernet Franc'], style: 'Cabernet Franc frais, fruits rouges et poivron', investmentPotential: 'low' },
  'bourgueil': { grapes: ['Cabernet Franc'], style: 'Cabernet Franc structuré sur tuf', investmentPotential: 'low' },
  'saint-nicolas-de-bourgueil': { grapes: ['Cabernet Franc'], style: 'Cabernet Franc souple et fruité', investmentPotential: 'low' },
  'anjou-rouge': { grapes: ['Cabernet Franc', 'Cabernet Sauvignon'], style: 'Rouge tendre et fruité', investmentPotential: 'low' },
  'anjou-blanc': { grapes: ['Chenin Blanc'], style: 'Chenin sec, sec ou demi-sec', investmentPotential: 'low' },
  'savennieres': { grapes: ['Chenin Blanc'], style: 'Chenin sec minéral de grande garde', investmentPotential: 'moderate' },
  'coteaux-du-layon': { grapes: ['Chenin Blanc'], style: 'Chenin moelleux botrytisé', foodPairings: ['Foie gras', 'Tarte aux fruits', 'Bleus'], investmentPotential: 'low' },
  'quarts-de-chaume': { grapes: ['Chenin Blanc'], style: 'Grand cru liquoreux de la Loire', foodPairings: ['Foie gras', 'Desserts aux fruits', 'Roquefort'], investmentPotential: 'moderate' },
  'bonnezeaux': { grapes: ['Chenin Blanc'], style: 'Liquoreux concentré et élégant', foodPairings: ['Foie gras', 'Desserts', 'Fromages bleus'], investmentPotential: 'moderate' },
  'saumur-champigny': { grapes: ['Cabernet Franc'], style: 'Cabernet Franc soyeux sur tuffeau', investmentPotential: 'low' },
  'saumur-blanc': { grapes: ['Chenin Blanc'], style: 'Chenin sec frais', investmentPotential: 'low' },
  'montlouis-sec': { grapes: ['Chenin Blanc'], style: 'Chenin sec vibrant, voisin de Vouvray', investmentPotential: 'low' },
  'montlouis-moelleux': { grapes: ['Chenin Blanc'], style: 'Chenin moelleux fin', foodPairings: ['Foie gras', 'Desserts aux fruits'], investmentPotential: 'low' },
  'menetou-salon-blanc': { grapes: ['Sauvignon Blanc'], style: 'Sauvignon frais, voisin de Sancerre', investmentPotential: 'low' },
  'menetou-salon-rouge': { grapes: ['Pinot Noir'], style: 'Pinot Noir léger', investmentPotential: 'low' },
  'anjou-villages': { grapes: ['Cabernet Franc', 'Cabernet Sauvignon'], style: 'Rouge plus structuré de l\'Anjou', investmentPotential: 'low' },
  'touraine-rouge': { grapes: ['Gamay', 'Cabernet Franc', 'Côt'], style: 'Rouge léger et fruité', investmentPotential: 'low' },

  // ─── ALSACE ───────────────────────────────────────────────────────────────
  'alsace-riesling': { grapes: ['Riesling'], style: 'Riesling sec, minéral et tendu', investmentPotential: 'low' },
  'alsace-gewurztraminer': { grapes: ['Gewurztraminer'], style: 'Aromatique et épicé, litchi et rose', investmentPotential: 'low' },
  'alsace-pinot-gris': { grapes: ['Pinot Gris'], style: 'Blanc ample, fruits et fumée', investmentPotential: 'low' },
  'alsace-pinot-noir': { grapes: ['Pinot Noir'], style: 'Pinot Noir léger d\'Alsace', investmentPotential: 'low' },
  'alsace-muscat': { grapes: ['Muscat'], style: 'Sec et croquant, raisin frais', investmentPotential: 'low' },
  'alsace-sylvaner': { grapes: ['Sylvaner'], style: 'Blanc sec léger et désaltérant', investmentPotential: 'low' },
  'alsace-pinot-blanc': { grapes: ['Pinot Blanc'], style: 'Blanc rond et souple', investmentPotential: 'low' },
  'alsace-grand-cru': { grapes: ['Riesling', 'Gewurztraminer', 'Pinot Gris', 'Muscat'], style: 'Blanc de terroir de grande garde', investmentPotential: 'moderate', investmentNotes: 'Trimbach Clos Sainte-Hune, Zind-Humbrecht : cote établie.' },
  'alsace-vt-riesling': { grapes: ['Riesling'], style: 'Vendanges tardives, moelleux concentré', foodPairings: ['Foie gras', 'Cuisine épicée', 'Desserts aux fruits'], investmentPotential: 'moderate' },
  'alsace-sgn': { grapes: ['Gewurztraminer', 'Riesling', 'Pinot Gris'], style: 'Sélection de grains nobles, liquoreux rare', foodPairings: ['Foie gras', 'Desserts', 'Roquefort'], investmentPotential: 'good' },

  // ─── CHAMPAGNE & EFFERVESCENTS ────────────────────────────────────────────────
  'champagne': { grapes: ['Chardonnay', 'Pinot Noir', 'Pinot Meunier'], style: 'Effervescent brut, festif par excellence', aromas: ['Agrumes', 'Brioche', 'Pomme', 'Fleurs blanches', 'Noisette'], foodPairings: ['Apéritif', 'Fruits de mer', 'Toasts', 'Sushi'], investmentPotential: 'moderate', investmentNotes: 'Les grandes maisons cotent ; cuvées de prestige plus liquides.' },
  'champagne-millesime': { grapes: ['Chardonnay', 'Pinot Noir'], style: 'Champagne de garde issu d\'une seule année', foodPairings: ['Poisson noble', 'Volaille', 'Fruits de mer', 'Apéritif'], investmentPotential: 'good', investmentNotes: 'Dom Pérignon, Cristal, Krug : valeurs d\'investissement reconnues.' },
  'champagne-blanc-de-blancs': { grapes: ['Chardonnay'], style: 'Champagne fin et ciselé, 100 % Chardonnay', foodPairings: ['Apéritif', 'Huîtres', 'Poisson', 'Fruits de mer'], investmentPotential: 'moderate' },
  'champagne-blanc-de-noirs': { grapes: ['Pinot Noir', 'Pinot Meunier'], style: 'Champagne vineux et puissant', foodPairings: ['Volaille', 'Charcuterie fine', 'Apéritif'], investmentPotential: 'moderate' },
  'champagne-rose': { grapes: ['Pinot Noir', 'Chardonnay'], style: 'Champagne rosé fruité et festif', foodPairings: ['Apéritif', 'Desserts aux fruits rouges', 'Saumon'], investmentPotential: 'moderate' },
  'cremant-alsace': { grapes: ['Pinot Blanc', 'Auxerrois', 'Chardonnay'], style: 'Effervescent fin et fruité', investmentPotential: 'low' },
  'cremant-bourgogne': { grapes: ['Chardonnay', 'Pinot Noir'], style: 'Effervescent élégant, méthode traditionnelle', investmentPotential: 'low' },
  'cremant-loire': { grapes: ['Chenin Blanc', 'Chardonnay'], style: 'Effervescent vif et floral', investmentPotential: 'low' },

  // ─── LANGUEDOC-ROUSSILLON ─────────────────────────────────────────────────────
  'corbieres': { grapes: ['Carignan', 'Grenache', 'Syrah', 'Mourvèdre'], style: 'Rouge épicé de garrigue', investmentPotential: 'low' },
  'minervois': { grapes: ['Syrah', 'Grenache', 'Carignan'], style: 'Rouge chaleureux et fruité', investmentPotential: 'low' },
  'faugeres': { grapes: ['Syrah', 'Grenache', 'Mourvèdre'], style: 'Rouge sur schistes, fin et épicé', investmentPotential: 'low' },
  'saint-chinian': { grapes: ['Syrah', 'Grenache', 'Mourvèdre'], style: 'Rouge généreux et structuré', investmentPotential: 'low' },
  'pic-saint-loup': { grapes: ['Syrah', 'Grenache', 'Mourvèdre'], style: 'Rouge frais et élégant en altitude', investmentPotential: 'low' },
  'cotes-du-roussillon': { grapes: ['Grenache', 'Syrah', 'Carignan'], style: 'Rouge solaire et épicé', investmentPotential: 'low' },
  'banyuls': { grapes: ['Grenache'], style: 'Vin doux naturel, cacao et fruits confits', aromas: ['Cacao', 'Figue', 'Pruneau', 'Café', 'Fruits confits'], foodPairings: ['Chocolat noir', 'Desserts au cacao', 'Roquefort'], investmentPotential: 'low' },
  'maury': { grapes: ['Grenache'], style: 'Vin doux naturel sur le fruit noir', foodPairings: ['Chocolat', 'Desserts', 'Fromages bleus'], investmentPotential: 'low' },
  'rivesaltes': { grapes: ['Grenache', 'Macabeu'], style: 'Vin doux naturel, fruits secs et rancio', foodPairings: ['Desserts aux fruits secs', 'Foie gras', 'Fromages'], investmentPotential: 'low' },
  'picpoul-de-pinet': { grapes: ['Piquepoul'], style: 'Blanc sec vif et iodé', foodPairings: ['Huîtres', 'Coquillages', 'Poisson grillé'], investmentPotential: 'low' },
  'fitou': { grapes: ['Carignan', 'Grenache', 'Syrah'], style: 'Rouge structuré et épicé', investmentPotential: 'low' },
  'terrasses-du-larzac': { grapes: ['Syrah', 'Grenache', 'Mourvèdre', 'Carignan'], style: 'Rouge frais et complexe d\'altitude', investmentPotential: 'moderate', investmentNotes: 'Appellation montante (Decanter) ; quelques domaines recherchés.' },
  'blanquette-de-limoux': { grapes: ['Mauzac', 'Chardonnay', 'Chenin Blanc'], style: 'Effervescent historique, pomme et fleurs', investmentPotential: 'low' },
  'cremant-de-limoux': { grapes: ['Chardonnay', 'Chenin Blanc', 'Mauzac'], style: 'Effervescent fin et frais', investmentPotential: 'low' },
  'collioure': { grapes: ['Grenache', 'Mourvèdre', 'Syrah'], style: 'Rouge maritime puissant', investmentPotential: 'low' },

  // ─── SUD-OUEST ───────────────────────────────────────────────────────────────
  'madiran': { grapes: ['Tannat', 'Cabernet Franc', 'Cabernet Sauvignon'], style: 'Rouge tannique et puissant de très longue garde', investmentPotential: 'low' },
  'cahors': { grapes: ['Malbec', 'Merlot', 'Tannat'], style: 'Rouge sombre et dense (« black wine »)', investmentPotential: 'low' },
  'bergerac-rouge': { grapes: ['Merlot', 'Cabernet Sauvignon', 'Cabernet Franc'], style: 'Rouge souple, cousin de Bordeaux', investmentPotential: 'low' },
  'monbazillac': { grapes: ['Sémillon', 'Sauvignon Blanc', 'Muscadelle'], style: 'Liquoreux botrytisé, alternative au Sauternes', foodPairings: ['Foie gras', 'Desserts', 'Roquefort'], investmentPotential: 'low' },
  'gaillac-rouge': { grapes: ['Braucol', 'Duras', 'Syrah'], style: 'Rouge original et épicé', investmentPotential: 'low' },
  'jurancon-sec': { grapes: ['Gros Manseng', 'Petit Manseng'], style: 'Blanc sec vif et exotique', investmentPotential: 'low' },
  'jurancon': { grapes: ['Petit Manseng'], style: 'Moelleux nerveux, fruits exotiques', aromas: ['Ananas', 'Mangue', 'Miel', 'Agrumes confits'], foodPairings: ['Foie gras', 'Desserts exotiques', 'Apéritif'], investmentPotential: 'low' },
  'fronton': { grapes: ['Négrette', 'Syrah', 'Cabernet'], style: 'Rouge floral et fruité de Toulouse', investmentPotential: 'low' },
  'marcillac': { grapes: ['Fer Servadou'], style: 'Rouge rustique et poivré de l\'Aveyron', investmentPotential: 'low' },
  'irouleguy': { grapes: ['Tannat', 'Cabernet Franc', 'Cabernet Sauvignon'], style: 'Rouge basque structuré', investmentPotential: 'low' },
  'pecharmant': { grapes: ['Merlot', 'Cabernet Sauvignon', 'Cabernet Franc'], style: 'Rouge de garde du Bergeracois', investmentPotential: 'low' },
  'cotes-de-duras': { grapes: ['Merlot', 'Cabernet'], style: 'Rouge léger et fruité', investmentPotential: 'low' },
  'pacherenc-sec': { grapes: ['Gros Manseng', 'Petit Manseng', 'Arrufiac'], style: 'Blanc sec aromatique du Madiranais', investmentPotential: 'low' },

  // ─── PROVENCE / CORSE ─────────────────────────────────────────────────────────
  'bandol-rouge': { grapes: ['Mourvèdre', 'Grenache', 'Cinsault'], style: 'Rouge puissant de garde sur Mourvèdre', investmentPotential: 'moderate', investmentNotes: 'Tempier, Pibarnon : cuvées recherchées.' },
  'bandol-rose': { grapes: ['Mourvèdre', 'Grenache', 'Cinsault'], style: 'Rosé de gastronomie, structuré', investmentPotential: 'low' },
  'cassis-blanc': { grapes: ['Marsanne', 'Clairette', 'Ugni Blanc'], style: 'Blanc maritime frais', foodPairings: ['Bouillabaisse', 'Poisson grillé', 'Fruits de mer'], investmentPotential: 'low' },
  'cotes-de-provence-rose': { grapes: ['Grenache', 'Cinsault', 'Syrah'], style: 'Rosé pâle, sec et désaltérant', foodPairings: ['Apéritif', 'Salades', 'Cuisine méditerranéenne', 'Grillades'], investmentPotential: 'low' },
  'cotes-de-provence-rouge': { grapes: ['Grenache', 'Syrah', 'Cinsault'], style: 'Rouge méditerranéen souple', investmentPotential: 'low' },
  'les-baux-de-provence': { grapes: ['Grenache', 'Syrah', 'Mourvèdre'], style: 'Rouge solaire, souvent en bio', investmentPotential: 'low' },
  'palette': { grapes: ['Mourvèdre', 'Grenache', 'Cinsault'], style: 'Rouge rare et structuré (Château Simone)', investmentPotential: 'moderate' },
  'coteaux-aix-rouge': { grapes: ['Grenache', 'Syrah', 'Cabernet Sauvignon'], style: 'Rouge méditerranéen équilibré', investmentPotential: 'low' },
  'coteaux-aix-rose': { grapes: ['Grenache', 'Cinsault', 'Syrah'], style: 'Rosé frais et fruité', investmentPotential: 'low' },
  'coteaux-varois-rouge': { grapes: ['Grenache', 'Syrah', 'Mourvèdre'], style: 'Rouge frais d\'altitude', investmentPotential: 'low' },
  'coteaux-varois-rose': { grapes: ['Grenache', 'Cinsault', 'Syrah'], style: 'Rosé vif et tendu', investmentPotential: 'low' },
  'patrimonio-rouge': { grapes: ['Nielluccio'], style: 'Rouge corse racé sur le Nielluccio', investmentPotential: 'low' },
  'patrimonio-blanc': { grapes: ['Vermentino'], style: 'Blanc corse floral et minéral', investmentPotential: 'low' },
  'ajaccio-rouge': { grapes: ['Sciaccarello', 'Grenache'], style: 'Rouge corse épicé et fin', investmentPotential: 'low' },

  // ─── ITALIE ───────────────────────────────────────────────────────────────
  'barolo': { grapes: ['Nebbiolo'], style: 'Le « roi » du Piémont, tannique et complexe', investmentPotential: 'excellent', investmentNotes: 'Giacomo Conterno, Giacosa : grands crus de collection.' },
  'barbaresco': { grapes: ['Nebbiolo'], style: 'Nebbiolo élégant, un peu plus accessible que Barolo', investmentPotential: 'good', investmentNotes: 'Gaja, Giacosa : cote internationale solide.' },
  'brunello-di-montalcino': { grapes: ['Sangiovese'], style: 'Sangiovese (Grosso) puissant de très longue garde', investmentPotential: 'excellent', investmentNotes: 'Biondi-Santi, Soldera : valeurs établies (Liv-ex).' },
  'brunello-riserva': { grapes: ['Sangiovese'], style: 'Brunello de sélection, garde exceptionnelle', investmentPotential: 'excellent' },
  'chianti-classico': { grapes: ['Sangiovese'], style: 'Rouge toscan vif, cerise et herbes', foodPairings: ['Pâtes à la tomate', 'Charcuterie', 'Pizza', 'Viandes grillées'], investmentPotential: 'moderate' },
  'chianti-classico-riserva': { grapes: ['Sangiovese'], style: 'Chianti de garde, plus profond', investmentPotential: 'moderate' },
  'chianti-classico-gran-selezione': { grapes: ['Sangiovese'], style: 'Sommet de l\'appellation, sélection parcellaire', investmentPotential: 'good' },
  'vino-nobile': { grapes: ['Sangiovese'], style: 'Sangiovese (Prugnolo Gentile) noble et structuré', investmentPotential: 'moderate' },
  'amarone': { grapes: ['Corvina', 'Rondinella', 'Molinara'], style: 'Rouge de raisins passerillés, riche et chaleureux', aromas: ['Cerise confite', 'Figue', 'Chocolat', 'Épices', 'Tabac'], foodPairings: ['Gibier', 'Viandes braisées', 'Parmesan', 'Risotto'], investmentPotential: 'good', investmentNotes: 'Quintarelli, Dal Forno : cuvées cultes très cotées.' },
  'ripasso': { grapes: ['Corvina', 'Rondinella'], style: 'Valpolicella « repassé » sur marcs d\'Amarone', investmentPotential: 'low' },
  'bolgheri': { grapes: ['Cabernet Sauvignon', 'Merlot', 'Cabernet Franc'], style: 'Assemblage bordelais toscan (« Super Toscan »)', investmentPotential: 'good', investmentNotes: 'Sassicaia, Ornellaia : icônes d\'investissement.' },
  'montepulciano-dabruzzo': { grapes: ['Montepulciano'], style: 'Rouge charnu et fruité', investmentPotential: 'low' },
  'primitivo': { grapes: ['Primitivo'], style: 'Rouge généreux et confituré des Pouilles', investmentPotential: 'low' },
  'taurasi': { grapes: ['Aglianico'], style: 'Le « Barolo du Sud », tannique et profond', investmentPotential: 'moderate' },
  'etna-rosso': { grapes: ['Nerello Mascalese'], style: 'Rouge volcanique fin et minéral', investmentPotential: 'moderate', investmentNotes: 'Appellation très en vogue (Decanter).' },
  'sagrantino': { grapes: ['Sagrantino'], style: 'Le rouge le plus tannique d\'Italie', investmentPotential: 'low' },
  'nero-davola': { grapes: ['Nero d\'Avola'], style: 'Rouge sicilien chaleureux et fruité', investmentPotential: 'low' },
  'fiano-di-avellino': { grapes: ['Fiano'], style: 'Blanc de garde campanien, miel et fumée', investmentPotential: 'low' },
  'valpolicella': { grapes: ['Corvina', 'Rondinella'], style: 'Rouge léger sur la cerise', investmentPotential: 'low' },
  'soave-classico': { grapes: ['Garganega'], style: 'Blanc vénitien minéral, amande et fleurs', investmentPotential: 'low' },
  'lugana': { grapes: ['Turbiana'], style: 'Blanc du lac de Garde, frais et floral', investmentPotential: 'low' },
  'barolo-riserva': { grapes: ['Nebbiolo'], style: 'Barolo de longue maturation, garde majeure', investmentPotential: 'excellent' },
  'morellino-di-scansano': { grapes: ['Sangiovese'], style: 'Sangiovese maremman accessible', investmentPotential: 'low' },
  'vernaccia-di-san-gimignano': { grapes: ['Vernaccia'], style: 'Blanc toscan vif et amer', investmentPotential: 'low' },
  'greco-di-tufo': { grapes: ['Greco'], style: 'Blanc campanien structuré et minéral', investmentPotential: 'low' },
  'franciacorta': { grapes: ['Chardonnay', 'Pinot Noir'], style: 'Effervescent italien méthode traditionnelle', foodPairings: ['Apéritif', 'Fruits de mer', 'Risotto'], investmentPotential: 'low' },
  'prosecco': { grapes: ['Glera'], style: 'Effervescent léger et fruité', foodPairings: ['Apéritif', 'Antipasti', 'Brunch'], investmentPotential: 'low' },
  'cannonau-di-sardegna': { grapes: ['Grenache'], style: 'Grenache sarde chaleureux', investmentPotential: 'low' },
  'vermentino-di-sardegna': { grapes: ['Vermentino'], style: 'Blanc méditerranéen frais et salin', investmentPotential: 'low' },
  'bardolino': { grapes: ['Corvina', 'Rondinella'], style: 'Rouge léger et désaltérant', investmentPotential: 'low' },
  'verdicchio-dei-castelli-di-jesi': { grapes: ['Verdicchio'], style: 'Blanc des Marches, agrumes et amande', investmentPotential: 'low' },

  // ─── ESPAGNE ───────────────────────────────────────────────────────────────
  'rioja-crianza': { grapes: ['Tempranillo', 'Garnacha'], style: 'Rouge fruité avec touche boisée', investmentPotential: 'low' },
  'rioja-reserva': { grapes: ['Tempranillo', 'Garnacha'], style: 'Rouge mûr et vanillé, élevage prolongé', investmentPotential: 'moderate' },
  'rioja-gran-reserva': { grapes: ['Tempranillo', 'Garnacha'], style: 'Rouge de grande garde, cuir et épices', investmentPotential: 'good', investmentNotes: 'López de Heredia, La Rioja Alta : cote internationale.' },
  'ribera-del-duero': { grapes: ['Tempranillo'], style: 'Rouge puissant et concentré', investmentPotential: 'good', investmentNotes: 'Vega Sicilia, Pingus : icônes spéculatives.' },
  'priorat': { grapes: ['Garnacha', 'Cariñena'], style: 'Rouge minéral et puissant sur llicorella', investmentPotential: 'good', investmentNotes: 'L\'Ermita (Álvaro Palacios) : vin de collection.' },
  'toro': { grapes: ['Tinta de Toro'], style: 'Rouge dense et concentré', investmentPotential: 'low' },
  'rias-baixas': { grapes: ['Albariño'], style: 'Blanc atlantique salin et floral', foodPairings: ['Fruits de mer', 'Poulpe', 'Poisson grillé'], investmentPotential: 'low' },
  'cava': { grapes: ['Macabeu', 'Xarel·lo', 'Parellada'], style: 'Effervescent méthode traditionnelle', foodPairings: ['Apéritif', 'Tapas', 'Fruits de mer'], investmentPotential: 'low' },
  'rueda': { grapes: ['Verdejo'], style: 'Blanc vif et herbacé', investmentPotential: 'low' },
  'bierzo': { grapes: ['Mencía'], style: 'Rouge élégant proche du Pinot/Cabernet Franc', investmentPotential: 'low' },
  'txakoli': { grapes: ['Hondarrabi Zuri'], style: 'Blanc perlant et acidulé du Pays Basque', foodPairings: ['Pintxos', 'Fruits de mer', 'Anchois'], investmentPotential: 'low' },
  'penedes-rouge': { grapes: ['Tempranillo', 'Cabernet Sauvignon', 'Garnacha'], style: 'Rouge catalan polyvalent', investmentPotential: 'low' },

  // ─── PORTUGAL ───────────────────────────────────────────────────────────────
  'porto-vintage': { grapes: ['Touriga Nacional', 'Touriga Franca', 'Tinta Roriz'], style: 'Porto d\'une seule grande année, garde majeure', aromas: ['Fruits noirs confits', 'Cacao', 'Réglisse', 'Épices'], foodPairings: ['Chocolat noir', 'Stilton', 'Noix', 'Desserts'], investmentPotential: 'excellent', investmentNotes: 'Taylor\'s, Graham\'s, Fonseca : grands millésimes très cotés.' },
  'porto-lbv': { grapes: ['Touriga Nacional', 'Touriga Franca'], style: 'Porto fruité prêt à boire', foodPairings: ['Chocolat', 'Fromages bleus', 'Desserts'], investmentPotential: 'low' },
  'douro-rouge': { grapes: ['Touriga Nacional', 'Touriga Franca', 'Tinta Roriz'], style: 'Rouge sec puissant du Douro', investmentPotential: 'moderate' },
  'dao-rouge': { grapes: ['Touriga Nacional', 'Tinta Roriz'], style: 'Rouge frais et structuré', investmentPotential: 'low' },
  'bairrada': { grapes: ['Baga'], style: 'Rouge tannique et acidulé', investmentPotential: 'low' },
  'alentejo': { grapes: ['Aragonez', 'Trincadeira', 'Alicante Bouschet'], style: 'Rouge généreux et rond', investmentPotential: 'low' },
  'vinho-verde': { grapes: ['Loureiro', 'Alvarinho', 'Trajadura'], style: 'Blanc léger, perlant et désaltérant', foodPairings: ['Fruits de mer', 'Poisson grillé', 'Apéritif'], investmentPotential: 'low' },
  'porto-tawny': { grapes: ['Touriga Nacional', 'Tinta Roriz'], style: 'Porto vieilli en fût, fruits secs et caramel', aromas: ['Noix', 'Caramel', 'Figue', 'Épices'], foodPairings: ['Desserts aux fruits secs', 'Crème brûlée', 'Fromages affinés'], investmentPotential: 'low' },
  'porto-blanc': { grapes: ['Malvasia', 'Gouveio', 'Rabigato'], style: 'Porto blanc, apéritif ou sur glace', foodPairings: ['Apéritif', 'Amandes', 'Fromages'], investmentPotential: 'low' },
  'vinho-verde-rouge': { grapes: ['Vinhão'], style: 'Rouge léger et acidulé', investmentPotential: 'low' },

  // ─── ALLEMAGNE ───────────────────────────────────────────────────────────────
  'riesling-kabinett': { grapes: ['Riesling'], style: 'Riesling léger demi-sec, agrumes et minéralité', foodPairings: ['Cuisine asiatique', 'Poisson', 'Apéritif'], investmentPotential: 'low' },
  'riesling-spatlese': { grapes: ['Riesling'], style: 'Riesling demi-sec plus mûr et concentré', foodPairings: ['Cuisine épicée', 'Porc', 'Poisson en sauce'], investmentPotential: 'moderate' },
  'riesling-auslese': { grapes: ['Riesling'], style: 'Riesling moelleux de vendange sélectionnée', foodPairings: ['Foie gras', 'Desserts aux fruits', 'Cuisine épicée'], investmentPotential: 'good', investmentNotes: 'Egon Müller, J.J. Prüm : grandes cuvées recherchées.' },
  'riesling-eiswein': { grapes: ['Riesling'], style: 'Vin de glace, concentration extrême', foodPairings: ['Desserts aux fruits', 'Foie gras'], investmentPotential: 'good' },
  'riesling-tba': { grapes: ['Riesling'], style: 'Trockenbeerenauslese, liquoreux d\'exception', foodPairings: ['Desserts', 'Foie gras'], investmentPotential: 'excellent', investmentNotes: 'Egon Müller TBA : parmi les blancs les plus chers au monde.' },

  // ─── AUTRICHE ───────────────────────────────────────────────────────────────
  'gruner-veltliner': { grapes: ['Grüner Veltliner'], style: 'Blanc sec, poivre blanc et agrumes', investmentPotential: 'low' },
  'riesling-smaragd': { grapes: ['Riesling'], style: 'Riesling sec puissant de la Wachau', investmentPotential: 'moderate' },
  'blaufrankisch': { grapes: ['Blaufränkisch'], style: 'Rouge épicé et structuré', investmentPotential: 'low' },

  // ─── NOUVEAU MONDE ───────────────────────────────────────────────────────────
  'napa-cabernet': { grapes: ['Cabernet Sauvignon'], style: 'Cabernet opulent et puissant de Napa', investmentPotential: 'excellent', investmentNotes: 'Screaming Eagle, Opus One, Harlan : « cult wines » très spéculatifs.' },
  'sonoma-pinot-noir': { grapes: ['Pinot Noir'], style: 'Pinot Noir charnu et fruité', investmentPotential: 'moderate' },
  'barossa-shiraz': { grapes: ['Shiraz'], style: 'Shiraz dense et confituré', investmentPotential: 'good', investmentNotes: 'Penfolds Grange : icône d\'investissement australienne.' },
  'coonawarra-cabernet': { grapes: ['Cabernet Sauvignon'], style: 'Cabernet sur terra rossa, eucalyptus et cassis', investmentPotential: 'moderate' },
  'marlborough-sauvignon': { grapes: ['Sauvignon Blanc'], style: 'Sauvignon exubérant, fruit de la passion', foodPairings: ['Fruits de mer', 'Asperges', 'Chèvre', 'Cuisine thaï'], investmentPotential: 'low' },
  'central-otago-pinot': { grapes: ['Pinot Noir'], style: 'Pinot Noir intense et fruité', investmentPotential: 'moderate' },
  'mendoza-malbec': { grapes: ['Malbec'], style: 'Malbec d\'altitude, velouté et floral', investmentPotential: 'low' },
  'maipo-cabernet': { grapes: ['Cabernet Sauvignon'], style: 'Cabernet chilien structuré et mentholé', investmentPotential: 'low' },
  'stellenbosch': { grapes: ['Cabernet Sauvignon', 'Syrah', 'Pinotage'], style: 'Rouge sud-africain structuré', investmentPotential: 'low' },
}

// ─────────────────────────────────────────────────────────────────────────────
// PRIX MARCHÉ INDICATIFS (€ / bouteille, millésime récent en bonne année)
//
// Médianes des fourchettes observées sur Wine-Searcher / iDealwine. Ces valeurs
// servent de base à l'estimation locale de la cote (LocalPriceEstimateService),
// qui les ajuste ensuite selon l'âge du millésime et le potentiel de garde —
// sans aucun appel API. Les appellations absentes de cette table sont estimées
// par dérivation (potentiel d'investissement + couleur) dans le service.
//
// Pour les appellations couvrant à la fois des crus modestes et des grands crus
// (Pauillac, Vosne-Romanée…), la fourchette reflète le cœur de marché observé,
// pas les cuvées de collection exceptionnelles.
// ─────────────────────────────────────────────────────────────────────────────
const APPELLATION_MARKET_PRICE: Record<string, { min: number; max: number }> = {
  // BORDEAUX
  'bordeaux-rouge': { min: 8, max: 15 },
  'bordeaux-superieur': { min: 10, max: 22 },
  'medoc': { min: 15, max: 32 },
  'haut-medoc': { min: 18, max: 45 },
  'saint-estephe': { min: 40, max: 110 },
  'pauillac': { min: 70, max: 250 },
  'saint-julien': { min: 55, max: 160 },
  'margaux': { min: 60, max: 220 },
  'listrac-medoc': { min: 16, max: 35 },
  'moulis': { min: 18, max: 40 },
  'pessac-leognan-rouge': { min: 40, max: 130 },
  'graves-rouge': { min: 14, max: 32 },
  'saint-emilion': { min: 18, max: 45 },
  'saint-emilion-gc': { min: 35, max: 130 },
  'pomerol': { min: 50, max: 200 },
  'fronsac': { min: 14, max: 30 },
  'canon-fronsac': { min: 16, max: 35 },
  'bordeaux-blanc': { min: 9, max: 18 },
  'entre-deux-mers': { min: 8, max: 15 },
  'pessac-leognan-blanc': { min: 35, max: 110 },
  'graves-blanc': { min: 13, max: 28 },
  'sauternes': { min: 30, max: 90 },
  'barsac': { min: 28, max: 75 },
  // BOURGOGNE
  'bourgogne-rouge': { min: 16, max: 35 },
  'cote-de-nuits-villages': { min: 28, max: 55 },
  'nuits-saint-georges': { min: 45, max: 120 },
  'gevrey-chambertin': { min: 50, max: 140 },
  'chambertin': { min: 280, max: 900 },
  'chambertin-clos-de-beze': { min: 260, max: 800 },
  'chambolle-musigny': { min: 55, max: 160 },
  'musigny': { min: 600, max: 2000 },
  'bonnes-mares': { min: 280, max: 750 },
  'vosne-romanee': { min: 80, max: 260 },
  'morey-saint-denis': { min: 50, max: 130 },
  'clos-de-vougeot': { min: 180, max: 480 },
  'echezeaux': { min: 220, max: 600 },
  'grands-echezeaux': { min: 320, max: 800 },
  'pommard': { min: 40, max: 95 },
  'volnay': { min: 40, max: 110 },
  'beaune': { min: 30, max: 70 },
  'aloxe-corton': { min: 38, max: 85 },
  'corton-rouge': { min: 90, max: 240 },
  'savigny-les-beaune': { min: 26, max: 55 },
  'marsannay': { min: 22, max: 45 },
  'fixin': { min: 24, max: 50 },
  'santenay': { min: 24, max: 50 },
  'maranges': { min: 20, max: 40 },
  'bourgogne-blanc': { min: 16, max: 35 },
  'chablis': { min: 16, max: 35 },
  'chablis-premier-cru': { min: 28, max: 65 },
  'chablis-grand-cru': { min: 50, max: 140 },
  'meursault': { min: 42, max: 120 },
  'puligny-montrachet': { min: 65, max: 190 },
  'chassagne-montrachet': { min: 55, max: 160 },
  'montrachet': { min: 800, max: 3000 },
  'batard-montrachet': { min: 320, max: 900 },
  'chevalier-montrachet': { min: 320, max: 900 },
  'corton-charlemagne': { min: 110, max: 350 },
  'macon': { min: 9, max: 18 },
  'macon-villages': { min: 11, max: 22 },
  'pouilly-fuisse': { min: 20, max: 48 },
  'saint-veran': { min: 14, max: 28 },
  'vire-clesse': { min: 14, max: 28 },
  'mercurey-rouge': { min: 20, max: 42 },
  'mercurey-blanc': { min: 18, max: 38 },
  'givry-rouge': { min: 18, max: 38 },
  'givry-blanc': { min: 16, max: 32 },
  'rully-rouge': { min: 16, max: 32 },
  'rully-blanc': { min: 16, max: 32 },
  'montagny': { min: 14, max: 28 },
  'bouzeron': { min: 14, max: 28 },
  'bourgogne-aligote': { min: 9, max: 18 },
  'irancy': { min: 14, max: 28 },
  // SAVOIE / BEAUJOLAIS / JURA
  'vin-de-savoie': { min: 8, max: 16 },
  'vin-de-savoie-rouge': { min: 9, max: 18 },
  'roussette-de-savoie': { min: 11, max: 22 },
  'chignin-bergeron': { min: 13, max: 26 },
  'mondeuse': { min: 11, max: 22 },
  'beaujolais': { min: 7, max: 13 },
  'beaujolais-villages': { min: 9, max: 16 },
  'morgon': { min: 13, max: 26 },
  'moulin-a-vent': { min: 15, max: 32 },
  'fleurie': { min: 13, max: 26 },
  'brouilly': { min: 11, max: 22 },
  'cote-de-brouilly': { min: 12, max: 24 },
  'chiroubles': { min: 12, max: 22 },
  'julienas': { min: 12, max: 24 },
  'chenas': { min: 13, max: 26 },
  'regnie': { min: 11, max: 20 },
  'saint-amour': { min: 13, max: 24 },
  'chateau-chalon': { min: 55, max: 130 },
  'arbois-rouge': { min: 16, max: 34 },
  'cotes-du-jura': { min: 15, max: 32 },
  'cotes-du-jura-blanc': { min: 17, max: 38 },
  'cremant-jura': { min: 13, max: 24 },
  // RHÔNE
  'cote-rotie': { min: 55, max: 180 },
  'hermitage-rouge': { min: 70, max: 250 },
  'crozes-hermitage-rouge': { min: 16, max: 36 },
  'cornas': { min: 40, max: 110 },
  'saint-joseph-rouge': { min: 22, max: 55 },
  'saint-joseph-blanc': { min: 20, max: 45 },
  'condrieu': { min: 32, max: 75 },
  'hermitage-blanc': { min: 60, max: 180 },
  'crozes-hermitage-blanc': { min: 15, max: 32 },
  'chateauneuf-du-pape': { min: 32, max: 95 },
  'chateauneuf-du-pape-blanc': { min: 32, max: 85 },
  'gigondas': { min: 20, max: 50 },
  'vacqueyras': { min: 15, max: 35 },
  'cotes-du-rhone-rouge': { min: 8, max: 16 },
  'cotes-du-rhone-villages': { min: 11, max: 24 },
  'lirac': { min: 12, max: 28 },
  'tavel': { min: 12, max: 26 },
  'rasteau': { min: 13, max: 28 },
  'muscat-beaumes-de-venise': { min: 14, max: 30 },
  // LOIRE
  'muscadet': { min: 8, max: 16 },
  'muscadet-sevre-maine': { min: 9, max: 20 },
  'sancerre-blanc': { min: 16, max: 38 },
  'sancerre-rouge': { min: 16, max: 36 },
  'pouilly-fume': { min: 16, max: 38 },
  'vouvray-sec': { min: 12, max: 30 },
  'vouvray-moelleux': { min: 20, max: 60 },
  'chinon': { min: 12, max: 30 },
  'bourgueil': { min: 12, max: 28 },
  'saint-nicolas-de-bourgueil': { min: 12, max: 26 },
  'anjou-rouge': { min: 9, max: 20 },
  'anjou-blanc': { min: 10, max: 24 },
  'savennieres': { min: 18, max: 45 },
  'coteaux-du-layon': { min: 14, max: 35 },
  'quarts-de-chaume': { min: 28, max: 70 },
  'bonnezeaux': { min: 24, max: 60 },
  'saumur-champigny': { min: 12, max: 30 },
  'saumur-blanc': { min: 11, max: 24 },
  'montlouis-sec': { min: 13, max: 30 },
  'montlouis-moelleux': { min: 18, max: 45 },
  'menetou-salon-blanc': { min: 13, max: 28 },
  'menetou-salon-rouge': { min: 13, max: 28 },
  'anjou-villages': { min: 11, max: 24 },
  'touraine-rouge': { min: 8, max: 18 },
  // ALSACE
  'alsace-riesling': { min: 11, max: 28 },
  'alsace-gewurztraminer': { min: 12, max: 30 },
  'alsace-pinot-gris': { min: 11, max: 28 },
  'alsace-pinot-noir': { min: 12, max: 30 },
  'alsace-muscat': { min: 11, max: 24 },
  'alsace-sylvaner': { min: 8, max: 16 },
  'alsace-pinot-blanc': { min: 8, max: 18 },
  'alsace-grand-cru': { min: 25, max: 70 },
  'alsace-vt-riesling': { min: 25, max: 60 },
  'alsace-sgn': { min: 45, max: 130 },
  // CHAMPAGNE & EFFERVESCENTS
  'champagne': { min: 28, max: 55 },
  'champagne-millesime': { min: 50, max: 180 },
  'champagne-blanc-de-blancs': { min: 35, max: 90 },
  'champagne-blanc-de-noirs': { min: 32, max: 80 },
  'champagne-rose': { min: 40, max: 110 },
  'cremant-alsace': { min: 11, max: 22 },
  'cremant-bourgogne': { min: 12, max: 24 },
  'cremant-loire': { min: 11, max: 22 },
  // LANGUEDOC-ROUSSILLON
  'corbieres': { min: 8, max: 20 },
  'minervois': { min: 9, max: 20 },
  'faugeres': { min: 11, max: 26 },
  'saint-chinian': { min: 10, max: 24 },
  'pic-saint-loup': { min: 14, max: 32 },
  'cotes-du-roussillon': { min: 9, max: 20 },
  'banyuls': { min: 14, max: 35 },
  'maury': { min: 13, max: 32 },
  'rivesaltes': { min: 12, max: 28 },
  'picpoul-de-pinet': { min: 8, max: 16 },
  'fitou': { min: 9, max: 20 },
  'terrasses-du-larzac': { min: 16, max: 40 },
  'blanquette-de-limoux': { min: 10, max: 20 },
  'cremant-de-limoux': { min: 11, max: 22 },
  'collioure': { min: 16, max: 35 },
  // SUD-OUEST
  'madiran': { min: 12, max: 32 },
  'cahors': { min: 10, max: 28 },
  'bergerac-rouge': { min: 8, max: 18 },
  'monbazillac': { min: 12, max: 28 },
  'gaillac-rouge': { min: 9, max: 20 },
  'jurancon-sec': { min: 11, max: 24 },
  'jurancon': { min: 14, max: 34 },
  'fronton': { min: 9, max: 20 },
  'marcillac': { min: 10, max: 22 },
  'irouleguy': { min: 13, max: 28 },
  'pecharmant': { min: 11, max: 26 },
  'cotes-de-duras': { min: 8, max: 16 },
  'pacherenc-sec': { min: 11, max: 24 },
  // PROVENCE / CORSE
  'bandol-rouge': { min: 22, max: 55 },
  'bandol-rose': { min: 18, max: 40 },
  'cassis-blanc': { min: 18, max: 38 },
  'cotes-de-provence-rose': { min: 10, max: 28 },
  'cotes-de-provence-rouge': { min: 10, max: 24 },
  'les-baux-de-provence': { min: 16, max: 38 },
  'palette': { min: 35, max: 75 },
  'coteaux-aix-rouge': { min: 10, max: 24 },
  'coteaux-aix-rose': { min: 10, max: 24 },
  'coteaux-varois-rouge': { min: 9, max: 20 },
  'coteaux-varois-rose': { min: 9, max: 20 },
  'patrimonio-rouge': { min: 15, max: 32 },
  'patrimonio-blanc': { min: 15, max: 30 },
  'ajaccio-rouge': { min: 15, max: 32 },
  // ITALIE
  'barolo': { min: 45, max: 150 },
  'barbaresco': { min: 40, max: 130 },
  'brunello-di-montalcino': { min: 50, max: 160 },
  'brunello-riserva': { min: 80, max: 250 },
  'chianti-classico': { min: 14, max: 35 },
  'chianti-classico-riserva': { min: 22, max: 55 },
  'chianti-classico-gran-selezione': { min: 35, max: 90 },
  'vino-nobile': { min: 18, max: 45 },
  'amarone': { min: 30, max: 90 },
  'ripasso': { min: 14, max: 30 },
  'bolgheri': { min: 30, max: 120 },
  'montepulciano-dabruzzo': { min: 8, max: 18 },
  'primitivo': { min: 9, max: 22 },
  'taurasi': { min: 22, max: 55 },
  'etna-rosso': { min: 18, max: 50 },
  'sagrantino': { min: 22, max: 50 },
  'nero-davola': { min: 9, max: 20 },
  'fiano-di-avellino': { min: 14, max: 30 },
  'valpolicella': { min: 9, max: 20 },
  'soave-classico': { min: 9, max: 22 },
  'lugana': { min: 12, max: 26 },
  'barolo-riserva': { min: 70, max: 250 },
  'morellino-di-scansano': { min: 11, max: 24 },
  'vernaccia-di-san-gimignano': { min: 10, max: 22 },
  'greco-di-tufo': { min: 13, max: 28 },
  'franciacorta': { min: 22, max: 50 },
  'prosecco': { min: 9, max: 20 },
  'cannonau-di-sardegna': { min: 11, max: 24 },
  'vermentino-di-sardegna': { min: 10, max: 22 },
  'bardolino': { min: 8, max: 16 },
  'verdicchio-dei-castelli-di-jesi': { min: 10, max: 24 },
  // ESPAGNE
  'rioja-crianza': { min: 9, max: 20 },
  'rioja-reserva': { min: 14, max: 35 },
  'rioja-gran-reserva': { min: 25, max: 70 },
  'ribera-del-duero': { min: 18, max: 60 },
  'priorat': { min: 22, max: 70 },
  'toro': { min: 12, max: 30 },
  'rias-baixas': { min: 12, max: 28 },
  'cava': { min: 8, max: 20 },
  'rueda': { min: 8, max: 16 },
  'bierzo': { min: 12, max: 30 },
  'txakoli': { min: 11, max: 24 },
  'penedes-rouge': { min: 9, max: 22 },
  // PORTUGAL
  'porto-vintage': { min: 45, max: 150 },
  'porto-lbv': { min: 16, max: 32 },
  'douro-rouge': { min: 14, max: 40 },
  'dao-rouge': { min: 10, max: 24 },
  'bairrada': { min: 10, max: 24 },
  'alentejo': { min: 9, max: 22 },
  'vinho-verde': { min: 7, max: 14 },
  'porto-tawny': { min: 18, max: 45 },
  'porto-blanc': { min: 14, max: 28 },
  'vinho-verde-rouge': { min: 7, max: 14 },
  // ALLEMAGNE / AUTRICHE
  'riesling-kabinett': { min: 14, max: 30 },
  'riesling-spatlese': { min: 18, max: 40 },
  'riesling-auslese': { min: 28, max: 70 },
  'riesling-eiswein': { min: 50, max: 130 },
  'riesling-tba': { min: 120, max: 400 },
  // NOUVEAU MONDE
  'napa-cabernet': { min: 45, max: 180 },
  'sonoma-pinot-noir': { min: 28, max: 65 },
  'barossa-shiraz': { min: 25, max: 80 },
  'coonawarra-cabernet': { min: 20, max: 50 },
  'marlborough-sauvignon': { min: 12, max: 26 },
  'central-otago-pinot': { min: 28, max: 65 },
  'mendoza-malbec': { min: 12, max: 35 },
  'maipo-cabernet': { min: 12, max: 35 },
  'stellenbosch': { min: 14, max: 40 },
}

// Fusion non destructive : on ne complète que les champs absents du profil de base
// (les fenêtres de garde et la couleur déjà définies restent prioritaires).
for (const profile of APPELLATION_PROFILES) {
  const extra = APPELLATION_ENRICHMENT[profile.id]
  if (extra) Object.assign(profile, extra)
  const price = APPELLATION_MARKET_PRICE[profile.id]
  if (price && profile.marketPriceEur === undefined) profile.marketPriceEur = price
}
