import type { IBottleRepository } from '@/domain/repositories/IBottleRepository'
import type { Bottle } from '@/domain/entities/Bottle'

export class GetBottlesUseCase {
  constructor(private readonly repository: IBottleRepository) {}

  async execute(): Promise<Bottle[]> {
    return this.repository.findAll()
  }
}
