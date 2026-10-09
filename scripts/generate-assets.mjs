// Generate template image assets with Azure OpenAI and record how each one was made.
// Usage: node scripts/generate-assets.mjs <template> [asset-id] [--force]
// Reads src/videos/<template>/assets/prompts.json: [{id, label, prompt, size?, quality?}].
// Writes <id>.webp and records.json (prompt, model, size, quality, hash, measured tones).
// Requires AZURE_OPENAI_ENDPOINT and AZURE_OPENAI_API_KEY. Spend is logged to output/asset-costs.jsonl.
import {execFileSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const MODEL = process.env.IMAGE_MODEL || 'gpt-image-2.5-sunburst';
const endpoint = process.env.AZURE_OPENAI_ENDPOINT?.replace(/\/$/, '');
const key = process.env.AZURE_OPENAI_API_KEY;
const [template, only] = process.argv.slice(2).filter((a) => !a.startsWith('--'));
const force = process.argv.includes('--force');
if (!template) throw new Error('Usage: node scripts/generate-assets.mjs <template> [asset-id] [--force]');
if (!endpoint || !key) throw new Error('Set AZURE_OPENAI_ENDPOINT and AZURE_OPENAI_API_KEY.');

const dir = path.join(root, 'src/videos', template, 'assets');
const prompts = JSON.parse(fs.readFileSync(path.join(dir, 'prompts.json'), 'utf8'));
const recordsFile = path.join(dir, 'records.json');
const records = fs.existsSync(recordsFile) ? JSON.parse(fs.readFileSync(recordsFile, 'utf8')) : [];
const ledger = path.join(root, 'output/asset-costs.jsonl');
fs.mkdirSync(path.dirname(ledger), {recursive: true});

// Darkest and brightest tones (5th and 95th percentile luminance) per cell of a 4x4 grid.
function measure(file) {
  const py = `
import json,sys
from PIL import Image
im=Image.open(sys.argv[1]).convert('RGB').resize((160,160))
def lin(v):
  s=v/255
  return s/12.92 if s<=0.04045 else ((s+0.055)/1.055)**2.4
out=[]
for gy in range(4):
  for gx in range(4):
    ls=sorted(0.2126*lin(r)+0.7152*lin(g)+0.0722*lin(b) for r,g,b in im.crop((gx*40,gy*40,gx*40+40,gy*40+40)).getdata())
    out.append({'lo':round(ls[int(len(ls)*0.05)],4),'hi':round(ls[int(len(ls)*0.95)],4)})
print(json.dumps(out))`;
  return JSON.parse(execFileSync('python3', ['-c', py, file]).toString());
}

for (const p of prompts) {
  if (only && p.id !== only) continue;
  const existing = records.find((r) => r.id === p.id);
  if (existing && !force && existing.prompt === p.prompt && fs.existsSync(path.join(dir, existing.file))) { console.log(`skip ${p.id}`); continue; }
  const size = p.size || '1536x1024';
  const quality = p.quality || 'high';
  const t0 = Date.now();
  const res = await fetch(`${endpoint}/openai/v1/images/generations`, {method: 'POST', headers: {'api-key': key, 'content-type': 'application/json'},
    body: JSON.stringify({model: MODEL, prompt: p.prompt, size, quality, n: 1, output_format: 'png'})});
  const body = await res.json();
  fs.appendFileSync(ledger, `${JSON.stringify({at: new Date().toISOString(), template, id: p.id, model: MODEL, size, quality, status: res.status, usage: body.usage ?? null, ms: Date.now() - t0})}\n`);
  if (!res.ok) throw new Error(`${p.id}: ${res.status} ${JSON.stringify(body.error ?? body)}`);
  const png = path.join(os.tmpdir(), `asset-${template}-${p.id}.png`);
  fs.writeFileSync(png, Buffer.from(body.data[0].b64_json, 'base64'));
  const file = `${p.id}.webp`;
  const [w, h] = size.split('x').map(Number);
  const width = Math.min(1920, w * 1.25) | 0;
  execFileSync('cwebp', ['-quiet', '-q', '80', '-resize', String(width), '0', png, '-o', path.join(dir, file)]);
  const data = fs.readFileSync(path.join(dir, file));
  const record = {id: p.id, label: p.label, file, width, height: Math.round(width * h / w), sha256: createHash('sha256').update(data).digest('hex'),
    model: MODEL, prompt: p.prompt, size, quality, createdAt: new Date().toISOString().slice(0, 10), tones: measure(png)};
  records.splice(existing ? records.indexOf(existing) : records.length, existing ? 1 : 0, record);
  fs.writeFileSync(recordsFile, `${JSON.stringify(records, null, 2)}\n`);
  console.log(`generated ${template}/${p.id} in ${Math.round((Date.now() - t0) / 1000)}s, ${(data.length / 1024).toFixed(0)} KB`);
}
