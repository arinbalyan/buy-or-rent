<template>
  <div class="relative">
    <button
      class="btn-ghost flex items-center gap-2 text-sm"
      @click="isOpen = !isOpen"
    >
      <span>{{ currentCurrency.flag }}</span>
      <span class="font-medium">{{ selectedCurrency }}</span>
      <svg class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
      </svg>
    </button>

    <div
      v-if="isOpen"
      class="absolute right-0 top-full z-50 mt-2 w-72 rounded-xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-bg-card))] p-2 shadow-xl animate-fade-in"
    >
      <input
        ref="searchInput"
        v-model="search"
        type="text"
        placeholder="Search currencies..."
        class="input-field mb-2 text-sm"
      />
      <div class="max-h-64 overflow-y-auto">
        <button
          v-for="currency in filteredCurrencies"
          :key="currency.code"
          class="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm transition-colors hover:bg-[rgb(var(--color-accent))]/10"
          :class="{ 'bg-[rgb(var(--color-accent))]/10': currency.code === selectedCurrency }"
          @click="selectCurrency(currency.code)"
        >
          <span>{{ currency.flag }}</span>
          <span class="flex-1 font-medium">{{ currency.code }}</span>
          <span class="text-[rgb(var(--color-fg-muted))]">{{ currency.name }}</span>
        </button>
      </div>
    </div>

    <div v-if="isOpen" class="fixed inset-0 z-40" @click="isOpen = false" />
  </div>
</template>

<script setup lang="ts">
const { selectedCurrency, currencies, currentCurrency } = useCurrency()
const isOpen = ref(false)
const search = ref('')
const searchInput = ref<HTMLInputElement>()

const filteredCurrencies = computed(() => {
  if (!search.value) return currencies
  const q = search.value.toLowerCase()
  return currencies.filter(c =>
    c.code.toLowerCase().includes(q) || c.name.toLowerCase().includes(q),
  )
})

watch(isOpen, (open) => {
  if (open) {
    nextTick(() => searchInput.value?.focus())
  } else {
    search.value = ''
  }
})

const selectCurrency = (code: string) => {
  selectedCurrency.value = code
  isOpen.value = false
}
</script>
