<template>
  <v-card variant="text" class="mb-1 rounded-lg" :to="`/bouteille/${bottle.id}`">
    <v-card-text class="py-2 px-3">
      <div class="d-flex align-center justify-space-between gap-2 mb-1 flex-wrap">
        <div class="d-flex align-center gap-2 flex-wrap">
          <span class="font-weight-medium">{{ bottle.name }}</span>
          <span v-if="wineVintage" class="text-medium-emphasis">{{ wineVintage }}</span>
          <v-chip size="x-small" :color="statusColor" variant="tonal">{{ bottle.quantity }} btl</v-chip>
        </div>
        <span class="text-caption text-medium-emphasis text-no-wrap">{{ countdownLabel }}</span>
      </div>
      <div class="text-caption text-medium-emphasis mb-2">{{ subtitle }}</div>
      <WindowBar
        v-if="bottle.drinkFrom && bottle.drinkUntil"
        :drink-from="bottle.drinkFrom"
        :drink-until="bottle.drinkUntil"
        :scale-start="scaleStart"
        :scale-end="scaleEnd"
      />
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Bottle } from '@/domain/entities/Bottle'
import type { Wine } from '@/domain/entities/Wine'
import WindowBar from './WindowBar.vue'

const props = defineProps<{
  bottle: Bottle
  scaleStart: number
  scaleEnd: number
}>()

const TODAY = new Date().toISOString().slice(0, 10)
const CURRENT_YEAR = new Date().getFullYear()

const wine = computed(() => (props.bottle.type === 'wine' ? (props.bottle as Wine) : null))
const wineVintage = computed(() => wine.value?.vintage)

const subtitle = computed(() => {
  const parts: string[] = [props.bottle.producer]
  if (wine.value?.appellation) parts.push(wine.value.appellation)
  if (props.bottle.region) parts.push(props.bottle.region)
  return parts.join(' · ')
})

const statusColor = computed(() => {
  const b = props.bottle
  if (b.drinkUntil && TODAY > b.drinkUntil) return 'error'
  if (b.drinkFrom && b.drinkFrom > TODAY) return 'info'
  return 'success'
})

const countdownLabel = computed(() => {
  const b = props.bottle
  if (!b.drinkFrom) return ''
  const fromYear = parseInt(b.drinkFrom.slice(0, 4))
  if (b.drinkUntil && TODAY > b.drinkUntil) {
    const years = CURRENT_YEAR - parseInt(b.drinkUntil.slice(0, 4))
    return years === 0 ? 'Dépassé cette année' : `Dépassé depuis ${years} an${years > 1 ? 's' : ''}`
  }
  if (b.drinkFrom > TODAY) {
    const years = fromYear - CURRENT_YEAR
    if (years === 0) return 'Ouvre cette année'
    return `Dans ${years} an${years > 1 ? 's' : ''}`
  }
  return 'Prêt maintenant'
})
</script>
