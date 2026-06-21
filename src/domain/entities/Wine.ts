import type { Bottle } from './Bottle'
import type { WineColor } from '../value-objects/WineColor'

export interface Wine extends Bottle {
  type: 'wine'
  color: WineColor
  vintage?: number
  appellation?: string
  grapes?: string[]
}
