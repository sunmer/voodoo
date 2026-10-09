import {z} from 'zod';
import {textsSchema, themeSchema} from '../contract';
import {assetSchema} from '../media/catalog';
import {slideshowAssets} from './assets';

export const slideshowSchema = z.object({
  texts: textsSchema(['headline', 'items', 'brand'] as const),
  theme: themeSchema,
  media: z
    .object({
      photo1: assetSchema(slideshowAssets),
      photo2: assetSchema(slideshowAssets),
      photo3: assetSchema(slideshowAssets),
    })
    .strict(),
});

export type SlideshowProps = z.infer<typeof slideshowSchema>;
