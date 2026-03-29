<template>
  <div>
    <label class="mb-1.5 block text-sm font-medium text-[rgb(var(--color-fg))]">{{ label }}</label>
    <div class="flex items-center gap-3">
      <input
        type="range"
        :min="min"
        :max="max"
        :step="step"
        :value="modelValue"
        class="flex-1 accent-[rgb(var(--color-accent))]"
        @input="onInput"
      />
      <div class="w-20 text-right text-sm font-medium tabular-nums text-[rgb(var(--color-fg))]">
        {{ displayValue }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  modelValue: number
  label: string
  min: number
  max: number
  step: number
  unit: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: number]
}>()

const displayValue = computed(() => `${props.modelValue}${props.unit}`)

const onInput = (e: Event) => {
  emit('update:modelValue', Number((e.target as HTMLInputElement).value))
}
</script>
