import {z} from 'zod';
import {textsSchema, themeSchema} from '../contract';

export const timelineSchema = z.object({
  texts: textsSchema(['headline', 'items', 'brand', 'attribution'] as const),
  theme: themeSchema,
});

export type TimelineProps = z.infer<typeof timelineSchema>;
