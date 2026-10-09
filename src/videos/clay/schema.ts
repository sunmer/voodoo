import {z} from 'zod';
import {textsSchema, themeSchema} from '../contract';

export const claySchema = z.object({
  texts: textsSchema(['brand', 'headline', 'subhead'] as const),
  theme: themeSchema,
});

export type ClayProps = z.infer<typeof claySchema>;
