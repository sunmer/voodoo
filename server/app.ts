import type {IncomingMessage, ServerResponse} from 'node:http';
import {pipeline} from 'node:stream/promises';
import {HttpError, byteRange, exportFilename, fingerprint, publicExport, publicVideo, shareHtml, validId, validateShare} from './model.ts';
import type {createStore} from './store.ts';
import type {renderThumbnail, renderVideo} from './render.ts';

type Dependencies = {
  origin: string; origins: Set<string>; version: string;
  assets: {file: string; css?: string[]};
  store: ReturnType<typeof createStore>;
  render: typeof renderThumbnail;
  renderVideo: typeof renderVideo;
  verify: (token: string) => Promise<{uid: string; email_verified?: boolean; firebase?: {sign_in_provider: string}}>;
};
async function readBody(req: IncomingMessage) {
  if (req.headers['content-type']?.split(';')[0] !== 'application/json') throw new HttpError(415, 'Use JSON.');
  const chunks: Buffer[] = [];
  let size = 0;
  for await (const chunk of req) {
    size += chunk.length;
    if (size > 16_384) throw new HttpError(413, 'Video request is too large.');
    chunks.push(chunk);
  }
  try { return JSON.parse(Buffer.concat(chunks).toString('utf8')); }
  catch { throw new HttpError(400, 'Invalid JSON.'); }
}
export function createHandler(deps: Dependencies) {
  let rendering = false;
  const exclusive = async <T>(work: () => Promise<T>) => {
    if (rendering) throw new HttpError(429, 'The renderer is busy. Please try again shortly.');
    rendering = true;
    try { return await work(); } finally { rendering = false; }
  };
  const send = async (req: IncomingMessage, res: ServerResponse, file: {size: number; stream: (range?: {start: number; end: number}) => NodeJS.ReadableStream}, type: string) => {
    res.setHeader('Accept-Ranges', 'bytes');
    res.setHeader('Content-Type', type);
    let range;
    try { range = byteRange(req.headers.range, file.size); }
    catch (e) { res.setHeader('Content-Range', `bytes */${file.size}`); throw e; }
    if (range) {
      res.statusCode = 206;
      res.setHeader('Content-Range', `bytes ${range.start}-${range.end}/${file.size}`);
    }
    res.setHeader('Content-Length', range ? range.end - range.start + 1 : file.size);
    if (req.method === 'HEAD') { res.end(); return; }
    await pipeline(file.stream(range || undefined), res);
  };
  const user = async (req: IncomingMessage) => {
    const match = /^Bearer ([^\s]+)$/.exec(req.headers.authorization || '');
    if (!match) throw new HttpError(401, 'Sign in before publishing.');
    let identity;
    try { identity = await deps.verify(match[1]); }
    catch { throw new HttpError(401, 'Your session has expired. Sign in again.'); }
    if (!identity.email_verified || identity.firebase?.sign_in_provider !== 'google.com') throw new HttpError(403, 'Use a verified Google account to publish.');
    return identity.uid;
  };
  return async (req: IncomingMessage, res: ServerResponse) => {
    const json = (status: number, data: unknown) => {
      res.writeHead(status, {'Content-Type': 'application/json; charset=utf-8'});
      res.end(JSON.stringify(data));
    };
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('Referrer-Policy', 'no-referrer');
    res.setHeader('Cache-Control', 'no-store');
    res.setHeader('Vary', 'Origin');
    res.setHeader('Cross-Origin-Opener-Policy', 'same-origin-allow-popups');
    try {
      const origin = req.headers.origin;
      if (origin) {
        if (!deps.origins.has(origin)) throw new HttpError(403, 'This origin is not allowed.');
        res.setHeader('Access-Control-Allow-Origin', origin);
        res.setHeader('Access-Control-Allow-Methods', 'GET, HEAD, POST, DELETE, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Authorization, Content-Type');
        res.setHeader('Access-Control-Max-Age', '3600');
      }
      if (req.method === 'OPTIONS') { res.writeHead(204); res.end(); return; }
      const pathname = new URL(req.url || '/', deps.origin).pathname;
      if (pathname === '/health' && req.method === 'GET') { json(200, {ok: true}); return; }
      if (pathname === '/api/exports' && req.method === 'POST') {
        const uid = await user(req);
        const value = validateShare(await readBody(req));
        await exclusive(async () => {
          const key = fingerprint(uid, value, `${deps.version}-mp4`);
          let reservation;
          try {
            reservation = await deps.store.reserveExport(uid, key, value);
            if (reservation.ready) { json(200, publicExport(reservation.ready)); return; }
            const paths = await deps.renderVideo(value);
            try {
              const ready = await deps.store.finishExport(key, reservation.video!, paths);
              json(201, publicExport(ready));
            } finally { await paths.cleanup().catch(() => {}); }
          } catch (e) {
            if (reservation?.video) await deps.store.failExport(key, reservation.video.id).catch(() => {});
            throw e;
          }
        });
        return;
      }
      const exported = pathname.match(/^\/api\/exports\/([^/]+)\/video\.mp4$/);
      if (exported) {
        if (!validId(exported[1])) throw new HttpError(404, 'This MP4 is unavailable.');
        if (!['GET', 'HEAD'].includes(req.method || '')) throw new HttpError(405, 'Method not allowed.');
        const video = await deps.store.getExport(exported[1]);
        const file = await deps.store.exportAsset(video.id);
        res.setHeader('Cache-Control', 'private, max-age=3600');
        res.setHeader('Content-Disposition', `attachment; filename="${exportFilename(video)}"`);
        await send(req, res, file, 'video/mp4');
        return;
      }
      if (pathname === '/api/shares' && req.method === 'POST') {
        const uid = await user(req);
        const value = validateShare(await readBody(req));
        await exclusive(async () => {
          const key = fingerprint(uid, value, deps.version);
          let reservation;
          try {
            reservation = await deps.store.reserve(uid, key, value);
            if (reservation.ready) { json(200, publicVideo(reservation.ready, deps.origin)); return; }
            const paths = await deps.render(value);
            try {
              const ready = await deps.store.finish(key, reservation.video!, paths);
              json(201, publicVideo(ready, deps.origin));
            } finally { await paths.cleanup().catch(() => {}); }
          } catch (e) {
            if (reservation?.video) await deps.store.fail(key, reservation.video.id).catch(() => {});
            throw e;
          }
        });
        return;
      }
      const api = pathname.match(/^\/api\/shares\/([^/]+)$/);
      const page = pathname.match(/^\/s\/([^/]+)\/?$/);
      const asset = pathname.match(/^\/s\/([^/]+)\/(preview\.jpg)$/);
      const id = api?.[1] || page?.[1] || asset?.[1];
      if (!id || !validId(id)) throw new HttpError(404, 'This shared video is unavailable.');
      if (api && req.method === 'DELETE') {
        await deps.store.remove(id, await user(req));
        json(200, {deleted: true}); return;
      }
      if (!['GET', 'HEAD'].includes(req.method || '')) throw new HttpError(405, 'Method not allowed.');
      const video = await deps.store.get(id);
      res.setHeader('Cache-Control', 'public, max-age=60, s-maxage=60');
      if (api) { if (req.method === 'HEAD') { res.end(); return; } json(200, publicVideo(video, deps.origin)); return; }
      if (page) {
        const html = shareHtml(video, deps.origin, deps.assets);
        res.setHeader('Content-Type', 'text/html; charset=utf-8');
        res.setHeader('Content-Length', Buffer.byteLength(html));
        res.end(req.method === 'HEAD' ? undefined : html); return;
      }
      await send(req, res, await deps.store.asset(id, asset![2]), 'image/jpeg');
    } catch (e) {
      if (res.headersSent || res.destroyed) { res.destroy(); return; }
      res.setHeader('Cache-Control', 'no-store');
      res.removeHeader('Content-Length');
      const expected = e instanceof HttpError;
      if (!expected) console.error('Share request failed:', (e as {code?: string}).code || (e as Error).name);
      json(expected ? e.status : 503, {error: expected ? e.message : 'Could not prepare this video. Your edits are safe. Please try again.'});
    }
  };
}
