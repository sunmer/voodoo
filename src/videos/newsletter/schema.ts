import {z} from 'zod';
import {textsSchema, themeSchema} from '../contract';

export const newsletterSchema = z.object({
  texts: textsSchema(['brand', 'headline', 'items', 'cta'] as const),
  theme: themeSchema,
});

export type NewsletterProps = z.infer<typeof newsletterSchema>;
