import {z} from 'zod';
import {textsSchema, themeSchema} from '../contract';

export const hiringSchema = z.object({
  texts: textsSchema(['brand', 'headline', 'subhead', 'items', 'date', 'cta'] as const),
  theme: themeSchema,
});

export type HiringProps = z.infer<typeof hiringSchema>;
