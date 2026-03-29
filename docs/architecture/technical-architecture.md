# Buy or Rent — Technical Architecture

> Serverless Nuxt.js application with TypeScript, zero database, client-side calculations, and live currency support.

**Version:** 1.0.0
**Date:** 2026-03-29
**Status:** Draft

---

## 1. Technology Stack

| Layer | Technology | Rationale |
|-------|-----------|-----------|
| **Framework** | Nuxt 4 (Vue 3) | SSR/SSG support, file-based routing, TypeScript-first |
| **Language** | TypeScript 5.x | Type safety for financial calculations |
| **Styling** | Tailwind CSS 4 | Utility-first, dark mode support, minimal bundle |
| **Charts** | Chart.js + vue-chartjs | Lightweight, responsive, animated charts |
| **Currency** | Intl.NumberFormat + ExchangeRate-API | Native formatting, free exchange rates |
| **Build** | Vite (via Nuxt) | Fast HMR, optimized production builds |
| **Hosting** | Vercel / Netlify / Cloudflare Pages | Free tier, edge deployment, zero config |
| **Analytics** | None (privacy-first) | No tracking in v1 |

## 2. Project Structure

```
buy-or-rent/
├── app/
│   ├── components/
│   │   ├── calculator/
│   │   │   ├── InputPanel.vue          # Main input form
│   │   │   ├── AdvancedOptions.vue     # Collapsible advanced inputs
│   │   │   ├── CurrencySelector.vue    # Currency dropdown with search
│   │   │   └── SliderInput.vue         # Reusable slider + number input
│   │   ├── dashboard/
│   │   │   ├── VerdictCard.vue         # Buy/Rent recommendation
│   │   │   ├── BreakEvenTimeline.vue   # Visual break-even indicator
│   │   │   ├── TotalCostChart.vue      # Bar chart comparison
│   │   │   ├── MonthlyCashFlow.vue     # Line chart over time
│   │   │   ├── NetWorthProjection.vue  # Area chart equity vs invested
│   │   │   └── CostBreakdown.vue       # Donut charts
│   │   ├── insights/
│   │   │   ├── InsightsPanel.vue       # Container for insight cards
│   │   │   └── InsightCard.vue         # Single insight with icon
│   │   ├── ui/
│   │   │   ├── Card.vue                # Reusable card wrapper
│   │   │   ├── Toggle.vue              # Dark/light mode toggle
│   │   │   ├── Tooltip.vue             # Hover tooltip
│   │   │   └── ShareButton.vue         # Share/export actions
│   │   └── layout/
│   │       ├── AppHeader.vue           # Logo + currency + theme
│   │       └── AppFooter.vue           # Attribution + methodology
│   ├── composables/
│   │   ├── useCalculator.ts            # Core calculation engine
│   │   ├── useCurrency.ts              # Currency formatting & conversion
│   │   ├── useExchangeRates.ts         # Fetch & cache exchange rates
│   │   ├── useInsights.ts              # Generate contextual insights
│   │   ├── useShareUrl.ts              # URL encoding/decoding
│   │   └── useTheme.ts                 # Dark/light mode management
│   ├── utils/
│   │   ├── financial.ts                # Pure financial calculation functions
│   │   ├── currencies.ts               # ISO 4217 currency data
│   │   ├── formatters.ts               # Number/currency formatting helpers
│   │   └── validators.ts               # Input validation
│   ├── types/
│   │   ├── calculator.ts               # Calculator input/output types
│   │   ├── currency.ts                 # Currency-related types
│   │   └── insights.ts                 # Insight types
│   ├── assets/
│   │   └── css/
│   │       └── main.css                # Tailwind + custom styles
│   ├── pages/
│   │   └── index.vue                   # Single page application
│   ├── app.vue                         # Root component
│   └── app.config.ts                   # App configuration
├── server/
│   └── api/
│       └── rates/
│           └── [base].get.ts           # Proxy for exchange rates (optional)
├── public/
│   ├── favicon.ico
│   └── og-image.png
├── nuxt.config.ts
├── tailwind.config.ts
├── tsconfig.json
├── package.json
└── docs/
    ├── specs/
    ├── architecture/
    └── plans/
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
4. If API fails → Fall back to hardcoded approximate rates for top 30 currencies
5. Cache new rates in localStorage with timestamp
```

**Rationale:**
- Open access endpoint requires no API key
- Rates update once per day, so 24-hour cache is optimal
- localStorage is universally available and persists across sessions
- Fallback rates ensure the app always works

### 3.3 Single Page Architecture (ADR-003)

**Decision:** Entire application is a single route (`/`) with no navigation.

**Rationale:**
- Calculator is a single-purpose tool — no need for routing
- Faster perceived performance (no page transitions)
- Simpler state management (all reactive, no persistence needed)
- Shareable state via URL query parameters

### 3.4 Chart Library Selection (ADR-004)

**Decision:** Chart.js with vue-chartjs wrapper.

**Alternatives considered:**
- D3.js — Too low-level, overkill for standard chart types
- ApexCharts — Larger bundle, Vue support less mature
- Recharts — React-only
- Custom SVG — Too much development effort for v1

**Rationale:**
- 60KB gzipped (acceptable)
- Excellent Vue 3 integration via vue-chartjs
- Built-in animations and responsive behavior
- Supports all needed chart types (bar, line, area, doughnut)
- Tree-shakeable — only import needed chart types

### 3.5 Styling Approach (ADR-005)

**Decision:** Tailwind CSS 4 with CSS custom properties for theming.

**Rationale:**
- Utility-first = rapid development, no CSS file juggling
- Built-in dark mode support (`dark:` variant)
- Minimal production bundle (purgeCSS built-in)
- Consistent spacing/color system
- CSS variables for chart colors enable theme switching

## 4. Data Flow

```
User Input (reactive)
       │
       ▼
┌─────────────────┐
│  useCalculator   │ ← useCurrency (formatting)
│  composable      │ ← useExchangeRates (conversion)
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Calculation     │ ← financial.ts (pure functions)
│  Result Object   │
└────────┬────────┘
         │
    ┌────┴────┬──────────┬──────────┐
    ▼         ▼          ▼          ▼
Verdict   Charts    Insights    Share URL
Card      (4x)     Panel       (encoded)
```

### 4.1 Calculation Result Object

```typescript
interface CalculationResult {
  verdict: 'buy' | 'rent'
  confidence: number // 0-100
  breakEvenYears: number | null // null if renting always wins
  
  buying: {
    totalCost: number
    initialCosts: number
    recurringCosts: number
    opportunityCosts: number
    netProceeds: number
    monthlyPayments: number[] // per month over holding period
    equityBuilt: number[] // per year
    taxSavings: number
  }
  
  renting: {
    totalCost: number
    initialCosts: number
    recurringCosts: number
    opportunityCosts: number
    netProceeds: number
    monthlyPayments: number[] // per month over holding period
    investedSavings: number[] // per year
  }
  
  comparison: {
    totalSavings: number // positive = buying saves money
    monthlySavings: number // positive = buying cheaper monthly
    breakEvenMonth: number | null
  }
  
  insights: Insight[]
}
```

## 5. API Design

### 5.1 Exchange Rate Endpoint (Server Route — Optional)

The app can work entirely client-side, but a server route provides a proxy to avoid CORS issues and add caching:

```
GET /api/rates/[base]
```

**Response:**
```json
{
  "base": "USD",
  "rates": { "EUR": 0.92, "GBP": 0.81, ... },
  "lastUpdated": "2026-03-29T00:00:00Z"
}
```

**Implementation:** Nitro server route that proxies to `open.er-api.com` and caches at edge.

### 5.2 URL Share Format

```
/?p=500000&r=2000&c=USD&dp=20&rate=6.5&term=30&stay=10&ptax=1.2&app=3&ri=3&inv=7&ccbuy=4&ccsell=6&maint=1&ins=0.5&hoa=0
```

All parameters are short codes to minimize URL length. Values are decoded on page load and populate the calculator.

## 6. Performance Strategy

### 6.1 Bundle Optimization

- **Lazy load charts**: Chart components loaded only when dashboard scrolls into view
- **Tree-shake Chart.js**: Import only needed chart types (BarController, LineController, etc.)
- **Dynamic currency data**: Load full currency list on demand, show top 20 initially
- **Code splitting**: Nuxt automatic route-based splitting (single route = single chunk)

### 6.2 Rendering Strategy

- **SSG with client hydration**: Pre-render the shell at build time, hydrate with live calculations
- **Critical CSS inlined**: Tailwind purges unused styles, critical CSS inlined in head
- **Font loading**: `font-display: swap` for Inter, preload critical weights

### 6.3 Caching Strategy

| Resource | Cache Strategy |
|----------|---------------|
| HTML | `no-cache` (always fresh) |
| JS/CSS | Immutable with content hash |
| Exchange rates | localStorage, 24h TTL |
| Currency list | localStorage, 7d TTL |
| Fonts | `cache-control: max-age=31536000` |

## 7. Deployment Architecture

```
┌─────────────────────────────────────────────┐
│                 CDN Edge                     │
│  (Vercel / Netlify / Cloudflare Pages)      │
│                                              │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐     │
│  │  HTML    │  │  JS     │  │  CSS    │     │
│  │  (SSG)   │  │ (hashed)│  │ (hashed)│     │
│  └─────────┘  └─────────┘  └─────────┘     │
│                                              │
│  ┌─────────────────────────────────────┐    │
│  │  Server Route (optional)            │    │
│  │  /api/rates/[base] → Edge Function  │    │
│  └─────────────────────────────────────┘    │
└─────────────────────────────────────────────┘
                      │
                      ▼
            ┌─────────────────┐
            │ ExchangeRate-API │
            │ (open.er-api.com)│
            └─────────────────┘
```

### 7.1 Build Configuration

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  ssr: true, // SSG mode with nuxt generate
  nitro: {
    preset: 'vercel', // or 'netlify', 'cloudflare-pages'
  },
  app: {
    head: {
      title: 'Buy or Rent — Property Decision Calculator',
      meta: [
        { name: 'description', content: 'Instant buy vs rent property calculator with multi-currency support' },
        { property: 'og:title', content: 'Buy or Rent — Property Decision Calculator' },
        { property: 'og:description', content: 'Should you buy or rent? Get instant financial insights.' },
        { property: 'og:image', content: '/og-image.png' },
      ],
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap' },
      ],
    },
  },
  modules: ['@nuxtjs/tailwindcss'],
  compatibilityDate: '2026-03-29',
})
```

## 8. Security Considerations

| Concern | Mitigation |
|---------|-----------|
| XSS via URL params | Sanitize all decoded query parameters |
| API rate limiting | Cache aggressively, respect rate limits |
| No user data | No forms submit data, no cookies, no localStorage PII |
| Supply chain | Pin dependency versions, use lockfile |
| CSP | Strict Content-Security-Policy via hosting provider |

## 9. Testing Strategy

| Layer | Tool | Coverage Target |
|-------|------|----------------|
| Unit tests | Vitest | 90%+ for financial calculations |
| Component tests | Vitest + Vue Test Utils | All interactive components |
| E2E tests | Playwright | Critical user flows |
| Visual regression | Playwright screenshots | Dashboard layouts |

## 10. Monitoring & Observability

- **Performance**: Web Vitals reported via `web-vitals` library (client-side only, no server)
- **Errors**: Console error tracking (no external service in v1)
- **Uptime**: Static hosting = inherently high uptime, monitor via hosting provider

---

*This architecture prioritizes simplicity, performance, and zero operational overhead. Every decision optimizes for a fast, reliable, privacy-respecting user experience.*
