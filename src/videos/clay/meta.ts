import type {TemplateMeta} from '../vocab.ts';

export const clayMeta: TemplateMeta = {
  id: 'clay',
  name: 'Clay',
  width: 1920,
  height: 1080,
  fps: 30,
  durationInFrames: 210,
  posterFrame: 120,
  motion: ['Kinetic type', 'Zoom', 'Parallax'],
  scenes: [{type: 'title-reveal', from: 0, duration: 210, focus: 110, roles: ['brand', 'headline', 'subhead']}],
};
