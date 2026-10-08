// Generate a template one-shot with Claude on Amazon Bedrock.
// Usage: node scripts/generate.mjs <id>            (fresh generation)
//        node scripts/generate.mjs <id> --repair   (send tsc errors back once)
// Saves the exact request and raw response under generations/<id>/ and writes
// Claude's files unedited to src/videos/<id>/.
import {execFileSync} from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const MODEL = process.env.MODEL || 'eu.anthropic.claude-opus-5-5';
const EFFORT = process.env.EFFORT || 'medium';
if (!['low', 'medium', 'high', 'xhigh', 'max'].includes(EFFORT)) throw new Error(`Invalid EFFORT ${EFFORT}`);
const REGION = process.env.AWS_REGION || 'eu-north-1';
const [id, flag] = process.argv.slice(2);
const briefs = JSON.parse(fs.readFileSync(path.join(root, 'generations/briefs.json'), 'utf8'));
const brief = briefs[id];
if (!brief) throw new Error(`No brief for ${id}`);

const read = (p) => fs.readFileSync(path.join(root, p), 'utf8');
const Name = brief.name;

const system = `You write Remotion (v4) compositions for a template marketplace. Templates must follow this editing contract exactly:
- All copy comes from props.texts, using only the shared roles in vocab.ts. All color comes from props.theme (5 roles). Never hardcode brand copy or colors (neutral shadows and fixed UI chrome like window dots are fine).
- Export a meta object (TemplateMeta) whose scenes list drives the <Sequence> timeline in the component, so metadata and render always agree.
- Text must fit for any value up to each role's max length. Use the shared fit() helper or your own wrapping.
- Rendering must be deterministic: use remotion's random(seed), never Math.random. No external assets, fonts, or network.
- Only import from react, remotion, zod, '../contract', '../shared/motion', and your own files.

Reply with exactly three files, each as a line "FILE: <name>" followed by one fenced code block: meta.ts, schema.ts, ${Name}.tsx. No other prose.`;

const context = [
  ['src/videos/vocab.ts', read('src/videos/vocab.ts')],
  ['src/videos/contract.ts', read('src/videos/contract.ts')],
  ['src/videos/shared/motion.tsx', read('src/videos/shared/motion.tsx')],
  ['src/videos/stack/meta.ts (example)', read('src/videos/stack/meta.ts')],
  ['src/videos/stack/schema.ts (example)', read('src/videos/stack/schema.ts')],
  ['src/videos/stack/Stack.tsx (example)', read('src/videos/stack/Stack.tsx')],
]
  .map(([n, c]) => `### ${n}\n\`\`\`ts\n${c}\n\`\`\``)
  .join('\n\n');

const spec = `Create the template "${id}" (component export name ${Name}, schema export ${id}Schema, props type ${Name}Props, meta export ${id}Meta).
Fixed technical spec: ${brief.width}x${brief.height}, ${brief.fps} fps, ${brief.durationInFrames} frames. Text roles (exactly these): ${brief.roles.join(', ')}.
Use scene types and motion values from vocab.ts only.

Creative brief:
${brief.prompt}

Make it look distinctly different from the example template.`;

const dir = path.join(root, 'generations', id);
fs.mkdirSync(dir, {recursive: true});

let messages = [{role: 'user', content: [{text: `${context}\n\n${spec}`}]}];
let attempt = 1;
if (flag === '--repair') {
  const prev = JSON.parse(fs.readFileSync(path.join(dir, 'log.json'), 'utf8'));
  attempt = prev.attempts.length + 1;
  messages = prev.messages;
  const errors = fs.readFileSync(path.join(dir, `tsc-${attempt - 1}.txt`), 'utf8');
  messages.push({role: 'user', content: [{text: `The type check failed:\n\n${errors}\n\nReturn all three files again, fixed, in the same format.`}]});
}

const input = {modelId: MODEL, system: [{text: system}], messages, inferenceConfig: {maxTokens: 32000},
  additionalModelRequestFields: {output_config: {effort: EFFORT}}};
const tmp = path.join(os.tmpdir(), `gen-${id}.json`);
fs.writeFileSync(tmp, JSON.stringify(input));
const t0 = Date.now();
const out = JSON.parse(
  execFileSync('aws', ['bedrock-runtime', 'converse', '--region', REGION, '--cli-read-timeout', '900', '--cli-input-json', `file://${tmp}`], {
    maxBuffer: 64 * 1024 * 1024,
  }).toString(),
);
const text = out.output.message.content.map((c) => c.text ?? '').join('');
messages.push({role: 'assistant', content: [{text}]});
fs.writeFileSync(path.join(dir, `response-${attempt}.md`), text);

const files = [...text.matchAll(/FILE:\s*`?([\w.]+)`?\s*\n+```[a-z]*\n([\s\S]*?)\n```/g)];
if (files.length !== 3) throw new Error(`Expected 3 files, got ${files.length}; see response-${attempt}.md`);
const target = path.join(root, 'src/videos', id);
fs.rmSync(target, {recursive: true, force: true});
fs.mkdirSync(target, {recursive: true});
for (const [, name, code] of files) fs.writeFileSync(path.join(target, name), code + '\n');

const logPath = path.join(dir, 'log.json');
const log = fs.existsSync(logPath) && flag === '--repair' ? JSON.parse(fs.readFileSync(logPath, 'utf8')) : {model: MODEL, effort: EFFORT, system, attempts: []};
if (log.effort && log.effort !== EFFORT) throw new Error(`Repair effort ${EFFORT} does not match original effort ${log.effort}`);
log.messages = messages;
log.attempts.push({attempt, ms: Date.now() - t0, usage: out.usage, stopReason: out.stopReason, files: files.map((f) => f[1])});
fs.writeFileSync(logPath, JSON.stringify(log, null, 2));
console.log(JSON.stringify({id, attempt, usage: out.usage, stop: out.stopReason, files: files.map((f) => f[1])}));
