import React, {Suspense, lazy, useEffect, useState} from 'react';
import {continueRender, delayRender, useVideoConfig} from 'remotion';

type Props = {children: React.ReactNode; camera?: {position?: [number, number, number]; fov?: number}; style?: React.CSSProperties};

// Three.js is large, so it loads only when a 3D template is on screen. Renders wait for it.
const Canvas = lazy(() => import('./Canvas3D'));

const Hold: React.FC = () => {
  const [handle] = useState(() => delayRender('Loading 3D renderer'));
  useEffect(() => () => continueRender(handle), [handle]);
  return null;
};

// A full-frame Three.js canvas. Use useCurrentFrame() inside children for all animation.
// Never use useFrame or clock time: renders must depend only on the frame.
export const Scene3D: React.FC<Props> = (props) => {
  const {width, height} = useVideoConfig();
  return (
    <Suspense fallback={<Hold />}>
      <Canvas {...props} width={width} height={height} />
    </Suspense>
  );
};
