import {mkdtemp, rm, stat} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import path from 'node:path';
import {makeCancelSignal, openBrowser, renderStill, selectComposition} from '@remotion/renderer';
import type {Snapshot} from './model.ts';

export async function renderThumbnail(value: Snapshot) {
  const directory = await mkdtemp(path.join(tmpdir(), 'cliphouse-share-'));
  const image = path.join(directory, 'preview.jpg');
  const cleanup = () => rm(directory, {recursive: true, force: true});
  const browser = await openBrowser('chrome', {
    browserExecutable: process.env.REMOTION_BROWSER || undefined,
    chromiumOptions: {gl: 'angle'},
  }).catch(async (e) => { await cleanup(); throw e; });
  const {cancelSignal, cancel} = makeCancelSignal();
  const timer = setTimeout(cancel, 250_000);
  try {
    const serveUrl = path.resolve(process.env.REMOTION_BUNDLE || 'render-bundle');
    const composition = await selectComposition({serveUrl, id: value.template, inputProps: value.props, puppeteerInstance: browser});
    const common = {serveUrl, composition, inputProps: value.props, puppeteerInstance: browser, cancelSignal, timeoutInMilliseconds: 30_000};
    await renderStill({...common, frame: value.meta.posterFrame, scale: 900 / composition.width, imageFormat: 'jpeg', jpegQuality: 85, output: image});
    if ((await stat(image)).size > 1_000_000) throw new Error('Rendered thumbnail exceeds preview size limit.');
    return {image, cleanup};
  } catch (e) {
    await cleanup();
    throw e;
  } finally {
    clearTimeout(timer);
    await browser.close({silent: true});
  }
}
