<template>
  <div :class="{ dark: isDark }">
    <div class="min-h-screen bg-[rgb(var(--color-bg))] transition-colors duration-300">
      <AppHeader />
      <main class="mx-auto max-w-7xl px-4 pb-16 pt-8 sm:px-6 lg:px-8">
        <NuxtPage />
      </main>
      <AppFooter />
    </div>
  </div>
</template>

<script setup lang="ts">
const isDark = useDark()
</script>
