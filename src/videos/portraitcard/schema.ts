import {z} from 'zod';
import {textsSchema, themeSchema} from '../contract';
import {assetSchema} from '../media/catalog';
import {portraitcardAssets} from './assets';

export const portraitcardSchema = z.object({
  texts: textsSchema(['author', 'attribution', 'quote', 'brand'] as const),
  theme: themeSchema,
  media: z.object({photo: assetSchema(portraitcardAssets)}).strict(),
});

export type PortraitcardProps = z.infer<typeof portraitcardSchema>;
