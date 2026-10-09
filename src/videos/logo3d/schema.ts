import {z} from 'zod';
import {textsSchema, themeSchema} from '../contract';

export const logo3dSchema = z.object({
  texts: textsSchema(['brand', 'headline', 'cta'] as const),
  theme: themeSchema,
});

export type Logo3dProps = z.infer<typeof logo3dSchema>;
