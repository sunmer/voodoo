import {z} from 'zod';
import {textsSchema, themeSchema} from '../contract';

export const title3dSchema = z.object({
  texts: textsSchema(['brand', 'headline', 'subhead'] as const),
  theme: themeSchema,
});

export type Title3dProps = z.infer<typeof title3dSchema>;
