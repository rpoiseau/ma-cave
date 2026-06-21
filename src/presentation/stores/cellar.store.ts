import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Bottle, PricePoint, TastingNote } from '@/domain/entities/Bottle'

export interface MaturityBucket {
  year: number
  units: number
  isCurrentYear: boolean
}
import { IndexedDBBottleRepository } from '@/infrastructure/persistence/IndexedDBBottleRepository'
import { AddBottleUseCase } from '@/application/use-cases/AddBottle.usecase'
import { UpdateBottleUseCase } from '@/application/use-cases/UpdateBottle.usecase'
import { DeleteBottleUseCase } from '@/application/use-cases/DeleteBottle.usecase'
import { GetBottlesUseCase } from '@/application/use-cases/GetBottles.usecase'
import { GetCellarStatsUseCase } from '@/application/use-cases/GetCellarStats.usecase'
import { SyncBottlePriceUseCase } from '@/application/use-cases/SyncBottlePrice.usecase'
import { LocalPriceEstimateService } from '@/infrastructure/pricing/LocalPriceEstimateService'
import type { CreateBottleDto } from '@/application/dtos/CreateBottleDto'
import type { UpdateBottleDto } from '@/application/dtos/UpdateBottleDto'

const repository = new IndexedDBBottleRepository()
const addBottle = new AddBottleUseCase(repository)
const updateBottle = new UpdateBottleUseCase(repository)
const deleteBottle = new DeleteBottleUseCase(repository)
const getBottles = new GetBottlesUseCase(repository)
const getCellarStats = new GetCellarStatsUseCase(repository)
const priceService = new LocalPriceEstimateService()
const syncBottlePrice = new SyncBottlePriceUseCase(repository, priceService)

export const useCellarStore = defineStore('cellar', () => {
  const bottles = ref<Bottle[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const stats = computed(() => {
    const today = new Date().toISOString().split('T')[0]
    const totalUnits = bottles.value.reduce((sum, b) => sum + b.quantity, 0)
    const wineCount = bottles.value.filter((b) => b.type === 'wine').length
    const spiritCount = bottles.value.filter((b) => b.type === 'spirit').length
    const readyToDrink = bottles.value.filter(
      (b) => b.drinkFrom && b.drinkUntil && b.drinkFrom <= today && today <= b.drinkUntil,
    )
    const pastPeak = bottles.value.filter((b) => b.drinkUntil && b.drinkUntil < today)
    const recentAdditions = [...bottles.value]
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
      .slice(0, 5)
    const totalValue = bottles.value.reduce(
      (sum, b) => sum + (b.purchasePrice ?? 0) * b.quantity,
      0,
    )

    return {
      totalBottles: bottles.value.length,
      totalUnits,
      wineCount,
      spiritCount,
      readyToDrink,
      pastPeak,
      recentAdditions,
      totalValue,
    }
  })

  const maturityCurve = computed((): MaturityBucket[] => {
    const currentYear = new Date().getFullYear()
    const withWindows = bottles.value.filter((b) => b.drinkFrom && b.drinkUntil)
    if (withWindows.length === 0) return []
    const maxYear = Math.min(
      currentYear + 30,
      Math.max(...withWindows.map((b) => parseInt(b.drinkUntil!.slice(0, 4)))),
    )
    return Array.from({ length: maxYear - currentYear + 1 }, (_, i) => {
      const year = currentYear + i
      const y = String(year)
      const inWindow = withWindows.filter(
        (b) => b.drinkFrom!.slice(0, 4) <= y && y <= b.drinkUntil!.slice(0, 4),
      )
      return { year, units: inWindow.reduce((s, b) => s + b.quantity, 0), isCurrentYear: year === currentYear }
    })
  })

  async function loadAll() {
    loading.value = true
    error.value = null
    try {
      bottles.value = await getBottles.execute()
    } catch (e) {
      error.value = (e as Error).message
    } finally {
      loading.value = false
    }
  }

  async function add(dto: CreateBottleDto) {
    const bottle = await addBottle.execute(dto)
    bottles.value.push(bottle)
    return bottle
  }

  async function update(dto: UpdateBottleDto) {
    const updated = await updateBottle.execute(dto)
    const idx = bottles.value.findIndex((b) => b.id === updated.id)
    if (idx !== -1) bottles.value[idx] = updated
    return updated
  }

  async function remove(id: string) {
    await deleteBottle.execute(id)
    bottles.value = bottles.value.filter((b) => b.id !== id)
  }

  async function refreshStats() {
    return getCellarStats.execute()
  }

  function getById(id: string): Bottle | undefined {
    return bottles.value.find((b) => b.id === id)
  }

  async function addPricePoint(bottleId: string, point: PricePoint) {
    const bottle = bottles.value.find((b) => b.id === bottleId)
    if (!bottle) throw new Error('Bouteille introuvable')
    const updated = await updateBottle.execute({
      id: bottleId,
      priceHistory: [...(bottle.priceHistory ?? []), point],
    })
    const idx = bottles.value.findIndex((b) => b.id === bottleId)
    if (idx !== -1) bottles.value[idx] = updated
  }

  // Computed: all tasting notes sorted by date desc, with their bottle
  const recentTastings = computed(() => {
    const entries: Array<{ bottle: Bottle; note: TastingNote }> = []
    for (const bottle of bottles.value) {
      for (const note of bottle.tastingNotes ?? []) {
        entries.push({ bottle, note })
      }
    }
    return entries.sort((a, b) => b.note.date.localeCompare(a.note.date))
  })

  async function addTastingNote(bottleId: string, note: TastingNote) {
    const bottle = bottles.value.find((b) => b.id === bottleId)
    if (!bottle) throw new Error('Bouteille introuvable')
    const updated = await updateBottle.execute({
      id: bottleId,
      tastingNotes: [...(bottle.tastingNotes ?? []), note],
    })
    const idx = bottles.value.findIndex((b) => b.id === bottleId)
    if (idx !== -1) bottles.value[idx] = updated
  }

  async function deleteTastingNote(bottleId: string, noteId: string) {
    const bottle = bottles.value.find((b) => b.id === bottleId)
    if (!bottle) throw new Error('Bouteille introuvable')
    const updated = await updateBottle.execute({
      id: bottleId,
      tastingNotes: (bottle.tastingNotes ?? []).filter((n) => n.id !== noteId),
    })
    const idx = bottles.value.findIndex((b) => b.id === bottleId)
    if (idx !== -1) bottles.value[idx] = updated
  }

  async function syncPrice(bottleId: string) {
    const updated = await syncBottlePrice.execute(bottleId)
    const idx = bottles.value.findIndex((b) => b.id === bottleId)
    if (idx !== -1) bottles.value[idx] = updated
    return updated
  }

  /** Marque une unité comme bue : décrémente la quantité (min 0). */
  async function consumeOne(bottleId: string) {
    const bottle = bottles.value.find((b) => b.id === bottleId)
    if (!bottle) throw new Error('Bouteille introuvable')
    if (bottle.quantity <= 0) return bottle
    const updated = await updateBottle.execute({
      id: bottleId,
      quantity: bottle.quantity - 1,
    })
    const idx = bottles.value.findIndex((b) => b.id === bottleId)
    if (idx !== -1) bottles.value[idx] = updated
    return updated
  }

  /** Restaure une sauvegarde. `replace` vide la cave avant d'importer. */
  async function importBottles(imported: Bottle[], mode: 'replace' | 'merge') {
    if (mode === 'replace') await repository.clear()
    await repository.bulkUpsert(imported)
    await loadAll()
  }

  async function removePricePoint(bottleId: string, pointIndex: number) {
    const bottle = bottles.value.find((b) => b.id === bottleId)
    if (!bottle) throw new Error('Bouteille introuvable')
    const newHistory = [...(bottle.priceHistory ?? [])]
    newHistory.splice(pointIndex, 1)
    const updated = await updateBottle.execute({ id: bottleId, priceHistory: newHistory })
    const idx = bottles.value.findIndex((b) => b.id === bottleId)
    if (idx !== -1) bottles.value[idx] = updated
  }

  return { bottles, loading, error, stats, maturityCurve, recentTastings, loadAll, add, update, remove, refreshStats, getById, addPricePoint, removePricePoint, syncPrice, addTastingNote, deleteTastingNote, consumeOne, importBottles }
})
