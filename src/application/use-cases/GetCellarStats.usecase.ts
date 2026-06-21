import type { IBottleRepository } from '@/domain/repositories/IBottleRepository'
import type { Bottle } from '@/domain/entities/Bottle'

export interface CellarStats {
  totalBottles: number
  totalUnits: number
  wineCount: number
  spiritCount: number
  readyToDrink: Bottle[]
  pastPeak: Bottle[]
  recentAdditions: Bottle[]
  totalValue: number
}

export class GetCellarStatsUseCase {
  constructor(private readonly repository: IBottleRepository) {}

  async execute(): Promise<CellarStats> {
    const bottles = await this.repository.findAll()
    const today = new Date().toISOString().split('T')[0]

    const readyToDrink = bottles.filter(
      (b) => b.drinkFrom && b.drinkUntil && b.drinkFrom <= today && today <= b.drinkUntil,
    )

    const pastPeak = bottles.filter((b) => b.drinkUntil && b.drinkUntil < today)

    const recentAdditions = [...bottles]
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
      .slice(0, 5)

    const totalValue = bottles.reduce(
      (sum, b) => sum + (b.purchasePrice ?? 0) * b.quantity,
      0,
    )

    return {
      totalBottles: bottles.length,
      totalUnits: bottles.reduce((sum, b) => sum + b.quantity, 0),
      wineCount: bottles.filter((b) => b.type === 'wine').length,
      spiritCount: bottles.filter((b) => b.type === 'spirit').length,
      readyToDrink,
      pastPeak,
      recentAdditions,
      totalValue,
    }
  }
}
