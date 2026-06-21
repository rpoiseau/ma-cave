import type { Bottle } from '../entities/Bottle'
import type { PricePoint } from '../entities/Bottle'

export interface IWinePriceService {
  fetchPrice(bottle: Bottle): Promise<PricePoint>
}
