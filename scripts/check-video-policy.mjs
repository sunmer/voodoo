import {preview} from 'vite';
import {spawn} from 'node:child_process';

const server = await preview({base: '/', preview: {host: '127.0.0.1', port: 0, strictPort: true}});
try {
  const address = server.httpServer.address();
  if (!address || typeof address === 'string') throw new Error('Preview did not expose a local port.');
  const child = spawn(process.execPath, ['scripts/smoke-video-policy.cjs'], {
    stdio: 'inherit',
    env: {...process.env, URL: `http://127.0.0.1:${address.port}/`},
  });
  process.exitCode = await new Promise((resolve, reject) => {
    child.on('error', reject);
    child.on('exit', code => resolve(code ?? 1));
  });
} finally {
  await new Promise((resolve, reject) => server.httpServer.close(error => error ? reject(error) : resolve()));
}
