import {auth} from './firebase';
import type {VideoProps} from '../videos/contract';

const apiOrigin = (import.meta.env.VITE_SHARE_API_ORIGIN || '').replace(/\/$/, '');
export const sharingConfigured = Boolean(apiOrigin);
export type SharedVideo = {id: string; variantId: string; props: VideoProps; title: string; url: string; image: string};

async function request(path: string, options: RequestInit = {}, authenticated = false) {
  const headers = new Headers(options.headers);
  if (authenticated) {
    const user = auth?.currentUser;
    if (!user) throw new Error('Sign in before publishing a video.');
    headers.set('Authorization', `Bearer ${await user.getIdToken()}`);
  }
  let response: Response;
  try {
    response = await fetch(`${apiOrigin}${path}`, {...options, headers, signal: options.signal ?? AbortSignal.timeout(300_000)});
  } catch {
    throw new Error('Connection lost. Your edits are still here. Try again to recover your link.');
  }
  const body = await response.json().catch(() => null);
  if (!response.ok) throw new Error(body?.error || 'Sharing is unavailable. Please try again.');
  return body;
}

export async function publishVideo(variantId: string, props: VideoProps): Promise<SharedVideo> {
  if (!sharingConfigured) throw new Error('Publishing is not available yet. Your edits remain on this device.');
  return request('/api/shares', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({variantId, props}),
  }, true);
}

export async function loadSharedVideo(id: string, signal: AbortSignal): Promise<SharedVideo> {
  return request(`/api/shares/${encodeURIComponent(id)}`, {signal});
}

export async function deleteSharedVideo(id: string) {
  return request(`/api/shares/${encodeURIComponent(id)}`, {method: 'DELETE'}, true);
}
