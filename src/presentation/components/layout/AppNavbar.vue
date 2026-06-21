<template>
  <v-app-bar elevation="0" border="b">
    <template v-if="mobile" #prepend>
      <v-app-bar-nav-icon @click="toggleDrawer" />
    </template>
    <v-app-bar-title>{{ currentTitle }}</v-app-bar-title>
    <template #append>
      <v-btn icon @click="toggleTheme">
        <v-icon>{{ isDark ? 'mdi-weather-sunny' : 'mdi-weather-night' }}</v-icon>
      </v-btn>
      <v-btn icon to="/bouteille/ajouter" color="primary" class="mr-2">
        <v-icon>mdi-plus</v-icon>
        <v-tooltip activator="parent" location="bottom">Ajouter une bouteille</v-tooltip>
      </v-btn>
    </template>
  </v-app-bar>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useTheme, useDisplay } from 'vuetify'
import { useLayout } from '@/presentation/composables/useLayout'

const route = useRoute()
const theme = useTheme()
const { mobile } = useDisplay()
const { toggleDrawer } = useLayout()

const currentTitle = computed(() => (route.meta.title as string) ?? 'Ma Cave')
const isDark = computed(() => theme.global.name.value === 'dark')

function toggleTheme() {
  theme.global.name.value = isDark.value ? 'light' : 'dark'
}
</script>
