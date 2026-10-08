import {z} from 'zod';
import {textsSchema, themeSchema} from '../contract';

export const featureSchema = z.object({
  texts: textsSchema(['brand', 'headline', 'items', 'date', 'cta'] as const),
  theme: themeSchema,
});

export type FeatureProps = z.infer<typeof featureSchema>;
