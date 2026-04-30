"use client";

import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Save } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  updateProfileAction,
  type ProfileInput,
} from "@/lib/actions/profile";

interface ProfileFormProps {
  defaults: {
    full_name: string;
    email: string;
    school: string;
    grade: number | "";
  };
}

export function ProfileForm({ defaults }: ProfileFormProps) {
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    setError,
  } = useForm<{
    full_name: string;
    school: string;
    grade: string;
  }>({
    defaultValues: {
      full_name: defaults.full_name,
      school: defaults.school,
      grade: defaults.grade === "" ? "" : String(defaults.grade),
    },
  });

  const onSubmit = handleSubmit((values) => {
    startTransition(async () => {
      const payload = {
        full_name: values.full_name,
        school: values.school,
        grade: values.grade === "" ? null : Number(values.grade),
      };

      const result = await updateProfileAction(payload);

      if (result.ok) {
        toast.success(
          result.mode === "preview"
            ? "Modificări reținute (preview — nu se salvează)."
            : "Profil actualizat."
        );
        return;
      }

      toast.error(result.error);
      if (result.fieldErrors) {
        for (const [field, message] of Object.entries(result.fieldErrors)) {
          if (message) {
            setError(field as keyof ProfileInput, { message });
          }
        }
      }
    });
  });

  return (
    <form onSubmit={onSubmit} className="space-y-5" noValidate>
      <div className="space-y-1.5">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={defaults.email}
          readOnly
          disabled
          className="cursor-not-allowed"
        />
        <p className="text-xs text-muted-foreground">
          Pentru schimbarea emailului, scrie-ne pe{" "}
          <a
            href="mailto:hello@infobac.md"
            className="font-medium text-foreground underline-offset-4 hover:underline"
          >
            hello@infobac.md
          </a>
          .
        </p>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="full_name">Numele complet</Label>
        <Input
          id="full_name"
          type="text"
          autoComplete="name"
          disabled={isPending}
          aria-invalid={!!errors.full_name}
          {...register("full_name", { required: true })}
        />
        {errors.full_name?.message && (
          <p role="alert" className="text-xs font-medium text-destructive">
            {errors.full_name.message}
          </p>
        )}
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="school">Liceul (opțional)</Label>
          <Input
            id="school"
            type="text"
            disabled={isPending}
            placeholder="Liceul Mircea Eliade, Chișinău"
            {...register("school")}
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="grade">Clasa (opțional)</Label>
          <select
            id="grade"
            disabled={isPending}
            className={cn(
              "h-10 w-full rounded-lg border border-border bg-background px-3 text-sm font-medium text-foreground shadow-sm outline-none transition-colors",
              "focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/40",
              "disabled:cursor-not-allowed disabled:opacity-50"
            )}
            {...register("grade")}
          >
            <option value="">— alege —</option>
            {[9, 10, 11, 12].map((g) => (
              <option key={g} value={g}>
                Clasa {g}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex justify-end pt-2">
        <button
          type="submit"
          disabled={isPending || !isDirty}
          className={cn(
            buttonVariants(),
            "h-10 gap-2 px-5 text-sm font-medium",
            isPending && "cursor-wait"
          )}
        >
          <Save className="size-4" />
          {isPending ? "Salvăm..." : "Salvează"}
        </button>
      </div>
    </form>
  );
}
