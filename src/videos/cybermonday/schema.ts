import {z} from 'zod';
import {textsSchema, themeSchema} from '../contract';

export const cybermondaySchema = z.object({
  texts: textsSchema(['brand', 'headline', 'subhead', 'price', 'priceNote', 'date', 'cta'] as const),
  theme: themeSchema,
});

export type CybermondayProps = z.infer<typeof cybermondaySchema>;
