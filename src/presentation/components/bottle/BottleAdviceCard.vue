<template>
  <v-card variant="outlined" rounded="lg">
    <v-card-item>
      <v-card-title class="text-body-1 font-weight-semibold">
        {{ bottle.name }}
        <span v-if="vintage" class="font-weight-regular text-medium-emphasis ml-1">{{ vintage }}</span>
      </v-card-title>
      <v-card-subtitle>
        {{ bottle.producer }}
        <span v-if="bottle.region"> · {{ bottle.region }}</span>
        · {{ bottle.country }}
      </v-card-subtitle>
      <template #append>
        <v-btn
          :to="`/bouteille/${bottle.id}`"
          size="small"
          color="primary"
          variant="text"
          icon="mdi-arrow-right"
        />
      </template>
    </v-card-item>

    <v-card-text class="pt-1">
      <div class="d-flex flex-wrap align-center gap-2 mb-2">
        <DrinkabilityChip :drink-from="bottle.drinkFrom" :drink-until="bottle.drinkUntil" />
        <v-chip size="x-small" label variant="tonal">{{ bottle.quantity }} btl</v-chip>
      </div>

      <WindowBar
        v-if="bottle.drinkFrom && bottle.drinkUntil"
        :drink-from="bottle.drinkFrom"
        :drink-until="bottle.drinkUntil"
        :scale-start="scaleStart"
        :scale-end="scaleEnd"
        class="mb-2"
      />

      <div :class="`text-body-2 font-weight-medium text-${statusColor}`">
        {{ adviceText }}
      </div>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { BottleAdvice } from '@/application/services/DrinkabilityAdvisor'
import type { Wine } from '@/domain/entities/Wine'
import DrinkabilityChip from './DrinkabilityChip.vue'
import WindowBar from '../analytics/WindowBar.vue'

const props = defineProps<{
  advice: BottleAdvice
  scaleStart: number
  scaleEnd: number
}>()

const bottle = computed(() => props.advice.bottle)

const vintage = computed(() =>
  bottle.value.type === 'wine' ? (bottle.value as Wine).vintage : undefined,
)

const statusColor = computed(() => {
  const map: Record<string, string> = {
    'closing-soon': 'error',
    ready: 'success',
    'too-young': 'info',
    'past-peak': 'warning',
    unknown: 'medium-emphasis',
  }
  return map[props.advice.status] ?? 'medium-emphasis'
})

const adviceText = computed(() => {
  const a = props.advice
  switch (a.status) {
    case 'closing-soon':
      return a.yearsLeft === 0
        ? 'À boire cette année !'
        : `À boire dans moins de ${a.yearsLeft} an${a.yearsLeft! > 1 ? 's' : ''} (jusqu'en ${a.windowUntil})`
    case 'ready':
      return `À boire maintenant jusqu'en ${a.windowUntil} (encore ${a.yearsLeft} an${a.yearsLeft! > 1 ? 's' : ''})`
    case 'too-young':
      return `Patienter encore ${a.yearsUntilReady} an${a.yearsUntilReady! > 1 ? 's' : ''} — prêt à partir de ${a.windowFrom}`
    case 'past-peak':
      return `Dépassé depuis ${a.windowUntil} — à ouvrir sans tarder`
    default:
      return 'Fenêtre de dégustation non renseignée'
  }
})
</script>
