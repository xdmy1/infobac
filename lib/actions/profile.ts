"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import { createClient } from "@/lib/supabase/server";
import { isPreviewMode } from "@/lib/preview-mode";

const profileSchema = z.object({
  full_name: z
    .string()
    .trim()
    .min(2, "Numele trebuie să aibă cel puțin 2 caractere.")
    .max(80, "Numele e prea lung."),
  school: z
    .string()
    .trim()
    .max(120, "Numele liceului e prea lung.")
    .or(z.literal(""))
    .nullable()
    .optional(),
  grade: z
    .number()
    .int()
    .min(9)
    .max(13)
    .nullable()
    .optional(),
});

export type ProfileInput = z.infer<typeof profileSchema>;

export type UpdateProfileResult =
  | { ok: true; mode: "preview" | "saved" }
  | {
      ok: false;
      error: string;
      fieldErrors?: Partial<Record<keyof ProfileInput, string>>;
    };

export async function updateProfileAction(
  input: unknown
): Promise<UpdateProfileResult> {
  // Coerce empty grade strings to null before validation.
  const raw =
    typeof input === "object" && input !== null
      ? {
          ...(input as Record<string, unknown>),
          grade: (input as Record<string, unknown>).grade
            ? Number((input as Record<string, unknown>).grade)
            : null,
        }
      : input;

  const parsed = profileSchema.safeParse(raw);
  if (!parsed.success) {
    const fieldErrors: Partial<Record<keyof ProfileInput, string>> = {};
    for (const issue of parsed.error.issues) {
      const k = issue.path[0] as keyof ProfileInput | undefined;
      if (k && !fieldErrors[k]) fieldErrors[k] = issue.message;
    }
    return {
      ok: false,
      error: "Verifică datele formularului.",
      fieldErrors,
    };
  }

  if (isPreviewMode) {
    return { ok: true, mode: "preview" };
  }

  if (!isSupabaseConfigured) {
    return {
      ok: false,
      error: "Supabase nu e configurat — nu putem salva.",
    };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { ok: false, error: "Sesiunea a expirat. Re-loghează-te." };
  }

  const { error } = await supabase
    .from("profiles")
    .update({
      full_name: parsed.data.full_name,
      school: parsed.data.school || null,
      grade: parsed.data.grade ?? null,
    })
    .eq("id", user.id);

  if (error) {
    console.error("[profile] update error:", error);
    return { ok: false, error: "Nu am putut salva modificările." };
  }

  revalidatePath("/setari");
  revalidatePath("/dashboard");
  return { ok: true, mode: "saved" };
}
