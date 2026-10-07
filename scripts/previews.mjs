// Pre-render a lightweight poster + MP4 loop per catalog entry into public/previews.
// Gallery cards show these files instead of live Remotion players.
import {bundle} from '@remotion/bundler';
import {renderMedia, renderStill, selectComposition} from '@remotion/renderer';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const outDir = path.join(root, 'public/previews');
const manifest = JSON.parse(fs.readFileSync(path.join(root, 'src/catalog/manifest.json'), 'utf8'));
const only = process.argv.slice(2);

function findBrowser() {
  if (process.env.REMOTION_BROWSER) return process.env.REMOTION_BROWSER;
  const cache = path.join(os.homedir(), 'Library/Caches/ms-playwright');
  if (!fs.existsSync(cache)) return null;
  for (const d of fs.readdirSync(cache).filter((x) => x.startsWith('chromium_headless_shell-')).sort().reverse()) {
    const exe = path.join(cache, d, 'chrome-headless-shell-mac-arm64', 'chrome-headless-shell');
    if (fs.existsSync(exe)) return exe;
  }
  return null;
}

fs.mkdirSync(outDir, {recursive: true});
const serveUrl = await bundle({entryPoint: path.join(root, 'src/remotion/index.ts')});
const browserExecutable = findBrowser();
const scale = 480 / 1920;

for (const entry of manifest.entries) {
  if (only.length && !only.includes(entry.id)) continue;
  const composition = await selectComposition({serveUrl, id: entry.composition, inputProps: entry.props, browserExecutable});
  const base = {composition, serveUrl, inputProps: entry.props, browserExecutable, scale};
  await renderStill({...base, output: path.join(outDir, `${entry.id}.jpg`), frame: 40, imageFormat: 'jpeg', jpegQuality: 80});
  await renderMedia({
    ...base,
    codec: 'h264',
    crf: 28,
    muted: true,
    outputLocation: path.join(outDir, `${entry.id}.mp4`),
  });
  console.log('rendered', entry.id);
}
