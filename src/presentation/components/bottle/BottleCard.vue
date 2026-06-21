<template>
  <v-card
    :to="`/bouteille/${bottle.id}`"
    hover
    class="h-100"
  >
    <v-card-item>
      <template #prepend>
        <v-avatar :color="typeColor" size="42">
          <v-icon color="white">{{ typeIcon }}</v-icon>
        </v-avatar>
      </template>
      <v-card-title class="text-truncate">{{ bottle.name }}</v-card-title>
      <v-card-subtitle>{{ bottle.producer }} · {{ bottle.country }}</v-card-subtitle>
    </v-card-item>

    <v-card-text class="pt-0">
      <div class="d-flex flex-wrap gap-2 mb-2">
        <DrinkabilityChip :drink-from="bottle.drinkFrom" :drink-until="bottle.drinkUntil" />
        <v-chip v-if="vintage" label size="small" color="secondary">{{ vintage }}</v-chip>
        <v-chip label size="small">{{ bottle.quantity }} btl</v-chip>
        <v-chip
          v-if="primaryMoment"
          label
          size="small"
          variant="tonal"
          color="primary"
          :prepend-icon="DRINKING_MOMENT_ICONS[primaryMoment]"
        >
          {{ DRINKING_MOMENT_LABELS[primaryMoment] }}
        </v-chip>
      </div>
      <v-rating
        v-if="bottle.rating"
        :model-value="bottle.rating"
        density="compact"
        size="x-small"
        color="amber"
        readonly
        half-increments
      />

      <!-- Cote actuelle + bouton sync -->
      <div class="d-flex align-center justify-space-between mt-2">
        <v-chip
          v-if="latestPrice"
          size="x-small"
          :color="priceColor"
          variant="tonal"
          label
        >
          {{ fmtPrice(latestPrice.price) }}
          <span v-if="priceDelta !== null" class="ml-1 opacity-80">
            {{ priceDelta >= 0 ? '+' : '' }}{{ priceDelta.toFixed(0) }}%
          </span>
        </v-chip>
        <span v-else />
        <v-tooltip :text="syncTooltip" location="top">
          <template #activator="{ props: tooltipProps }">
            <v-btn
              v-bind="tooltipProps"
              icon="mdi-sync"
              size="x-small"
              variant="text"
              :color="syncError ? 'error' : 'primary'"
              :loading="syncing"
              @click.prevent.stop="handleSync"
            />
          </template>
        </v-tooltip>
      </div>
    </v-card-text>
  </v-card>

  <v-snackbar v-model="showSnackbar" :color="syncError ? 'error' : 'success'" timeout="4000">
    {{ syncError || syncSuccess }}
  </v-snackbar>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Bottle } from '@/domain/entities/Bottle'
import type { Wine } from '@/domain/entities/Wine'
import { WineColor } from '@/domain/value-objects/WineColor'
import {
  DRINKING_MOMENT_LABELS,
  DRINKING_MOMENT_ICONS,
} from '@/domain/value-objects/DrinkingMoment'
import { deriveWineGuidance } from '@/domain/value-objects/wineGuidance'
import DrinkabilityChip from './DrinkabilityChip.vue'
import { useCellarStore } from '@/presentation/stores/cellar.store'

const props = defineProps<{ bottle: Bottle }>()

const store = useCellarStore()
const syncing = ref(false)
const syncError = ref('')
const syncSuccess = ref('')
const showSnackbar = ref(false)

const typeIcon = computed(() => (props.bottle.type === 'wine' ? 'mdi-bottle-wine' : 'mdi-glass-cocktail'))

const typeColor = computed(() => {
  if (props.bottle.type === 'spirit') return 'amber-darken-3'
  const wine = props.bottle as Wine
  const colorMap: Record<WineColor, string> = {
    [WineColor.Red]: 'deep-purple-darken-2',
    [WineColor.White]: 'amber-lighten-1',
    [WineColor.Rose]: 'pink-lighten-2',
    [WineColor.Sparkling]: 'light-blue-lighten-2',
    [WineColor.Sweet]: 'orange-lighten-2',
    [WineColor.Orange]: 'orange-darken-2',
  }
  return colorMap[wine.color] ?? 'grey'
})

const vintage = computed(() => {
  if (props.bottle.type === 'wine') return (props.bottle as Wine).vintage
  return null
})

const primaryMoment = computed(() => {
  if (props.bottle.type !== 'wine') return null
  const wine = props.bottle as Wine
  return deriveWineGuidance({
    color: wine.color,
    grapes: wine.grapes,
    appellation: wine.appellation,
  }).drinkingMoments[0] ?? null
})

const latestPrice = computed(() => {
  const history = props.bottle.priceHistory
  if (!history?.length) return null
  return [...history].sort((a, b) => a.date.localeCompare(b.date)).at(-1)!
})

const priceDelta = computed(() => {
  if (!latestPrice.value || !props.bottle.purchasePrice) return null
  return (latestPrice.value.price / props.bottle.purchasePrice - 1) * 100
})

const priceColor = computed(() => {
  if (priceDelta.value === null) return 'primary'
  return priceDelta.value >= 0 ? 'success' : 'error'
})

const syncTooltip = computed(() =>
  syncError.value ? syncError.value : 'Synchroniser depuis WineAPI.io',
)

function fmtPrice(v: number) {
  return v.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 })
}

async function handleSync() {
  syncing.value = true
  syncError.value = ''
  syncSuccess.value = ''
  try {
    await store.syncPrice(props.bottle.id)
    syncSuccess.value = 'Cote synchronisée !'
    showSnackbar.value = true
  } catch (e) {
    syncError.value = (e as Error).message
    showSnackbar.value = true
  } finally {
    syncing.value = false
  }
}
</script>
