import type { Bottle } from './Bottle'
import type { SpiritCategory } from '../value-objects/SpiritCategory'

export interface Spirit extends Bottle {
  type: 'spirit'
  category: SpiritCategory
  age?: number
  abv?: number
  distillery?: string
}
