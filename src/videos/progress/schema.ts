import {z} from 'zod';
import {textsSchema, themeSchema} from '../contract';

export const progressSchema = z.object({
  texts: textsSchema(['headline', 'stat', 'subhead', 'brand'] as const),
  theme: themeSchema,
});

export type ProgressProps = z.infer<typeof progressSchema>;
