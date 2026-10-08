import {z} from 'zod';
import {textsSchema, themeSchema} from '../contract';

export const counterSchema = z.object({
  texts: textsSchema(['brand', 'headline', 'stat', 'subhead', 'attribution', 'cta'] as const),
  theme: themeSchema,
});

export type CounterProps = z.infer<typeof counterSchema>;
