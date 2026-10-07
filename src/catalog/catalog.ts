import manifest from './manifest.json';
import {compositions} from '../videos/registry';
import type {VideoProps} from '../videos/contract';

export type Entry = (typeof manifest.entries)[number] & {props: VideoProps};

export type Format = '16:9' | '9:16' | '1:1' | '4:5';

// Technical metadata is derived from the composition, never hand-entered.
export function technical(entry: Entry) {
  const c = compositions[entry.composition];
  const ratio = c.width / c.height;
  const format: Format = ratio > 1.2 ? '16:9' : ratio < 0.7 ? '9:16' : ratio < 0.9 ? '4:5' : '1:1';
  return {
    format,
    seconds: Math.round(c.durationInFrames / c.fps),
    textSlots: Object.keys(entry.props.texts).length,
    colorSlots: Object.keys(entry.props.theme).length,
  };
}

export const entries = manifest.entries as Entry[];
export const vocab = manifest.vocab;

export function searchText(e: Entry) {
  return [
    e.title,
    e.creator,
    e.description,
    e.useCase,
    ...e.style,
    ...e.mood,
    ...e.keywords,
    ...Object.values(e.props.texts),
  ]
    .join(' ')
    .toLowerCase();
}
