import {z} from 'zod';
import {textsSchema, themeSchema} from '../contract';

export const anniversarySchema = z.object({
  texts: textsSchema(['brand', 'headline', 'stat', 'date', 'cta'] as const),
  theme: themeSchema,
});

export type AnniversaryProps = z.infer<typeof anniversarySchema>;
