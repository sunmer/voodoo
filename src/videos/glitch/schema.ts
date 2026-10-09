import {z} from 'zod';
import {textsSchema, themeSchema} from '../contract';

export const glitchSchema = z.object({
  texts: textsSchema(['brand', 'headline', 'date'] as const),
  theme: themeSchema,
});

export type GlitchProps = z.infer<typeof glitchSchema>;
