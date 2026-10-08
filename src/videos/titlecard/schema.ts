import {z} from 'zod';
import {textsSchema, themeSchema} from '../contract';

export const titlecardSchema = z.object({
  texts: textsSchema(['brand', 'headline', 'subhead'] as const),
  theme: themeSchema,
});

export type TitlecardProps = z.infer<typeof titlecardSchema>;
