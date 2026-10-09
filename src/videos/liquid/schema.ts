import {z} from 'zod';
import {textsSchema, themeSchema} from '../contract';

export const liquidSchema = z.object({
  texts: textsSchema(['brand', 'headline', 'cta'] as const),
  theme: themeSchema,
});

export type LiquidProps = z.infer<typeof liquidSchema>;
