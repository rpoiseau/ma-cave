<template>
  <div class="window-bar-outer">
    <div class="window-bar-track">
      <div :style="fillStyle" />
      <div :style="todayStyle" />
    </div>
    <div class="window-bar-labels">
      <span>{{ scaleStart }}</span>
      <span>{{ scaleEnd }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  drinkFrom: string
  drinkUntil: string
  scaleStart: number
  scaleEnd: number
}>()

const TODAY = new Date().toISOString().slice(0, 10)
const CURRENT_YEAR = new Date().getFullYear()
const span = computed(() => Math.max(props.scaleEnd - props.scaleStart, 1))

function yearPct(year: number) {
  return Math.max(0, Math.min(100, ((year - props.scaleStart) / span.value) * 100))
}

const fromYear = computed(() => parseInt(props.drinkFrom.slice(0, 4)))
const untilYear = computed(() => parseInt(props.drinkUntil.slice(0, 4)))
const left = computed(() => yearPct(fromYear.value))
const width = computed(() => Math.max(2, yearPct(untilYear.value) - left.value))
const todayLeft = computed(() => yearPct(CURRENT_YEAR))

const status = computed(() => {
  if (TODAY > props.drinkUntil) return 'past'
  if (TODAY < props.drinkFrom) return 'upcoming'
  return 'ready'
})

const fillStyle = computed(() => ({
  position: 'absolute' as const,
  left: `${left.value}%`,
  width: `${width.value}%`,
  height: '100%',
  borderRadius: '4px',
  background:
    status.value === 'ready'
      ? 'rgba(var(--v-theme-success), 0.8)'
      : status.value === 'past'
        ? 'rgba(var(--v-theme-error), 0.75)'
        : 'rgba(var(--v-theme-info), 0.75)',
}))

const todayStyle = computed(() => ({
  position: 'absolute' as const,
  left: `calc(${todayLeft.value}% - 1px)`,
  width: '2px',
  height: '220%',
  top: '-60%',
  background: 'rgb(var(--v-theme-on-surface))',
  opacity: '0.35',
  borderRadius: '1px',
}))
</script>

<style scoped>
.window-bar-outer {
  user-select: none;
}
.window-bar-track {
  position: relative;
  height: 8px;
  border-radius: 4px;
  background: rgba(var(--v-theme-on-surface), 0.1);
  overflow: visible;
}
.window-bar-labels {
  display: flex;
  justify-content: space-between;
  font-size: 10px;
  opacity: 0.4;
  margin-top: 2px;
}
</style>
