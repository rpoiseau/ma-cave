import type { Bottle } from '@/domain/entities/Bottle'
import type { PricePoint } from '@/domain/entities/Bottle'
import type { IWinePriceService } from '@/domain/repositories/IWinePriceService'
import type { Wine } from '@/domain/entities/Wine'

export const WINEAPIO_LS_KEY = 'wineapio_api_key'
export const DEFAULT_API_KEY = 'wapi_d1943aa20f90af707ef6d604709f5f7b673659e30412fa19b29df1a8767d9a19'
const BASE_URL = 'https://api.wineapi.io'

// Pre-initialize the key in localStorage on first load
if (!localStorage.getItem(WINEAPIO_LS_KEY)) {
  localStorage.setItem(WINEAPIO_LS_KEY, DEFAULT_API_KEY)
}

function stripAccents(text: string): string {
  return text.normalize('NFD').replace(/[̀-ͯ]/g, '')
}

interface SearchResult {
  id: string
  name: string
  vintage?: number | null
  confidence: number
}

interface PriceEntry {
  price: number | string
  currency: string
}

interface WineDetail {
  name?: string
  priceRange: { min: number; max: number; currency: string } | null
  prices: PriceEntry[]
}

export class WineApioPriceService implements IWinePriceService {
  async fetchPrice(bottle: Bottle): Promise<PricePoint> {
    const apiKey = localStorage.getItem(WINEAPIO_LS_KEY) || DEFAULT_API_KEY

    const wine = bottle.type === 'wine' ? (bottle as Wine) : null
    const queryParts = [stripAccents(bottle.name)]
    if (wine?.vintage) queryParts.push(String(wine.vintage))
    const query = queryParts.join(' ')

    // Step 1 — search by name (+vintage)
    const searchRes = await fetch(
      `${BASE_URL}/wines/search?q=${encodeURIComponent(query)}&limit=5`,
      { headers: { 'X-API-Key': apiKey } },
    )
    this.assertOk(searchRes, 'recherche')

    const searchData = await searchRes.json()
    const results: SearchResult[] = searchData?.results ?? []

    if (results.length === 0) {
      throw new Error(
        `« ${bottle.name} » introuvable sur WineAPI.io. ` +
          `Vérifiez le nom de la bouteille ou ajoutez la cote manuellement.`,
      )
    }

    // Pick result with highest confidence
    const best = results.reduce((a, b) => (a.confidence >= b.confidence ? a : b))

    // Step 2 — fetch detail for price data
    const detailRes = await fetch(`${BASE_URL}/wines/${best.id}`, {
      headers: { 'X-API-Key': apiKey },
    })
    this.assertOk(detailRes, 'récupération des prix')

    const detail: WineDetail = await detailRes.json()
    const extracted = this.extractPrice(detail)

    if (!extracted) {
      throw new Error(
        `Pas de prix disponible pour « ${best.name} » sur WineAPI.io pour l'instant. ` +
          `La base de données enrichit ce vin de façon asynchrone — réessayez dans quelques instants, ` +
          `ou ajoutez la cote manuellement via le formulaire ci-dessous.`,
      )
    }

    return {
      date: new Date().toISOString().slice(0, 10),
      price: Math.round(extracted.price * 100) / 100,
      source: `WineAPI.io (${extracted.currency})`,
    }
  }

  private extractPrice(detail: WineDetail): { price: number; currency: string } | null {
    // Prefer priceRange midpoint
    if (detail.priceRange?.min != null && detail.priceRange?.max != null) {
      return {
        price: (detail.priceRange.min + detail.priceRange.max) / 2,
        currency: detail.priceRange.currency ?? 'USD',
      }
    }

    if (!detail.prices?.length) return null

    // Average EUR prices, fall back to all prices
    const eurPrices = detail.prices
      .filter((p) => p.currency === 'EUR')
      .map((p) => ({ price: parseFloat(String(p.price)), currency: 'EUR' }))
      .filter((p) => !isNaN(p.price))

    if (eurPrices.length) {
      const avg = eurPrices.reduce((a, b) => a + b.price, 0) / eurPrices.length
      return { price: avg, currency: 'EUR' }
    }

    const allPrices = detail.prices
      .map((p) => ({ price: parseFloat(String(p.price)), currency: p.currency }))
      .filter((p) => !isNaN(p.price))

    if (!allPrices.length) return null
    const avg = allPrices.reduce((a, b) => a + b.price, 0) / allPrices.length
    return { price: avg, currency: allPrices[0].currency }
  }

  private assertOk(res: Response, context: string): void {
    if (res.status === 401 || res.status === 403) {
      throw new Error(
        `Clé API WineAPI.io invalide ou expirée. Mettez-la à jour dans les Paramètres.`,
      )
    }
    if (res.status === 429) {
      throw new Error(`Limite de requêtes WineAPI.io atteinte — réessayez dans quelques instants.`)
    }
    if (!res.ok) {
      throw new Error(`Erreur WineAPI.io lors de la ${context} (HTTP ${res.status}).`)
    }
  }
}
