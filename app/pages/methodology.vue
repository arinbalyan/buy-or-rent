<script setup lang="ts">
useHead({
  title: 'Methodology — Buy or Rent Calculator',
  meta: [
    { name: 'description', content: 'Learn how the buy vs rent calculator works. Detailed explanation of our financial model, cost calculations, opportunity cost, and break-even analysis methodology.' },
    { name: 'keywords', content: 'buy vs rent methodology, financial model, cost calculation, opportunity cost, break-even analysis, property calculator' },
    { property: 'og:title', content: 'Methodology — Buy or Rent Calculator' },
    { property: 'og:description', content: 'Detailed explanation of how our buy vs rent calculator works. Learn about our financial model, cost calculations, opportunity cost, and break-even analysis.' },
    { property: 'og:type', content: 'website' },
    { property: 'og:url', content: 'https://buy-or-rent.pellucidco.com/methodology' },
    { property: 'og:image', content: 'https://buy-or-rent.pellucidco.com/og-image.png' },
    { property: 'og:image:width', content: '1200' },
    { property: 'og:image:height', content: '630' },
    { property: 'og:image:alt', content: 'Buy or Rent calculator methodology page' },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: 'Methodology — Buy or Rent Calculator' },
    { name: 'twitter:description', content: 'Detailed explanation of how our buy vs rent calculator works.' },
    { name: 'twitter:image', content: 'https://buy-or-rent.pellucidco.com/og-image.png' },
  ],
  link: [
    { rel: 'canonical', href: 'https://buy-or-rent.pellucidco.com/methodology' },
  ],
})
</script>

<template>
  <div class="max-w-3xl mx-auto space-y-8">
    <div>
      <h1 class="text-3xl font-bold text-[rgb(var(--color-fg))] mb-2">Methodology</h1>
      <p class="text-[rgb(var(--color-fg-muted))]">How the buy vs rent calculator works</p>
    </div>

    <div class="card space-y-6">
      <section class="space-y-3">
        <h2 class="text-xl font-semibold text-[rgb(var(--color-fg))]">Core Principles</h2>
        <p class="text-sm leading-relaxed text-[rgb(var(--color-fg-muted))]">
          This calculator uses a neutral, apples-to-apples comparison methodology that treats both buying and renting scenarios fairly.
          The goal is to calculate the total economic cost of each option over your planned holding period, including opportunity costs.
        </p>
      </section>

      <section class="space-y-3">
        <h2 class="text-xl font-semibold text-[rgb(var(--color-fg))]">Buying Cost Model</h2>
        <div class="space-y-4 text-sm text-[rgb(var(--color-fg-muted))]">
          <div>
            <h3 class="font-medium text-[rgb(var(--color-fg))] mb-1">Initial Costs</h3>
            <ul class="list-disc list-inside space-y-1">
              <li>Down payment (percentage of property price)</li>
              <li>Closing costs (estimated at 2% of purchase price)</li>
            </ul>
          </div>
          <div>
            <h3 class="font-medium text-[rgb(var(--color-fg))] mb-1">Recurring Costs</h3>
            <ul class="list-disc list-inside space-y-1">
              <li>Monthly mortgage payments (principal + interest)</li>
              <li>Property taxes (annual percentage of property value)</li>
              <li>Homeowners insurance (annual percentage)</li>
              <li>Maintenance costs (annual percentage)</li>
              <li>HOA fees (monthly, if applicable)</li>
            </ul>
          </div>
          <div>
            <h3 class="font-medium text-[rgb(var(--color-fg))] mb-1">Proceeds</h3>
            <ul class="list-disc list-inside space-y-1">
              <li>Property appreciation over holding period</li>
              <li>Remaining mortgage principal paid down</li>
              <li>Selling costs (estimated at 6% of sale price)</li>
            </ul>
          </div>
        </div>
      </section>

      <section class="space-y-3">
        <h2 class="text-xl font-semibold text-[rgb(var(--color-fg))]">Renting Cost Model</h2>
        <div class="space-y-4 text-sm text-[rgb(var(--color-fg-muted))]">
          <div>
            <h3 class="font-medium text-[rgb(var(--color-fg))] mb-1">Initial Costs</h3>
            <ul class="list-disc list-inside space-y-1">
              <li>Security deposit (typically 1 month's rent)</li>
            </ul>
          </div>
          <div>
            <h3 class="font-medium text-[rgb(var(--color-fg))] mb-1">Recurring Costs</h3>
            <ul class="list-disc list-inside space-y-1">
              <li>Monthly rent payments</li>
              <li>Renter's insurance (1% of monthly rent)</li>
              <li>Annual rent increases (configurable)</li>
            </ul>
          </div>
          <div>
            <h3 class="font-medium text-[rgb(var(--color-fg))] mb-1">Investment Opportunity</h3>
            <ul class="list-disc list-inside space-y-1">
              <li>Down payment is invested instead of used for home purchase</li>
              <li>Monthly savings (if rent < mortgage) are invested monthly</li>
              <li>Investment returns compound annually at specified rate</li>
            </ul>
          </div>
        </div>
      </section>

      <section class="space-y-3">
        <h2 class="text-xl font-semibold text-[rgb(var(--color-fg))]">Opportunity Cost</h2>
        <p class="text-sm leading-relaxed text-[rgb(var(--color-fg-muted))]">
          The calculator accounts for the opportunity cost of capital by comparing what you would earn if you invested
          your down payment instead of using it to buy a home. This is a critical factor that most simple calculators ignore.
          The investment return rate is configurable and should reflect your expected return from alternative investments.
        </p>
      </section>

      <section class="space-y-3">
        <h2 class="text-xl font-semibold text-[rgb(var(--color-fg))]">Break-Even Analysis</h2>
        <p class="text-sm leading-relaxed text-[rgb(var(--color-fg-muted))]">
          The break-even point is calculated by comparing cumulative costs month-by-month. It shows the exact point in time
          when buying becomes cheaper than renting over the entire holding period. Before this point, renting is typically
          more economical due to high upfront buying costs. After this point, the equity built through homeownership
          usually outweighs the costs.
        </p>
      </section>

      <section class="space-y-3">
        <h2 class="text-xl font-semibold text-[rgb(var(--color-fg))]">Assumptions</h2>
        <div class="text-sm text-[rgb(var(--color-fg-muted))]">
          <ul class="list-disc list-inside space-y-1">
            <li>Mortgage payments are calculated using standard amortization formula</li>
            <li>Property values and rents increase at constant annual rates</li>
            <li>Investment returns are compounded annually</li>
            <li>Tax benefits are configurable and disabled by default</li>
            <li>All values are in nominal dollars (not inflation-adjusted)</li>
          </ul>
        </div>
      </section>

      <section class="space-y-3">
        <h2 class="text-xl font-semibold text-[rgb(var(--color-fg))]">Limitations</h2>
        <div class="text-sm text-[rgb(var(--color-fg-muted))]">
          <ul class="list-disc list-inside space-y-1">
            <li>This calculator provides estimates, not financial advice</li>
            <li>Does not account for variable interest rates</li>
            <li>Does not model tax implications beyond basic configurable tax rate</li>
            <li>Market conditions can change significantly over time</li>
            <li>Personal circumstances and non-financial factors should also be considered</li>
          </ul>
        </div>
      </section>
    </div>

    <div class="flex justify-center">
      <NuxtLink to="/" class="btn btn-primary">
        ← Back to Calculator
      </NuxtLink>
    </div>
  </div>
</template>
