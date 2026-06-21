import type { IBottleRepository } from '@/domain/repositories/IBottleRepository'

export class DeleteBottleUseCase {
  constructor(private readonly repository: IBottleRepository) {}

  async execute(id: string): Promise<void> {
    await this.repository.delete(id)
  }
}
