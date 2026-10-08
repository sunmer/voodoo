import {z} from 'zod';
import {textsSchema, themeSchema} from '../contract';

export const toplistSchema = z.object({
  texts: textsSchema(['headline', 'items', 'brand', 'cta'] as const),
  theme: themeSchema,
});

export type ToplistProps = z.infer<typeof toplistSchema>;
