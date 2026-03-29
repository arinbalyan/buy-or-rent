import type { CalculatorInputs, CalculationResult, Insight } from '~/types/calculator'
import { calculateBuyingCosts, calculateRentingCosts } from '~/utils/financial'

export function useCalculator() {
  const inputs = useState<CalculatorInputs>('calculatorInputs', () => ({
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
  }))

  const result = computed<CalculationResult>(() => {
    const i = inputs.value

    const buying = calculateBuyingCosts({
      propertyPrice: i.propertyPrice,
      downPaymentPercent: i.downPaymentPercent,
      mortgageRate: i.mortgageRate,
      mortgageTermYears: i.mortgageTermYears,
      holdingPeriodYears: i.holdingPeriodYears,
      propertyTaxRate: i.propertyTaxRate,
      homeAppreciationRate: i.homeAppreciationRate,
      investmentReturnRate: i.investmentReturnRate,
      buyingClosingCostPercent: i.buyingClosingCostPercent,
      sellingClosingCostPercent: i.sellingClosingCostPercent,
      maintenanceCostPercent: i.maintenanceCostPercent,
      insurancePercent: i.insurancePercent,
      monthlyHoaFees: i.monthlyHoaFees,
    })

    const renting = calculateRentingCosts({
      monthlyRent: i.monthlyRent,
      rentIncreaseRate: i.rentIncreaseRate,
      investmentReturnRate: i.investmentReturnRate,
      holdingPeriodYears: i.holdingPeriodYears,
      propertyPrice: i.propertyPrice,
      downPaymentPercent: i.downPaymentPercent,
    })

    const totalSavings = renting.totalCost - buying.totalCost
    const monthlyBuyingAvg = buying.totalCost / (i.holdingPeriodYears * 12)
    const monthlyRentingAvg = renting.totalCost / (i.holdingPeriodYears * 12)
    const monthlySavings = monthlyRentingAvg - monthlyBuyingAvg

    const verdict = totalSavings > 0 ? 'buy' : 'rent'
    const absSavings = Math.abs(totalSavings)
    const confidence = Math.min(100, Math.round((absSavings / Math.max(buying.totalCost, renting.totalCost)) * 100))

    const breakEvenMonth = null as number | null

    const insights = generateInsights({
      verdict,
      totalSavings,
      monthlySavings,
      breakEvenYears: breakEvenMonth ? breakEvenMonth / 12 : null,
      holdingPeriodYears: i.holdingPeriodYears,
      equity: buying.equityBuilt[buying.equityBuilt.length - 1] ?? 0,
      downPayment: i.propertyPrice * i.downPaymentPercent / 100,
      investmentReturn: renting.investedSavings[renting.investedSavings.length - 1] ?? 0,
    })

    return {
      verdict,
      confidence,
      breakEvenYears: breakEvenMonth ? breakEvenMonth / 12 : null,
      buying: {
        ...buying,
      },
      renting: {
        ...renting,
      },
      comparison: {
        totalSavings,
        monthlySavings,
        breakEvenMonth,
      },
      insights,
    }
  })

  return { inputs, result }
}

interface InsightParams {
  verdict: 'buy' | 'rent'
  totalSavings: number
  monthlySavings: number
  breakEvenYears: number | null
  holdingPeriodYears: number
  equity: number
  downPayment: number
  investmentReturn: number
}

function generateInsights(params: InsightParams): Insight[] {
  const insights: Insight[] = []
  const { verdict, totalSavings, monthlySavings, breakEvenYears, holdingPeriodYears, equity, downPayment, investmentReturn } = params

  insights.push({
    type: verdict === 'buy' ? 'total' : 'total',
    icon: verdict === 'buy' ? '🏠' : '🔑',
    title: verdict === 'buy' ? 'Buying saves money' : 'Renting saves money',
    description: `Over ${holdingPeriodYears} years, ${verdict === 'buy' ? 'buying' : 'renting'} saves you ${formatInsightValue(Math.abs(totalSavings))}`,
    value: totalSavings,
    severity: verdict === 'buy' ? 'positive' : 'negative',
  })

  insights.push({
    type: 'monthly',
    icon: monthlySavings > 0 ? '📉' : '📈',
    title: monthlySavings > 0 ? 'Lower monthly cost by buying' : 'Lower monthly cost by renting',
    description: `On average, ${monthlySavings > 0 ? 'buying' : 'renting'} costs ${formatInsightValue(Math.abs(monthlySavings))} less per month`,
    value: monthlySavings,
    severity: monthlySavings > 0 ? 'positive' : 'negative',
  })

  if (breakEvenYears !== null && breakEvenYears < holdingPeriodYears) {
    insights.push({
      type: 'break_even',
      icon: '⚖️',
      title: 'Break-even point',
      description: `Buying becomes cheaper after ${breakEvenYears.toFixed(1)} years`,
      value: breakEvenYears,
      severity: 'neutral',
    })
  } else if (breakEvenYears === null) {
    insights.push({
      type: 'break_even',
      icon: '⚠️',
      title: 'No break-even',
      description: `Buying never becomes cheaper than renting within ${holdingPeriodYears} years`,
      severity: 'warning',
    })
  }

  if (equity > 0) {
    insights.push({
      type: 'equity',
      icon: '💰',
      title: 'Home equity',
      description: `After ${holdingPeriodYears} years, you'd have ${formatInsightValue(equity)} in home equity`,
      value: equity,
      severity: 'positive',
    })
  }

  if (investmentReturn > downPayment) {
    insights.push({
      type: 'investment',
      icon: '📊',
      title: 'Investment opportunity',
      description: `Investing your down payment could grow to ${formatInsightValue(investmentReturn)}`,
      value: investmentReturn,
      severity: 'neutral',
    })
  }

  return insights
}

function formatInsightValue(value: number): string {
  if (Math.abs(value) >= 1_000_000) {
    return `$${(value / 1_000_000).toFixed(1)}M`
  }
  if (Math.abs(value) >= 1_000) {
    return `$${(value / 1_000).toFixed(0)}K`
  }
  return `$${value.toFixed(0)}`
}
