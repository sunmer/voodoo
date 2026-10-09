import {z} from 'zod';
import {textsSchema, themeSchema} from '../contract';
import {assetSchema} from '../media/catalog';
import {photoquoteAssets} from './assets';

export const photoquoteSchema = z.object({
  texts: textsSchema(['quote', 'author', 'brand'] as const),
  theme: themeSchema,
  media: z.object({background: assetSchema(photoquoteAssets)}).strict(),
});

export type PhotoquoteProps = z.infer<typeof photoquoteSchema>;
