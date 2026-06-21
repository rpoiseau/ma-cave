import Dexie, { type Table } from 'dexie'
import type { Bottle } from '@/domain/entities/Bottle'

class CaveDatabase extends Dexie {
  bottles!: Table<Bottle, string>

  constructor() {
    super('MaCaveDB')
    this.version(1).stores({
      bottles: 'id, type, name, country, purchaseDate, drinkFrom, drinkUntil, createdAt',
    })
  }
}

export const db = new CaveDatabase()
