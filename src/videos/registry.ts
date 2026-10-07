import type React from 'react';
import type {VideoSchema} from './contract';
import {Showreel} from './showreel/Showreel';
import {showreelSchema} from './showreel/schema';

export type CompositionDef = {
  component: React.FC<any>;
  schema: VideoSchema;
  width: number;
  height: number;
  fps: number;
  durationInFrames: number;
};

// One entry per generated composition. Catalog entries reference these by id.
export const compositions: Record<string, CompositionDef> = {
  showreel: {
    component: Showreel,
    schema: showreelSchema as unknown as VideoSchema,
    width: 1920,
    height: 1080,
    fps: 30,
    durationInFrames: 300,
  },
};
