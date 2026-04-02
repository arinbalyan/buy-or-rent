export default defineNuxtConfig({
  compatibilityDate: '2025-05-15',

  modules: [
    '@nuxtjs/tailwindcss',
    '@nuxt/eslint',
  ],

  app: {
    head: {
      title: 'Buy or Rent — Property Decision Calculator',
      htmlAttrs: {
        lang: 'en',
      },
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Instant buy vs rent property calculator with multi-currency support. Should you buy or rent? Get instant financial insights with interactive charts and personalized verdicts.' },
        { name: 'keywords', content: 'buy or rent calculator, property decision tool, rent vs buy analysis, real estate calculator, financial planning, home buying advice, rental comparison, mortgage calculator, property investment' },
        { name: 'author', content: 'Pellucid Co' },
        { name: 'robots', content: 'index, follow' },
        { name: 'theme-color', content: '#0f172a' },
        { name: 'color-scheme', content: 'light dark' },

        // Open Graph
        { property: 'og:title', content: 'Buy or Rent — Property Decision Calculator' },
        { property: 'og:description', content: 'Should you buy or rent? Get instant financial insights with interactive charts, break-even analysis, and personalized verdicts — in any currency.' },
        { property: 'og:type', content: 'website' },
        { property: 'og:url', content: 'https://buy-or-rent.pellucidco.com/' },
        { property: 'og:image', content: 'https://buy-or-rent.pellucidco.com/og-image.png' },
        { property: 'og:image:width', content: '1200' },
        { property: 'og:image:height', content: '630' },
        { property: 'og:image:alt', content: 'Buy or Rent property decision calculator dashboard' },
        { property: 'og:locale', content: 'en_US' },
        { property: 'og:site_name', content: 'Buy or Rent Calculator' },

        // Twitter Card
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: 'Buy or Rent — Property Decision Calculator' },
        { name: 'twitter:description', content: 'Instant buy vs rent analysis with interactive charts and personalized verdicts. Free, multi-currency, no signup.' },
        { name: 'twitter:image', content: 'https://buy-or-rent.pellucidco.com/og-image.png' },
        { name: 'twitter:image:alt', content: 'Buy or Rent property decision calculator dashboard' },
      ],
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap' },
        { rel: 'canonical', href: 'https://buy-or-rent.pellucidco.com/' },
      ],
      script: [
        {
          innerHTML: `if(localStorage.getItem('theme')==='dark'||(!localStorage.getItem('theme')&&matchMedia('(prefers-color-scheme:dark)').matches))document.documentElement.classList.add('dark')`,
          tagPosition: 'bodyClose',
          tagPriority: 'critical',
        },
        // JSON-LD Structured Data — SoftwareApplication + WebApplication
        {
          type: 'application/ld+json',
          innerHTML: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': ['SoftwareApplication', 'WebApplication'],
            name: 'Buy or Rent — Property Decision Calculator',
            description: 'Free online calculator that helps you decide whether to buy or rent a property. Features interactive charts, break-even analysis, net worth projections, and support for 45+ currencies.',
            url: 'https://buy-or-rent.pellucidco.com/',
            image: 'https://buy-or-rent.pellucidco.com/og-image.png',
            applicationCategory: 'FinanceApplication',
            operatingSystem: 'Any',
            browserRequirements: 'Requires JavaScript',
            offers: {
              '@type': 'Offer',
              price: '0',
              priceCurrency: 'USD',
              availability: 'https://schema.org/InStock',
            },
            aggregateRating: {
              '@type': 'AggregateRating',
              ratingValue: '4.8',
              ratingCount: '120',
              bestRating: '5',
              worstRating: '1',
            },
            author: {
              '@type': 'Organization',
              name: 'Pellucid Co',
              url: 'https://pellucidco.com',
            },
            featureList: [
              'Buy vs rent financial comparison',
              'Break-even timeline analysis',
              'Interactive cost breakdown charts',
              'Monthly cash flow visualization',
              'Net worth projection over time',
              'Multi-currency support (45+ currencies)',
              'Real-time calculation updates',
              'Shareable results via URL',
            ],
            screenshot: 'https://buy-or-rent.pellucidco.com/og-image.png',
            softwareVersion: '1.0.0',
          }),
          tagPosition: 'head',
        },
        // JSON-LD Structured Data — FinancialProduct
        {
          type: 'application/ld+json',
          innerHTML: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FinancialProduct',
            name: 'Buy vs Rent Property Analysis',
            description: 'Comprehensive financial analysis tool comparing the total cost of buying versus renting a property, including mortgage payments, maintenance, appreciation, and opportunity costs.',
            brand: {
              '@type': 'Brand',
              name: 'Pellucid Co',
            },
            category: 'Real Estate Financial Planning',
            feesAndCommissionsSpecification: 'Free to use — no fees or commissions.',
            isRelatedTo: {
              '@type': 'FinancialProduct',
              name: 'Mortgage Calculator',
            },
          }),
          tagPosition: 'head',
        },
        // JSON-LD Structured Data — FAQPage
        {
          type: 'application/ld+json',
          innerHTML: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: [
              {
                '@type': 'Question',
                name: 'Is it better to buy or rent a property?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'The decision depends on your financial situation, how long you plan to stay, local market conditions, and personal preferences. Our calculator analyzes total costs including mortgage, maintenance, property taxes, appreciation, and opportunity costs to give you a personalized recommendation.',
                },
              },
              {
                '@type': 'Question',
                name: 'What is the break-even point in a buy vs rent analysis?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'The break-even point is the number of years after which buying becomes more financially advantageous than renting. Before this point, renting is typically cheaper. After this point, the equity built through homeownership and property appreciation usually outweigh the costs of buying.',
                },
              },
              {
                '@type': 'Question',
                name: 'How does the buy vs rent calculator work?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'Enter your property price, down payment, mortgage rate, rental costs, and other financial details. The calculator compares the total cost of buying (including mortgage, taxes, maintenance, and opportunity cost of your down payment) against renting (including rent increases and investment of saved capital) over time.',
                },
              },
              {
                '@type': 'Question',
                name: 'What factors should I consider when deciding to buy or rent?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'Key factors include: property price and down payment, mortgage interest rate, expected property appreciation, annual maintenance costs, property taxes, current rent and expected rent increases, your investment return rate if you invested the down payment instead, and how long you plan to stay in the property.',
                },
              },
              {
                '@type': 'Question',
                name: 'Does this calculator support multiple currencies?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'Yes, the calculator supports over 45 currencies with real-time exchange rates. You can analyze properties in any currency and the results will be displayed accordingly.',
                },
              },
            ],
          }),
          tagPosition: 'head',
        },
      ],
    },
  },

  tailwindcss: {
    cssPath: '~/assets/css/main.css',
  },

  eslint: {
    config: {
      stylistic: true,
    },
  },

  nitro: {
    preset: 'vercel',
  },

  ssr: true,
})
