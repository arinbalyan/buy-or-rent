<template>
  <div class="grid grid-cols-1 gap-8 lg:grid-cols-12">
    <aside class="lg:col-span-4 xl:col-span-3">
      <div class="sticky top-24">
        <InputPanel />
      </div>
    </aside>

    <section class="space-y-6 lg:col-span-8 xl:col-span-9">
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
</template>
