import {z} from 'zod';
import {textsSchema, themeSchema} from '../contract';

export const birthdaySchema = z.object({
  texts: textsSchema(['headline', 'author', 'date', 'subhead'] as const),
  theme: themeSchema,
});

export type BirthdayProps = z.infer<typeof birthdaySchema>;
