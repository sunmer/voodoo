import type {TemplateMeta} from '../vocab.ts';

export const podcastMeta: TemplateMeta = {
  id: 'podcast',
  name: 'Podcast',
  width: 1080,
  height: 1080,
  fps: 30,
  durationInFrames: 240,
  posterFrame: 66,
  motion: ['Waveform', 'Slide-in', 'Kinetic type'],
  scenes: [
    {type: 'title-reveal', from: 0, duration: 100, focus: 66, roles: ['brand', 'headline', 'point1']},
    {type: 'tagline', from: 100, duration: 80, focus: 46, roles: ['subhead', 'point2']},
    {type: 'logo-lockup', from: 180, duration: 60, focus: 36, roles: ['brand', 'cta']},
  ],
};
