import {bundle} from '@remotion/bundler';
import path from 'node:path';

await bundle({entryPoint: path.resolve('src/remotion/index.ts'), outDir: path.resolve('render-bundle')});
console.log('Share render bundle ready.');
