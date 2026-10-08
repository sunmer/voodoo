import {z} from 'zod';
import {textsSchema, themeSchema} from '../contract';

export const newyearSchema = z.object({
  texts: textsSchema(['brand', 'date', 'headline', 'subhead', 'cta'] as const),
  theme: themeSchema,
});

export type NewyearProps = z.infer<typeof newyearSchema>;
