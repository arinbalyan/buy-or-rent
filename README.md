# Buy or Rent — Property Decision Calculator

> Instant buy-vs-rent financial comparison with multi-currency support, break-even analysis, and interactive charts. Runs entirely in the browser.

## Features

- **2-input instant results** — Property price + monthly rent, everything else has sensible defaults
- **45 currencies** — ISO 4217 codes with `Intl.NumberFormat` formatting and ExchangeRate-API live rates
- **Break-even analysis** — Identifies the exact month buying becomes cheaper than renting
- **4 interactive charts** — Total cost comparison, monthly cash flow, net worth projection, cost breakdown (Chart.js)
- **Shareable URLs** — All inputs encoded as query parameters for easy sharing
- **Dark mode** — System preference detection with manual toggle, persisted in `localStorage`

## Quick Start

```bash
bun install
bun run dev          # → http://localhost:3000
bun run build        # Production build
bun run preview      # Preview production build
```

### Deploy to Vercel

```bash
npx vercel deploy --prebuilt
```

The project is configured with `nitro.preset: 'vercel'` in `nuxt.config.ts`.

## Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| Framework | Nuxt 3 | 3.16.2 |
| Language | TypeScript | 5.8.2 |
| Styling | Tailwind CSS 4 | 6.13.2 (module) |
| Charts | Chart.js + vue-chartjs | 4.4.7 / 5.3.2 |
| Linting | ESLint + @nuxt/eslint | 1.3.0 |
| Runtime | Bun / Node.js | — |
| Hosting | Vercel (Nitro preset) | — |

## Project Structure

```
buy-or-rent/
├── app/
│   ├── app.vue                          # Root layout + theme wrapper
│   ├── pages/
│   │   └── index.vue                    # Single-page calculator layout
│   ├── components/
│   │   ├── calculator/
│   │   │   ├── InputPanel.vue           # Property price, rent, advanced options
│   │   │   ├── CurrencySelector.vue     # Currency dropdown (45 currencies)
│   │   │   └── SliderInput.vue          # Reusable slider + number input
│   │   ├── dashboard/
│   │   │   ├── VerdictCard.vue          # BUY/RENT recommendation
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
│   │   │   └── ShareButton.vue          # Copy shareable URL
│   │   └── layout/
│   │       ├── AppHeader.vue            # Logo, currency slot, theme toggle
│   │       └── AppFooter.vue            # Attribution + methodology
│   ├── composables/
│   │   ├── useCalculator.ts             # Core engine + insight generation
│   │   ├── useCurrency.ts               # 45 currencies + Intl formatting
│   │   ├── useExchangeRates.ts          # ExchangeRate-API + localStorage cache
│   │   ├── useShareUrl.ts               # URL encode/decode + clipboard copy
│   │   └── useTheme.ts                  # Dark/light mode management
│   ├── utils/
│   │   ├── financial.ts                 # Pure calculation functions
│   │   └── chart-helpers.ts             # Axis label formatting
│   ├── types/
│   │   ├── calculator.ts                # CalculatorInputs, CalculationResult, Insight
│   │   ├── currency.ts                  # Currency, ExchangeRates
│   │   └── insights.ts                  # InsightType, InsightSeverity aliases
│   └── assets/css/
│       └── main.css                     # Tailwind + CSS custom properties
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

## Configuration Highlights

### `nuxt.config.ts`

```ts
export default defineNuxtConfig({
  compatibilityDate: '2025-05-15',
  modules: ['@nuxtjs/tailwindcss', '@nuxt/eslint'],
  ssr: true,
  nitro: { preset: 'vercel' },
  // Theme script runs before paint to prevent flash
  app: {
    head: {
      script: [{
        innerHTML: `if(localStorage.getItem('theme')==='dark'||...)document.documentElement.classList.add('dark')`,
        tagPosition: 'bodyClose',
        tagPriority: 'critical',
      }],
    },
  },
})
```

### `tailwind.config.ts`

Custom color tokens via CSS variables for theme switching:

```ts
theme: {
  extend: {
    colors: {
      buy: 'rgb(var(--color-buy) / <alpha-value>)',
      rent: 'rgb(var(--color-rent) / <alpha-value>)',
      accent: 'rgb(var(--color-accent) / <alpha-value>)',
    },
    animation: { 'fade-in': 'fadeIn 0.3s ease-out', /* ... */ },
  },
}
```

### Theme Tokens (`app/assets/css/main.css`)

| Token | Light | Dark |
|-------|-------|------|
| `--color-bg` | `255 255 255` | `15 15 15` |
| `--color-bg-card` | `249 250 251` | `30 30 30` |
| `--color-fg` | `17 24 39` | `226 232 240` |
| `--color-buy` | `34 197 94` | `34 197 94` |
| `--color-rent` | `59 130 246` | `96 165 250` |
| `--color-accent` | `99 102 241` | `129 140 248` |

## Deployment

### Vercel (Recommended)

The project is pre-configured for Vercel via `nitro.preset: 'vercel'`.

```bash
# Build locally
bun run build

# Deploy pre-built output
npx vercel deploy --prebuilt
```

### Other Platforms

Change `nitro.preset` in `nuxt.config.ts` to your target:

| Platform | Preset |
|----------|--------|
| Netlify | `netlify` |
| Cloudflare Pages | `cloudflare-pages` |
| Node.js server | `node-server` |
| Static hosting | `static` (use `bun run generate`) |

## Financial Model

The calculator compares total cost of ownership over a configurable holding period. Key components:

- **Buying**: Down payment, closing costs, mortgage payments, property tax, insurance, maintenance, HOA fees, opportunity cost of capital, minus sale proceeds and tax savings
- **Renting**: Security deposit, rent (with annual increases), renter's insurance, opportunity cost of down payment if invested instead

See [Financial Model](docs/financial-model.md) for formulas, default assumptions, and methodology.

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feat/your-feature`
3. Make changes and verify with `bun run dev`
4. Run linting: `bun run lint`
5. Run type checking: `bun run typecheck`
6. Commit and open a pull request

### Code Standards

- TypeScript strict mode
- ESLint with stylistic rules enabled (`@nuxt/eslint`)
- Pure functions in `app/utils/` — no side effects in financial calculations
- Composables in `app/composables/` — reactive state management
- Components follow PascalCase naming
