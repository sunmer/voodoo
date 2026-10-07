import type React from 'react';
import type {TemplateMeta, VideoSchema} from './contract';
import {templateMeta} from './meta';
import {Showreel} from './showreel/Showreel';
import {showreelSchema} from './showreel/schema';
import {Stack} from './stack/Stack';
import {stackSchema} from './stack/schema';

export type CompositionDef = TemplateMeta & {
  component: React.FC<any>;
  schema: VideoSchema;
};

// One entry per template. Catalog variants reference these by id.
export const compositions: Record<string, CompositionDef> = {
  showreel: {...templateMeta.showreel, component: Showreel, schema: showreelSchema as unknown as VideoSchema},
  stack: {...templateMeta.stack, component: Stack, schema: stackSchema as unknown as VideoSchema},
};
