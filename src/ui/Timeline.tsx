import type {PlayerRef} from '@remotion/player';
import {useEffect, useState, type RefObject} from 'react';
import {SCENE_TYPES, type Role, type TemplateMeta} from '../videos/vocab';

// Scene strip under the player: shows where each scene sits, follows playback, seeks on click.
export function Timeline({meta, player, focusRole, disabled = false}: {meta: TemplateMeta; player: RefObject<PlayerRef | null>; focusRole: Role | null; disabled?: boolean}) {
  const [frame, setFrame] = useState(0);
  useEffect(() => {
    const p = player.current;
    if (!p) return;
    const on = (e: {detail: {frame: number}}) => setFrame(e.detail.frame);
    p.addEventListener('frameupdate', on);
    p.addEventListener('seeked', on);
    return () => {
      p.removeEventListener('frameupdate', on);
      p.removeEventListener('seeked', on);
    };
  }, [player]);

  const total = meta.durationInFrames;
  const scenes = meta.scenes.filter((s) => s.type !== 'transition');
  return (
    <div className="timeline">
      {scenes.map((s, i) => {
        const end = i < scenes.length - 1 ? scenes[i + 1].from : total;
        const current = frame >= s.from && frame < end;
        const linked = focusRole !== null && s.roles.includes(focusRole);
        return (
          <button
            key={i}
            disabled={disabled}
            aria-label={`${SCENE_TYPES[s.type]} scene`}
            className={`scene ${current ? 'current' : ''} ${linked ? 'linked' : ''}`}
            style={{left: `${(s.from / total) * 100}%`, width: `${((end - s.from) / total) * 100}%`}}
            title={`${SCENE_TYPES[s.type]} · ${(s.from / meta.fps).toFixed(1)}s`}
            onClick={() => {
              player.current?.seekTo(s.from + s.focus);
              player.current?.pause();
            }}
          >
            <span>{SCENE_TYPES[s.type]}</span>
          </button>
        );
      })}
      <div className="playhead" style={{left: `${(frame / total) * 100}%`}} />
    </div>
  );
}
