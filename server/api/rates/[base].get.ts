import { defineEventHandler, getRouterParam, createError } from 'h3'

const VALID_BASES = new Set([
  'USD', 'EUR', 'GBP', 'JPY', 'CNY', 'INR', 'AUD', 'CAD', 'CHF', 'KRW',
  'BRL', 'MXN', 'SGD', 'HKD', 'SEK', 'NOK', 'DKK', 'NZD', 'ZAR', 'RUB',
  'TRY', 'PLN', 'THB', 'IDR', 'MYR', 'PHP', 'AED', 'SAR', 'QAR', 'ILS',
  'CZK', 'HUF', 'CLP', 'COP', 'ARS', 'PKR', 'BDT', 'NGN', 'EGP', 'VND',
  'TWD', 'PEN', 'KWD', 'BHD', 'OMR',
])

export default defineEventHandler(async (event) => {
  const base = (getRouterParam(event, 'base') ?? 'USD').toUpperCase()

  if (!VALID_BASES.has(base)) {
    throw createError({ statusCode: 400, message: `Invalid currency code: ${base}` })
  }

  try {
    const response = await fetch(`https://open.er-api.com/v6/latest/${base}`)
    if (!response.ok) throw new Error(`API returned ${response.status}`)
    const data = await response.json()

    if (data.result !== 'success') {
      throw new Error(data['error-type'] || 'API returned error')
    }

    return {
      base,
      rates: data.rates,
      lastUpdated: new Date().toISOString(),
    }
  } catch {
    return {
      base,
      rates: { USD: 1 },
      lastUpdated: new Date(0).toISOString(),
      error: 'Failed to fetch rates',
    }
  }
})
