# Buy or Rent — Product Specification

> A serverless web application that helps users make informed decisions about whether to buy or rent a property, with instant financial insights, multi-currency support, and a modern dashboard experience.

**Version:** 1.0.0
**Date:** 2026-03-29
**Status:** Draft

---

## 1. Problem Statement

Millions of people face the buy-vs-rent decision every year without clear financial guidance. Existing calculators are either too simplistic (ignoring opportunity costs, tax implications, and market dynamics) or too complex (requiring 20+ inputs before showing any results). There is no tool that provides **instant, actionable insights** with minimal input while supporting users globally across all currencies.

## 2. Product Vision

A single-page application that:
- Requires only **2 inputs** to show instant results (property price + monthly rent)
- Supports **all ISO 4217 currencies** with live exchange rates
- Provides a **modern, dashboard-style** visualization of the financial comparison
- Runs entirely **serverless** with zero database dependencies
- Loads in under 2 seconds globally

## 3. Target Users

| Persona | Description | Key Need |
|---------|-------------|----------|
| **First-time buyer** | 25-40, considering buying their first home | "Can I actually afford to buy?" |
| **Relocating professional** | Moving to a new city/country | "Is buying worth it if I'm here for 3 years?" |
| **Investor** | Comparing buy-to-let vs other investments | "What's the real return on property?" |
| **Renter questioning** | Currently renting, wondering if they should buy | "Am I throwing money away on rent?" |

## 4. Core Features

### 4.1 Instant Calculator (MVP)

**Inputs (Required):**
- Property purchase price
- Monthly rent for comparable property
- Currency selection (default: auto-detect via browser locale)

**Inputs (Advanced, collapsible):**
- Down payment percentage (default: 20%)
- Mortgage interest rate (default: 6.5%)
- Mortgage term in years (default: 30)
- How long you plan to stay (default: 10 years)
- Property tax rate (default: 1.2%)
- Home appreciation rate (default: 3%)
- Rent increase rate (default: 3%)
- Investment return rate (default: 7%)
- Closing costs for buying (default: 4%)
- Closing costs for selling (default: 6%)
- Maintenance costs (default: 1% of property value/year)
- Homeowner's insurance (default: 0.5% of property value/year)
- Monthly HOA/condo fees (default: 0)

**Outputs (Dashboard):**
1. **Verdict Card** — Clear BUY or RENT recommendation with confidence indicator
2. **Break-even Timeline** — How many years until buying becomes cheaper
3. **Total Cost Comparison** — Side-by-side bar chart of total costs over the holding period
4. **Monthly Cash Flow** — Line chart showing monthly costs of buying vs renting over time
5. **Net Worth Projection** — Area chart showing equity buildup vs invested savings
6. **Cost Breakdown** — Donut charts for both scenarios showing where money goes
7. **Opportunity Cost Analysis** — What the down payment could earn if invested instead

### 4.2 Currency System

- Support all **160+ active ISO 4217 currency codes**
- Live exchange rates via ExchangeRate-API (open access, no key required)
- Currency selector with search, flag icons, and common currencies pinned
- All calculations performed in selected currency
- Rates cached for 24 hours (via localStorage with TTL)
- Graceful fallback to hardcoded rates if API unavailable

### 4.3 Insights Engine

The calculator generates contextual insights based on the results:

- **Break-even insight**: "Buying becomes cheaper than renting after X years"
- **Monthly savings**: "You'd save/pay $X more per month by buying"
- **Total savings**: "Over X years, buying saves/costs you $X more"
- **Equity insight**: "After X years, you'd have $X in home equity"
- **Investment insight**: "Investing your down payment would yield $X"
- **Risk indicator**: Market volatility, interest rate sensitivity
- **Tax benefit estimate**: Approximate tax deductions from mortgage interest

### 4.4 Share & Export

- Shareable URL with encoded parameters (query string)
- Export results as PDF (client-side, no server)
- Copy summary to clipboard

## 5. User Experience

### 5.1 Page Layout

```
┌─────────────────────────────────────────────────────┐
│  Header: "Buy or Rent" + Currency Selector          │
├─────────────────────────────────────────────────────┤
│                                                     │
│  ┌──────────────┐  ┌─────────────────────────────┐  │
│  │              │  │                             │  │
│  │   INPUT      │  │   VERDICT CARD              │  │
│  │   PANEL      │  │   "RENTING is better"       │  │
│  │              │  │   Saves $140K over 10 years  │  │
│  │  Price: $500K│  │                             │  │
│  │  Rent:  $2K  │  ├─────────────────────────────┤  │
│  │              │  │                             │  │
│  │  [Advanced▾] │  │   BREAK-EVEN TIMELINE       │  │
│  │              │  │   ████████░░░░ 14 years     │  │
│  │              │  │                             │  │
│  └──────────────┘  ├─────────────────────────────┤  │
│                    │                             │  │
│                    │   DASHBOARD GRID            │  │
│                    │   ┌───────┐ ┌───────┐      │  │
│                    │   │ Total │ │Monthly│      │  │
│                    │   │ Cost  │ │ Cash  │      │  │
│                    │   │ Chart │ │ Flow  │      │  │
│                    │   └───────┘ └───────┘      │  │
│                    │   ┌───────┐ ┌───────┐      │  │
│                    │   │ Net   │ │ Cost  │      │  │
│                    │   │ Worth │ │ Break │      │  │
│                    │   │ Proj. │ │ down  │      │  │
│                    │   └───────┘ └───────┘      │  │
│                    │                             │  │
│                    ├─────────────────────────────┤  │
│                    │   INSIGHTS PANEL            │  │
│                    │   • Break-even: 14 years    │  │
│                    │   • Monthly diff: -$350     │  │
│                    │   • Equity after 10yr: $180K│  │
│                    │                             │  │
│                    └─────────────────────────────┘  │
│                                                     │
├─────────────────────────────────────────────────────┤
│  Footer: Attribution + Methodology link             │
└─────────────────────────────────────────────────────┘
```

### 5.2 Interaction Model

1. **Instant feedback**: Results update as user types (debounced 300ms)
2. **Progressive disclosure**: Basic inputs visible first, advanced in collapsible section
3. **Responsive**: Single column on mobile, side-by-side on desktop
4. **Dark/light mode**: Auto-detect system preference, toggle available
5. **Keyboard accessible**: Full tab navigation, ARIA labels

### 5.3 Design Language

- **Style**: Clean, modern, data-forward dashboard
- **Typography**: Inter or similar geometric sans-serif
- **Colors**: Neutral base with green (buy) and blue (rent) accent colors
- **Charts**: Smooth animations, hover tooltips, responsive sizing
- **Spacing**: Generous whitespace, card-based layout with subtle shadows

## 6. Financial Model

### 6.1 Buying Cost Calculation

```
Total Buying Cost = Initial Costs + Recurring Costs + Opportunity Costs - Net Proceeds

Where:
  Initial Costs = Down Payment + Closing Costs (buying)
  Recurring Costs = Σ(Mortgage Payment + Property Tax + Insurance + Maintenance + HOA - Tax Savings)
  Opportunity Costs = Opportunity Cost of Down Payment + Opportunity Cost of Recurring Cost Differences
  Net Proceeds = Sale Price - Remaining Mortgage - Selling Costs - Capital Gains Tax
  Sale Price = Purchase Price × (1 + appreciation_rate)^years
```

### 6.2 Renting Cost Calculation

```
Total Renting Cost = Initial Costs + Recurring Costs + Opportunity Costs - Net Proceeds

Where:
  Initial Costs = Security Deposit + Broker Fee
  Recurring Costs = Σ(Rent × (1 + rent_increase_rate)^(year-1) + Renter's Insurance)
  Opportunity Costs = Opportunity Cost of Security Deposit + Opportunity Cost of Monthly Savings
  Net Proceeds = Security Deposit Return
```

### 6.3 Tax Considerations

- Mortgage interest deduction (simplified: only beneficial if exceeds standard deduction)
- Property tax deduction (capped at $10,000 SALT in US context, configurable)
- Capital gains exclusion ($250K single / $500K married for US, configurable)

### 6.4 Opportunity Cost

- Down payment invested at the specified investment return rate
- Monthly savings (if renting is cheaper) invested monthly
- All opportunity costs calculated with compound interest

## 7. Non-Functional Requirements

| Requirement | Target |
|-------------|--------|
| **Performance** | LCP < 1.5s, FID < 100ms, CLS < 0.1 |
| **Availability** | 99.9% (static hosting, no server dependency) |
| **Browser Support** | Chrome, Firefox, Safari, Edge (last 2 versions) |
| **Mobile** | Fully responsive, touch-optimized |
| **Accessibility** | WCAG 2.1 AA compliant |
| **SEO** | Open Graph tags, structured data, semantic HTML |
| **Privacy** | No cookies, no tracking, no personal data stored |
| **Offline** | Calculations work offline (cached exchange rates) |

## 8. Out of Scope (v1)

- User accounts / saved calculations
- Historical data / market trends
- Location-specific data (property taxes by zip code)
- Mortgage pre-qualification
- Rental listing integration
- Comparison of multiple properties
- Mobile app (PWA consideration for v2)

## 9. Success Metrics

| Metric | Target |
|--------|--------|
| Time to first insight | < 5 seconds from page load |
| Calculation accuracy | Matches financial advisor benchmarks within 2% |
| User engagement | Average 3+ calculation iterations per session |
| Share rate | 15% of users share or export results |
| Bounce rate | < 40% |

## 10. Competitive Analysis

| Feature | NYT Calculator | NerdWallet | **Buy or Rent** |
|---------|---------------|------------|-----------------|
| Instant results | ❌ (20+ inputs first) | ❌ (form-heavy) | ✅ (2 inputs) |
| Multi-currency | ❌ (USD only) | ❌ (USD only) | ✅ (160+ currencies) |
| Modern UI | ⚠️ (dated) | ⚠️ (cluttered) | ✅ (dashboard) |
| Mobile experience | ⚠️ | ⚠️ | ✅ (mobile-first) |
| Shareable | ❌ | ❌ | ✅ (URL encoding) |
| No signup | ✅ | ❌ | ✅ |
| Open source | ❌ | ❌ | ✅ |

---

*This specification defines the v1.0 MVP. Future versions may include location-specific data, historical trends, and PWA capabilities.*
