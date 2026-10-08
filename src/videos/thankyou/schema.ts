import {z} from 'zod';
import {textsSchema, themeSchema} from '../contract';

export const thankyouSchema = z.object({
  texts: textsSchema(['headline', 'subhead', 'brand', 'cta'] as const),
  theme: themeSchema,
});

export type ThankyouProps = z.infer<typeof thankyouSchema>;
