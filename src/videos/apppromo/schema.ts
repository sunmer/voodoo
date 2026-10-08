import {z} from 'zod';
import {textsSchema, themeSchema} from '../contract';

export const apppromoSchema = z.object({
  texts: textsSchema(['brand', 'headline', 'items', 'price', 'cta'] as const),
  theme: themeSchema,
});

export type ApppromoProps = z.infer<typeof apppromoSchema>;
