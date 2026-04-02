import type { CalculatorInputs } from '~/types/calculator'
import { DEFAULT_INPUTS } from '~/types/calculator'
import { CURRENCIES } from '~/composables/useCurrency'

const PARAM_MAP: Record<string, keyof CalculatorInputs> = {
  p: 'propertyPrice',
  r: 'monthlyRent',
  c: 'currency',
  dp: 'downPaymentPercent',
  rate: 'mortgageRate',
  term: 'mortgageTermYears',
  stay: 'holdingPeriodYears',
  ptax: 'propertyTaxRate',
  app: 'homeAppreciationRate',
  ri: 'rentIncreaseRate',
  inv: 'investmentReturnRate',
  ccbuy: 'buyingClosingCostPercent',
  ccsell: 'sellingClosingCostPercent',
  maint: 'maintenanceCostPercent',
  ins: 'insurancePercent',
  hoa: 'monthlyHoaFees',
  tax: 'taxRate',
  rins: 'renterInsurancePercent',
}

export function useShareUrl() {
  const inputs = useState<CalculatorInputs>('calculatorInputs')

  const encodeToUrl = (): string => {
    const params = new URLSearchParams()
    for (const [shortKey, longKey] of Object.entries(PARAM_MAP)) {
      const value = inputs.value[longKey]
      if (value !== DEFAULT_INPUTS[longKey]) {
        params.set(shortKey, String(value))
      }
    }
    return `${window.location.origin}${window.location.pathname}?${params.toString()}`
  }

  const decodeFromUrl = () => {
    if (import.meta.server) return

    const params = new URLSearchParams(window.location.search)
    if (params.size === 0) return

    const updates: Partial<CalculatorInputs> = {}
    const validCurrencyCodes = new Set(CURRENCIES.map(currency => currency.code))
    for (const [shortKey, longKey] of Object.entries(PARAM_MAP)) {
      const value = params.get(shortKey)
      if (value !== null) {
        if (longKey === 'currency') {
          if (validCurrencyCodes.has(value)) {
            (updates as any)[longKey] = value
          }
          continue
        }

        const parsed = Number.parseFloat(value)
        if (Number.isFinite(parsed)) {
          (updates as any)[longKey] = parsed
        }
      }
    }

    if (Object.keys(updates).length > 0) {
      inputs.value = { ...inputs.value, ...updates }
    }
  }

  const copyShareUrl = async (): Promise<boolean> => {
    try {
      await navigator.clipboard.writeText(encodeToUrl())
      return true
    } catch {
      return false
    }
  }

  onMounted(() => decodeFromUrl())

  return { encodeToUrl, decodeFromUrl, copyShareUrl }
}
