# Buy or Rent — Implementation Plan

> Phased implementation plan for building the Buy or Rent calculator from zero to production.

**Version:** 1.0.0
**Date:** 2026-03-29
**Status:** Draft
**Estimated Total Time:** 16-20 hours

---

## Phase 1: Project Foundation (2-3 hours)

### 1.1 Initialize Nuxt Project
- [ ] Create Nuxt 4 project with TypeScript
- [ ] Configure `nuxt.config.ts` (SSR, app metadata, modules)
- [ ] Install dependencies: `@nuxtjs/tailwindcss`, `chart.js`, `vue-chartjs`
- [ ] Set up Tailwind CSS 4 with custom theme (colors, fonts, dark mode)
- [ ] Configure TypeScript strict mode
- [ ] Set up ESLint + Prettier

### 1.2 Project Structure
- [ ] Create directory structure per architecture doc
- [ ] Set up type definitions (`types/calculator.ts`, `types/currency.ts`, `types/insights.ts`)
- [ ] Create `app.config.ts` with default values

### 1.3 Base Layout
- [ ] Create `app.vue` with root structure
- [ ] Create `AppHeader.vue` (logo, currency selector placeholder, theme toggle)
- [ ] Create `AppFooter.vue` (attribution, methodology link)
- [ ] Create `pages/index.vue` with page layout grid
- [ ] Implement dark/light mode toggle with system preference detection

**Deliverable:** Running Nuxt app with header, footer, dark mode, and empty dashboard grid.

---

## Phase 2: Financial Engine (3-4 hours)

### 2.1 Currency System
- [ ] Create `utils/currencies.ts` with ISO 4217 currency data (code, name, symbol, decimals, flag emoji)
- [ ] Create `composables/useExchangeRates.ts`:
  - Fetch from `open.er-api.com/v6/latest/{base}`
  - localStorage caching with 24h TTL
  - Fallback hardcoded rates for top 30 currencies
  - Loading/error states
- [ ] Create `composables/useCurrency.ts`:
  - Format numbers using `Intl.NumberFormat`
  - Convert between currencies using exchange rates
  - Parse user input in selected currency format
- [ ] Create `CurrencySelector.vue` with search, flags, and pinned common currencies

### 2.2 Core Calculations
- [ ] Create `utils/financial.ts` with pure functions:
  - `calculateMortgagePayment(principal, rate, termMonths)` → monthly payment
  - `calculateAmortizationSchedule(principal, rate, termMonths)` → payment schedule
  - `calculateBuyingCosts(inputs)` → buying cost breakdown
  - `calculateRentingCosts(inputs)` → renting cost breakdown
  - `calculateOpportunityCost(principal, rate, years)` → compound growth
  - `calculateBreakEven(buyingCosts, rentingCosts, months)` → break-even month
  - `calculateTaxSavings(mortgageInterest, propertyTax, marginalRate, standardDeduction)` → tax benefit
- [ ] Create `utils/validators.ts` for input validation
- [ ] Write comprehensive unit tests for all financial functions (Vitest)

### 2.3 Calculator Composable
- [ ] Create `composables/useCalculator.ts`:
  - Reactive inputs (property price, rent, advanced options)
  - Debounced calculation trigger (300ms)
  - Returns `CalculationResult` object
  - Handles edge cases (zero values, extreme values, negative results)

**Deliverable:** Fully tested financial engine that produces accurate buy-vs-rent comparisons.

---

## Phase 3: Input Panel (2-3 hours)

### 3.1 Basic Inputs
- [ ] Create `SliderInput.vue` — reusable component with slider + number input + currency formatting
- [ ] Create `InputPanel.vue`:
  - Property price input (currency-formatted, slider range 50K-5M)
  - Monthly rent input (currency-formatted, slider range 500-20K)
  - Real-time validation with visual feedback
  - Responsive layout (stacked on mobile, side-by-side on desktop)

### 3.2 Advanced Options
- [ ] Create `AdvancedOptions.vue` — collapsible panel with:
  - Down payment percentage slider
  - Mortgage rate slider
  - Mortgage term selector (15/20/25/30 years)
  - Holding period slider (1-30 years)
  - Property tax rate slider
  - Home appreciation rate slider
  - Rent increase rate slider
  - Investment return rate slider
  - Closing costs sliders (buying + selling)
  - Maintenance cost slider
  - Insurance slider
  - HOA fees input
  - "Reset to defaults" button

### 3.3 URL State Sync
- [ ] Create `composables/useShareUrl.ts`:
  - Encode calculator inputs to URL query params
  - Decode URL params on page load to populate inputs
  - Update URL on input change (replaceState, not pushState)
  - Copy shareable URL to clipboard

**Deliverable:** Fully functional input panel with instant URL sharing.

---

## Phase 4: Dashboard & Charts (4-5 hours)

### 4.1 Verdict & Break-Even
- [ ] Create `VerdictCard.vue`:
  - Large, clear BUY or RENT recommendation
  - Confidence indicator (bar or percentage)
  - Savings amount prominently displayed
  - Color-coded (green for buy, blue for rent)
  - Animated transition when verdict changes
- [ ] Create `BreakEvenTimeline.vue`:
  - Visual timeline bar showing break-even point
  - Year markers
  - "Never" indicator if renting always wins
  - Tooltip with exact month

### 4.2 Charts
- [ ] Create `TotalCostChart.vue` — Grouped bar chart:
  - Buying costs (stacked: initial, recurring, opportunity, minus proceeds)
  - Renting costs (stacked: initial, recurring, opportunity, minus proceeds)
  - Animated on data change
  - Responsive sizing
- [ ] Create `MonthlyCashFlow.vue` — Line chart:
  - Monthly cost of buying over time (mortgage + tax + insurance + maintenance)
  - Monthly cost of renting over time (rent + insurance, increasing annually)
  - Intersection point highlighted
- [ ] Create `NetWorthProjection.vue` — Area chart:
  - Net worth from buying (equity buildup minus costs)
  - Net worth from renting (invested savings growth)
  - Crossover point highlighted
- [ ] Create `CostBreakdown.vue` — Doughnut chart pair:
  - Buying: mortgage interest, property tax, insurance, maintenance, opportunity cost
  - Renting: rent, insurance, opportunity cost

### 4.3 Insights Panel
- [ ] Create `InsightCard.vue` — Single insight with icon, text, and optional subtext
- [ ] Create `InsightsPanel.vue` — Container that generates contextual insights:
  - Break-even insight
  - Monthly cost difference
  - Total cost difference
  - Equity after holding period
  - Investment opportunity comparison
  - Risk warnings (if applicable)
- [ ] Create `composables/useInsights.ts` — Logic for generating relevant insights based on results

### 4.4 Dashboard Layout
- [ ] Wire up `pages/index.vue` with all dashboard components
- [ ] Implement responsive grid (CSS Grid with auto-fit)
- [ ] Add loading skeleton for charts
- [ ] Add smooth scroll to dashboard when results update

**Deliverable:** Complete dashboard with all charts, verdict, and insights updating in real-time.

---

## Phase 5: Polish & Share (2-3 hours)

### 5.1 Share & Export
- [ ] Create `ShareButton.vue` with:
  - Copy link to clipboard
  - Export as PDF (using `html2canvas` + `jspdf` or browser print)
  - Social share (Twitter, LinkedIn)
- [ ] Implement PDF export with branded layout

### 5.2 Responsive Refinement
- [ ] Test and fix mobile layout (320px-768px)
- [ ] Test and fix tablet layout (768px-1024px)
- [ ] Test and fix desktop layout (1024px+)
- [ ] Touch-friendly slider controls on mobile
- [ ] Chart responsiveness (legend position, label rotation)

### 5.3 Accessibility
- [ ] ARIA labels on all interactive elements
- [ ] Keyboard navigation for sliders and inputs
- [ ] Screen reader announcements for verdict changes
- [ ] Focus management
- [ ] Color contrast verification (WCAG AA)
- [ ] Reduced motion support (`prefers-reduced-motion`)

### 5.4 Performance Optimization
- [ ] Lazy load chart components (dynamic imports)
- [ ] Optimize bundle size (analyze with `nuxi analyze`)
- [ ] Preload critical fonts
- [ ] Verify Core Web Vitals targets

**Deliverable:** Production-ready application with share, export, accessibility, and performance optimization.

---

## Phase 6: Deployment & Launch (1-2 hours)

### 6.1 Pre-launch
- [ ] Create OG image for social sharing
- [ ] Add favicon and app icons
- [ ] Write methodology page (`/methodology`)
- [ ] Final cross-browser testing (Chrome, Firefox, Safari, Edge)
- [ ] Final mobile testing (iOS Safari, Chrome Android)

### 6.2 Deployment
- [ ] Configure Vercel/Netlify deployment
- [ ] Set up custom domain (if applicable)
- [ ] Configure edge caching headers
- [ ] Verify exchange rate API works from deployed environment
- [ ] Run Lighthouse audit (target: 95+ all categories)

### 6.3 Launch
- [ ] Final smoke test on production URL
- [ ] Verify share URLs work
- [ ] Verify currency conversion works
- [ ] Verify dark mode works
- [ ] Monitor for errors in first 24 hours

**Deliverable:** Live, production-deployed application.

---

## Dependency Graph

```
Phase 1 (Foundation)
    │
    ├──► Phase 2 (Financial Engine)
    │         │
    │         ├──► Phase 3 (Input Panel)
    │         │         │
    │         │         └──► Phase 4 (Dashboard & Charts)
    │         │                    │
    │         └────────────────────┘
    │                               │
    │                               ▼
    │                        Phase 5 (Polish & Share)
    │                               │
    │                               ▼
    │                        Phase 6 (Deployment)
    │
    └──► Can parallelize: Types, Utils, Composables
```

## Risk Register

| Risk | Impact | Mitigation |
|------|--------|-----------|
| Exchange rate API downtime | Medium | Fallback hardcoded rates, localStorage cache |
| Chart.js bundle size | Low | Tree-shake imports, lazy load |
| Financial calculation accuracy | High | Unit tests against known benchmarks, compare with NYT/NerdWallet |
| Mobile chart rendering | Medium | Responsive config, test on real devices |
| URL length limits | Low | Short param names, base64 encode if needed |

## Definition of Done

Each phase is complete when:
1. All checklist items are checked
2. Unit tests pass (for phases with calculations)
3. Components render correctly in light and dark mode
4. Responsive layout verified at 3 breakpoints
5. No console errors or warnings
6. Code reviewed (self-review minimum)

---

*This plan is designed for iterative execution. Each phase produces a working increment that can be tested and validated before proceeding.*
