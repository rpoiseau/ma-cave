import { v4 as uuidv4 } from 'uuid'
import type { IBottleRepository } from '@/domain/repositories/IBottleRepository'
import type { CreateBottleDto } from '../dtos/CreateBottleDto'
import type { Bottle } from '@/domain/entities/Bottle'

export class AddBottleUseCase {
  constructor(private readonly repository: IBottleRepository) {}

  async execute(dto: CreateBottleDto): Promise<Bottle> {
    const now = new Date().toISOString()
    const bottle: Bottle = {
      ...dto,
      id: uuidv4(),
      createdAt: now,
      updatedAt: now,
    } as Bottle

    await this.repository.save(bottle)
    return bottle
  }
}
