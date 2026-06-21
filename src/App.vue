<template>
  <v-app>
    <AppSidebar />
    <AppNavbar />
    <v-main>
      <v-container fluid class="pa-4 pa-md-6">
        <RouterView />
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import AppSidebar from '@/presentation/components/layout/AppSidebar.vue'
import AppNavbar from '@/presentation/components/layout/AppNavbar.vue'
</script>
