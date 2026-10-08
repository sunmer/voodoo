import {z} from 'zod';
import {textsSchema, themeSchema} from '../contract';

export const announcementSchema = z.object({
  texts: textsSchema(['brand', 'headline', 'subhead', 'cta'] as const),
  theme: themeSchema,
});

export type AnnouncementProps = z.infer<typeof announcementSchema>;
