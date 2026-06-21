<template>
  <v-card variant="outlined" rounded="lg">
    <v-card-item class="pb-1">
      <template #prepend>
        <v-avatar :color="scoreColor" size="40">
          <span class="text-caption font-weight-bold text-white">{{ note.score ?? '—' }}</span>
        </v-avatar>
      </template>
      <v-card-title class="text-body-1 font-weight-medium">
        {{ formatDate(note.date) }}
        <span v-if="note.occasion" class="text-medium-emphasis font-weight-regular ml-2 text-body-2">
          · {{ note.occasion }}
        </span>
      </v-card-title>
      <v-card-subtitle v-if="note.score" class="text-caption" :class="`text-${scoreColor}`">
        {{ scoreLabel }}
      </v-card-subtitle>
      <template #append>
        <v-btn
          icon="mdi-trash-can-outline"
          size="x-small"
          variant="text"
          color="error"
          :loading="deleting"
          @click="$emit('delete')"
        />
      </template>
    </v-card-item>

    <v-card-text class="pt-1">
      <div v-if="note.aromes.length" class="d-flex flex-wrap gap-1 mb-2">
        <v-chip
          v-for="a in note.aromes"
          :key="a"
          size="x-small"
          label
          color="primary"
          variant="tonal"
        >{{ a }}</v-chip>
      </div>

      <v-row dense class="text-body-2">
        <v-col v-if="note.robe" cols="12" sm="4">
          <span class="text-caption text-medium-emphasis d-block">Robe</span>
          {{ note.robe }}
        </v-col>
        <v-col v-if="note.bouche" cols="12" sm="4">
          <span class="text-caption text-medium-emphasis d-block">Bouche</span>
          {{ note.bouche }}
        </v-col>
        <v-col v-if="note.finale" cols="12" sm="4">
          <span class="text-caption text-medium-emphasis d-block">Finale</span>
          {{ note.finale }}
        </v-col>
      </v-row>

      <div v-if="note.accord" class="d-flex align-center gap-1 mt-2 text-body-2">
        <v-icon size="14" color="success">mdi-food</v-icon>
        <span class="text-medium-emphasis text-caption mr-1">Accord :</span>
        {{ note.accord }}
      </div>

      <div v-if="note.commentaire" class="mt-2 text-body-2 text-medium-emphasis font-italic">
        « {{ note.commentaire }} »
      </div>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { TastingNote } from '@/domain/entities/Bottle'

const props = defineProps<{ note: TastingNote; deleting?: boolean }>()
defineEmits<{ delete: [] }>()

const scoreColor = computed(() => {
  const s = props.note.score
  if (s == null) return 'default'
  if (s >= 95) return 'deep-purple'
  if (s >= 90) return 'success'
  if (s >= 85) return 'primary'
  if (s >= 80) return 'info'
  if (s >= 75) return 'warning'
  return 'error'
})

const scoreLabel = computed(() => {
  const s = props.note.score
  if (s == null) return ''
  if (s >= 95) return 'Exceptionnel'
  if (s >= 90) return 'Excellent'
  if (s >= 85) return 'Très bon'
  if (s >= 80) return 'Bon'
  if (s >= 75) return 'Correct'
  if (s >= 70) return 'Passable'
  return 'Défaut'
})

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
}
</script>
