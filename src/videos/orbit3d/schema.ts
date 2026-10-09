import {z} from 'zod';
import {textsSchema, themeSchema} from '../contract';

export const orbit3dSchema = z.object({
  texts: textsSchema(['brand', 'headline', 'subhead'] as const),
  theme: themeSchema,
});

export type Orbit3dProps = z.infer<typeof orbit3dSchema>;
