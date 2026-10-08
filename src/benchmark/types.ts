import protocol from './protocol.json';

export type BenchmarkModel = typeof protocol.models[number];
export type BenchmarkBrief = typeof protocol.briefs[number];
export type BenchmarkResult = {
  model: string;
  brief: string;
  run: number;
  status: 'rendered' | 'failed';
  attempts: number;
  firstAttemptPassed: boolean;
  provider: string;
  generatedAt: string;
  costUsd: number;
  generationMs: number;
  renderMs: number;
  video?: string;
  poster?: string;
  source?: string;
  request?: string;
  error?: string;
  reviews: {reviewer: string; scores: {design: number; motion: number; readability: number; adherence: number}}[];
};
export type BenchmarkResults = {
  version: string;
  edition: string;
  updatedAt: string;
  status: string;
  entries: BenchmarkResult[];
};

export function visualScore(entry?: BenchmarkResult) {
  if (!entry || entry.status !== 'rendered' || entry.reviews.length < 2) return null;
  return entry.reviews.reduce((total, review) => total + protocol.rubric.reduce((sum, category) =>
    sum + review.scores[category.id as keyof typeof review.scores] / 5 * category.weight, 0), 0) / entry.reviews.length;
}
