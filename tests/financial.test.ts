import { describe, it, expect } from 'vitest'
import {
  calculateMortgagePayment,
  calculateAmortizationSchedule,
  calculateOpportunityCost,
  calculateBuyingCosts,
  calculateRentingCosts,
  calculateBreakEven,
} from '~/utils/financial'

// ============================================================
// calculateMortgagePayment
// ============================================================

describe('calculateMortgagePayment', () => {
  it('returns correct monthly payment for standard mortgage', () => {
    // Arrange
    const principal = 300_000
    const annualRate = 6.5 // 6.5%
    const termYears = 30

    // Act
    const result = calculateMortgagePayment(principal, annualRate, termYears)

    // Assert — known value: ~$1,896.20
    expect(result).toBeCloseTo(1896.20, 1)
  })

  it('returns principal/term for zero interest rate', () => {
    // Arrange
    const principal = 240_000
    const annualRate = 0
    const termYears = 30

    // Act
    const result = calculateMortgagePayment(principal, annualRate, termYears)

    // Assert — 240000 / 360 = 666.67
    expect(result).toBeCloseTo(666.67, 2)
  })

  it('handles very small rate (epsilon guard)', () => {
    // Arrange
    const principal = 100_000
    const annualRate = 1e-11 // below EPSILON
    const termYears = 30

    // Act
    const result = calculateMortgagePayment(principal, annualRate, termYears)

    // Assert — treated as zero rate
    expect(result).toBeCloseTo(100_000 / (30 * 12), 6)
  })

  it('handles large principal with long term', () => {
    // Arrange
    const principal = 1_000_000
    const annualRate = 7
    const termYears = 30

    // Act
    const result = calculateMortgagePayment(principal, annualRate, termYears)

    // Assert — should be positive and reasonable
    expect(result).toBeGreaterThan(0)
    expect(result).toBeCloseTo(6653.02, 1)
  })

  it('handles short term (5 years)', () => {
    // Arrange
    const principal = 100_000
    const annualRate = 5
    const termYears = 5

    // Act
    const result = calculateMortgagePayment(principal, annualRate, termYears)

    // Assert
    expect(result).toBeCloseTo(1887.12, 1)
  })
})

// ============================================================
// calculateAmortizationSchedule
// ============================================================

describe('calculateAmortizationSchedule', () => {
  it('returns correct number of months for 30-year mortgage', () => {
    // Arrange
    const principal = 300_000
    const annualRate = 6.5
    const termYears = 30

    // Act
    const schedule = calculateAmortizationSchedule(principal, annualRate, termYears)

    // Assert
    expect(schedule.length).toBe(30 * 12)
  })

  it('balance reaches 0 at end of schedule', () => {
    // Arrange
    const principal = 200_000
    const annualRate = 5
    const termYears = 30

    // Act
    const schedule = calculateAmortizationSchedule(principal, annualRate, termYears)

    // Assert
    expect(schedule[schedule.length - 1].balance).toBeCloseTo(0, 2)
  })

  it('total interest is positive and reasonable', () => {
    // Arrange
    const principal = 300_000
    const annualRate = 6
    const termYears = 30

    // Act
    const schedule = calculateAmortizationSchedule(principal, annualRate, termYears)
    const totalInterest = schedule[schedule.length - 1].interestPaid

    // Assert
    expect(totalInterest).toBeGreaterThan(0)
    // At 6% for 30 years, total interest should be roughly equal to principal
    expect(totalInterest).toBeCloseTo(347_514, -2)
  })

  it('returns correct number of months for short term (5 years)', () => {
    // Arrange
    const principal = 100_000
    const annualRate = 5
    const termYears = 5

    // Act
    const schedule = calculateAmortizationSchedule(principal, annualRate, termYears)

    // Assert
    expect(schedule.length).toBe(5 * 12)
    expect(schedule[schedule.length - 1].balance).toBeCloseTo(0, 2)
  })

  it('handles zero rate schedule', () => {
    // Arrange
    const principal = 120_000
    const annualRate = 0
    const termYears = 10

    // Act
    const schedule = calculateAmortizationSchedule(principal, annualRate, termYears)

    // Assert
    expect(schedule.length).toBe(10 * 12)
    expect(schedule[schedule.length - 1].balance).toBeCloseTo(0, 2)
    // Each month pays equal principal
    const monthlyPrincipal = schedule[0].principalPaid
    expect(monthlyPrincipal).toBeCloseTo(120_000 / 120, 2)
  })

  it('cumulative principalPaid equals original principal at end', () => {
    // Arrange
    const principal = 250_000
    const annualRate = 4.5
    const termYears = 15

    // Act
    const schedule = calculateAmortizationSchedule(principal, annualRate, termYears)

    // Assert
    expect(schedule[schedule.length - 1].principalPaid).toBeCloseTo(principal, 0)
  })
})

// ============================================================
// calculateOpportunityCost
// ============================================================

describe('calculateOpportunityCost', () => {
  it('calculates standard compound growth correctly', () => {
    // Arrange
    const principal = 60_000
    const annualReturnRate = 7
    const years = 10

    // Act
    const result = calculateOpportunityCost(principal, annualReturnRate, years)

    // Assert — 60000 * (1.07^10 - 1) ≈ 58,029
    expect(result).toBeCloseTo(58_029, 0)
  })

  it('returns 0 for zero return rate', () => {
    // Arrange
    const principal = 50_000
    const annualReturnRate = 0
    const years = 10

    // Act
    const result = calculateOpportunityCost(principal, annualReturnRate, years)

    // Assert
    expect(result).toBeCloseTo(0, 6)
  })

  it('returns negative value for negative return rate', () => {
    // Arrange
    const principal = 100_000
    const annualReturnRate = -3
    const years = 5

    // Act
    const result = calculateOpportunityCost(principal, annualReturnRate, years)

    // Assert — 100000 * (0.97^5 - 1) ≈ -14,127
    expect(result).toBeLessThan(0)
    expect(result).toBeCloseTo(-14_127, 0)
  })

  it('handles single year calculation', () => {
    // Arrange
    const principal = 10_000
    const annualReturnRate = 5
    const years = 1

    // Act
    const result = calculateOpportunityCost(principal, annualReturnRate, years)

    // Assert — 10000 * 0.05 = 500
    expect(result).toBeCloseTo(500, 2)
  })
})

// ============================================================
// calculateBuyingCosts
// ============================================================

describe('calculateBuyingCosts', () => {
  const defaultInputs = {
    propertyPrice: 400_000,
    downPaymentPercent: 20,
    mortgageRate: 6.5,
    mortgageTermYears: 30,
    holdingPeriodYears: 10,
    propertyTaxRate: 1.2,
    homeAppreciationRate: 3,
    investmentReturnRate: 7,
    buyingClosingCostPercent: 2,
    sellingClosingCostPercent: 6,
    maintenanceCostPercent: 1,
    insurancePercent: 0.5,
    monthlyHoaFees: 0,
  }

  it('returns correct totalCost formula (costs - netProceeds, no opportunity cost)', () => {
    // Arrange
    const inputs = { ...defaultInputs }

    // Act
    const result = calculateBuyingCosts(inputs)

    // Assert: totalCost = initialCosts + recurringCosts - netProceeds (opportunity cost excluded)
    const expectedTotalCost = result.initialCosts + result.recurringCosts - result.netProceeds
    expect(result.totalCost).toBeCloseTo(expectedTotalCost, 2)
  })

  it('monthlyPayments array length matches holding period', () => {
    // Arrange
    const inputs = { ...defaultInputs, holdingPeriodYears: 5 }

    // Act
    const result = calculateBuyingCosts(inputs)

    // Assert
    expect(result.monthlyPayments.length).toBe(5 * 12)
  })

  it('equityBuilt array length matches holding period years', () => {
    // Arrange
    const inputs = { ...defaultInputs, holdingPeriodYears: 7 }

    // Act
    const result = calculateBuyingCosts(inputs)

    // Assert
    expect(result.equityBuilt.length).toBe(7)
  })

  it('initialCosts equals downPayment + buyingClosingCosts', () => {
    // Arrange
    const inputs = { ...defaultInputs }
    const expectedDownPayment = inputs.propertyPrice * inputs.downPaymentPercent / 100
    const expectedClosingCosts = inputs.propertyPrice * inputs.buyingClosingCostPercent / 100

    // Act
    const result = calculateBuyingCosts(inputs)

    // Assert
    expect(result.initialCosts).toBeCloseTo(expectedDownPayment + expectedClosingCosts, 2)
  })

  it('calculates taxSavings when taxRate is configured', () => {
    // Arrange
    const inputs = { ...defaultInputs, taxRate: 25 }

    // Act
    const result = calculateBuyingCosts(inputs)

    // Assert
    expect(result.taxSavings).toBeGreaterThan(0)
  })

  it('taxSavings is zero when taxRate is not configured (default)', () => {
    // Arrange
    const inputs = { ...defaultInputs }
    // taxRate is undefined

    // Act
    const result = calculateBuyingCosts(inputs)

    // Assert
    expect(result.taxSavings).toBe(0)
  })

  it('taxSavings is zero when taxRate is explicitly zero', () => {
    // Arrange
    const inputs = { ...defaultInputs, taxRate: 0 }

    // Act
    const result = calculateBuyingCosts(inputs)

    // Assert
    expect(result.taxSavings).toBe(0)
  })

  it('salePrice reflects appreciation over holding period', () => {
    // Arrange
    const inputs = { ...defaultInputs, homeAppreciationRate: 3, holdingPeriodYears: 10 }

    // Act
    const result = calculateBuyingCosts(inputs)

    // Assert — 400000 * 1.03^10 ≈ 537,566.55
    expect(result.salePrice).toBeCloseTo(537_566.55, 0)
  })

  it('remainingMortgage is non-negative', () => {
    // Arrange
    const inputs = { ...defaultInputs }

    // Act
    const result = calculateBuyingCosts(inputs)

    // Assert
    expect(result.remainingMortgage).toBeGreaterThanOrEqual(0)
  })

  it('opportunityCosts is positive for positive investmentReturnRate', () => {
    // Arrange
    const inputs = { ...defaultInputs, investmentReturnRate: 7 }

    // Act
    const result = calculateBuyingCosts(inputs)

    // Assert
    expect(result.opportunityCosts).toBeGreaterThan(0)
  })
})

// ============================================================
// calculateRentingCosts
// ============================================================

describe('calculateRentingCosts', () => {
  const defaultInputs = {
    monthlyRent: 2_000,
    rentIncreaseRate: 3,
    investmentReturnRate: 7,
    holdingPeriodYears: 10,
    propertyPrice: 400_000,
    downPaymentPercent: 20,
  }

  it('returns positive totalCost for standard inputs', () => {
    // Arrange
    const inputs = { ...defaultInputs }

    // Act
    const result = calculateRentingCosts(inputs)

    // Assert
    expect(result.totalCost).toBeGreaterThan(0)
  })

  it('monthlyPayments array length matches holding period', () => {
    // Arrange
    const inputs = { ...defaultInputs, holdingPeriodYears: 5 }

    // Act
    const result = calculateRentingCosts(inputs)

    // Assert
    expect(result.monthlyPayments.length).toBe(5 * 12)
  })

  it('investedSavings array length matches holding period years', () => {
    // Arrange
    const inputs = { ...defaultInputs, holdingPeriodYears: 7 }

    // Act
    const result = calculateRentingCosts(inputs)

    // Assert
    expect(result.investedSavings.length).toBe(7)
  })

  it('initialCosts equals security deposit (one month rent)', () => {
    // Arrange
    const inputs = { ...defaultInputs }

    // Act
    const result = calculateRentingCosts(inputs)

    // Assert
    expect(result.initialCosts).toBe(inputs.monthlyRent)
  })

  it('netProceeds equals security deposit', () => {
    // Arrange
    const inputs = { ...defaultInputs }

    // Act
    const result = calculateRentingCosts(inputs)

    // Assert
    expect(result.netProceeds).toBe(inputs.monthlyRent)
  })

  it('uses default renter insurance rate of 1% when not specified', () => {
    // Arrange
    const inputs = { ...defaultInputs }
    // renterInsurancePercent is undefined → defaults to 1%

    // Act
    const result = calculateRentingCosts(inputs)

    // Assert — first month: 2000 + 2000 * 0.01 = 2020
    expect(result.monthlyPayments[0]).toBeCloseTo(2_020, 2)
  })

  it('uses custom renterInsurancePercent when provided', () => {
    // Arrange
    const inputs = { ...defaultInputs, renterInsurancePercent: 2 }

    // Act
    const result = calculateRentingCosts(inputs)

    // Assert — first month: 2000 + 2000 * 0.02 = 2040
    expect(result.monthlyPayments[0]).toBeCloseTo(2_040, 2)
  })

  it('opportunityCosts is positive for positive investmentReturnRate', () => {
    // Arrange
    const inputs = { ...defaultInputs, investmentReturnRate: 7 }

    // Act
    const result = calculateRentingCosts(inputs)

    // Assert
    expect(result.opportunityCosts).toBeGreaterThan(0)
  })

  it('monthly payments increase with rentIncreaseRate', () => {
    // Arrange
    const inputs = { ...defaultInputs, rentIncreaseRate: 3 }

    // Act
    const result = calculateRentingCosts(inputs)

    // Assert — month 12 (start of year 2) should be higher than month 0
    expect(result.monthlyPayments[12]).toBeGreaterThan(result.monthlyPayments[0])
  })
})

// ============================================================
// calculateBreakEven
// ============================================================

describe('calculateBreakEven', () => {
  it('returns 0 when buying is cheaper from month 0', () => {
    // Arrange
    const buyingCosts = [1000, 1100, 1200]
    const rentingCosts = [1500, 1600, 1700]

    // Act
    const result = calculateBreakEven(buyingCosts, rentingCosts)

    // Assert
    expect(result).toBe(0)
  })

  it('returns correct month when buying becomes cheaper later', () => {
    // Arrange
    const buyingCosts = [2000, 1800, 1500, 1200]
    const rentingCosts = [1500, 1550, 1600, 1650]

    // Act
    const result = calculateBreakEven(buyingCosts, rentingCosts)

    // Assert — month 2: 1500 < 1600
    expect(result).toBe(2)
  })

  it('returns null when buying is never cheaper', () => {
    // Arrange
    const buyingCosts = [2000, 2100, 2200]
    const rentingCosts = [1500, 1400, 1300]

    // Act
    const result = calculateBreakEven(buyingCosts, rentingCosts)

    // Assert
    expect(result).toBeNull()
  })

  it('returns null when costs are always equal', () => {
    // Arrange
    const buyingCosts = [1000, 1000, 1000]
    const rentingCosts = [1000, 1000, 1000]

    // Act
    const result = calculateBreakEven(buyingCosts, rentingCosts)

    // Assert — buying is never strictly less than renting
    expect(result).toBeNull()
  })

  it('handles arrays of different lengths', () => {
    // Arrange
    const buyingCosts = [2000, 1900, 1000]
    const rentingCosts = [1800, 1700]

    // Act
    const result = calculateBreakEven(buyingCosts, rentingCosts)

    // Assert — compares only up to min length (2): month 0: 2000>1800, month 1: 1900>1700 → never cheaper
    expect(result).toBeNull()
  })

  it('returns 0 when buying is cheaper at first month only', () => {
    // Arrange
    const buyingCosts = [900, 2000, 2000]
    const rentingCosts = [1000, 1500, 1500]

    // Act
    const result = calculateBreakEven(buyingCosts, rentingCosts)

    // Assert
    expect(result).toBe(0)
  })

  it('handles empty arrays', () => {
    // Arrange
    const buyingCosts: number[] = []
    const rentingCosts: number[] = []

    // Act
    const result = calculateBreakEven(buyingCosts, rentingCosts)

    // Assert
    expect(result).toBeNull()
  })
})
