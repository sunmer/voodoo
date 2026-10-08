import {z} from 'zod';
import {textsSchema, themeSchema} from '../contract';

export const subscribeSchema = z.object({
  texts: textsSchema(['headline', 'brand', 'subhead', 'cta'] as const),
  theme: themeSchema,
});

export type SubscribeProps = z.infer<typeof subscribeSchema>;
