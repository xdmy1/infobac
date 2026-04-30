"use client";

import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Send } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  contactSchema,
  contactTopics,
  type ContactInput,
} from "@/lib/validations";
import { submitContact } from "@/lib/actions/contact";

const errorMsg =
  "text-xs font-medium text-destructive";

export function ContactForm() {
  const [isPending, startTransition] = useTransition();

  const form = useForm<ContactInput>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      topic: "general",
      message: "",
      hp: "",
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setError,
  } = form;

  const onSubmit = handleSubmit((data) => {
    startTransition(async () => {
      const result = await submitContact(data);

      if (result.ok) {
        toast.success(
          result.mode === "sent"
            ? "Mesaj trimis. Îți răspundem în câteva ore."
            : "Mesaj primit (mod dev — Resend nu e configurat încă, vezi consolă server)."
        );
        reset();
        return;
      }

      toast.error(result.error);

      if (result.fieldErrors) {
        for (const [field, message] of Object.entries(result.fieldErrors)) {
          if (message) {
            setError(field as keyof ContactInput, { message });
          }
        }
      }
    });
  });

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-5" noValidate>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field
          id="name"
          label="Numele tău"
          error={errors.name?.message}
        >
          <Input
            id="name"
            type="text"
            autoComplete="name"
            disabled={isPending}
            aria-invalid={!!errors.name}
            placeholder="Andrei P."
            {...register("name")}
          />
        </Field>

        <Field id="email" label="Email" error={errors.email?.message}>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            disabled={isPending}
            aria-invalid={!!errors.email}
            placeholder="andrei@exemplu.md"
            {...register("email")}
          />
        </Field>
      </div>

      <Field id="topic" label="Subiect" error={errors.topic?.message}>
        <select
          id="topic"
          disabled={isPending}
          aria-invalid={!!errors.topic}
          className={cn(
            "h-10 w-full rounded-lg border border-border bg-background px-3 text-sm font-medium text-foreground shadow-sm outline-none transition-colors",
            "focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/40",
            "disabled:cursor-not-allowed disabled:opacity-50",
            "aria-invalid:border-destructive aria-invalid:ring-destructive/30"
          )}
          {...register("topic")}
        >
          {contactTopics.map((t) => (
            <option key={t.value} value={t.value}>
              {t.label}
            </option>
          ))}
        </select>
      </Field>

      <Field id="message" label="Mesaj" error={errors.message?.message}>
        <Textarea
          id="message"
          rows={6}
          disabled={isPending}
          aria-invalid={!!errors.message}
          placeholder="Spune-ne în detaliu cu ce te putem ajuta..."
          {...register("message")}
        />
      </Field>

      <input
        type="text"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden
        className="absolute left-[-9999px] h-px w-px opacity-0"
        {...register("hp")}
      />

      <div className="flex flex-col-reverse items-start justify-between gap-3 pt-2 sm:flex-row sm:items-center">
        <p className="text-xs text-muted-foreground">
          Datele tale nu sunt partajate cu nimeni. Răspundem doar la
          întrebare.
        </p>
        <button
          type="submit"
          disabled={isPending}
          className={cn(
            buttonVariants(),
            "h-11 gap-2 px-5 text-sm font-medium",
            isPending && "cursor-wait"
          )}
        >
          <Send
            className={cn("size-4", isPending && "animate-pulse")}
            strokeWidth={2.25}
          />
          {isPending ? "Trimit..." : "Trimite mesaj"}
        </button>
      </div>
    </form>
  );
}

function Field({
  id,
  label,
  error,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id} className="text-sm font-medium">
        {label}
      </Label>
      {children}
      {error && (
        <p role="alert" className={errorMsg}>
          {error}
        </p>
      )}
    </div>
  );
}
