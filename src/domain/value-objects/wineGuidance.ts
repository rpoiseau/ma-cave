// Dérivation de conseils de dégustation pour un vin, à partir de sources reconnues.
//
// La guidance combine, par ordre de priorité :
//   1. Les données curées de l'appellation (APPELLATION_PROFILES) quand elles existent ;
//   2. Le profil du/des cépage(s) (GRAPE_PROFILES — Jancis Robinson « Wine Grapes », WSET) ;
//   3. Des valeurs par défaut par couleur (normes de service WSET / Guide Hachette).
//
// Fonction pure, sans effet de bord — conforme à la couche domaine.

import { WineColor } from './WineColor'
import { DrinkingMoment } from './DrinkingMoment'
import {
  APPELLATION_PROFILES,
  type AppellationProfile,
  type InvestmentPotential,
} from './appellations'
import { getGrapeProfile } from './grapeProfiles'

export interface WineGuidance {
  grapes: string[]
  style?: string
  aromas: string[]
  foodPairings: string[]
  servingTemp: string
  drinkingMoments: DrinkingMoment[]
  investmentPotential: InvestmentPotential
  investmentNotes?: string
  // Vrai si une appellation curée a alimenté la guidance (sinon dérivée du cépage/couleur).
  fromCuratedAppellation: boolean
}

export interface GuidanceInput {
  color: WineColor
  grapes?: string[]
  appellation?: string
}

export const INVESTMENT_LABELS: Record<InvestmentPotential, string> = {
  excellent: 'Excellent',
  good: 'Bon',
  moderate: 'Modéré',
  low: 'Faible',
}

// Échelle 0–3 pour comparer/trier les potentiels de revente.
export const INVESTMENT_RANK: Record<InvestmentPotential, number> = {
  excellent: 3,
  good: 2,
  moderate: 1,
  low: 0,
}

// ─── Normes de service par couleur (WSET / Guide Hachette) ────────────────────
const SERVING_TEMP: Record<WineColor, string> = {
  [WineColor.Red]: '16–18 °C',
  [WineColor.White]: '8–12 °C',
  [WineColor.Rose]: '8–10 °C',
  [WineColor.Sparkling]: '6–8 °C',
  [WineColor.Sweet]: '6–9 °C',
  [WineColor.Orange]: '12–14 °C',
}

// Affinage de la température pour les rouges légers (Gamay, Pinot d'entrée de gamme).
const LIGHT_RED_GRAPES = new Set(['gamay', 'pinot noir', 'cinsault'])

// ─── Moments de consommation par couleur ─────────────────────────────────────
const MOMENTS_BY_COLOR: Record<WineColor, DrinkingMoment[]> = {
  [WineColor.Red]: [DrinkingMoment.Plat, DrinkingMoment.Fromage],
  [WineColor.White]: [DrinkingMoment.Aperitif, DrinkingMoment.Entree, DrinkingMoment.Plat],
  [WineColor.Rose]: [DrinkingMoment.Aperitif, DrinkingMoment.Entree, DrinkingMoment.Plat],
  [WineColor.Sparkling]: [DrinkingMoment.Aperitif, DrinkingMoment.Entree, DrinkingMoment.Dessert],
  [WineColor.Sweet]: [DrinkingMoment.Aperitif, DrinkingMoment.Fromage, DrinkingMoment.Dessert],
  [WineColor.Orange]: [DrinkingMoment.Entree, DrinkingMoment.Plat],
}

// ─── Profils par défaut par couleur (fallback ultime) ────────────────────────
const COLOR_FALLBACK: Record<WineColor, { aromas: string[]; foodPairings: string[]; style: string }> = {
  [WineColor.Red]: {
    aromas: ['Fruits rouges', 'Fruits noirs', 'Épices'],
    foodPairings: ['Viandes rouges', 'Volaille', 'Fromages affinés'],
    style: 'Vin rouge',
  },
  [WineColor.White]: {
    aromas: ['Agrumes', 'Fruits blancs', 'Fleurs'],
    foodPairings: ['Poisson', 'Fruits de mer', 'Volaille'],
    style: 'Vin blanc sec',
  },
  [WineColor.Rose]: {
    aromas: ['Fraise', 'Agrumes', 'Fleurs'],
    foodPairings: ['Apéritif', 'Salades', 'Grillades', 'Cuisine méditerranéenne'],
    style: 'Vin rosé',
  },
  [WineColor.Sparkling]: {
    aromas: ['Agrumes', 'Brioche', 'Fleurs blanches', 'Pomme'],
    foodPairings: ['Apéritif', 'Fruits de mer', 'Toasts'],
    style: 'Vin effervescent',
  },
  [WineColor.Sweet]: {
    aromas: ['Miel', 'Fruits confits', 'Abricot', 'Fruits secs'],
    foodPairings: ['Foie gras', 'Roquefort', 'Desserts aux fruits'],
    style: 'Vin doux / liquoreux',
  },
  [WineColor.Orange]: {
    aromas: ['Abricot sec', 'Noix', 'Thé', 'Épices'],
    foodPairings: ['Cuisine épicée', 'Fromages affinés', 'Plats mijotés'],
    style: 'Vin de macération (orange)',
  },
}

function findAppellation(name?: string): AppellationProfile | undefined {
  if (!name) return undefined
  return APPELLATION_PROFILES.find((p) => p.name === name)
}

function uniqueCapped(values: string[], cap: number): string[] {
  const out: string[] = []
  const seen = new Set<string>()
  for (const v of values) {
    const key = v.toLowerCase()
    if (!seen.has(key)) {
      seen.add(key)
      out.push(v)
      if (out.length >= cap) break
    }
  }
  return out
}

// Estimation conservatrice du potentiel de revente quand l'appellation n'est pas curée.
// Basée sur le potentiel de garde ; à confirmer sur le marché secondaire.
function deriveInvestment(maxYears: number): { potential: InvestmentPotential; notes: string } {
  if (maxYears >= 25) {
    return {
      potential: 'moderate',
      notes: 'Bon potentiel de garde ; vérifiez la cote sur Wine-Searcher / iDealwine.',
    }
  }
  if (maxYears >= 12) {
    return {
      potential: 'low',
      notes: 'Marché secondaire limité — surtout un vin de plaisir.',
    }
  }
  return {
    potential: 'low',
    notes: 'À boire — pas de réelle valeur à la revente.',
  }
}

export function deriveWineGuidance(input: GuidanceInput): WineGuidance {
  const profile = findAppellation(input.appellation)

  // Cépages : ceux saisis par l'utilisateur priment, sinon ceux de l'appellation.
  const grapes =
    input.grapes && input.grapes.length > 0 ? input.grapes : (profile?.grapes ?? [])

  // Arômes : appellation curée > cépages > couleur.
  const grapeAromas = grapes.flatMap((g) => getGrapeProfile(g)?.aromas ?? [])
  const aromas = uniqueCapped(
    [...(profile?.aromas ?? []), ...grapeAromas, ...COLOR_FALLBACK[input.color].aromas],
    6,
  )

  // Accords mets : appellation curée > cépages > couleur.
  const grapePairings = grapes.flatMap((g) => getGrapeProfile(g)?.foodPairings ?? [])
  const foodPairings = uniqueCapped(
    [...(profile?.foodPairings ?? []), ...grapePairings, ...COLOR_FALLBACK[input.color].foodPairings],
    6,
  )

  // Température de service.
  let servingTemp = profile?.servingTemp ?? SERVING_TEMP[input.color]
  if (
    !profile?.servingTemp &&
    input.color === WineColor.Red &&
    grapes.some((g) => LIGHT_RED_GRAPES.has(g.toLowerCase()))
  ) {
    servingTemp = '14–16 °C'
  }

  // Moments de consommation.
  const drinkingMoments = MOMENTS_BY_COLOR[input.color]

  // Style.
  const style = profile?.style ?? COLOR_FALLBACK[input.color].style

  // Potentiel de revente.
  let investmentPotential: InvestmentPotential
  let investmentNotes: string | undefined
  if (profile?.investmentPotential) {
    investmentPotential = profile.investmentPotential
    investmentNotes = profile.investmentNotes
  } else {
    const derived = deriveInvestment(profile?.maxYears ?? 0)
    investmentPotential = derived.potential
    investmentNotes = derived.notes
  }

  return {
    grapes,
    style,
    aromas,
    foodPairings,
    servingTemp,
    drinkingMoments,
    investmentPotential,
    investmentNotes,
    fromCuratedAppellation: !!(profile && (profile.style || profile.aromas || profile.investmentPotential)),
  }
}
