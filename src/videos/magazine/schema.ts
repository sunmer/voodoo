import {z} from 'zod';
import {textsSchema, themeSchema} from '../contract';

export const magazineSchema = z.object({
  texts: textsSchema(['brand', 'headline', 'subhead', 'date'] as const),
  theme: themeSchema,
});

export type MagazineProps = z.infer<typeof magazineSchema>;
