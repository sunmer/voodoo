import {z} from 'zod';
import {textsSchema, themeSchema} from '../contract';

export const teamintroSchema = z.object({
  texts: textsSchema(['brand', 'headline', 'author', 'attribution', 'quote'] as const),
  theme: themeSchema,
});

export type TeamintroProps = z.infer<typeof teamintroSchema>;
