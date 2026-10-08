import {z} from 'zod';
import {textsSchema, themeSchema} from '../contract';

export const partnershipSchema = z.object({
  texts: textsSchema(['brand', 'headline', 'subhead', 'date', 'cta'] as const),
  theme: themeSchema,
});

export type PartnershipProps = z.infer<typeof partnershipSchema>;
