import {z} from 'zod';
import {textsSchema, themeSchema} from '../contract';

export const quotecardSchema = z.object({
  texts: textsSchema(['headline', 'quote', 'author', 'attribution', 'brand'] as const),
  theme: themeSchema,
});

export type QuotecardProps = z.infer<typeof quotecardSchema>;
