import {z} from 'zod';
import {textsSchema, themeSchema} from '../contract';

export const testimonialSchema = z.object({
  texts: textsSchema(['brand', 'headline', 'point1', 'cta', 'quote', 'author'] as const),
  theme: themeSchema,
});

export type TestimonialProps = z.infer<typeof testimonialSchema>;
