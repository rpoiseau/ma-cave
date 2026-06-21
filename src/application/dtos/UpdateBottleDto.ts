import type { CreateBottleDto } from './CreateBottleDto'

export interface UpdateBottleDto extends Partial<CreateBottleDto> {
  id: string
}
