# Buy or Rent — Technical Architecture

> Serverless Nuxt 3 application with TypeScript, zero database, client-side calculations, and live currency support.

**Version:** 1.1.0
**Date:** 2026-04-02
**Status:** Implemented

---

## 1. Technology Stack

| Layer | Technology | Version | Rationale |
|-------|-----------|---------|-----------|
| **Framework** | Nuxt 3 (Vue 3) | 3.16.2 | SSR support, file-based routing, TypeScript-first |
| **Language** | TypeScript | 5.8.2 | Type safety for financial calculations |
| **Styling** | Tailwind CSS 4 | via @nuxtjs/tailwindcss 6.13.2 | Utility-first, CSS variable theming, dark mode |
| **Charts** | Chart.js + vue-chartjs | 4.4.7 / 5.3.2 | Bar, line, area, doughnut chart types |
| **Currency** | Intl.NumberFormat + ExchangeRate-API | — | Native formatting, 45 currencies, free rates |
| **Build** | Vite (via Nuxt) | — | Fast HMR, optimized production builds |
| **Hosting** | Vercel (Nitro preset) | — | Serverless deployment, edge functions |
| **Analytics** | None | — | Privacy-first, no tracking |

## 2. Project Structure

```
buy-or-rent/
├── app/
│   ├── app.vue                          # Root layout + theme wrapper
│   ├── pages/
│   │   └── index.vue                    # Single-page calculator layout
│   ├── components/
│   │   ├── calculator/
│   │   │   ├── InputPanel.vue           # Property price, rent, advanced options (collapsible)
│   │   │   ├── CurrencySelector.vue     # Currency dropdown (45 currencies)
│   │   │   └── SliderInput.vue          # Reusable slider + number input
│   │   ├── dashboard/
│   │   │   ├── VerdictCard.vue          # BUY/RENT recommendation + confidence
│   │   │   ├── BreakEvenTimeline.vue    # Visual break-even indicator
│   │   │   ├── TotalCostChart.vue       # Grouped bar chart
│   │   │   ├── MonthlyCashFlow.vue      # Line chart over time
│   │   │   ├── NetWorthProjection.vue   # Area chart
│   │   │   └── CostBreakdown.vue        # Donut charts
│   │   ├── insights/
│   │   │   ├── InsightsPanel.vue        # Insight cards container
│   │   │   └── InsightCard.vue          # Single insight card
│   │   ├── ui/
│   │   │   ├── Card.vue                 # Reusable card wrapper
│   │   │   └── ShareButton.vue          # Copy shareable URL to clipboard
│   │   └── layout/
│   │       ├── AppHeader.vue            # Logo, currency slot, theme toggle
│   │       └── AppFooter.vue            # Attribution + methodology
│   ├── composables/
│   │   ├── useCalculator.ts             # Core engine + insight generation (inline)
│   │   ├── useCurrency.ts               # 45 currencies + Intl formatting
│   │   ├── useExchangeRates.ts          # ExchangeRate-API + localStorage cache
│   │   ├── useShareUrl.ts               # URL encode/decode + clipboard copy
│   │   └── useTheme.ts                  # Dark/light mode management
│   ├── utils/
│   │   ├── financial.ts                 # Pure calculation functions
│   │   └── chart-helpers.ts             # Axis label formatting
│   ├── types/
│   │   ├── calculator.ts                # CalculatorInputs, CalculationResult, Insight, DEFAULT_INPUTS
│   │   ├── currency.ts                  # Currency, ExchangeRates
│   │   └── insights.ts                  # InsightType, InsightSeverity type aliases
│   └── assets/css/
│       └── main.css                     # Tailwind + CSS custom properties + component classes
├── server/
│   └── api/
│       └── rates/
│           └── [base].get.ts            # Exchange rate proxy (optional)
├── public/
├── docs/
├── nuxt.config.ts
├── tailwind.config.ts
└── package.json
```

## 3. Architecture Decisions

### 3.1 Client-Side Calculations (ADR-001)

**Decision:** All financial calculations run entirely in the browser.

**Rationale:**
- Zero server dependency = maximum uptime, minimal hosting cost
- Financial calculations are deterministic and CPU-light
- No user data to protect = no privacy concerns
- Instant feedback without network latency
- Works offline after initial page load

**Trade-offs:**
- Calculation logic exposed in client bundle (acceptable — this is a calculator, not a secret)
- Cannot store results server-side (acceptable — URL encoding for sharing)

### 3.2 Exchange Rate Strategy (ADR-002)

**Decision:** Use ExchangeRate-API open access endpoint with localStorage caching.

**Flow:**
```
1. Page loads → Check localStorage for cached rates
2. If cache hit AND < 24 hours old → Use cached rates
3. If cache miss OR expired → Fetch from open.er-api.com/v6/latest/{base}
4. If API fails → Fall back to hardcoded rates for 45 currencies
5. Cache new rates in localStorage with timestamp
```

**Implementation:** `app/composables/useExchangeRates.ts`
- Cache key: `bor_exchange_rates`
- TTL: 24 hours
- Fallback: 45 hardcoded rates in `FALLBACK_RATES` constant
- Fetch triggered in `onMounted()` — skipped on server (`import.meta.server` guard)

### 3.3 Single Page Architecture (ADR-003)

**Decision:** Entire application is a single route (`/`) with no navigation.

**Rationale:**
- Calculator is a single-purpose tool — no need for routing
- Faster perceived performance (no page transitions)
- Simpler state management (all reactive via `useState`)
- Shareable state via URL query parameters

### 3.4 Chart Library Selection (ADR-004)

**Decision:** Chart.js with vue-chartjs wrapper.

**Alternatives considered:**
- D3.js — Too low-level, overkill for standard chart types
- ApexCharts — Larger bundle, Vue support less mature
- Recharts — React-only
- Custom SVG — Too much development effort for v1

**Rationale:**
- Excellent Vue 3 integration via vue-chartjs
- Built-in animations and responsive behavior
- Supports all needed chart types (bar, line, area, doughnut)

**Implementation detail:** Charts are wrapped in `<ClientOnly>` with loading fallback to prevent SSR hydration mismatches:

```vue
<ClientOnly>
  <TotalCostChart />
  <template #fallback>
    <div class="card flex h-56 items-center justify-center">
      <span class="animate-pulse-soft text-sm">Loading chart...</span>
    </div>
  </template>
</ClientOnly>
```

### 3.5 Styling Approach (ADR-005)

**Decision:** Tailwind CSS 4 with CSS custom properties for theming.

**Rationale:**
- Utility-first = rapid development, no CSS file juggling
- Dark mode via `class` strategy (manual toggle)
- CSS variables for all colors enable instant theme switching without rebuild
- Custom component classes (`.card`, `.input-field`, `.btn-primary`, `.btn-ghost`) defined in `@layer components`

## 4. Component Hierarchy

```
app.vue
├── AppHeader
│   ├── Logo + title
│   ├── CurrencySelector (slot)
│   └── Theme toggle button
├── NuxtPage → pages/index.vue
│   ├── InputPanel (sticky sidebar, lg:col-span-4)
│   │   ├── Property price input + slider
│   │   ├── Monthly rent input + slider
│   │   ├── AdvancedOptions (collapsible section)
│   │   │   └── 12× SliderInput components
│   │   │   └── HOA fees input
│   │   │   └── Reset to defaults button
│   │   ├── CurrencySelector
│   │   └── ShareButton
│   └── Dashboard (main content, lg:col-span-8)
│       ├── VerdictCard
│       ├── BreakEvenTimeline
│       ├── Chart grid (2×2)
│       │   ├── TotalCostChart (ClientOnly)
│       │   ├── MonthlyCashFlow (ClientOnly)
│       │   ├── NetWorthProjection (ClientOnly)
│       │   └── CostBreakdown (ClientOnly)
│       └── InsightsPanel
│           └── InsightCard × N
└── AppFooter
```

## 5. Composable Relationships

```
useCalculator (core engine)
├── useState<CalculatorInputs>('calculatorInputs')  ← shared reactive state
├── useCurrency()                                   ← formatting, currency metadata
│   └── useState('currency')                        ← selected currency code
├── useExchangeRates()                              ← rates, conversion
│   └── useState<ExchangeRates>('exchangeRates')    ← cached rates
├── financial.ts                                    ← pure functions
│   ├── calculateBuyingCosts()
│   ├── calculateRentingCosts()
│   └── calculateBreakEven()
└── generateInsights() [private]                    ← contextual insight generation

useShareUrl
├── useState<CalculatorInputs>('calculatorInputs')  ← reads/writes shared state
├── DEFAULT_INPUTS                                  ← diff-based URL encoding
└── CURRENCIES                                      ← currency validation

useTheme
└── useState('theme')                               ← dark mode boolean
```

### State Sharing Pattern

All composables share state through Nuxt's `useState()`, which is SSR-safe and automatically scoped to the request on server and to the session on client:

```ts
// Shared across all composables
const inputs = useState<CalculatorInputs>('calculatorInputs', () => ({
  propertyPrice: 500000,
  monthlyRent: 2000,
  currency: 'USD',
  // ... 15 more fields
}))
```

### Reactive Calculation Pipeline

The `result` computed property in `useCalculator` is the single source of truth:

```ts
const result = computed<CalculationResult>(() => {
  const buying = calculateBuyingCosts(inputs.value)
  const renting = calculateRentingCosts(inputs.value)
  const breakEvenMonth = calculateBreakEven(cumulativeBuying, cumulativeRenting)
  const insights = generateInsights({ verdict, totalSavings, ... })
  return { verdict, confidence, buying, renting, comparison, insights }
})
```

Any input change triggers full recalculation. No debouncing is applied — Vue's reactivity handles update batching.

## 6. Data Flow

```
User Input (reactive inputs)
        │
        ▼
┌──────────────────────────────────────────┐
│  useCalculator.computed<CalculationResult>│
│  ┌────────────────────────────────────┐  │
│  │  calculateBuyingCosts()            │  │
│  │  calculateRentingCosts()           │  │
│  │  calculateBreakEven()              │  │
│  │  generateInsights()                │  │
│  └────────────────────────────────────┘  │
└────────────┬─────────────────────────────┘
             │
     ┌───────┼──────────┬──────────┬──────────┐
     ▼       ▼          ▼          ▼          ▼
  Verdict  Charts     Insights   BreakEven  Share URL
  Card     (4×)       Panel      Timeline   (encoded)
```

### 6.1 Calculation Result Object

```typescript
// app/types/calculator.ts
interface CalculationResult {
  verdict: 'buy' | 'rent'
  confidence: number            // 0-100, based on savings ratio
  breakEvenYears: number | null // null if renting always wins

  buying: CostBreakdown & {
    monthlyPayments: number[]   // per month over holding period
    equityBuilt: number[]       // per year
    taxSavings: number
    salePrice: number
    remainingMortgage: number
  }

  renting: CostBreakdown & {
    monthlyPayments: number[]   // per month over holding period
    investedSavings: number[]   // per year
  }

  comparison: {
    totalSavings: number        // positive = buying saves money
    monthlySavings: number      // positive = buying cheaper monthly
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
```

## 7. SSR vs Client Boundaries

### Server-Side (SSR)

| What | Why |
|------|-----|
| HTML shell rendering | Fast initial paint, SEO meta tags |
| `nuxt.config.ts` head config | OG tags, font preconnect, theme detection script |
| Server API route `/api/rates/[base]` | Optional proxy for exchange rates |

### Client-Side Only

| What | Mechanism |
|------|-----------|
| All chart components | `<ClientOnly>` wrapper with loading fallback |
| Financial calculations | `computed()` triggers on client after hydration |
| Exchange rate fetching | `onMounted()` guard + `import.meta.server` check |
| URL decode from query params | `onMounted()` + `window.location.search` |
| Theme detection | `onMounted()` reads `localStorage` + `matchMedia` |
| Clipboard copy | `navigator.clipboard.writeText()` |
| localStorage caching | Browser-only API |

### Theme Flash Prevention

A critical inline script runs before paint to apply dark mode class:

```ts
// nuxt.config.ts — injected at bodyClose, critical priority
innerHTML: `if(localStorage.getItem('theme')==='dark'||(!localStorage.getItem('theme')&&matchMedia('(prefers-color-scheme:dark)').matches))document.documentElement.classList.add('dark')`
```

This prevents the flash of light mode on dark-mode-preferring browsers.

## 8. API Routes

### 8.1 Exchange Rate Proxy

**Route:** `GET /api/rates/[base]`

**File:** `server/api/rates/[base].get.ts`

```ts
export default defineEventHandler(async (event) => {
  const base = getRouterParam(event, 'base') ?? 'USD'
  const response = await fetch(`https://open.er-api.com/v6/latest/${base}`)
  const data = await response.json()
  return { base, rates: data.rates, lastUpdated: new Date().toISOString() }
})
```

**Note:** The current client implementation (`useExchangeRates.ts`) fetches directly from `open.er-api.com` rather than using this proxy. The server route is available as an optional fallback for CORS-restricted environments.

### 8.2 URL Share Parameters

**File:** `app/composables/useShareUrl.ts`

All inputs are encoded as short query parameters. Only non-default values are included:

| Param | Field | Example |
|-------|-------|---------|
| `p` | propertyPrice | `500000` |
| `r` | monthlyRent | `2000` |
| `c` | currency | `USD` |
| `dp` | downPaymentPercent | `20` |
| `rate` | mortgageRate | `6.5` |
| `term` | mortgageTermYears | `30` |
| `stay` | holdingPeriodYears | `10` |
| `ptax` | propertyTaxRate | `1.2` |
| `app` | homeAppreciationRate | `3` |
| `ri` | rentIncreaseRate | `3` |
| `inv` | investmentReturnRate | `7` |
| `ccbuy` | buyingClosingCostPercent | `4` |
| `ccsell` | sellingClosingCostPercent | `6` |
| `maint` | maintenanceCostPercent | `1` |
| `ins` | insurancePercent | `0.5` |
| `hoa` | monthlyHoaFees | `0` |
| `tax` | taxRate | `0` |
| `rins` | renterInsurancePercent | `1` |

**Example URL:**
```
/?p=750000&r=3000&dp=25&rate=5.5&stay=15&inv=8
```

Decoding validates currency codes against the `CURRENCIES` list and parses all numeric values with `Number.parseFloat`.

## 9. Performance Strategy

### 9.1 Rendering

| Strategy | Implementation |
|----------|---------------|
| SSR for initial HTML | `ssr: true` in nuxt.config.ts |
| Client-only charts | `<ClientOnly>` prevents SSR hydration mismatch |
| Theme script before paint | Inline script at `bodyClose` with `critical` priority |
| Font preconnect | `<link rel="preconnect">` for Google Fonts |
| `font-display: swap` | Prevents FOIT for Inter font |

### 9.2 Caching

| Resource | Strategy |
|----------|----------|
| Exchange rates | localStorage, 24h TTL |
| Theme preference | localStorage, persistent |
| Calculator state | `useState()` (in-memory, per session) |
| Static assets | Vercel CDN (immutable with content hash) |

### 9.3 Bundle Considerations

- Chart.js is the largest dependency (~60KB gzipped)
- All charts wrapped in `<ClientOnly>` — not included in SSR payload
- Single route = single JS chunk (no route-based code splitting benefit)
- Tailwind purges unused utilities at build time

## 10. Security Considerations

| Concern | Mitigation |
|---------|-----------|
| XSS via URL params | Currency codes validated against whitelist; numeric values parsed with `Number.parseFloat` |
| API rate limiting | 24h localStorage cache minimizes external requests |
| No user data | No forms submit data, no cookies, no PII in localStorage |
| Supply chain | Lockfile (`bun.lock`, `package-lock.json`), pinned versions |
| External font loading | Google Fonts via preconnect, `crossorigin` on gstatic |

## 11. Deployment Architecture

```
┌─────────────────────────────────────────────┐
│                 Vercel Edge                  │
│                                              │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐     │
│  │  HTML    │  │  JS     │  │  CSS    │     │
│  │  (SSR)   │  │ (chunk) │  │ (chunk) │     │
│  └─────────┘  └─────────┘  └─────────┘     │
│                                              │
│  ┌─────────────────────────────────────┐    │
│  │  Server Route (optional)            │    │
│  │  /api/rates/[base] → Serverless Fn  │    │
│  └─────────────────────────────────────┘    │
└─────────────────────────────────────────────┘
                       │
                       ▼
             ┌─────────────────┐
             │ ExchangeRate-API │
             │ (open.er-api.com)│
             └─────────────────┘
```

### Build Configuration

```typescript
// nuxt.config.ts (actual)
export default defineNuxtConfig({
  compatibilityDate: '2025-05-15',
  modules: ['@nuxtjs/tailwindcss', '@nuxt/eslint'],
  ssr: true,
  nitro: { preset: 'vercel' },
  tailwindcss: { cssPath: '~/assets/css/main.css' },
  eslint: { config: { stylistic: true } },
  // ...app head config
})
```

---

*This architecture prioritizes simplicity, performance, and zero operational overhead. Every decision optimizes for a fast, reliable, privacy-respecting user experience.*
