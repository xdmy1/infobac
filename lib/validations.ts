import { z } from "zod";

// -----------------------------------------------------------------------------
// Contact form
// -----------------------------------------------------------------------------

export const contactTopics = [
  { value: "general", label: "Întrebare generală" },
  { value: "pricing", label: "Plată / abonament" },
  { value: "tech", label: "Problemă tehnică" },
  { value: "school", label: "Pentru școli / parteneriate" },
  { value: "press", label: "Presă / media" },
] as const;

const contactTopicValues = contactTopics.map((t) => t.value) as [
  (typeof contactTopics)[number]["value"],
  ...Array<(typeof contactTopics)[number]["value"]>,
];

export const contactSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Numele trebuie să aibă cel puțin 2 caractere.")
    .max(80, "Numele e prea lung."),
  email: z
    .string()
    .trim()
    .min(1, "Te rugăm să introduci o adresă de email.")
    .email("Adresa de email nu pare validă."),
  topic: z.enum(contactTopicValues),
  message: z
    .string()
    .trim()
    .min(10, "Spune-ne măcar 10 caractere ca să putem ajuta concret.")
    .max(2000, "Mesajul e prea lung — sub 2000 de caractere."),
  hp: z
    .string()
    .max(0, "Detectat ca spam.")
    .optional()
    .or(z.literal("")),
});

export type ContactInput = z.infer<typeof contactSchema>;

// -----------------------------------------------------------------------------
// Auth (used in PAS 6 — login + signup)
// -----------------------------------------------------------------------------

export const signupSchema = z
  .object({
    fullName: z
      .string()
      .trim()
      .min(2, "Numele trebuie să aibă cel puțin 2 caractere.")
      .max(80, "Numele e prea lung."),
    email: z
      .string()
      .trim()
      .min(1, "Te rugăm să introduci o adresă de email.")
      .email("Adresa de email nu pare validă."),
    password: z
      .string()
      .min(8, "Parola trebuie să aibă cel puțin 8 caractere.")
      .max(72, "Parola e prea lungă."),
    terms: z
      .boolean()
      .refine((v) => v === true, "Trebuie să accepți termenii."),
  });

export type SignupInput = z.infer<typeof signupSchema>;

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Te rugăm să introduci adresa de email.")
    .email("Adresa de email nu pare validă."),
  password: z.string().min(1, "Te rugăm să introduci parola."),
});

export type LoginInput = z.infer<typeof loginSchema>;

export const resetPasswordRequestSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Introdu adresa de email.")
    .email("Adresa de email nu pare validă."),
});

export type ResetPasswordRequestInput = z.infer<
  typeof resetPasswordRequestSchema
>;

export const resetPasswordSubmitSchema = z
  .object({
    password: z
      .string()
      .min(8, "Parola trebuie să aibă cel puțin 8 caractere.")
      .max(72, "Parola e prea lungă."),
    confirmPassword: z.string().min(1, "Confirmă parola."),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "Parolele nu coincid.",
    path: ["confirmPassword"],
  });

export type ResetPasswordSubmitInput = z.infer<
  typeof resetPasswordSubmitSchema
>;
