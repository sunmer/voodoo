import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {root, validateResults} from './protocol.mjs';

const dist = path.join(root, 'dist');
const expected = JSON.parse(fs.readFileSync(path.join(root, 'src/benchmark/results.json'), 'utf8'));
const published = validateResults(JSON.parse(fs.readFileSync(path.join(dist, 'benchmark/results.json'), 'utf8')), dist);
assert.deepEqual(published, expected, 'The production build must contain every recorded result.');
for (const route of ['benchmark/index.html', `benchmark/${published.edition}/index.html`]) {
  const html = fs.readFileSync(path.join(dist, route), 'utf8');
  assert.match(html, /Motion Graphics/, `${route} must include the benchmark article.`);
  assert.match(html, /benchmark-card/, `${route} must contain prerendered results.`);
}
console.log(`Production build contains both benchmark pages and all ${published.entries.length} recorded results with their media.`);
for (const file of fs.readdirSync(dist, {recursive: true}).filter(file => file.endsWith('.html'))) {
  const html = fs.readFileSync(path.join(dist, file), 'utf8');
  for (const [tag] of html.matchAll(/<video\b[^>]*>/g)) {
    assert.doesNotMatch(tag, /\ssrc=/, `${file}: videos must not fetch before viewport observation.`);
    assert.match(tag, /data-video-src=/, `${file}: videos must use the shared loading policy.`);
    assert.match(tag, /preload="none"/, `${file}: videos must not preload.`);
  }
}
console.log('Every prerendered video defers its source until viewport observation.');
