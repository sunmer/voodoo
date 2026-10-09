import type {TemplateMeta} from '../vocab.ts';

export const liquidMeta: TemplateMeta = {
  id: 'liquid',
  name: 'Liquid',
  width: 1920,
  height: 1080,
  fps: 30,
  durationInFrames: 240,
  posterFrame: 150,
  motion: ['Liquid glass', 'Kinetic type', 'Parallax'],
  scenes: [{type: 'title-reveal', from: 0, duration: 240, focus: 120, roles: ['brand', 'headline', 'cta']}],
};
