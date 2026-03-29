<template>
  <div class="card">
    <h3 class="mb-4 text-sm font-semibold uppercase tracking-wider text-[rgb(var(--color-fg-muted))]">Insights</h3>
    <div class="space-y-3">
      <InsightCard
        v-for="(insight, index) in result.insights"
        :key="index"
        :insight="insight"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
const { result } = useCalculator()
</script>
