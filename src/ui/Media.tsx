import {Thumbnail} from '@remotion/player';
import {useEffect, useRef, useState} from 'react';
import type {Variant} from '../catalog/catalog';
import type {VideoProps} from '../videos/vocab';
import {compositions} from '../videos/registry';

const asset = (file: string) => `${import.meta.env.BASE_URL}previews/${file}`;
const FRAME_RATIO = 16 / 10;

// Fits any aspect ratio into a fixed 16:10 card frame, letterboxed with the theme background.
// Preset cards autoplay their preview loop while on screen; off-screen videos are unloaded.
export function Media({variant, props, autoplay = true}: {variant: Variant; props: VideoProps | null; autoplay?: boolean}) {
  const c = compositions[variant.template];
  const ratio = c.width / c.height;
  const box = useRef<HTMLDivElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const [visible, setVisible] = useState(false);
  const [onScreen, setOnScreen] = useState(false);
  const [pageVisible, setPageVisible] = useState(() => !document.hidden);
  const [reducedMotion, setReducedMotion] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const visibility = () => setPageVisible(!document.hidden);
    const motion = () => setReducedMotion(query.matches);
    document.addEventListener('visibilitychange', visibility);
    query.addEventListener('change', motion);
    return () => {
      document.removeEventListener('visibilitychange', visibility);
      query.removeEventListener('change', motion);
    };
  }, []);

  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const near = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), {rootMargin: '300px'});
    const seen = new IntersectionObserver(([e]) => setOnScreen(e.isIntersecting && e.intersectionRatio >= 0.35), {threshold: 0.35});
    near.observe(el);
    seen.observe(el);
    return () => {
      near.disconnect();
      seen.disconnect();
    };
  }, []);

  const playing = !props && autoplay && onScreen && pageVisible && !reducedMotion;

  useEffect(() => {
    const v = video.current;
    setReady(false);
    if (!v || !playing) return;
    v.play().catch(() => {});
    return () => {
      v.pause();
      v.removeAttribute('src');
      v.load();
    };
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
            {playing && <video ref={video} src={asset(`${variant.id}.mp4`)} muted loop playsInline autoPlay preload="auto" disablePictureInPicture onPlaying={() => setReady(true)} onError={() => setReady(false)} style={{opacity: ready ? 1 : 0}} />}
          </>
        )}
      </div>
    </div>
  );
}
