import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vuetify from 'vite-plugin-vuetify'
import { VitePWA } from 'vite-plugin-pwa'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  // Base relative : le dist/ fonctionne ouvert en local ou servi depuis un
  // sous-dossier (cohérent avec le hash-router, sans dépendance serveur).
  base: './',
  plugins: [
    vue(),
    vuetify({ autoImport: true }),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['wine-glass.svg', 'apple-touch-icon.png'],
      manifest: {
        name: 'Ma Cave',
        short_name: 'Ma Cave',
        description: 'Gérez votre cave à vins et spiritueux — 100 % local, hors-ligne.',
        lang: 'fr',
        display: 'standalone',
        orientation: 'portrait',
        theme_color: '#7B1FA2',
        background_color: '#121212',
        start_url: '.',
        scope: '.',
        icons: [
          { src: 'pwa-192x192.png', sizes: '192x192', type: 'image/png' },
          { src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png' },
          { src: 'maskable-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,woff,woff2,ttf,eot}'],
        // Toutes les routes passent par index.html (hash-router) → fallback offline.
        navigateFallback: 'index.html',
      },
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
