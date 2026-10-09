import {z} from 'zod';
import {textsSchema, themeSchema} from '../contract';

export const vhsintroSchema = z.object({
  texts: textsSchema(['brand', 'headline', 'date'] as const),
  theme: themeSchema,
});

export type VhsintroProps = z.infer<typeof vhsintroSchema>;
