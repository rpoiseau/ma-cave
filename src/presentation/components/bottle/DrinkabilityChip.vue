<template>
  <v-chip :color="status.color" :prepend-icon="status.icon" label size="small">
    {{ status.label }}
  </v-chip>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  drinkFrom?: string
  drinkUntil?: string
}>()

const status = computed(() => {
  const today = new Date().toISOString().split('T')[0]

  if (!props.drinkFrom && !props.drinkUntil) {
    return { color: 'default', icon: 'mdi-help-circle', label: 'Non renseigné' }
  }
  if (props.drinkUntil && today > props.drinkUntil) {
    return { color: 'error', icon: 'mdi-alert-circle', label: 'Passé son apogée' }
  }
  if (props.drinkFrom && today < props.drinkFrom) {
    return { color: 'info', icon: 'mdi-clock-outline', label: 'Trop tôt' }
  }
  return { color: 'success', icon: 'mdi-check-circle', label: 'À boire maintenant' }
})
</script>
