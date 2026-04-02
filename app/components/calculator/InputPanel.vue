<template>
  <div class="space-y-6">
    <div class="card">
      <h2 class="mb-4 text-sm font-semibold uppercase tracking-wider text-[rgb(var(--color-fg-muted))]">Property Details</h2>

      <div class="space-y-5">
        <div>
          <label class="mb-1.5 block text-sm font-medium text-[rgb(var(--color-fg))]">Purchase Price</label>
          <div class="relative">
            <span class="absolute left-3 top-1/2 -translate-y-1/2 text-[rgb(var(--color-fg-muted))]">{{ currentCurrency.symbol }}</span>
            <input
              type="text"
              class="input-field pl-8"
              :value="formatNumber(inputs.propertyPrice)"
              @input="onPriceInput($event)"
            />
          </div>
          <input
            type="range"
            min="50000"
            max="5000000"
            step="10000"
            :value="inputs.propertyPrice"
            class="mt-2 w-full accent-[rgb(var(--color-accent))]"
            @input="inputs.propertyPrice = Number(($event.target as HTMLInputElement).value)"
          />
          <div class="mt-1 flex justify-between text-xs text-[rgb(var(--color-fg-muted))]">
            <span>{{ formatCurrency(50000) }}</span>
            <span>{{ formatCurrency(5000000) }}</span>
          </div>
        </div>

        <div>
          <label class="mb-1.5 block text-sm font-medium text-[rgb(var(--color-fg))]">Monthly Rent</label>
          <div class="relative">
            <span class="absolute left-3 top-1/2 -translate-y-1/2 text-[rgb(var(--color-fg-muted))]">{{ currentCurrency.symbol }}</span>
            <input
              type="text"
              class="input-field pl-8"
              :value="formatNumber(inputs.monthlyRent)"
              @input="onRentInput($event)"
            />
          </div>
          <input
            type="range"
            min="500"
            max="20000"
            step="100"
            :value="inputs.monthlyRent"
            class="mt-2 w-full accent-[rgb(var(--color-accent))]"
            @input="inputs.monthlyRent = Number(($event.target as HTMLInputElement).value)"
          />
          <div class="mt-1 flex justify-between text-xs text-[rgb(var(--color-fg-muted))]">
            <span>{{ formatCurrency(500) }}</span>
            <span>{{ formatCurrency(20000) }}</span>
          </div>
        </div>
      </div>
    </div>

    <div class="card">
      <button
        class="flex w-full items-center justify-between text-sm font-semibold uppercase tracking-wider text-[rgb(var(--color-fg-muted))]"
        @click="showAdvanced = !showAdvanced"
      >
        <span>Advanced Options</span>
        <svg
          class="h-4 w-4 transition-transform"
          :class="{ 'rotate-180': showAdvanced }"
          fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"
        >
          <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      <div v-if="showAdvanced" class="mt-4 space-y-4 animate-fade-in">
        <SliderInput v-model="inputs.downPaymentPercent" label="Down Payment" :min="0" :max="100" :step="1" unit="%" />
        <SliderInput v-model="inputs.mortgageRate" label="Mortgage Rate" :min="0" :max="15" :step="0.25" unit="%" />
        <SliderInput v-model="inputs.mortgageTermYears" label="Mortgage Term" :min="5" :max="40" :step="5" unit=" yrs" />
        <SliderInput v-model="inputs.holdingPeriodYears" label="How Long to Stay" :min="1" :max="40" :step="1" unit=" yrs" />
        <SliderInput v-model="inputs.propertyTaxRate" label="Property Tax Rate" :min="0" :max="5" :step="0.1" unit="%" />
        <SliderInput v-model="inputs.homeAppreciationRate" label="Home Appreciation" :min="-5" :max="15" :step="0.5" unit="%" />
        <SliderInput v-model="inputs.rentIncreaseRate" label="Rent Increase" :min="0" :max="15" :step="0.5" unit="%" />
        <SliderInput v-model="inputs.investmentReturnRate" label="Investment Return" :min="0" :max="20" :step="0.5" unit="%" />
        <SliderInput v-model="inputs.buyingClosingCostPercent" label="Buying Closing Costs" :min="0" :max="10" :step="0.5" unit="%" />
        <SliderInput v-model="inputs.sellingClosingCostPercent" label="Selling Closing Costs" :min="0" :max="10" :step="0.5" unit="%" />
        <SliderInput v-model="inputs.maintenanceCostPercent" label="Maintenance" :min="0" :max="5" :step="0.25" unit="%" />
        <SliderInput v-model="inputs.insurancePercent" label="Insurance" :min="0" :max="3" :step="0.1" unit="%" />

        <div>
          <label class="mb-1.5 block text-sm font-medium text-[rgb(var(--color-fg))]">Monthly HOA Fees</label>
          <div class="relative">
            <span class="absolute left-3 top-1/2 -translate-y-1/2 text-[rgb(var(--color-fg-muted))]">{{ currentCurrency.symbol }}</span>
            <input
              type="number"
              class="input-field pl-8"
              :value="inputs.monthlyHoaFees"
              min="0"
              @input="inputs.monthlyHoaFees = Number(($event.target as HTMLInputElement).value)"
            />
          </div>
        </div>

        <button class="btn-ghost w-full text-sm" @click="resetDefaults">Reset to Defaults</button>
      </div>
    </div>

    <div class="flex items-center justify-between">
      <CurrencySelector />
      <ShareButton />
    </div>
  </div>
</template>

<script setup lang="ts">
import { DEFAULT_INPUTS } from '~/types/calculator'

const { inputs } = useCalculator()
const { currentCurrency, formatCurrency } = useCurrency()
const showAdvanced = ref(false)

const formatNumber = (n: number) => n.toLocaleString('en-US')

const onPriceInput = (e: Event) => {
  const val = (e.target as HTMLInputElement).value.replace(/[^0-9]/g, '')
  inputs.value.propertyPrice = Math.max(0, Math.min(50000000, Number(val) || 0))
}

const onRentInput = (e: Event) => {
  const val = (e.target as HTMLInputElement).value.replace(/[^0-9]/g, '')
  inputs.value.monthlyRent = Math.max(0, Math.min(100000, Number(val) || 0))
}

const resetDefaults = () => {
  const currentCurrency = inputs.value.currency
  inputs.value = { ...DEFAULT_INPUTS, currency: currentCurrency }
}
</script>
