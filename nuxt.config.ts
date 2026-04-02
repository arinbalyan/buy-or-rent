export default defineNuxtConfig({
  compatibilityDate: '2025-05-15',

  modules: [
    '@nuxtjs/tailwindcss',
    '@nuxt/eslint',
  ],

  app: {
    head: {
      title: 'Buy or Rent — Property Decision Calculator',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Instant buy vs rent property calculator with multi-currency support. Should you buy or rent? Get instant financial insights.' },
        { property: 'og:title', content: 'Buy or Rent — Property Decision Calculator' },
        { property: 'og:description', content: 'Should you buy or rent? Get instant financial insights in any currency.' },
        { property: 'og:type', content: 'website' },
        { name: 'twitter:card', content: 'summary_large_image' },
      ],
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap' },
      ],
      script: [
        {
          innerHTML: `if(localStorage.getItem('theme')==='dark'||(!localStorage.getItem('theme')&&matchMedia('(prefers-color-scheme:dark)').matches))document.documentElement.classList.add('dark')`,
          tagPosition: 'bodyClose',
          tagPriority: 'critical',
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
