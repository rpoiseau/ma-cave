<template>
  <v-form ref="formRef" @submit.prevent="onSubmit">
    <!-- Type selector -->
    <v-btn-toggle v-model="form.type" mandatory color="primary" rounded="lg" class="mb-6">
      <v-btn value="wine" prepend-icon="mdi-bottle-wine">Vin</v-btn>
      <v-btn value="spirit" prepend-icon="mdi-glass-cocktail">Spiritueux</v-btn>
    </v-btn-toggle>

    <v-row>
      <!-- Common fields -->
      <v-col cols="12" md="6">
        <v-text-field
          v-model="form.name"
          label="Nom *"
          :rules="[required]"
          variant="outlined"
        />
      </v-col>
      <v-col cols="12" md="6">
        <v-text-field
          v-model="form.producer"
          label="Producteur / Domaine *"
          :rules="[required]"
          variant="outlined"
        />
      </v-col>
      <v-col cols="12" md="6">
        <v-text-field v-model="form.country" label="Pays *" :rules="[required]" variant="outlined" />
      </v-col>
      <v-col cols="12" md="6">
        <v-text-field v-model="form.region" label="Région" variant="outlined" />
      </v-col>

      <!-- Wine-specific -->
      <template v-if="form.type === 'wine'">
        <v-col cols="12" md="4">
          <v-select
            v-model="form.color"
            :items="wineColorOptions"
            label="Couleur *"
            :rules="[required]"
            variant="outlined"
          />
        </v-col>
        <v-col cols="12" md="4">
          <v-text-field
            v-model.number="form.vintage"
            label="Millésime"
            type="number"
            min="1800"
            :max="currentYear"
            variant="outlined"
          />
        </v-col>
        <v-col cols="12" md="4">
          <v-combobox
            v-model="form.appellation"
            :items="APPELLATION_PROFILES"
            item-title="name"
            item-value="name"
            :return-object="false"
            :custom-filter="appellationFilter"
            label="Appellation"
            variant="outlined"
            hint="Sélectionnez pour calculer automatiquement la fenêtre"
            persistent-hint
          >
            <template #item="{ item, props: listItemProps }">
              <v-list-item
                v-bind="listItemProps"
                :subtitle="`${(item.raw as AppellationProfile).region} · ${(item.raw as AppellationProfile).country} · ${(item.raw as AppellationProfile).minYears}–${(item.raw as AppellationProfile).maxYears} ans`"
              />
            </template>
          </v-combobox>
        </v-col>
        <v-col cols="12">
          <v-combobox
            v-model="form.grapes"
            label="Cépages"
            multiple
            chips
            closable-chips
            variant="outlined"
            hint="Appuyer sur Entrée pour ajouter un cépage"
          />
        </v-col>
      </template>

      <!-- Spirit-specific -->
      <template v-else>
        <v-col cols="12" md="6">
          <v-select
            v-model="form.category"
            :items="spiritCategoryOptions"
            label="Catégorie *"
            :rules="[required]"
            variant="outlined"
          />
        </v-col>
        <v-col cols="12" md="3">
          <v-text-field
            v-model.number="form.age"
            label="Âge (ans)"
            type="number"
            min="0"
            variant="outlined"
          />
        </v-col>
        <v-col cols="12" md="3">
          <v-text-field
            v-model.number="form.abv"
            label="Degré alcool (%)"
            type="number"
            min="0"
            max="100"
            step="0.1"
            variant="outlined"
          />
        </v-col>
        <v-col cols="12" md="6">
          <v-text-field v-model="form.distillery" label="Distillerie" variant="outlined" />
        </v-col>
      </template>

      <!-- Common purchase info -->
      <v-col cols="12">
        <v-divider class="mb-4" />
        <div class="text-subtitle-2 text-medium-emphasis mb-4">Informations d'achat</div>
      </v-col>
      <v-col cols="12" md="4">
        <v-text-field
          v-model.number="form.quantity"
          label="Quantité *"
          type="number"
          min="1"
          :rules="[required, positiveNumber]"
          variant="outlined"
        />
      </v-col>
      <v-col cols="12" md="4">
        <v-text-field
          v-model="form.purchaseDate"
          label="Date d'achat *"
          type="date"
          :rules="[required]"
          variant="outlined"
        />
      </v-col>
      <v-col cols="12" md="4">
        <v-text-field
          v-model.number="form.purchasePrice"
          label="Prix unitaire (€)"
          type="number"
          min="0"
          step="any"
          variant="outlined"
        />
      </v-col>

      <!-- Drinkability window -->
      <v-col cols="12">
        <v-divider class="mb-4" />
        <div class="text-subtitle-2 text-medium-emphasis mb-2">Fenêtre de dégustation</div>
      </v-col>

      <!-- Suggestion banner (wine only, when a known appellation + vintage are set) -->
      <v-col v-if="form.type === 'wine' && drinkWindowSuggestion" cols="12" class="pt-0 pb-2">
        <v-alert type="info" variant="tonal" density="compact" icon="mdi-lightbulb-outline">
          <div class="d-flex align-center justify-space-between flex-wrap gap-2">
            <span>
              <strong>{{ drinkWindowSuggestion.profileName }}</strong> —
              à boire entre {{ drinkWindowSuggestion.fromYear }} et {{ drinkWindowSuggestion.untilYear }}
              ({{ drinkWindowSuggestion.minYears }}–{{ drinkWindowSuggestion.maxYears }} ans après le millésime)
            </span>
            <v-btn size="small" variant="tonal" color="info" @click="applySuggestion">
              Appliquer
            </v-btn>
          </div>
        </v-alert>
      </v-col>

      <v-col cols="12" md="6">
        <v-text-field
          v-model="form.drinkFrom"
          label="À partir de"
          type="date"
          variant="outlined"
        />
      </v-col>
      <v-col cols="12" md="6">
        <v-text-field
          v-model="form.drinkUntil"
          label="Jusqu'à"
          type="date"
          variant="outlined"
        />
      </v-col>

      <!-- Notes & rating -->
      <v-col cols="12">
        <v-divider class="mb-4" />
        <div class="text-subtitle-2 text-medium-emphasis mb-4">Notes personnelles</div>
      </v-col>
      <v-col cols="12" md="8">
        <v-textarea v-model="form.notes" label="Notes" rows="3" variant="outlined" />
      </v-col>
      <v-col cols="12" md="4" class="d-flex flex-column align-start">
        <div class="text-caption text-medium-emphasis mb-2">Note personnelle</div>
        <v-rating v-model="form.rating" color="amber" half-increments hover />
      </v-col>

      <!-- Actions -->
      <v-col cols="12" class="d-flex gap-3">
        <v-btn type="submit" color="primary" :loading="loading">
          {{ isEdit ? 'Enregistrer les modifications' : 'Ajouter à la cave' }}
        </v-btn>
        <v-btn variant="text" @click="$emit('cancel')">Annuler</v-btn>
      </v-col>
    </v-row>
  </v-form>
</template>

<script setup lang="ts">
import { ref, reactive, watch, computed } from 'vue'
import type { VForm } from 'vuetify/components'
import { WineColor, WINE_COLOR_LABELS } from '@/domain/value-objects/WineColor'
import { SpiritCategory, SPIRIT_CATEGORY_LABELS } from '@/domain/value-objects/SpiritCategory'
import { APPELLATION_PROFILES, type AppellationProfile } from '@/domain/value-objects/appellations'
import type { CreateBottleDto } from '@/application/dtos/CreateBottleDto'
import type { Bottle } from '@/domain/entities/Bottle'
import type { Wine } from '@/domain/entities/Wine'
import type { Spirit } from '@/domain/entities/Spirit'

const props = defineProps<{
  initial?: Bottle
  loading?: boolean
}>()

const emit = defineEmits<{
  submit: [dto: CreateBottleDto]
  cancel: []
}>()

const isEdit = !!props.initial
const formRef = ref<VForm | null>(null)
const currentYear = new Date().getFullYear()

const defaultForm = (): CreateBottleDto => ({
  type: 'wine',
  name: '',
  producer: '',
  country: '',
  region: undefined,
  quantity: 1,
  purchaseDate: new Date().toISOString().split('T')[0],
  purchasePrice: undefined,
  drinkFrom: undefined,
  drinkUntil: undefined,
  notes: undefined,
  rating: undefined,
  color: WineColor.Red,
  vintage: undefined,
  appellation: undefined,
  grapes: [],
  category: SpiritCategory.Whisky,
  age: undefined,
  abv: undefined,
  distillery: undefined,
})

const form = reactive<CreateBottleDto>(defaultForm())

if (props.initial) {
  const b = props.initial
  Object.assign(form, {
    type: b.type,
    name: b.name,
    producer: b.producer,
    country: b.country,
    region: b.region,
    quantity: b.quantity,
    purchaseDate: b.purchaseDate,
    purchasePrice: b.purchasePrice,
    drinkFrom: b.drinkFrom,
    drinkUntil: b.drinkUntil,
    notes: b.notes,
    rating: b.rating,
    ...(b.type === 'wine' ? {
      color: (b as Wine).color,
      vintage: (b as Wine).vintage,
      appellation: (b as Wine).appellation,
      grapes: (b as Wine).grapes ?? [],
    } : {
      category: (b as Spirit).category,
      age: (b as Spirit).age,
      abv: (b as Spirit).abv,
      distillery: (b as Spirit).distillery,
    }),
  })
}

watch(() => form.type, (type) => {
  if (type === 'wine' && !form.color) form.color = WineColor.Red
  if (type === 'spirit' && !form.category) form.category = SpiritCategory.Whisky
})

const wineColorOptions = Object.values(WineColor).map((v) => ({
  title: WINE_COLOR_LABELS[v],
  value: v,
}))

const spiritCategoryOptions = Object.values(SpiritCategory).map((v) => ({
  title: SPIRIT_CATEGORY_LABELS[v],
  value: v,
}))

function normalizeStr(s: string) {
  return s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()
}

function appellationFilter(value: string, query: string): boolean {
  return normalizeStr(value).includes(normalizeStr(query))
}

const currentProfile = computed(() =>
  form.appellation
    ? (APPELLATION_PROFILES.find(p => p.name === form.appellation) ?? null)
    : null
)

const drinkWindowSuggestion = computed(() => {
  if (!currentProfile.value || !form.vintage) return null
  const { name, minYears, maxYears } = currentProfile.value
  const fromYear = (form.vintage as number) + minYears
  const untilYear = (form.vintage as number) + maxYears
  return {
    profileName: name,
    fromYear,
    untilYear,
    minYears,
    maxYears,
    fromDate: `${fromYear}-01-01`,
    untilDate: `${untilYear}-12-31`,
  }
})

function applySuggestion() {
  if (!drinkWindowSuggestion.value) return
  form.drinkFrom = drinkWindowSuggestion.value.fromDate
  form.drinkUntil = drinkWindowSuggestion.value.untilDate
}

// Auto-fill dates only when they are both empty (new bottle flow)
watch(
  [() => form.appellation, () => form.vintage],
  () => {
    if (!drinkWindowSuggestion.value) return
    if (!form.drinkFrom && !form.drinkUntil) {
      applySuggestion()
    }
  }
)

const required = (v: unknown) => (v !== null && v !== undefined && v !== '') || 'Champ obligatoire'
const positiveNumber = (v: unknown) => (Number(v) > 0) || 'Doit être supérieur à 0'

async function onSubmit() {
  const { valid } = await formRef.value!.validate()
  if (!valid) return
  const grapes = Array.isArray(form.grapes)
    ? (form.grapes as unknown[]).map(g => (typeof g === 'string' ? g : String(g)))
    : []
  const purchasePrice = form.purchasePrice != null
    ? Math.round(Number(form.purchasePrice) * 100) / 100
    : undefined
  emit('submit', { ...form, grapes, purchasePrice })
}
</script>
