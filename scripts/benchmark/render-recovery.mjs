import fs from 'node:fs';
import path from 'node:path';
import {execFile, execFileSync} from 'node:child_process';
import {promisify} from 'node:util';
const exec = promisify(execFile);

export async function renderRecovery(dir, attempt, imageId) {
  const temporary = fs.mkdtempSync('/tmp/cliphouse-recovery-');
  fs.mkdirSync(path.join(temporary, 'input'));
  fs.mkdirSync(path.join(temporary, 'output'));
  fs.copyFileSync(path.join(dir, `input-${attempt}/submission.tsx`), path.join(temporary, 'input/submission.tsx'));
  const container = `cliphouse-recovery-${process.pid}`;
  const started = Date.now();
  try {
    await exec('docker', ['run', '--rm', '--name', container, '--network=none', '--read-only',
      '--cap-drop=ALL', '--security-opt=no-new-privileges', '--pids-limit=256', '--memory=3g', '--cpus=2',
      '--shm-size=512m', '--tmpfs', '/tmp:rw,nosuid,size=768m', '--tmpfs', '/work:rw,nosuid,size=768m,uid=1000,gid=1000',
      '--mount', `type=bind,src=${temporary}/input,dst=/input,readonly`,
      '--mount', `type=bind,src=${temporary}/output,dst=/out`, imageId],
    {timeout: 600000, maxBuffer: 8 * 1024 * 1024, encoding: 'utf8'});
    fs.mkdirSync(path.join(dir, `render-${attempt}`), {recursive: true});
    for (const file of ['video.mp4', 'poster.jpg']) {
      const output = path.join(temporary, 'output', file);
      if (!fs.lstatSync(output).isFile() || !fs.statSync(output).size) throw new Error(`Missing ${file}`);
      fs.copyFileSync(output, path.join(dir, `render-${attempt}`, file));
    }
    return {passed: true, ms: Date.now() - started};
  } catch (error) {
    const diagnostic = [error.stdout, error.stderr, error.message].filter(Boolean).join('\n').slice(-24000);
    fs.writeFileSync(path.join(dir, `render-error-${attempt}.txt`), diagnostic);
    return {passed: false, ms: Date.now() - started, diagnostic};
  } finally {
    try { execFileSync('docker', ['rm', '-f', container], {stdio: 'ignore'}); } catch {}
    fs.rmSync(temporary, {recursive: true, force: true});
  }
}
