import {useEffect, useRef} from 'react';
import {compositions} from '../videos/registry';
import type {Entry} from '../catalog/catalog';

const asset = (file: string) => `${import.meta.env.BASE_URL}previews/${file}`;

// Gallery cards show pre-rendered posters and MP4 loops (see scripts/previews.mjs).
// Live Players per card exhaust memory on mobile Safari.
export function Thumb({entry, playing}: {entry: Entry; playing: boolean}) {
  const c = compositions[entry.composition];
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    if (playing) {
      v.play().catch(() => {});
    } else {
      v.pause();
      v.currentTime = 0;
    }
  }, [playing]);

  return (
    <div className="thumb" style={{aspectRatio: `${c.width} / ${c.height}`}}>
      <img src={asset(`${entry.id}.jpg`)} alt="" loading="lazy" decoding="async" />
      {playing && (
        <video ref={ref} src={asset(`${entry.id}.mp4`)} muted loop playsInline autoPlay preload="none" />
      )}
    </div>
  );
}
