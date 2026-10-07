import {Check, Copy, LoaderCircle, Share2, X} from 'lucide-react';
import {useEffect, useRef, useState} from 'react';
import type {Variant} from '../catalog/catalog';
import type {VideoProps} from '../videos/contract';
import {publishVideo, sharingConfigured, type SharedVideo} from '../services/sharing';
import {track} from '../services/analytics';
import {useAccount} from './Account';

export function ShareButton({variant, props, disabled, beforeOpen}: {
  variant: Variant; props: VideoProps; disabled: boolean; beforeOpen: () => void;
}) {
  const account = useAccount();
  const dialog = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [result, setResult] = useState<{key: string; value: SharedVideo} | null>(null);
  const key = JSON.stringify(props);
  const published = result?.key === key ? result.value : null;
  const mounted = useRef(true);
  useEffect(() => { mounted.current = true; return () => { mounted.current = false; }; }, []);
  useEffect(() => {
    if (open) dialog.current?.showModal(); else dialog.current?.close();
  }, [open]);
  const close = () => { if (!busy) setOpen(false); };
  const publish = async () => {
    if (busy) return;
    setBusy(true);
    setError('');
    try {
      const value = await publishVideo(variant.id, props);
      if (!mounted.current) return;
      setResult({key, value});
      track('share_publish', {variant_id: variant.id});
    } catch (e) {
      if (mounted.current) setError((e as Error).message);
    } finally { if (mounted.current) setBusy(false); }
  };
  const copy = async () => {
    if (!published) return;
    try { await navigator.clipboard.writeText(published.url); setCopied(true); }
    catch { setError('Select the link below to copy it.'); }
  };
  const share = async () => {
    if (!published) return;
    try { await navigator.share({url: published.url, title: published.title}); }
    catch (e) { if ((e as Error).name !== 'AbortError') setError('The share sheet could not open. Copy the link instead.'); }
  };
  return <>
    <button className="overlay-btn" title="Share video" aria-label="Share video" disabled={disabled}
      onClick={() => { beforeOpen(); setCopied(false); setError(''); setOpen(true); }}><Share2 size={20} /></button>
    <dialog ref={dialog} className="account-dialog share-dialog" aria-labelledby="share-title"
      onCancel={(e) => { e.preventDefault(); close(); }}
      onClick={(e) => { if (e.target === e.currentTarget) close(); }}>
      <div className="dialog-heading">
        <h2 id="share-title">Share video</h2>
        <button className="icon-btn ghost" aria-label="Close share" disabled={busy} onClick={close}><X size={18} /></button>
      </div>
      {published ? <>
        <video className="share-preview" src={published.video} poster={published.image} muted playsInline controls loop />
        <label className="share-link-label" htmlFor="share-link">Public link</label>
        <input id="share-link" className="share-link" value={published.url} readOnly onFocus={(e) => e.target.select()} />
        <div className="share-actions">
          <button className="account-action" onClick={copy}>{copied ? <Check size={17} /> : <Copy size={17} />}{copied ? 'Copied' : 'Copy link'}</button>
          {typeof navigator.share === 'function' && <button className="account-action" onClick={share}><Share2 size={17} />Share</button>}
        </div>
      </> : <>
        <p className="muted">Publishing makes a copy of this edit visible to anyone with the link.</p>
        {!sharingConfigured ? <p role="status">Publishing is not available yet. Your edits remain on this device.</p>
          : !account.ready ? <p role="status">Checking your account...</p>
          : !account.user ? <button className="account-action" onClick={account.openAccount}>Sign in to publish</button>
          : <button className="account-action" disabled={busy} onClick={publish}>
            {busy ? <LoaderCircle className="spin" size={17} /> : <Share2 size={17} />}{busy ? 'Preparing video...' : 'Publish link'}
          </button>}
        {busy && <p className="muted" role="status">Rendering your video and preview. This can take a few minutes.</p>}
      </>}
      {error && <p className="account-error" role="alert">{error}</p>}
    </dialog>
  </>;
}
