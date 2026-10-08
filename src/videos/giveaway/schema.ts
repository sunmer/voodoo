import {z} from 'zod';
import {textsSchema, themeSchema} from '../contract';

export const giveawaySchema = z.object({
  texts: textsSchema(['brand', 'headline', 'items', 'date', 'cta'] as const),
  theme: themeSchema,
});

export type GiveawayProps = z.infer<typeof giveawaySchema>;
