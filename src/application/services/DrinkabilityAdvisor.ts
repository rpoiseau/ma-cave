import type { Bottle } from '@/domain/entities/Bottle'
import type { Wine } from '@/domain/entities/Wine'
import { APPELLATION_PROFILES, type AppellationProfile } from '@/domain/value-objects/appellations'
import { WineColor, WINE_COLOR_LABELS } from '@/domain/value-objects/WineColor'

export type DrinkabilityStatus = 'closing-soon' | 'ready' | 'too-young' | 'past-peak' | 'unknown'

export interface BottleAdvice {
  bottle: Bottle
  status: DrinkabilityStatus
  yearsLeft?: number
  yearsUntilReady?: number
  windowFrom?: number
  windowUntil?: number
}

export interface PurchaseSuggestion {
  appellation: AppellationProfile
  targetVintage: number
  readyFrom: number
  readyUntil: number
  gapYearsCovered: number[]
  priority: 'high' | 'medium' | 'low'
  rationale: string
}

interface CoverageBucket {
  year: number
  units: number
}

const CLOSING_SOON_YEARS = 2

const STATUS_ORDER: Record<DrinkabilityStatus, number> = {
  'closing-soon': 0,
  ready: 1,
  'too-young': 2,
  'past-peak': 3,
  unknown: 4,
}

export function analyzeBottles(bottles: Bottle[]): BottleAdvice[] {
  const today = new Date().toISOString().slice(0, 10)
  const currentYear = new Date().getFullYear()

  return bottles
    .filter((b) => b.quantity > 0)
    .map((bottle): BottleAdvice => {
      if (!bottle.drinkFrom || !bottle.drinkUntil) {
        return { bottle, status: 'unknown' }
      }

      const windowFrom = parseInt(bottle.drinkFrom.slice(0, 4))
      const windowUntil = parseInt(bottle.drinkUntil.slice(0, 4))

      if (today > bottle.drinkUntil) {
        return { bottle, status: 'past-peak', windowFrom, windowUntil }
      }

      if (today < bottle.drinkFrom) {
        return {
          bottle,
          status: 'too-young',
          yearsUntilReady: windowFrom - currentYear,
          windowFrom,
          windowUntil,
        }
      }

      const yearsLeft = windowUntil - currentYear
      return {
        bottle,
        status: yearsLeft <= CLOSING_SOON_YEARS ? 'closing-soon' : 'ready',
        yearsLeft,
        windowFrom,
        windowUntil,
      }
    })
    .sort((a, b) => STATUS_ORDER[a.status] - STATUS_ORDER[b.status])
}

export function suggestPurchases(
  curve: CoverageBucket[],
  bottles: Bottle[],
  coverageThreshold = 2,
): { gapYears: number[]; suggestions: PurchaseSuggestion[] } {
  const currentYear = new Date().getFullYear()
  const purchaseVintage = currentYear - 1

  const gapYears = curve.filter((b) => b.units < coverageThreshold).map((b) => b.year)

  if (gapYears.length === 0) return { gapYears: [], suggestions: [] }

  const wines = bottles.filter((b) => b.type === 'wine') as Wine[]
  const colorCounts: Partial<Record<WineColor, number>> = {}
  for (const w of wines) {
    colorCounts[w.color] = (colorCounts[w.color] ?? 0) + w.quantity
  }
  const totalWines = Math.max(
    wines.reduce((s, w) => s + w.quantity, 0),
    1,
  )
  const underrepresented = new Set<WineColor>(
    (Object.values(WineColor) as WineColor[]).filter(
      (c) => (colorCounts[c] ?? 0) / totalWines < 0.1,
    ),
  )

  const results: PurchaseSuggestion[] = []

  for (const ap of APPELLATION_PROFILES) {
    const readyFrom = purchaseVintage + ap.minYears
    const readyUntil = purchaseVintage + ap.maxYears
    const covered = gapYears.filter((y) => y >= readyFrom && y <= readyUntil)
    if (covered.length === 0) continue

    const nearGaps = covered.filter((y) => y <= currentYear + 5)
    const isUnderrepresented = underrepresented.has(ap.color)

    let priority: 'high' | 'medium' | 'low'
    if (nearGaps.length > 0) priority = 'high'
    else if (covered.length >= 2 || isUnderrepresented) priority = 'medium'
    else priority = 'low'

    const parts: string[] = []
    if (nearGaps.length > 0) {
      parts.push(`Comble un manque dès ${Math.min(...nearGaps)}`)
    } else {
      parts.push(`Couvre ${covered.length} année${covered.length > 1 ? 's' : ''} sans bouteille`)
    }
    if (isUnderrepresented) parts.push(`diversifie en ${WINE_COLOR_LABELS[ap.color]}`)

    results.push({
      appellation: ap,
      targetVintage: purchaseVintage,
      readyFrom,
      readyUntil,
      gapYearsCovered: covered,
      priority,
      rationale: parts.join(' · '),
    })
  }

  return {
    gapYears,
    suggestions: results
      .sort((a, b) => {
        const p = { high: 0, medium: 1, low: 2 }
        if (p[a.priority] !== p[b.priority]) return p[a.priority] - p[b.priority]
        return b.gapYearsCovered.length - a.gapYearsCovered.length
      })
      .slice(0, 8),
  }
}
