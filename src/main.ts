import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { registerSW } from 'virtual:pwa-register'
import App from './App.vue'
import router from './presentation/router'
import vuetify from './plugins/vuetify'

// Service worker : mise à jour automatique en arrière-plan (app installable / hors-ligne).
registerSW({ immediate: true })

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(vuetify)

app.mount('#app')
