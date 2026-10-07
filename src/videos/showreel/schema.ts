import {z} from 'zod';
import {colorSlot, textSlot} from '../contract';

export const showreelSchema = z.object({
  texts: z.object({
    brand: textSlot('Brand', 18),
    headline: textSlot('Headline', 24),
    line1: textSlot('Pillar 1', 16),
    line2: textSlot('Pillar 2', 16),
    line3: textSlot('Pillar 3', 16),
    tagline: textSlot('Tagline', 52),
    cta: textSlot('Call to action', 20),
  }),
  theme: z.object({
    background: colorSlot('Background'),
    surface: colorSlot('Surface'),
    foreground: colorSlot('Text'),
    accent: colorSlot('Accent'),
    accent2: colorSlot('Accent 2'),
  }),
});

export type ShowreelProps = z.infer<typeof showreelSchema>;
export type Theme = ShowreelProps['theme'];
