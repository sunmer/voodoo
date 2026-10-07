import {GoogleAuthProvider, onAuthStateChanged, signInWithPopup, signOut, type User} from 'firebase/auth';
import {collection, deleteDoc, doc, limit, onSnapshot, orderBy, query, serverTimestamp, setDoc} from 'firebase/firestore';
import {LogOut, Star, Trash2, UserRound, X} from 'lucide-react';
import {createContext, useContext, useEffect, useRef, useState, type ReactNode} from 'react';
import {auth, db, firebaseConfigured} from '../services/firebase';
import {track} from '../services/analytics';
import {deleteSharedVideo} from '../services/sharing';
import {deleteDraft} from '../services/drafts';

type AccountState = {
  user: User | null;
  ready: boolean;
  savedReady: boolean;
  savedError: string;
  saved: Set<string>;
  pending: Set<string>;
  openAccount: () => void;
  requireSignIn: () => Promise<User>;
  toggle: (id: string) => void;
  retry: () => void;
};
const AccountContext = createContext<AccountState | null>(null);
export function useAccount() {
  const value = useContext(AccountContext);
  if (!value) throw new Error('AccountProvider is required');
  return value;
}

function messageFor(error: unknown) {
  const code = (error as {code?: string})?.code;
  if (code === 'auth/popup-closed-by-user' || code === 'auth/cancelled-popup-request') return 'Sign-in was cancelled. You can try again.';
  if (code === 'auth/popup-blocked') return 'Allow pop-ups for this site, then try again.';
  if (code === 'auth/unauthorized-domain') return 'Google sign-in is not enabled for this domain yet.';
  if (code === 'auth/network-request-failed' || code === 'unavailable') return 'Connection lost. Please reconnect and try again.';
  if (code === 'permission-denied') return 'Your saved videos could not be accessed. Please sign out and sign in again.';
  return 'Something went wrong. Please try again.';
}

export function AccountProvider({children}: {children: ReactNode}) {
  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(!firebaseConfigured);
  const [saved, setSaved] = useState<Set<string>>(new Set());
  const [savedReady, setSavedReady] = useState(false);
  const [savedError, setSavedError] = useState('');
  const [pending, setPending] = useState<Set<string>>(new Set());
  const pendingKeys = useRef(new Set<string>());
  const [revision, setRevision] = useState(0);
  const [open, setOpen] = useState(false);
  const [intent, setIntent] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [shares, setShares] = useState<{id: string; title: string}[]>([]);
  const [sharesError, setSharesError] = useState('');
  const [deleting, setDeleting] = useState('');
  const [drafts, setDrafts] = useState<{id: string; title: string}[]>([]);
  const [draftsError, setDraftsError] = useState('');
  const [draftLimit, setDraftLimit] = useState(50);
  const signInRequest = useRef<{resolve: (user: User) => void; reject: (error: Error) => void} | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    if (!auth) return;
    return onAuthStateChanged(auth, (next) => {
      setUser(next);
      setSaved(new Set());
      setSavedReady(false);
      setSavedError('');
      setPending(new Set());
      setReady(true);
    }, (e) => { setError(messageFor(e)); setReady(true); });
  }, []);

  useEffect(() => {
    if (!user || !db) return;
    const uid = user.uid;
    let active = true;
    setSavedError('');
    setSavedReady(false);
    const stop = onSnapshot(collection(db, 'users', uid, 'bookmarks'), {includeMetadataChanges: true}, (snapshot) => {
      if (!active || auth?.currentUser?.uid !== uid) return;
      setSaved(new Set(snapshot.docs.map((item) => item.id)));
      setSavedReady(!snapshot.metadata.fromCache);
    }, (e) => {
      if (!active) return;
      setSavedError(messageFor(e));
      setSavedReady(false);
    });
    return () => { active = false; stop(); };
  }, [user, revision]);

  useEffect(() => {
    if (open) dialog.current?.showModal();
    else dialog.current?.close();
  }, [open]);
  useEffect(() => {
    setShares([]);
    setSharesError('');
    if (!open || !user || !db) return;
    return onSnapshot(query(collection(db, 'users', user.uid, 'shares'), orderBy('createdAt', 'desc'), limit(20)), (snapshot) => {
      setShares(snapshot.docs.map((item) => ({id: item.id, title: String(item.data().title)})));
    }, () => setSharesError('Published links could not be loaded.'));
  }, [open, user]);
  useEffect(() => {
    setDrafts([]);
    setDraftsError('');
    if (!open || !user || !db) return;
    return onSnapshot(query(collection(db, 'users', user.uid, 'drafts'), orderBy('updatedAt', 'desc'), limit(draftLimit)), (snapshot) => {
      setDrafts(snapshot.docs.map((item) => ({id: item.id, title: String(item.data().title)})));
    }, () => setDraftsError('Saved videos could not be loaded.'));
  }, [open, user, draftLimit]);
  const removeDraft = async (id: string) => {
    if (!user || deleting || !window.confirm('Delete this private saved video? Published links will remain unchanged.')) return;
    setDeleting(id);
    setDraftsError('');
    try { await deleteDraft(user.uid, id); }
    catch (e) { setDraftsError((e as Error).message); }
    finally { setDeleting(''); }
  };
  const removeShare = async (id: string) => {
    if (deleting || !window.confirm('Remove this public link? Copies already saved by other apps may remain.')) return;
    setDeleting(id);
    setSharesError('');
    try { await deleteSharedVideo(id); }
    catch (e) { setSharesError((e as Error).message); }
    finally { setDeleting(''); }
  };

  const close = () => {
    if (busy) return;
    setOpen(false); setIntent(null); setError('');
    signInRequest.current?.reject(new Error('Sign-in was cancelled. Your edits are still here.'));
    signInRequest.current = null;
  };
  const requireSignIn = () => {
    if (auth?.currentUser) return Promise.resolve(auth.currentUser);
    if (signInRequest.current) return Promise.reject(new Error('Sign-in is already in progress.'));
    setIntent(null); setError(''); setOpen(true);
    return new Promise<User>((resolve, reject) => { signInRequest.current = {resolve, reject}; });
  };
  const writeBookmark = async (id: string, add: boolean, uid: string) => {
    if (!db || !navigator.onLine) {
      setNotice('You are offline. Reconnect to save videos to your account.');
      return;
    }
    const key = `${uid}/${id}`;
    if (pendingKeys.current.has(key)) return;
    pendingKeys.current.add(key);
    setPending((old) => new Set(old).add(id));
    setNotice('');
    try {
      const ref = doc(db, 'users', uid, 'bookmarks', id);
      if (add) await setDoc(ref, {variantId: id, savedAt: serverTimestamp()});
      else await deleteDoc(ref);
      if (auth?.currentUser?.uid === uid) track(add ? 'bookmark_add' : 'bookmark_remove', {variant_id: id});
    } catch (e) {
      if (auth?.currentUser?.uid === uid) setNotice(messageFor(e));
    } finally {
      pendingKeys.current.delete(key);
      if (auth?.currentUser?.uid === uid) {
        setPending((old) => { const next = new Set(old); next.delete(id); return next; });
      }
    }
  };
  const toggle = (id: string) => {
    if (!ready) return;
    if (!user) { setIntent(id); setOpen(true); return; }
    if (!savedReady) { setNotice(savedError || 'Saved videos are still connecting. Please try again shortly.'); return; }
    void writeBookmark(id, !saved.has(id), user.uid);
  };
  const login = async () => {
    if (!auth || busy) return;
    setBusy(true);
    setError('');
    const selected = intent;
    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({prompt: 'select_account'});
      const result = await signInWithPopup(auth, provider);
      track('login', {method: 'Google'});
      setOpen(false);
      setIntent(null);
      if (selected) void writeBookmark(selected, true, result.user.uid);
      signInRequest.current?.resolve(result.user);
      signInRequest.current = null;
    } catch (e) { setError(messageFor(e)); }
    finally { setBusy(false); }
  };
  const logout = async () => {
    if (!auth || busy) return;
    setBusy(true);
    setError('');
    try { await signOut(auth); setOpen(false); }
    catch (e) { setError(messageFor(e)); }
    finally { setBusy(false); }
  };

  return (
    <AccountContext.Provider value={{user, ready, savedReady, savedError, saved, pending, toggle, requireSignIn,
      retry: () => setRevision((n) => n + 1), openAccount: () => { setIntent(null); setOpen(true); }}}>
      {children}
      {notice && <div className="account-notice" role="status">{notice}<button className="icon-btn ghost" aria-label="Dismiss notification" onClick={() => setNotice('')}><X size={16} /></button></div>}
      <dialog className="account-dialog" ref={dialog} aria-labelledby="account-title"
        onCancel={(event) => { event.preventDefault(); close(); }} onClick={(event) => { if (event.target === event.currentTarget) close(); }}>
        <div className="dialog-heading">
          <h2 id="account-title">{user ? 'Your account' : 'Sign in'}</h2>
          <button className="icon-btn ghost" aria-label="Close account" disabled={busy} onClick={close}><X size={18} /></button>
        </div>
        {user ? <>
          <p className="account-name">{user.displayName || 'Google account'}</p>
          <p className="muted account-email">{user.email}</p>
          <p>{saved.size} starred {saved.size === 1 ? 'video' : 'videos'}</p>
          {drafts.length > 0 && <section className="account-shares" aria-label="Saved videos">
            <h3>Saved videos</h3>
            {drafts.map((draft) => <div className="account-share" key={draft.id}>
              <a href={`${import.meta.env.BASE_URL}#/d/${draft.id}`} onClick={close}>{draft.title}</a>
              <button className="icon-btn ghost" title={`Delete ${draft.title}`} aria-label={`Delete ${draft.title}`}
                disabled={!!deleting} onClick={() => void removeDraft(draft.id)}><Trash2 size={16} /></button>
            </div>)}
            {drafts.length >= draftLimit && <button className="link-btn" onClick={() => setDraftLimit((n) => n + 50)}>Load more</button>}
          </section>}
          {draftsError && <p className="account-error" role="alert">{draftsError}</p>}
          {shares.length > 0 && <section className="account-shares" aria-label="Published links">
            <h3>Published links</h3>
            {shares.map((share) => <div className="account-share" key={share.id}>
              <a href={`/s/${share.id}`} onClick={close}>{share.title}</a>
              <button className="icon-btn ghost" title={`Remove ${share.title}`} aria-label={`Remove ${share.title}`}
                disabled={!!deleting} onClick={() => void removeShare(share.id)}><Trash2 size={16} /></button>
            </div>)}
          </section>}
          {sharesError && <p className="account-error" role="alert">{sharesError}</p>}
          <button className="account-action" onClick={logout} disabled={busy}><LogOut size={17} />{busy ? 'Signing out...' : 'Sign out'}</button>
        </> : firebaseConfigured ? <>
          <p className="muted">Keep your saved videos, stars, and published links in your account.</p>
          <button className="google-signin" onClick={login} disabled={busy}>{busy ? 'Signing in...' : 'Sign in with Google'}</button>
        </> : <p className="muted">Google sign-in is not available yet. You can still browse and edit every video.</p>}
        {error && <p className="account-error" role="alert">{error}</p>}
        <a className="privacy-link" href="#/privacy" onClick={close}>Privacy</a>
      </dialog>
    </AccountContext.Provider>
  );
}

export function AccountButton() {
  const {user, ready, openAccount} = useAccount();
  return <button className="account-button" onClick={openAccount} disabled={!ready}
    title={user ? `Account: ${user.email}` : 'Sign in'} aria-label={user ? 'Your account' : 'Sign in'}>
    <UserRound size={18} /><span>{user ? 'Account' : 'Sign in'}</span>
  </button>;
}

export function StarButton({id, title, overlay = false}: {id: string; title: string; overlay?: boolean}) {
  const {saved, pending, ready, toggle} = useAccount();
  const active = saved.has(id);
  const label = `${active ? 'Unstar' : 'Star'} ${title}`;
  return <button className={`${overlay ? 'overlay-btn' : 'card-star'} star-button ${active ? 'starred' : ''}`}
    title={label} aria-label={label} aria-pressed={active} aria-busy={pending.has(id)} disabled={!ready || pending.has(id)}
    onClick={() => toggle(id)}><Star size={19} fill={active ? 'currentColor' : 'none'} /></button>;
}
