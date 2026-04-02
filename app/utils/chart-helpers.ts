export function formatAxisLabel(value: number | string, symbol: string): string {
  const v = Number(value)
  if (Math.abs(v) >= 1e6) return `${symbol}${(v / 1e6).toFixed(0)}M`
  if (Math.abs(v) >= 1e3) return `${symbol}${(v / 1e3).toFixed(0)}K`
  return `${symbol}${v}`
}
