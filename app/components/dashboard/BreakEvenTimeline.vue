<template>
  <div class="card">
    <p class="text-sm font-medium text-[rgb(var(--color-fg-muted))]">Break-Even Timeline</p>

    <div class="mt-3">
      <div class="relative h-4 overflow-hidden rounded-full bg-[rgb(var(--color-border))]">
        <div
          v-if="result.breakEvenYears !== null"
          class="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-rent to-buy"
          :style="{ width: `${breakEvenPercent}%` }"
        />
        <div
          v-if="result.breakEvenYears !== null"
          class="absolute top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-[rgb(var(--color-fg))] shadow-md"
          :style="{ left: `${breakEvenPercent}%` }"
        />
      </div>

      <div class="mt-2 flex justify-between text-xs text-[rgb(var(--color-fg-muted))]">
        <span>Rent better</span>
        <span v-if="result.breakEvenYears !== null" class="font-medium text-[rgb(var(--color-fg))]">
          Break-even: {{ result.breakEvenYears.toFixed(1) }} years
        </span>
        <span v-else class="font-medium text-rent">No break-even in this period</span>
        <span>Buy better</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { result } = useCalculator()
const { inputs } = useCalculator()

const breakEvenPercent = computed(() => {
  if (result.value.breakEvenYears === null) return 0
  return Math.min(100, (result.value.breakEvenYears / inputs.value.holdingPeriodYears) * 100)
})
</script>
