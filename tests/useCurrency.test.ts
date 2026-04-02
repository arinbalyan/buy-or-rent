import { describe, it, expect, beforeEach } from 'vitest'
import { CURRENCIES } from '~/composables/useCurrency'
import { resetNuxtMocks } from './setup'
import { useCurrency } from '~/composables/useCurrency'

// ============================================================
// CURRENCIES constant
// ============================================================

describe('CURRENCIES', () => {
  it('contains USD as first currency', () => {
    // Arrange & Act
    const usd = CURRENCIES[0]

    // Assert
    expect(usd.code).toBe('USD')
    expect(usd.symbol).toBe('$')
    expect(usd.decimals).toBe(2)
  })

  it('contains EUR with correct properties', () => {
    // Arrange & Act
    const eur = CURRENCIES.find((c) => c.code === 'EUR')

    // Assert
    expect(eur).toBeDefined()
    expect(eur?.symbol).toBe('€')
    expect(eur?.decimals).toBe(2)
  })

  it('contains JPY with 0 decimals', () => {
    // Arrange & Act
    const jpy = CURRENCIES.find((c) => c.code === 'JPY')

    // Assert
    expect(jpy).toBeDefined()
    expect(jpy?.decimals).toBe(0)
  })

  it('contains all 45 currencies', () => {
    // Arrange & Act & Assert
    expect(CURRENCIES.length).toBe(45)
  })

  it('all currencies have required fields', () => {
    // Arrange & Act & Assert
    CURRENCIES.forEach((currency) => {
      expect(currency.code).toBeDefined()
      expect(currency.name).toBeDefined()
      expect(currency.symbol).toBeDefined()
      expect(currency.decimals).toBeDefined()
      expect(currency.flag).toBeDefined()
    })
  })

  it('all currency codes are unique', () => {
    // Arrange
    const codes = CURRENCIES.map((c) => c.code)

    // Act
    const uniqueCodes = new Set(codes)

    // Assert
    expect(uniqueCodes.size).toBe(codes.length)
  })
})

// ============================================================
// useCurrency composable
// ============================================================

describe('useCurrency', () => {
  beforeEach(() => {
    resetNuxtMocks()
  })

  describe('parseCurrencyInput', () => {
    it('strips non-numeric characters from input', () => {
      // Arrange
      const { parseCurrencyInput } = useCurrency()

      // Act
      const result = parseCurrencyInput('$1,234.56')

      // Assert
      expect(result).toBe(1234.56)
    })

    it('handles plain numeric strings', () => {
      // Arrange
      const { parseCurrencyInput } = useCurrency()

      // Act
      const result = parseCurrencyInput('5000')

      // Assert
      expect(result).toBe(5000)
    })

    it('handles negative numbers', () => {
      // Arrange
      const { parseCurrencyInput } = useCurrency()

      // Act
      const result = parseCurrencyInput('-100.50')

      // Assert
      expect(result).toBe(-100.5)
    })

    it('returns 0 for empty string', () => {
      // Arrange
      const { parseCurrencyInput } = useCurrency()

      // Act
      const result = parseCurrencyInput('')

      // Assert
      expect(result).toBe(0)
    })

    it('returns 0 for non-numeric string', () => {
      // Arrange
      const { parseCurrencyInput } = useCurrency()

      // Act
      const result = parseCurrencyInput('abc')

      // Assert
      expect(result).toBe(0)
    })

    it('strips currency symbols and commas', () => {
      // Arrange
      const { parseCurrencyInput } = useCurrency()

      // Act
      const result = parseCurrencyInput('€ 1.234,56')

      // Assert — regex keeps digits, dots, minus; comma is stripped
      // "€ 1.234,56" → "1.23456" → 1.23456
      expect(result).toBe(1.23456)
    })
  })

  describe('formatCurrency', () => {
    it('formats USD correctly', () => {
      // Arrange
      const { formatCurrency } = useCurrency()

      // Act
      const result = formatCurrency(1234.56, 'USD')

      // Assert
      expect(result).toContain('1,234.56')
      expect(result).toContain('$')
    })

    it('formats EUR correctly', () => {
      // Arrange
      const { formatCurrency } = useCurrency()

      // Act
      const result = formatCurrency(1234.56, 'EUR')

      // Assert — uses en-US locale in test env, so format is €1,234.56
      expect(result).toContain('1,234.56')
      expect(result).toContain('€')
    })

    it('formats JPY with 0 decimals', () => {
      // Arrange
      const { formatCurrency } = useCurrency()

      // Act
      const result = formatCurrency(1234, 'JPY')

      // Assert
      expect(result).toContain('1,234')
      expect(result).toContain('¥')
    })

    it('formats zero correctly', () => {
      // Arrange
      const { formatCurrency } = useCurrency()

      // Act
      const result = formatCurrency(0, 'USD')

      // Assert
      expect(result).toContain('0.00')
    })

    it('formats negative amounts', () => {
      // Arrange
      const { formatCurrency } = useCurrency()

      // Act
      const result = formatCurrency(-500, 'USD')

      // Assert
      expect(result).toContain('500')
      expect(result).toContain('-')
    })
  })

  describe('formatCompact', () => {
    it('formats millions with M suffix', () => {
      // Arrange
      const { formatCompact } = useCurrency()

      // Act
      const result = formatCompact(2_500_000)

      // Assert
      expect(result).toContain('M')
      expect(result).toContain('2.5')
    })

    it('formats thousands with K suffix', () => {
      // Arrange
      const { formatCompact } = useCurrency()

      // Act
      const result = formatCompact(50_000)

      // Assert
      expect(result).toContain('K')
      expect(result).toContain('50')
    })

    it('formats small numbers without suffix', () => {
      // Arrange
      const { formatCompact } = useCurrency()

      // Act
      const result = formatCompact(500)

      // Assert
      expect(result).not.toContain('K')
      expect(result).not.toContain('M')
      expect(result).toContain('500')
    })

    it('formats numbers just under 1000 without suffix', () => {
      // Arrange
      const { formatCompact } = useCurrency()

      // Act
      const result = formatCompact(999)

      // Assert
      expect(result).not.toContain('K')
      expect(result).not.toContain('M')
    })

    it('formats numbers at exactly 1000 with K suffix', () => {
      // Arrange
      const { formatCompact } = useCurrency()

      // Act
      const result = formatCompact(1_000)

      // Assert
      expect(result).toContain('K')
    })

    it('formats numbers at exactly 1,000,000 with M suffix', () => {
      // Arrange
      const { formatCompact } = useCurrency()

      // Act
      const result = formatCompact(1_000_000)

      // Assert
      expect(result).toContain('M')
    })
  })

  describe('currentCurrency', () => {
    it('returns USD as default currency', () => {
      // Arrange
      const { currentCurrency } = useCurrency()

      // Act
      const currency = currentCurrency.value

      // Assert
      expect(currency.code).toBe('USD')
    })

    it('returns correct currency object with all fields', () => {
      // Arrange
      const { currentCurrency } = useCurrency()

      // Act
      const currency = currentCurrency.value

      // Assert
      expect(currency.code).toBeDefined()
      expect(currency.name).toBeDefined()
      expect(currency.symbol).toBeDefined()
      expect(currency.decimals).toBeDefined()
      expect(currency.flag).toBeDefined()
    })
  })

  describe('currencies', () => {
    it('returns the full CURRENCIES array', () => {
      // Arrange
      const { currencies } = useCurrency()

      // Act & Assert
      expect(currencies).toBe(CURRENCIES)
      expect(currencies.length).toBe(45)
    })
  })

  describe('selectedCurrency', () => {
    it('defaults to USD', () => {
      // Arrange
      const { selectedCurrency } = useCurrency()

      // Act & Assert
      expect(selectedCurrency.value).toBe('USD')
    })
  })
})
