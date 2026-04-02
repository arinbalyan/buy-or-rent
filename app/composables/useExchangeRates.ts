import type { ExchangeRates } from '~/types/currency'

const FALLBACK_RATES: Record<string, number> = {
  USD: 1, EUR: 0.92, GBP: 0.79, JPY: 149.5, CNY: 7.24,
  INR: 83.12, AUD: 1.53, CAD: 1.36, CHF: 0.88, KRW: 1325,
  BRL: 4.97, MXN: 17.15, SGD: 1.34, HKD: 7.82, SEK: 10.42,
  NOK: 10.56, DKK: 6.87, NZD: 1.64, ZAR: 18.62, RUB: 91.5,
  TRY: 32.1, PLN: 3.98, THB: 35.2, IDR: 15650, MYR: 4.72,
  PHP: 56.2, AED: 3.67, SAR: 3.75, QAR: 3.64, ILS: 3.62,
  CZK: 23.1, HUF: 358, CLP: 925, COP: 3950, ARS: 870,
  PKR: 278, BDT: 109.5, NGN: 1550, EGP: 48.5, VND: 25400,
  TWD: 32.2, PEN: 3.72, KWD: 0.31, BHD: 0.38, OMR: 0.38,
}

const CACHE_KEY = 'bor_exchange_rates'
const CACHE_TTL_MS = 24 * 60 * 60 * 1000 // 24 hours

export function useExchangeRates() {
  const rates = useState<ExchangeRates>('exchangeRates', () => ({
    base: 'USD',
    rates: FALLBACK_RATES,
    lastUpdated: new Date(0).toISOString(),
  }))

  const isLoading = useState('ratesLoading', () => false)
  const error = useState<string | null>('ratesError', () => null)

  const fetchRates = async (base: string = 'USD') => {
    if (import.meta.server) return

    isLoading.value = true
    error.value = null

    try {
      const cached = localStorage.getItem(CACHE_KEY)
      if (cached) {
        const parsed: ExchangeRates = JSON.parse(cached)
        const age = Date.now() - new Date(parsed.lastUpdated).getTime()
        if (age < CACHE_TTL_MS && parsed.base === base) {
          rates.value = parsed
          isLoading.value = false
          return
        }
      }

      const response = await $fetch(`/api/rates/${base}`)
      if (!response.ok) throw new Error('Failed to fetch exchange rates')

      const data = await response.json()
      if (data.result !== 'success') throw new Error('API returned error')

      const newRates: ExchangeRates = {
        base,
        rates: data.rates,
        lastUpdated: new Date().toISOString(),
      }

      rates.value = newRates
      localStorage.setItem(CACHE_KEY, JSON.stringify(newRates))
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Unknown error'
      rates.value = {
        base,
        rates: FALLBACK_RATES,
        lastUpdated: new Date(0).toISOString(),
      }
    } finally {
      isLoading.value = false
    }
  }

  const convert = (amount: number, from: string, to: string): number => {
    if (from === to) return amount
    const fromRate = rates.value.rates[from] ?? 1
    const toRate = rates.value.rates[to] ?? 1
    return (amount / fromRate) * toRate
  }

  onMounted(() => fetchRates())

  return { rates, isLoading, error, fetchRates, convert }
}
