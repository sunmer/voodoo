import type {TemplateMeta} from '../vocab.ts';

export const titlecardMeta: TemplateMeta = {
  id: 'titlecard',
  name: 'Title Card',
  width: 1920,
  height: 1080,
  fps: 30,
  durationInFrames: 180,
  posterFrame: 96,
  motion: ['Mask reveal', 'Line draw', 'Zoom'],
  scenes: [
    {type: 'title-reveal', from: 0, duration: 180, focus: 96, roles: ['brand', 'headline', 'subhead']},
  ],
};
