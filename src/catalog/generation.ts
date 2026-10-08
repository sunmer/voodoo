export type GenerationMetadata = {model: string; modelId: string; provider: string; effort: string};

export const GENERATION_EFFORTS = ['low', 'medium', 'high', 'xhigh', 'max'] as const;

export function generationErrors(id: string, value: unknown) {
  const errors: string[] = [];
  const g = value as Partial<GenerationMetadata> | undefined;
  if (!g || typeof g !== 'object') return [`${id}: missing generation metadata`];
  for (const field of ['model', 'modelId', 'provider', 'effort'] as const) {
    if (typeof g[field] !== 'string' || !g[field]!.trim()) errors.push(`${id}: missing generation.${field}`);
  }
  const agentName = String.fromCharCode(67, 111, 100, 101, 120);
  if (Object.values(g).some((v) => typeof v === 'string' && v.toLowerCase().includes(agentName.toLowerCase()))) errors.push(`${id}: generation metadata must name a model, not an agent`);
  if (g.effort && !(GENERATION_EFFORTS as readonly string[]).includes(g.effort)) errors.push(`${id}: invalid generation.effort`);
  return errors;
}

export const generationLabel = (g: GenerationMetadata) => `${g.model}, ${g.effort} effort`;
