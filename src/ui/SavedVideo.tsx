import {useEffect, useState} from 'react';
import {loadDraft, type Draft} from '../services/drafts';
import {useAccount} from './Account';
import {Editor} from './Editor';

export function SavedVideo({id}: {id: string}) {
  const account = useAccount();
  const uid = account.user?.uid;
  const [loaded, setLoaded] = useState<{uid: string; value: Draft} | null>(null);
  const [error, setError] = useState('');
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    let active = true;
    setLoaded(null); setError('');
    if (uid) loadDraft(uid, id).then((value) => {
      if (active) setLoaded({uid, value});
    }).catch((e) => { if (active) setError(e.message); });
    return () => { active = false; };
  }, [id, uid, attempt]);
  if (uid && loaded?.uid === uid) {
    return <Editor key={`${uid}/${id}`} variant={loaded.value.variant} sharedProps={loaded.value.props} draftId={id} />;
  }
  return <main className="shared-status">
    <h1>{error ? 'Video unavailable' : !account.ready || uid ? 'Opening saved video...' : 'Private video'}</h1>
    {account.ready && !uid && <button className="account-action" onClick={account.openAccount}>Sign in to open</button>}
    {error && <><p role="alert">{error}</p><button className="account-action" onClick={() => setAttempt((n) => n + 1)}>Try again</button></>}
    <a href={`${import.meta.env.BASE_URL}#/`}>Browse videos</a>
  </main>;
}
