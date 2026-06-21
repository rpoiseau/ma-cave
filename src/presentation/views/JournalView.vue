<template>
  <div>
    <h1 class="text-h5 font-weight-bold mb-6">Journal de dégustation</h1>

    <div v-if="recentTastings.length === 0" class="text-center py-16 text-medium-emphasis">
      <v-icon size="72" color="grey-lighten-1">mdi-note-text-outline</v-icon>
      <div class="text-h6 mt-4">Aucune dégustation enregistrée</div>
      <div class="text-body-2 mt-2">Ouvrez une bouteille pour commencer à noter vos dégustations.</div>
      <v-btn class="mt-6" to="/cave" prepend-icon="mdi-bottle-wine" color="primary" variant="tonal">
        Voir ma cave
      </v-btn>
    </div>

    <div v-else class="d-flex flex-column gap-4">
      <div v-for="entry in recentTastings" :key="entry.note.id">
        <div class="text-caption text-medium-emphasis mb-1 d-flex align-center gap-2">
          <v-icon size="14">mdi-bottle-wine-outline</v-icon>
          <router-link
            :to="`/bouteille/${entry.bottle.id}`"
            class="text-decoration-none text-medium-emphasis font-weight-medium"
            style="color: inherit"
          >
            {{ entry.bottle.name }}
            <span v-if="entry.bottle.type === 'wine' && entry.bottle.vintage"> {{ entry.bottle.vintage }}</span>
          </router-link>
          <span class="mx-1">·</span>
          <span>{{ entry.bottle.producer }}</span>
        </div>
        <TastingNoteCard
          :note="entry.note"
          :deleting="deletingId === entry.note.id"
          @delete="handleDelete(entry.bottle.id, entry.note.id)"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useCellarStore } from '../stores/cellar.store'
import { storeToRefs } from 'pinia'
import TastingNoteCard from '../components/tasting/TastingNoteCard.vue'

const store = useCellarStore()
const { recentTastings } = storeToRefs(store)
const deletingId = ref<string | null>(null)

onMounted(() => store.loadAll())

async function handleDelete(bottleId: string, noteId: string) {
  deletingId.value = noteId
  try {
    await store.deleteTastingNote(bottleId, noteId)
  } finally {
    deletingId.value = null
  }
}
</script>
