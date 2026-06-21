import type { BottleType, PricePoint, TastingNote } from '@/domain/entities/Bottle'
import type { WineColor } from '@/domain/value-objects/WineColor'
import type { SpiritCategory } from '@/domain/value-objects/SpiritCategory'

export interface CreateBottleDto {
  type: BottleType
  name: string
  producer: string
  country: string
  region?: string
  quantity: number
  purchaseDate: string
  purchasePrice?: number
  drinkFrom?: string
  drinkUntil?: string
  notes?: string
  rating?: number
  priceHistory?: PricePoint[]
  tastingNotes?: TastingNote[]
  // Wine-specific
  color?: WineColor
  vintage?: number
  appellation?: string
  grapes?: string[]
  // Spirit-specific
  category?: SpiritCategory
  age?: number
  abv?: number
  distillery?: string
}
