<template>
  <div class="card">
    <p class="mb-4 text-sm font-medium text-[rgb(var(--color-fg-muted))]">Monthly Cash Flow</p>
    <div class="h-56">
      <Line :data="chartData" :options="chartOptions" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { Line } from 'vue-chartjs'
import { CategoryScale, Chart as ChartJS, Legend, LinearScale, LineElement, PointElement, Title, Tooltip } from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, LineElement, PointElement, CategoryScale, LinearScale)

const { result, inputs } = useCalculator()
const { isDark } = useTheme()

const chartData = computed(() => {
  const months = inputs.value.holdingPeriodYears * 12
  const labels: string[] = []
  for (let y = 1; y <= inputs.value.holdingPeriodYears; y++) labels.push(`Year ${y}`)

  const buyingYearly: number[] = []
  const rentingYearly: number[] = []

  for (let y = 0; y < inputs.value.holdingPeriodYears; y++) {
    const startMonth = y * 12
    const endMonth = Math.min(startMonth + 12, months)
    let buySum = 0
    let rentSum = 0
    for (let m = startMonth; m < endMonth; m++) {
      buySum += result.value.buying.monthlyPayments[m] ?? 0
      rentSum += result.value.renting.monthlyPayments[m] ?? 0
    }
    buyingYearly.push(buySum / (endMonth - startMonth))
    rentingYearly.push(rentSum / (endMonth - startMonth))
  }

  return {
    labels,
    datasets: [
      {
        label: 'Buying',
        data: buyingYearly,
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        fill: true,
        tension: 0.3,
      },
      {
        label: 'Renting',
        data: rentingYearly,
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
        callback: (value: number | string) => {
          const v = Number(value)
          if (Math.abs(v) >= 1e6) return `$${(v / 1e6).toFixed(0)}M`
          if (Math.abs(v) >= 1e3) return `$${(v / 1e3).toFixed(0)}K`
          return `$${v}`
        },
      },
      grid: { color: isDark.value ? '#374151' : '#e5e7eb' },
    },
  },
}))
</script>
