import {z} from 'zod';
import {textsSchema, themeSchema} from '../contract';

export const papercutSchema = z.object({
  texts: textsSchema(['brand', 'headline', 'subhead'] as const),
  theme: themeSchema,
});

export type PapercutProps = z.infer<typeof papercutSchema>;
