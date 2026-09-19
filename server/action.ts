import "server-only";
import { z } from "zod";
import { getUser, type SessionUser } from "@/server/auth/session";
import type { ActionResult } from "@/lib/schemas/common";

/** Thrown by handlers for failures the editor can act on; the message is shown as-is. */
export class UserError extends Error {
  constructor(message: string, readonly fieldErrors?: Record<string, string>) {
    super(message);
  }
}

// Every mutation goes through here: session check → role check → zod parse → handler.
// Returns errors instead of throwing so forms can show them next to the field.
export function defineAction<S extends z.ZodType, T = undefined>(
  schema: S,
  handler: (input: z.output<S>, user: SessionUser) => Promise<T>,
  options: { role?: "admin" } = {},
) {
  return async (raw: z.input<S>): Promise<ActionResult<T>> => {
    const user = await getUser();
    if (!user) return { ok: false, error: "Your session expired. Sign in again." };
    if (options.role === "admin" && user.role !== "admin") return { ok: false, error: "Only admins can do this." };

    const parsed = schema.safeParse(raw);
    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of parsed.error.issues) fieldErrors[issue.path.join(".")] ??= issue.message;
      return { ok: false, error: "Some fields need attention.", fieldErrors };
    }

    try {
      return { ok: true, data: await handler(parsed.data, user) };
    } catch (error) {
      if (error instanceof UserError) return { ok: false, error: error.message, fieldErrors: error.fieldErrors };
      const duplicate = duplicateField(error);
      if (duplicate) return { ok: false, error: `That ${duplicate} is already in use.`, fieldErrors: { [duplicate]: "Already in use" } };
      console.error(error);
      return { ok: false, error: "Something went wrong. Nothing was saved." };
    }
  };
}

// MongoDB duplicate-key error (unique index). keyPattern names the field that clashed.
const duplicateField = (error: unknown) => {
  const e = error as { code?: number; keyPattern?: Record<string, unknown> };
  return e?.code === 11000 ? (Object.keys(e.keyPattern ?? {})[0] ?? "value") : undefined;
};
