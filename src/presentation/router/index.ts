import { createRouter, createWebHashHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: { title: 'Tableau de bord' },
    },
    {
      path: '/cave',
      name: 'cellar',
      component: () => import('../views/CellarView.vue'),
      meta: { title: 'Ma Cave' },
    },
    {
      path: '/analytique',
      name: 'analytics',
      component: () => import('../views/AnalyticsView.vue'),
      meta: { title: 'Analyse de la cave' },
    },
    {
      path: '/bouteille/ajouter',
      name: 'add-bottle',
      component: () => import('../views/AddEditBottleView.vue'),
      meta: { title: 'Ajouter une bouteille' },
    },
    {
      path: '/bouteille/:id/modifier',
      name: 'edit-bottle',
      component: () => import('../views/AddEditBottleView.vue'),
      props: true,
      meta: { title: 'Modifier une bouteille' },
    },
    {
      path: '/bouteille/:id',
      name: 'bottle-detail',
      component: () => import('../views/BottleDetailView.vue'),
      props: true,
      meta: { title: 'Détail bouteille' },
    },
    {
      path: '/suggestions',
      name: 'suggestions',
      component: () => import('../views/SuggestionsView.vue'),
      meta: { title: 'Que boire ce soir ?' },
    },
    {
      path: '/conseiller',
      name: 'advisor',
      component: () => import('../views/ConseillerView.vue'),
      meta: { title: 'Conseiller' },
    },
    {
      path: '/journal',
      name: 'journal',
      component: () => import('../views/JournalView.vue'),
      meta: { title: 'Journal de dégustation' },
    },
    {
      path: '/parametres',
      name: 'settings',
      component: () => import('../views/SettingsView.vue'),
      meta: { title: 'Paramètres' },
    },
  ],
})

router.afterEach((to) => {
  document.title = `${to.meta.title ?? 'Ma Cave'} — Ma Cave`
})

export default router
