<template>
  <div>
    <!-- Header -->
    <div class="d-flex align-center gap-3 mb-6">
      <v-icon size="36" color="primary">mdi-glass-wine</v-icon>
      <div>
        <h1 class="text-h5 font-weight-bold">Que boire ce soir ?</h1>
        <div class="text-body-2 text-medium-emphasis">Laissez votre cave vous inspirer</div>
      </div>
    </div>

    <!-- Criteria -->
    <v-card variant="tonal" color="primary" rounded="lg" class="mb-6">
      <v-card-text>
        <v-row dense>
          <!-- Occasion -->
          <v-col cols="12">
            <div class="text-caption text-medium-emphasis mb-2">Occasion</div>
            <div class="d-flex flex-wrap gap-2">
              <v-chip
                v-for="occ in OCCASIONS"
                :key="occ.value"
                :color="criteria.occasion === occ.value ? 'primary' : undefined"
                :variant="criteria.occasion === occ.value ? 'flat' : 'tonal'"
                :prepend-icon="occ.icon"
                size="small"
                style="cursor:pointer"
                @click="criteria.occasion = criteria.occasion === occ.value ? '' : occ.value"
              >{{ occ.label }}</v-chip>
            </div>
          </v-col>

          <!-- Color -->
          <v-col cols="12" sm="6">
            <div class="text-caption text-medium-emphasis mb-2 mt-3">Couleur</div>
            <div class="d-flex flex-wrap gap-2">
              <v-chip
                v-for="c in COLOR_OPTIONS"
                :key="c.value"
                :color="criteria.colorPreference === c.value ? 'primary' : undefined"
                :variant="criteria.colorPreference === c.value ? 'flat' : 'tonal'"
                size="small"
                style="cursor:pointer"
                @click="criteria.colorPreference = criteria.colorPreference === c.value ? '' : c.value"
              >{{ c.label }}</v-chip>
            </div>
          </v-col>

          <!-- Food -->
          <v-col cols="12" sm="6">
            <v-text-field
              v-model="criteria.foodPairing"
              label="Plat à accompagner"
              placeholder="Agneau, fromages, saumon…"
              variant="outlined"
              density="compact"
              prepend-inner-icon="mdi-food"
              hide-details
              class="mt-3"
              clearable
            />
          </v-col>

          <!-- Count -->
          <v-col cols="12">
            <div class="d-flex align-center gap-3 mt-2">
              <span class="text-caption text-medium-emphasis" style="white-space:nowrap">
                Nombre de suggestions :
              </span>
              <v-slider
                v-model="criteria.count"
                min="1"
                max="5"
                step="1"
                color="primary"
                hide-details
                class="flex-grow-1"
              />
              <v-chip size="small" color="primary" label class="font-weight-bold" style="min-width:28px">
                {{ criteria.count }}
              </v-chip>
            </div>
          </v-col>
        </v-row>

        <div class="d-flex justify-end gap-2 mt-4">
          <v-btn variant="text" size="small" @click="reset">Réinitialiser</v-btn>
          <v-btn
            color="primary"
            variant="flat"
            prepend-icon="mdi-shimmer"
            :disabled="bottles.length === 0"
            @click="search"
          >
            Trouver mes vins
          </v-btn>
        </div>
      </v-card-text>
    </v-card>

    <!-- Empty cellar -->
    <div v-if="bottles.length === 0" class="text-center py-16 text-medium-emphasis">
      <v-icon size="72" color="grey-lighten-1">mdi-bottle-wine-outline</v-icon>
      <div class="text-h6 mt-4">Votre cave est vide</div>
      <v-btn class="mt-4" to="/bouteille/ajouter" color="primary" variant="tonal" prepend-icon="mdi-plus">
        Ajouter une bouteille
      </v-btn>
    </div>

    <!-- No results -->
    <div v-else-if="searched && recommendations.length === 0" class="text-center py-12 text-medium-emphasis">
      <v-icon size="72" color="grey-lighten-1">mdi-glass-mug-off</v-icon>
      <div class="text-h6 mt-4">Aucun vin ne correspond</div>
      <div class="text-body-2 mt-2">Essayez d'élargir vos critères.</div>
    </div>

    <!-- Results -->
    <transition-group v-else-if="recommendations.length > 0" name="list" tag="div" class="d-flex flex-column gap-4">
      <v-card
        v-for="(rec, i) in recommendations"
        :key="rec.bottle.id"
        variant="outlined"
        rounded="lg"
        class="list-item"
      >
        <v-card-item>
          <template #prepend>
            <v-avatar :color="rankColor(i)" size="44">
              <v-icon v-if="i === 0" color="white">mdi-trophy</v-icon>
              <span v-else class="text-body-1 font-weight-bold text-white">#{{ i + 1 }}</span>
            </v-avatar>
          </template>

          <v-card-title class="text-body-1 font-weight-semibold">
            {{ rec.bottle.name }}
            <span v-if="bottleVintage(rec.bottle)" class="font-weight-regular text-medium-emphasis ml-1">
              {{ bottleVintage(rec.bottle) }}
            </span>
          </v-card-title>
          <v-card-subtitle>
            {{ rec.bottle.producer }}
            <span v-if="rec.bottle.region"> · {{ rec.bottle.region }}</span>
            · {{ rec.bottle.country }}
          </v-card-subtitle>

          <template #append>
            <v-btn
              :to="`/bouteille/${rec.bottle.id}`"
              size="small"
              color="primary"
              variant="tonal"
              prepend-icon="mdi-arrow-right"
            >
              Voir
            </v-btn>
          </template>
        </v-card-item>

        <v-card-text class="pt-1">
          <div class="d-flex flex-wrap align-center gap-2 mb-2">
            <DrinkabilityChip :drink-from="rec.bottle.drinkFrom" :drink-until="rec.bottle.drinkUntil" />

            <v-chip v-if="rec.bestTastingScore" size="x-small" color="amber" label>
              <v-icon start size="12">mdi-star</v-icon>
              {{ rec.bestTastingScore }}/100
            </v-chip>

            <v-chip size="x-small" color="grey" label variant="tonal">
              <v-icon start size="12">mdi-bottle-wine</v-icon>
              {{ rec.bottle.quantity }} btl
            </v-chip>

            <v-chip v-if="rec.drinkabilityUrgent" size="x-small" color="error" variant="tonal">
              <v-icon start size="12">mdi-clock-alert</v-icon>
              Urgent !
            </v-chip>
          </div>

          <div class="d-flex flex-wrap gap-1">
            <v-chip
              v-for="reason in rec.reasons"
              :key="reason"
              size="x-small"
              color="success"
              variant="tonal"
            >
              <v-icon start size="10">mdi-check</v-icon>
              {{ reason }}
            </v-chip>
          </div>
        </v-card-text>
      </v-card>
    </transition-group>

    <!-- Initial state -->
    <div v-else class="text-center py-16 text-medium-emphasis">
      <v-icon size="80" color="primary" opacity="0.25">mdi-glass-wine</v-icon>
      <div class="text-body-1 mt-4">Renseignez vos préférences et cliquez sur <strong>Trouver mes vins</strong></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useCellarStore } from '../stores/cellar.store'
import { WINE_COLOR_LABELS } from '@/domain/value-objects/WineColor'
import type { WineColor } from '@/domain/value-objects/WineColor'
import type { Wine } from '@/domain/entities/Wine'
import type { Bottle } from '@/domain/entities/Bottle'
import { recommendBottles, type Recommendation } from '@/application/services/WineRecommendation'
import DrinkabilityChip from '../components/bottle/DrinkabilityChip.vue'

const store = useCellarStore()
const { bottles } = storeToRefs(store)
onMounted(() => store.loadAll())

const OCCASIONS = [
  { value: 'apéritif', label: 'Apéritif', icon: 'mdi-glass-cocktail' },
  { value: 'dîner', label: 'Dîner', icon: 'mdi-silverware-fork-knife' },
  { value: 'gastronomique', label: 'Gastronomique', icon: 'mdi-chef-hat' },
  { value: 'fête', label: 'Fête', icon: 'mdi-party-popper' },
  { value: 'cadeau', label: 'Cadeau', icon: 'mdi-gift' },
]

const COLOR_OPTIONS = [
  { value: '' as WineColor | '', label: 'Indifférent' },
  ...(Object.entries(WINE_COLOR_LABELS) as [WineColor, string][]).map(([value, label]) => ({
    value,
    label,
  })),
]

const RANK_COLORS = ['deep-purple', 'primary', 'success', 'info', 'warning']

function rankColor(i: number) {
  return RANK_COLORS[i] ?? 'grey'
}

function bottleVintage(bottle: Bottle): number | undefined {
  return bottle.type === 'wine' ? (bottle as Wine).vintage : undefined
}

const criteria = ref({
  occasion: '',
  colorPreference: '' as WineColor | '',
  foodPairing: '',
  count: 3,
})

const recommendations = ref<Recommendation[]>([])
const searched = ref(false)

function search() {
  recommendations.value = recommendBottles(bottles.value, criteria.value)
  searched.value = true
}

function reset() {
  criteria.value = { occasion: '', colorPreference: '', foodPairing: '', count: 3 }
  recommendations.value = []
  searched.value = false
}
</script>

<style scoped>
.list-item {
  transition: all 0.3s ease;
}
.list-enter-from {
  opacity: 0;
  transform: translateY(-12px);
}
.list-leave-to {
  opacity: 0;
  transform: translateY(12px);
}
</style>
