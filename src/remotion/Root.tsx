import React from 'react';
import {Composition} from 'remotion';
import {compositions} from '../videos/registry';
import {legacy} from '../videos/legacy';
import manifest from '../catalog/manifest.json';

export const RemotionRoot: React.FC = () => (
  <>
    {Object.entries(compositions).map(([id, c]) => (
      <Composition
        key={id}
        id={id}
        component={c.component}
        schema={c.schema}
        width={c.width}
        height={c.height}
        fps={c.fps}
        durationInFrames={c.durationInFrames}
        defaultProps={manifest.variants.find((v) => v.template === id)!.props as never}
      />
    ))}
    {/* Older template versions render under "<template>-v<version>" so saved edits keep their original code. */}
    {Object.entries(legacy).flatMap(([id, list]) => Object.entries(list).map(([version, c]) => (
      <Composition key={`${id}-v${version}`} id={`${id}-v${version}`} component={c.component} schema={c.schema}
        width={c.width} height={c.height} fps={c.fps} durationInFrames={c.durationInFrames}
        defaultProps={manifest.variants.find((v) => v.template === id)!.props as never} />
    )))}
  </>
);
