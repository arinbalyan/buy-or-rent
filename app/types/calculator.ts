export interface CalculatorInputs {
  propertyPrice: number
  monthlyRent: number
  currency: string
  downPaymentPercent: number
  mortgageRate: number
  mortgageTermYears: number
  holdingPeriodYears: number
  propertyTaxRate: number
  homeAppreciationRate: number
  rentIncreaseRate: number
  investmentReturnRate: number
  buyingClosingCostPercent: number
  sellingClosingCostPercent: number
  maintenanceCostPercent: number
  insurancePercent: number
  monthlyHoaFees: number
  taxRate?: number
  renterInsurancePercent?: number
}

export interface CalculationResult {
  verdict: 'buy' | 'rent'
  confidence: number
  breakEvenYears: number | null

  buying: CostBreakdown & {
    monthlyPayments: number[]
    equityBuilt: number[]
    taxSavings: number
    salePrice: number
    remainingMortgage: number
  }

  renting: CostBreakdown & {
    monthlyPayments: number[]
    investedSavings: number[]
  }

  comparison: {
    totalSavings: number
    monthlySavings: number
    breakEvenMonth: number | null
  }

  insights: Insight[]
}

interface CostBreakdown {
  totalCost: number
  initialCosts: number
  recurringCosts: number
  opportunityCosts: number
  netProceeds: number
}

export interface Insight {
  type: 'break_even' | 'monthly' | 'total' | 'equity' | 'investment' | 'risk' | 'tax'
  icon: string
  title: string
  description: string
  value?: number
  severity?: 'positive' | 'negative' | 'neutral' | 'warning'
}

export const DEFAULT_INPUTS: CalculatorInputs = {
  propertyPrice: 500000,
  monthlyRent: 2000,
  currency: 'USD',
  downPaymentPercent: 20,
  mortgageRate: 6.5,
  mortgageTermYears: 30,
  holdingPeriodYears: 10,
  propertyTaxRate: 1.2,
  homeAppreciationRate: 3,
  rentIncreaseRate: 3,
  investmentReturnRate: 7,
  buyingClosingCostPercent: 4,
  sellingClosingCostPercent: 6,
  maintenanceCostPercent: 1,
  insurancePercent: 0.5,
  monthlyHoaFees: 0,
  taxRate: 0,
  renterInsurancePercent: 1,
}
