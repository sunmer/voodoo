import {z} from 'zod';
import {textsSchema, themeSchema} from '../contract';

export const doodleSchema = z.object({
  texts: textsSchema(['headline', 'point1', 'point2', 'point3'] as const),
  theme: themeSchema,
});

export type DoodleProps = z.infer<typeof doodleSchema>;
