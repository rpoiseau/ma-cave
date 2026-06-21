import type { Bottle } from '@/domain/entities/Bottle'
import type { PricePoint } from '@/domain/entities/Bottle'
import type { IWinePriceService } from '@/domain/repositories/IWinePriceService'
import type { Wine } from '@/domain/entities/Wine'

const LS_KEY = 'winesearcher_api_key'

const COUNTRY_CODES: Record<string, string> = {
  france: 'fr',
  italie: 'it',
  espagne: 'es',
  portugal: 'pt',
  allemagne: 'de',
  'états-unis': 'us',
  usa: 'us',
  australie: 'au',
  'afrique du sud': 'za',
  argentine: 'ar',
  chili: 'cl',
  autriche: 'at',
  'nouvelle-zélande': 'nz',
  grèce: 'gr',
  hongrie: 'hu',
}

export class WineSearcherPriceService implements IWinePriceService {
  async fetchPrice(bottle: Bottle): Promise<PricePoint> {
    const apiKey = localStorage.getItem(LS_KEY)
    if (!apiKey) {
      throw new Error('Clé API Wine-Searcher manquante — configurez-la dans les Paramètres.')
    }

    const wine = bottle.type === 'wine' ? (bottle as Wine) : null
    const location = COUNTRY_CODES[bottle.country.toLowerCase()] ?? 'fr'

    const params = new URLSearchParams({
      name: bottle.name,
      api_code: apiKey,
      location,
      currency: 'EUR',
    })
    if (wine?.vintage) {
      params.set('vintage', String(wine.vintage))
    }

    const res = await fetch(`/api/wine-searcher/api/v2/search?${params}`)

    if (res.status === 401 || res.status === 403) {
      throw new Error('Clé API Wine-Searcher invalide ou expirée.')
    }
    if (!res.ok) {
      const text = await res.text()
      throw new Error(`Erreur Wine-Searcher (${res.status}) : ${text.slice(0, 200)}`)
    }

    const data = await res.json()
    const avg = data?.search?.average_price
    if (!avg || isNaN(parseFloat(String(avg)))) {
      throw new Error('Aucune cote trouvée pour cette bouteille sur Wine-Searcher.')
    }

    return {
      date: new Date().toISOString().slice(0, 10),
      price: Math.round(parseFloat(String(avg)) * 100) / 100,
      source: 'Wine-Searcher',
    }
  }
}
