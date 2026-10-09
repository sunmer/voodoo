import {z} from 'zod';
import {textsSchema, themeSchema} from '../contract';

export const iso3dSchema = z.object({
  texts: textsSchema(['headline', 'point1', 'point2', 'point3', 'cta'] as const),
  theme: themeSchema,
});

export type Iso3dProps = z.infer<typeof iso3dSchema>;
