import type { Bottle } from '@/domain/entities/Bottle'
import type { Wine } from '@/domain/entities/Wine'
import { WineColor } from '@/domain/value-objects/WineColor'
import { DrinkingMoment } from '@/domain/value-objects/DrinkingMoment'
import {
  deriveWineGuidance,
  INVESTMENT_RANK,
  type WineGuidance,
} from '@/domain/value-objects/wineGuidance'

export interface RecommendationCriteria {
  occasion: string
  colorPreference: WineColor | ''
  foodPairing: string
  count: number
}

export interface Recommendation {
  bottle: Bottle
  score: number
  reasons: string[]
  bestTastingScore?: number
  drinkabilityUrgent: boolean
}

// Correspondance occasion (UI) → moment de consommation dérivé.
const OCCASION_TO_MOMENT: Record<string, DrinkingMoment> = {
  apéritif: DrinkingMoment.Aperitif,
  dîner: DrinkingMoment.Plat,
  gastronomique: DrinkingMoment.Plat,
}

function guidanceFor(bottle: Bottle): WineGuidance | null {
  if (bottle.type !== 'wine') return null
  const w = bottle as Wine
  return deriveWineGuidance({ color: w.color, grapes: w.grapes, appellation: w.appellation })
}

function matchesText(haystack: string[], needle: string): boolean {
  const q = needle.toLowerCase()
  return haystack.some((v) => v.toLowerCase().includes(q) || q.includes(v.toLowerCase()))
}

export function recommendBottles(
  bottles: Bottle[],
  criteria: RecommendationCriteria,
): Recommendation[] {
  const today = new Date().toISOString().slice(0, 10)
  const currentYear = new Date().getFullYear()

  let candidates = bottles.filter((b) => b.quantity > 0)

  if (criteria.colorPreference) {
    candidates = candidates.filter(
      (b) => b.type === 'wine' && (b as Wine).color === criteria.colorPreference,
    )
  }

  const scored: Recommendation[] = candidates.map((bottle) => {
    let score = 0
    const reasons: string[] = []
    let drinkabilityUrgent = false

    const guidance = guidanceFor(bottle)

    if (bottle.drinkFrom && bottle.drinkUntil) {
      if (bottle.drinkFrom <= today && today <= bottle.drinkUntil) {
        score += 30
        reasons.push('Dans la fenêtre de dégustation')
        const endYear = parseInt(bottle.drinkUntil.slice(0, 4))
        if (endYear - currentYear <= 1) {
          score += 20
          drinkabilityUrgent = true
          reasons.push('À boire bientôt !')
        }
      } else if (bottle.drinkUntil < today) {
        score -= 10
      }
    } else {
      score += 5
    }

    const notes = bottle.tastingNotes ?? []
    const rawScores = notes.map((n) => n.score ?? 0).filter((s) => s > 0)
    let bestTastingScore: number | undefined
    if (rawScores.length > 0) {
      bestTastingScore = Math.max(...rawScores)
      score += Math.round((bestTastingScore - 70) / 2)
      reasons.push(`Noté ${bestTastingScore}/100`)
    }

    // ─── Accord mets : notes de dégustation, puis guidance dérivée ──────────────
    if (criteria.foodPairing) {
      const food = criteria.foodPairing.toLowerCase()
      const hasAccordMatch = notes.some((n) => n.accord?.toLowerCase().includes(food))
      const hasNoteAromeMatch = notes.some((n) =>
        n.aromes.some((a) => a.toLowerCase().includes(food)),
      )
      const hasGuidancePairing = guidance ? matchesText(guidance.foodPairings, food) : false
      const hasGuidanceArome = guidance ? matchesText(guidance.aromas, food) : false

      if (hasAccordMatch) {
        score += 25
        reasons.push('Accord mets-vins confirmé')
      } else if (hasGuidancePairing) {
        score += 20
        reasons.push('Accord mets recommandé')
      } else if (hasNoteAromeMatch || hasGuidanceArome) {
        score += 10
        reasons.push('Arômes compatibles')
      }
    }

    // ─── Occasion → moment de consommation + notes de dégustation ──────────────
    if (criteria.occasion) {
      const occ = criteria.occasion.toLowerCase()
      const hasNoteOccasionMatch = notes.some((n) => n.occasion?.toLowerCase().includes(occ))
      const targetMoment = OCCASION_TO_MOMENT[criteria.occasion]
      const momentMatch =
        guidance && targetMoment ? guidance.drinkingMoments.includes(targetMoment) : false

      if (hasNoteOccasionMatch) {
        score += 15
        reasons.push("Correspond à l'occasion")
      } else if (momentMatch) {
        score += 15
        reasons.push(`Idéal pour ${criteria.occasion}`)
      }

      // Heuristiques spécifiques
      if (criteria.occasion === 'fête' && bottle.type === 'wine') {
        if ((bottle as Wine).color === WineColor.Sparkling) {
          score += 18
          reasons.push('Bulles festives')
        }
      }
      if (criteria.occasion === 'cadeau' && guidance) {
        const rank = INVESTMENT_RANK[guidance.investmentPotential]
        if (rank >= 2) {
          score += 18
          reasons.push('Belle bouteille à offrir')
        } else if (rank >= 1) {
          score += 8
        }
      }
    }

    if (reasons.length === 0) reasons.push('Disponible dans votre cave')

    // Small random variance so repeated calls show variety
    score += Math.random() * 4

    return { bottle, score, reasons, bestTastingScore, drinkabilityUrgent }
  })

  return scored
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, criteria.count)
}
