import { z } from "zod";

export const userInput = z.object({
  name: z.string().trim().min(2, "Enter a name").max(120),
  email: z.email("Enter a valid email").trim().toLowerCase(),
  role: z.enum(["admin", "editor"]),
  // empty on edit = keep the current password
  password: z.union([z.literal(""), z.string().min(10, "At least 10 characters").max(200)]),
});

export type UserInput = z.infer<typeof userInput>;
