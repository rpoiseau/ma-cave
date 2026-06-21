import type { IBottleRepository } from '@/domain/repositories/IBottleRepository'
import type { UpdateBottleDto } from '../dtos/UpdateBottleDto'
import type { Bottle } from '@/domain/entities/Bottle'

export class UpdateBottleUseCase {
  constructor(private readonly repository: IBottleRepository) {}

  async execute(dto: UpdateBottleDto): Promise<Bottle> {
    const existing = await this.repository.findById(dto.id)
    if (!existing) throw new Error(`Bouteille introuvable : ${dto.id}`)

    const updated: Bottle = {
      ...existing,
      ...dto,
      updatedAt: new Date().toISOString(),
    } as Bottle

    await this.repository.update(updated)
    return updated
  }
}
