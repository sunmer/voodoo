import {z} from 'zod';
import {textsSchema, themeSchema} from '../contract';

export const ticketsSchema = z.object({
  texts: textsSchema(['brand', 'headline', 'date', 'price', 'cta'] as const),
  theme: themeSchema,
});

export type TicketsProps = z.infer<typeof ticketsSchema>;
