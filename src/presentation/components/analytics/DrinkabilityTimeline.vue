<template>
  <div>
    <v-tabs v-model="tab" color="primary" class="mb-1">
      <v-tab value="upcoming">
        À venir
        <v-chip class="ml-2" size="x-small" color="info" variant="tonal">{{ upcoming.length }}</v-chip>
      </v-tab>
      <v-tab value="ready">
        Prêts maintenant
        <v-chip class="ml-2" size="x-small" color="success" variant="tonal">{{ readyNow.length }}</v-chip>
      </v-tab>
      <v-tab value="past">
        Dépassés
        <v-chip class="ml-2" size="x-small" color="error" variant="tonal">{{ pastPeak.length }}</v-chip>
      </v-tab>
    </v-tabs>

    <v-window v-model="tab">
      <!-- À VENIR -->
      <v-window-item value="upcoming">
        <div v-if="upcoming.length === 0" class="d-flex flex-column align-center justify-center py-12 text-medium-emphasis">
          <v-icon size="48" opacity="0.2" class="mb-3">mdi-clock-outline</v-icon>
          <span>Aucune bouteille à venir.</span>
        </div>
        <template v-else>
          <template v-for="group in upcomingByYear" :key="group.year">
            <div class="text-overline font-weight-bold text-primary px-1 pt-5 pb-1 d-flex align-center gap-2">
              {{ group.year }}
              <v-chip size="x-small" variant="tonal" color="primary">{{ group.totalUnits }} btl</v-chip>
            </div>
            <BottleRow
              v-for="bottle in group.bottles"
              :key="bottle.id"
              :bottle="bottle"
              :scale-start="scaleStart"
              :scale-end="scaleEndValue"
            />
          </template>
        </template>
      </v-window-item>

      <!-- PRÊTS MAINTENANT -->
      <v-window-item value="ready">
        <div v-if="readyNow.length === 0" class="d-flex flex-column align-center justify-center py-12 text-medium-emphasis">
          <v-icon size="48" opacity="0.2" class="mb-3">mdi-check-circle-outline</v-icon>
          <span>Aucune bouteille dans sa fenêtre de dégustation.</span>
        </div>
        <BottleRow
          v-else
          v-for="bottle in readyNow"
          :key="bottle.id"
          :bottle="bottle"
          :scale-start="scaleStart"
          :scale-end="scaleEndValue"
        />
      </v-window-item>

      <!-- DÉPASSÉS -->
      <v-window-item value="past">
        <div v-if="pastPeak.length === 0" class="d-flex flex-column align-center justify-center py-12 text-medium-emphasis">
          <v-icon size="48" opacity="0.2" class="mb-3">mdi-alert-circle-outline</v-icon>
          <span>Aucune bouteille dépassée.</span>
        </div>
        <BottleRow
          v-else
          v-for="bottle in pastPeak"
          :key="bottle.id"
          :bottle="bottle"
          :scale-start="scaleStart"
          :scale-end="scaleEndValue"
        />
      </v-window-item>
    </v-window>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Bottle } from '@/domain/entities/Bottle'
import BottleRow from './BottleRow.vue'

const props = defineProps<{ bottles: Bottle[] }>()

const tab = ref('upcoming')
const TODAY = new Date().toISOString().slice(0, 10)
const CURRENT_YEAR = new Date().getFullYear()

const scaleStart = CURRENT_YEAR - 2

const withWindow = computed(() => props.bottles.filter((b) => b.drinkFrom && b.drinkUntil))

const scaleEndValue = computed(() => {
  const years = withWindow.value.map((b) => parseInt(b.drinkUntil!.slice(0, 4)))
  return Math.max(...years, CURRENT_YEAR + 15)
})

const readyNow = computed(() =>
  withWindow.value
    .filter((b) => b.drinkFrom! <= TODAY && TODAY <= b.drinkUntil!)
    .sort((a, b) => a.drinkUntil!.localeCompare(b.drinkUntil!)),
)

const upcoming = computed(() =>
  withWindow.value
    .filter((b) => b.drinkFrom! > TODAY)
    .sort((a, b) => a.drinkFrom!.localeCompare(b.drinkFrom!)),
)

const pastPeak = computed(() =>
  withWindow.value
    .filter((b) => b.drinkUntil! < TODAY)
    .sort((a, b) => b.drinkUntil!.localeCompare(a.drinkUntil!)),
)

const upcomingByYear = computed(() => {
  const map = new Map<number, Bottle[]>()
  for (const b of upcoming.value) {
    const y = parseInt(b.drinkFrom!.slice(0, 4))
    if (!map.has(y)) map.set(y, [])
    map.get(y)!.push(b)
  }
  return Array.from(map.entries())
    .sort(([a], [b]) => a - b)
    .map(([year, bottles]) => ({
      year,
      bottles,
      totalUnits: bottles.reduce((s, b) => s + b.quantity, 0),
    }))
})
</script>
