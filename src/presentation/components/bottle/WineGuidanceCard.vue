<template>
  <v-card>
    <v-card-title class="d-flex align-center gap-2">
      <v-icon color="primary">mdi-school-outline</v-icon>
      Profil &amp; conseils
      <v-chip
        v-if="!guidance.fromCuratedAppellation"
        size="x-small"
        variant="tonal"
        class="ml-auto"
        title="Données dérivées de la couleur et des cépages"
      >
        estimé
      </v-chip>
    </v-card-title>

    <v-card-text>
      <div v-if="guidance.style" class="text-body-2 font-italic text-medium-emphasis mb-4">
        {{ guidance.style }}
      </div>

      <!-- Moment de consommation -->
      <div class="mb-4">
        <div class="text-caption text-medium-emphasis mb-2">Moment idéal</div>
        <div class="d-flex flex-wrap gap-2">
          <v-chip
            v-for="m in guidance.drinkingMoments"
            :key="m"
            size="small"
            color="primary"
            variant="tonal"
            :prepend-icon="MOMENT_ICONS[m]"
          >
            {{ MOMENT_LABELS[m] }}
          </v-chip>
        </div>
      </div>

      <v-row dense class="mb-2">
        <!-- Température -->
        <v-col cols="12" sm="6">
          <div class="text-caption text-medium-emphasis mb-1">Température de service</div>
          <div class="d-flex align-center gap-2 font-weight-medium">
            <v-icon size="18" color="blue">mdi-thermometer</v-icon>
            {{ guidance.servingTemp }}
          </div>
        </v-col>

        <!-- Cépages -->
        <v-col v-if="guidance.grapes.length" cols="12" sm="6">
          <div class="text-caption text-medium-emphasis mb-1">Cépages typiques</div>
          <div class="d-flex flex-wrap gap-1">
            <v-chip v-for="g in guidance.grapes" :key="g" size="x-small" label variant="tonal">
              {{ g }}
            </v-chip>
          </div>
        </v-col>
      </v-row>

      <!-- Arômes -->
      <div class="mb-4">
        <div class="text-caption text-medium-emphasis mb-2">Profil aromatique</div>
        <div class="d-flex flex-wrap gap-1">
          <v-chip
            v-for="a in guidance.aromas"
            :key="a"
            size="small"
            variant="outlined"
            color="deep-purple"
          >
            {{ a }}
          </v-chip>
        </div>
      </div>

      <!-- Accords mets -->
      <div class="mb-4">
        <div class="text-caption text-medium-emphasis mb-2">Accords mets</div>
        <div class="d-flex flex-wrap gap-2">
          <v-chip
            v-for="f in guidance.foodPairings"
            :key="f"
            size="small"
            variant="tonal"
            color="pink"
            prepend-icon="mdi-silverware-variant"
          >
            {{ f }}
          </v-chip>
        </div>
      </div>

      <v-divider class="mb-3" />

      <!-- Potentiel de revente -->
      <div>
        <div class="text-caption text-medium-emphasis mb-1">Potentiel de revente</div>
        <div class="d-flex align-center gap-2">
          <v-chip :color="investmentColor" size="small" label variant="flat">
            <v-icon start size="14">mdi-trending-up</v-icon>
            {{ INVESTMENT_LABELS[guidance.investmentPotential] }}
          </v-chip>
        </div>
        <div v-if="guidance.investmentNotes" class="text-caption text-medium-emphasis mt-2">
          {{ guidance.investmentNotes }}
        </div>
      </div>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Wine } from '@/domain/entities/Wine'
import { deriveWineGuidance, INVESTMENT_LABELS } from '@/domain/value-objects/wineGuidance'
import {
  DRINKING_MOMENT_LABELS as MOMENT_LABELS,
  DRINKING_MOMENT_ICONS as MOMENT_ICONS,
} from '@/domain/value-objects/DrinkingMoment'

const props = defineProps<{ wine: Wine }>()

const guidance = computed(() =>
  deriveWineGuidance({
    color: props.wine.color,
    grapes: props.wine.grapes,
    appellation: props.wine.appellation,
  }),
)

const investmentColor = computed(() => {
  switch (guidance.value.investmentPotential) {
    case 'excellent':
      return 'green-darken-2'
    case 'good':
      return 'light-green-darken-1'
    case 'moderate':
      return 'amber-darken-2'
    default:
      return 'grey'
  }
})
</script>
