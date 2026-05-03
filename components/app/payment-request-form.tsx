"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  CheckCircle2,
  Send,
  Upload,
  X,
  MessageCircle,
} from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { CourseIcon } from "@/components/shared/course-icon";
import { cn } from "@/lib/utils";
import { submitPaymentRequestAction } from "@/lib/actions/payment";
import { allCoursesMeta, type CourseSlug } from "@/lib/content/courses";
import { pricingPlans, type PlanId } from "@/lib/content";

const TELEGRAM_PHONE = "+37368327082";

interface PaymentRequestFormProps {
  plan: PlanId;
  amountMDL: number;
  /** Pre-selected course (only for module plan, optional). */
  initialCourseSlug?: CourseSlug;
  /** Whether the user must pick a course (true for module plan). */
  requiresCourseSelection: boolean;
}

type ProofMode = "upload" | "telegram";

export function PaymentRequestForm({
  plan,
  amountMDL,
  initialCourseSlug,
  requiresCourseSelection,
}: PaymentRequestFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [courseSlug, setCourseSlug] = useState<CourseSlug | "">(
    initialCourseSlug ?? "",
  );
  const [proofMode, setProofMode] = useState<ProofMode>("telegram");
  const [proofFile, setProofFile] = useState<File | null>(null);
  const [notes, setNotes] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const planName =
    pricingPlans.find((p) => p.id === plan)?.name ?? plan;
  const selectedCourseName = courseSlug
    ? allCoursesMeta
        .find((c) => c.slug === courseSlug)
        ?.title.split(" — ")[0]
    : null;
  const telegramMessage = selectedCourseName
    ? `Am achitat pentru abonamentul „${planName}" (${selectedCourseName})`
    : `Am achitat pentru abonamentul „${planName}"`;
  const telegramUrl = `https://t.me/${TELEGRAM_PHONE}?text=${encodeURIComponent(telegramMessage)}`;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (requiresCourseSelection && !courseSlug) {
      toast.error("Alege un curs înainte.");
      return;
    }

    if (proofMode === "upload" && !proofFile) {
      toast.error("Încarcă screenshot-ul plății.");
      return;
    }

    // Open Telegram synchronously inside the click handler — popup blockers
    // require the call to be in the same user-gesture frame, so this can't
    // wait for the server action to resolve.
    if (proofMode === "telegram" && typeof window !== "undefined") {
      window.open(telegramUrl, "_blank", "noopener,noreferrer");
    }

    startTransition(async () => {
      try {
        const result = await submitPaymentRequestAction({
          plan,
          selectedCourseSlug:
            requiresCourseSelection && courseSlug ? courseSlug : undefined,
          proofVia: proofMode,
          proofFile: proofMode === "upload" ? proofFile : null,
          userNotes: notes,
        });
        if (result.ok) {
          toast.success("Cererea a fost trimisă! Te anunțăm pe email.");
          router.push(`/abonament/cumpara/${plan}/confirmat`);
        } else {
          toast.error(result.error);
        }
      } catch (err) {
        console.warn("[payment] submit failed:", err);
        toast.error(
          "Trimiterea a eșuat. Verifică conexiunea sau încearcă un fișier mai mic.",
        );
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Course picker — module plan only */}
      {requiresCourseSelection && (
        <fieldset className="rounded-2xl border border-border bg-card p-4 sm:p-5">
          <legend className="px-2 text-sm font-bold">
            1. Alege cursul tău
          </legend>
          <p className="mb-3 text-xs text-muted-foreground">
            Cu planul de un modul, primești acces doar la cursul ales.
          </p>
          <div className="grid gap-2 sm:grid-cols-3">
            {allCoursesMeta.map((c) => {
              const selected = courseSlug === c.slug;
              return (
                <label
                  key={c.slug}
                  className={cn(
                    "flex cursor-pointer items-center gap-3 rounded-xl border p-3 transition-all hover:-translate-y-0.5 hover:shadow-sm",
                    selected
                      ? "border-primary bg-primary/5 shadow-sm"
                      : "border-border bg-background",
                  )}
                >
                  <input
                    type="radio"
                    name="course"
                    value={c.slug}
                    checked={selected}
                    onChange={() => setCourseSlug(c.slug)}
                    className="sr-only"
                  />
                  <CourseIcon slug={c.slug} src={c.icon} size={32} />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold">
                      {c.title.split(" — ")[0]}
                    </p>
                    <p className="text-[11px] text-muted-foreground">
                      {c.duration}
                    </p>
                  </div>
                  {selected && (
                    <CheckCircle2 className="size-4 shrink-0 text-primary" />
                  )}
                </label>
              );
            })}
          </div>
        </fieldset>
      )}

      {/* Payment instructions */}
      <fieldset className="rounded-2xl border border-border bg-card p-4 sm:p-5">
        <legend className="px-2 text-sm font-bold">
          {requiresCourseSelection ? "2." : "1."} Trimite plata prin MIA
        </legend>

        <div className="mt-2 grid gap-3 rounded-xl bg-muted/40 p-4 sm:grid-cols-2">
          <Step
            label="Sumă"
            value={`${amountMDL} MDL`}
            highlight
          />
          <Step
            label="Număr MIA"
            value="+373 68 327 082"
            highlight
            copy="+37368327082"
          />
        </div>

        <p className="mt-3 text-xs text-muted-foreground">
          Deschide aplicația MIA pe telefon → trimite suma exactă la
          numărul de mai sus → menționează la „motiv": <span className="font-mono font-semibold">{plan}</span>
          {requiresCourseSelection && courseSlug && (
            <>
              {" — "}
              <span className="font-mono font-semibold">{courseSlug}</span>
            </>
          )}
          .
        </p>
      </fieldset>

      {/* Proof of payment */}
      <fieldset className="rounded-2xl border border-border bg-card p-4 sm:p-5">
        <legend className="px-2 text-sm font-bold">
          {requiresCourseSelection ? "3." : "2."} Confirmă plata
        </legend>

        <div className="mt-2 grid gap-2 sm:grid-cols-2">
          <ProofOption
            kind="telegram"
            selected={proofMode === "telegram"}
            onSelect={() => setProofMode("telegram")}
            title="Trimit pe Telegram"
            sub="Cel mai rapid"
            description={`Când dai „Am trimis plata", deschidem Telegram cu mesajul gata-scris către +373 68 327 082. Trimite-l împreună cu screenshot-ul.`}
          />
          <ProofOption
            kind="upload"
            selected={proofMode === "upload"}
            onSelect={() => setProofMode("upload")}
            title="Încarc screenshot aici"
            sub="JPG, PNG, PDF (max 6 MB)"
          />
        </div>

        {proofMode === "upload" && (
          <div className="mt-4">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,application/pdf"
              onChange={(e) => setProofFile(e.target.files?.[0] ?? null)}
              className="sr-only"
              id="proof-file"
            />
            {proofFile ? (
              <div className="flex items-center gap-2 rounded-xl border border-success/40 bg-success/5 p-3">
                <CheckCircle2 className="size-4 text-success" />
                <p className="flex-1 truncate text-sm">
                  <span className="font-semibold">{proofFile.name}</span>{" "}
                  <span className="text-muted-foreground">
                    ({Math.round(proofFile.size / 1024)} KB)
                  </span>
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setProofFile(null);
                    if (fileInputRef.current) fileInputRef.current.value = "";
                  }}
                  className="rounded-full p-1 text-muted-foreground hover:bg-muted"
                >
                  <X className="size-3.5" />
                </button>
              </div>
            ) : (
              <label
                htmlFor="proof-file"
                className={cn(
                  buttonVariants({ variant: "outline" }),
                  "h-11 w-full cursor-pointer gap-2 text-sm",
                )}
              >
                <Upload className="size-4" />
                Alege fișier
              </label>
            )}
          </div>
        )}

        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Mesaj opțional pentru admin (cont de telegram, IBAN, etc.)"
          rows={2}
          maxLength={300}
          className="mt-3 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none transition-colors focus:border-foreground/30"
        />
      </fieldset>

      <button
        type="submit"
        disabled={isPending}
        className={cn(
          buttonVariants(),
          "h-12 w-full gap-2 text-sm font-semibold",
          isPending && "cursor-wait",
        )}
      >
        <Send className="size-4" />
        {isPending ? "Se trimite..." : "Am trimis plata"}
      </button>

      <p className="text-center text-xs text-muted-foreground">
        Procesăm cererea într-o oră în zile lucrătoare. După aprobare, accesul
        e activ instant.
      </p>
    </form>
  );
}

function Step({
  label,
  value,
  highlight,
  copy,
}: {
  label: string;
  value: string;
  highlight?: boolean;
  copy?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-lg border bg-background px-3 py-2",
        highlight ? "border-primary/30" : "border-border",
      )}
    >
      <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
        {label}
      </p>
      <div className="mt-0.5 flex items-center gap-2">
        <p
          className={cn(
            "font-mono text-base font-bold tabular-nums",
            highlight && "text-primary",
          )}
        >
          {value}
        </p>
        {copy && <CopyButton text={copy} />}
      </div>
    </div>
  );
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text);
          setCopied(true);
          setTimeout(() => setCopied(false), 1500);
        } catch {
          // ignore
        }
      }}
      className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-semibold text-muted-foreground hover:bg-muted/80 hover:text-foreground"
    >
      {copied ? "✓ Copiat" : "Copiază"}
    </button>
  );
}

function ProofOption({
  kind,
  selected,
  onSelect,
  title,
  sub,
  description,
}: {
  kind: "telegram" | "upload";
  selected: boolean;
  onSelect: () => void;
  title: string;
  sub: string;
  description?: string;
}) {
  const Icon = kind === "telegram" ? MessageCircle : Upload;
  return (
    <label
      className={cn(
        "flex cursor-pointer items-start gap-3 rounded-xl border p-3.5 transition-all hover:-translate-y-0.5 hover:shadow-sm",
        selected
          ? "border-primary bg-primary/5 shadow-sm"
          : "border-border bg-background",
      )}
    >
      <input
        type="radio"
        name="proofMode"
        checked={selected}
        onChange={onSelect}
        className="sr-only"
      />
      <span
        className={cn(
          "inline-flex size-9 shrink-0 items-center justify-center rounded-lg",
          selected ? "bg-primary text-primary-foreground" : "bg-muted",
        )}
      >
        <Icon className="size-4" strokeWidth={2.25} />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold">{title}</p>
        <p className="text-[11px] text-muted-foreground">{sub}</p>
        {description && (
          <p className="mt-1 text-[11px] leading-relaxed text-foreground/70">
            {description}
          </p>
        )}
      </div>
      {selected && (
        <CheckCircle2 className="size-4 shrink-0 text-primary" />
      )}
    </label>
  );
}
