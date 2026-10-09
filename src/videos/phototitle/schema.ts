import {z} from 'zod';
import {textsSchema, themeSchema} from '../contract';
import {assetSchema} from '../media/catalog';
import {phototitleAssets} from './assets';

export const phototitleSchema = z.object({
  texts: textsSchema(['brand', 'headline', 'subhead'] as const),
  theme: themeSchema,
  media: z.object({background: assetSchema(phototitleAssets)}).strict(),
});

export type PhototitleProps = z.infer<typeof phototitleSchema>;
