<template>
  <header class="sticky top-0 z-50 border-b border-[rgb(var(--color-border))] bg-[rgb(var(--color-bg))]/90 backdrop-blur-xl">
    <div class="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
      <div class="flex items-center gap-3">
        <div class="flex h-9 w-9 items-center justify-center rounded-lg bg-[rgb(var(--color-accent))] text-white">
          <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 2v20" />
            <path d="M2 7l10-5 10 5" />
            <path d="M5 10l7-3 7 3" />
            <path d="M2 17l10 5 10-5" />
            <path d="M5 14l7 3 7-3" />
            <circle cx="12" cy="12" r="1.5" fill="currentColor" />
          </svg>
        </div>
        <div>
          <h1 class="text-lg font-bold tracking-tight text-[rgb(var(--color-fg))]">Buy or Rent</h1>
          <p class="text-xs text-[rgb(var(--color-fg-muted))]">Property Decision Calculator</p>
        </div>
      </div>

      <div class="flex items-center gap-3">
        <slot name="currency-selector" />
        <button
          class="btn-ghost h-9 w-9 rounded-lg p-0"
          :title="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
          @click="toggleDark()"
        >
          <svg v-if="isDark" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
          <svg v-else class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
          </svg>
        </button>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
const { isDark, toggleDark } = useTheme()
</script>
