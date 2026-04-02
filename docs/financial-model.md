# Financial Model

> How the buy-vs-rent calculator computes total cost of ownership. All formulas are grounded in `app/utils/financial.ts`.

## Mortgage Payment

Standard fixed-rate amortization formula:

```
M = P × [r(1+r)^n] / [(1+r)^n - 1]
```

Where:
- `M` = monthly payment
- `P` = loan principal (property price − down payment)
- `r` = monthly interest rate (`annualRate / 100 / 12`)
- `n` = total number of payments (`termYears × 12`)

**Edge case:** If rate is ~0, payment = `P / n`.

```ts
// app/utils/financial.ts
export function calculateMortgagePayment(principal, annualRate, termYears): number {
  if (Math.abs(annualRate) < 1e-10) return principal / (termYears * 12)
  const monthlyRate = annualRate / 100 / 12
  const numPayments = termYears * 12
  return principal * (monthlyRate * (1 + monthlyRate) ** numPayments) / ((1 + monthlyRate) ** numPayments - 1)
}
```

## Buying Cost Model

```
Total Buying Cost = Initial Costs + Recurring Costs + Opportunity Costs − Net Proceeds
```

### Components

| Component | Formula | Default |
|-----------|---------|---------|
| **Down payment** | `propertyPrice × downPaymentPercent / 100` | 20% |
| **Buying closing costs** | `propertyPrice × buyingClosingCostPercent / 100` | 4% |
| **Monthly mortgage** | `calculateMortgagePayment(loanAmount, rate, term)` | — |
| **Property tax** (monthly) | `(propertyPrice × propertyTaxRate / 100 / 12) × (1 + appreciation)^year` | 1.2%/yr |
| **Insurance** (monthly) | `(propertyPrice × insurancePercent / 100 / 12) × (1 + appreciation)^year` | 0.5%/yr |
| **Maintenance** (monthly) | `(propertyPrice × maintenanceCostPercent / 100 / 12) × (1 + appreciation)^year` | 1%/yr |
| **HOA fees** (monthly) | `monthlyHoaFees` (flat) | $0 |
| **Tax savings** | `(totalMortgageInterest + totalPropertyTax) × taxRate / 100` | 0% (disabled) |

**Recurring costs** = Σ(monthly mortgage + property tax + insurance + maintenance + HOA) − tax savings, summed over holding period.

**Sale proceeds:**
```
salePrice = propertyPrice × (1 + homeAppreciationRate / 100) ^ holdingPeriodYears
sellingCosts = salePrice × sellingClosingCostPercent / 100
remainingMortgage = loanAmount − principalPaid (from amortization schedule)
netProceeds = salePrice − sellingCosts − remainingMortgage
```

**Opportunity cost** of down payment (see [Opportunity Cost](#opportunity-cost) below).

## Renting Cost Model

```
Total Renting Cost = Initial Costs + Recurring Costs + Opportunity Costs − Net Proceeds
```

### Components

| Component | Formula | Default |
|-----------|---------|---------|
| **Security deposit** | `monthlyRent × 1` | 1 month rent |
| **Monthly rent** (year y) | `monthlyRent × (1 + rentIncreaseRate / 100) ^ y` | 3%/yr increase |
| **Renter's insurance** (monthly) | `currentRent × renterInsurancePercent / 100` | 1% of rent |

**Recurring costs** = Σ(monthly rent + renter's insurance), summed over holding period.

**Net proceeds** = security deposit returned at end of tenancy.

**Opportunity cost** of the down payment that would have been tied up in buying (see below).

## Opportunity Cost

The foregone return if the down payment were invested instead:

```
Opportunity Cost = P × [(1 + r)^n − 1]
```

Where:
- `P` = down payment amount
- `r` = annual investment return rate / 100
- `n` = holding period in years

```ts
// app/utils/financial.ts
export function calculateOpportunityCost(principal, annualReturnRate, years): number {
  return principal * ((1 + annualReturnRate / 100) ** years - 1)
}
```

**Example:** $100,000 down payment at 7% return over 10 years:
```
$100,000 × [(1.07)^10 − 1] = $100,000 × 0.9672 = $96,715
```

The renter's invested savings projection compounds monthly:
```ts
let cumulativeInvested = downPayment
const monthlyReturnRate = investmentReturnRate / 100 / 12
for (let month = 0; month < holdingMonths; month++) {
  cumulativeInvested *= (1 + monthlyReturnRate)
  // Record annually
}
```

## Break-Even Analysis

Compares cumulative monthly costs of buying vs renting to find the first month where buying becomes cheaper:

```ts
// Build cumulative arrays
let buyCumulative = buying.initialCosts
let rentCumulative = renting.initialCosts
for (let m = 0; m < months; m++) {
  buyCumulative += buying.monthlyPayments[m]
  rentCumulative += renting.monthlyPayments[m]
  if (buyCumulative < rentCumulative) return m  // break-even month
}
return null  // renting always wins within holding period
```

Returns `null` if buying never becomes cheaper within the holding period.

## Tax Savings Model

Simplified deduction model — configurable marginal tax rate applied to deductible expenses:

```
Tax Savings = (totalMortgageInterest + totalPropertyTax) × taxRate / 100
```

- `taxRate` defaults to 0% (disabled)
- Only mortgage interest and property tax are considered deductible
- Does not model standard deduction thresholds, SALT caps, or capital gains exclusions
- Applied as a reduction to recurring costs

## Default Assumptions

All defaults from `DEFAULT_INPUTS` in `app/types/calculator.ts`:

| Parameter | Default | Range | Description |
|-----------|---------|-------|-------------|
| `propertyPrice` | 500,000 | — | Purchase price |
| `monthlyRent` | 2,000 | — | Comparable monthly rent |
| `currency` | USD | 45 codes | Display currency |
| `downPaymentPercent` | 20% | 0–100% | Down payment |
| `mortgageRate` | 6.5% | 0–15% | Annual interest rate |
| `mortgageTermYears` | 30 | 5–40 yrs | Loan term |
| `holdingPeriodYears` | 10 | 1–40 yrs | How long you'll stay |
| `propertyTaxRate` | 1.2% | 0–5%/yr | Annual property tax |
| `homeAppreciationRate` | 3% | −5–15%/yr | Annual home value growth |
| `rentIncreaseRate` | 3% | 0–15%/yr | Annual rent increase |
| `investmentReturnRate` | 7% | 0–20%/yr | Annual investment return |
| `buyingClosingCostPercent` | 4% | 0–10% | Buying closing costs |
| `sellingClosingCostPercent` | 6% | 0–10% | Selling closing costs |
| `maintenanceCostPercent` | 1% | 0–5%/yr | Annual maintenance |
| `insurancePercent` | 0.5% | 0–3%/yr | Annual homeowner's insurance |
| `monthlyHoaFees` | 0 | — | Monthly HOA/condo fees |
| `taxRate` | 0% | — | Marginal tax rate (deductions) |
| `renterInsurancePercent` | 1% | — | Renter's insurance (% of rent) |

## Known Limitations

| Limitation | Impact |
|------------|--------|
| **Simplified tax model** | No standard deduction comparison, SALT caps, or capital gains exclusions. Set `taxRate` manually for rough estimates. |
| **Fixed appreciation/rent increase** | Assumes constant annual rates. Real markets are volatile and cyclical. |
| **No location-specific data** | Property tax rates, insurance costs, and HOA fees vary widely by location. |
| **Single mortgage type** | Only fixed-rate mortgages supported. No ARM, interest-only, or FHA/VA loans. |
| **No transaction timing** | Assumes immediate sale at holding period end. Real sales take months. |
| **No inflation adjustment** | All values in nominal terms. Real purchasing power not modeled. |
| **Exchange rates are approximate** | Uses open.er-api.com with 24h cache + hardcoded fallback. Not real-time. |
| **45 currencies, not all ISO 4217** | Covers major currencies but not all 160+ active codes. |
