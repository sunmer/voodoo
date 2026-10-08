import {z} from 'zod';
import {textsSchema, themeSchema} from '../contract';

export const countdownSchema = z.object({
  texts: textsSchema(['brand', 'headline', 'subhead', 'cta'] as const),
  theme: themeSchema,
});

export type CountdownProps = z.infer<typeof countdownSchema>;
