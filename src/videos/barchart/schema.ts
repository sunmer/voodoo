import {z} from 'zod';
import {textsSchema, themeSchema} from '../contract';

export const barchartSchema = z.object({
  texts: textsSchema(['brand', 'headline', 'subhead', 'chart', 'attribution'] as const),
  theme: themeSchema,
});

export type BarchartProps = z.infer<typeof barchartSchema>;
