import type { Bottle } from '../entities/Bottle'

export interface IBottleRepository {
  findAll(): Promise<Bottle[]>
  findById(id: string): Promise<Bottle | undefined>
  save(bottle: Bottle): Promise<void>
  update(bottle: Bottle): Promise<void>
  delete(id: string): Promise<void>
  /** Insère ou remplace un lot de bouteilles (restauration de sauvegarde). */
  bulkUpsert(bottles: Bottle[]): Promise<void>
  /** Vide entièrement la cave (restauration en mode remplacement). */
  clear(): Promise<void>
}
