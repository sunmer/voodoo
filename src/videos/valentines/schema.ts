import {z} from 'zod';
import {textsSchema, themeSchema} from '../contract';

export const valentinesSchema = z.object({
  texts: textsSchema(['brand', 'headline', 'price', 'priceNote', 'date', 'cta'] as const),
  theme: themeSchema,
});

export type ValentinesProps = z.infer<typeof valentinesSchema>;
