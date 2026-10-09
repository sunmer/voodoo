import {z} from 'zod';
import {textsSchema, themeSchema} from '../contract';
import {assetSchema} from '../media/catalog';
import {travelintroAssets} from './assets';

export const travelintroSchema = z.object({
  texts: textsSchema(['headline', 'date', 'brand'] as const),
  theme: themeSchema,
  media: z.object({background: assetSchema(travelintroAssets)}).strict(),
});

export type TravelintroProps = z.infer<typeof travelintroSchema>;
