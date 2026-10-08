import {z} from 'zod';
import {textsSchema, themeSchema} from '../contract';

export const webinarSchema = z.object({
  texts: textsSchema(['brand', 'headline', 'author', 'date', 'cta'] as const),
  theme: themeSchema,
});

export type WebinarProps = z.infer<typeof webinarSchema>;
