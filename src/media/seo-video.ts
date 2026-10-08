import {attachViewportVideo} from './viewport-video';

for (const video of document.querySelectorAll<HTMLVideoElement>('video[data-video-src]')) {
  const button = video.parentElement?.querySelector<HTMLButtonElement>('[data-video-play]');
  const playback = attachViewportVideo(video, video.dataset.videoSrc!, {
    onState({ready, needsPlay}) {
      if (button) {
        button.hidden = !needsPlay;
        video.controls = !needsPlay;
      } else video.style.opacity = ready ? '1' : '0';
    },
  });
  button?.addEventListener('click', () => playback.play());
}
