import {z} from 'zod';
import {textsSchema, themeSchema} from '../contract';

export const comingsoonSchema = z.object({
  texts: textsSchema(['brand', 'headline', 'date', 'cta'] as const),
  theme: themeSchema,
});

export type ComingsoonProps = z.infer<typeof comingsoonSchema>;
