<template>
  <v-navigation-drawer
    v-model="drawer"
    :rail="rail && !mobile"
    :permanent="!mobile"
    :temporary="mobile"
    color="surface"
  >
    <v-list-item
      prepend-icon="mdi-glass-wine"
      title="Ma Cave"
      nav
      class="py-4"
    >
      <template #append>
        <v-btn
          v-if="!mobile"
          :icon="rail ? 'mdi-chevron-right' : 'mdi-chevron-left'"
          variant="text"
          @click="rail = !rail"
        />
      </template>
    </v-list-item>

    <v-divider />

    <v-list density="compact" nav>
      <v-list-item
        v-for="item in navItems"
        :key="item.to"
        :prepend-icon="item.icon"
        :title="item.label"
        :to="item.to"
        color="primary"
        rounded="lg"
      />
    </v-list>

    <template #append>
      <v-divider />
      <v-list density="compact" nav class="mb-2">
        <v-list-item
          prepend-icon="mdi-plus-circle"
          title="Ajouter une bouteille"
          to="/bouteille/ajouter"
          color="secondary"
          rounded="lg"
        />
      </v-list>
    </template>
  </v-navigation-drawer>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useDisplay } from 'vuetify'
import { useLayout } from '@/presentation/composables/useLayout'

const { mobile } = useDisplay()
const { drawer } = useLayout()
const route = useRoute()
const rail = ref(false)

// Drawer fermé par défaut sur mobile (overlay), ouvert sur desktop.
watch(mobile, (isMobile) => { drawer.value = !isMobile }, { immediate: true })

// Sur mobile, refermer l'overlay après chaque navigation.
watch(
  () => route.fullPath,
  () => {
    if (mobile.value) drawer.value = false
  },
)

const navItems = [
  { label: 'Tableau de bord', icon: 'mdi-view-dashboard', to: '/' },
  { label: 'Ma Cave', icon: 'mdi-bottle-wine', to: '/cave' },
  { label: 'Ce soir ?', icon: 'mdi-glass-wine', to: '/suggestions' },
  { label: 'Conseiller', icon: 'mdi-lightbulb-on', to: '/conseiller' },
  { label: 'Journal', icon: 'mdi-note-text', to: '/journal' },
  { label: 'Analyse', icon: 'mdi-chart-timeline-variant', to: '/analytique' },
  { label: 'Paramètres', icon: 'mdi-cog', to: '/parametres' },
]
</script>
