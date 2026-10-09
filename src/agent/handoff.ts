import {THEME_ROLES, type VideoProps} from '../videos/vocab.ts';
import type {VideoSchema} from '../videos/contract.ts';
import {mediaSlots} from '../videos/media/catalog.ts';
import {MAX_HANDOFF_CHARS} from './versions.ts';

export type HandoffResult = {ok: true; props: VideoProps} | {ok: false; error: string};
const object = (value: unknown): value is Record<string, unknown> => !!value && typeof value === 'object' && !Array.isArray(value);
const sameKeys = (value: Record<string, unknown>, keys: readonly string[]) =>
  Object.keys(value).length === keys.length && keys.every((key) => Object.hasOwn(value, key));

// Agent output is untrusted. Accept only the exact text and color fields of one template.
export function validateProps(schema: VideoSchema, value: unknown): HandoffResult {
  const roles = Object.keys(schema.shape.texts.shape);
  const slots = mediaSlots(schema);
  const top = slots.length ? ['texts', 'theme', 'media'] : ['texts', 'theme'];
  if (!object(value) || !sameKeys(value, top)) return {ok: false, error: `Props must contain only ${top.join(', ')}.`};
  if (!object(value.texts) || !sameKeys(value.texts, roles)) return {ok: false, error: `texts must contain exactly: ${roles.join(', ')}.`};
  if (!object(value.theme) || !sameKeys(value.theme, THEME_ROLES)) return {ok: false, error: `theme must contain exactly: ${THEME_ROLES.join(', ')}.`};
  if (slots.length && (!object(value.media) || !sameKeys(value.media, slots))) return {ok: false, error: `media must contain exactly: ${slots.join(', ')}.`};
  for (const role of roles) {
    const text = value.texts[role];
    if (typeof text === 'string' && (!text.trim() || /[\u0000-\u0008\u000b\u000c\u000e-\u001f]/.test(text))) {
      return {ok: false, error: `texts.${role} must contain visible text without control characters.`};
    }
  }
  const result = schema.safeParse(value);
  if (!result.success) {
    const issue = result.error.issues[0];
    return {ok: false, error: `${issue.path.join('.')}: ${issue.message}.`};
  }
  return {ok: true, props: result.data as VideoProps};
}

export function readHandoff(raw: string, schema: VideoSchema): HandoffResult {
  if (raw.length > MAX_HANDOFF_CHARS) return {ok: false, error: `The props value is longer than ${MAX_HANDOFF_CHARS} characters.`};
  let value: unknown;
  try { value = JSON.parse(raw); }
  catch { return {ok: false, error: 'The props value is not valid JSON.'}; }
  return validateProps(schema, value);
}
