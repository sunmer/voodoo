import {z} from 'zod';
import {textsSchema, themeSchema} from '../contract';

export const countdown3dSchema = z.object({
  texts: textsSchema(['brand', 'headline', 'date'] as const),
  theme: themeSchema,
});

export type Countdown3dProps = z.infer<typeof countdown3dSchema>;
