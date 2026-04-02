<template>
  <div class="card">
    <p class="mb-4 text-sm font-medium text-[rgb(var(--color-fg-muted))]">Net Worth Projection</p>
    <div class="h-56">
      <Line :data="chartData" :options="chartOptions" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { Line } from 'vue-chartjs'
import { CategoryScale, Chart as ChartJS, Filler, Legend, LinearScale, LineElement, PointElement, Title, Tooltip } from 'chart.js'
import { formatAxisLabel } from '~/utils/format'

ChartJS.register(Title, Tooltip, Legend, LineElement, PointElement, CategoryScale, LinearScale, Filler)

const { result, inputs } = useCalculator()
const { isDark } = useTheme()
const { currentCurrency } = useCurrency()

const chartData = computed(() => {
  const labels: string[] = []
  for (let y = 1; y <= inputs.value.holdingPeriodYears; y++) labels.push(`Year ${y}`)

  return {
    labels,
    datasets: [
      {
        label: 'Buying Equity',
        data: result.value.buying.equityBuilt,
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        fill: true,
        tension: 0.3,
      },
      {
        label: 'Invested Savings',
        data: result.value.renting.investedSavings,
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        fill: true,
        tension: 0.3,
      },
    ],
  }
})

const chartOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'bottom' as const,
      labels: { color: isDark.value ? '#e2e8f0' : '#374151' },
    },
  },
  scales: {
    x: {
      ticks: { color: isDark.value ? '#9ca3af' : '#6b7280' },
      grid: { display: false },
    },
    y: {
      ticks: {
        color: isDark.value ? '#9ca3af' : '#6b7280',
        callback: (value: number | string) => formatAxisLabel(value, currentCurrency.value.symbol),
      },
      grid: { color: isDark.value ? '#374151' : '#e5e7eb' },
    },
  },
}))
</script>
