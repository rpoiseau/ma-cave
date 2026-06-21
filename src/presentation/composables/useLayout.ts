import { ref } from 'vue'

/**
 * État de mise en page partagé entre la barre d'app (hamburger) et la sidebar.
 * Un `ref` module-level suffit : une seule instance de layout dans l'app.
 *
 * Sur desktop la sidebar est `permanent` et ce drawer reste ouvert ; sur mobile
 * elle devient `temporary` et ce drawer pilote l'ouverture/fermeture de l'overlay.
 */
const drawer = ref(true)

export function useLayout() {
  function toggleDrawer() {
    drawer.value = !drawer.value
  }

  return { drawer, toggleDrawer }
}
