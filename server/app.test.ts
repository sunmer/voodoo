import assert from 'node:assert/strict';
import {after, before, test} from 'node:test';
import {createServer} from 'node:http';
import {Readable} from 'node:stream';
import manifest from '../src/catalog/manifest.json' with {type: 'json'};
import {createHandler} from './app.ts';
import {HttpError, byteRange, fingerprint, shareHtml, validateShare, type Published} from './model.ts';
import type {createStore} from './store.ts';

const variant = manifest.variants[0];
const props = structuredClone(variant.props);
props.texts.headline = 'MY SHARED EDIT';
const payload = {variantId: variant.id, props};
const id = 'abcdefghijklmnopqrstuvwxyz123456';
const data: Published = {...validateShare(payload), id, owner: 'alice', status: 'ready', createdAt: 1};
const saved = new Map<string, Published>([[id, data]]);
const completed = new Map<string, Published>();
let renders = 0;
let failRender = false;
const bytes = Buffer.from('0123456789');
const store = {
  async reserve(owner: string, key: string, value: ReturnType<typeof validateShare>) {
    if (completed.has(key)) return {ready: completed.get(key)};
    return {video: {...value, id, owner, status: 'rendering', createdAt: 1}};
  },
  async finish(key: string, value: Published) { const ready = {...value, status: 'ready'}; completed.set(key, ready); saved.set(id, ready); return ready; },
  async fail() {},
  async get(key: string) { if (!saved.has(key)) throw new HttpError(404, 'This shared video is unavailable.'); return saved.get(key)!; },
  async remove(key: string, uid: string) { const item = await this.get(key); if (item.owner !== uid) throw new HttpError(403, 'Not your video.'); saved.delete(key); },
  async asset() { return {size: bytes.length, stream: (range?: {start: number; end: number}) => Readable.from(range ? bytes.subarray(range.start, range.end + 1) : bytes)}; },
} as ReturnType<typeof createStore>;
const server = createServer(createHandler({
  store, origin: 'https://cliphou.se', origins: new Set(['https://cliphou.se']), version: 'test',
  assets: {file: 'assets/test.js', css: ['assets/test.css']},
  verify: async (token) => {
    if (token === 'expired') throw new Error('expired');
    return {uid: token, email_verified: token !== 'unverified', firebase: {sign_in_provider: token === 'anonymous' ? 'anonymous' : 'google.com'}};
  },
  render: async () => {
    renders++;
    if (failRender) throw new Error('render failed');
    return {image: '/tmp/test.jpg', video: '/tmp/test.mp4', cleanup: async () => {}};
  },
}));
let origin: string;
before(async () => { await new Promise<void>((resolve) => server.listen(0, '127.0.0.1', resolve)); origin = `http://127.0.0.1:${(server.address() as {port: number}).port}`; });
after(() => new Promise<void>((resolve) => server.close(() => resolve())));
const post = (body: unknown, token = 'alice', headers = {}) => fetch(`${origin}/api/shares`, {method: 'POST',
  headers: {'Content-Type': 'application/json', Authorization: `Bearer ${token}`, ...headers}, body: JSON.stringify(body)});

test('all presets validate, unknown fields and active-content colors do not', () => {
  for (const v of manifest.variants) assert.doesNotThrow(() => validateShare({variantId: v.id, props: v.props}));
  for (const input of [
    {...payload, owner: 'bob'}, {...payload, variantId: '../private'},
    {...payload, props: {...props, theme: {...props.theme, accent: 'url(https://evil.test)'}}},
    {...payload, props: {...props, texts: {...props.texts, headline: 'x'.repeat(25)}}},
    {...payload, props: {...props, texts: {...props.texts, headline: '   '}}},
  ]) assert.throws(() => validateShare(input), HttpError);
});
test('fingerprints distinguish users and edits but not input property order', () => {
  const a = validateShare(payload);
  const reordered = validateShare({...payload, props: {theme: props.theme, texts: Object.fromEntries(Object.entries(props.texts).reverse())}});
  assert.equal(fingerprint('alice', a, '1'), fingerprint('alice', reordered, '1'));
  assert.notEqual(fingerprint('alice', a, '1'), fingerprint('bob', a, '1'));
  assert.notEqual(fingerprint('alice', a, '1'), fingerprint('alice', a, '2'));
});
test('publishing checks tokens, Google identity, origin, body size and schema before rendering', async () => {
  assert.equal((await fetch(`${origin}/api/shares`, {method: 'POST'})).status, 401);
  for (const token of ['expired', 'anonymous', 'unverified']) assert.ok([401, 403].includes((await post(payload, token)).status));
  assert.equal((await post(payload, 'alice', {Origin: 'https://evil.test'})).status, 403);
  assert.equal((await post({...payload, props: {}})).status, 400);
  assert.equal((await post({x: 'x'.repeat(17_000)})).status, 413);
  assert.equal(renders, 0);
});
test('a signed-in edit publishes once and retries reuse its link', async () => {
  const first = await post(payload);
  assert.equal(first.status, 201);
  const body = await first.json();
  assert.deepEqual(body.props, props);
  assert.equal(body.url, `https://cliphou.se/s/${id}`);
  assert.equal('owner' in body, false);
  assert.equal((await post(payload)).status, 200);
  assert.equal(renders, 1);
});
test('anonymous crawlers get edit-specific metadata without JavaScript or authentication', async () => {
  const response = await fetch(`${origin}/s/${id}`);
  const html = await response.text();
  assert.equal(response.status, 200);
  assert.match(html, /og:title" content="MY SHARED EDIT"/);
  assert.match(html, new RegExp(`og:video" content="https://cliphou.se/s/${id}/video.mp4"`));
  assert.match(html, new RegExp(`og:image" content="https://cliphou.se/s/${id}/preview.jpg"`));
  assert.ok(!html.includes('alice'));
  const fetched = await (await fetch(`${origin}/api/shares/${id}`)).json();
  assert.deepEqual(fetched.props, props);
  assert.equal(fetched.owner, undefined);
  assert.equal((await fetch(`${origin}/s/${'z'.repeat(32)}`)).status, 404);
});
test('untrusted copy cannot escape metadata or introduce scripts', () => {
  const html = shareHtml({...data, title: '\"><script>alert(1)</script>'}, 'https://cliphou.se', {file: 'assets/a.js'});
  assert.ok(!html.includes('<script>alert'));
  assert.match(html, /&lt;script&gt;/);
});
test('video delivery supports HEAD, full files and Safari byte ranges', async () => {
  const url = `${origin}/s/${id}/video.mp4`;
  const head = await fetch(url, {method: 'HEAD'});
  assert.equal(head.headers.get('content-type'), 'video/mp4');
  assert.equal(head.headers.get('content-length'), '10');
  assert.equal(await head.text(), '');
  assert.equal(await (await fetch(url)).text(), '0123456789');
  const range = await fetch(url, {headers: {Range: 'bytes=0-1'}});
  assert.equal(range.status, 206);
  assert.equal(range.headers.get('content-range'), 'bytes 0-1/10');
  assert.equal(await range.text(), '01');
  assert.equal((await fetch(url, {headers: {Range: 'bytes=99-100'}})).status, 416);
  assert.deepEqual(byteRange('bytes=-3', 10), {start: 7, end: 9});
  assert.deepEqual(byteRange('bytes=2-', 10), {start: 2, end: 9});
  for (const invalid of ['bytes=-', 'bytes=-0', 'bytes=3-2', 'bytes=0-1,3-4']) assert.throws(() => byteRange(invalid, 10), HttpError);
});
test('render failures return an actionable error and release the renderer', async () => {
  failRender = true;
  const response = await post(payload, 'charlie');
  assert.equal(response.status, 503);
  assert.match((await response.json()).error, /edits are safe/);
  failRender = false;
  assert.equal((await post(payload, 'charlie')).status, 201);
});
test('only the owner can remove a published link', async () => {
  assert.equal((await fetch(`${origin}/api/shares/${id}`, {method: 'DELETE', headers: {Authorization: 'Bearer bob'}})).status, 403);
  assert.equal((await fetch(`${origin}/api/shares/${id}`, {method: 'DELETE', headers: {Authorization: 'Bearer charlie'}})).status, 200);
  assert.equal((await fetch(`${origin}/s/${id}`)).status, 404);
});
