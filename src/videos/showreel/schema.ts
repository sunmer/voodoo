import {z} from 'zod';
import {textsSchema, themeSchema} from '../contract';

export const showreelSchema = z.object({
  texts: textsSchema(['brand', 'headline', 'point1', 'point2', 'point3', 'subhead', 'cta'] as const),
  theme: themeSchema,
});

export type ShowreelProps = z.infer<typeof showreelSchema>;
