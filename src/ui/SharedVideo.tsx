import {useEffect, useState} from 'react';
import {variants} from '../catalog/catalog';
import {compositionFor} from '../videos/registry';
import {loadSharedVideo, type SharedVideo as SharedVideoData} from '../services/sharing';
import {Editor} from './Editor';
import type {VideoProps} from '../videos/vocab';

export function SharedVideo({id, openShare}: {id: string; openShare?: boolean}) {
  const [video, setVideo] = useState<SharedVideoData | null>(null);
  const [error, setError] = useState('');
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    const controller = new AbortController();
    setError('');
    loadSharedVideo(id, controller.signal).then((data) => {
      const variant = variants.find((v) => v.id === data.variantId);
      let schema;
      try { schema = variant && compositionFor(variant.template, data.templateVersion ?? 1).schema; } catch { schema = undefined; }
      const result = schema?.safeParse(data.props);
      if (!result?.success) throw new Error('This video is not supported by this version of cliphou.se.');
      if (!controller.signal.aborted) setVideo({...data, props: result.data as VideoProps});
    }).catch((e) => { if (!controller.signal.aborted) setError(e.message); });
    return () => controller.abort();
  }, [id, attempt]);
  const variant = video && variants.find((v) => v.id === video.variantId);
  if (video && variant) return <Editor key={id} variant={variant} sharedProps={video.props} shareId={id} published={video} openShare={openShare} templateVersion={video.templateVersion ?? 1} />;
  return <main className="shared-status">
    <h1>{error ? 'Video unavailable' : 'Opening video...'}</h1>
    {error && <><p role="alert">{error}</p><button className="account-action" onClick={() => setAttempt((n) => n + 1)}>Try again</button></>}
    <a href={`${import.meta.env.BASE_URL}#/`}>Browse videos</a>
  </main>;
}
