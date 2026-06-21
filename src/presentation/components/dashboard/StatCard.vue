<template>
  <v-card>
    <v-card-text>
      <div class="d-flex align-center justify-space-between">
        <div>
          <div class="text-caption text-medium-emphasis text-uppercase font-weight-bold mb-1">
            {{ label }}
          </div>
          <div class="text-h4 font-weight-bold">{{ value }}</div>
          <div v-if="subtitle" class="text-caption text-medium-emphasis mt-1">{{ subtitle }}</div>
        </div>
        <v-avatar :color="color" size="56">
          <v-icon :icon="icon" color="white" size="28" />
        </v-avatar>
      </div>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
defineProps<{
  label: string
  value: string | number
  icon: string
  color?: string
  subtitle?: string
}>()
</script>
