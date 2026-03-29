<template>
  <div class="card animate-slide-up">
    <div class="flex items-start justify-between">
      <div>
        <p class="text-sm font-medium text-[rgb(var(--color-fg-muted))]">Recommendation</p>
        <h2 class="mt-1 text-3xl font-bold" :class="result.verdict === 'buy' ? 'text-buy' : 'text-rent'">
          {{ result.verdict === 'buy' ? 'BUY' : 'RENT' }}
        </h2>
        <p class="mt-1 text-sm text-[rgb(var(--color-fg-muted))]">
          {{ savingsText }}
        </p>
      </div>
      <div class="text-right">
        <p class="text-sm font-medium text-[rgb(var(--color-fg-muted))]">Confidence</p>
        <p class="mt-1 text-2xl font-bold tabular-nums text-[rgb(var(--color-fg))]">{{ result.confidence }}%</p>
      </div>
    </div>

    <div class="mt-4">
      <div class="h-2 overflow-hidden rounded-full bg-[rgb(var(--color-border))]">
        <div
          class="h-full rounded-full transition-all duration-500"
          :class="result.verdict === 'buy' ? 'bg-buy' : 'bg-rent'"
          :style="{ width: `${result.confidence}%` }"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { result } = useCalculator()
const { formatCurrency } = useCurrency()

const savingsText = computed(() => {
  const savings = Math.abs(result.value.comparison.totalSavings)
  const action = result.value.verdict === 'buy' ? 'Buying' : 'Renting'
  return `${action} saves ${formatCurrency(savings)} over the period`
})
</script>
