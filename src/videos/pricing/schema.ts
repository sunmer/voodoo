import {z} from 'zod';
import {textsSchema, themeSchema} from '../contract';

export const pricingSchema = z.object({
  texts: textsSchema(['brand', 'headline', 'price', 'priceNote', 'items', 'cta'] as const),
  theme: themeSchema,
});

export type PricingProps = z.infer<typeof pricingSchema>;
