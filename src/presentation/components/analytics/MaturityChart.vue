<template>
  <div v-if="props.data.length === 0" class="d-flex flex-column align-center justify-center py-12 text-medium-emphasis">
    <v-icon size="56" opacity="0.2" class="mb-3">mdi-chart-bar</v-icon>
    <span>Renseignez les fenêtres de dégustation pour voir la courbe.</span>
  </div>

  <div v-else ref="containerRef" class="position-relative">
    <svg
      ref="svgRef"
      :viewBox="`0 0 ${W} ${H}`"
      style="width: 100%; height: auto; display: block; max-height: 280px;"
      @mousemove="onMouseMove"
      @mouseleave="onMouseLeave"
    >
      <!-- Y grid lines + labels -->
      <g v-for="tick in yTicks" :key="tick.value">
        <line
          :x1="PAD_L" :y1="tick.y"
          :x2="W - PAD_R" :y2="tick.y"
          stroke="currentColor" stroke-opacity="0.1" stroke-width="1"
        />
        <text
          :x="PAD_L - 7" :y="tick.y + 4"
          text-anchor="end" font-size="11" fill="currentColor" opacity="0.5"
        >{{ tick.value }}</text>
      </g>

      <!-- X axis baseline -->
      <line
        :x1="PAD_L" :y1="PAD_T + CHART_H"
        :x2="W - PAD_R" :y2="PAD_T + CHART_H"
        stroke="currentColor" stroke-opacity="0.2" stroke-width="1"
      />

      <!-- Bars + labels -->
      <g v-for="(bucket, i) in props.data" :key="bucket.year">
        <rect
          v-if="bucket.units > 0"
          :x="bx(i)"
          :y="by(bucket.units)"
          :width="BW"
          :height="bh(bucket.units)"
          :fill="hoveredIdx === i ? fillHover(bucket) : fillNormal(bucket)"
          rx="3"
          style="cursor: default;"
        />
        <text
          v-if="bucket.units > 0 && BW >= 16"
          :x="bx(i) + BW / 2"
          :y="by(bucket.units) - 5"
          text-anchor="middle"
          font-size="11"
          fill="currentColor"
          opacity="0.65"
        >{{ bucket.units }}</text>
        <text
          v-if="showXLabel(i)"
          :x="bx(i) + BW / 2"
          :y="H - 7"
          text-anchor="middle"
          font-size="11"
          fill="currentColor"
          :opacity="bucket.isCurrentYear ? '0.9' : '0.5'"
          :font-weight="bucket.isCurrentYear ? '700' : '400'"
        >{{ bucket.year }}</text>
      </g>

      <!-- "Aujourd'hui" label above current year bar -->
      <text
        v-if="todayX !== null"
        :x="todayX" :y="PAD_T - 6"
        text-anchor="middle"
        font-size="10"
        fill="#C2185B"
        opacity="0.85"
      >Aujourd'hui</text>
    </svg>

    <!-- Hover tooltip -->
    <div
      v-if="tooltip"
      class="position-absolute rounded pa-2 text-caption elevation-4"
      style="pointer-events: none; white-space: nowrap; z-index: 20; transform: translate(-50%, -115%); background: rgba(30,30,30,0.9); color: #fff;"
      :style="{ left: `${tooltip.x}px`, top: `${tooltip.y}px` }"
    >
      <strong>{{ tooltip.bucket.year }}</strong><br>
      {{ tooltip.bucket.units }} bouteille{{ tooltip.bucket.units !== 1 ? 's' : '' }} en fenêtre
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { MaturityBucket } from '@/presentation/stores/cellar.store'

const props = defineProps<{ data: MaturityBucket[] }>()

const svgRef = ref<SVGSVGElement | null>(null)
const containerRef = ref<HTMLElement | null>(null)
const hoveredIdx = ref<number | null>(null)
const tooltip = ref<{ bucket: MaturityBucket; x: number; y: number } | null>(null)

const W = 800
const H = 240
const PAD_L = 44
const PAD_R = 16
const PAD_T = 26
const PAD_B = 38
const CHART_W = W - PAD_L - PAD_R
const CHART_H = H - PAD_T - PAD_B

const n = computed(() => props.data.length)
const maxUnits = computed(() => Math.max(...props.data.map((d) => d.units), 1))
const BW = computed(() => Math.max(CHART_W / n.value - 5, 4))

const bx = (i: number) => PAD_L + (i + 0.5) * (CHART_W / n.value) - BW.value / 2
const bh = (units: number) => Math.max((units / maxUnits.value) * CHART_H, 1)
const by = (units: number) => PAD_T + CHART_H - bh(units)

const yTicks = computed(() => {
  const max = maxUnits.value
  const step = max <= 5 ? 1 : max <= 20 ? Math.ceil(max / 4) : Math.ceil(max / 5 / 5) * 5
  const ticks: { value: number; y: number }[] = []
  for (let v = 0; v <= max; v += step) {
    ticks.push({ value: v, y: PAD_T + CHART_H * (1 - v / max) })
  }
  return ticks
})

const xLabelEvery = computed(() => (n.value <= 12 ? 1 : n.value <= 22 ? 2 : 5))
const showXLabel = (i: number) => i % xLabelEvery.value === 0

const todayX = computed(() => {
  const idx = props.data.findIndex((d) => d.isCurrentYear)
  return idx === -1 ? null : bx(idx) + BW.value / 2
})

const fillNormal = (b: MaturityBucket) =>
  b.isCurrentYear ? '#7B1FA2' : 'rgba(123,31,162,0.38)'
const fillHover = (b: MaturityBucket) =>
  b.isCurrentYear ? '#5E1284' : 'rgba(123,31,162,0.62)'

function onMouseMove(event: MouseEvent) {
  const svg = svgRef.value!
  const container = containerRef.value!
  const svgRect = svg.getBoundingClientRect()
  const containerRect = container.getBoundingClientRect()
  const svgX = ((event.clientX - svgRect.left) / svgRect.width) * W
  const idx = Math.floor((svgX - PAD_L) / (CHART_W / n.value))

  if (idx >= 0 && idx < n.value && svgX >= PAD_L) {
    hoveredIdx.value = idx
    tooltip.value = {
      bucket: props.data[idx],
      x: event.clientX - containerRect.left,
      y: event.clientY - containerRect.top,
    }
  } else {
    onMouseLeave()
  }
}

function onMouseLeave() {
  hoveredIdx.value = null
  tooltip.value = null
}
</script>
