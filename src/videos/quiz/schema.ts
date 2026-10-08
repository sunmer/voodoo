import {z} from 'zod';
import {textsSchema, themeSchema} from '../contract';

export const quizSchema = z.object({
  texts: textsSchema(['headline', 'quote', 'items', 'cta'] as const),
  theme: themeSchema,
});

export type QuizProps = z.infer<typeof quizSchema>;
