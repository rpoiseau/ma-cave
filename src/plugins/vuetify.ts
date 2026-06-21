import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.css'
import { createVuetify } from 'vuetify'
import { fr } from 'vuetify/locale'

export default createVuetify({
  locale: {
    locale: 'fr',
    messages: { fr },
  },
  theme: {
    defaultTheme: 'light',
    themes: {
      light: {
        colors: {
          primary: '#7B1FA2',
          secondary: '#C2185B',
          accent: '#E91E63',
          background: '#FAFAFA',
          surface: '#FFFFFF',
          'on-primary': '#FFFFFF',
        },
      },
      dark: {
        colors: {
          primary: '#CE93D8',
          secondary: '#F48FB1',
          background: '#121212',
          surface: '#1E1E1E',
        },
      },
    },
  },
  defaults: {
    VBtn: { variant: 'elevated' },
    VCard: { elevation: 2 },
  },
})
