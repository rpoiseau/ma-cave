<template>
  <div>
    <div v-if="!bottle" class="text-center py-12">
      <v-icon size="64" color="grey-lighten-1">mdi-bottle-wine-outline</v-icon>
      <div class="text-h6 mt-4 text-medium-emphasis">Bouteille introuvable</div>
      <v-btn class="mt-4" to="/cave">Retour à la cave</v-btn>
    </div>

    <template v-else>
      <!-- Header -->
      <div class="d-flex align-start justify-space-between mb-6 flex-wrap gap-3">
        <div>
          <div class="d-flex align-center gap-3 mb-1">
            <v-btn icon variant="text" to="/cave" size="small">
              <v-icon>mdi-arrow-left</v-icon>
            </v-btn>
            <h1 class="text-h5 font-weight-bold">{{ bottle.name }}</h1>
          </div>
          <div class="text-subtitle-1 text-medium-emphasis ml-10">
            {{ bottle.producer }} · {{ bottle.region ?? bottle.country }}
          </div>
        </div>
        <div class="d-flex gap-2">
          <v-btn
            color="success"
            prepend-icon="mdi-glass-wine"
            variant="flat"
            :disabled="bottle.quantity <= 0"
            @click="handleConsume"
          >
            J'en ai bu une
          </v-btn>
          <v-btn :to="`/bouteille/${bottle.id}/modifier`" prepend-icon="mdi-pencil" variant="outlined">
            Modifier
          </v-btn>
          <v-btn color="error" prepend-icon="mdi-delete" variant="outlined" @click="confirmDelete = true">
            Supprimer
          </v-btn>
        </div>
      </div>

      <v-tabs v-model="activeTab" color="primary" class="mb-4">
        <v-tab value="info">
          <v-icon start>mdi-information-outline</v-icon>
          Informations
        </v-tab>
        <v-tab value="tasting">
          <v-icon start>mdi-note-text</v-icon>
          Dégustations
          <v-chip
            v-if="tastingCount > 0"
            size="x-small"
            color="primary"
            class="ml-2"
          >{{ tastingCount }}</v-chip>
        </v-tab>
        <v-tab value="finance">
          <v-icon start>mdi-chart-line</v-icon>
          Finances
        </v-tab>
      </v-tabs>

      <v-tabs-window v-model="activeTab">
        <!-- INFO TAB -->
        <v-tabs-window-item value="info">
          <v-row>
            <v-col cols="12" md="8">
              <v-card class="mb-4">
                <v-card-text>
                  <v-row dense>
                    <v-col cols="6" sm="4">
                      <div class="text-caption text-medium-emphasis">Type</div>
                      <div class="font-weight-medium">{{ bottle.type === 'wine' ? 'Vin' : 'Spiritueux' }}</div>
                    </v-col>
                    <v-col v-if="wine" cols="6" sm="4">
                      <div class="text-caption text-medium-emphasis">Couleur</div>
                      <div class="font-weight-medium">{{ WINE_COLOR_LABELS[wine.color] }}</div>
                    </v-col>
                    <v-col v-if="wine?.vintage" cols="6" sm="4">
                      <div class="text-caption text-medium-emphasis">Millésime</div>
                      <div class="font-weight-medium">{{ wine.vintage }}</div>
                    </v-col>
                    <v-col v-if="wine?.appellation" cols="6" sm="4">
                      <div class="text-caption text-medium-emphasis">Appellation</div>
                      <div class="font-weight-medium">{{ wine.appellation }}</div>
                    </v-col>
                    <v-col v-if="spirit" cols="6" sm="4">
                      <div class="text-caption text-medium-emphasis">Catégorie</div>
                      <div class="font-weight-medium">{{ SPIRIT_CATEGORY_LABELS[spirit.category] }}</div>
                    </v-col>
                    <v-col v-if="spirit?.age" cols="6" sm="4">
                      <div class="text-caption text-medium-emphasis">Âge</div>
                      <div class="font-weight-medium">{{ spirit.age }} ans</div>
                    </v-col>
                    <v-col v-if="spirit?.abv" cols="6" sm="4">
                      <div class="text-caption text-medium-emphasis">Degré</div>
                      <div class="font-weight-medium">{{ spirit.abv }}%</div>
                    </v-col>
                    <v-col cols="6" sm="4">
                      <div class="text-caption text-medium-emphasis">Pays</div>
                      <div class="font-weight-medium">{{ bottle.country }}</div>
                    </v-col>
                    <v-col v-if="bottle.region" cols="6" sm="4">
                      <div class="text-caption text-medium-emphasis">Région</div>
                      <div class="font-weight-medium">{{ bottle.region }}</div>
                    </v-col>
                    <v-col v-if="wine?.grapes?.length" cols="12">
                      <div class="text-caption text-medium-emphasis">Cépages</div>
                      <div class="d-flex flex-wrap gap-2 mt-1">
                        <v-chip v-for="g in wine.grapes" :key="g" size="small" label>{{ g }}</v-chip>
                      </div>
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-card>

              <WineGuidanceCard v-if="wine" :wine="wine" class="mb-4" />

              <v-card v-if="bottle.notes">
                <v-card-title>Notes</v-card-title>
                <v-card-text class="text-body-1">{{ bottle.notes }}</v-card-text>
              </v-card>
            </v-col>

            <v-col cols="12" md="4">
              <v-card class="mb-4">
                <v-card-text>
                  <div class="text-caption text-medium-emphasis mb-3">Buvabilité</div>
                  <DrinkabilityChip :drink-from="bottle.drinkFrom" :drink-until="bottle.drinkUntil" />
                  <div v-if="bottle.drinkFrom || bottle.drinkUntil" class="mt-3 text-body-2">
                    <div v-if="bottle.drinkFrom">
                      <v-icon size="small" class="mr-1">mdi-calendar-start</v-icon>
                      À partir de {{ formatDate(bottle.drinkFrom) }}
                    </div>
                    <div v-if="bottle.drinkUntil">
                      <v-icon size="small" class="mr-1">mdi-calendar-end</v-icon>
                      Jusqu'à {{ formatDate(bottle.drinkUntil) }}
                    </div>
                  </div>
                </v-card-text>
              </v-card>

              <v-card class="mb-4">
                <v-card-text>
                  <div class="text-caption text-medium-emphasis mb-2">Achat</div>
                  <div class="d-flex justify-space-between text-body-2 mb-1">
                    <span>Quantité</span>
                    <strong>{{ bottle.quantity }} bouteille(s)</strong>
                  </div>
                  <div class="d-flex justify-space-between text-body-2 mb-1">
                    <span>Date d'achat</span>
                    <strong>{{ formatDate(bottle.purchaseDate) }}</strong>
                  </div>
                  <div v-if="bottle.purchasePrice" class="d-flex justify-space-between text-body-2">
                    <span>Prix unitaire</span>
                    <strong>{{ bottle.purchasePrice.toFixed(2) }} €</strong>
                  </div>
                </v-card-text>
              </v-card>

              <v-card v-if="bottle.rating">
                <v-card-text>
                  <div class="text-caption text-medium-emphasis mb-2">Ma note</div>
                  <v-rating :model-value="bottle.rating" color="amber" half-increments readonly />
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </v-tabs-window-item>

        <!-- TASTING TAB -->
        <v-tabs-window-item value="tasting">
          <TastingJournal :bottle-id="props.id" />
        </v-tabs-window-item>

        <!-- FINANCE TAB -->
        <v-tabs-window-item value="finance">
          <v-card>
            <v-card-title class="d-flex align-center gap-2">
              <v-icon color="primary">mdi-chart-line</v-icon>
              Analyse financière
            </v-card-title>
            <v-card-text>
              <PriceAnalysis :bottle="bottle" />
            </v-card-text>
          </v-card>
        </v-tabs-window-item>
      </v-tabs-window>
    </template>

    <v-snackbar v-model="showSnackbar" color="success" timeout="3500">
      {{ snackbarMessage }}
    </v-snackbar>

    <!-- Delete confirmation dialog -->
    <v-dialog v-model="confirmDelete" max-width="400">
      <v-card>
        <v-card-title>Supprimer la bouteille ?</v-card-title>
        <v-card-text>Cette action est irréversible.</v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn @click="confirmDelete = false">Annuler</v-btn>
          <v-btn color="error" @click="handleDelete">Supprimer</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useCellarStore } from '../stores/cellar.store'
import { WINE_COLOR_LABELS } from '@/domain/value-objects/WineColor'
import { SPIRIT_CATEGORY_LABELS } from '@/domain/value-objects/SpiritCategory'
import type { Wine } from '@/domain/entities/Wine'
import type { Spirit } from '@/domain/entities/Spirit'
import DrinkabilityChip from '../components/bottle/DrinkabilityChip.vue'
import PriceAnalysis from '../components/bottle/PriceAnalysis.vue'
import TastingJournal from '../components/tasting/TastingJournal.vue'
import WineGuidanceCard from '../components/bottle/WineGuidanceCard.vue'

const props = defineProps<{ id: string }>()
const router = useRouter()
const store = useCellarStore()
const confirmDelete = ref(false)
const activeTab = ref('info')
const showSnackbar = ref(false)
const snackbarMessage = ref('')

onMounted(() => store.loadAll())

const bottle = computed(() => store.getById(props.id))
const wine = computed(() => bottle.value?.type === 'wine' ? (bottle.value as Wine) : null)
const spirit = computed(() => bottle.value?.type === 'spirit' ? (bottle.value as Spirit) : null)
const tastingCount = computed(() => bottle.value?.tastingNotes?.length ?? 0)

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('fr-FR')
}

async function handleConsume() {
  if (!bottle.value) return
  const updated = await store.consumeOne(bottle.value.id)
  snackbarMessage.value =
    updated.quantity > 0
      ? `Santé ! Il vous reste ${updated.quantity} bouteille(s).`
      : 'Santé ! C’était la dernière de ce vin.'
  showSnackbar.value = true
}

async function handleDelete() {
  if (!bottle.value) return
  await store.remove(bottle.value.id)
  router.push('/cave')
}
</script>
