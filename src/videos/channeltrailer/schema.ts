import {z} from 'zod';
import {textsSchema, themeSchema} from '../contract';

export const channeltrailerSchema = z.object({
  texts: textsSchema(['brand', 'headline', 'items', 'date', 'cta'] as const),
  theme: themeSchema,
});

export type ChanneltrailerProps = z.infer<typeof channeltrailerSchema>;
