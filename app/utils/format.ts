/**
 * Shared number formatting utilities for currency values.
 * Consolidates formatInsightValue, formatAxisLabel, and formatCompact.
 */

export function formatCompactCurrency(value: number, symbol: string): string {
  if (Math.abs(value) >= 1_000_000) {
    return `${symbol}${(value / 1_000_000).toFixed(1)}M`
  }
  if (Math.abs(value) >= 1_000) {
    return `${symbol}${(value / 1_000).toFixed(0)}K`
  }
  return `${symbol}${value.toFixed(0)}`
}

export function formatAxisLabel(value: number | string, symbol: string): string {
  const v = typeof value === 'string' ? Number.parseFloat(value) : value
  if (Math.abs(v) >= 1_000_000) return `${symbol}${(v / 1_000_000).toFixed(0)}M`
  if (Math.abs(v) >= 1_000) return `${symbol}${(v / 1_000).toFixed(0)}K`
  return `${symbol}${v}`
}
