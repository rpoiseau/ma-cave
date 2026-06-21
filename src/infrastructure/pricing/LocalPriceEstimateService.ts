import type { Bottle, PricePoint } from '@/domain/entities/Bottle'
import type { IWinePriceService } from '@/domain/repositories/IWinePriceService'
import type { Wine } from '@/domain/entities/Wine'
import {
  APPELLATION_PROFILES,
  type AppellationProfile,
  type InvestmentPotential,
} from '@/domain/value-objects/appellations'
import { WineColor } from '@/domain/value-objects/WineColor'
import { INVESTMENT_RANK } from '@/domain/value-objects/wineGuidance'

// ─────────────────────────────────────────────────────────────────────────────
// Estimation LOCALE de la cote — sans aucun appel API.
//
// La cote par bouteille est dérivée des données de référence stockées :
//   1. Prix marché de l'appellation (APPELLATION_MARKET_PRICE) si disponible ;
//   2. sinon une fourchette dérivée du potentiel d'investissement + couleur ;
//   3. sinon le prix d'achat comme ancre (spiritueux, vins sans appellation).
// On applique ensuite une courbe de maturité (l'âge du millésime valorise les
// vins de garde, davantage pour les appellations à fort potentiel) puis une
// légère variation « marché » déterministe (réensemencée chaque jour) pour que
// deux synchronisations à des dates différentes ne soient pas figées.
// ─────────────────────────────────────────────────────────────────────────────

// Fourchettes de repli par potentiel d'investissement (€ / btl), millésime récent.
const INVESTMENT_RANGE: Record<InvestmentPotential, { min: number; max: number }> = {
  excellent: { min: 90, max: 300 },
  good: { min: 40, max: 100 },
  moderate: { min: 20, max: 45 },
  low: { min: 9, max: 20 },
}

// Fourchette générique par couleur quand aucune appellation n'est reconnue.
const COLOR_RANGE: Record<WineColor, { min: number; max: number }> = {
  [WineColor.Red]: { min: 10, max: 24 },
  [WineColor.White]: { min: 9, max: 22 },
  [WineColor.Rose]: { min: 8, max: 18 },
  [WineColor.Sparkling]: { min: 15, max: 40 },
  [WineColor.Sweet]: { min: 16, max: 40 },
  [WineColor.Orange]: { min: 12, max: 28 },
}

// Bonus de maturité maximal (au sommet de la fenêtre de garde) par potentiel.
const PEAK_BONUS: Record<InvestmentPotential, number> = {
  excellent: 0.9,
  good: 0.45,
  moderate: 0.18,
  low: 0.06,
}

function stripAccents(text: string): string {
  return text.normalize('NFD').replace(/[̀-ͯ]/g, '')
}

function findAppellation(name?: string): AppellationProfile | undefined {
  if (!name) return undefined
  const exact = APPELLATION_PROFILES.find((p) => p.name === name)
  if (exact) return exact
  const norm = stripAccents(name).toLowerCase().trim()
  return APPELLATION_PROFILES.find((p) => stripAccents(p.name).toLowerCase().trim() === norm)
}

// Hash de chaîne → [0, 1). Sert à produire une variation reproductible.
function seededUnit(seed: string): number {
  let h = 2166136261
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  // Normalise sur [0, 1)
  return ((h >>> 0) % 100000) / 100000
}

export interface PriceEstimate {
  price: number
  /** Libellé court de la base d'estimation (pour la source du PricePoint). */
  basis: string
}

/**
 * Estime la cote marché d'une bouteille à partir des données locales.
 * Fonction pure : `today` est injecté pour rester testable et déterministe.
 * Renvoie `null` quand aucune donnée ne permet une estimation crédible.
 */
export function estimateMarketPrice(bottle: Bottle, today: Date = new Date()): PriceEstimate | null {
  const wine = bottle.type === 'wine' ? (bottle as Wine) : null
  const profile = wine ? findAppellation(wine.appellation) : undefined

  // ── 1. Fourchette de base ────────────────────────────────────────────────
  let range: { min: number; max: number } | undefined
  let basis: string

  if (profile?.marketPriceEur) {
    range = profile.marketPriceEur
    basis = profile.name
  } else if (profile) {
    range = INVESTMENT_RANGE[profile.investmentPotential ?? 'low']
    basis = profile.name
  } else if (wine) {
    range = COLOR_RANGE[wine.color]
    basis = 'profil couleur'
  } else {
    // Spiritueux ou vin sans appellation : on s'appuie sur le prix d'achat.
    if (bottle.purchasePrice && bottle.purchasePrice > 0) {
      range = { min: bottle.purchasePrice, max: bottle.purchasePrice }
      basis = 'prix d\'achat'
    } else {
      return null
    }
  }

  let base = (range.min + range.max) / 2

  // ── 2. Courbe de maturité (vins avec millésime et fenêtre de garde) ────────
  const rank = (profile?.investmentPotential ?? 'low') as InvestmentPotential
  const peakBonus = PEAK_BONUS[rank]

  if (wine?.vintage) {
    const age = today.getFullYear() - wine.vintage
    if (age > 0) {
      if (profile && profile.maxYears > 0) {
        const max = profile.maxYears
        if (age <= max) {
          // Montée linéaire vers le sommet de garde.
          base *= 1 + peakBonus * (age / max)
        } else {
          // Au-delà de l'apogée : déclin lent, plancher à 60 % du sommet.
          const peak = 1 + peakBonus
          const decline = Math.max(0.6, 1 - 0.03 * (age - max))
          base *= peak * decline
        }
      } else {
        // Pas de fenêtre de garde connue : valorisation modérée par l'âge.
        const perYear = INVESTMENT_RANK[rank] > 0 ? 0.02 : 0.01
        const cap = INVESTMENT_RANK[rank] > 0 ? 0.3 : 0.1
        base *= 1 + Math.min(cap, perYear * age)
      }
    }
  }

  // ── 3. Variation « marché » déterministe (±4 %, réensemencée par jour) ─────
  const dayKey = today.toISOString().slice(0, 10)
  const jitter = (seededUnit(`${bottle.id}|${dayKey}`) - 0.5) * 0.08
  base *= 1 + jitter

  const price = Math.round(base * 100) / 100
  if (!isFinite(price) || price <= 0) return null

  return { price, basis }
}

export class LocalPriceEstimateService implements IWinePriceService {
  async fetchPrice(bottle: Bottle): Promise<PricePoint> {
    const estimate = estimateMarketPrice(bottle)

    if (!estimate) {
      throw new Error(
        `Estimation locale impossible pour « ${bottle.name} ». ` +
          `Renseignez l'appellation et le millésime (pour les vins) ou un prix d'achat, ` +
          `puis réessayez — ou saisissez la cote manuellement ci-dessous.`,
      )
    }

    return {
      date: new Date().toISOString().slice(0, 10),
      price: estimate.price,
      source: `Estimation locale · ${estimate.basis}`,
    }
  }
}
