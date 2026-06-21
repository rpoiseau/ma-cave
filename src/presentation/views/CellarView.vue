<template>
  <div>
    <!-- Filters bar -->
    <v-card class="mb-6" elevation="1">
      <v-card-text>
        <v-row dense align="center">
          <v-col cols="12" md="4">
            <v-text-field
              v-model="search"
              prepend-inner-icon="mdi-magnify"
              placeholder="Rechercher..."
              variant="outlined"
              density="compact"
              hide-details
              clearable
            />
          </v-col>
          <v-col cols="6" md="2">
            <v-select
              v-model="filterType"
              :items="typeOptions"
              label="Type"
              variant="outlined"
              density="compact"
              hide-details
              clearable
            />
          </v-col>
          <v-col cols="6" md="2">
            <v-select
              v-model="filterColor"
              :items="colorOptions"
              label="Couleur"
              variant="outlined"
              density="compact"
              hide-details
              clearable
              :disabled="filterType === 'spirit'"
            />
          </v-col>
          <v-col cols="6" md="2">
            <v-select
              v-model="filterMoment"
              :items="momentOptions"
              label="Moment"
              variant="outlined"
              density="compact"
              hide-details
              clearable
              :disabled="filterType === 'spirit'"
            />
          </v-col>
          <v-col cols="6" md="2">
            <v-select
              v-model="sortBy"
              :items="sortOptions"
              label="Trier par"
              variant="outlined"
              density="compact"
              hide-details
            />
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <div class="text-caption text-medium-emphasis mb-2">{{ filteredBottles.length }} résultat(s)</div>

    <!-- Empty state -->
    <div v-if="store.loading" class="d-flex justify-center py-12">
      <v-progress-circular indeterminate color="primary" size="48" />
    </div>

    <v-card v-else-if="filteredBottles.length === 0" class="text-center py-12">
      <v-icon size="64" color="grey-lighten-1">mdi-bottle-wine-outline</v-icon>
      <div class="text-h6 mt-4 text-medium-emphasis">Aucune bouteille trouvée</div>
      <v-btn class="mt-4" color="primary" to="/bouteille/ajouter">Ajouter une bouteille</v-btn>
    </v-card>

    <!-- Grid -->
    <v-row v-else>
      <v-col
        v-for="bottle in filteredBottles"
        :key="bottle.id"
        cols="12" sm="6" md="4" lg="3"
      >
        <BottleCard :bottle="bottle" />
      </v-col>
    </v-row>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useCellarStore } from '../stores/cellar.store'
import { WineColor, WINE_COLOR_LABELS } from '@/domain/value-objects/WineColor'
import {
  DrinkingMoment,
  DRINKING_MOMENT_LABELS,
  DRINKING_MOMENT_ORDER,
} from '@/domain/value-objects/DrinkingMoment'
import { deriveWineGuidance } from '@/domain/value-objects/wineGuidance'
import BottleCard from '../components/bottle/BottleCard.vue'
import type { Wine } from '@/domain/entities/Wine'

const store = useCellarStore()
onMounted(() => store.loadAll())

const search = ref('')
const filterType = ref<'wine' | 'spirit' | null>(null)
const filterColor = ref<WineColor | null>(null)
const filterMoment = ref<DrinkingMoment | null>(null)
const sortBy = ref<'name' | 'vintage' | 'purchaseDate' | 'rating'>('purchaseDate')

const momentOptions = DRINKING_MOMENT_ORDER.map((m) => ({
  title: DRINKING_MOMENT_LABELS[m],
  value: m,
}))

const typeOptions = [
  { title: 'Vin', value: 'wine' },
  { title: 'Spiritueux', value: 'spirit' },
]

const colorOptions = Object.values(WineColor).map((v) => ({
  title: WINE_COLOR_LABELS[v],
  value: v,
}))

const sortOptions = [
  { title: 'Date d\'ajout', value: 'purchaseDate' },
  { title: 'Nom', value: 'name' },
  { title: 'Millésime', value: 'vintage' },
  { title: 'Note', value: 'rating' },
]

const filteredBottles = computed(() => {
  let list = [...store.bottles]

  if (filterType.value) list = list.filter((b) => b.type === filterType.value)
  if (filterColor.value) {
    list = list.filter((b) => b.type === 'wine' && (b as Wine).color === filterColor.value)
  }
  if (filterMoment.value) {
    list = list.filter((b) => {
      if (b.type !== 'wine') return false
      const w = b as Wine
      return deriveWineGuidance({
        color: w.color,
        grapes: w.grapes,
        appellation: w.appellation,
      }).drinkingMoments.includes(filterMoment.value!)
    })
  }
  if (search.value) {
    const q = search.value.toLowerCase()
    list = list.filter(
      (b) =>
        b.name.toLowerCase().includes(q) ||
        b.producer.toLowerCase().includes(q) ||
        b.country.toLowerCase().includes(q) ||
        (b.region ?? '').toLowerCase().includes(q),
    )
  }

  list.sort((a, b) => {
    if (sortBy.value === 'name') return a.name.localeCompare(b.name)
    if (sortBy.value === 'vintage') return ((b as Wine).vintage ?? 0) - ((a as Wine).vintage ?? 0)
    if (sortBy.value === 'rating') return (b.rating ?? 0) - (a.rating ?? 0)
    return b.purchaseDate.localeCompare(a.purchaseDate)
  })

  return list
})
</script>
