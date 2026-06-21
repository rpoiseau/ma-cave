import type { IBottleRepository } from '@/domain/repositories/IBottleRepository'
import type { IWinePriceService } from '@/domain/repositories/IWinePriceService'
import type { Bottle } from '@/domain/entities/Bottle'

export class SyncBottlePriceUseCase {
  constructor(
    private readonly repo: IBottleRepository,
    private readonly priceService: IWinePriceService,
  ) {}

  async execute(bottleId: string): Promise<Bottle> {
    const bottle = await this.repo.findById(bottleId)
    if (!bottle) throw new Error(`Bouteille introuvable : ${bottleId}`)

    const point = await this.priceService.fetchPrice(bottle)

    const updated: Bottle = {
      ...bottle,
      priceHistory: [...(bottle.priceHistory ?? []), point],
      updatedAt: new Date().toISOString(),
    }

    await this.repo.update(updated)
    return updated
  }
}
