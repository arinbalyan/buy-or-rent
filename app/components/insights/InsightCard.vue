<template>
  <div class="flex items-start gap-3 rounded-lg p-3 transition-colors hover:bg-[rgb(var(--color-bg))]" :class="severityClass">
    <span class="mt-0.5 text-lg">{{ insight.icon }}</span>
    <div class="flex-1">
      <p class="text-sm font-medium text-[rgb(var(--color-fg))]">{{ insight.title }}</p>
      <p class="mt-0.5 text-xs text-[rgb(var(--color-fg-muted))]">{{ insight.description }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Insight } from '~/types/calculator'

const props = defineProps<{
  insight: Insight
}>()

const severityClass = computed(() => {
  switch (props.insight.severity) {
    case 'positive': return 'border-l-2 border-l-buy'
    case 'negative': return 'border-l-2 border-l-rent'
    case 'warning': return 'border-l-2 border-l-yellow-500'
    default: return ''
  }
})
</script>
