import type { IBottleRepository } from '@/domain/repositories/IBottleRepository'
import type { Bottle } from '@/domain/entities/Bottle'
import { db } from './db'

export class IndexedDBBottleRepository implements IBottleRepository {
  async findAll(): Promise<Bottle[]> {
    return db.bottles.toArray()
  }

  async findById(id: string): Promise<Bottle | undefined> {
    return db.bottles.get(id)
  }

  async save(bottle: Bottle): Promise<void> {
    await db.bottles.add(JSON.parse(JSON.stringify(bottle)))
  }

  async update(bottle: Bottle): Promise<void> {
    await db.bottles.put(JSON.parse(JSON.stringify(bottle)))
  }

  async delete(id: string): Promise<void> {
    await db.bottles.delete(id)
  }

  async bulkUpsert(bottles: Bottle[]): Promise<void> {
    await db.bottles.bulkPut(JSON.parse(JSON.stringify(bottles)))
  }

  async clear(): Promise<void> {
    await db.bottles.clear()
  }
}
