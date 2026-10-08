import {z} from 'zod';
import {textsSchema, themeSchema} from '../contract';

export const pollSchema = z.object({
  texts: textsSchema(['headline', 'point1', 'point2', 'cta'] as const),
  theme: themeSchema,
});

export type PollProps = z.infer<typeof pollSchema>;
