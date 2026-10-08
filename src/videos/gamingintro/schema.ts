import {z} from 'zod';
import {textsSchema, themeSchema} from '../contract';

export const gamingintroSchema = z.object({
  texts: textsSchema(['brand', 'headline', 'subhead'] as const),
  theme: themeSchema,
});

export type GamingintroProps = z.infer<typeof gamingintroSchema>;
