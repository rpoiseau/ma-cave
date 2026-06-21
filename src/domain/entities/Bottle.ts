export type BottleType = 'wine' | 'spirit'

export interface PricePoint {
  date: string     // ISO YYYY-MM-DD
  price: number    // cote marché par bouteille (€)
  source?: string  // "Wine-Searcher", "iDealwine", etc.
}

export interface TastingNote {
  id: string
  date: string         // ISO YYYY-MM-DD
  score?: number       // 0-100 (style Parker)
  robe?: string        // couleur, limpidité, intensité
  aromes: string[]     // arômes identifiés
  bouche?: string      // attaque, milieu, tanins, acidité
  finale?: string      // longueur, persistance aromatique
  accord?: string      // accord mets-vins suggéré
  occasion?: string    // contexte de la dégustation
  commentaire?: string // note libre
  createdAt: string
}

export interface Bottle {
  id: string
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
  createdAt: string
  updatedAt: string
}
