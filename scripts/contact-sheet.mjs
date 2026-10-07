// Render key frames for catalog variants into one contact sheet per variant.
// Usage: node scripts/contact-sheet.mjs <variant-id> [...]  (output: /tmp/voodoo-sheets)
import {bundle} from '@remotion/bundler';
import {renderStill, selectComposition} from '@remotion/renderer';
import fs from 'node:fs';
import path from 'node:path';
import {templateMeta} from '../src/videos/meta.ts';

const root = path.resolve(import.meta.dirname, '..');
const out = '/tmp/voodoo-sheets';
const manifest = JSON.parse(fs.readFileSync(path.join(root, 'src/catalog/manifest.json'), 'utf8'));
const ids = process.argv.slice(2);
fs.mkdirSync(out, {recursive: true});
const serveUrl = await bundle({entryPoint: path.join(root, 'src/remotion/index.ts')});

for (const v of manifest.variants.filter((x) => ids.includes(x.id))) {
  const meta = templateMeta[v.template];
  const composition = await selectComposition({serveUrl, id: v.template, inputProps: v.props});
  const frames = meta.scenes.flatMap((s) => [s.from + Math.round(s.focus * 0.45), s.from + s.focus]);
  for (const f of frames) {
    await renderStill({composition, serveUrl, inputProps: v.props, frame: f, scale: 360 / composition.height, output: path.join(out, `${v.id}-${String(f).padStart(3, '0')}.png`)});
  }
  console.log('sheet', v.id, frames.join(','));
}
