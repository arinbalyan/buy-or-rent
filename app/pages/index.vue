<template>
  <div class="grid grid-cols-1 gap-8 lg:grid-cols-12">
    <aside class="lg:col-span-4 xl:col-span-3">
      <div class="sticky top-24">
        <InputPanel />
      </div>
    </aside>

    <section aria-label="Buy vs Rent Analysis Results" class="space-y-6 lg:col-span-8 xl:col-span-9">
      <VerdictCard />
      <BreakEvenTimeline />

      <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
        <ClientOnly>
          <TotalCostChart />
          <template #fallback>
            <div class="card flex h-56 items-center justify-center">
              <span class="animate-pulse-soft text-sm text-[rgb(var(--color-fg-muted))]">Loading chart...</span>
            </div>
          </template>
        </ClientOnly>
        <ClientOnly>
          <MonthlyCashFlow />
          <template #fallback>
            <div class="card flex h-56 items-center justify-center">
              <span class="animate-pulse-soft text-sm text-[rgb(var(--color-fg-muted))]">Loading chart...</span>
            </div>
          </template>
        </ClientOnly>
        <ClientOnly>
          <NetWorthProjection />
          <template #fallback>
            <div class="card flex h-56 items-center justify-center">
              <span class="animate-pulse-soft text-sm text-[rgb(var(--color-fg-muted))]">Loading chart...</span>
            </div>
          </template>
        </ClientOnly>
        <ClientOnly>
          <CostBreakdown />
          <template #fallback>
            <div class="card flex h-56 items-center justify-center">
              <span class="animate-pulse-soft text-sm text-[rgb(var(--color-fg-muted))]">Loading chart...</span>
            </div>
          </template>
        </ClientOnly>
      </div>

      <InsightsPanel />
    </section>
  </div>

  <!-- SEO Content Section: How It Works -->
  <section aria-label="How the Buy vs Rent Calculator Works" class="mt-16 max-w-4xl">
    <h2 class="mb-6 text-2xl font-semibold text-[rgb(var(--color-fg))]">
      How the Buy vs Rent Calculator Works
    </h2>
    <div class="grid grid-cols-1 gap-6 sm:grid-cols-3">
      <article class="rounded-xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))] p-6">
        <div class="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-[rgb(var(--color-primary))]/10 text-lg font-bold text-[rgb(var(--color-primary))]">
          1
        </div>
        <h3 class="mb-2 text-lg font-medium text-[rgb(var(--color-fg))]">Enter Your Details</h3>
        <p class="text-sm leading-relaxed text-[rgb(var(--color-fg-muted))]">
          Input the property price, your down payment, mortgage rate, monthly rent, and other financial parameters. Choose from 45+ supported currencies.
        </p>
      </article>
      <article class="rounded-xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))] p-6">
        <div class="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-[rgb(var(--color-primary))]/10 text-lg font-bold text-[rgb(var(--color-primary))]">
          2
        </div>
        <h3 class="mb-2 text-lg font-medium text-[rgb(var(--color-fg))]">Instant Analysis</h3>
        <p class="text-sm leading-relaxed text-[rgb(var(--color-fg-muted))]">
          The calculator compares total costs of buying versus renting, factoring in mortgage payments, property taxes, maintenance, appreciation, and opportunity costs.
        </p>
      </article>
      <article class="rounded-xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))] p-6">
        <div class="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-[rgb(var(--color-primary))]/10 text-lg font-bold text-[rgb(var(--color-primary))]">
          3
        </div>
        <h3 class="mb-2 text-lg font-medium text-[rgb(var(--color-fg))]">Get Your Verdict</h3>
        <p class="text-sm leading-relaxed text-[rgb(var(--color-fg-muted))]">
          Receive a clear buy-or-rent recommendation with interactive charts, break-even timeline, and detailed cost breakdowns to make an informed decision.
        </p>
      </article>
    </div>
  </section>

  <!-- SEO Content Section: FAQ -->
  <section aria-label="Frequently Asked Questions" class="mt-12 max-w-4xl">
    <h2 class="mb-6 text-2xl font-semibold text-[rgb(var(--color-fg))]">
      Frequently Asked Questions
    </h2>
    <div class="space-y-4">
      <details class="group rounded-xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))]">
        <summary class="cursor-pointer list-none p-5 text-base font-medium text-[rgb(var(--color-fg))] transition-colors hover:text-[rgb(var(--color-primary))]">
          <span class="flex items-center justify-between">
            Is it better to buy or rent a property?
            <span class="ml-2 text-[rgb(var(--color-fg-muted))] transition-transform group-open:rotate-180">▾</span>
          </span>
        </summary>
        <div class="px-5 pb-5 text-sm leading-relaxed text-[rgb(var(--color-fg-muted))]">
          The decision depends on your financial situation, how long you plan to stay, local market conditions, and personal preferences. Our calculator analyzes total costs including mortgage, maintenance, property taxes, appreciation, and opportunity costs to give you a personalized recommendation.
        </div>
      </details>
      <details class="group rounded-xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))]">
        <summary class="cursor-pointer list-none p-5 text-base font-medium text-[rgb(var(--color-fg))] transition-colors hover:text-[rgb(var(--color-primary))]">
          <span class="flex items-center justify-between">
            What is the break-even point in a buy vs rent analysis?
            <span class="ml-2 text-[rgb(var(--color-fg-muted))] transition-transform group-open:rotate-180">▾</span>
          </span>
        </summary>
        <div class="px-5 pb-5 text-sm leading-relaxed text-[rgb(var(--color-fg-muted))]">
          The break-even point is the number of years after which buying becomes more financially advantageous than renting. Before this point, renting is typically cheaper. After this point, the equity built through homeownership and property appreciation usually outweigh the costs of buying.
        </div>
      </details>
      <details class="group rounded-xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))]">
        <summary class="cursor-pointer list-none p-5 text-base font-medium text-[rgb(var(--color-fg))] transition-colors hover:text-[rgb(var(--color-primary))]">
          <span class="flex items-center justify-between">
            How does the buy vs rent calculator work?
            <span class="ml-2 text-[rgb(var(--color-fg-muted))] transition-transform group-open:rotate-180">▾</span>
          </span>
        </summary>
        <div class="px-5 pb-5 text-sm leading-relaxed text-[rgb(var(--color-fg-muted))]">
          Enter your property price, down payment, mortgage rate, rental costs, and other financial details. The calculator compares the total cost of buying (including mortgage, taxes, maintenance, and opportunity cost of your down payment) against renting (including rent increases and investment of saved capital) over time.
        </div>
      </details>
      <details class="group rounded-xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))]">
        <summary class="cursor-pointer list-none p-5 text-base font-medium text-[rgb(var(--color-fg))] transition-colors hover:text-[rgb(var(--color-primary))]">
          <span class="flex items-center justify-between">
            What factors should I consider when deciding to buy or rent?
            <span class="ml-2 text-[rgb(var(--color-fg-muted))] transition-transform group-open:rotate-180">▾</span>
          </span>
        </summary>
        <div class="px-5 pb-5 text-sm leading-relaxed text-[rgb(var(--color-fg-muted))]">
          Key factors include: property price and down payment, mortgage interest rate, expected property appreciation, annual maintenance costs, property taxes, current rent and expected rent increases, your investment return rate if you invested the down payment instead, and how long you plan to stay in the property.
        </div>
      </details>
      <details class="group rounded-xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))]">
        <summary class="cursor-pointer list-none p-5 text-base font-medium text-[rgb(var(--color-fg))] transition-colors hover:text-[rgb(var(--color-primary))]">
          <span class="flex items-center justify-between">
            Does this calculator support multiple currencies?
            <span class="ml-2 text-[rgb(var(--color-fg-muted))] transition-transform group-open:rotate-180">▾</span>
          </span>
        </summary>
        <div class="px-5 pb-5 text-sm leading-relaxed text-[rgb(var(--color-fg-muted))]">
          Yes, the calculator supports over 45 currencies with real-time exchange rates. You can analyze properties in any currency and the results will be displayed accordingly.
        </div>
      </details>
    </div>
  </section>
</template>
