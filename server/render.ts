import {mkdtemp, rm, stat} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import path from 'node:path';
import {makeCancelSignal, openBrowser, renderMedia, renderStill, selectComposition} from '@remotion/renderer';
import type {Snapshot} from './model.ts';

export async function renderVideo(value: Snapshot) {
  const directory = await mkdtemp(path.join(tmpdir(), 'cliphouse-share-'));
  const image = path.join(directory, 'preview.jpg');
  const video = path.join(directory, 'video.mp4');
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
    await renderMedia({...common, scale: 640 / Math.max(composition.width, composition.height),
      codec: 'h264', pixelFormat: 'yuv420p', crf: 26, muted: true, concurrency: 2, outputLocation: video});
    const [imageStat, videoStat] = await Promise.all([stat(image), stat(video)]);
    if (imageStat.size + videoStat.size > 9_500_000) throw new Error('Rendered media exceeds preview size limit.');
    return {image, video, cleanup};
  } catch (e) {
    await cleanup();
    throw e;
  } finally {
    clearTimeout(timer);
    await browser.close({silent: true});
  }
}
