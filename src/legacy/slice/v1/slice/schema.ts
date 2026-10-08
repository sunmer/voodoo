import {z} from 'zod';
import {textsSchema, themeSchema} from '../contract';

export const sliceSchema = z.object({
  texts: textsSchema(['brand', 'headline', 'point1', 'point2', 'point3', 'cta'] as const),
  theme: themeSchema,
});

export type SliceProps = z.infer<typeof sliceSchema>;
