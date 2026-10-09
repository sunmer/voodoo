import {Check} from 'lucide-react';
import {templateFiles} from './imageFiles';

// Choose one of a template's own images for each image slot.
export function ImagePicker({template, slots, media, disabled, onChange}: {
  template: string; slots: {slot: string; options: {id: string; label: string}[]}[]; media: Record<string, string>;
  disabled: boolean; onChange: (slot: string, id: string) => void;
}) {
  const files = templateFiles[template] ?? {};
  return (
    <div className="photo-slots">
      {slots.map(({slot, options}) => (
        <div className="photo-slot" key={slot} role="radiogroup" aria-label={slot}>
          {slots.length > 1 && <h3>{slot.replace(/^./, (c) => c.toUpperCase())}</h3>}
          <div className="photo-grid">
            {options.map(({id, label}) => {
              const on = media[slot] === id;
              return (
                <button key={id} type="button" role="radio" aria-checked={on} className={`photo-btn ${on ? 'on' : ''}`}
                  title={label} aria-label={label} disabled={disabled} onClick={() => onChange(slot, id)}>
                  <img src={files[id]} alt="" loading="lazy" decoding="async" />
                  {on && <span className="photo-check"><Check size={14} /></span>}
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
