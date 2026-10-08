import {z} from 'zod';
import {textsSchema, themeSchema} from '../contract';

export const comparisonSchema = z.object({
  texts: textsSchema(['headline', 'point1', 'point2', 'items', 'cta'] as const),
  theme: themeSchema,
});

export type ComparisonProps = z.infer<typeof comparisonSchema>;
