import type {TemplateMeta} from './vocab.ts';
import {showreelMeta} from './showreel/meta.ts';
import {stackMeta} from './stack/meta.ts';

export const templateMeta: Record<string, TemplateMeta> = {
  [showreelMeta.id]: showreelMeta,
  [stackMeta.id]: stackMeta,
};
