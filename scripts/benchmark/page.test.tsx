import React from 'react';
import {test} from 'node:test';
import assert from 'node:assert/strict';
import {renderToString} from 'react-dom/server';
import {BenchmarkPage} from '../../src/benchmark/BenchmarkPage';
import {visualScore, type BenchmarkResult, type BenchmarkResults} from '../../src/benchmark/types';

const sample = (): BenchmarkResult => ({
  model: 'opus-5-5', brief: 'product-launch', run: 1, status: 'rendered', attempts: 1,
  firstAttemptPassed: true, provider: 'test-provider', generatedAt: '2026-10-08T12:00:00.000Z',
  costUsd: 0.1234, generationMs: 12300, renderMs: 4100,
  video: 'benchmark/media/test/video.mp4', poster: 'benchmark/media/test/poster.jpg',
  source: 'benchmark/media/test/source.tsx', request: 'benchmark/media/test/request.json', reviews: [],
});
const render = (entry: BenchmarkResult) => {
  const data: BenchmarkResults = {version: '1.0', edition: '2026-10', updatedAt: '2026-10-08', status: 'in-progress', entries: [entry]};
  return renderToString(<BenchmarkPage base="/voodoo/" data={data} />);
};
test('real rendered entry shows video, actual metrics, and base-aware downloads', () => {
  const html = render(sample());
  assert.match(html, /data-video-src="\/voodoo\/benchmark\/media\/test\/video.mp4"/);
  assert.doesNotMatch(html, /<video[^>]*\ssrc=/);
  assert.match(html, /\$0.123/);
  assert.match(html, /12.3s/);
  assert.match(html, /Review pending/);
  assert.match(html, /href="\/voodoo\/benchmark\/media\/test\/source.tsx"/);
  assert.match(html, /Passed on first attempt/);
});
test('failed entry is not a pending run or a fabricated video', () => {
  const entry = {...sample(), status: 'failed' as const, attempts: 2, firstAttemptPassed: false, video: undefined, poster: undefined, error: '<script>unsafe</script>'};
  const html = render(entry);
  assert.match(html, /Render failed/);
  assert.match(html, /2 attempts/);
  assert.doesNotMatch(html, /src="\/voodoo\/benchmark\/media\/test\/video.mp4"/);
  assert.match(html, /&lt;script&gt;unsafe&lt;\/script&gt;/);
});
test('visual scores require two reviewers and never penalize unreviewed output', () => {
  const entry = sample();
  const review = {reviewer: 'A', scores: {design: 4, motion: 3, readability: 5, adherence: 4}};
  assert.equal(visualScore(entry), null);
  entry.reviews = [review];
  assert.equal(visualScore(entry), null);
  entry.reviews.push({...review, reviewer: 'B'});
  assert.equal(visualScore(entry), 80);
  assert.match(render(entry), /80.0/);
  assert.equal(visualScore({...entry, status: 'failed'}), null);
});
test('repaired output discloses repair instead of first-attempt success', () => {
  const html = render({...sample(), attempts: 2, firstAttemptPassed: false});
  assert.match(html, /Passed after repair/);
  assert.doesNotMatch(html, /Passed on first attempt/);
  assert.match(html, /Repair-feedback limitation/);
  assert.match(html, /Treat repair outcomes as provisional/);
});
test('a truncated generation is identified separately from a render failure', () => {
  const html = render({...sample(), status: 'failed', firstAttemptPassed: false, video: undefined, poster: undefined, error: 'Invalid submission: Completion limit reached.'});
  assert.match(html, /Token limit reached/);
  assert.match(html, /Completion limit reached/);
});
test('the expandable selected brief precedes its results', () => {
  const html = render(sample());
  assert.match(html, /Product launch - full brief/);
  assert.ok(html.indexOf('id="briefs"') < html.indexOf('class="benchmark-grid"'));
  assert.equal((html.match(/class="benchmark-prompt"/g) ?? []).length, 1);
});
test('malformed JSON is distinguished from truncated code', () => {
  const html = render({...sample(), status: 'failed', firstAttemptPassed: false, error: 'Invalid submission: Unexpected token'});
  assert.match(html, /Invalid response format/);
  assert.match(html, /could not be read as the required JSON/);
});
