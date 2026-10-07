import React from 'react';
import {Composition} from 'remotion';
import {compositions} from '../videos/registry';
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
        defaultProps={manifest.entries.find((e) => e.composition === id)!.props}
      />
    ))}
  </>
);
