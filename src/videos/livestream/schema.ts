import {z} from 'zod';
import {textsSchema, themeSchema} from '../contract';

export const livestreamSchema = z.object({
  texts: textsSchema(['brand', 'headline', 'date', 'items', 'cta'] as const),
  theme: themeSchema,
});

export type LivestreamProps = z.infer<typeof livestreamSchema>;
