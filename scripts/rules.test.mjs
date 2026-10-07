import {readFile} from 'node:fs/promises';
import {after, before, beforeEach, test} from 'node:test';
import {initializeTestEnvironment, assertFails, assertSucceeds} from '@firebase/rules-unit-testing';
import {collection, deleteDoc, doc, getDoc, getDocs, serverTimestamp, setDoc} from 'firebase/firestore';

let env;
before(async () => {
  env = await initializeTestEnvironment({
    projectId: 'demo-cliphouse',
    firestore: {host: '127.0.0.1', port: 8080, rules: await readFile('firestore.rules', 'utf8')},
  });
});
beforeEach(async () => env.clearFirestore());
after(async () => env?.cleanup());

test('an owner can star, list, update, and unstar a video', async () => {
  const db = env.authenticatedContext('alice').firestore();
  const bookmark = doc(db, 'users/alice/bookmarks/stack-orbit');
  await assertSucceeds(setDoc(bookmark, {variantId: 'stack-orbit', savedAt: serverTimestamp()}));
  await assertSucceeds(getDocs(collection(db, 'users/alice/bookmarks')));
  await assertSucceeds(setDoc(bookmark, {variantId: 'stack-orbit', savedAt: serverTimestamp()}));
  await assertSucceeds(deleteDoc(bookmark));
});

test('other accounts and anonymous visitors cannot read or modify private stars', async () => {
  await env.withSecurityRulesDisabled(async (context) => {
    await setDoc(doc(context.firestore(), 'users/alice/bookmarks/stack-orbit'), {variantId: 'stack-orbit', savedAt: new Date()});
  });
  for (const context of [env.authenticatedContext('bob'), env.unauthenticatedContext()]) {
    const db = context.firestore();
    const bookmark = doc(db, 'users/alice/bookmarks/stack-orbit');
    await assertFails(getDoc(bookmark));
    await assertFails(getDocs(collection(db, 'users/alice/bookmarks')));
    await assertFails(setDoc(bookmark, {variantId: 'stack-orbit', savedAt: serverTimestamp()}));
    await assertFails(deleteDoc(bookmark));
  }
});

test('invalid payloads, forged timestamps, extra fields and unrelated paths are rejected', async () => {
  const db = env.authenticatedContext('alice').firestore();
  const bookmark = doc(db, 'users/alice/bookmarks/stack-orbit');
  for (const data of [
    {variantId: 'other', savedAt: serverTimestamp()},
    {variantId: 'stack-orbit', savedAt: new Date(0)},
    {variantId: 'stack-orbit'},
    {variantId: 'stack-orbit', savedAt: serverTimestamp(), email: 'not-stored@example.com'},
  ]) await assertFails(setDoc(bookmark, data));
  await assertFails(setDoc(doc(db, 'users/alice/bookmarks/INVALID'), {variantId: 'INVALID', savedAt: serverTimestamp()}));
  await assertFails(setDoc(doc(db, 'users/alice'), {admin: true}));
  await assertFails(getDocs(collection(db, 'users')));
});
