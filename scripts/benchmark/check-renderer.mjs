import fs from 'node:fs';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
import {root} from './protocol.mjs';

const directory = fs.mkdtempSync('/tmp/cliphouse-renderer-check-');
const input = path.join(directory, 'input');
const output = path.join(directory, 'output');
fs.mkdirSync(input);
fs.mkdirSync(output);
fs.writeFileSync(path.join(input, 'submission.tsx'), `
import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {palette} from './contract';
export function BenchmarkVideo() {
  const frame = useCurrentFrame();
  return <AbsoluteFill style={{background: palette.background, color: palette.foreground, fontFamily: 'Archivo', justifyContent: 'center', alignItems: 'center'}}>
    <div style={{fontSize: 90, transform: \`translateX(\${Math.sin(frame / 30) * 120}px)\`}}>Renderer verification</div>
    <div style={{fontSize: 40, color: palette.accent}}>{frame}</div>
  </AbsoluteFill>;
}`);
try {
  execFileSync('docker', [
    'run', '--rm', '--network=none', '--read-only', '--cap-drop=ALL',
    '--security-opt=no-new-privileges', '--pids-limit=256', '--memory=3g', '--cpus=2',
    '--shm-size=512m', '--tmpfs', '/tmp:rw,nosuid,size=768m',
    '--tmpfs', '/work:rw,nosuid,size=768m,uid=1000,gid=1000',
    '--mount', `type=bind,src=${input},dst=/input,readonly`,
    '--mount', `type=bind,src=${output},dst=/out`,
    'cliphouse-benchmark:1',
  ], {stdio: 'inherit', timeout: 600000});
  for (const name of ['video.mp4', 'poster.jpg']) {
    if (!fs.lstatSync(path.join(output, name)).isFile() || !fs.statSync(path.join(output, name)).size) throw new Error(`Missing ${name}.`);
  }
  console.log(`Renderer verification passed: ${output}`);
} finally {
  // Keep the artifacts outside the public benchmark for inspection.
  console.log(`Verification artifacts: ${directory}`);
}
