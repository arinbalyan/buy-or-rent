import type { Insight } from './calculator'

export type InsightType = Insight['type']
export type InsightSeverity = NonNullable<Insight['severity']>
