<template>
  <div>
    <!-- Header -->
    <div class="d-flex align-center gap-3 mb-6">
      <v-icon size="36" color="primary">mdi-lightbulb-on</v-icon>
      <div>
        <h1 class="text-h5 font-weight-bold">Conseiller</h1>
        <div class="text-body-2 text-medium-emphasis">Agenda de dégustation & conseils d'achat</div>
      </div>
    </div>

    <v-tabs v-model="tab" color="primary" class="mb-6">
      <v-tab value="agenda" prepend-icon="mdi-calendar-clock">Agenda</v-tab>
      <v-tab value="achats" prepend-icon="mdi-cart-plus">Conseils d'achat</v-tab>
    </v-tabs>

    <v-window v-model="tab">
      <!-- ══════════════════════════════════ AGENDA ══════════════════════════════════ -->
      <v-window-item value="agenda">
        <div v-if="bottles.length === 0" class="text-center py-16 text-medium-emphasis">
          <v-icon size="72" color="grey-lighten-1">mdi-bottle-wine-outline</v-icon>
          <div class="text-h6 mt-4">Votre cave est vide</div>
          <v-btn class="mt-4" to="/bouteille/ajouter" color="primary" variant="tonal" prepend-icon="mdi-plus">
            Ajouter une bouteille
          </v-btn>
        </div>

        <template v-else>
          <!-- Summary chips -->
          <div class="d-flex flex-wrap gap-2 mb-6">
            <v-chip v-if="closingSoon.length" color="error" label size="small" prepend-icon="mdi-clock-alert">
              {{ closingSoon.length }} à boire d'urgence
            </v-chip>
            <v-chip v-if="readyNow.length" color="success" label size="small" prepend-icon="mdi-check-circle">
              {{ readyNow.length }} prêt{{ readyNow.length > 1 ? 's' : '' }} maintenant
            </v-chip>
            <v-chip v-if="tooYoung.length" color="info" label size="small" prepend-icon="mdi-clock-outline">
              {{ tooYoung.length }} en attente
            </v-chip>
            <v-chip v-if="pastPeak.length" color="warning" label size="small" prepend-icon="mdi-alert">
              {{ pastPeak.length }} dépassé{{ pastPeak.length > 1 ? 's' : '' }}
            </v-chip>
            <v-chip v-if="unknownWindow.length" label size="small" prepend-icon="mdi-help-circle-outline">
              {{ unknownWindow.length }} sans fenêtre
            </v-chip>
          </div>

          <!-- À BOIRE D'URGENCE -->
          <template v-if="closingSoon.length">
            <div class="d-flex align-center gap-2 mb-3">
              <v-icon color="error" size="20">mdi-clock-alert</v-icon>
              <span class="text-subtitle-1 font-weight-bold text-error">À boire d'urgence</span>
              <v-chip size="x-small" color="error" variant="tonal">{{ closingSoon.length }}</v-chip>
            </div>
            <div class="d-flex flex-column gap-3 mb-6">
              <BottleAdviceCard
                v-for="advice in closingSoon"
                :key="advice.bottle.id"
                :advice="advice"
                :scale-start="scaleStart"
                :scale-end="scaleEnd"
              />
            </div>
          </template>

          <!-- PRÊTS MAINTENANT -->
          <template v-if="readyNow.length">
            <div class="d-flex align-center gap-2 mb-3">
              <v-icon color="success" size="20">mdi-check-circle</v-icon>
              <span class="text-subtitle-1 font-weight-bold text-success">Prêts à boire</span>
              <v-chip size="x-small" color="success" variant="tonal">{{ readyNow.length }}</v-chip>
            </div>
            <div class="d-flex flex-column gap-3 mb-6">
              <BottleAdviceCard
                v-for="advice in readyNow"
                :key="advice.bottle.id"
                :advice="advice"
                :scale-start="scaleStart"
                :scale-end="scaleEnd"
              />
            </div>
          </template>

          <!-- EN ATTENTE -->
          <template v-if="tooYoung.length">
            <div class="d-flex align-center gap-2 mb-3">
              <v-icon color="info" size="20">mdi-clock-outline</v-icon>
              <span class="text-subtitle-1 font-weight-bold" style="color: rgb(var(--v-theme-info))">À attendre</span>
              <v-chip size="x-small" color="info" variant="tonal">{{ tooYoung.length }}</v-chip>
            </div>
            <div class="d-flex flex-column gap-3 mb-6">
              <BottleAdviceCard
                v-for="advice in tooYoung"
                :key="advice.bottle.id"
                :advice="advice"
                :scale-start="scaleStart"
                :scale-end="scaleEnd"
              />
            </div>
          </template>

          <!-- PASSÉS L'APOGÉE -->
          <template v-if="pastPeak.length">
            <div class="d-flex align-center gap-2 mb-3">
              <v-icon color="warning" size="20">mdi-alert</v-icon>
              <span class="text-subtitle-1 font-weight-bold text-warning">Passés l'apogée</span>
              <v-chip size="x-small" color="warning" variant="tonal">{{ pastPeak.length }}</v-chip>
            </div>
            <div class="d-flex flex-column gap-3 mb-6">
              <BottleAdviceCard
                v-for="advice in pastPeak"
                :key="advice.bottle.id"
                :advice="advice"
                :scale-start="scaleStart"
                :scale-end="scaleEnd"
              />
            </div>
          </template>

          <!-- FENÊTRE NON RENSEIGNÉE -->
          <template v-if="unknownWindow.length">
            <div class="d-flex align-center gap-2 mb-3">
              <v-icon color="grey" size="20">mdi-help-circle-outline</v-icon>
              <span class="text-subtitle-1 font-weight-bold text-medium-emphasis">Fenêtre non renseignée</span>
              <v-chip size="x-small" variant="tonal">{{ unknownWindow.length }}</v-chip>
            </div>
            <div class="d-flex flex-column gap-3">
              <v-card
                v-for="advice in unknownWindow"
                :key="advice.bottle.id"
                variant="outlined"
                rounded="lg"
                density="compact"
              >
                <v-card-item>
                  <v-card-title class="text-body-2">{{ advice.bottle.name }}</v-card-title>
                  <v-card-subtitle>{{ advice.bottle.producer }}</v-card-subtitle>
                  <template #append>
                    <v-btn
                      :to="`/bouteille/${advice.bottle.id}/modifier`"
                      size="x-small"
                      variant="tonal"
                      color="primary"
                      prepend-icon="mdi-pencil"
                    >
                      Compléter
                    </v-btn>
                  </template>
                </v-card-item>
              </v-card>
            </div>
          </template>
        </template>
      </v-window-item>

      <!-- ══════════════════════════════════ ACHATS ══════════════════════════════════ -->
      <v-window-item value="achats">
        <div v-if="maturityCurve.length === 0" class="text-center py-16 text-medium-emphasis">
          <v-icon size="72" color="grey-lighten-1">mdi-calendar-question</v-icon>
          <div class="text-h6 mt-4">Pas encore de données de maturité</div>
          <div class="text-body-2 mt-2">
            Renseignez les fenêtres de dégustation de vos bouteilles pour obtenir des conseils d'achat.
          </div>
          <v-btn class="mt-4" to="/cave" color="primary" variant="tonal" prepend-icon="mdi-bottle-wine">
            Aller à ma cave
          </v-btn>
        </div>

        <template v-else>
          <!-- Coverage summary banner -->
          <v-card
            :color="gapYears.length === 0 ? 'success' : 'warning'"
            variant="tonal"
            rounded="lg"
            class="mb-6"
          >
            <v-card-text>
              <div class="d-flex align-center gap-3">
                <v-icon :color="gapYears.length === 0 ? 'success' : 'warning'" size="28">
                  {{ gapYears.length === 0 ? 'mdi-shield-check' : 'mdi-shield-alert' }}
                </v-icon>
                <div>
                  <div class="text-subtitle-1 font-weight-bold">
                    {{ gapYears.length === 0
                      ? 'Cave bien pourvue'
                      : `${gapYears.length} année${gapYears.length > 1 ? 's' : ''} avec couverture insuffisante`
                    }}
                  </div>
                  <div class="text-body-2">
                    {{ gapYears.length === 0
                      ? 'Vous avez au moins 2 bouteilles prêtes pour chaque année projetée.'
                      : `Objectif : ≥ 2 bouteilles prêtes par an. Millésime cible pour acheter maintenant : ${targetVintage}.`
                    }}
                  </div>
                </div>
              </div>
              <div v-if="gapYears.length" class="d-flex flex-wrap gap-1 mt-3">
                <v-chip
                  v-for="y in gapYears.slice(0, 20)"
                  :key="y"
                  size="x-small"
                  color="warning"
                  variant="flat"
                  label
                >
                  {{ y }}
                </v-chip>
                <v-chip v-if="gapYears.length > 20" size="x-small" label>
                  +{{ gapYears.length - 20 }} …
                </v-chip>
              </div>
            </v-card-text>
          </v-card>

          <!-- No gaps -->
          <div v-if="gapYears.length === 0" class="text-center py-8 text-medium-emphasis">
            <v-icon size="60" color="success" opacity="0.4">mdi-glass-wine</v-icon>
            <div class="text-body-1 mt-4">Aucun achat urgent nécessaire. Profitez de votre cave !</div>
          </div>

          <!-- Purchase suggestions -->
          <template v-else-if="suggestions.length">
            <div class="text-subtitle-2 text-medium-emphasis mb-3 px-1">
              Suggestions d'achat · millésime {{ targetVintage }}
            </div>
            <div class="d-flex flex-column gap-4">
              <v-card
                v-for="s in suggestions"
                :key="s.appellation.id"
                variant="outlined"
                rounded="lg"
              >
                <v-card-item>
                  <template #prepend>
                    <v-avatar :color="priorityColor(s.priority)" size="40" rounded="lg">
                      <v-icon color="white" size="20">{{ priorityIcon(s.priority) }}</v-icon>
                    </v-avatar>
                  </template>

                  <v-card-title class="text-body-1 font-weight-semibold">
                    {{ s.appellation.name }}
                  </v-card-title>
                  <v-card-subtitle>
                    {{ s.appellation.region }} · {{ s.appellation.country }}
                  </v-card-subtitle>

                  <template #append>
                    <v-chip :color="priorityColor(s.priority)" size="x-small" label>
                      {{ priorityLabel(s.priority) }}
                    </v-chip>
                  </template>
                </v-card-item>

                <v-card-text class="pt-0">
                  <div class="d-flex flex-wrap gap-4 mb-2">
                    <div>
                      <div class="text-caption text-medium-emphasis">Millésime cible</div>
                      <div class="text-body-2 font-weight-medium">{{ s.targetVintage }}</div>
                    </div>
                    <div>
                      <div class="text-caption text-medium-emphasis">Fenêtre de dégustation</div>
                      <div class="text-body-2 font-weight-medium">{{ s.readyFrom }} → {{ s.readyUntil }}</div>
                    </div>
                    <div>
                      <div class="text-caption text-medium-emphasis">Garde</div>
                      <div class="text-body-2 font-weight-medium">
                        {{ s.appellation.minYears }}–{{ s.appellation.maxYears }} ans
                      </div>
                    </div>
                  </div>

                  <div class="d-flex flex-wrap align-center gap-1 mb-2">
                    <span class="text-caption text-medium-emphasis mr-1">Comble :</span>
                    <v-chip
                      v-for="y in s.gapYearsCovered.slice(0, 10)"
                      :key="y"
                      size="x-small"
                      color="primary"
                      variant="tonal"
                      label
                    >
                      {{ y }}
                    </v-chip>
                    <v-chip v-if="s.gapYearsCovered.length > 10" size="x-small" variant="tonal" label>
                      +{{ s.gapYearsCovered.length - 10 }}
                    </v-chip>
                  </div>

                  <div class="text-body-2 text-medium-emphasis">{{ s.rationale }}</div>
                </v-card-text>
              </v-card>
            </div>
          </template>

          <div v-else class="text-center py-8 text-medium-emphasis">
            <div class="text-body-2">Aucune suggestion disponible pour combler ces lacunes.</div>
          </div>
        </template>
      </v-window-item>
    </v-window>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useCellarStore } from '../stores/cellar.store'
import { analyzeBottles, suggestPurchases } from '@/application/services/DrinkabilityAdvisor'
import BottleAdviceCard from '../components/bottle/BottleAdviceCard.vue'

const store = useCellarStore()
const { bottles, maturityCurve } = storeToRefs(store)
onMounted(() => store.loadAll())

const tab = ref('agenda')
const currentYear = new Date().getFullYear()
const targetVintage = currentYear - 1

// ─── Agenda ──────────────────────────────────────────────────────────────────

const allAdvice = computed(() => analyzeBottles(bottles.value))

const closingSoon = computed(() => allAdvice.value.filter((a) => a.status === 'closing-soon'))
const readyNow = computed(() => allAdvice.value.filter((a) => a.status === 'ready'))
const tooYoung = computed(() =>
  allAdvice.value
    .filter((a) => a.status === 'too-young')
    .sort((a, b) => (a.yearsUntilReady ?? 99) - (b.yearsUntilReady ?? 99)),
)
const pastPeak = computed(() => allAdvice.value.filter((a) => a.status === 'past-peak'))
const unknownWindow = computed(() => allAdvice.value.filter((a) => a.status === 'unknown'))

const scaleStart = currentYear - 2
const scaleEnd = computed(() => {
  const years = bottles.value
    .filter((b) => b.drinkUntil)
    .map((b) => parseInt(b.drinkUntil!.slice(0, 4)))
  return Math.max(...years, currentYear + 15)
})

// ─── Achats ──────────────────────────────────────────────────────────────────

const purchaseData = computed(() => suggestPurchases(maturityCurve.value, bottles.value))
const gapYears = computed(() => purchaseData.value.gapYears)
const suggestions = computed(() => purchaseData.value.suggestions)

// ─── Helpers ─────────────────────────────────────────────────────────────────

function priorityColor(p: 'high' | 'medium' | 'low') {
  return p === 'high' ? 'error' : p === 'medium' ? 'warning' : 'grey'
}

function priorityIcon(p: 'high' | 'medium' | 'low') {
  return p === 'high' ? 'mdi-alert-circle' : p === 'medium' ? 'mdi-star' : 'mdi-information'
}

function priorityLabel(p: 'high' | 'medium' | 'low') {
  return p === 'high' ? 'Prioritaire' : p === 'medium' ? 'Recommandé' : 'Optionnel'
}
</script>
