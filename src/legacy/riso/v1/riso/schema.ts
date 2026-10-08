import {z} from 'zod';
import {textsSchema, themeSchema} from '../contract';

export const risoSchema = z.object({
  texts: textsSchema(['brand', 'headline', 'subhead', 'point1', 'point2', 'point3', 'cta'] as const),
  theme: themeSchema,
});

export type RisoProps = z.infer<typeof risoSchema>;
