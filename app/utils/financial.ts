const EPSILON = 1e-10

export function calculateMortgagePayment(
  principal: number,
  annualRate: number,
  termYears: number,
): number {
  if (Math.abs(annualRate) < EPSILON) return principal / (termYears * 12)
  const monthlyRate = annualRate / 100 / 12
  const numPayments = termYears * 12
  return principal * (monthlyRate * (1 + monthlyRate) ** numPayments) / ((1 + monthlyRate) ** numPayments - 1)
}

export function calculateAmortizationSchedule(
  principal: number,
  annualRate: number,
  termYears: number,
): { balance: number; interestPaid: number; principalPaid: number }[] {
  const monthlyRate = annualRate / 100 / 12
  const numPayments = termYears * 12
  const monthlyPayment = calculateMortgagePayment(principal, annualRate, termYears)
  const schedule: { balance: number; interestPaid: number; principalPaid: number }[] = []

  let balance = principal
  let totalInterest = 0
  let totalPrincipal = 0

  for (let i = 0; i < numPayments; i++) {
    const interestPayment = balance * monthlyRate
    const principalPayment = Math.min(monthlyPayment - interestPayment, balance)
    balance -= principalPayment
    totalInterest += interestPayment
    totalPrincipal += principalPayment

    schedule.push({
      balance: Math.max(0, balance),
      interestPaid: totalInterest,
      principalPaid: totalPrincipal,
    })
  }

  return schedule
}

export function calculateOpportunityCost(
  principal: number,
  annualReturnRate: number,
  years: number,
): number {
  return principal * ((1 + annualReturnRate / 100) ** years - 1)
}

export interface BuyingInputs {
  propertyPrice: number
  downPaymentPercent: number
  mortgageRate: number
  mortgageTermYears: number
  holdingPeriodYears: number
  propertyTaxRate: number
  homeAppreciationRate: number
  investmentReturnRate: number
  buyingClosingCostPercent: number
  sellingClosingCostPercent: number
  maintenanceCostPercent: number
  insurancePercent: number
  monthlyHoaFees: number
  taxRate?: number
}

export interface RentingInputs {
  monthlyRent: number
  rentIncreaseRate: number
  investmentReturnRate: number
  holdingPeriodYears: number
  propertyPrice: number
  downPaymentPercent: number
  renterInsurancePercent?: number
}

export function calculateBuyingCosts(inputs: BuyingInputs) {
  const {
    propertyPrice, downPaymentPercent, mortgageRate, mortgageTermYears,
    holdingPeriodYears, propertyTaxRate, homeAppreciationRate,
    investmentReturnRate, buyingClosingCostPercent, sellingClosingCostPercent,
    maintenanceCostPercent, insurancePercent, monthlyHoaFees,
  } = inputs

  const downPayment = propertyPrice * downPaymentPercent / 100
  const loanAmount = propertyPrice - downPayment
  const buyingClosingCosts = propertyPrice * buyingClosingCostPercent / 100
  const initialCosts = downPayment + buyingClosingCosts

  const monthlyMortgage = calculateMortgagePayment(loanAmount, mortgageRate, mortgageTermYears)
  const amortization = calculateAmortizationSchedule(
    loanAmount,
    mortgageRate,
    Math.min(mortgageTermYears, holdingPeriodYears),
  )

  const holdingMonths = holdingPeriodYears * 12
  const monthlyPayments: number[] = []

  let totalRecurring = 0
  let totalMortgageInterest = 0
  let totalPropertyTax = 0

  for (let month = 0; month < holdingMonths; month++) {
    const year = Math.floor(month / 12)
    const yearlyAppreciation = (1 + homeAppreciationRate / 100) ** year
    const monthlyPropertyTax = (propertyPrice * propertyTaxRate / 100 / 12) * yearlyAppreciation
    const monthlyInsurance = (propertyPrice * insurancePercent / 100 / 12) * yearlyAppreciation
    const monthlyMaintenance = (propertyPrice * maintenanceCostPercent / 100 / 12) * yearlyAppreciation

    const monthInterest = month < amortization.length
      ? (month > 0 ? amortization[month].interestPaid - amortization[month - 1].interestPaid : amortization[0].interestPaid)
      : 0

    totalMortgageInterest += monthInterest
    totalPropertyTax += monthlyPropertyTax

    const monthlyTotal = monthlyMortgage + monthlyPropertyTax + monthlyInsurance + monthlyMaintenance + monthlyHoaFees
    monthlyPayments.push(monthlyTotal)
    totalRecurring += monthlyTotal
  }

  const equityBuilt: number[] = []
  for (let year = 1; year <= holdingPeriodYears; year++) {
    const monthIdx = Math.min(year * 12 - 1, amortization.length - 1)
    equityBuilt.push(amortization[monthIdx].principalPaid)
  }

  const salePrice = propertyPrice * (1 + homeAppreciationRate / 100) ** holdingPeriodYears
  const sellingCosts = salePrice * sellingClosingCostPercent / 100
  const remainingMortgage = loanAmount - (amortization[Math.min(holdingMonths - 1, amortization.length - 1)]?.principalPaid ?? 0)
  const netProceeds = salePrice - sellingCosts - remainingMortgage

  const taxRate = inputs.taxRate ?? 0
  const taxSavings = taxRate > 0 ? (totalMortgageInterest + totalPropertyTax) * (taxRate / 100) : 0

  const opportunityCost = calculateOpportunityCost(downPayment, investmentReturnRate, holdingPeriodYears)

  return {
    initialCosts,
    recurringCosts: totalRecurring - taxSavings,
    opportunityCosts: opportunityCost,
    netProceeds,
    totalCost: initialCosts + totalRecurring - taxSavings + opportunityCost - netProceeds,
    monthlyPayments,
    equityBuilt,
    taxSavings,
    salePrice,
    remainingMortgage: Math.max(0, remainingMortgage),
  }
}

export function calculateRentingCosts(inputs: RentingInputs) {
  const {
    monthlyRent, rentIncreaseRate, investmentReturnRate,
    holdingPeriodYears, propertyPrice, downPaymentPercent, renterInsurancePercent,
  } = inputs

  const downPayment = propertyPrice * downPaymentPercent / 100
  const securityDeposit = monthlyRent * 1
  const initialCosts = securityDeposit

  const holdingMonths = holdingPeriodYears * 12
  const monthlyPayments: number[] = []
  let totalRecurring = 0

  const insuranceRate = (renterInsurancePercent ?? 1) / 100

  for (let month = 0; month < holdingMonths; month++) {
    const year = Math.floor(month / 12)
    const currentRent = monthlyRent * (1 + rentIncreaseRate / 100) ** year
    const renterInsurance = currentRent * insuranceRate
    const monthlyTotal = currentRent + renterInsurance

    monthlyPayments.push(monthlyTotal)
    totalRecurring += monthlyTotal
  }

  const investedSavings: number[] = []
  let cumulativeInvested = downPayment
  const monthlyReturnRate = investmentReturnRate / 100 / 12
  for (let month = 0; month < holdingMonths; month++) {
    cumulativeInvested *= (1 + monthlyReturnRate)
    if ((month + 1) % 12 === 0) {
      investedSavings.push(cumulativeInvested)
    }
  }

  const opportunityCost = calculateOpportunityCost(downPayment, investmentReturnRate, holdingPeriodYears)
  const netProceeds = securityDeposit

  return {
    initialCosts,
    recurringCosts: totalRecurring,
    opportunityCosts: opportunityCost,
    netProceeds,
    totalCost: initialCosts + totalRecurring + opportunityCost - netProceeds,
    monthlyPayments,
    investedSavings,
  }
}

export function calculateBreakEven(
  buyingTotalByMonth: number[],
  rentingTotalByMonth: number[],
): number | null {
  for (let month = 0; month < Math.min(buyingTotalByMonth.length, rentingTotalByMonth.length); month++) {
    if (buyingTotalByMonth[month] < rentingTotalByMonth[month]) {
      return month
    }
  }
  return null
}
