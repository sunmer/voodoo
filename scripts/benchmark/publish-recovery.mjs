import fs from 'node:fs';
import path from 'node:path';
import {parseArgs} from 'node:util';
import {atomicJson, hash, root} from './protocol.mjs';
import {jobId, recoveryHash, recoveryProtocol, validateRecovery} from './recovery.mjs';

const {values} = parseArgs({options: {store: {type: 'string'}}});
const store = path.resolve(values.store ?? path.join(root, '.benchmark/2026-10'));
if (fs.existsSync(path.join(store, 'runner.lock'))) throw new Error('Wait for the active runner before publishing.');
const dir = path.join(store, 'recovery-r1');
const ledger = JSON.parse(fs.readFileSync(path.join(dir, 'ledger.json'), 'utf8'));
const baseline = JSON.parse(fs.readFileSync(path.join(root, 'src/benchmark/results.json'), 'utf8'));
if (ledger.pending.length) throw new Error('Reconcile pending recovery charges before publication.');
if (ledger.recoveryHash !== recoveryHash || ledger.baselineHash !== hash(JSON.stringify(baseline))) throw new Error('Recovery protocol or baseline changed.');
const entries = [];
for (const original of baseline.entries.filter(entry => entry.status === 'failed')) {
  const id = jobId(original);
  const run = path.join(dir, id);
  const record = JSON.parse(fs.readFileSync(path.join(run, 'record.json'), 'utf8'));
  if (record.recoveryHash !== recoveryHash || record.baselineHash !== ledger.baselineHash || record.imageId !== ledger.imageId) throw new Error(`Recovery record mismatch: ${id}`);
  const charges = ledger.charges.filter(charge => charge.job === id);
  if (charges.length !== record.attempts.length || record.attempts.some(attempt => !charges.some(charge => charge.attempt === attempt.attempt && charge.cost === attempt.costUsd))) throw new Error(`Cost mismatch: ${id}`);
  const prefix = `benchmark/media/recovery-r1-${id}`;
  const output = path.join(root, 'public', prefix);
  fs.mkdirSync(output, {recursive: true});
  const entry = {model: record.model, brief: record.brief, run: record.run, status: record.status,
    provider: record.provider, generatedAt: record.generatedAt, attempts: record.attempts.length,
    costUsd: charges.reduce((sum, charge) => sum + charge.cost, 0),
    generationMs: record.attempts.reduce((sum, attempt) => sum + attempt.generationMs, 0),
    renderMs: record.attempts.reduce((sum, attempt) => sum + attempt.renderMs, 0), request: `${prefix}/request.json`};
  const attempts = record.attempts.map(attempt => {
    const response = JSON.parse(fs.readFileSync(path.join(run, `response-${attempt.attempt}.json`), 'utf8'));
    const source = path.join(run, `input-${attempt.attempt}/submission.tsx`);
    if (attempt.sourceHash) {
      if (hash(fs.readFileSync(source)) !== attempt.sourceHash) throw new Error(`Changed generated source: ${id}/${attempt.attempt}`);
      fs.copyFileSync(source, path.join(output, `attempt-${attempt.attempt}.tsx`));
    }
    const diagnostic = path.join(run, `render-error-${attempt.attempt}.txt`);
    return {...attempt, request: JSON.parse(fs.readFileSync(path.join(run, `request-${attempt.attempt}.json`), 'utf8')),
      response: response.choices?.[0]?.message?.content, finishReason: response.choices?.[0]?.finish_reason,
      ...(fs.existsSync(diagnostic) ? {diagnostic: fs.readFileSync(diagnostic, 'utf8')} : {})};
  });
  atomicJson(path.join(output, 'request.json'), {protocol: recoveryProtocol, recoveryHash, baselineHash: ledger.baselineHash, imageId: ledger.imageId, original, attempts});
  if (record.status === 'rendered') {
    for (const file of ['video.mp4', 'poster.jpg']) {
      const source = path.join(run, `render-${record.successfulAttempt}`, file);
      if (!fs.lstatSync(source).isFile() || !fs.statSync(source).size) throw new Error(`Invalid recovery asset: ${id}/${file}`);
      fs.copyFileSync(source, path.join(output, file));
    }
    fs.copyFileSync(path.join(run, `input-${record.successfulAttempt}/submission.tsx`), path.join(output, 'source.tsx'));
    Object.assign(entry, {video: `${prefix}/video.mp4`, poster: `${prefix}/poster.jpg`, source: `${prefix}/source.tsx`});
  } else entry.error = record.error?.slice(0, 1000) || 'Automated repairs did not produce a rendered video.';
  entries.push(entry);
}
const data = validateRecovery({version: recoveryProtocol.version, entries}, baseline, path.join(root, 'public'));
atomicJson(path.join(root, 'src/benchmark/recovery.json'), data);
console.log(`Prepared ${entries.length} recovery records, ${entries.filter(entry => entry.status === 'rendered').length} recovered videos, $${entries.reduce((sum, entry) => sum + entry.costUsd, 0).toFixed(4)} additional cost. Original results unchanged.`);
