import {preview} from 'vite';
import {spawn} from 'node:child_process';
import fs from 'node:fs';

const server = await preview({base: '/', preview: {host: '127.0.0.1', port: 0, strictPort: true}});
try {
  const address = server.httpServer.address();
  if (!address || typeof address === 'string') throw new Error('Preview did not expose a local port.');
  const scripts = ['scripts/smoke-video-policy.cjs', 'scripts/smoke-benchmark.cjs'];
  if (JSON.parse(fs.readFileSync('src/benchmark/recovery.json', 'utf8')).entries.length) scripts.push('scripts/smoke-recovery.cjs');
  for (const script of scripts) {
    const child = spawn(process.execPath, [script], {
      stdio: 'inherit',
      env: {...process.env, URL: `http://127.0.0.1:${address.port}/`},
    });
    const code = await new Promise((resolve, reject) => {
      child.on('error', reject);
      child.on('exit', code => resolve(code ?? 1));
    });
    if (code) { process.exitCode = code; break; }
  }
} finally {
  await new Promise((resolve, reject) => server.httpServer.close(error => error ? reject(error) : resolve()));
}
