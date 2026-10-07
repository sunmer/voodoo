import {z} from 'zod';

// The editing contract every generated composition must follow:
// all copy comes from `texts`, all color comes from `theme`.
export const textSlot = (label: string, max: number) =>
  z.string().min(1, 'Required').max(max).meta({label});

export const colorSlot = (label: string) =>
  z
    .string()
    .regex(/^#[0-9a-fA-F]{6}$/, 'Use a 6-digit hex color')
    .meta({label});

export type VideoProps = {
  texts: Record<string, string>;
  theme: Record<string, string>;
};

export type TextField = {key: string; label: string; max: number};
export type ColorField = {key: string; label: string};

export type VideoSchema = z.ZodObject<{
  texts: z.ZodObject<Record<string, z.ZodString>>;
  theme: z.ZodObject<Record<string, z.ZodString>>;
}>;

// Derive editor fields from the schema so new compositions need no UI code.
export function describeSchema(schema: VideoSchema): {
  texts: TextField[];
  colors: ColorField[];
} {
  const texts = Object.entries(schema.shape.texts.shape).map(([key, s]) => ({
    key,
    label: (s.meta()?.label as string) ?? key,
    max: s.maxLength ?? 80,
  }));
  const colors = Object.entries(schema.shape.theme.shape).map(([key, s]) => ({
    key,
    label: (s.meta()?.label as string) ?? key,
  }));
  return {texts, colors};
}
