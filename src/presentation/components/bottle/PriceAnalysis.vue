<template>
  <div>
    <!-- Pas de prix d'achat -->
    <div v-if="!bottle.purchasePrice" class="text-center text-medium-emphasis py-6">
      <v-icon size="40" opacity="0.2" class="mb-2">mdi-currency-eur</v-icon>
      <div class="text-body-2">Renseignez le prix d'achat pour activer l'analyse financière.</div>
      <v-btn
        size="small" variant="outlined" class="mt-3"
        :to="`/bouteille/${bottle.id}/modifier`"
      >Modifier la bouteille</v-btn>
    </div>

    <template v-else>
      <!-- KPIs -->
      <v-row dense class="mb-4">
        <v-col cols="6" sm="3">
          <v-card variant="tonal" color="default" rounded="lg">
            <v-card-text class="pa-3 text-center">
              <div class="text-caption text-medium-emphasis mb-1">Prix d'achat</div>
              <div class="text-h6 font-weight-bold">{{ fmt(bottle.purchasePrice) }}</div>
              <div class="text-caption text-medium-emphasis">/ bouteille</div>
            </v-card-text>
          </v-card>
        </v-col>

        <v-col cols="6" sm="3">
          <v-card variant="tonal" :color="latestPoint ? 'primary' : 'default'" rounded="lg">
            <v-card-text class="pa-3 text-center">
              <div class="text-caption text-medium-emphasis mb-1">Cote actuelle</div>
              <div class="text-h6 font-weight-bold">
                {{ latestPoint ? fmt(latestPoint.price) : '—' }}
              </div>
              <div class="text-caption text-medium-emphasis">
                {{ latestPoint ? formatDateShort(latestPoint.date) : 'non renseignée' }}
              </div>
            </v-card-text>
          </v-card>
        </v-col>

        <v-col cols="6" sm="3">
          <v-card variant="tonal" :color="variationColor" rounded="lg">
            <v-card-text class="pa-3 text-center">
              <div class="text-caption text-medium-emphasis mb-1">Variation</div>
              <div class="text-h6 font-weight-bold d-flex align-center justify-center gap-1">
                <v-icon v-if="variation !== null" size="18">
                  {{ variation >= 0 ? 'mdi-trending-up' : 'mdi-trending-down' }}
                </v-icon>
                {{ variation !== null ? fmtPct(variation) : '—' }}
              </div>
              <div class="text-caption text-medium-emphasis">
                {{ variation !== null ? (variation >= 0 ? `+${fmt(absoluteGain!)}` : fmt(absoluteGain!)) : 'vs achat' }}
              </div>
            </v-card-text>
          </v-card>
        </v-col>

        <v-col cols="6" sm="3">
          <v-card variant="tonal" :color="cagrColor" rounded="lg">
            <v-card-text class="pa-3 text-center">
              <div class="text-caption text-medium-emphasis mb-1">Rendement annuel</div>
              <div class="text-h6 font-weight-bold">
                {{ cagr !== null ? fmtPct(cagr) + ' / an' : '—' }}
              </div>
              <div class="text-caption text-medium-emphasis">CAGR</div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <!-- Valeur totale de la cave (si +value) -->
      <v-alert
        v-if="latestPoint && totalCurrentValue !== null"
        :type="variation !== null && variation >= 0 ? 'success' : 'error'"
        variant="tonal"
        density="compact"
        class="mb-4"
      >
        Valeur actuelle du lot :
        <strong>{{ fmt(totalCurrentValue) }}</strong>
        ({{ bottle.quantity }} btl × {{ fmt(latestPoint.price) }})
        <span v-if="totalGain !== null && totalGain !== 0">
          · {{ totalGain >= 0 ? '+' : '' }}{{ fmt(totalGain) }} vs achat
        </span>
      </v-alert>

      <!-- Graphique -->
      <div v-if="sortedHistory.length >= 1" class="mb-4">
        <PriceChart
          :price-history="sortedHistory"
          :purchase-price="bottle.purchasePrice"
          :purchase-date="bottle.purchaseDate"
        />
      </div>

      <v-divider class="mb-4" />

      <!-- Estimation locale de la cote -->
      <div class="d-flex align-center justify-space-between mb-3">
        <div class="text-subtitle-2 text-medium-emphasis">Enregistrer une cote</div>
        <v-btn
          size="small"
          color="primary"
          variant="tonal"
          prepend-icon="mdi-calculator-variant"
          :loading="syncLoading"
          @click="handleSync"
        >
          Estimer la cote
        </v-btn>
      </div>
      <v-alert v-if="syncError" type="error" density="compact" variant="tonal" class="mb-3" closable @click:close="syncError = ''">
        {{ syncError }}
      </v-alert>
      <v-alert v-if="syncSuccess" type="success" density="compact" variant="tonal" class="mb-3">
        {{ syncSuccess }}
      </v-alert>
      <v-row dense align="center" class="mb-3">
        <v-col cols="12" sm="3">
          <v-text-field
            v-model="newDate"
            label="Date"
            type="date"
            variant="outlined"
            density="compact"
            hide-details
            :min="bottle.purchaseDate"
            :max="todayStr"
          />
        </v-col>
        <v-col cols="12" sm="3">
          <v-text-field
            v-model.number="newPrice"
            label="Prix (€ / btl)"
            type="number"
            min="0"
            step="0.01"
            variant="outlined"
            density="compact"
            hide-details
            suffix="€"
          />
        </v-col>
        <v-col cols="12" sm="4">
          <v-text-field
            v-model="newSource"
            label="Source (optionnel)"
            placeholder="Wine-Searcher, iDealwine…"
            variant="outlined"
            density="compact"
            hide-details
          />
        </v-col>
        <v-col cols="12" sm="2">
          <v-btn
            color="primary"
            variant="flat"
            block
            :loading="addLoading"
            :disabled="!newPrice || newPrice <= 0"
            @click="addPoint"
          >
            Ajouter
          </v-btn>
        </v-col>
      </v-row>
      <v-alert v-if="addError" type="error" density="compact" variant="tonal" class="mb-3">
        {{ addError }}
      </v-alert>

      <!-- Historique des cotes -->
      <template v-if="sortedHistory.length > 0">
        <div class="text-subtitle-2 text-medium-emphasis mb-2">Historique des cotes</div>
        <v-list density="compact" class="pa-0">
          <v-list-item
            v-for="(point, i) in [...sortedHistory].reverse()"
            :key="i"
            class="px-0"
          >
            <template #prepend>
              <v-icon size="16" class="mr-2" color="primary">mdi-circle-small</v-icon>
            </template>
            <v-list-item-title class="text-body-2">
              <strong>{{ fmt(point.price) }}</strong>
              <span class="text-medium-emphasis ml-2">{{ formatDateLong(point.date) }}</span>
              <v-chip v-if="point.source" size="x-small" class="ml-2" variant="tonal">
                {{ point.source }}
              </v-chip>
              <span
                v-if="bottle.purchasePrice && point.price !== bottle.purchasePrice"
                class="ml-2 text-caption"
                :class="point.price >= bottle.purchasePrice ? 'text-success' : 'text-error'"
              >
                {{ point.price >= bottle.purchasePrice ? '+' : '' }}{{ fmtPct((point.price / bottle.purchasePrice - 1) * 100) }}
              </span>
            </v-list-item-title>
            <template #append>
              <v-btn
                icon="mdi-trash-can-outline"
                size="x-small"
                variant="text"
                color="error"
                :loading="deleteLoadingIdx === originalIndex(point)"
                @click="removePoint(originalIndex(point))"
              />
            </template>
          </v-list-item>
        </v-list>
      </template>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Bottle, PricePoint } from '@/domain/entities/Bottle'
import { useCellarStore } from '@/presentation/stores/cellar.store'
import PriceChart from './PriceChart.vue'

const props = defineProps<{ bottle: Bottle }>()

const store = useCellarStore()

const todayStr = new Date().toISOString().slice(0, 10)
const newDate = ref(todayStr)
const newPrice = ref<number | undefined>(undefined)
const newSource = ref('')
const addLoading = ref(false)
const addError = ref('')
const deleteLoadingIdx = ref<number | null>(null)
const syncLoading = ref(false)
const syncError = ref('')
const syncSuccess = ref('')

const sortedHistory = computed(() =>
  [...(props.bottle.priceHistory ?? [])].sort((a, b) => a.date.localeCompare(b.date)),
)

const latestPoint = computed(() => sortedHistory.value[sortedHistory.value.length - 1] ?? null)

const variation = computed(() => {
  if (!latestPoint.value || !props.bottle.purchasePrice) return null
  return (latestPoint.value.price / props.bottle.purchasePrice - 1) * 100
})

const absoluteGain = computed(() => {
  if (!latestPoint.value || !props.bottle.purchasePrice) return null
  return latestPoint.value.price - props.bottle.purchasePrice
})

const totalCurrentValue = computed(() =>
  latestPoint.value ? latestPoint.value.price * props.bottle.quantity : null,
)

const totalGain = computed(() => {
  if (!latestPoint.value || !props.bottle.purchasePrice) return null
  return (latestPoint.value.price - props.bottle.purchasePrice) * props.bottle.quantity
})

const cagr = computed(() => {
  if (!latestPoint.value || !props.bottle.purchasePrice) return null
  const years =
    (new Date(latestPoint.value.date).getTime() - new Date(props.bottle.purchaseDate).getTime()) /
    (365.25 * 24 * 3600 * 1000)
  if (years < 0.25) return null
  return (Math.pow(latestPoint.value.price / props.bottle.purchasePrice, 1 / years) - 1) * 100
})

const variationColor = computed(() => {
  if (variation.value === null) return 'default'
  return variation.value >= 0 ? 'success' : 'error'
})

const cagrColor = computed(() => {
  if (cagr.value === null) return 'default'
  return cagr.value >= 0 ? 'success' : 'error'
})

function fmt(v: number) {
  return v.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 2 })
}

function fmtPct(v: number) {
  return (v >= 0 ? '+' : '') + v.toFixed(1) + ' %'
}

function formatDateShort(iso: string) {
  return new Date(iso).toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' })
}

function formatDateLong(iso: string) {
  return new Date(iso).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
}

// Map a point back to its original unsorted index for deletion
function originalIndex(point: PricePoint): number {
  return (props.bottle.priceHistory ?? []).findIndex(
    (p) => p.date === point.date && p.price === point.price && p.source === point.source,
  )
}

async function addPoint() {
  if (!newPrice.value || newPrice.value <= 0) return
  addError.value = ''
  addLoading.value = true
  try {
    await store.addPricePoint(props.bottle.id, {
      date: newDate.value,
      price: newPrice.value,
      source: newSource.value.trim() || undefined,
    })
    newPrice.value = undefined
    newSource.value = ''
  } catch (e) {
    addError.value = (e as Error).message
  } finally {
    addLoading.value = false
  }
}

async function handleSync() {
  syncLoading.value = true
  syncError.value = ''
  syncSuccess.value = ''
  try {
    await store.syncPrice(props.bottle.id)
    syncSuccess.value = 'Cote estimée localement et enregistrée !'
    setTimeout(() => { syncSuccess.value = '' }, 5000)
  } catch (e) {
    syncError.value = (e as Error).message
  } finally {
    syncLoading.value = false
  }
}

async function removePoint(idx: number) {
  deleteLoadingIdx.value = idx
  try {
    await store.removePricePoint(props.bottle.id, idx)
  } finally {
    deleteLoadingIdx.value = null
  }
}
</script>
