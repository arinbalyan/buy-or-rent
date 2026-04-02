<template>
  <div class="card">
    <p class="mb-4 text-sm font-medium text-[rgb(var(--color-fg-muted))]">Total Cost Comparison</p>
    <div class="h-56">
      <Bar :data="chartData" :options="chartOptions" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { Bar } from 'vue-chartjs'
import { BarElement, CategoryScale, Chart as ChartJS, Legend, LinearScale, Title, Tooltip } from 'chart.js'
import { formatAxisLabel } from '~/utils/chart-helpers'

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

const { result } = useCalculator()
const { isDark } = useTheme()
const { currentCurrency } = useCurrency()

const chartData = computed(() => ({
  labels: ['Initial Costs', 'Recurring Costs', 'Opportunity Cost', 'Net Proceeds'],
  datasets: [
    {
      label: 'Buying',
      data: [
        result.value.buying.initialCosts,
        result.value.buying.recurringCosts,
        result.value.buying.opportunityCosts,
        -result.value.buying.netProceeds,
      ],
      backgroundColor: 'rgba(34, 197, 94, 0.7)',
      borderRadius: 6,
    },
    {
      label: 'Renting',
      data: [
        result.value.renting.initialCosts,
        result.value.renting.recurringCosts,
        result.value.renting.opportunityCosts,
        -result.value.renting.netProceeds,
      ],
      backgroundColor: 'rgba(59, 130, 246, 0.7)',
      borderRadius: 6,
    },
  ],
}))

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
