"use server";

import { randomUUID } from "node:crypto";
import { z } from "zod";
import { requireUser } from "@/server/auth/session";
import { presignPut, publicBucket, publicUrl } from "./r2";

const MB = 1024 * 1024;

// extension comes from this map, never from the client's filename
const MEDIA_TYPES: Record<string, { ext: string; max: number }> = {
  "image/jpeg": { ext: "jpg", max: 10 * MB },
  "image/png": { ext: "png", max: 10 * MB },
  "image/webp": { ext: "webp", max: 10 * MB },
  "image/avif": { ext: "avif", max: 10 * MB },
  "video/mp4": { ext: "mp4", max: 60 * MB },
  "application/pdf": { ext: "pdf", max: 25 * MB },
};

const input = z.object({ contentType: z.string(), size: z.number().int().positive() });

export type SignedUpload = { ok: true; uploadUrl: string; url: string } | { ok: false; error: string };

export async function signMediaUpload(raw: z.input<typeof input>): Promise<SignedUpload> {
  await requireUser();
  const parsed = input.safeParse(raw);
  const rule = parsed.success ? MEDIA_TYPES[parsed.data.contentType] : undefined;
  if (!parsed.success || !rule) return { ok: false, error: "Unsupported file type." };
  if (parsed.data.size > rule.max) return { ok: false, error: `File is too large (max ${rule.max / MB} MB).` };

  const key = `media/${new Date().getFullYear()}/${randomUUID()}.${rule.ext}`;
  try {
    const uploadUrl = await presignPut(publicBucket(), key, parsed.data.contentType, parsed.data.size);
    return { ok: true, uploadUrl, url: publicUrl(key) };
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : "Upload failed." };
  }
}
