<template>
  <div>
    <!-- Valeur de la cave : achat vs marché -->
    <v-row class="mb-2">
      <v-col cols="12" sm="6">
        <v-card variant="tonal" color="primary" rounded="lg">
          <v-card-text class="d-flex align-center gap-3">
            <v-icon size="32">mdi-cart-outline</v-icon>
            <div>
              <div class="text-h5 font-weight-bold">{{ fmt(purchaseValue) }}</div>
              <div class="text-body-2">Valeur d'achat (prix payé)</div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" sm="6">
        <v-card variant="tonal" color="green-darken-2" rounded="lg">
          <v-card-text class="d-flex align-center gap-3">
            <v-icon size="32">mdi-finance</v-icon>
            <div>
              <div class="text-h5 font-weight-bold">
                {{ fmt(marketValue) }}
                <span
                  v-if="valueDelta !== null"
                  class="text-body-2 font-weight-medium"
                  :class="valueDelta >= 0 ? 'text-success' : 'text-error'"
                >
                  ({{ valueDelta >= 0 ? '+' : '' }}{{ valueDelta.toFixed(0) }} %)
                </span>
              </div>
              <div class="text-body-2">Valeur de marché (cote × quantité)</div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Vins à revendre -->
    <v-card class="mb-6">
      <v-card-title class="d-flex align-center gap-2 pt-4 px-4">
        <v-icon color="green-darken-2">mdi-cash-multiple</v-icon>
        Vins à revendre
        <v-chip v-if="resale.length" size="small" color="green-darken-2" class="ml-auto">
          {{ resale.length }}
        </v-chip>
      </v-card-title>
      <v-card-subtitle class="px-4 pb-0">
        Opportunités d'après la cote enregistrée et l'apogée — pensez à synchroniser les cotes
      </v-card-subtitle>
      <v-card-text class="pt-3">
        <div v-if="resale.length === 0" class="text-medium-emphasis text-body-2 py-2">
          Aucune opportunité détectée. Renseignez une cote (onglet Finances d'une bouteille)
          pour révéler les plus-values.
        </div>
        <v-list v-else density="compact" class="pa-0">
          <v-list-item
            v-for="opp in resale.slice(0, 8)"
            :key="opp.bottle.id"
            :to="`/bouteille/${opp.bottle.id}`"
            class="px-2 rounded"
          >
            <template #prepend>
              <v-avatar :color="investmentColor(opp.investmentPotential)" size="36" rounded="lg">
                <v-icon color="white" size="18">mdi-trending-up</v-icon>
              </v-avatar>
            </template>
            <v-list-item-title class="font-weight-medium">
              {{ opp.bottle.name }}
              <span class="text-medium-emphasis font-weight-regular">· {{ opp.bottle.producer }}</span>
            </v-list-item-title>
            <v-list-item-subtitle>
              <span v-for="(r, i) in opp.reasons" :key="i">
                {{ r }}<span v-if="i < opp.reasons.length - 1"> · </span>
              </span>
            </v-list-item-subtitle>
            <template #append>
              <div class="text-right">
                <div v-if="opp.currentPrice != null" class="font-weight-bold">
                  {{ fmt(opp.currentPrice) }}
                </div>
                <div
                  v-if="opp.gainPct != null"
                  class="text-caption"
                  :class="opp.gainPct >= 0 ? 'text-success' : 'text-error'"
                >
                  {{ opp.gainPct >= 0 ? '+' : '' }}{{ opp.gainPct.toFixed(0) }} %
                </div>
              </div>
            </template>
          </v-list-item>
        </v-list>
      </v-card-text>
    </v-card>

    <!-- Courbe de maturité -->
    <v-card class="mb-6">
      <v-card-title class="d-flex align-center gap-2 pt-4 px-4">
        <v-icon color="primary">mdi-chart-bar</v-icon>
        Courbe de maturité de la cave
        <v-tooltip location="bottom" max-width="280">
          <template #activator="{ props: tp }">
            <v-icon v-bind="tp" size="18" class="ml-1 text-medium-emphasis" style="cursor: help;">
              mdi-information-outline
            </v-icon>
          </template>
          Nombre de bouteilles (unités) dont la fenêtre de dégustation est ouverte pour chaque année. Seules les bouteilles avec une fenêtre renseignée sont comptées.
        </v-tooltip>
      </v-card-title>
      <v-card-subtitle class="px-4 pb-0">
        Bouteilles par année de dégustation · de {{ currentYear }} à {{ lastYear }}
      </v-card-subtitle>
      <v-card-text class="pt-2">
        <MaturityChart :data="maturityCurve" />
      </v-card-text>
    </v-card>

    <!-- Timeline de buvabilité -->
    <v-card>
      <v-card-title class="d-flex align-center gap-2 pt-4 px-4">
        <v-icon color="secondary">mdi-timeline-clock</v-icon>
        Timeline de buvabilité
      </v-card-title>
      <v-card-subtitle class="px-4 pb-0">
        {{ bottlesWithWindow }} bouteille{{ bottlesWithWindow !== 1 ? 's' : '' }} avec fenêtre de dégustation
        sur {{ totalBottles }} au total
      </v-card-subtitle>
      <v-card-text class="pt-3 pb-2">
        <DrinkabilityTimeline :bottles="bottles" />
      </v-card-text>
    </v-card>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useCellarStore } from '../stores/cellar.store'
import MaturityChart from '../components/analytics/MaturityChart.vue'
import DrinkabilityTimeline from '../components/analytics/DrinkabilityTimeline.vue'
import { analyzeResale, totalMarketValue } from '@/application/services/ResaleAnalyzer'
import type { InvestmentPotential } from '@/domain/value-objects/appellations'

const store = useCellarStore()
const { bottles, maturityCurve } = storeToRefs(store)

onMounted(() => store.loadAll())

const resale = computed(() => analyzeResale(bottles.value))

const purchaseValue = computed(() =>
  bottles.value.reduce((sum, b) => sum + (b.purchasePrice ?? 0) * b.quantity, 0),
)
const marketValue = computed(() => totalMarketValue(bottles.value))
const valueDelta = computed(() =>
  purchaseValue.value > 0 ? (marketValue.value / purchaseValue.value - 1) * 100 : null,
)

function fmt(v: number) {
  return v.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 })
}

function investmentColor(p: InvestmentPotential) {
  switch (p) {
    case 'excellent':
      return 'green-darken-2'
    case 'good':
      return 'light-green-darken-1'
    case 'moderate':
      return 'amber-darken-2'
    default:
      return 'grey'
  }
}

const currentYear = new Date().getFullYear()
const lastYear = computed(() =>
  maturityCurve.value.length > 0
    ? maturityCurve.value[maturityCurve.value.length - 1].year
    : currentYear,
)
const totalBottles = computed(() => bottles.value.length)
const bottlesWithWindow = computed(
  () => bottles.value.filter((b) => b.drinkFrom && b.drinkUntil).length,
)
</script>
