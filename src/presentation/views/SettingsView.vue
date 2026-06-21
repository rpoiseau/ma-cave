<template>
  <div>
    <h1 class="text-h5 font-weight-bold mb-6">Paramètres</h1>

    <v-card max-width="600">
      <v-card-title class="d-flex align-center gap-2">
        <v-icon color="primary">mdi-calculator-variant</v-icon>
        Estimation des cotes
      </v-card-title>
      <v-card-text>
        <p class="text-body-2 mb-2 text-medium-emphasis">
          Le bouton <strong>Estimer la cote</strong> (onglet Finances d'une bouteille) calcule une
          cote marché <strong>entièrement en local</strong>, à partir des données de référence
          embarquées dans l'application — <strong>aucune connexion ni clé API</strong>.
        </p>
        <p class="text-body-2 mb-0 text-medium-emphasis">
          L'estimation combine le prix marché de l'appellation, le potentiel de garde et l'âge du
          millésime. C'est un ordre de grandeur indicatif : pour une transaction réelle, confirmez
          la cote sur Wine-Searcher ou iDealwine, ou saisissez-la manuellement.
        </p>

        <v-alert type="info" density="compact" variant="tonal" class="mt-4">
          {{ pricedAppellations }} appellations disposent d'un prix marché de référence.
        </v-alert>
      </v-card-text>
    </v-card>

    <!-- Sauvegarde & restauration -->
    <v-card max-width="600" class="mt-6">
      <v-card-title class="d-flex align-center gap-2">
        <v-icon color="primary">mdi-database-arrow-down</v-icon>
        Sauvegarde de la cave
      </v-card-title>
      <v-card-text>
        <p class="text-body-2 mb-4 text-medium-emphasis">
          Vos données sont stockées <strong>uniquement dans ce navigateur</strong> (IndexedDB) —
          aucun serveur. Exportez régulièrement un fichier de sauvegarde pour ne rien perdre,
          ou pour transférer votre cave vers un autre appareil.
        </p>

        <div class="d-flex flex-wrap gap-2">
          <v-btn
            color="primary"
            variant="flat"
            prepend-icon="mdi-download"
            :disabled="bottles.length === 0"
            @click="exportBackup"
          >
            Exporter ({{ bottles.length }})
          </v-btn>
          <v-btn
            variant="outlined"
            color="primary"
            prepend-icon="mdi-upload"
            @click="fileInput?.click()"
          >
            Importer une sauvegarde
          </v-btn>
          <input
            ref="fileInput"
            type="file"
            accept="application/json,.json"
            class="d-none"
            @change="onFileSelected"
          />
        </div>

        <v-alert
          v-if="backupMessage"
          :type="backupError ? 'error' : 'success'"
          density="compact"
          variant="tonal"
          class="mt-4"
        >
          {{ backupMessage }}
        </v-alert>

        <p class="text-caption text-medium-emphasis mt-4 mb-0">
          Format de sauvegarde v{{ backupFormatVersion }} · application v{{ appVersion }}.
          Les anciennes sauvegardes sont migrées automatiquement à l'import.
        </p>
      </v-card-text>
    </v-card>

    <!-- Installer sur le téléphone -->
    <v-card max-width="600" class="mt-6">
      <v-card-title class="d-flex align-center gap-2">
        <v-icon color="primary">mdi-cellphone-arrow-down</v-icon>
        Installer sur le téléphone
      </v-card-title>
      <v-card-text>
        <p class="text-body-2 mb-3 text-medium-emphasis">
          Ma Cave fonctionne comme une application installable, <strong>sans store</strong> et
          <strong>hors-ligne</strong> une fois ajoutée à l'écran d'accueil.
        </p>
        <div class="text-body-2 mb-3">
          <p class="mb-1"><strong>iPhone / iPad (Safari)</strong></p>
          <p class="text-medium-emphasis mb-2">
            Bouton <v-icon size="small">mdi-export-variant</v-icon> Partager →
            « Sur l'écran d'accueil ».
          </p>
          <p class="mb-1"><strong>Android (Chrome)</strong></p>
          <p class="text-medium-emphasis mb-0">
            Menu <v-icon size="small">mdi-dots-vertical</v-icon> →
            « Installer l'application » / « Ajouter à l'écran d'accueil ».
          </p>
        </div>
        <v-alert type="info" density="compact" variant="tonal">
          Vos données restent sur l'appareil. Pensez à exporter une sauvegarde avant de changer
          de téléphone ou de vider le navigateur.
        </v-alert>
      </v-card-text>
    </v-card>

    <!-- Confirmation import -->
    <v-dialog v-model="confirmImport" max-width="460">
      <v-card v-if="pendingBackup">
        <v-card-title>Restaurer cette sauvegarde ?</v-card-title>
        <v-card-text>
          <p class="mb-2">
            Le fichier contient <strong>{{ pendingBackup.bottleCount }}</strong> bouteille(s)
            <span v-if="pendingBackup.exportedAt" class="text-medium-emphasis">
              (export du {{ formatDateTime(pendingBackup.exportedAt) }})
            </span>.
          </p>
          <p class="text-body-2 text-medium-emphasis">
            <strong>Fusionner</strong> ajoute/met à jour les bouteilles sans toucher au reste.
            <strong>Remplacer</strong> efface d'abord toute votre cave actuelle
            ({{ bottles.length }} bouteille(s)).
          </p>
        </v-card-text>
        <v-card-actions>
          <v-btn variant="text" @click="confirmImport = false">Annuler</v-btn>
          <v-spacer />
          <v-btn color="primary" variant="tonal" @click="runImport('merge')">Fusionner</v-btn>
          <v-btn color="error" variant="flat" @click="runImport('replace')">Remplacer</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { APPELLATION_PROFILES } from '@/domain/value-objects/appellations'
import { useCellarStore } from '../stores/cellar.store'
import {
  buildBackup,
  backupFileName,
  parseBackup,
  BACKUP_FORMAT_VERSION,
  APP_VERSION,
  type CaveBackup,
} from '@/application/services/BackupService'

const pricedAppellations = APPELLATION_PROFILES.filter((p) => p.marketPriceEur).length
const backupFormatVersion = BACKUP_FORMAT_VERSION
const appVersion = APP_VERSION

// ─── Sauvegarde & restauration ──────────────────────────────────────────────
const store = useCellarStore()
const { bottles } = storeToRefs(store)

const fileInput = ref<HTMLInputElement | null>(null)
const backupMessage = ref('')
const backupError = ref(false)
const confirmImport = ref(false)
const pendingBackup = ref<CaveBackup | null>(null)

onMounted(() => store.loadAll())

function flash(msg: string, isError = false) {
  backupMessage.value = msg
  backupError.value = isError
  setTimeout(() => { backupMessage.value = '' }, 6000)
}

function exportBackup() {
  const backup = buildBackup(bottles.value)
  const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = backupFileName()
  a.click()
  URL.revokeObjectURL(url)
  flash(`Sauvegarde exportée (${backup.bottleCount} bouteille(s)).`)
}

function onFileSelected(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  input.value = '' // permet de re-sélectionner le même fichier
  if (!file) return

  const reader = new FileReader()
  reader.onload = () => {
    try {
      pendingBackup.value = parseBackup(String(reader.result))
      confirmImport.value = true
    } catch (e) {
      flash((e as Error).message, true)
    }
  }
  reader.onerror = () => flash('Impossible de lire le fichier.', true)
  reader.readAsText(file)
}

async function runImport(mode: 'replace' | 'merge') {
  if (!pendingBackup.value) return
  const count = pendingBackup.value.bottleCount
  try {
    await store.importBottles(pendingBackup.value.bottles, mode)
    flash(
      mode === 'replace'
        ? `Cave remplacée : ${count} bouteille(s) restaurée(s).`
        : `${count} bouteille(s) importée(s).`,
    )
  } catch (e) {
    flash((e as Error).message, true)
  } finally {
    confirmImport.value = false
    pendingBackup.value = null
  }
}

function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString('fr-FR')
}
</script>
