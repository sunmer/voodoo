import {z} from 'zod';
import {textsSchema, themeSchema} from '../contract';

export const speakerSchema = z.object({
  texts: textsSchema(['brand', 'headline', 'author', 'attribution', 'date'] as const),
  theme: themeSchema,
});

export type SpeakerProps = z.infer<typeof speakerSchema>;
