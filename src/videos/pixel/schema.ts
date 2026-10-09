import {z} from 'zod';
import {textsSchema, themeSchema} from '../contract';

export const pixelSchema = z.object({
  texts: textsSchema(['headline', 'subhead', 'cta'] as const),
  theme: themeSchema,
});

export type PixelProps = z.infer<typeof pixelSchema>;
