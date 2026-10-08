import {z} from 'zod';
import {textsSchema, themeSchema} from '../contract';

export const agendaSchema = z.object({
  texts: textsSchema(['brand', 'headline', 'date', 'items'] as const),
  theme: themeSchema,
});

export type AgendaProps = z.infer<typeof agendaSchema>;
