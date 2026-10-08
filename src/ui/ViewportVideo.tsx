import {useEffect, useRef, useState, type CSSProperties} from 'react';
import {Play} from 'lucide-react';
import {attachViewportVideo} from '../media/viewport-video';

export function ViewportVideo({src, poster, label, controls = true, autoplay = true, onError, style}: {
  src: string; poster?: string; label: string; controls?: boolean; autoplay?: boolean;
  onError?: () => void; style?: CSSProperties;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const controller = useRef<ReturnType<typeof attachViewportVideo> | null>(null);
  const [state, setState] = useState({ready: false, needsPlay: false});
  useEffect(() => {
    if (!ref.current) return;
    const playback = attachViewportVideo(ref.current, src, {autoplay, onState: setState});
    controller.current = playback;
    return () => { playback.dispose(); controller.current = null; };
  }, [src, autoplay]);
  return <div data-viewport-video style={{position: 'relative', width: '100%', height: '100%', ...style}}>
    <video ref={ref} data-video-src={src} aria-label={label} poster={poster} muted loop playsInline
      controls={controls && !state.needsPlay} preload="none" disablePictureInPicture onError={onError}
      style={{display: 'block', width: '100%', height: '100%', objectFit: 'contain', opacity: controls || state.ready ? 1 : 0}} />
    {controls && state.needsPlay && <button type="button" aria-label={`Play ${label}`} title="Play video"
      onClick={() => controller.current?.play()}
      style={{position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 48, height: 48,
        display: 'grid', placeItems: 'center', border: '1px solid #74787e', borderRadius: '50%', background: '#141518', color: '#f5f5f2', cursor: 'pointer'}}>
      <Play size={22} aria-hidden="true" />
    </button>}
  </div>;
}
