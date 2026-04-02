import { vi } from 'vitest'

// Mock Nuxt auto-imported globals
const stateStore = new Map<string, { value: unknown }>()

// eslint-disable-next-line @typescript-eslint/no-explicit-any
;(globalThis as any).useState = vi.fn(<T>(key: string, init: () => T) => {
  if (!stateStore.has(key)) {
    stateStore.set(key, { value: init() })
  }
  return stateStore.get(key)!
})

// eslint-disable-next-line @typescript-eslint/no-explicit-any
;(globalThis as any).computed = vi.fn(<T>(fn: () => T) => ({
  get value(): T {
    return fn()
  },
}))

// eslint-disable-next-line @typescript-eslint/no-explicit-any
;(globalThis as any).ref = vi.fn(<T>(value: T) => ({ value }))

// Helper to reset state between tests
export function resetNuxtMocks() {
  stateStore.clear()
  vi.clearAllMocks()
}
