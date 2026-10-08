// Extract a published source package, install it from its lockfile, and check that it renders
// the same frame as the main repository. Usage: node scripts/source-render.test.mjs [template]
import {execFileSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const template = process.argv[2] || 'stack';
const versions = JSON.parse(fs.readFileSync(path.join(root, 'src/videos/versions.json'), 'utf8'));
const {version} = versions[template].at(-1);
const manifest = JSON.parse(fs.readFileSync(path.join(root, 'src/catalog/manifest.json'), 'utf8'));
const props = manifest.variants.find((v) => v.template === template && !v.hidden).props;
const meta = fs.readFileSync(path.join(root, `src/videos/${template}/meta.ts`), 'utf8');
const frame = Number(meta.match(/posterFrame:\s*(\d+)/)[1]);
const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'cliphouse-source-'));
const run = (cmd, args, cwd) => execFileSync(cmd, args, {cwd, stdio: ['ignore', 'pipe', 'inherit'], env: process.env});
const sha = (file) => createHash('sha256').update(fs.readFileSync(file)).digest('hex');

run('tar', ['xzf', path.join(root, `public/source/${template}/v${version}.tar.gz`), '-C', dir]);
const pkg = path.join(dir, `cliphouse-${template}-v${version}`);
run('npm', ['ci', '--no-audit', '--no-fund'], pkg);
run('npx', ['remotion', 'still', 'src/index.ts', template, path.join(dir, 'package.png'), `--frame=${frame}`, '--props=props.json'], pkg);
fs.writeFileSync(path.join(dir, 'props.json'), JSON.stringify(props));
run('npx', ['remotion', 'still', 'src/remotion/index.ts', template, path.join(dir, 'repo.png'), `--frame=${frame}`, `--props=${path.join(dir, 'props.json')}`], root);
if (sha(path.join(dir, 'package.png')) !== sha(path.join(dir, 'repo.png'))) throw new Error(`${template} v${version}: package frame differs from repository frame.`);
run('npx', ['remotion', 'render', 'src/index.ts', template, 'out/video.mp4', '--props=props.json', '--frames=0-29'], pkg);
if (fs.statSync(path.join(pkg, 'out/video.mp4')).size < 10_000) throw new Error('Rendered MP4 is unexpectedly small.');
fs.rmSync(dir, {recursive: true, force: true});
console.log(`${template} v${version}: source package installs, renders, and matches the repository frame.`);
