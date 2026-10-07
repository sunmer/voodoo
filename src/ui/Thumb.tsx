import {Player, type PlayerRef} from '@remotion/player';
import {useEffect, useRef, useState} from 'react';
import {compositions} from '../videos/registry';
import type {Entry} from '../catalog/catalog';

// Prototype thumbnails use a live paused Player. At scale, swap for pre-rendered MP4 loops.
export function Thumb({entry, playing}: {entry: Entry; playing: boolean}) {
  const c = compositions[entry.composition];
  const ref = useRef<PlayerRef>(null);
  const [visible, setVisible] = useState(false);
  const box = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), {rootMargin: '200px'});
    if (box.current) io.observe(box.current);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const p = ref.current;
    if (!p) return;
    if (playing) p.play();
    else {
      p.pause();
      p.seekTo(40);
    }
  }, [playing, visible]);

  return (
    <div ref={box} className="thumb" style={{aspectRatio: `${c.width} / ${c.height}`}}>
      {visible && (
        <Player
          ref={ref}
          component={c.component}
          inputProps={entry.props}
          durationInFrames={c.durationInFrames}
          compositionWidth={c.width}
          compositionHeight={c.height}
          fps={c.fps}
          initialFrame={40}
          loop
          acknowledgeRemotionLicense
          style={{width: '100%', height: '100%'}}
        />
      )}
    </div>
  );
}
