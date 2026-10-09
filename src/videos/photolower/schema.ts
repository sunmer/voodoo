import {z} from 'zod';
import {textsSchema, themeSchema} from '../contract';
import {assetSchema} from '../media/catalog';
import {photolowerAssets} from './assets';

export const photolowerSchema = z.object({
  texts: textsSchema(['author', 'attribution', 'brand'] as const),
  theme: themeSchema,
  media: z.object({background: assetSchema(photolowerAssets)}).strict(),
});

export type PhotolowerProps = z.infer<typeof photolowerSchema>;
