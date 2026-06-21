<template>
  <div>
    <v-row class="mb-6">
      <v-col cols="12" sm="6" md="3">
        <StatCard
          label="Total bouteilles"
          :value="stats.totalBottles"
          icon="mdi-bottle-wine"
          color="primary"
          :subtitle="`${stats.totalUnits} unités`"
        />
      </v-col>
      <v-col cols="12" sm="6" md="3">
        <StatCard
          label="Vins"
          :value="stats.wineCount"
          icon="mdi-bottle-wine-outline"
          color="deep-purple"
        />
      </v-col>
      <v-col cols="12" sm="6" md="3">
        <StatCard
          label="Spiritueux"
          :value="stats.spiritCount"
          icon="mdi-glass-cocktail"
          color="amber-darken-3"
        />
      </v-col>
      <v-col cols="12" sm="6" md="3">
        <StatCard
          label="Valeur estimée"
          :value="`${stats.totalValue.toFixed(0)} €`"
          icon="mdi-currency-eur"
          color="green-darken-2"
        />
      </v-col>
    </v-row>

    <!-- Coup d'œil : à boire / à garder / à revendre -->
    <v-row class="mb-2">
      <v-col cols="12" sm="4">
        <v-card to="/conseiller" hover variant="tonal" color="success" rounded="lg">
          <v-card-text class="d-flex align-center gap-3">
            <v-icon size="32">mdi-glass-wine</v-icon>
            <div>
              <div class="text-h5 font-weight-bold">{{ stats.readyToDrink.length }}</div>
              <div class="text-body-2">À boire maintenant</div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" sm="4">
        <v-card to="/conseiller" hover variant="tonal" color="info" rounded="lg">
          <v-card-text class="d-flex align-center gap-3">
            <v-icon size="32">mdi-timer-sand</v-icon>
            <div>
              <div class="text-h5 font-weight-bold">{{ toKeep.length }}</div>
              <div class="text-body-2">À garder (en attente)</div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" sm="4">
        <v-card to="/analytique" hover variant="tonal" color="green-darken-2" rounded="lg">
          <v-card-text class="d-flex align-center gap-3">
            <v-icon size="32">mdi-cash-multiple</v-icon>
            <div>
              <div class="text-h5 font-weight-bold">{{ resale.length }}</div>
              <div class="text-body-2">À revendre</div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Répartition par moment de consommation -->
    <v-card v-if="momentBreakdown.some((m) => m.count > 0)" class="mb-6">
      <v-card-title class="d-flex align-center gap-2">
        <v-icon color="primary">mdi-clock-outline</v-icon>
        Par moment de consommation
      </v-card-title>
      <v-card-text class="d-flex flex-wrap gap-3">
        <div
          v-for="m in momentBreakdown"
          :key="m.moment"
          class="text-center"
          style="min-width: 84px"
        >
          <v-icon :color="m.count > 0 ? 'primary' : 'grey-lighten-1'" size="26">
            {{ MOMENT_ICONS[m.moment] }}
          </v-icon>
          <div class="text-h6 font-weight-bold">{{ m.count }}</div>
          <div class="text-caption text-medium-emphasis">{{ MOMENT_LABELS[m.moment] }}</div>
        </div>
      </v-card-text>
    </v-card>

    <v-row>
      <!-- Ready to drink -->
      <v-col cols="12" md="6">
        <v-card>
          <v-card-title class="d-flex align-center gap-2">
            <v-icon color="success">mdi-check-circle</v-icon>
            À boire maintenant
            <v-chip size="small" color="success" class="ml-auto">{{ stats.readyToDrink.length }}</v-chip>
          </v-card-title>
          <v-card-text v-if="stats.readyToDrink.length === 0" class="text-medium-emphasis">
            Aucune bouteille dans sa fenêtre de dégustation.
          </v-card-text>
          <v-list v-else density="compact">
            <v-list-item
              v-for="bottle in stats.readyToDrink.slice(0, 5)"
              :key="bottle.id"
              :title="bottle.name"
              :subtitle="bottle.producer"
              :to="`/bouteille/${bottle.id}`"
            >
              <template #prepend>
                <v-icon color="success">mdi-bottle-wine</v-icon>
              </template>
              <template #append>
                <span class="text-caption text-medium-emphasis">{{ bottle.quantity }} btl</span>
              </template>
            </v-list-item>
          </v-list>
        </v-card>
      </v-col>

      <!-- Past peak -->
      <v-col cols="12" md="6">
        <v-card>
          <v-card-title class="d-flex align-center gap-2">
            <v-icon color="error">mdi-alert-circle</v-icon>
            Passé leur apogée
            <v-chip size="small" color="error" class="ml-auto">{{ stats.pastPeak.length }}</v-chip>
          </v-card-title>
          <v-card-text v-if="stats.pastPeak.length === 0" class="text-medium-emphasis">
            Aucune bouteille dépassée.
          </v-card-text>
          <v-list v-else density="compact">
            <v-list-item
              v-for="bottle in stats.pastPeak.slice(0, 5)"
              :key="bottle.id"
              :title="bottle.name"
              :subtitle="`Apogée dépassée le ${formatDate(bottle.drinkUntil!)}`"
              :to="`/bouteille/${bottle.id}`"
            >
              <template #prepend>
                <v-icon color="error">mdi-bottle-wine</v-icon>
              </template>
            </v-list-item>
          </v-list>
        </v-card>
      </v-col>

      <!-- Recent additions -->
      <v-col cols="12">
        <v-card>
          <v-card-title>Ajouts récents</v-card-title>
          <v-card-text v-if="stats.recentAdditions.length === 0" class="text-medium-emphasis">
            Votre cave est vide.
            <v-btn variant="text" color="primary" to="/bouteille/ajouter">Ajouter une bouteille</v-btn>
          </v-card-text>
          <v-row v-else class="pa-4" dense>
            <v-col
              v-for="bottle in stats.recentAdditions"
              :key="bottle.id"
              cols="12" sm="6" md="4" lg="3"
            >
              <BottleCard :bottle="bottle" />
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useCellarStore } from '../stores/cellar.store'
import StatCard from '../components/dashboard/StatCard.vue'
import BottleCard from '../components/bottle/BottleCard.vue'
import type { Wine } from '@/domain/entities/Wine'
import {
  DRINKING_MOMENT_ORDER,
  DRINKING_MOMENT_LABELS as MOMENT_LABELS,
  DRINKING_MOMENT_ICONS as MOMENT_ICONS,
} from '@/domain/value-objects/DrinkingMoment'
import { deriveWineGuidance } from '@/domain/value-objects/wineGuidance'
import { analyzeResale } from '@/application/services/ResaleAnalyzer'

const store = useCellarStore()
const { stats, bottles } = storeToRefs(store)

onMounted(() => store.loadAll())

const today = new Date().toISOString().slice(0, 10)

const toKeep = computed(() =>
  bottles.value.filter((b) => b.drinkFrom && b.drinkFrom > today),
)

const resale = computed(() => analyzeResale(bottles.value))

const momentBreakdown = computed(() =>
  DRINKING_MOMENT_ORDER.map((moment) => ({
    moment,
    count: bottles.value.reduce((sum, b) => {
      if (b.type !== 'wine') return sum
      const w = b as Wine
      const moments = deriveWineGuidance({
        color: w.color,
        grapes: w.grapes,
        appellation: w.appellation,
      }).drinkingMoments
      return moments.includes(moment) ? sum + b.quantity : sum
    }, 0),
  })),
)

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('fr-FR')
}
</script>
