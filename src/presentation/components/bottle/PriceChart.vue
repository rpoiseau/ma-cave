<template>
  <div ref="containerRef" class="position-relative">
    <svg
      ref="svgRef"
      :viewBox="`0 0 ${W} ${H}`"
      style="width: 100%; height: auto; display: block; max-height: 180px;"
      @mousemove="onMouseMove"
      @mouseleave="tooltip = null"
    >
      <defs>
        <linearGradient id="priceAreaGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="rgba(123,31,162,0.25)" />
          <stop offset="100%" stop-color="rgba(123,31,162,0)" />
        </linearGradient>
      </defs>

      <!-- Y grid + labels -->
      <g v-for="tick in yTicks" :key="tick.value">
        <line
          :x1="PAD_L" :y1="tick.y" :x2="W - PAD_R" :y2="tick.y"
          stroke="currentColor" stroke-opacity="0.1" stroke-width="1"
        />
        <text
          :x="PAD_L - 6" :y="tick.y + 4"
          text-anchor="end" font-size="11" fill="currentColor" opacity="0.5"
        >{{ tick.value.toFixed(0) }} €</text>
      </g>

      <!-- Purchase price baseline -->
      <line
        v-if="purchasePrice"
        :x1="PAD_L" :y1="py(purchasePrice)"
        :x2="W - PAD_R" :y2="py(purchasePrice)"
        stroke="currentColor" stroke-opacity="0.35" stroke-width="1.5" stroke-dasharray="5 3"
      />
      <text
        v-if="purchasePrice"
        :x="W - PAD_R + 4" :y="py(purchasePrice) + 4"
        font-size="10" fill="currentColor" opacity="0.45"
      >achat</text>

      <!-- Area fill (only with 2+ points) -->
      <path
        v-if="sorted.length >= 2"
        :d="areaPath"
        fill="url(#priceAreaGrad)"
      />

      <!-- Line (only with 2+ points) -->
      <polyline
        v-if="sorted.length >= 2"
        :points="linePoints"
        fill="none"
        stroke="#7B1FA2"
        stroke-width="2"
        stroke-linejoin="round"
        stroke-linecap="round"
      />

      <!-- Data points -->
      <circle
        v-for="(point, i) in sorted"
        :key="i"
        :cx="px(point.date)"
        :cy="py(point.price)"
        :r="hoveredIndex === i ? 6 : 4"
        fill="#7B1FA2"
        stroke="white"
        stroke-width="2"
        style="cursor: default; transition: r 0.1s;"
      />

      <!-- X axis date labels -->
      <text
        v-for="(point, i) in sorted"
        :key="`xl-${i}`"
        :x="px(point.date)"
        :y="H - 5"
        text-anchor="middle"
        font-size="10"
        fill="currentColor"
        opacity="0.5"
      >{{ formatDateShort(point.date) }}</text>
    </svg>

    <!-- Tooltip -->
    <div
      v-if="tooltip"
      class="position-absolute rounded pa-2 text-caption elevation-4"
      style="pointer-events: none; white-space: nowrap; z-index: 20; transform: translate(-50%, -115%); background: rgba(30,30,30,0.9); color: #fff;"
      :style="{ left: `${tooltip.x}px`, top: `${tooltip.y}px` }"
    >
      <strong>{{ tooltip.price.toFixed(2) }} €</strong><br>
      {{ formatDateLong(tooltip.date) }}
      <span v-if="tooltip.source" class="d-block opacity-70">{{ tooltip.source }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { PricePoint } from '@/domain/entities/Bottle'

const props = defineProps<{
  priceHistory: PricePoint[]
  purchasePrice?: number
  purchaseDate: string
}>()

const svgRef = ref<SVGSVGElement | null>(null)
const containerRef = ref<HTMLElement | null>(null)
const hoveredIndex = ref<number | null>(null)
const tooltip = ref<{ x: number; y: number; price: number; date: string; source?: string } | null>(null)

const W = 600
const H = 170
const PAD_L = 52
const PAD_R = 40
const PAD_T = 16
const PAD_B = 28
const CHART_W = W - PAD_L - PAD_R
const CHART_H = H - PAD_T - PAD_B

const sorted = computed(() =>
  [...props.priceHistory].sort((a, b) => a.date.localeCompare(b.date)),
)

const allPrices = computed(() => {
  const prices = sorted.value.map((p) => p.price)
  if (props.purchasePrice) prices.push(props.purchasePrice)
  return prices
})

const xMinMs = computed(() => new Date(props.purchaseDate).getTime())
const xMaxMs = computed(() => {
  const lastPointMs = sorted.value.length
    ? new Date(sorted.value[sorted.value.length - 1].date).getTime()
    : 0
  return Math.max(lastPointMs, Date.now())
})
const xRangeMs = computed(() => Math.max(xMaxMs.value - xMinMs.value, 1))

const yMin = computed(() => Math.min(...allPrices.value) * 0.85)
const yMax = computed(() => Math.max(...allPrices.value) * 1.15)
const yRange = computed(() => Math.max(yMax.value - yMin.value, 1))

function px(dateStr: string): number {
  const t = new Date(dateStr).getTime()
  return PAD_L + ((t - xMinMs.value) / xRangeMs.value) * CHART_W
}

function py(price: number): number {
  return PAD_T + CHART_H * (1 - (price - yMin.value) / yRange.value)
}

const linePoints = computed(() =>
  sorted.value.map((p) => `${px(p.date)},${py(p.price)}`).join(' '),
)

const areaPath = computed(() => {
  if (sorted.value.length < 2) return ''
  const pts = sorted.value.map((p) => `${px(p.date)},${py(p.price)}`).join(' L ')
  const firstX = px(sorted.value[0].date)
  const lastX = px(sorted.value[sorted.value.length - 1].date)
  const baseline = PAD_T + CHART_H
  return `M ${firstX},${baseline} L ${pts} L ${lastX},${baseline} Z`
})

const yTicks = computed(() => {
  const range = yRange.value
  const step =
    range < 10 ? 2 : range < 50 ? 10 : range < 200 ? 25 : range < 500 ? 50 : 100
  const ticks: { value: number; y: number }[] = []
  const first = Math.ceil(yMin.value / step) * step
  for (let v = first; v <= yMax.value; v += step) {
    ticks.push({ value: v, y: py(v) })
  }
  return ticks
})

function formatDateShort(iso: string) {
  return new Date(iso).toLocaleDateString('fr-FR', { month: 'short', year: '2-digit' })
}

function formatDateLong(iso: string) {
  return new Date(iso).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
}

function onMouseMove(event: MouseEvent) {
  const svg = svgRef.value!
  const container = containerRef.value!
  const svgRect = svg.getBoundingClientRect()
  const containerRect = container.getBoundingClientRect()
  const scaleX = W / svgRect.width
  const svgMouseX = (event.clientX - svgRect.left) * scaleX

  let nearest: { idx: number; dist: number } | null = null
  sorted.value.forEach((p, i) => {
    const dist = Math.abs(px(p.date) - svgMouseX)
    if (!nearest || dist < nearest.dist) nearest = { idx: i, dist }
  })

  if (nearest && nearest.dist < 35) {
    const pt = sorted.value[nearest.idx]
    hoveredIndex.value = nearest.idx
    tooltip.value = {
      x: event.clientX - containerRect.left,
      y: event.clientY - containerRect.top,
      price: pt.price,
      date: pt.date,
      source: pt.source,
    }
  } else {
    hoveredIndex.value = null
    tooltip.value = null
  }
}
</script>
