import fs from 'node:fs';
import path from 'node:path';
import {randomBytes} from 'node:crypto';
import {parseArgs} from 'node:util';
import {z} from 'zod';
import {atomicJson, digest, hash, protocol, root, validateResults} from './protocol.mjs';

const {values} = parseArgs({options: {'prepare-reviews': {type: 'boolean'}, reviews: {type: 'string'}, snapshot: {type: 'boolean'}}});
const store = path.join(root, '.benchmark', protocol.edition);
const target = path.join(root, 'src/benchmark/results.json');
const previous = JSON.parse(fs.readFileSync(target, 'utf8'));
if (!values['prepare-reviews'] && previous.status === 'complete') throw new Error('This edition is frozen. Publish corrections as a separately identified revision.');
if (!fs.existsSync(store)) throw new Error('No benchmark runs exist. Nothing to publish.');
if (fs.existsSync(path.join(store, 'runner.lock')) && !values.snapshot) throw new Error('A runner is active. Use --snapshot for completed records only, or wait before publishing.');
const records = fs.readdirSync(store, {withFileTypes: true}).filter((item) => item.isDirectory() && fs.existsSync(path.join(store, item.name, 'record.json')))
  .map((item) => ({id: item.name, dir: path.join(store, item.name), record: JSON.parse(fs.readFileSync(path.join(store, item.name, 'record.json'), 'utf8'))}));
if (!records.length) throw new Error('No completed run records exist. Nothing to publish.');
for (const {record} of records) if (record.protocolHash !== digest) throw new Error('Run protocol differs from the published protocol.');
if (previous.entries.some((entry) => !records.some(({record}) => record.model === entry.model && record.brief === entry.brief && record.run === entry.run))) throw new Error('Publication would remove an existing run.');
if (!values['prepare-reviews'] && previous.entries.some((entry) => entry.reviews.length && !values.reviews)) throw new Error('Publication would discard completed reviews.');
const ledger = JSON.parse(fs.readFileSync(path.join(store, 'ledger.json'), 'utf8'));
if ((Array.isArray(ledger.pending) ? ledger.pending.length : ledger.pending) && !values.snapshot) throw new Error('Unresolved API cost. Reconcile before publishing.');

const reviewMapFile = path.join(store, 'review-key.json');
const mapping = fs.existsSync(reviewMapFile) ? JSON.parse(fs.readFileSync(reviewMapFile, 'utf8')) : {};
if (values['prepare-reviews']) {
  const directory = path.join(store, 'blind-review');
  fs.mkdirSync(directory, {recursive: true});
  for (const {id, dir, record} of records) {
    if (record.status !== 'rendered') continue;
    mapping[id] ??= randomBytes(8).toString('hex');
    const video = path.join(dir, `render-${record.successfulAttempt}/video.mp4`);
    if (!fs.lstatSync(video).isFile()) throw new Error(`Unsafe video output for ${id}`);
    fs.copyFileSync(video, path.join(directory, `${mapping[id]}.mp4`));
  }
  atomicJson(reviewMapFile, mapping);
  const videos = records.filter(({record}) => record.status === 'rendered').map(({id, record}) => ({
    id: mapping[id], brief: record.brief, prompt: protocol.briefs.find((brief) => brief.id === record.brief).prompt,
    scores: Object.fromEntries(protocol.rubric.map((category) => [category.id, null])),
  })).sort((a, b) => a.id.localeCompare(b.id));
  atomicJson(path.join(directory, 'review-template.json'), {reviewer: 'REPLACE-WITH-REVIEWER-ID', rubric: protocol.rubric, videos});
  console.log(`Prepared ${videos.length} anonymous videos in ${directory}. Keep review-key.json private. Give two reviewers separate copies of the template.`);
  process.exit(0);
}
const reviewSchema = z.array(z.object({
  reviewer: z.string().min(1).refine((id) => id !== 'REPLACE-WITH-REVIEWER-ID'),
  rubric: z.array(z.unknown()).optional(),
  videos: z.array(z.object({
    id: z.string().regex(/^[a-f0-9]{16}$/),
    brief: z.string(),
    prompt: z.string().optional(),
    scores: z.object(Object.fromEntries(protocol.rubric.map((category) => [category.id, z.number().min(1).max(5)]))).strict(),
  }).strict()),
}).strict()).length(2);
const reviews = values.reviews ? reviewSchema.parse(JSON.parse(fs.readFileSync(values.reviews, 'utf8'))) : [];
if (reviews.length && reviews[0].reviewer === reviews[1].reviewer) throw new Error('Two distinct reviewers are required.');
for (const reviewer of reviews) {
  const ids = reviewer.videos.map((video) => video.id);
  if (new Set(ids).size !== ids.length || ids.some((id) => !Object.values(mapping).includes(id))) throw new Error('Unknown or duplicate blind review IDs.');
}

const entries = [];
for (const {id, dir, record} of records) {
  const prefix = `benchmark/media/${id}`;
  const destination = path.join(root, 'public', prefix);
  fs.mkdirSync(destination, {recursive: true});
  const costs = ledger.charges.filter((charge) => charge.job === id);
  if (costs.length !== record.attempts.length || record.attempts.some((attempt) => !costs.some((charge) => charge.attempt === attempt.attempt && charge.cost === attempt.costUsd))) throw new Error(`Ledger mismatch for ${id}.`);
  const published = {
    model: record.model, brief: record.brief, run: record.run, status: record.status,
    attempts: record.attempts.length, firstAttemptPassed: record.status === 'rendered' && record.attempts.length === 1,
    provider: record.provider, generatedAt: record.generatedAt, costUsd: costs.reduce((sum, charge) => sum + charge.cost, 0),
    generationMs: record.attempts.reduce((sum, attempt) => sum + attempt.generationMs, 0),
    renderMs: record.attempts.reduce((sum, attempt) => sum + attempt.renderMs, 0), reviews: [],
  };
  if (record.status === 'rendered') {
    const source = path.join(dir, `input-${record.successfulAttempt}/submission.tsx`);
    if (hash(fs.readFileSync(source)) !== record.attempts.at(-1).sourceHash) throw new Error(`Source changed after generation: ${id}`);
    for (const name of ['video.mp4', 'poster.jpg']) {
      const artifact = path.join(dir, `render-${record.successfulAttempt}`, name);
      const stat = fs.lstatSync(artifact);
      if (!stat.isFile() || !stat.size) throw new Error(`Missing or unsafe output: ${id}/${name}`);
      fs.copyFileSync(artifact, path.join(destination, name));
    }
    fs.copyFileSync(source, path.join(destination, 'source.tsx'));
    const requests = record.attempts.map((attempt) => JSON.parse(fs.readFileSync(path.join(dir, `request-${attempt.attempt}.json`), 'utf8')));
    atomicJson(path.join(destination, 'request.json'), {protocolHash: digest, imageId: record.imageId, requests});
    Object.assign(published, {video: `${prefix}/video.mp4`, poster: `${prefix}/poster.jpg`, source: `${prefix}/source.tsx`, request: `${prefix}/request.json`});
    if (reviews.length) published.reviews = reviews.map((reviewer, index) => {
      const review = reviewer.videos.find((video) => video.id === mapping[id]);
      if (!review || review.brief !== record.brief) throw new Error(`Missing or mismatched blind review for ${id}.`);
      return {reviewer: `Reviewer ${index + 1}`, scores: review.scores};
    });
  } else published.error = record.error?.slice(0, 1000) ?? 'The submission did not render.';
  entries.push(published);
}
const total = protocol.models.length * protocol.briefs.length * protocol.runs;
const status = entries.length < total ? 'in-progress' : entries.some((entry) => entry.status === 'rendered' && entry.reviews.length < 2) ? 'reviewing' : 'complete';
const data = validateResults({version: protocol.version, edition: protocol.edition, updatedAt: new Intl.DateTimeFormat('sv-SE', {timeZone: 'Europe/Stockholm'}).format(new Date()), status, entries}, path.join(root, 'public'));
atomicJson(target, data);
console.log(`Prepared ${entries.length} real results for publication (${status}). This command does not deploy the site.`);
