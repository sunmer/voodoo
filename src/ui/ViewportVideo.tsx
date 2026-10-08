import {useEffect, useRef, useState, type CSSProperties} from 'react';
import {Play} from 'lucide-react';
import {attachViewportVideo} from '../media/viewport-video';

export function ViewportVideo({src, poster, label, controls = true, autoplay = true, onError, style}: {
  src: string; poster?: string; label: string; controls?: boolean; autoplay?: boolean;
  onError?: () => void; style?: CSSProperties;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const controller = useRef<ReturnType<typeof attachViewportVideo> | null>(null);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const [state, setState] = useState({ready: false, needsPlay: false});
  const [playing, setPlaying] = useState(false);
  const [revealed, setRevealed] = useState(false);
  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    const onPlaying = () => setPlaying(true);
    const onStopped = () => setPlaying(false);
    video.addEventListener('playing', onPlaying);
    video.addEventListener('pause', onStopped);
    video.addEventListener('emptied', onStopped);
    const playback = attachViewportVideo(video, src, {autoplay, onState: setState});
    controller.current = playback;
    return () => {
      clearTimeout(hideTimer.current);
      video.removeEventListener('playing', onPlaying);
      video.removeEventListener('pause', onStopped);
      video.removeEventListener('emptied', onStopped);
      playback.dispose();
      controller.current = null;
    };
  }, [src, autoplay]);
  const reveal = (duration?: number) => {
    clearTimeout(hideTimer.current);
    setRevealed(true);
    if (duration) hideTimer.current = setTimeout(() => setRevealed(false), duration);
  };
  const conceal = () => { clearTimeout(hideTimer.current); setRevealed(false); };
  const showControls = controls && !state.needsPlay && (!playing || revealed);
  return <div data-viewport-video style={{position: 'relative', width: '100%', height: '100%', ...style}}>
    <video ref={ref} data-video-src={src} aria-label={label} poster={poster} muted loop playsInline
      controls={showControls} preload="none" disablePictureInPicture onError={onError}
      onPointerEnter={(event) => { if (event.pointerType === 'mouse') reveal(); }}
      onPointerMove={(event) => { if (event.pointerType === 'mouse' && !revealed) reveal(); }}
      onPointerLeave={(event) => { if (event.pointerType === 'mouse') conceal(); }}
      onPointerDown={(event) => { if (event.pointerType !== 'mouse') reveal(3000); }}
      onFocus={() => reveal()} onBlur={conceal}
      style={{display: 'block', width: '100%', height: '100%', objectFit: 'contain', opacity: controls || state.ready ? 1 : 0}} />
    {controls && state.needsPlay && <button type="button" aria-label={`Play ${label}`} title="Play video"
      onClick={() => controller.current?.play()}
      style={{position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 48, height: 48,
        display: 'grid', placeItems: 'center', border: '1px solid #74787e', borderRadius: '50%', background: '#141518', color: '#f5f5f2', cursor: 'pointer'}}>
      <Play size={22} aria-hidden="true" />
    </button>}
  </div>;
}
