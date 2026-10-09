import {z} from 'zod';
import {textsSchema, themeSchema} from '../contract';
import {assetSchema} from '../media/catalog';
import {beforeafterphotoAssets} from './assets';

export const beforeafterphotoSchema = z.object({
  texts: textsSchema(['headline', 'point1', 'point2', 'brand'] as const),
  theme: themeSchema,
  media: z.object({before: assetSchema(beforeafterphotoAssets), after: assetSchema(beforeafterphotoAssets)}).strict(),
});

export type BeforeafterphotoProps = z.infer<typeof beforeafterphotoSchema>;
