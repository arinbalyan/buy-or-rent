<template>
  <div class="card">
    <div class="flex items-center justify-between">
      <p class="text-sm font-medium text-[rgb(var(--color-fg-muted))]">Share</p>
      <button class="btn-ghost text-xs" @click="handleCopy">
        {{ copied ? 'Copied!' : 'Copy Link' }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
const { copyShareUrl } = useShareUrl()
const copied = ref(false)

const handleCopy = async () => {
  const success = await copyShareUrl()
  if (success) {
    copied.value = true
    setTimeout(() => { copied.value = false }, 2000)
  }
}
</script>
