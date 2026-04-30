"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Plus, X, Trash2 } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { CourseIcon } from "@/components/shared/course-icon";
import { cn } from "@/lib/utils";
import {
  grantCourseAccessAction,
  revokeCourseAccessAction,
  type GrantCourseInput,
} from "@/lib/actions/admin";
import { allCoursesMeta } from "@/lib/content/courses";

type CourseSlug = "python" | "sql" | "devices";
type Source = "manual" | "gift" | "scholarship";

interface CurrentAccess {
  id: string;
  courseSlug: string;
  courseTitle: string;
  expiresAt: string | null;
  source: string;
}

interface Props {
  userId: string;
  /** Currently active access rows so we can render Revocă buttons + show coverage. */
  currentAccess: CurrentAccess[];
}

const DURATIONS: { days: number; label: string }[] = [
  { days: 30, label: "30 zile" },
  { days: 180, label: "6 luni" },
  { days: 0, label: "Lifetime" },
];

const SOURCES: { value: Source; label: string; description: string }[] = [
  { value: "manual", label: "Manual", description: "Acordat de admin" },
  { value: "gift", label: "Cadou", description: "Promo / cadou" },
  {
    value: "scholarship",
    label: "Bursă",
    description: "Acces pe motive financiare",
  },
];

export function GrantCourseControls({ userId, currentAccess }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);
  const [courseSlug, setCourseSlug] = useState<CourseSlug>("python");
  const [duration, setDuration] = useState<number>(30);
  const [source, setSource] = useState<Source>("manual");
  const [note, setNote] = useState("");

  const grantedSlugs = new Set(currentAccess.map((c) => c.courseSlug));

  const handleGrant = () => {
    const input: GrantCourseInput = {
      userId,
      courseSlug,
      durationDays: duration,
      source,
      note,
    };
    startTransition(async () => {
      const result = await grantCourseAccessAction(input);
      if (result.ok) {
        toast.success("Acces acordat.");
        setOpen(false);
        setNote("");
        router.refresh();
      } else {
        toast.error(result.error);
      }
    });
  };

  return (
    <div className="space-y-3">
      {/* Existing access — show revoke buttons inline */}
      {currentAccess.length > 0 && (
        <ul className="space-y-2">
          {currentAccess.map((ca) => (
            <RevokeRow
              key={ca.id}
              userId={userId}
              access={ca}
              onRevoked={() => router.refresh()}
            />
          ))}
        </ul>
      )}

      {/* Grant form */}
      {open ? (
        <div className="rounded-xl border border-primary/30 bg-primary/[0.03] p-4 md:p-5">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-sm font-bold">Acordă acces nou</p>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-full p-1 text-muted-foreground hover:bg-muted"
            >
              <X className="size-3.5" />
            </button>
          </div>

          {/* Course picker */}
          <div className="mb-3">
            <p className="mb-2 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
              Curs
            </p>
            <div className="grid gap-2 sm:grid-cols-3">
              {allCoursesMeta.map((c) => {
                const selected = courseSlug === c.slug;
                const alreadyGranted = grantedSlugs.has(c.slug);
                return (
                  <label
                    key={c.slug}
                    className={cn(
                      "flex cursor-pointer items-center gap-2.5 rounded-lg border p-2.5 transition-colors",
                      selected
                        ? "border-primary bg-primary/10"
                        : "border-border bg-background hover:border-foreground/30",
                    )}
                  >
                    <input
                      type="radio"
                      name="grantCourse"
                      checked={selected}
                      onChange={() => setCourseSlug(c.slug as CourseSlug)}
                      className="sr-only"
                    />
                    <CourseIcon slug={c.slug} src={c.icon} size={24} />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs font-semibold">
                        {c.title.split(" — ")[0]}
                      </p>
                      {alreadyGranted && (
                        <p className="text-[10px] text-warning">
                          va suprascrie accesul curent
                        </p>
                      )}
                    </div>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Duration */}
          <div className="mb-3">
            <p className="mb-2 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
              Durată
            </p>
            <div className="grid grid-cols-3 gap-2">
              {DURATIONS.map((d) => (
                <button
                  key={d.days}
                  type="button"
                  onClick={() => setDuration(d.days)}
                  className={cn(
                    "h-9 rounded-lg border px-3 text-xs font-semibold transition-colors",
                    duration === d.days
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-background hover:border-foreground/30",
                  )}
                >
                  {d.label}
                </button>
              ))}
            </div>
          </div>

          {/* Source */}
          <div className="mb-3">
            <p className="mb-2 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
              Sursa
            </p>
            <div className="grid gap-2 sm:grid-cols-3">
              {SOURCES.map((s) => (
                <button
                  key={s.value}
                  type="button"
                  onClick={() => setSource(s.value)}
                  className={cn(
                    "rounded-lg border p-2.5 text-left transition-colors",
                    source === s.value
                      ? "border-primary bg-primary/10"
                      : "border-border bg-background hover:border-foreground/30",
                  )}
                >
                  <p className="text-xs font-semibold">{s.label}</p>
                  <p className="text-[10px] text-muted-foreground">
                    {s.description}
                  </p>
                </button>
              ))}
            </div>
          </div>

          <input
            type="text"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Notiță opțională (vezi numai tu)"
            maxLength={200}
            className="mb-3 h-9 w-full rounded-lg border border-border bg-background px-3 text-xs outline-none focus:border-foreground/30"
          />

          <button
            type="button"
            onClick={handleGrant}
            disabled={isPending}
            className={cn(
              buttonVariants(),
              "h-10 w-full gap-1.5 text-sm font-semibold",
              isPending && "cursor-wait",
            )}
          >
            <Plus className="size-3.5" />
            {isPending ? "Se acordă..." : "Acordă acces"}
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className={cn(
            buttonVariants({ variant: "outline" }),
            "h-9 w-full gap-1.5 border-dashed text-xs font-semibold sm:w-auto",
          )}
        >
          <Plus className="size-3.5" />
          Acordă acces la un curs
        </button>
      )}
    </div>
  );
}

function RevokeRow({
  userId,
  access,
  onRevoked,
}: {
  userId: string;
  access: CurrentAccess;
  onRevoked: () => void;
}) {
  const [isPending, startTransition] = useTransition();
  const [confirming, setConfirming] = useState(false);

  const handleRevoke = () => {
    startTransition(async () => {
      const result = await revokeCourseAccessAction({
        userId,
        accessId: access.id,
      });
      if (result.ok) {
        toast.success("Acces revocat.");
        onRevoked();
      } else {
        toast.error(result.error);
      }
    });
  };

  return (
    <li className="flex items-center justify-between rounded-lg border border-border bg-card px-3 py-2.5 text-sm">
      <div className="min-w-0">
        <p className="truncate font-medium">{access.courseTitle}</p>
        <p className="font-mono text-[11px] text-muted-foreground">
          {access.source}
          {access.expiresAt
            ? ` · expiră ${formatDate(access.expiresAt)}`
            : " · pe viață"}
        </p>
      </div>
      {confirming ? (
        <div className="flex shrink-0 items-center gap-1.5">
          <button
            type="button"
            onClick={() => setConfirming(false)}
            className={cn(
              buttonVariants({ variant: "ghost", size: "sm" }),
              "h-8 px-2 text-[11px]",
            )}
          >
            Nu
          </button>
          <button
            type="button"
            onClick={handleRevoke}
            disabled={isPending}
            className={cn(
              buttonVariants({ variant: "destructive", size: "sm" }),
              "h-8 px-3 text-[11px]",
              isPending && "cursor-wait",
            )}
          >
            Confirmă
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setConfirming(true)}
          className="inline-flex size-7 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
          aria-label="Revocă"
        >
          <Trash2 className="size-3.5" />
        </button>
      )}
    </li>
  );
}

function formatDate(iso: string): string {
  return new Intl.DateTimeFormat("ro-MD", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(iso));
}
