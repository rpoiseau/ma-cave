<template>
  <v-card variant="tonal" color="primary" rounded="lg">
    <v-card-title class="text-subtitle-1 d-flex align-center gap-2">
      <v-icon size="18">mdi-plus-circle</v-icon>
      Nouvelle dégustation
    </v-card-title>
    <v-card-text>
      <v-row dense>
        <!-- Date + Score -->
        <v-col cols="12" sm="4">
          <v-text-field
            v-model="form.date"
            label="Date"
            type="date"
            variant="outlined"
            density="compact"
            :max="todayStr"
            hide-details
          />
        </v-col>
        <v-col cols="12" sm="8">
          <div class="d-flex align-center gap-3">
            <span class="text-caption text-medium-emphasis" style="white-space:nowrap">Score :</span>
            <v-slider
              v-model="form.score"
              min="50"
              max="100"
              step="1"
              color="primary"
              hide-details
              class="flex-grow-1"
            />
            <v-chip
              :color="scoreColor"
              size="small"
              label
              class="font-weight-bold"
              style="min-width:42px;text-align:center"
            >
              {{ form.score ?? '—' }}
            </v-chip>
            <span class="text-caption" :class="`text-${scoreColor}`" style="min-width:90px">
              {{ scoreLabel }}
            </span>
          </div>
        </v-col>

        <!-- Robe -->
        <v-col cols="12" sm="6">
          <v-text-field
            v-model="form.robe"
            label="Robe"
            placeholder="Couleur, intensité, limpidité…"
            variant="outlined"
            density="compact"
            hide-details
          />
        </v-col>

        <!-- Arômes -->
        <v-col cols="12" sm="6">
          <v-combobox
            v-model="form.aromes"
            :items="AROMES_LIST"
            label="Arômes"
            placeholder="Sélectionnez ou saisissez"
            variant="outlined"
            density="compact"
            multiple
            chips
            closable-chips
            hide-details
          />
        </v-col>

        <!-- Bouche -->
        <v-col cols="12" sm="6">
          <v-textarea
            v-model="form.bouche"
            label="Bouche"
            placeholder="Attaque, texture, tanins, acidité…"
            variant="outlined"
            density="compact"
            rows="2"
            hide-details
            auto-grow
          />
        </v-col>

        <!-- Finale -->
        <v-col cols="12" sm="6">
          <v-textarea
            v-model="form.finale"
            label="Finale"
            placeholder="Longueur, persistance aromatique…"
            variant="outlined"
            density="compact"
            rows="2"
            hide-details
            auto-grow
          />
        </v-col>

        <!-- Accord + Occasion -->
        <v-col cols="12" sm="6">
          <v-text-field
            v-model="form.accord"
            label="Accord mets-vins"
            placeholder="Agneau rôti, fromages affinés…"
            variant="outlined"
            density="compact"
            prepend-inner-icon="mdi-food"
            hide-details
          />
        </v-col>
        <v-col cols="12" sm="6">
          <v-text-field
            v-model="form.occasion"
            label="Occasion"
            placeholder="Dîner en famille, verticale…"
            variant="outlined"
            density="compact"
            prepend-inner-icon="mdi-account-group"
            hide-details
          />
        </v-col>

        <!-- Commentaire libre -->
        <v-col cols="12">
          <v-textarea
            v-model="form.commentaire"
            label="Commentaire"
            placeholder="Impressions générales, potentiel de garde…"
            variant="outlined"
            density="compact"
            rows="2"
            hide-details
            auto-grow
          />
        </v-col>
      </v-row>

      <v-alert v-if="error" type="error" density="compact" variant="tonal" class="mt-3">
        {{ error }}
      </v-alert>

      <div class="d-flex justify-end gap-2 mt-4">
        <v-btn variant="text" @click="$emit('cancel')">Annuler</v-btn>
        <v-btn
          color="primary"
          variant="flat"
          prepend-icon="mdi-check"
          :loading="loading"
          :disabled="!form.date"
          @click="submit"
        >
          Enregistrer la dégustation
        </v-btn>
      </div>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useCellarStore } from '@/presentation/stores/cellar.store'
import type { TastingNote } from '@/domain/entities/Bottle'

const props = defineProps<{ bottleId: string }>()
const emit = defineEmits<{ saved: []; cancel: [] }>()

const store = useCellarStore()
const todayStr = new Date().toISOString().slice(0, 10)
const loading = ref(false)
const error = ref('')

const AROMES_LIST = [
  'Fruits rouges', 'Fraise', 'Cerise', 'Framboise', 'Cassis', 'Mûre',
  'Fruits noirs', 'Myrtille', 'Pruneau',
  'Fruits jaunes', 'Pêche', 'Abricot', 'Mirabelle',
  'Agrumes', 'Citron', 'Pamplemousse', 'Orange',
  'Fleurs blanches', 'Rose', 'Violette', 'Pivoine',
  'Épices douces', 'Poivre', 'Cannelle', 'Muscade', 'Réglisse', 'Clou de girofle',
  'Boisé', 'Vanille', 'Toast', 'Fumé', 'Cèdre',
  'Minéral', 'Pierre à fusil', 'Craie', 'Graphite',
  'Terreux', 'Champignons', 'Sous-bois', 'Truffe',
  'Cuir', 'Tabac', 'Café', 'Chocolat', 'Caramel',
  'Herbes', 'Garrigue', 'Menthe', 'Eucalyptus',
]

function fresh() {
  return {
    date: todayStr,
    score: 88 as number | undefined,
    robe: '',
    aromes: [] as string[],
    bouche: '',
    finale: '',
    accord: '',
    occasion: '',
    commentaire: '',
  }
}

const form = ref(fresh())

const scoreColor = computed(() => {
  const s = form.value.score
  if (s == null) return 'default'
  if (s >= 95) return 'deep-purple'
  if (s >= 90) return 'success'
  if (s >= 85) return 'primary'
  if (s >= 80) return 'info'
  if (s >= 75) return 'warning'
  return 'error'
})

const scoreLabel = computed(() => {
  const s = form.value.score
  if (s == null) return ''
  if (s >= 95) return 'Exceptionnel'
  if (s >= 90) return 'Excellent'
  if (s >= 85) return 'Très bon'
  if (s >= 80) return 'Bon'
  if (s >= 75) return 'Correct'
  if (s >= 70) return 'Passable'
  return 'Défaut'
})

async function submit() {
  if (!form.value.date) return
  loading.value = true
  error.value = ''
  try {
    const note: TastingNote = {
      id: crypto.randomUUID(),
      date: form.value.date,
      score: form.value.score,
      robe: form.value.robe.trim() || undefined,
      aromes: form.value.aromes,
      bouche: form.value.bouche.trim() || undefined,
      finale: form.value.finale.trim() || undefined,
      accord: form.value.accord.trim() || undefined,
      occasion: form.value.occasion.trim() || undefined,
      commentaire: form.value.commentaire.trim() || undefined,
      createdAt: new Date().toISOString(),
    }
    await store.addTastingNote(props.bottleId, note)
    form.value = fresh()
    emit('saved')
  } catch (e) {
    error.value = (e as Error).message
  } finally {
    loading.value = false
  }
}
</script>
