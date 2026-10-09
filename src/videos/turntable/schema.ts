import {z} from 'zod';
import {textsSchema, themeSchema} from '../contract';

export const turntableSchema = z.object({
  texts: textsSchema(['brand', 'headline', 'price', 'cta'] as const),
  theme: themeSchema,
});

export type TurntableProps = z.infer<typeof turntableSchema>;
