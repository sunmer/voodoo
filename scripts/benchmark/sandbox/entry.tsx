import React from 'react';
import {Composition, registerRoot} from 'remotion';
import {BenchmarkVideo} from './submission';
import './font.css';

registerRoot(() => <Composition id="Benchmark" component={BenchmarkVideo} width={1920} height={1080} fps={30} durationInFrames={360} />);
