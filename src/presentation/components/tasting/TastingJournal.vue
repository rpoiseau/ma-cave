<template>
  <div>
    <div v-if="notes.length === 0 && !showForm" class="text-center py-8 text-medium-emphasis">
      <v-icon size="48" color="grey-lighten-1">mdi-note-text-outline</v-icon>
      <div class="mt-2 text-body-2">Aucune dégustation enregistrée</div>
    </div>

    <div v-if="!showForm" class="d-flex justify-end mb-4">
      <v-btn
        color="primary"
        prepend-icon="mdi-plus"
        variant="tonal"
        @click="showForm = true"
      >
        Nouvelle dégustation
      </v-btn>
    </div>

    <TastingForm
      v-if="showForm"
      :bottle-id="bottleId"
      class="mb-4"
      @saved="showForm = false"
      @cancel="showForm = false"
    />

    <div class="d-flex flex-column gap-3">
      <TastingNoteCard
        v-for="note in notes"
        :key="note.id"
        :note="note"
        :deleting="deletingId === note.id"
        @delete="handleDelete(note.id)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useCellarStore } from '@/presentation/stores/cellar.store'
import TastingForm from './TastingForm.vue'
import TastingNoteCard from './TastingNoteCard.vue'

const props = defineProps<{ bottleId: string }>()

const store = useCellarStore()
const showForm = ref(false)
const deletingId = ref<string | null>(null)

const notes = computed(() => {
  const bottle = store.getById(props.bottleId)
  return [...(bottle?.tastingNotes ?? [])].sort((a, b) => b.date.localeCompare(a.date))
})

async function handleDelete(noteId: string) {
  deletingId.value = noteId
  try {
    await store.deleteTastingNote(props.bottleId, noteId)
  } finally {
    deletingId.value = null
  }
}
</script>
