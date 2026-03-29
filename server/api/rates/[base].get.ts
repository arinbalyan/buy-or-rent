import { defineEventHandler } from 'h3'

export default defineEventHandler(async (event) => {
  const base = getRouterParam(event, 'base') ?? 'USD'

  try {
    const response = await fetch(`https://open.er-api.com/v6/latest/${base}`)
    const data = await response.json()

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
