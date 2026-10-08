type Connection = EventTarget & {saveData?: boolean; effectiveType?: string};
type PlaybackState = {ready: boolean; needsPlay: boolean};

// No src is assigned until the video is on screen. Detaching it stops buffering.
export function attachViewportVideo(video: HTMLVideoElement, src: string, {
  autoplay = true,
  onState = () => {},
}: {autoplay?: boolean; onState?: (state: PlaybackState) => void} = {}) {
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  const connection = (navigator as Navigator & {connection?: Connection}).connection;
  let visible = false;
  let manual = false;
  let pausedByUser = false;
  let blocked = false;
  let disposed = false;
  let ready = false;
  let timer: ReturnType<typeof setTimeout> | undefined;
  let generation = 0;
  const automatic = () => autoplay && !motion.matches && !connection?.saveData && !['slow-2g', '2g'].includes(connection?.effectiveType ?? '');
  const report = () => onState({ready, needsPlay: !ready && (!automatic() || blocked || pausedByUser)});
  const unload = () => {
    clearTimeout(timer);
    timer = undefined;
    generation++;
    ready = false;
    if (video.hasAttribute('src')) {
      video.removeAttribute('src');
      video.pause();
      video.load();
    }
    report();
  };
  const start = () => {
    timer = undefined;
    if (disposed || !visible || document.hidden || pausedByUser || (!manual && (!automatic() || blocked))) return;
    const attempt = ++generation;
    video.muted = true;
    if (!video.hasAttribute('src')) video.src = src;
    void video.play().catch(() => {
      if (disposed || attempt !== generation) return;
      blocked = true;
      manual = false;
      unload();
    });
  };
  const sync = () => {
    if (!visible || document.hidden || (!manual && !automatic())) {
      manual = false;
      unload();
      return;
    }
    report();
    if (!timer && !video.hasAttribute('src') && !pausedByUser && !blocked) timer = setTimeout(start, 200);
  };
  const observer = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting && entry.intersectionRatio >= 0.35;
    sync();
  }, {threshold: [0, 0.35], rootMargin: '0px'});
  const playing = () => { ready = true; pausedByUser = false; report(); };
  const pause = () => { if (video.hasAttribute('src') && visible && !document.hidden) pausedByUser = true; };
  const preference = () => { manual = false; sync(); };
  video.addEventListener('playing', playing);
  video.addEventListener('pause', pause);
  document.addEventListener('visibilitychange', sync);
  motion.addEventListener('change', preference);
  connection?.addEventListener('change', preference);
  observer.observe(video);
  report();
  return {
    play() {
      if (!visible || document.hidden) return;
      manual = true;
      blocked = false;
      pausedByUser = false;
      clearTimeout(timer);
      start();
    },
    dispose() {
      disposed = true;
      observer.disconnect();
      video.removeEventListener('playing', playing);
      video.removeEventListener('pause', pause);
      document.removeEventListener('visibilitychange', sync);
      motion.removeEventListener('change', preference);
      connection?.removeEventListener('change', preference);
      unload();
    },
  };
}
