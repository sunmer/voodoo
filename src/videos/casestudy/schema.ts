import {z} from 'zod';
import {textsSchema, themeSchema} from '../contract';

export const casestudySchema = z.object({
  texts: textsSchema(['brand', 'headline', 'stat', 'quote', 'attribution', 'cta'] as const),
  theme: themeSchema,
});

export type CasestudyProps = z.infer<typeof casestudySchema>;
