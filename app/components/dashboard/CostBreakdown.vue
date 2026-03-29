<template>
  <div class="card">
    <p class="mb-4 text-sm font-medium text-[rgb(var(--color-fg-muted))]">Cost Breakdown</p>
    <div class="grid grid-cols-2 gap-4">
      <div>
        <p class="mb-2 text-center text-xs font-medium text-buy">Buying</p>
        <div class="h-40">
          <Doughnut :data="buyingData" :options="chartOptions" />
        </div>
      </div>
      <div>
        <p class="mb-2 text-center text-xs font-medium text-rent">Renting</p>
        <div class="h-40">
          <Doughnut :data="rentingData" :options="chartOptions" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Doughnut } from 'vue-chartjs'
import { ArcElement, Chart as ChartJS, Legend, Tooltip } from 'chart.js'

ChartJS.register(ArcElement, Tooltip, Legend)

const { result } = useCalculator()
const { isDark } = useTheme()

const buyingData = computed(() => ({
  labels: ['Initial', 'Recurring', 'Opportunity', 'Proceeds (saved)'],
  datasets: [{
    data: [
      result.value.buying.initialCosts,
      result.value.buying.recurringCosts,
      result.value.buying.opportunityCosts,
      result.value.buying.netProceeds,
    ],
    backgroundColor: [
      'rgba(34, 197, 94, 0.9)',
      'rgba(34, 197, 94, 0.6)',
      'rgba(34, 197, 94, 0.3)',
      'rgba(34, 197, 94, 0.15)',
    ],
    borderWidth: 0,
  }],
}))

const rentingData = computed(() => ({
  labels: ['Initial', 'Recurring', 'Opportunity', 'Deposit Return'],
  datasets: [{
    data: [
      result.value.renting.initialCosts,
      result.value.renting.recurringCosts,
      result.value.renting.opportunityCosts,
      result.value.renting.netProceeds,
    ],
    backgroundColor: [
      'rgba(59, 130, 246, 0.9)',
      'rgba(59, 130, 246, 0.6)',
      'rgba(59, 130, 246, 0.3)',
      'rgba(59, 130, 246, 0.15)',
    ],
    borderWidth: 0,
  }],
}))

const chartOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      callbacks: {
        label: (ctx: any) => {
          const v = ctx.raw as number
          if (Math.abs(v) >= 1e6) return `$${(v / 1e6).toFixed(1)}M`
          if (Math.abs(v) >= 1e3) return `$${(v / 1e3).toFixed(0)}K`
          return `$${v.toFixed(0)}`
        },
      },
    },
  },
  cutout: '60%',
}))
</script>
