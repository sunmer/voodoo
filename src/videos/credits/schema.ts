import {z} from 'zod';
import {textsSchema, themeSchema} from '../contract';

export const creditsSchema = z.object({
  texts: textsSchema(['headline', 'items', 'brand', 'cta'] as const),
  theme: themeSchema,
});

export type CreditsProps = z.infer<typeof creditsSchema>;
