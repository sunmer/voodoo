import {z} from 'zod';
import {textsSchema, themeSchema} from '../contract';

export const linechartSchema = z.object({
  texts: textsSchema(['headline', 'chart', 'subhead', 'attribution'] as const),
  theme: themeSchema,
});

export type LinechartProps = z.infer<typeof linechartSchema>;
