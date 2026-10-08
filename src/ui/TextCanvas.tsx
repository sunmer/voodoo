import type {PlayerRef} from '@remotion/player';
import {Check, X} from 'lucide-react';
import {useCallback, useEffect, useRef, useState, type ReactNode, type RefObject} from 'react';
import {flushSync} from 'react-dom';
import {ROLES, type Role, type VideoProps} from '../videos/vocab';

type Target = {role: Role; left: number; top: number; width: number; height: number; fontFamily: string; fontWeight: string; rects: DOMRect[]};

// Read glyph bounds, not container bounds: animated text can span many nested elements.
function targetsIn(root: HTMLElement): Target[] {
  const origin = root.getBoundingClientRect();
  const result: Target[] = [];
  root.querySelectorAll<HTMLElement>('[data-text-role]').forEach((el) => {
    const role = el.dataset.textRole as Role;
    if (!(role in ROLES)) return;
    const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
    const rects: DOMRect[] = [];
    let fragmented = false;
    let style: CSSStyleDeclaration | undefined;
    while (walker.nextNode()) {
      const node = walker.currentNode;
      if (!node.textContent?.trim()) continue;
      let parent = node.parentElement;
      let visible = true;
      while (parent && parent !== root) {
        const css = getComputedStyle(parent);
        if (css.visibility === 'hidden' || css.display === 'none' || Number(css.opacity) < 0.08) visible = false;
        parent = parent.parentElement;
      }
      if (!visible) continue;
      const range = document.createRange();
      // Long rotated marquees otherwise report a bounding box covering the whole canvas.
      const chunks = node.textContent.length > 80 ? [...node.textContent.matchAll(/\S+/g)] : null;
      fragmented ||= !!chunks;
      for (const chunk of chunks ?? [null]) {
        if (chunk) {
          range.setStart(node, chunk.index!);
          range.setEnd(node, chunk.index! + chunk[0].length);
        } else range.selectNodeContents(node);
        for (const rect of range.getClientRects()) {
          if (rect.width > 1 && rect.height > 1 && rect.right > origin.left && rect.left < origin.right &&
            rect.bottom > origin.top && rect.top < origin.bottom) rects.push(rect);
        }
      }
      style ??= getComputedStyle(node.parentElement!);
    }
    if (!rects.length) return;
    for (const group of fragmented ? rects.map((rect) => [rect]) : [rects]) {
      const left = Math.max(origin.left, Math.min(...group.map((r) => r.left)));
      const top = Math.max(origin.top, Math.min(...group.map((r) => r.top)));
      const right = Math.min(origin.right, Math.max(...group.map((r) => r.right)));
      const bottom = Math.min(origin.bottom, Math.max(...group.map((r) => r.bottom)));
      result.push({role, left: left - origin.left, top: top - origin.top, width: right - left, height: bottom - top,
        fontFamily: style?.fontFamily ?? 'inherit', fontWeight: style?.fontWeight ?? '600', rects: group});
    }
  });
  return result;
}

export function TextCanvas({ref, children, player, props, playing, onCommit, onEditing}: {
  ref?: RefObject<HTMLDivElement | null>;
  children: ReactNode;
  player: RefObject<PlayerRef | null>;
  props: VideoProps;
  playing: boolean;
  onCommit: (role: Role, value: string) => void;
  onEditing: (role: Role | null) => void;
}) {
  const root = useRef<HTMLDivElement>(null);
  const setRoot = useCallback((node: HTMLDivElement | null) => {
    root.current = node;
    if (ref) ref.current = node;
  }, [ref]);
  const input = useRef<HTMLTextAreaElement>(null);
  const [targets, setTargets] = useState<Target[]>([]);
  const [active, setActive] = useState<Target | null>(null);
  const [draft, setDraft] = useState('');
  const [size, setSize] = useState({width: 0, height: 0});
  const [viewport, setViewport] = useState({top: 0, bottom: Infinity});
  const measure = useCallback(() => {
    if (!root.current) return;
    const next = targetsIn(root.current);
    setTargets(next);
    setSize({width: root.current.clientWidth, height: root.current.clientHeight});
    const bounds = root.current.getBoundingClientRect();
    const view = window.visualViewport;
    setViewport({top: (view?.offsetTop ?? 0) - bounds.top, bottom: (view ? view.offsetTop + view.height : innerHeight) - bounds.top});
    setActive((a) => a ? next.filter((t) => t.role === a.role)
      .sort((x, y) => Math.abs(x.left - a.left) + Math.abs(x.top - a.top) - Math.abs(y.left - a.left) - Math.abs(y.top - a.top))[0] ?? a : null);
  }, []);

  useEffect(() => {
    let frame = 0;
    let disposed = false;
    const schedule = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(measure);
    };
    const observer = new ResizeObserver(schedule);
    if (root.current) observer.observe(root.current);
    if (!playing) schedule();
    void document.fonts.ready.then(() => { if (!disposed) schedule(); });
    const p = player.current;
    p?.addEventListener('seeked', schedule);
    p?.addEventListener('pause', schedule);
    window.visualViewport?.addEventListener('resize', schedule);
    window.visualViewport?.addEventListener('scroll', schedule);
    return () => {
      disposed = true;
      observer.disconnect();
      cancelAnimationFrame(frame);
      p?.removeEventListener('seeked', schedule);
      p?.removeEventListener('pause', schedule);
      window.visualViewport?.removeEventListener('resize', schedule);
      window.visualViewport?.removeEventListener('scroll', schedule);
    };
  }, [playing, props, measure, player]);

  const begin = (target: Target) => {
    player.current?.pause();
    // Synchronous focus keeps the keyboard gesture valid on iOS.
    flushSync(() => {
      setActive(target);
      setDraft(props.texts[target.role] ?? '');
      setSize({width: root.current!.clientWidth, height: root.current!.clientHeight});
      onEditing(target.role);
    });
    input.current?.focus({preventScroll: true});
    input.current?.select();
  };
  const valid = active && draft.trim().length > 0 && draft.length <= ROLES[active.role].max;
  const finish = (save: boolean) => {
    if (save && !valid) return;
    if (save && active && draft !== props.texts[active.role]) onCommit(active.role, draft.trim());
    setActive(null);
    onEditing(null);
    root.current?.focus({preventScroll: true});
  };
  const width = active ? Math.min(Math.max(active.width + 16, 220), Math.max(1, size.width - 16)) : 0;
  const left = active ? Math.max(8, Math.min(active.left - 8, size.width - width - 8)) : 0;
  const availableTop = Math.max(8, viewport.top + 8);
  const availableBottom = Math.min(size.height - 8, viewport.bottom - 8);
  const height = active ? Math.min(Math.max(active.height + 12, 60), Math.max(60, Math.min(220, availableBottom - availableTop - 48))) : 0;
  const top = active ? Math.max(availableTop, Math.min(active.top - 6, availableBottom - height - 48)) : 0;
  return (
    <div ref={setRoot} className={`text-canvas ${active ? 'is-editing' : ''}`} tabIndex={-1}
      onClickCapture={(event) => {
        if ((event.target as Element).closest('.inline-editor, .text-hit')) return;
        if (active) { finish(true); return; }
        const candidates = targetsIn(root.current!).filter((t) => t.rects.some((r) =>
          event.clientX >= r.left - 4 && event.clientX <= r.right + 4 && event.clientY >= r.top - 4 && event.clientY <= r.bottom + 4));
        const target = candidates.sort((a, b) => a.width * a.height - b.width * b.height)[0];
        if (target) {
          event.preventDefault();
          event.stopPropagation();
          begin(target);
        }
      }}>
      {children}
      {!playing && !active && <div className="text-targets">
        {targets.map((target, i) => (
          <button key={`${target.role}-${i}`} type="button" className="text-hit"
            aria-label={`Edit ${ROLES[target.role].label}`} title={`Edit ${ROLES[target.role].label}`}
            style={{left: target.left, top: target.top, width: target.width, height: Math.max(24, target.height)}}
            onClick={() => begin(target)} />
        ))}
      </div>}
      {active && <div className="inline-editor" role="group" aria-label={`Edit ${ROLES[active.role].label}`} style={{left, top, width}}>
        <textarea ref={input} aria-label={ROLES[active.role].label} aria-invalid={!valid} value={draft}
          style={{height, fontFamily: active.fontFamily, fontWeight: active.fontWeight, fontSize: Math.max(20, Math.min(42, active.height * 0.55))}}
          onChange={(e) => setDraft(e.target.value.replace(/[\r\n]+/g, ' '))}
          onKeyDown={(e) => {
            e.stopPropagation();
            if (e.nativeEvent.isComposing) return;
            if (e.key === 'Escape') { e.preventDefault(); finish(false); }
            if (e.key === 'Enter') { e.preventDefault(); finish(true); }
          }} />
        <div className="inline-actions">
          <span className={!valid ? 'error' : ''}>{ROLES[active.role].label} <span className="counter">{draft.length}/{ROLES[active.role].max}</span></span>
          <button className="icon-btn" title="Cancel edit" aria-label="Cancel edit" onClick={() => finish(false)}><X size={17} /></button>
          <button className="icon-btn confirm" title="Save text" aria-label="Save text" disabled={!valid} onClick={() => finish(true)}><Check size={17} /></button>
        </div>
      </div>}
    </div>
  );
}
