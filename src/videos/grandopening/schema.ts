import {z} from 'zod';
import {textsSchema, themeSchema} from '../contract';

export const grandopeningSchema = z.object({
  texts: textsSchema(['brand', 'headline', 'date', 'attribution', 'cta'] as const),
  theme: themeSchema,
});

export type GrandopeningProps = z.infer<typeof grandopeningSchema>;
