import {z} from 'zod';
import {textsSchema, themeSchema} from '../contract';

export const flashsaleSchema = z.object({
  texts: textsSchema(['brand', 'headline', 'price', 'priceNote', 'date', 'cta'] as const),
  theme: themeSchema,
});

export type FlashsaleProps = z.infer<typeof flashsaleSchema>;
