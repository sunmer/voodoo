import {z} from 'zod';
import {textsSchema, themeSchema} from '../contract';

export const chrome3dSchema = z.object({
  texts: textsSchema(['brand', 'headline', 'cta'] as const),
  theme: themeSchema,
});

export type Chrome3dProps = z.infer<typeof chrome3dSchema>;
