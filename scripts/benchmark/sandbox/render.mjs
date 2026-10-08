import fs from 'node:fs';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
import {bundle} from '@remotion/bundler';
import {selectComposition, renderMedia, renderStill} from '@remotion/renderer';

const work = '/work';
for (const name of ['entry.tsx', 'contract.ts', 'font.css']) fs.copyFileSync(path.join('/opt/benchmark', name), path.join(work, name));
fs.copyFileSync('/input/submission.tsx', path.join(work, 'submission.tsx'));
fs.copyFileSync('/opt/benchmark/node_modules/@fontsource-variable/archivo/files/archivo-latin-wght-normal.woff2', path.join(work, 'archivo.woff2'));
fs.symlinkSync('/opt/benchmark/node_modules', path.join(work, 'node_modules'));
fs.writeFileSync(path.join(work, 'package.json'), JSON.stringify({type: 'module'}));
execFileSync('/opt/benchmark/node_modules/.bin/tsc', [
  '--noEmit', '--jsx', 'react-jsx', '--strict', '--skipLibCheck', '--esModuleInterop',
  '--moduleResolution', 'bundler', '--module', 'ESNext', '--target', 'ES2022',
  '/work/entry.tsx', '/work/submission.tsx', '/work/contract.ts',
], {stdio: 'inherit', cwd: work, timeout: 90000});
const serveUrl = await bundle({entryPoint: '/work/entry.tsx', outDir: '/work/bundle', publicDir: null});
const browserExecutable = '/usr/bin/chromium';
const composition = await selectComposition({serveUrl, id: 'Benchmark', browserExecutable});
if (composition.width !== 1920 || composition.height !== 1080 || composition.fps !== 30 || composition.durationInFrames !== 360) throw new Error('Composition changed the fixed benchmark format.');
await renderMedia({serveUrl, composition, browserExecutable, outputLocation: '/out/video.mp4', codec: 'h264', crf: 20, muted: true, concurrency: 2});
await renderStill({serveUrl, composition, browserExecutable, output: '/out/poster.jpg', frame: 150, imageFormat: 'jpeg'});
