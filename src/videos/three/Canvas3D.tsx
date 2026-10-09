import React from 'react';
import {ThreeCanvas} from '@remotion/three';

type Props = {children: React.ReactNode; width: number; height: number; camera?: {position?: [number, number, number]; fov?: number}; style?: React.CSSProperties};

const Canvas3D: React.FC<Props> = ({children, width, height, camera, style}) => (
  <ThreeCanvas width={width} height={height} dpr={1}
    gl={{antialias: true, preserveDrawingBuffer: true, alpha: true}}
    camera={{position: camera?.position ?? [0, 0, 8], fov: camera?.fov ?? 40}} style={{position: 'absolute', inset: 0, ...style}}>
    {children}
  </ThreeCanvas>
);

export default Canvas3D;
