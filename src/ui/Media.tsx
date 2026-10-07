import {Thumbnail} from '@remotion/player';
import {useEffect, useRef, useState} from 'react';
import type {Variant} from '../catalog/catalog';
import type {VideoProps} from '../videos/vocab';
import {compositions} from '../videos/registry';

const asset = (file: string) => `${import.meta.env.BASE_URL}previews/${file}`;
const FRAME_RATIO = 16 / 10;

// Fits any aspect ratio into a fixed 16:10 card frame, letterboxed with the theme background.
export function Media({variant, props, playing}: {variant: Variant; props: VideoProps | null; playing: boolean}) {
  const c = compositions[variant.template];
  const ratio = c.width / c.height;
  const box = useRef<HTMLDivElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!props) return;
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), {rootMargin: '300px'});
    if (box.current) io.observe(box.current);
    return () => io.disconnect();
  }, [props]);

  useEffect(() => {
    const v = video.current;
    if (v && playing) v.play().catch(() => {});
  }, [playing]);

  const inner = ratio >= FRAME_RATIO ? {width: '100%'} : {height: '100%'};
  const bg = (props ?? variant.props).theme.background;

  return (
    <div ref={box} className="media" style={{background: bg}}>
      <div className="media-inner" style={{aspectRatio: `${c.width} / ${c.height}`, ...inner}}>
        {props ? (
          // Brand kit previews: one static Remotion frame per card, only while on screen.
          visible && (
            <Thumbnail
              component={c.component}
              inputProps={props}
              frameToDisplay={c.posterFrame}
              durationInFrames={c.durationInFrames}
              compositionWidth={c.width}
              compositionHeight={c.height}
              fps={c.fps}
              style={{width: '100%', height: '100%'}}
            />
          )
        ) : (
          <>
            <img src={asset(`${variant.id}.jpg`)} alt="" loading="lazy" decoding="async" />
            {playing && <video ref={video} src={asset(`${variant.id}.mp4`)} muted loop playsInline autoPlay preload="none" />}
          </>
        )}
      </div>
    </div>
  );
}
