import {deleteDoc, doc, getDocFromServer, serverTimestamp, setDoc} from 'firebase/firestore';
import {auth, db} from './firebase';
import {variants} from '../catalog/catalog';
import {compositionFor} from '../videos/registry';
import type {Variant} from '../catalog/catalog';
import type {VideoProps} from '../videos/contract';

export type Draft = {id: string; variant: Variant; props: VideoProps; templateVersion: number};
function draftRef(uid: string, id: string) {
  if (!db || auth?.currentUser?.uid !== uid) throw new Error('Sign in to access your saved videos.');
  if (!/^[a-zA-Z0-9_-]{24,64}$/.test(id)) throw new Error('Invalid saved video.');
  return doc(db, 'users', uid, 'drafts', id);
}
export async function saveDraft(uid: string, id: string, variant: Variant, props: VideoProps, templateVersion: number) {
  if (!navigator.onLine) throw new Error('You are offline. Your edits remain on this device.');
  const parsed = compositionFor(variant.template, templateVersion).schema.parse(props);
  await setDoc(draftRef(uid, id), {
    variantId: variant.id, propsJson: JSON.stringify(parsed), templateVersion,
    title: (parsed.texts.headline || parsed.texts.brand || variant.title).slice(0, 120),
    updatedAt: serverTimestamp(),
  });
  if (auth?.currentUser?.uid !== uid) throw new Error('Your account changed. Sign in again to continue.');
  return id;
}
export async function loadDraft(uid: string, id: string): Promise<Draft> {
  const snapshot = await getDocFromServer(draftRef(uid, id));
  if (!snapshot.exists()) throw new Error('This saved video is unavailable.');
  const data = snapshot.data();
  const variant = variants.find((v) => v.id === data.variantId);
  if (!variant) throw new Error('This video template is unavailable.');
  // Drafts saved before versioning use v1, the first published source package.
  const templateVersion = typeof data.templateVersion === 'number' ? data.templateVersion : 1;
  const props = compositionFor(variant.template, templateVersion).schema.parse(JSON.parse(data.propsJson)) as VideoProps;
  return {id, variant, props, templateVersion};
}
export async function deleteDraft(uid: string, id: string) {
  await deleteDoc(draftRef(uid, id));
}
