import type { Bottle } from '@/domain/entities/Bottle'
import type { Wine } from '@/domain/entities/Wine'
import {
  deriveWineGuidance,
  INVESTMENT_RANK,
} from '@/domain/value-objects/wineGuidance'
import type { InvestmentPotential } from '@/domain/value-objects/appellations'

export interface ResaleOpportunity {
  bottle: Bottle
  investmentPotential: InvestmentPotential
  currentPrice?: number // dernière cote par bouteille (€)
  purchasePrice?: number
  gainPct?: number // variation vs prix d'achat
  totalGain?: number // gain total sur le lot (gain unitaire × quantité)
  pastPeak: boolean
  reasons: string[]
  score: number // tri décroissant : plus c'est haut, plus c'est intéressant à revendre
}

function latestQuote(bottle: Bottle): number | undefined {
  const history = bottle.priceHistory
  if (!history?.length) return undefined
  return [...history].sort((a, b) => a.date.localeCompare(b.date)).at(-1)!.price
}

function investmentOf(bottle: Bottle): InvestmentPotential {
  if (bottle.type !== 'wine') return 'low'
  const w = bottle as Wine
  return deriveWineGuidance({ color: w.color, grapes: w.grapes, appellation: w.appellation })
    .investmentPotential
}

/**
 * Repère les bouteilles intéressantes à revendre : forte plus-value sur la cote,
 * apogée dépassée alors que le vin a encore une valeur, ou fort potentiel
 * d'investissement avec une plus-value confirmée.
 *
 * Pur, sans effet de bord. Ne lit que `priceHistory` (jamais `purchasePrice`).
 */
export function analyzeResale(bottles: Bottle[]): ResaleOpportunity[] {
  const today = new Date().toISOString().slice(0, 10)

  const results: ResaleOpportunity[] = bottles
    .filter((b) => b.quantity > 0)
    .map((bottle) => {
      const investmentPotential = investmentOf(bottle)
      const currentPrice = latestQuote(bottle)
      const purchasePrice = bottle.purchasePrice
      const pastPeak = !!bottle.drinkUntil && bottle.drinkUntil < today

      let gainPct: number | undefined
      let totalGain: number | undefined
      if (currentPrice != null && purchasePrice != null && purchasePrice > 0) {
        gainPct = (currentPrice / purchasePrice - 1) * 100
        totalGain = (currentPrice - purchasePrice) * bottle.quantity
      }

      const reasons: string[] = []
      let score = 0

      if (gainPct != null && gainPct >= 15) {
        reasons.push(`Plus-value de ${gainPct >= 0 ? '+' : ''}${gainPct.toFixed(0)} %`)
        score += Math.min(gainPct, 200)
      }
      if (pastPeak && (currentPrice ?? 0) > 0) {
        reasons.push('Apogée dépassée — revendre avant déclin')
        score += 40
      }
      if (INVESTMENT_RANK[investmentPotential] >= 2 && (gainPct ?? 0) > 0) {
        reasons.push('Vin recherché sur le marché secondaire')
        score += 20
      }
      // Petit bonus si lot important (plus de valeur à dégager).
      if (totalGain != null && totalGain > 0) {
        score += Math.min(totalGain / 10, 30)
      }

      return {
        bottle,
        investmentPotential,
        currentPrice,
        purchasePrice,
        gainPct,
        totalGain,
        pastPeak,
        reasons,
        score,
      }
    })

  return results
    .filter((r) => r.reasons.length > 0)
    .sort((a, b) => b.score - a.score)
}

/** Valeur totale de la cave à la cote actuelle (dernière cote × quantité). */
export function totalMarketValue(bottles: Bottle[]): number {
  return bottles.reduce((sum, b) => {
    const q = latestQuote(b)
    return sum + (q ?? b.purchasePrice ?? 0) * b.quantity
  }, 0)
}
