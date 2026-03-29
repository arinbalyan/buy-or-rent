export interface Currency {
  code: string
  name: string
  symbol: string
  decimals: number
  flag: string
}

export interface ExchangeRates {
  base: string
  rates: Record<string, number>
  lastUpdated: string
}
