<template>
  <div>
    <div class="d-flex align-center gap-3 mb-6">
      <v-btn icon variant="text" @click="goBack">
        <v-icon>mdi-arrow-left</v-icon>
      </v-btn>
      <h1 class="text-h5 font-weight-bold">{{ isEdit ? 'Modifier la bouteille' : 'Ajouter une bouteille' }}</h1>
    </div>

    <v-card max-width="900">
      <v-card-text>
        <BottleForm
          :initial="existingBottle"
          :loading="saving"
          @submit="onSubmit"
          @cancel="goBack"
        />
      </v-card-text>
    </v-card>

    <v-snackbar v-model="snackbar.show" :color="snackbar.color" timeout="4000">
      {{ snackbar.message }}
    </v-snackbar>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useCellarStore } from '../stores/cellar.store'
import BottleForm from '../components/bottle/BottleForm.vue'
import type { CreateBottleDto } from '@/application/dtos/CreateBottleDto'

const props = defineProps<{ id?: string }>()
const router = useRouter()
const store = useCellarStore()

const saving = ref(false)
const snackbar = ref({ show: false, message: '', color: 'error' })

onMounted(() => store.loadAll())

const isEdit = computed(() => !!props.id)
const existingBottle = computed(() => (props.id ? store.getById(props.id) : undefined))

function goBack() {
  if (isEdit.value && props.id) {
    router.push(`/bouteille/${props.id}`)
  } else {
    router.push('/cave')
  }
}

async function onSubmit(dto: CreateBottleDto) {
  saving.value = true
  try {
    if (isEdit.value && props.id) {
      await store.update({ ...dto, id: props.id })
      router.push(`/bouteille/${props.id}`)
    } else {
      const bottle = await store.add(dto)
      router.push(`/bouteille/${bottle.id}`)
    }
  } catch (e) {
    snackbar.value = {
      show: true,
      message: `Erreur : ${(e as Error).message}`,
      color: 'error',
    }
  } finally {
    saving.value = false
  }
}
</script>
